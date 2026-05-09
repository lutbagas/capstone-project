import { NextResponse } from "next/server";
import { Visibility } from "@prisma/client";
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

    const visibility: Visibility =
      body.visibility === "limited" ? Visibility.limited : Visibility.public;

    const profile = await prisma.freelancerProfile.upsert({
      where: {
        userId,
      },
      update: {
        title: body.title || null,
        bio: body.bio || null,
        skills: body.skills || null,
        phone: body.phone || null,
        visibility,
      },
      create: {
        userId,
        title: body.title || null,
        bio: body.bio || null,
        skills: body.skills || null,
        phone: body.phone || null,
        visibility,
      },
    });

    return NextResponse.json({
      message: "Profile berhasil diupdate",
      profile,
    });
  } catch (error) {
    console.error("UPDATE FREELANCER PROFILE ERROR:", error);

    return NextResponse.json(
      { error: "Gagal update profile" },
      { status: 500 }
    );
  }
}