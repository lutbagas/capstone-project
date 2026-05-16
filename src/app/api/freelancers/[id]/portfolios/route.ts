import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

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

    // parse multipart/form-data (file upload) or JSON fallback
    let projectTitle: string | null = null;
    let projectDescription: string | null = null;
    let projectLink: string | null = null;
    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    try {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      projectTitle = (formData.get("projectTitle") as string) || null;
      projectDescription = (formData.get("projectDescription") as string) || null;
      projectLink = (formData.get("projectLink") as string) || null;

      if (file && (file as any).size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        const mime = (file as any).type || "application/octet-stream";
        const dataUri = `data:${mime};base64,${base64}`;

        const upload = await cloudinary.uploader.upload(dataUri, {
          folder: "portfolios",
        });

        imageUrl = upload.secure_url || upload.url || null;
        imagePublicId = upload.public_id || null;
      }
    } catch (e) {
      // fallback to JSON body (existing behavior)
      const body = await req.json();
      projectTitle = body.projectTitle || null;
      projectDescription = body.projectDescription || null;
      projectLink = body.projectLink || null;
      imageUrl = body.image || null;
    }

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
        projectTitle: projectTitle || null,
        projectDescription: projectDescription || null,
        projectLink: projectLink || null,
        imageUrl: imageUrl || null,
        imagePublicId: imagePublicId || null,
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