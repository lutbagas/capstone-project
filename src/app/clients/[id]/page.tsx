import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClientProfileEditor from "@/components/ClientProfileEditor";
import { requireAuth } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDashboardPage({ params }: Props) {
  const authUser = await requireAuth(["client"]);
  const { id } = await params;

  const userId = Number(id);

  if (Number.isNaN(userId)) {
    notFound();
  }

  if (authUser.id !== userId) {
    redirect("/clients");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user || user.role !== "client") {
    notFound();
  }

  const profile = await prisma.clientProfile.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
  });

  const data = {
    id: profile.id,
    userId: profile.userId,
    companyName: profile.companyName,
    description: profile.description,
    user,
  };

  return <ClientProfileEditor profile={data} />;
}