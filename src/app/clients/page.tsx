import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";

type Developer = {
  id: number;
  name: string;
  title: string;
  skills: string;
  bio: string;
};

function Hero({ name }: { name: string }) {
  return (
    <section className="px-10 py-10 text-center">
      <p className="mb-5 inline-block rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm">
        Welcome back, {name}
      </p>

      <h1 className="font-serif text-[85px] font-bold leading-[1.1] tracking-[-4px] text-slate-950">
        Connect with Skilled <br />
        Web Developers <br />
        for Your Project
      </h1>

      <div className="mx-auto mt-12 h-150 w-full max-w-7xl overflow-hidden rounded-[28px] border border-emerald-100 bg-[url('/images/hero3.jpg')] bg-cover bg-center shadow-[0_25px_70px_rgba(16,185,129,0.22)]">
        <div className="flex h-full w-full items-end bg-linear-to-t from-emerald-950/60 via-emerald-950/10 to-transparent p-10">
          <div className="rounded-2xl bg-white/15 px-6 py-4 text-left text-white backdrop-blur-md">
            <p className="text-sm text-white/80">
              Available Talent
            </p>

            <h2 className="mt-1 font-serif text-4xl font-bold">
              Available
            </h2>

            <p className="mt-1 text-sm text-white/80">
              Professional developers ready to work
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeveloperCard({ dev }: { dev: Developer }) {
  return (
    <div className="group rounded-[22px] border border-emerald-100 bg-white p-3 shadow-[0_10px_25px_rgba(16,185,129,0.08)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_24px_50px_rgba(16,185,129,0.18)]">
      <div className="mb-4 flex h-37.5 items-center justify-center rounded-[18px] bg-linear-to-br from-emerald-100 via-slate-100 to-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-serif text-2xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-110">
          {dev.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="px-1 pb-1">
        <h3 className="font-serif text-xl font-bold text-slate-950">
          {dev.name}
        </h3>

        <p className="mt-2 text-sm font-semibold text-emerald-700">
          {dev.title || "Freelance Web Developer"}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {dev.bio || "Belum ada bio untuk freelancer ini."}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {dev.skills ? (
            dev.skills
              .split(",")
              .slice(0, 3)
              .map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                >
                  {skill.trim()}
                </span>
              ))
          ) : (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              No skills
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href={`/freelancers/profile/${dev.id}`}
            className="rounded-full border border-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 transition duration-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ClientsPage() {
  const authUser = await requireAuth(["client"]);

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
  });

  if (!user || user.role !== "client") {
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
  });

  const developers: Developer[] = freelancers.map(
    (freelancer: (typeof freelancers)[number]) => ({
      id: freelancer.id,
      name: freelancer.name || "Anonymous",
      title: freelancer.freelancerProfile?.title || "",
      skills: freelancer.freelancerProfile?.skills || "",
      bio: freelancer.freelancerProfile?.bio || "",
    }),
  );

  return (
    <main className="min-h-screen w-full bg-[#F5FBF8] font-sans">
      <ClientNavbar
        userName={user.name || "Client"}
        userId={user.id}
        role="client"
      />

      <Hero name={user.name || "Client"} />

      <section className="px-10 py-5">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
            Freelancers
          </p>

          <h2 className="mt-2 font-serif text-4xl font-bold text-slate-950">
            Available Web Developers
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Temukan freelancer yang sesuai dengan kebutuhan project website,
            mulai dari frontend, backend, hingga fullstack developer.
          </p>
        </div>

        {developers.length > 0 ? (
          <div className="grid grid-cols-3 gap-4.5">
            {developers.map((dev) => (
              <DeveloperCard
                key={dev.id}
                dev={dev}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-emerald-100 bg-white px-6 py-14 text-center shadow-[0_10px_25px_rgba(16,185,129,0.08)]">
            <h3 className="font-serif text-2xl font-bold text-slate-950">
              Belum ada freelancer
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Data freelancer akan muncul di sini setelah user dengan role
              freelancer membuat profile.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}