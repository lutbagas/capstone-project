import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "User ID tidak valid" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as any;

    if (!file) {
      return NextResponse.json({ error: "File avatar tidak ditemukan" }, { status: 400 });
    }

    // read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    // fetch existing profile to delete old image if exists
    const existing = await prisma.freelancerProfile.findUnique({ where: { userId } });

    if (existing && existing.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(existing.avatarPublicId);
      } catch (err) {
        console.error("CLOUDINARY DESTROY ERROR:", err);
      }
    }

    const upload = await cloudinary.uploader.upload(dataUri, {
      folder: `freelancers/${userId}`,
      public_id: `avatar_${Date.now()}`,
      overwrite: true,
    });

    const profile = await prisma.freelancerProfile.upsert({
      where: { userId },
      update: {
        avatarUrl: upload.secure_url || upload.url || null,
        avatarPublicId: upload.public_id || null,
      },
      create: {
        userId,
        avatarUrl: upload.secure_url || upload.url || null,
        avatarPublicId: upload.public_id || null,
        visibility: "public",
      },
    });

    return NextResponse.json({ message: "Avatar berhasil diupload", profile });
  } catch (error) {
    console.error("UPLOAD AVATAR ERROR:", error);
    return NextResponse.json({ error: "Gagal upload avatar" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "User ID tidak valid" }, { status: 400 });
    }

    const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });

    if (!profile || !profile.avatarPublicId) {
      return NextResponse.json({ error: "Avatar tidak ditemukan" }, { status: 404 });
    }

    try {
      await cloudinary.uploader.destroy(profile.avatarPublicId);
    } catch (err) {
      console.error("CLOUDINARY DESTROY ERROR:", err);
    }

    const updated = await prisma.freelancerProfile.update({
      where: { userId },
      data: { avatarUrl: null, avatarPublicId: null },
    });

    return NextResponse.json({ message: "Avatar dihapus", profile: updated });
  } catch (error) {
    console.error("DELETE AVATAR ERROR:", error);
    return NextResponse.json({ error: "Gagal menghapus avatar" }, { status: 500 });
  }
}
