import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientProfilePage({
  params,
}: Props) {
  const { id } = await params;

  const client = await prisma.user.findFirst({
    where: {
      id: Number(id),
      role: "client",
    },
    include: {
      clientProfile: true,
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      <ClientNavbar
        userName={client.name || "Client"}
        userId={client.id}
      />

      <section className="mx-auto max-w-[1100px] px-10 py-14">
        <div className="overflow-hidden rounded-[32px] border border-indigo-100 bg-white shadow-[0_20px_60px_rgba(79,70,229,0.12)]">
          
          <div className="h-[240px] bg-gradient-to-r from-indigo-700 via-indigo-500 to-blue-500" />

          <div className="relative px-10 pb-10">
            <div className="-mt-20 flex h-40 w-40 items-center justify-center rounded-full border-8 border-white bg-indigo-600 text-6xl font-bold text-white shadow-xl">
              {client.name?.charAt(0)}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <h1 className="font-serif text-5xl font-bold text-slate-900">
                  {client.name}
                </h1>

                <p className="mt-2 text-lg text-slate-500">
                  {client.clientProfile?.companyName ||
                    "No company"}
                </p>
              </div>

              <Link href={`/clients/${client.id}`}>
                <button className="rounded-full bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700">
                  Edit Profile
                </button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-5">
              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {client.email}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">
                  Company
                </p>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {client.clientProfile?.companyName ||
                    "-"}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">
                  Member Since
                </p>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {new Date(
                    client.createdAt
                  ).toLocaleDateString()}
                </h3>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-slate-50 p-8">
              <h2 className="font-serif text-3xl font-bold text-slate-900">
                About Company
              </h2>

              <p className="mt-5 leading-relaxed text-slate-600">
                {client.clientProfile?.description ||
                  "No description yet"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}