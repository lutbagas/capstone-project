import { notFound } from "next/navigation";
import {prisma} from "@/lib/prisma";
import FreelancerProfileEditor from "@/components/FreelancerProfileEditor";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FreelancerDashboardPage({ params }: Props) {
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
    },
  });

  if (!user) {
    notFound();
  }

  const profile = await prisma.freelancerProfile.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
      visibility: "public",
    },
    include: {
      portfolios: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          projectTitle: true,
          projectDescription: true,
          projectLink: true,
          imageUrl: true,
          imagePublicId: true,
        },
      },
    },
  });

  const data = {
    id: profile.id,
    userId: profile.userId,
    title: profile.title,
    bio: profile.bio,
    skills: profile.skills,
    phone: profile.phone,
    visibility: profile.visibility,
    user,
    portfolios: profile.portfolios.map((p: any) => ({
      ...p,
      imageUrl: p.imageUrl || p.image || null,
      imagePublicId: p.imagePublicId || null,
    })),
  };

  return <FreelancerProfileEditor profile={data} />;
}