import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

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
      return NextResponse.json(
        { error: "User ID tidak valid" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const profile = await prisma.freelancerProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Freelancer profile tidak ditemukan" },
        { status: 404 }
      );
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        freelancerProfileId: profile.id,
        projectTitle: body.projectTitle || null,
        projectDescription: body.projectDescription || null,
        projectLink: body.projectLink || null,
        image: body.image || null,
      },
    });

    return NextResponse.json({
      message: "Portfolio berhasil ditambahkan",
      portfolio,
    });
  } catch (error) {
    console.error("ADD PORTFOLIO ERROR:", error);

    return NextResponse.json(
      { error: "Gagal tambah portfolio" },
      { status: 500 }
    );
  }
}