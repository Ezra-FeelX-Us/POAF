"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generatePoafId } from "@/lib/idGenerator";

// 1. Admin Direct Member Creation
export async function addMember(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const role = (formData.get("role") as string) || "Member";
  const email = (formData.get("email") as string) || null;
  const countryId = formData.get("countryId") as string;
  const phone = (formData.get("phone") as string) || null;
  const school = (formData.get("school") as string) || null;
  const gradeLevel = (formData.get("gradeLevel") as string) || null;
  
  const displayOnMembersBoard = formData.get("displayOnMembersBoard") === "on" || formData.get("displayOnMembersBoard") === "true";
  const displayOnLeadershipBoard = formData.get("displayOnLeadershipBoard") === "on" || formData.get("displayOnLeadershipBoard") === "true";
  const displayOnHomepage = formData.get("displayOnHomepage") === "on" || formData.get("displayOnHomepage") === "true";
  const displayOnDepartmentRoster = formData.get("displayOnDepartmentRoster") === "on" || formData.get("displayOnDepartmentRoster") === "true";
  const isLeader = displayOnLeadershipBoard || role !== "Member";

  const leaderPosition = (formData.get("leaderPosition") as string) || null;
  const leaderOrder = formData.get("leaderOrder") ? parseInt(formData.get("leaderOrder") as string, 10) : null;
  const departmentId = (formData.get("departmentId") as string) || null;
  const photoUrl = (formData.get("photoUrl") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const skills = (formData.get("skills") as string) || null;
  
  let poafId = formData.get("poafId") as string;
  if (!poafId) {
    poafId = await generatePoafId(isLeader ? "LDR" : "MEM");
  }

  const customInviteCode = (formData.get("inviteCode") as string) || poafId.replace("POAF-", "");
  const initialRoles = isLeader ? `MEMBER,${role.toUpperCase().replace(/\s+/g, "_")}` : "MEMBER";
  
  await prisma.member.create({
    data: { 
      poafId,
      firstName, 
      lastName, 
      email: email || `${firstName.toLowerCase()}.${Date.now()}@poaf.org`, 
      role,
      roles: initialRoles,
      membershipSource: "ADMIN_CREATED",
      phone,
      school,
      gradeLevel,
      skills,
      countryId, 
      status: "ACTIVE",
      isLeader,
      leaderPosition: isLeader ? leaderPosition : null,
      leaderOrder: isLeader ? (leaderOrder || 30) : null,
      departmentId,
      photoUrl: photoUrl || "/images/media_1787222340022.png",
      bio,
      leaderBio: isLeader ? bio : null,
      inviteCode: customInviteCode,
      displayOnMembersBoard,
      displayOnLeadershipBoard,
      displayOnHomepage,
      displayOnDepartmentRoster,
      joinedDate: new Date()
    }
  });

  // Audit Log
  await prisma.activityLog.create({
    data: {
      action: "ADMIN_CREATE_MEMBER",
      entityType: "MEMBER",
      details: `Directly created member: ${firstName} ${lastName} (${poafId}) with source ADMIN_CREATED`
    }
  });
  
  revalidatePath("/admin/members"); 
  revalidatePath("/admin/ambassadors");
  revalidatePath("/admin/executives");
  revalidatePath("/members"); 
  revalidatePath("/leadership");
  revalidatePath("/departments");
  revalidatePath("/nations");
  revalidatePath("/");
}

// 2. Admin Appoint / Add Leadership Role to Existing Member
export async function appointLeaderAction(formData: FormData) {
  const memberId = formData.get("memberId") as string;
  const positionTitle = formData.get("positionTitle") as string; // e.g. "Department Leader", "National Ambassador", "Department Manager", "Student Leader", "Secretary", "Assistant"
  const departmentId = (formData.get("departmentId") as string) || null;
  const countryId = (formData.get("countryId") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const photoUrl = (formData.get("photoUrl") as string) || null;

  const existing = await prisma.member.findUnique({ where: { id: memberId } });
  if (!existing) throw new Error("Member not found");

  const normalizedRole = positionTitle.toUpperCase().replace(/\s+/g, "_");
  const existingRolesList = (existing.roles || "MEMBER").split(",").map(r => r.trim());
  if (!existingRolesList.includes(normalizedRole)) {
    existingRolesList.push(normalizedRole);
  }

  await prisma.member.update({
    where: { id: memberId },
    data: {
      isLeader: true,
      role: positionTitle,
      roles: existingRolesList.join(","),
      leaderPosition: positionTitle,
      departmentId: departmentId || existing.departmentId,
      countryId: countryId || existing.countryId,
      bio: bio || existing.bio,
      photoUrl: photoUrl || existing.photoUrl,
      displayOnLeadershipBoard: true
    }
  });

  // If department head, update department leaderId
  if (departmentId && positionTitle.toLowerCase().includes("leader")) {
    await prisma.department.update({
      where: { id: departmentId },
      data: { leaderId: memberId }
    });
  }

  // Audit Log
  await prisma.activityLog.create({
    data: {
      action: "APPOINT_LEADER",
      entityType: "MEMBER",
      entityId: memberId,
      details: `Appointed ${existing.firstName} ${existing.lastName} as ${positionTitle}. Existing roles retained: [${existingRolesList.join(", ")}]`
    }
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin/dashboard");
  revalidatePath("/members");
  revalidatePath("/leadership");
  revalidatePath("/departments");
  revalidatePath("/nations");
  revalidatePath("/");
}

// 3. End / Deactivate Specific Leadership Role
export async function endRoleAction(memberId: string, roleToEnd: string) {
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) return;

  const normalizedRole = roleToEnd.toUpperCase().replace(/\s+/g, "_");
  let rolesList = (member.roles || "MEMBER").split(",").map(r => r.trim());
  rolesList = rolesList.filter(r => r !== normalizedRole);
  if (rolesList.length === 0) rolesList = ["MEMBER"];

  const hasRemainingLeaderRole = rolesList.some(r => r !== "MEMBER");

  await prisma.member.update({
    where: { id: memberId },
    data: {
      roles: rolesList.join(","),
      isLeader: hasRemainingLeaderRole,
      role: hasRemainingLeaderRole ? rolesList[rolesList.length - 1] : "Member",
      displayOnLeadershipBoard: hasRemainingLeaderRole
    }
  });

  // Audit Log
  await prisma.activityLog.create({
    data: {
      action: "END_ROLE",
      entityType: "MEMBER",
      entityId: memberId,
      details: `Ended role ${roleToEnd} for ${member.firstName} ${member.lastName}. Active roles remaining: [${rolesList.join(", ")}]`
    }
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin/dashboard");
  revalidatePath("/members");
  revalidatePath("/leadership");
  revalidatePath("/departments");
  revalidatePath("/");
}

export async function updateMember(formData: FormData) {
  const id = formData.get("id") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const role = formData.get("role") as string;
  const email = (formData.get("email") as string) || null;
  const countryId = formData.get("countryId") as string;
  
  const displayOnMembersBoard = formData.get("displayOnMembersBoard") === "on" || formData.get("displayOnMembersBoard") === "true";
  const displayOnLeadershipBoard = formData.get("displayOnLeadershipBoard") === "on" || formData.get("displayOnLeadershipBoard") === "true";
  const displayOnHomepage = formData.get("displayOnHomepage") === "on" || formData.get("displayOnHomepage") === "true";
  const displayOnDepartmentRoster = formData.get("displayOnDepartmentRoster") === "on" || formData.get("displayOnDepartmentRoster") === "true";
  const isLeader = displayOnLeadershipBoard || role !== "Member";

  const leaderPosition = (formData.get("leaderPosition") as string) || null;
  const leaderOrder = formData.get("leaderOrder") ? parseInt(formData.get("leaderOrder") as string, 10) : null;
  const departmentId = (formData.get("departmentId") as string) || null;
  const photoUrl = (formData.get("photoUrl") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const skills = (formData.get("skills") as string) || null;
  const poafId = (formData.get("poafId") as string) || undefined;
  const inviteCode = (formData.get("inviteCode") as string) || undefined;
  
  await prisma.member.update({
    where: { id },
    data: { 
      poafId,
      firstName, 
      lastName, 
      email: email || undefined, 
      role, 
      countryId,
      isLeader,
      leaderPosition: isLeader ? leaderPosition : null,
      leaderOrder,
      departmentId,
      photoUrl,
      bio,
      skills,
      inviteCode,
      displayOnMembersBoard,
      displayOnLeadershipBoard,
      displayOnHomepage,
      displayOnDepartmentRoster,
      leaderBio: isLeader ? bio : null
    }
  });
  
  revalidatePath("/admin/members"); 
  revalidatePath("/admin/ambassadors");
  revalidatePath("/admin/executives");
  revalidatePath("/members"); 
  revalidatePath("/leadership");
  revalidatePath("/departments");
  revalidatePath("/nations");
  revalidatePath("/");
  redirect("/admin/members");
}

export async function deleteMember(id: string) {
  try {
    await prisma.member.delete({ where: { id } });
  } catch (err) {
    console.error("Delete member error:", err);
  }
  revalidatePath("/admin/members"); 
  revalidatePath("/admin/ambassadors");
  revalidatePath("/admin/executives");
  revalidatePath("/members"); 
  revalidatePath("/leadership");
  revalidatePath("/departments");
  revalidatePath("/");
}