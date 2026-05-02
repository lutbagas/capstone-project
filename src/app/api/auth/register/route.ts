import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { RegisterBody } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json();
    const { name, email, password, role } = body;

    // validasi
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // cek email
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        passwd: hashedPassword,
        role,
      },
    });

    // create profile sesuai role
    if (role === "freelancer") {
      await prisma.freelancer_profiles.create({
        data: {
          users_idusers: user.idusers,
          profile_visibility: "public",
        },
      });
    }

    if (role === "client") {
      await prisma.client_profiles.create({
        data: {
          users_idusers: user.idusers,
        },
      });
    }

    return NextResponse.json({
      message: "Register berhasil",
      user: {
        id: user.idusers,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}