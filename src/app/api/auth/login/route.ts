import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginBody } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body: LoginBody = await req.json();
    const { email, password } = body;

    // cari user
    const user = await prisma.users.findUnique({
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

    // generate JWT
    const token = jwt.sign(
      {
        id: user.idusers,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Login berhasil",
      token,
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