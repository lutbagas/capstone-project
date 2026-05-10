import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { error: "User ID tidak valid" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const profile = await prisma.clientProfile.upsert({
      where: {
        userId,
      },
      update: {
        companyName: body.companyName || null,
        description: body.description || null,
      },
      create: {
        userId,
        companyName: body.companyName || null,
        description: body.description || null,
      },
    });

    return NextResponse.json({
      message: "Profile berhasil diupdate",
      profile,
    });
  } catch (error) {
    console.error("UPDATE CLIENT PROFILE ERROR:", error);

    return NextResponse.json(
      { error: "Gagal update profile" },
      { status: 500 }
    );
  }
}