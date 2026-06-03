import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getAuthPayload } from "@/lib/auth";

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export async function POST(req: Request) {
  try {
    // Cek auth
    const auth = await getAuthPayload();
    if (!auth) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body: ChangePasswordBody = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validasi input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Password baru dan konfirmasi tidak cocok" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Verifikasi password lama
    const isValid = await bcrypt.compare(currentPassword, user.passwd);

    if (!isValid) {
      return NextResponse.json(
        { error: "Password saat ini salah" },
        { status: 401 }
      );
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: auth.id },
      data: { passwd: hashedPassword },
    });

    return NextResponse.json({
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
