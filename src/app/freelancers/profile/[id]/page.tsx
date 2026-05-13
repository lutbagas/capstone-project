import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FreelancerProfileForClientPage({ params }: Props) {
  const { id } = await params;
  const freelancerId = Number(id);

  if (Number.isNaN(freelancerId)) {
    notFound();
  }

  const client = await prisma.user.findFirst({
    where: { role: "client" },
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

  const skills = (freelancer.freelancerProfile.skills || "")
    .split(",")
    .map((skill: string) => skill.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      {client && <ClientNavbar userName={client.name || "Client"} userId={client.id} />}

      <section className="mx-auto max-w-275 px-10 py-14">
        <div className="overflow-hidden rounded-4xl border border-indigo-100 bg-white shadow-[0_20px_60px_rgba(79,70,229,0.12)]">
          <div className="h-55 bg-grbg-linear-to-r-indigo-700 via-indigo-500 to-blue-500" />

          <div className="relative px-10 pb-10">
            <div className="-mt-16 flex h-32 w-32 items-center justify-center rounded-full border-8 border-white bg-indigo-600 text-5xl font-bold text-white shadow-xl">
              {freelancer.name?.charAt(0) || "F"}
            </div>

            <h1 className="mt-4 font-serif text-5xl font-bold text-slate-900">{freelancer.name || "Freelancer"}</h1>
            <p className="mt-2 text-xl text-slate-500">
              {freelancer.freelancerProfile.title || "Professional Freelancer"}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-5">
              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Email</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{freelancer.email}</h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Phone</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{freelancer.freelancerProfile.phone || "-"}</h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Portfolio</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {freelancer.freelancerProfile.portfolios.length} Projects
                </h3>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-slate-50 p-8">
              <h2 className="font-serif text-3xl font-bold text-slate-900">About Freelancer</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                {freelancer.freelancerProfile.bio || "Freelancer ini belum menambahkan bio."}
              </p>
            </div>

            <div className="mt-10 rounded-3xl bg-slate-50 p-8">
              <h2 className="font-serif text-3xl font-bold text-slate-900">Skills</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill: string) => (
                    <span key={skill} className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500">Belum ada skill ditambahkan.</p>
                )}
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-slate-50 p-8">
              <h2 className="font-serif text-3xl font-bold text-slate-900">Portfolio</h2>

              {freelancer.freelancerProfile.portfolios.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {freelancer.freelancerProfile.portfolios.map((portfolio: (typeof freelancer.freelancerProfile.portfolios)[number]) => (
                    <div key={portfolio.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-lg font-semibold text-slate-900">{portfolio.projectTitle || "Untitled Project"}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                        {portfolio.projectDescription || "Belum ada deskripsi project."}
                      </p>
                      {portfolio.projectLink && (
                        <a
                          href={portfolio.projectLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline"
                        >
                          Visit Project
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-slate-500">Belum ada portfolio yang ditampilkan.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}