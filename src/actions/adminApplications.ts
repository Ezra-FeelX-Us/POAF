"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generatePoafId } from "@/lib/idGenerator";

export async function processApplication(formData: FormData) {
  const id = formData.get("id") as string;
  const newStatus = formData.get("status") as string;
  const notes = formData.get("notes") as string;

  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) throw new Error("Application not found");

  // If status is ACCEPTED, we do auto-provisioning
  if (newStatus === "ACCEPTED" && app.status !== "ACCEPTED") {
    const payload = JSON.parse(app.payload || "{}");
    
    if (app.type === "MEMBERSHIP") {
      const poafId = await generatePoafId("MEM");
      
      const member = await prisma.member.create({
        data: {
          poafId,
          firstName: payload.firstName || payload.fullName?.split(" ")[0] || "New",
          lastName: payload.lastName || payload.fullName?.split(" ").slice(1).join(" ") || "Member",
          email: payload.email || undefined,
          role: "Member",
          status: "ACTIVE",
          countryId: payload.countryId || (await prisma.country.findFirst())?.id || "",
          photoUrl: app.photoUrl
        }
      });

      // Upgrade User Account Role if linked
      if (app.userId) {
        await prisma.user.update({
          where: { id: app.userId },
          data: { role: "MEMBER", memberId: member.id }
        });
      }
    }
    
    // Can expand for LEADERSHIP, CHAPTER, PARTNERSHIP logic here later.
  }

  // Record Audit Log
  // (Assuming we'd have the admin's session here, omitting for brevity or grabbing from getServerSession)

  await prisma.application.update({
    where: { id },
    data: { 
      status: newStatus,
      notes: notes || null
    }
  });

  revalidatePath("/admin/applications");
}

export async function deleteApplication(id: string) {
  await prisma.application.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
  revalidatePath("/admin/applications");
}
