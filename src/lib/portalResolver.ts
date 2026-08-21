import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type PortalType = 'CLASSROOM' | 'STAFF' | 'OFFICE' | 'ADMIN';

export interface PortalItem {
  id: PortalType;
  label: string;
  roleLabel: string;
  href: string;
}

export interface UserPortalResolution {
  isAuthenticated: boolean;
  user: any | null;
  member: any | null;
  primaryPortal: PortalItem;
  allowedPortals: PortalItem[];
  hasRole: (role: string) => boolean;
  canAccessPortal: (portal: PortalType) => boolean;
}

export async function resolveCurrentUserPortals(): Promise<UserPortalResolution> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return {
      isAuthenticated: false,
      user: null,
      member: null,
      primaryPortal: {
        id: 'CLASSROOM',
        label: 'Sign In',
        roleLabel: 'Visitor',
        href: '/auth/login'
      },
      allowedPortals: [],
      hasRole: () => false,
      canAccessPortal: () => false
    };
  }

  const userId = (session.user as any).id;
  const userMemberId = (session.user as any).memberId;
  const userRole = (session.user as any).role || 'MEMBER';

  // Fetch fresh user & member record from DB
  let dbUser = null;
  let dbMember = null;

  try {
    if (userId) {
      dbUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { member: { include: { department: true, country: true } } }
      });
      if (dbUser?.member) {
        dbMember = dbUser.member;
      }
    }

    if (!dbMember && userMemberId) {
      dbMember = await prisma.member.findUnique({
        where: { id: userMemberId },
        include: { department: true, country: true }
      });
    }
  } catch (e) {
    console.error("Error fetching user portal data:", e);
  }

  const allowedPortals: PortalItem[] = [];
  const activeRoles: string[] = [];

  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || dbUser?.role === 'SUPER_ADMIN' || dbUser?.role === 'ADMIN';
  const isLeader = dbMember?.isLeader === true || userRole === 'LEADER' || dbUser?.role === 'LEADER';
  const isAmbassador = dbMember?.poafId?.startsWith('POAF-AMB') || 
                       dbMember?.role?.toLowerCase().includes('ambassador') || 
                       userRole === 'AMBASSADOR' || 
                       dbUser?.role === 'AMBASSADOR';
  const isStudentMember = true; // All authenticated accounts have Student Member base access

  // 1. Student Member base access (Available to all authenticated pioneers)
  activeRoles.push('STUDENT_MEMBER');
  allowedPortals.push({
    id: 'CLASSROOM',
    label: 'Classroom',
    roleLabel: 'Student Member',
    href: '/classroom'
  });

  // 2. Department Leader access
  if (isLeader || isAdmin) {
    activeRoles.push('DEPARTMENT_LEADER');
    allowedPortals.push({
      id: 'STAFF',
      label: 'Staff',
      roleLabel: dbMember?.leaderPosition || (isAdmin ? 'Executive Administration' : 'Department Leader'),
      href: '/staff'
    });
  }

  // 3. National Ambassador access
  if (isAmbassador || isAdmin) {
    activeRoles.push('NATIONAL_AMBASSADOR');
    allowedPortals.push({
      id: 'OFFICE',
      label: 'Office',
      roleLabel: dbMember?.country ? `Ambassador of ${dbMember.country.name}` : 'National Diplomatic Office',
      href: '/office'
    });
  }

  // 4. Executive Administrator access (Access to all)
  if (isAdmin) {
    activeRoles.push('ADMIN');
    if (userRole === 'SUPER_ADMIN') activeRoles.push('SUPER_ADMIN');
    allowedPortals.push({
      id: 'ADMIN',
      label: 'Admin Portal',
      roleLabel: 'System Administrator',
      href: '/admin/dashboard'
    });
  }

  // Determine primary active portal: ADMIN > STAFF > OFFICE > CLASSROOM
  let primaryPortal: PortalItem = allowedPortals[0];
  if (isAdmin) {
    primaryPortal = allowedPortals.find(p => p.id === 'ADMIN') || primaryPortal;
  } else if (isLeader) {
    primaryPortal = allowedPortals.find(p => p.id === 'STAFF') || primaryPortal;
  } else if (isAmbassador) {
    primaryPortal = allowedPortals.find(p => p.id === 'OFFICE') || primaryPortal;
  }

  return {
    isAuthenticated: true,
    user: dbUser || session.user,
    member: dbMember,
    primaryPortal,
    allowedPortals,
    hasRole: (role: string) => activeRoles.includes(role),
    canAccessPortal: (portal: PortalType) => allowedPortals.some(p => p.id === portal)
  };
}

/**
 * Server-side guard for protecting routes and actions
 */
export async function requirePortalAccess(requiredPortal: PortalType) {
  const resolution = await resolveCurrentUserPortals();
  if (!resolution.isAuthenticated) {
    return { authorized: false, reason: 'UNAUTHENTICATED', resolution };
  }
  if (!resolution.canAccessPortal(requiredPortal)) {
    return { authorized: false, reason: 'FORBIDDEN', resolution };
  }
  return { authorized: true, reason: 'OK', resolution };
}
