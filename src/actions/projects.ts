"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createTask(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = formData.get("projectId") as string;
  const assigneeId = formData.get("assigneeId") as string;
  const priority = (formData.get("priority") as string) || "MEDIUM";

  await prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assigneeId: assigneeId || null,
      priority,
      status: "NOT_STARTED"
    }
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function updateTaskStatus(taskId: string, status: string, projectId: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status }
  });

  // Automatically update project progress
  const allTasks = await prisma.task.findMany({ where: { projectId } });
  if (allTasks.length > 0) {
    const completedTasks = allTasks.filter(t => t.status === "COMPLETED").length;
    const progressPct = Math.round((completedTasks / allTasks.length) * 100);
    
    await prisma.project.update({
      where: { id: projectId },
      data: { progressPct }
    });
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function createIssue(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user?.memberId) throw new Error("Must be a member");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = formData.get("projectId") as string;

  await prisma.issue.create({
    data: {
      title,
      description,
      projectId,
      reporterId: user.memberId,
      status: "OPEN"
    }
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function addProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const departmentId = formData.get("departmentId") as string;
  const status = (formData.get("status") as string) || "PROPOSED";

  await prisma.project.create({
    data: {
      title,
      description,
      departmentId,
      status,
      progressPct: 0
    }
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function updateProject(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const departmentId = formData.get("departmentId") as string;
  const status = (formData.get("status") as string) || "PROPOSED";

  await prisma.project.update({
    where: { id },
    data: {
      title,
      description,
      departmentId,
      status
    }
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function updateProjectStatus(id: string, status: string) {
  await prisma.project.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id }
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

