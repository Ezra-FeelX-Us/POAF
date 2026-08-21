"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function addDepartment(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  await prisma.department.create({
    data: { name, description }
  });
  revalidatePath("/admin/departments"); 
  revalidatePath("/departments"); 
  revalidatePath("/");
}

export async function updateDepartment(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  await prisma.department.update({
    where: { id },
    data: { name, description }
  });
  revalidatePath("/admin/departments"); 
  revalidatePath("/departments"); 
  revalidatePath("/");
  redirect("/admin/departments");
}

export async function deleteDepartment(id: string) {
  await prisma.department.delete({ where: { id } });
  revalidatePath("/admin/departments"); 
  revalidatePath("/departments"); 
  revalidatePath("/");
}

// Direct Admin Provisioning of Department Leader with Manual ID & Password/PIN
export async function appointDepartmentLeaderAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const departmentId = formData.get("departmentId") as string;
  const poafId = (formData.get("poafId") as string)?.trim() || `POAF-LDR-${Math.floor(1000 + Math.random() * 9000)}`;
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim() || "password123";
  const bio = (formData.get("bio") as string)?.trim() || "Official Department Leader appointed by POAF Executive Administration.";
  const photoUrl = (formData.get("photoUrl") as string)?.trim() || "/images/media_1787222340022.png";

  if (!departmentId || !name || !email) {
    throw new Error("Department, name, and email are required");
  }

  // Get first country for assignment
  const defaultCountry = await prisma.country.findFirst();
  const countryId = defaultCountry?.id || "ethiopia-cuid";

  const hashedPassword = await bcrypt.hash(password, 10);
  const nameParts = name.split(" ");
  const firstName = nameParts[0] || "Leader";
  const lastName = nameParts.slice(1).join(" ") || "";

  // 1. Check if Member exists
  let member = await prisma.member.findUnique({ where: { email } });
  if (member) {
    member = await prisma.member.update({
      where: { id: member.id },
      data: {
        poafId,
        firstName,
        lastName,
        role: "Department Leader",
        leaderPosition: "Department Leader",
        isLeader: true,
        departmentId,
        bio,
        photoUrl,
        status: "ACTIVE",
        roles: "MEMBER,DEPARTMENT_LEADER"
      }
    });
  } else {
    member = await prisma.member.create({
      data: {
        poafId,
        firstName,
        lastName,
        email,
        role: "Department Leader",
        leaderPosition: "Department Leader",
        isLeader: true,
        countryId,
        departmentId,
        bio,
        photoUrl,
        status: "ACTIVE",
        roles: "MEMBER,DEPARTMENT_LEADER",
        joinedDate: new Date()
      }
    });
  }

  // 2. Check if User exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name,
        role: "DEPARTMENT_LEADER",
        memberId: member.id,
        image: photoUrl
      }
    });
  } else {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DEPARTMENT_LEADER",
        memberId: member.id,
        image: photoUrl
      }
    });
  }

  // 3. Connect department leader
  await prisma.department.update({
    where: { id: departmentId },
    data: { leaderId: member.id }
  });

  try {
    await prisma.activityLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "APPOINT_DEPARTMENT_LEADER",
        entityType: "DEPARTMENT",
        entityId: departmentId,
        details: `Appointed ${name} (${poafId}) as Department Leader with custom ID.`
      }
    });
  } catch (e) {}

  revalidatePath("/admin/departments");
  revalidatePath("/departments");
  revalidatePath("/leadership");
  revalidatePath("/staff");
}