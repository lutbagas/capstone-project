import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function getInitial(name?: string | null) {
  return (name || "C").charAt(0).toUpperCase();
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ClientProfilePage({ params }: Props) {
  const authUser = await requireAuth(["client"]);
  const { id } = await params;
  const clientId = Number(id);

  if (Number.isNaN(clientId)) {
    notFound();
  }

  if (authUser.id !== clientId) {
    redirect("/clients");
  }

  const client = await prisma.user.findFirst({
    where: {
      id: clientId,
      role: "client",
    },
    include: {
      clientProfile: true,
    },
  });

  if (!client) {
    notFound();
  }

  const freelancers = await prisma.user.findMany({
    where: {
      role: "freelancer",
    },
    include: {
      freelancerProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return (
    <main className="min-h-screen bg-[#F5FBF8] font-sans text-slate-950">
      <ClientNavbar userName={client.name || "Client"} userId={client.id} />

      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-300 items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-block rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              Client Profile
            </p>

            <h1 className="font-serif text-[48px] font-bold leading-[1.05] tracking-[-2px] text-slate-950 md:text-[72px]">
              {client.name || "Client"}
            </h1>

            <p className="mt-4 text-lg font-semibold text-emerald-700">
              {client.clientProfile?.companyName || "InfoWebLancers Client"}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Kelola profile client dan temukan freelancer web developer yang
              sesuai dengan kebutuhan project. Dari halaman ini kamu bisa
              melihat ringkasan akun dan rekomendasi freelancer terbaru.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/clients"
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.24)] transition hover:bg-emerald-700"
              >
                Cari Freelancer
              </Link>

              
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">Client</h3>
                <p className="mt-1 text-xs text-slate-500">Account Type</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">
                  {freelancers.length}
                </h3>
                <p className="mt-1 text-xs text-slate-500">Freelancers</p>
              </div>

            </div>
          </div>

          <div className="relative overflow-hidden rounded-4xl border border-emerald-100 bg-white p-6 shadow-[0_25px_70px_rgba(16,185,129,0.18)]">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-emerald-100" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-emerald-50" />

            <div className="relative">
              <div className="flex h-65 items-center justify-center rounded-[26px] bg-linear-to-br from-emerald-100 via-slate-100 to-white">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-600 font-serif text-5xl font-bold text-white shadow-lg">
                  {getInitial(client.name)}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-emerald-100 bg-[#F5FBF8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[3px] text-emerald-600">
                  Account Summary
                </p>

                <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">
                  {client.name || "Client"}
                </h2>

                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  {client.clientProfile?.companyName || "No company name"}
                </p>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">Email</p>
                    <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                      {client.email}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Member Since
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatDate(client.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">Role</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
                      {client.role}
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
                Recommended Talent
              </p>

              <h2 className="mt-2 font-serif text-4xl font-bold text-slate-950">
                Freelancers to Explore
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                Berikut beberapa freelancer terbaru yang bisa kamu lihat dan
                pertimbangkan untuk kebutuhan project website.
              </p>
            </div>

            <Link
              href="/clients"
              className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              Lihat Semua
            </Link>
          </div>

          {freelancers.length > 0 ? (
            <div className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-3">
              {freelancers.map((freelancer) => {
                const profile = freelancer.freelancerProfile;
                const initial = getInitial(freelancer.name);

                const skills =
                  profile?.skills
                    ?.split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .slice(0, 3) || [];

                return (
                  <article
                    key={freelancer.id}
                    className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-3 shadow-[0_10px_25px_rgba(16,185,129,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(16,185,129,0.18)]"
                  >
                    <div className="absolute right-4 top-4 z-10 rounded-full border border-emerald-100 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
                      Available
                    </div>

                    <div className="mb-4 flex h-37.5 items-center justify-center rounded-[18px] bg-linear-to-br from-emerald-100 via-slate-100 to-white">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={freelancer.name || "Freelancer"}
                          className="h-20 w-20 rounded-full object-cover shadow-lg transition duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-serif text-2xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-110">
                          {initial}
                        </div>
                      )}
                    </div>

                    <div className="px-1 pb-1">
                      <h3 className="font-serif text-xl font-bold text-slate-950">
                        {freelancer.name || "Freelancer"}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-emerald-700">
                        {profile?.title || "Professional Freelancer"}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {profile?.bio ||
                          "Freelancer ini belum menambahkan bio."}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skills.length > 0 ? (
                          skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                            Skill belum diisi
                          </span>
                        )}
                      </div>

                      <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-3">
                        <p className="text-xs leading-relaxed text-slate-500">
                          Lihat detail profile freelancer untuk mengetahui
                          skill, bio, dan portfolio.
                        </p>

                        <Link
                          href={`/freelancers/profile/${freelancer.id}`}
                          className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-emerald-200 bg-white px-6 py-14 text-center shadow-[0_10px_25px_rgba(16,185,129,0.08)]">
              <h3 className="font-serif text-2xl font-bold text-slate-950">
                Belum ada freelancer
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                Data freelancer akan muncul di sini setelah user dengan role
                freelancer membuat profile.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}