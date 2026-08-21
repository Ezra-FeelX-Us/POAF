import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, departmentName, countryName, phone, age, school, bio } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Resolve Department
    let department = null;
    if (departmentName) {
      department = await prisma.department.findFirst({
        where: { name: { contains: departmentName, mode: "insensitive" } }
      });
    }

    if (!department) {
      department = await prisma.department.findFirst({
        where: { deletedAt: null }
      });
    }

    // Resolve Country
    let country = null;
    if (countryName) {
      country = await prisma.country.findFirst({
        where: { name: { contains: countryName, mode: "insensitive" } }
      });
    }

    if (!country) {
      country = await prisma.country.findFirst();
    }

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "Pioneer";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Generate Application Number
    const appRandom = Math.floor(1000 + Math.random() * 9000);
    const poafId = `POAF-MEM-${appRandom}`;
    const fallbackCountryId = country?.id || "ethiopia-id";

    // Create Member
    const member = await prisma.member.create({
      data: {
        poafId,
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        phone: phone || "",
        school: school || "",
        bio: bio || `Pioneer member applicant for ${department?.name || 'General Division'}.`,
        role: "Member",
        roles: "MEMBER",
        status: "ACTIVE", // Verified active member upon registration
        departmentId: department?.id || undefined,
        countryId: fallbackCountryId,
        photoUrl: "/images/media_1787222340022.png",
        joinedDate: new Date()
      }
    });

    // Create User linked to Member
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "MEMBER",
        memberId: member.id,
        image: "/images/media_1787222340022.png"
      }
    });

    // Record Application routed directly to department
    await prisma.application.create({
      data: {
        type: "MEMBERSHIP",
        status: "ACCEPTED",
        userId: user.id,
        payload: JSON.stringify({
          fullName: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone || "",
          age: age || 20,
          school: school || "",
          departmentName: department?.name,
          countryName: country?.name,
          registeredAt: new Date()
        })
      }
    });

    // Audit Log
    try {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "MEMBER_REGISTRATION",
          entityType: "MEMBER",
          entityId: member.poafId || member.id,
          details: `Pioneer ${name} registered into division: ${department?.name || 'General'}.`
        }
      });
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "Pioneer account created successfully!",
      poafId: member.poafId
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
