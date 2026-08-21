"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// 1. Promote / Shift Member Role within Department
export async function promoteMemberAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const memberId = formData.get("memberId") as string;
  const newRole = formData.get("newRole") as string; // ASSISTANT | SECRETARY | STUDENT_LEADER | MANAGER

  if (!memberId || !newRole) {
    throw new Error("Member ID and new role are required");
  }

  const roleTitleMap: Record<string, string> = {
    ASSISTANT: "Department Assistant",
    SECRETARY: "Department Secretary",
    STUDENT_LEADER: "Department Student Leader",
    MANAGER: "Department Manager"
  };

  const leaderPosition = roleTitleMap[newRole] || newRole;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      role: leaderPosition,
      leaderPosition,
      isLeader: true,
      roles: `MEMBER,DEPARTMENT_LEADER`
    }
  });

  try {
    await prisma.activityLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "PIONEER_PROMOTION",
        entityType: "MEMBER",
        entityId: memberId,
        details: `Pioneer promoted to ${leaderPosition} in division.`
      }
    });
  } catch (e) {}

  revalidatePath("/staff");
  revalidatePath("/departments");
  revalidatePath("/leadership");
}

// 2. Student Leader: Rate Student (1-100) & Strength Badge
export async function rateStudentAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const memberId = formData.get("memberId") as string;
  const score = parseInt(formData.get("score") as string || "85", 10);
  const strength = formData.get("strength") as string || "Pioneer Problem Solver";
  const notes = formData.get("notes") as string || "Active contribution in team initiatives";

  if (!memberId) throw new Error("Member ID is required");

  // Update Member record with performance score
  await prisma.member.update({
    where: { id: memberId },
    data: {
      totalPoints: score * 10,
      skills: strength,
      bio: notes ? `${notes}` : undefined
    }
  });

  try {
    await prisma.activityLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "STUDENT_RATING",
        entityType: "MEMBER",
        entityId: memberId,
        details: `Rated student performance ${score}/100 with badge: ${strength}.`
      }
    });
  } catch (e) {}

  revalidatePath("/staff");
  revalidatePath("/classroom");
}

// 3. Department Manager: GitHub-style Project Create & Update
export async function saveProjectAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const departmentId = formData.get("departmentId") as string;
  const progressPct = parseInt(formData.get("progressPct") as string || "0", 10);
  const status = (formData.get("status") as string || "ONGOING").toUpperCase();

  if (!title || !departmentId) {
    throw new Error("Title and department are required");
  }

  if (projectId && projectId !== "new") {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        progressPct,
        status
      }
    });
  } else {
    const randomPrj = Math.floor(100 + Math.random() * 900);
    await prisma.project.create({
      data: {
        poafId: `POAF-PRJ-2026-${randomPrj}`,
        title,
        description,
        progressPct,
        status,
        departmentId
      }
    });
  }

  try {
    await prisma.activityLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "PROJECT_UPDATE",
        entityType: "PROJECT",
        entityId: title,
        details: `Project "${title}" updated to ${progressPct}% progress (${status}).`
      }
    });
  } catch (e) {}

  revalidatePath("/staff");
  revalidatePath("/projects");
  revalidatePath("/classroom");
}

// 4. Department Manager: Review & Grade Deliverables
export async function reviewDeliverableAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const taskId = formData.get("taskId") as string;
  const feedback = formData.get("feedback") as string || "Reviewed and approved.";
  const gradeStr = formData.get("grade") as string || "90";
  const awardedGrade = parseInt(gradeStr, 10) || 90;

  if (!taskId) throw new Error("Task ID required");

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: "GRADED",
      awardedGrade,
      gradeFeedback: feedback,
      reviewedBy: session?.user?.name || "Department Manager",
      reviewedAt: new Date()
    }
  });

  try {
    await prisma.activityLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "DELIVERABLE_REVIEW",
        entityType: "TASK",
        entityId: taskId,
        details: `Evaluated deliverable with Score ${awardedGrade}: ${feedback}`
      }
    });
  } catch (e) {}

  revalidatePath("/staff");
  revalidatePath("/classroom");
}

// 5. Department Secretary: Meeting Minutes & Public Announcement
export async function recordMinutesAndAnnouncementAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const departmentId = formData.get("departmentId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content || !departmentId) {
    throw new Error("Title, content, and department are required");
  }

  await prisma.departmentAnnouncement.create({
    data: {
      departmentId,
      title,
      content,
      authorName: session?.user?.name || "Department Secretary",
      authorRole: "Secretary"
    }
  });

  try {
    await prisma.activityLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "DEPARTMENT_ANNOUNCEMENT",
        entityType: "ANNOUNCEMENT",
        entityId: title,
        details: `Secretary published notice: "${title}"`
      }
    });
  } catch (e) {}

  revalidatePath("/staff");
  revalidatePath("/departments");
  revalidatePath("/");
}
