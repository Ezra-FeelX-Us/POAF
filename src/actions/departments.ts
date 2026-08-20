"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addDepartment(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  await prisma.department.create({
    data: { name, description }
  });
  revalidatePath("/admin/departments"); revalidatePath("/departments"); revalidatePath("/");
}

export async function updateDepartment(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  await prisma.department.update({
    where: { id },
    data: { name, description }
  });
  revalidatePath("/admin/departments"); revalidatePath("/departments"); revalidatePath("/");
  redirect("/admin/departments");
}

export async function deleteDepartment(id: string) {
  await prisma.department.delete({ where: { id } });
  revalidatePath("/admin/departments"); revalidatePath("/departments"); revalidatePath("/");
}