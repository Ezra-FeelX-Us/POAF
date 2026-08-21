import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        member: {
          include: {
            department: true,
            country: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || user.member?.photoUrl || "/images/media_1787222340022.png",
        member: user.member ? {
          id: user.member.id,
          poafId: user.member.poafId,
          firstName: user.member.firstName,
          lastName: user.member.lastName,
          phone: user.member.phone,
          bio: user.member.bio,
          school: user.member.school,
          department: user.member.department?.name,
          country: user.member.country?.name,
          role: user.member.role,
          leaderPosition: user.member.leaderPosition,
          isLeader: user.member.isLeader,
          ratingScore: (user.member as any).ratingScore || 85,
          ratingStrength: (user.member as any).ratingStrength || "Pioneer Problem Solver",
          ratingNotes: (user.member as any).ratingNotes || "Active contributor"
        } : null
      }
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, bio, school, photoUrl } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { member: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update User
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        image: photoUrl || user.image
      }
    });

    // Update linked Member if exists
    if (user.memberId) {
      const nameParts = (name || user.name || "").trim().split(" ");
      const firstName = nameParts[0] || user.member?.firstName || "Pioneer";
      const lastName = nameParts.slice(1).join(" ") || user.member?.lastName || "";

      await prisma.member.update({
        where: { id: user.memberId },
        data: {
          firstName,
          lastName,
          phone: phone !== undefined ? phone : user.member?.phone,
          bio: bio !== undefined ? bio : user.member?.bio,
          school: school !== undefined ? school : user.member?.school,
          photoUrl: photoUrl !== undefined ? photoUrl : user.member?.photoUrl
        }
      });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
