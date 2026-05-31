import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FreelancerProfileEditor from "@/components/FreelancerProfileEditor";
import Footer from "@/components/Footer";
import { requireAuth } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FreelancerDashboardPage({ params }: Props) {
  const authUser = await requireAuth(["freelancer"]);
  const { id } = await params;

  const userId = Number(id);

  if (Number.isNaN(userId)) {
    notFound();
  }

  if (authUser.id !== userId) {
    redirect(`/freelancers/${authUser.id}`);
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


  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-[#F5FBF8] pb-6">
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <div className="flex flex-col gap-6 overflow-hidden rounded-[30px] border border-emerald-100 bg-white px-8 py-8 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[3px] text-emerald-600">
                Freelancer Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950">
                Kelola Profil Freelancer
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                Perbarui profil, keahlian, dan portofolio agar lebih mudah ditemukan oleh client.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Link
                href={`/freelancers/${userId}`}
                className="inline-flex rounded-full border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                Home
              </Link>
              <Link
                href="/api/auth/logout"
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16">
        <FreelancerProfileEditor profile={data} />
      </section>

      <Footer />
    </main>
  );
}