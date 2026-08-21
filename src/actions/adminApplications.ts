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

  // If status is ACCEPTED, we do full explicit provisioning with no assumed defaults
  if (newStatus === "ACCEPTED" && app.status !== "ACCEPTED") {
    const payload = JSON.parse(app.payload || "{}");
    
    // Explicit Admin-provided values (Admin fills or overrides everything)
    const firstName = (formData.get("firstName") as string) || payload.firstName || payload.fullName?.split(" ")[0] || "";
    const lastName = (formData.get("lastName") as string) || payload.lastName || payload.fullName?.split(" ").slice(1).join(" ") || "";
    const email = (formData.get("email") as string) || payload.email || undefined;
    const phone = (formData.get("phone") as string) || payload.phone || undefined;
    const customPoafId = (formData.get("poafId") as string) || await generatePoafId(formData.get("assignedRole")?.toString().includes("Leader") ? "LDR" : "MEM");
    const assignedRole = (formData.get("assignedRole") as string) || "Member";
    const leaderPosition = (formData.get("leaderPosition") as string) || undefined;
    const departmentId = (formData.get("departmentId") as string) || undefined;
    const countryId = (formData.get("countryId") as string) || payload.countryId || (await prisma.country.findFirst())?.id || "";
    const photoUrl = (formData.get("photoUrl") as string) || app.photoUrl || payload.photoUrl || undefined;
    const bio = (formData.get("bio") as string) || payload.bio || payload.statement || undefined;
    const skills = (formData.get("skills") as string) || payload.skills || undefined;
    const customInviteCode = (formData.get("inviteCode") as string) || customPoafId.replace("POAF-", "");
    
    // Explicit Display destinations chosen by Admin
    const displayOnMembersBoard = formData.get("displayOnMembersBoard") === "true";
    const displayOnLeadershipBoard = formData.get("displayOnLeadershipBoard") === "true";
    const displayOnHomepage = formData.get("displayOnHomepage") === "true";
    const displayOnDepartmentRoster = formData.get("displayOnDepartmentRoster") === "true";
    const isLeader = displayOnLeadershipBoard || assignedRole !== "Member";
    const invitedBy = payload.invitedBy || payload.ref || (formData.get("invitedBy") as string) || undefined;

    // Resolve or Auto-Create Country
    let resolvedCountryId = countryId;
    const countryName = (formData.get("countryName") as string) || payload.country || payload.countryName || payload.countryCity?.split(",")[0]?.trim();
    if (countryName) {
      try {
        const c = await prisma.country.upsert({
          where: { name: countryName },
          update: {},
          create: { name: countryName, code: countryName.slice(0, 2).toUpperCase() }
        });
        resolvedCountryId = c.id;
      } catch (cErr) {
        console.warn("Country upsert notice:", cErr);
      }
    }

    if (!resolvedCountryId) {
      resolvedCountryId = (await prisma.country.findFirst())?.id || "";
    }

    const isMemberLike = [
      "MEMBERSHIP", "LEADERSHIP", "AMBASSADOR", "EXECUTIVE", "DEPARTMENT_LEADER", "AWARD"
    ].includes(app.type.toUpperCase());

    if (isMemberLike) {
      const member = await prisma.member.create({
        data: {
          poafId: customPoafId,
          firstName,
          lastName,
          email,
          phone,
          role: assignedRole,
          leaderPosition,
          isLeader,
          departmentId: departmentId || undefined,
          countryId: resolvedCountryId,
          photoUrl,
          bio,
          skills,
          inviteCode: customInviteCode,
          invitedBy,
          displayOnMembersBoard,
          displayOnLeadershipBoard,
          displayOnHomepage,
          displayOnDepartmentRoster,
          status: "ACTIVE"
        }
      });

      // Track referral counter: If applicant was invited, increment the inviter's inviteCount
      if (invitedBy) {
        try {
          await prisma.member.updateMany({
            where: {
              OR: [
                { inviteCode: invitedBy },
                { poafId: invitedBy },
                { email: invitedBy }
              ]
            },
            data: { inviteCount: { increment: 1 } }
          });
        } catch (refErr) {
          console.warn("Referral count increment note:", refErr);
        }
      }

      // Upgrade linked User account
      if (app.userId) {
        await prisma.user.update({
          where: { id: app.userId },
          data: { 
            role: isLeader ? "LEADER" : "MEMBER", 
            memberId: member.id 
          }
        });
      }
    } else if (app.type === "PROPOSAL" || app.type === "CHAPTER" || app.type === "PROJECT" || app.type === "COMPETITION") {
      const projectTitle = (formData.get("projectTitle") as string) || payload.title || payload.projectName || payload.chapterName || "New Initiative";
      const projectCategory = (formData.get("projectCategory") as string) || payload.category || (app.type === "CHAPTER" ? "Campus Chapter" : "Community Impact");
      const projectDesc = (formData.get("projectDesc") as string) || payload.description || payload.summary || payload.charterPlan || "Approved Initiative";
      const projectPoafId = (formData.get("projectPoafId") as string) || await generatePoafId("PRJ");
      const firstDept = await prisma.department.findFirst();

      await prisma.project.create({
        data: {
          poafId: projectPoafId,
          title: projectTitle,
          description: projectDesc,
          status: "APPROVED",
          category: projectCategory,
          departmentId: departmentId || firstDept?.id || "",
          country: payload.country || payload.countryName || undefined
        }
      });
    } else if (app.type === "PARTNERSHIP") {
      const orgName = (formData.get("orgName") as string) || payload.organizationName || payload.orgName || payload.fullName || "Official Partner";
      const orgType = (formData.get("orgType") as string) || payload.partnerType || payload.organizationType || "Institutional Partner";
      const website = (formData.get("website") as string) || payload.website || undefined;
      const collaboration = (formData.get("collaboration") as string) || payload.whyPartner || payload.objectives || undefined;

      await prisma.partnership.create({
        data: {
          organizationName: orgName,
          organizationType: orgType,
          website,
          collaborationAreas: collaboration
        }
      });
    }
  }

  // Record Audit Log
  try {
    await prisma.activityLog.create({
      data: {
        action: `PROCESS_APPLICATION_${newStatus}`,
        entityType: "APPLICATION",
        entityId: id,
        details: `Application ${app.poafId || id} processed to status: ${newStatus}. Notes: ${notes || "None"}`
      }
    });
  } catch (logErr) {
    console.warn("Audit log notice:", logErr);
  }

  await prisma.application.update({
    where: { id },
    data: { 
      status: newStatus,
      notes: notes || null
    }
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/members");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/database");
  revalidatePath("/members");
  revalidatePath("/leadership");
  revalidatePath("/departments");
  revalidatePath("/nations");
  revalidatePath("/partners");
  revalidatePath("/");
}

export async function deleteApplication(id: string) {
  await prisma.application.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
  revalidatePath("/admin/applications");
}
