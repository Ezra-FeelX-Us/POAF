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
    const assignedRole = (formData.get("assignedRole") as string) || (app.type === "LEADERSHIP" ? "Department Leader" : "Member");
    const departmentId = (formData.get("departmentId") as string) || payload.departmentId || undefined;
    const isLeaderFlag = formData.get("isLeader") === "true" || assignedRole !== "Member" || app.type === "LEADERSHIP";
    
    if (app.type === "MEMBERSHIP" || app.type === "LEADERSHIP") {
      const prefix = isLeaderFlag ? "LDR" : "MEM";
      const poafId = await generatePoafId(prefix);
      
      const member = await prisma.member.create({
        data: {
          poafId,
          firstName: payload.firstName || payload.fullName?.split(" ")[0] || "New",
          lastName: payload.lastName || payload.fullName?.split(" ").slice(1).join(" ") || "Pioneer",
          email: payload.email || undefined,
          role: assignedRole,
          isLeader: isLeaderFlag,
          leaderPosition: payload.position || (isLeaderFlag ? assignedRole : undefined),
          departmentId: departmentId || undefined,
          status: "ACTIVE",
          countryId: payload.countryId || (await prisma.country.findFirst())?.id || "",
          photoUrl: app.photoUrl || payload.photoUrl || undefined
        }
      });

      // Upgrade User Account Role if linked
      if (app.userId) {
        await prisma.user.update({
          where: { id: app.userId },
          data: { 
            role: isLeaderFlag ? "LEADER" : "MEMBER", 
            memberId: member.id 
          }
        });
      }
    } else if (app.type === "PROPOSAL" || app.type === "CHAPTER" || app.type === "PROJECT") {
      const poafId = await generatePoafId("PRJ");
      const firstDept = await prisma.department.findFirst();
      await prisma.project.create({
        data: {
          poafId,
          title: payload.title || payload.projectName || "New Continental Initiative",
          description: payload.description || payload.summary || "Approved Pioneer Initiative",
          status: "APPROVED",
          category: payload.category || "Community Impact",
          departmentId: departmentId || firstDept?.id || "",
          country: payload.country || payload.countryName || undefined
        }
      });
    } else if (app.type === "PARTNERSHIP") {
      await prisma.partnership.create({
        data: {
          organizationName: payload.organizationName || payload.orgName || payload.fullName || "Official Partner",
          organizationType: payload.partnerType || payload.organizationType || "Institutional Partner",
          website: payload.website || undefined
        }
      });
    }
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
