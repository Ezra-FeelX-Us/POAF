"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendChatMessage(formData: FormData) {
  const channel = (formData.get("channel") as string) || "GENERAL";
  const senderName = (formData.get("senderName") as string) || "Pioneer Member";
  const senderRole = (formData.get("senderRole") as string) || "Member";
  const senderPhoto = (formData.get("senderPhoto") as string) || "/images/media_1787222340022.png";
  const senderPoafId = (formData.get("senderPoafId") as string) || undefined;
  const content = formData.get("content") as string;

  if (!content || !content.trim()) return;

  await prisma.chatMessage.create({
    data: {
      channel,
      senderName,
      senderRole,
      senderPhoto,
      senderPoafId,
      content: content.trim()
    }
  });

  revalidatePath("/portal/member");
  revalidatePath("/portal/department");
  revalidatePath("/portal/ambassador");
}

export async function createDepartmentAnnouncement(formData: FormData) {
  const departmentId = formData.get("departmentId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorName = (formData.get("authorName") as string) || "Department Leader";
  const authorRole = (formData.get("authorRole") as string) || "Leader";

  if (!departmentId || !title || !content) return;

  await prisma.departmentAnnouncement.create({
    data: {
      departmentId,
      title,
      content,
      authorName,
      authorRole
    }
  });

  revalidatePath("/portal/department");
  revalidatePath("/departments/" + departmentId);
}
