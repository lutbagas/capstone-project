import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function getSkills(skills?: string | null) {
  if (!skills) return [];

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export default async function FreelancerPublicProfilePage({ params }: Props) {
  const authUser = await requireAuth(["client"]);
  const { id } = await params;
  const freelancerId = Number(id);

  if (Number.isNaN(freelancerId)) {
    notFound();
  }

  const client = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
  });

  if (!client || client.role !== "client") {
    notFound();
  }

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
  const skills = getSkills(profile.skills);

  const portfolios = profile.portfolios.map((portfolio: any) => ({
    ...portfolio,
    imageUrl: portfolio.imageUrl || portfolio.image || null,
    imagePublicId: portfolio.imagePublicId || null,
  }));

  const whatsappNumber = profile.phone?.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Halo ${freelancer.name || "Freelancer"}, saya tertarik berdiskusi tentang project website.`
  );

  return (
    <main className="min-h-screen bg-[#F5FBF8] font-sans text-slate-950">
      <ClientNavbar userName={client.name || "Client"} userId={client.id} />

      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-300 items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-block rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              Freelancer Profile
            </p>

            <h1 className="font-serif text-[48px] font-bold leading-[1.05] tracking-[-2px] text-slate-950 md:text-[72px]">
              {freelancer.name || "Freelancer"}
            </h1>

            <p className="mt-4 text-lg font-semibold text-emerald-700">
              {profile.title || "Professional Web Developer"}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              {profile.bio ||
                "Freelancer ini belum menambahkan bio. Kamu tetap bisa melihat skill, portfolio, dan informasi kontak yang tersedia."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm">
                  Skill belum diisi
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {whatsappNumber ? (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.24)] transition hover:bg-emerald-700"
                >
                  Chat via WhatsApp
                </a>
              ) : (
                <button
                  disabled
                  className="cursor-not-allowed rounded-full bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500"
                >
                  WhatsApp belum tersedia
                </button>
              )}

              <a
                href={`mailto:${freelancer.email}`}
                className="rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500"
              >
                Send Email
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">
                  {skills.length}
                </h3>
                <p className="mt-1 text-xs text-slate-500">Skills</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">
                  {portfolios.length}
                </h3>
                <p className="mt-1 text-xs text-slate-500">Projects</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-4xl border border-emerald-100 bg-white p-6 shadow-[0_25px_70px_rgba(16,185,129,0.18)]">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-emerald-100" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-emerald-50" />

            <div className="relative">
              <div className="flex h-65 items-center justify-center rounded-[26px] bg-linear-to-br from-emerald-100 via-slate-100 to-white">
                <div>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={freelancer.name || "Avatar"}
                      className="h-28 w-28 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-600 font-serif text-5xl font-bold text-white shadow-lg">
                      {(freelancer.name || "F").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-emerald-100 bg-[#F5FBF8] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[3px] text-emerald-600">
                      Profile Summary
                    </p>

                    <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">
                      {freelancer.name || "Freelancer"}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-emerald-700">
                      {profile.title || "Professional Freelancer"}
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-semibold capitalize text-emerald-700 shadow-sm">
                    {profile.visibility}
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">Email</p>
                    <a
                      href={`mailto:${freelancer.email}`}
                      className="mt-1 block break-all text-sm font-semibold text-emerald-700 hover:underline"
                    >
                      {freelancer.email}
                    </a>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">Phone</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {profile.phone || "Belum tersedia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-300">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
                Selected Works
              </p>

              <h2 className="mt-2 font-serif text-4xl font-bold text-slate-950">
                Portfolio Projects
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                Project yang pernah dikerjakan freelancer dan bisa menjadi bahan
                pertimbangan sebelum menghubungi.
              </p>
            </div>

            <div className="rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              {portfolios.length} Project
            </div>
          </div>

          {portfolios.length > 0 ? (
            <div className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <article
                  key={portfolio.id}
                  className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white p-3 shadow-[0_10px_25px_rgba(16,185,129,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(16,185,129,0.18)]"
                >
                  {portfolio.imageUrl ? (
                    <img
                      src={portfolio.imageUrl}
                      alt={portfolio.projectTitle || "Portfolio image"}
                      className="h-48 w-full rounded-[18px] object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center rounded-[18px] bg-linear-to-br from-emerald-100 via-slate-100 to-white text-sm font-medium text-slate-500">
                      No Image
                    </div>
                  )}

                  <div className="p-3">
                    <h3 className="font-serif text-xl font-bold text-slate-950">
                      {portfolio.projectTitle || "Untitled Project"}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                      {portfolio.projectDescription ||
                        "Belum ada deskripsi project."}
                    </p>

                    {portfolio.projectLink ? (
                      <a
                        href={portfolio.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Visit Project
                      </a>
                    ) : (
                      <p className="mt-5 text-sm font-medium text-slate-400">
                        Link project belum tersedia
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-emerald-200 bg-white px-6 py-14 text-center shadow-[0_10px_25px_rgba(16,185,129,0.08)]">
              <h3 className="font-serif text-2xl font-bold text-slate-950">
                Belum ada portfolio
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                Freelancer ini belum menambahkan project. Kamu masih bisa
                menghubungi freelancer melalui email atau WhatsApp jika tersedia.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-300 rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_18px_45px_rgba(16,185,129,0.1)] md:p-8">
          <div className="flex flex-col gap-5 rounded-3xl bg-emerald-50 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
                Contact Freelancer
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">
                Tertarik bekerja sama?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Hubungi freelancer untuk diskusi kebutuhan project, estimasi
                pengerjaan, dan detail kerja sama.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${freelancer.email}`}
                className="inline-flex rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500"
              >
                Send Email
              </a>

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Chat WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

//version 1.0.1