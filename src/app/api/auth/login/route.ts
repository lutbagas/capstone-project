import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginBody } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body: LoginBody = await req.json();
    const { email, password } = body;

    // cek input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // ✅ FIX: prisma.user (bukan users)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek password
    const isValid = await bcrypt.compare(password, user.passwd);

    if (!isValid) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    // cek JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET belum diset di .env");
    }

    // ✅ FIX: id pakai user.id (bukan idusers)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
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