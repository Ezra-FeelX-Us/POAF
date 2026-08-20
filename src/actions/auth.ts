"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "Missing fields" };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already in use" };

  const hashedPassword = await bcrypt.hash(password, 10);

  // If this is the very first user, make them SUPER_ADMIN
  const count = await prisma.user.count();
  const role = count === 0 ? "SUPER_ADMIN" : "USER";

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role }
  });

  return { success: true };
}
