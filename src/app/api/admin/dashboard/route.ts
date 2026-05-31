import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

type JwtPayload = {
  id: number;
  role: "admin" | "freelancer" | "client";
};

type DashboardUpdateBody = {
  email?: string;
  name?: string;
  title?: string;
  bio?: string;
  skills?: string;
  phone?: string;
  visibility?: "public" | "limited";
  password?: string;
};

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() || "";
}

function nullableText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return false;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET belum diset di .env");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    return payload.role === "admin";
  } catch {
    return false;
  }
}

async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      freelancerProfile: {
        select: {
          id: true,
          title: true,
          bio: true,
          skills: true,
          phone: true,
          visibility: true,
          updatedAt: true,
        },
      },
    },
  });
}

export async function GET(req: Request) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { error: "Akses dashboard admin wajib login dengan akun admin" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = normalizeEmail(searchParams.get("email"));

    if (!email) {
      return NextResponse.json(
        { error: "Email pengguna wajib diisi" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Pengguna dengan email tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("ADMIN DASHBOARD GET ERROR:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data dashboard pengguna" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { error: "Akses dashboard admin wajib login dengan akun admin" },
        { status: 403 }
      );
    }

    const body: DashboardUpdateBody = await req.json();
    const email = normalizeEmail(body.email);

    if (!email) {
      return NextResponse.json(
        { error: "Email pengguna wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Pengguna dengan email tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    const userUpdateData: { name?: string | null; passwd?: string } = {};

    if (body.name !== undefined) {
      userUpdateData.name = nullableText(body.name);
    }

    if (body.password !== undefined && body.password.trim()) {
      if (body.password.trim().length < 6) {
        return NextResponse.json(
          { error: "Password minimal 6 karakter" },
          { status: 400 }
        );
      }

      userUpdateData.passwd = await bcrypt.hash(body.password.trim(), 10);
    }

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: userUpdateData,
      });
    }

    if (user.role === "freelancer") {
      await prisma.freelancerProfile.upsert({
        where: { userId: user.id },
        update: {
          title: nullableText(body.title),
          bio: nullableText(body.bio),
          skills: nullableText(body.skills),
          phone: nullableText(body.phone),
          visibility:
            body.visibility === "limited" ? "limited" : "public",
        },
        create: {
          userId: user.id,
          title: nullableText(body.title),
          bio: nullableText(body.bio),
          skills: nullableText(body.skills),
          phone: nullableText(body.phone),
          visibility:
            body.visibility === "limited" ? "limited" : "public",
        },
      });
    }

    const updatedUser = await findUserByEmail(email);

    return NextResponse.json({
      message: "Dashboard pengguna berhasil diupdate",
      user: updatedUser,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Gagal update dashboard pengguna" },
      { status: 500 }
    );
  }
}