"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generatePoafId } from "@/lib/idGenerator";

export async function submitApplicationAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  const data = Object.fromEntries(formData.entries());
  const type = (data.applicationType as string) || "UNKNOWN";

  const file = formData.get("headshot") || formData.get("referencePhoto") || formData.get("logoPhoto");
  let photoName = null;
  if (file && typeof file === "object" && "name" in file && (file as any).size > 0) {
    photoName = (file as any).name;
  }

  for (const key in data) {
    if (data[key] instanceof File || (typeof data[key] === 'object' && data[key] !== null && 'size' in data[key])) {
      delete data[key];
    }
  }
  delete data.applicationType;

  // Generate unique POAF Application ID
  const poafId = await generatePoafId("APP");

  await prisma.application.create({
    data: {
      poafId,
      type: type.toUpperCase(),
      payload: JSON.stringify(data, null, 2),
      photoUrl: photoName,
      status: "SUBMITTED",
      userId: (session?.user as any)?.id || null
    }
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/dashboard");
  redirect("/apply?success=submitted");
}

export async function acceptApplicationAction(applicationId: string, notes?: string) {
  const session = await getServerSession(authOptions);
  const application = await prisma.application.findUnique({
    where: { id: applicationId }
  });

  if (!application) throw new Error("Application not found");
  if (application.status === "ACCEPTED") return;

  const payload = JSON.parse(application.payload || "{}");
  const type = application.type.toUpperCase();

  // 1. Resolve or Auto-Create Country (for dynamic Nations Represented counter)
  let countryRecord = null;
  const countryName = payload.country || payload.countryCity?.split(",")[0]?.trim() || "Pan-Africa";
  if (countryName) {
    countryRecord = await prisma.country.upsert({
      where: { name: countryName },
      update: {},
      create: { name: countryName, code: countryName.slice(0, 2).toUpperCase() }
    });
  }

  // 2. Resolve Department
  let departmentRecord = null;
  const deptName = payload.departmentInterest || payload.department;
  if (deptName) {
    departmentRecord = await prisma.department.findFirst({
      where: { name: { contains: deptName, mode: "insensitive" } }
    });
  }

  // 3. Process by Application Track
  if (type === "MEMBERSHIP") {
    const poafId = await generatePoafId("MEM");
    const nameParts = (payload.fullName || "Pioneer Member").trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Pioneer";

    let member = null;
    if (payload.email) {
      member = await prisma.member.findUnique({ where: { email: payload.email } });
    }

    if (member) {
      // Update existing without duplicate
      await prisma.member.update({
        where: { id: member.id },
        data: {
          status: "ACTIVE",
          departmentId: departmentRecord?.id || member.departmentId,
          bio: payload.bio || member.bio,
          skills: payload.skills || member.skills,
          photoUrl: application.photoUrl || member.photoUrl
        }
      });
    } else {
      // Create new official member profile
      member = await prisma.member.create({
        data: {
          poafId,
          firstName,
          lastName,
          email: payload.email || `${firstName.toLowerCase()}.${Date.now()}@poaf.org`,
          bio: payload.bio || payload.personalStatement || "Dedicated POAF youth pioneer.",
          skills: payload.skills,
          role: "Member",
          isLeader: false,
          status: "ACTIVE",
          countryId: countryRecord?.id || (await prisma.country.findFirst())!.id,
          departmentId: departmentRecord?.id || null,
          photoUrl: application.photoUrl || "/images/media_1787222340022.png",
          joinedDate: new Date()
        }
      });
    }

    // Link user account if applicable
    if (application.userId) {
      await prisma.user.update({
        where: { id: application.userId },
        data: { memberId: member.id }
      });
    }

  } else if (type === "LEADERSHIP") {
    const poafId = await generatePoafId("LDR");
    const nameParts = (payload.fullName || "Leadership Applicant").trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Leader";
    const position = payload.currentRole || "Department Leader";

    let member = null;
    if (payload.email) {
      member = await prisma.member.findUnique({ where: { email: payload.email } });
    }

    if (member) {
      await prisma.member.update({
        where: { id: member.id },
        data: {
          isLeader: true,
          role: "Department Leader",
          leaderPosition: position,
          status: "ACTIVE",
          bio: payload.experience || member.bio,
          photoUrl: application.photoUrl || member.photoUrl
        }
      });
    } else {
      member = await prisma.member.create({
        data: {
          poafId,
          firstName,
          lastName,
          email: payload.email || `${firstName.toLowerCase()}.${Date.now()}@poaf.org`,
          bio: payload.experience || "Appointed POAF organizational leader.",
          role: "Department Leader",
          leaderPosition: position,
          isLeader: true,
          leaderOrder: 20,
          status: "ACTIVE",
          countryId: countryRecord?.id || (await prisma.country.findFirst())!.id,
          departmentId: departmentRecord?.id || null,
          photoUrl: application.photoUrl || "/images/media_1787222340022.png",
          joinedDate: new Date()
        }
      });
    }

    // Update department leadership if vacant
    if (departmentRecord && !departmentRecord.leaderId) {
      await prisma.department.update({
        where: { id: departmentRecord.id },
        data: { leaderId: member.id }
      });
    }

  } else if (type === "PARTNERSHIP") {
    const poafId = await generatePoafId("PTN");
    await prisma.partnership.create({
      data: {
        poafId,
        organizationName: payload.organizationName || "Partner Organization",
        organizationType: payload.organizationType || "Strategic Partner",
        description: payload.whyPartner || "Official alliance partner.",
        website: payload.website || null,
        logoUrl: application.photoUrl || "/images/media_1787222340022.png",
        partnerSince: new Date()
      }
    });

  } else if (type === "CHAPTER" || type === "PROPOSAL") {
    const poafId = await generatePoafId("PRJ");
    const techDept = await prisma.department.findFirst({ where: { name: { contains: "Youth", mode: "insensitive" } } });
    await prisma.project.create({
      data: {
        poafId,
        title: payload.chapterName || payload.proposedChapterName || "New POAF Student Chapter",
        description: payload.chapterPurpose || payload.actionPlan || "Accredited youth chapter initiative.",
        status: "APPROVED",
        progressPct: 20,
        departmentId: departmentRecord?.id || techDept?.id || (await prisma.department.findFirst())!.id
      }
    });
  }

  // 4. Update Application Status to ACCEPTED
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: "ACCEPTED",
      notes: notes || "Application officially reviewed and accepted by Executive Admin."
    }
  });

  // 5. Activity Audit Log
  await prisma.activityLog.create({
    data: {
      action: "ACCEPT_APPLICATION",
      entityType: "APPLICATION",
      entityId: applicationId,
      details: `Accepted ${type} application for ${payload.fullName || payload.organizationName}`,
      userId: (session?.user as any)?.id || null
    }
  });

  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/departments");
  revalidatePath("/projects");
  revalidatePath("/admin/applications");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/members");
}

export async function rejectApplicationAction(applicationId: string, reason?: string) {
  const session = await getServerSession(authOptions);

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: "REJECTED",
      notes: reason || "Application declined by Executive Review Committee."
    }
  });

  await prisma.activityLog.create({
    data: {
      action: "REJECT_APPLICATION",
      entityType: "APPLICATION",
      entityId: applicationId,
      details: `Declined application ${applicationId}. Reason: ${reason || "Does not meet criteria"}`,
      userId: (session?.user as any)?.id || null
    }
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/dashboard");
}