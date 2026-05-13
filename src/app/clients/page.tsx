import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
      <p className="mb-5 inline-block rounded-full border border-indigo-100 bg-white px-5 py-2 text-sm font-medium text-indigo-700 shadow-sm">
        Welcome back, {name}
      </p>

      <h1 className="font-serif text-[90px] font-bold leading-[1.1] tracking-[-4px] text-slate-950">
        Find Perfect <br />
        Freelancer For <br />
        Your Business
      </h1>

      <div className="mx-auto mt-8 flex h-125 w-full max-w-275 items-end overflow-hidden rounded-[28px] border border-indigo-100 bg-[url('/images/hero.png')] bg-cover bg-center shadow-[0_25px_70px_rgba(79,70,229,0.22)]">
        <div className="m-10 rounded-2xl bg-white/15 px-6 py-4 text-left text-white backdrop-blur-md">
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
    </section>
  );
}

function DeveloperCard({ dev }: { dev: Developer }) {
  return (
    <div className="group rounded-[22px] border border-indigo-100 bg-white p-3 shadow-[0_10px_25px_rgba(79,70,229,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(79,70,229,0.18)]">
      <div className="mb-4 flex h-40 items-center justify-center rounded-[18px] bg-linear-to-br from-indigo-100 via-slate-100 to-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
          {dev.name.charAt(0)}
        </div>
      </div>

      <div className="px-2 pb-2">
        <h3 className="font-serif text-2xl font-bold text-slate-900">
          {dev.name}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {dev.title || "Freelancer"}
        </p>

        <p className="mt-2 text-xs text-slate-400 line-clamp-2">
          {dev.bio || "No bio available"}
        </p>

        <div className="mt-3 flex flex-wrap gap-1">
          {dev.skills.split(",").slice(0, 3).map((skill, index) => (
            <span key={index} className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-600">
              {skill.trim()}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href={`/freelancers/profile/${dev.id}`}
            className="rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ClientsPage() {
  // Get current client user - in real app, this would come from session/token
  const user = await prisma.user.findFirst({
    where: {
      role: "client",
    },
  });

  if (!user) {
    return <div>Client not found</div>;
  }

  // Get all freelancers with their profiles
  const freelancers = await prisma.user.findMany({
    where: {
      role: "freelancer",
    },
    include: {
      freelancerProfile: true,
    },
  });

  const developers: Developer[] = freelancers.map((freelancer: (typeof freelancers)[number]) => ({
    id: freelancer.id,
    name: freelancer.name || "Anonymous",
    title: freelancer.freelancerProfile?.title || "",
    skills: freelancer.freelancerProfile?.skills || "",
    bio: freelancer.freelancerProfile?.bio || "",
  }));

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      <ClientNavbar
        userName={user.name || "Client"}
        userId={user.id}
      />

      <Hero name={user.name || "Client"} />

      <section className="mx-auto max-w-275 px-10 py-10">
        <div className="mb-10">
          <h2 className="font-serif text-5xl font-bold text-slate-900">
            Top Freelancers
          </h2>

          <p className="mt-3 text-slate-500">
            Hire experienced developers for your next project
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {developers.length > 0 ? (
            developers.map((dev) => (
              <DeveloperCard
                key={dev.id}
                dev={dev}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-slate-500">No freelancers available yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}