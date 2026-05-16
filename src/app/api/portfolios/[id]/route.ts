import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const portfolioId = Number(id);

    if (Number.isNaN(portfolioId)) {
      return NextResponse.json({ error: "Portfolio ID tidak valid" }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio tidak ditemukan" }, { status: 404 });
    }

    // delete image from Cloudinary if present
    if (portfolio.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(portfolio.imagePublicId);
      } catch (e) {
        console.error("Cloudinary delete error:", e);
      }
    }

    await prisma.portfolio.delete({ where: { id: portfolioId } });

    return NextResponse.json({ message: "Portfolio berhasil dihapus" });
  } catch (error) {
    console.error("DELETE PORTFOLIO ERROR:", error);
    return NextResponse.json({ error: "Gagal hapus portfolio" }, { status: 500 });
  }
}
