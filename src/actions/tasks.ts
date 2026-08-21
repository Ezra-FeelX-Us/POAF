"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generatePoafId } from "@/lib/idGenerator";

export async function createTaskAction(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const priority = (formData.get("priority") as string) || "MEDIUM";
  const deadlineStr = formData.get("deadline") as string;
  const departmentId = (formData.get("departmentId") as string) || undefined;
  const assigneeId = (formData.get("assigneeId") as string) || undefined;
  const giverName = (formData.get("giverName") as string) || "Department Leader";
  const giverRole = (formData.get("giverRole") as string) || "Leader & Task Giver";
  const maxPoints = parseInt(formData.get("maxPoints") as string, 10) || 100;

  if (!title) {
    throw new Error("Task title is required");
  }

  const poafId = await generatePoafId("TSK");
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  await prisma.task.create({
    data: {
      poafId,
      title,
      description,
      priority,
      deadline,
      departmentId,
      assigneeId,
      giverName,
      giverRole,
      maxPoints,
      status: "PENDING"
    }
  });

  revalidatePath("/portal/member");
  revalidatePath("/portal/department");
  revalidatePath("/admin/database");
  revalidatePath("/admin/dashboard");
}

export async function submitTaskWorkAction(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const submissionContent = (formData.get("submissionContent") as string)?.trim();
  const submissionLink = (formData.get("submissionLink") as string)?.trim();

  if (!taskId) {
    throw new Error("Task ID is required");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      submissionContent,
      submissionLink: submissionLink || undefined,
      submittedAt: new Date(),
      status: "SUBMITTED"
    }
  });

  revalidatePath("/portal/member");
  revalidatePath("/portal/department");
  revalidatePath("/admin/database");
}

export async function reviewAndGradeTaskAction(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const awardedGrade = parseInt(formData.get("awardedGrade") as string, 10);
  const gradeFeedback = (formData.get("gradeFeedback") as string)?.trim();
  const reviewerName = (formData.get("reviewerName") as string) || "Lead Reviewer";
  const decision = (formData.get("decision") as string) || "GRADED";

  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { assignee: true }
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const isApproved = decision === "GRADED";
  const finalStatus = isApproved ? "GRADED" : "REVISION_REQUESTED";

  await prisma.task.update({
    where: { id: taskId },
    data: {
      awardedGrade: isApproved ? awardedGrade : null,
      gradeFeedback,
      reviewedBy: reviewerName,
      reviewedAt: new Date(),
      status: finalStatus
    }
  });

  if (isApproved && task.assigneeId && awardedGrade) {
    try {
      const member = await prisma.member.findUnique({
        where: { id: task.assigneeId }
      });

      if (member) {
        const newTotalPoints = (member.totalPoints || 0) + awardedGrade;
        const newTasksCompleted = (member.tasksCompleted || 0) + 1;

        let newTier = "ACTIVE";
        if (newTotalPoints >= 300) newTier = "DISTINCTION";
        else if (newTotalPoints >= 150) newTier = "HONORS";
        else if (newTotalPoints >= 50) newTier = "COMMENDED";

        await prisma.member.update({
          where: { id: task.assigneeId },
          data: {
            totalPoints: newTotalPoints,
            tasksCompleted: newTasksCompleted,
            gradeTier: newTier
          }
        });
      }
    } catch (e) {
      console.warn("Member points update error:", e);
    }
  }

  revalidatePath("/portal/member");
  revalidatePath("/portal/department");
  revalidatePath("/admin/database");
  revalidatePath("/admin/dashboard");
}
