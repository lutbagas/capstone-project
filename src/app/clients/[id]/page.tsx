import { notFound } from "next/navigation";
import {prisma} from "@/lib/prisma";
import ClientProfileEditor from "@/components/ClientProfileEditor";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDashboardPage({ params }: Props) {
  const { id } = await params;

  const userId = Number(id);

  if (Number.isNaN(userId)) {
    notFound();
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