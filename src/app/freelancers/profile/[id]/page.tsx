import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FreelancerPublicProfilePage({ params }: Props) {
  const { id } = await params;
  const freelancerId = Number(id);

  if (Number.isNaN(freelancerId)) {
    notFound();
  }

  const client = await prisma.user.findFirst({
    where: {
      role: "client",
    },
  });

  const freelancer = await prisma.user.findFirst({
    where: {
      id: freelancerId,
      role: "freelancer",
    },
    include: {
      freelancerProfile: {
        include: {
          portfolios: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!freelancer || !freelancer.freelancerProfile) {
    notFound();
  }

  const profile = freelancer.freelancerProfile;

  const skills = (profile.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  // normalize portfolios for backward compatibility (legacy `image` field)
  profile.portfolios = profile.portfolios.map((p: any) => ({
    ...p,
    imageUrl: p.imageUrl || p.image || null,
    imagePublicId: p.imagePublicId || null,
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      {client && (
        <ClientNavbar
          userName={client.name || "Client"}
          userId={client.id}
        />
      )}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="overflow-hidden rounded-[30px] bg-white shadow-xl">
          <div className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/40 bg-white/20 text-4xl font-bold backdrop-blur-md">
                  {freelancer.name?.charAt(0) || "F"}
                </div>

                <div>
                  <p className="text-sm text-indigo-100">Freelancer Profile</p>

                  <h1 className="mt-1 text-4xl font-bold">
                    {freelancer.name || "Freelancer"}
                  </h1>

                  <p className="mt-2 text-lg text-indigo-100">
                    {profile.title || "Professional Freelancer"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/20 px-5 py-3 text-sm font-medium capitalize backdrop-blur-md">
                {profile.visibility}
              </div>
            </div>

            <p className="mt-8 max-w-3xl text-indigo-50">
              {profile.bio || "Freelancer ini belum menambahkan bio."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur-md"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-white/20 px-4 py-1 text-sm">
                  Belum ada skill
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-5 p-8 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Email</p>
              <h2 className="mt-1 break-all text-lg font-bold text-slate-800">
                {freelancer.email}
              </h2>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Phone</p>
              <h2 className="mt-1 text-lg font-bold text-slate-800">
                {profile.phone || "-"}
              </h2>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Portfolio</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                {profile.portfolios.length} Project
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[30px] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Selected Works
              </p>
              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                Portfolio
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              Project yang pernah dikerjakan freelancer.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profile.portfolios.length > 0 ? (
              profile.portfolios.map((portfolio) => (
                <article
                  key={portfolio.id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50"
                >
                  {portfolio.imageUrl ? (
                    <img
                      src={portfolio.imageUrl}
                      alt={portfolio.projectTitle || "Portfolio image"}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-slate-200 text-sm text-slate-500">
                      No Image
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      {portfolio.projectTitle || "Untitled Project"}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {portfolio.projectDescription ||
                        "Belum ada deskripsi project."}
                    </p>

                    {portfolio.projectLink && (
                      <a
                        href={portfolio.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Visit Project
                      </a>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center md:col-span-2 lg:col-span-3">
                <h3 className="text-lg font-bold text-slate-800">
                  Belum ada portfolio
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Freelancer ini belum menambahkan project.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}