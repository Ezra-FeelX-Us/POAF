"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createEvent(formData: FormData) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as any;
  if (!sessionUser?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = new Date(formData.get("date") as string);
  const location = formData.get("location") as string;
  const departmentId = formData.get("departmentId") as string;

  // Find the member record for the logged-in user to set as organizer
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { member: true }
  });

  if (!user?.member) throw new Error("Only accepted members can create events");

  await prisma.event.create({
    data: {
      title,
      description,
      date,
      location,
      departmentId: departmentId || null,
      organizerId: user.member.id
    }
  });

  revalidatePath("/dashboard");
}

export async function rsvpToEvent(eventId: string, status: "ATTENDING" | "MAYBE" | "DECLINED") {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as any;
  if (!sessionUser?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { member: true }
  });

  if (!user?.member) throw new Error("Must be a member to RSVP");

  // Upsert RSVP
  await prisma.rSVP.upsert({
    where: {
      eventId_memberId: {
        eventId,
        memberId: user.member.id
      }
    },
    update: { status },
    create: {
      eventId,
      memberId: user.member.id,
      status
    }
  });

  revalidatePath("/dashboard");
}
