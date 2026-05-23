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

export default async function ClientProfilePage({
  params,
}: Props) {
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
    <main className="min-h-screen bg-[#F5F7FB]">
      <ClientNavbar
        userName={client.name || "Client"}
        userId={client.id}
      />

      <section className="mx-auto max-w-275 px-10 py-14">
        <div className="overflow-hidden rounded-4xl border border-emerald-100 bg-white shadow-[0_20px_60px_rgba(79,70,229,0.12)]">
          
          {/* Banner */}
          <div className="h-60 bg-linear-to-r from-emerald-700 via-emerald-500 to-blue-500" />

          <div className="relative px-10 pb-10">
            
            {/* Avatar */}
            <div className="-mt-20 flex h-40 w-40 items-center justify-center rounded-full border-8 border-white bg-emerald-600 text-6xl font-bold text-white shadow-xl">
              {client.name?.charAt(0)}
            </div>

            {/* Header */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <h1 className="font-serif text-5xl font-bold text-slate-900">
                  {client.name}
                </h1>

                <p className="mt-2 text-lg text-slate-500">
                  {client.clientProfile?.companyName ||
                    "No company information"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">
                  Member Since
                </p>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {new Date(client.createdAt).toLocaleDateString()}
                </h3>
              </div>
            </div>

            {/* About Company */}
            <div className="mt-10 rounded-3xl bg-slate-50 p-8">
              <h2 className="font-serif text-3xl font-bold text-slate-900">
                About Company
              </h2>

              <p className="mt-5 leading-relaxed text-slate-600">
                {client.clientProfile?.description ||
                  "No description yet"}
              </p>
            </div>

            {/* Freelancers */}
            <div className="mt-10 rounded-3xl bg-slate-50 p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-3xl font-bold text-slate-900">
                  Freelancers to Explore
                </h2>

                <Link
                  href="/clients"
                  className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Lihat Semua
                </Link>
              </div>

              {freelancers.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {freelancers.map((freelancer) => (
                    <div
                      key={freelancer.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {freelancer.name || "Freelancer"}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {freelancer.freelancerProfile?.title ||
                              "Professional Freelancer"}
                          </p>
                        </div>

                        <Link
                          href={`/freelancers/profile/${freelancer.id}`}
                          className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
                        >
                          View
                        </Link>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                        {freelancer.freelancerProfile?.bio ||
                          "Freelancer ini belum menambahkan bio."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-slate-500">
                  Belum ada freelancer tersedia.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}