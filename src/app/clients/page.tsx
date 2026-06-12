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

type ClientsPageProps = {
  searchParams?:
    | Promise<{
        search?: string;
        skill?: string;
      }>
    | {
        search?: string;
        skill?: string;
      };
};

function getSkillList(skills: string) {
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function Hero({
  name,
  totalFreelancers,
}: {
  name: string;
  totalFreelancers: number;
}) {
  return (
    <section className="px-10 py-12">
      <div className="mx-auto grid max-w-300 items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="mb-5 inline-block rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm">
            Welcome back, {name}
          </p>

          <h1 className="font-serif text-[54px] font-bold leading-[1.05] tracking-[-2px] text-slate-950 md:text-[68px]">
            Cari Web Developer yang Cocok untuk Project Kamu
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            InfoWebLancers membantu client menemukan freelancer web developer
            berdasarkan skill, profile, dan kebutuhan project. Pilih freelancer
            yang sesuai lalu lihat detail profile mereka.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#freelancers"
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.24)] transition hover:bg-emerald-700"
            >
              Cari Freelancer
            </a>

            
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold text-slate-950">
                {totalFreelancers}
              </h3>
              <p className="mt-1 text-xs text-slate-500">Freelancer</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold text-slate-950">Client</h3>
              <p className="mt-1 text-xs text-slate-500">Cari talent</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold text-slate-950">Profile</h3>
              <p className="mt-1 text-xs text-slate-500">Bisa dilihat</p>
            </div>
          </div>
        </div>

        <div className="relative h-140 overflow-hidden rounded-4xl border border-emerald-100 bg-[url('/images/hero3.jpg')] bg-cover bg-center shadow-[0_25px_70px_rgba(16,185,129,0.22)]">
          <div className="absolute inset-0 bg-linear-to-t from-emerald-950/70 via-emerald-950/20 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/20 bg-white/85 p-5 shadow-xl backdrop-blur-md">
            <p className="text-sm font-semibold text-emerald-700">
              Mulai dari profile, skill, sampai portofolio.
            </p>

            <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">
              Lebih mudah menemukan developer yang sesuai kebutuhan.
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: "Frontend Development",
      desc: "Temukan freelancer yang bisa membuat tampilan website responsive, modern, dan nyaman digunakan.",
    },
    {
      title: "Backend Development",
      desc: "Cari developer untuk membuat API, database, autentikasi, dan logic sistem aplikasi.",
    },
    {
      title: "Fullstack Website",
      desc: "Pilih freelancer yang mampu mengerjakan project dari frontend sampai backend.",
    },
  ];

  return (
    <section id="services" className="px-10 py-16">
      <div className="mx-auto max-w-275">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
            Services
          </p>

          <h2 className="mt-2 font-serif text-4xl font-bold text-slate-950">
            Kebutuhan Project yang Bisa Kamu Cari
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_10px_25px_rgba(16,185,129,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(16,185,129,0.14)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-700">
                0{index + 1}
              </div>

              <h3 className="font-serif text-2xl font-bold text-slate-950">
                {service.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchFilter({
  search,
  skill,
  skills,
}: {
  search: string;
  skill: string;
  skills: string[];
}) {
  return (
    <form
      action="/clients"
      className="mx-auto mb-8 grid max-w-225 gap-3 rounded-3xl border border-emerald-100 bg-white p-4 shadow-[0_10px_25px_rgba(16,185,129,0.08)] md:grid-cols-[1fr_220px_auto]"
    >
      <input
        name="search"
        defaultValue={search}
        placeholder="Cari nama, title, bio, atau skill..."
        className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
      />

      <select
        name="skill"
        defaultValue={skill}
        className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
      >
        <option value="">Semua Skill</option>

        {skills.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
        Cari
      </button>
    </form>
  );
}

function DeveloperCard({ dev }: { dev: Developer }) {
  const initial = dev.name.charAt(0).toUpperCase();
  const skills = getSkillList(dev.skills);

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-emerald-100 bg-white p-3 shadow-[0_10px_25px_rgba(16,185,129,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(16,185,129,0.18)]">
      <div className="absolute right-4 top-4 z-10 rounded-full border border-emerald-100 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
        Available
      </div>

      <div className="mb-4 flex h-37.5 items-center justify-center rounded-[18px] bg-linear-to-br from-emerald-100 via-slate-100 to-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-serif text-2xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-110">
          {initial}
        </div>
      </div>

      <div className="px-1 pb-1">
        <h3 className="font-serif text-xl font-bold text-slate-950">
          {dev.name}
        </h3>

        <p className="mt-2 text-sm font-semibold text-emerald-700">
          {dev.title || "Freelance Web Developer"}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {dev.bio || "Belum ada bio untuk freelancer ini."}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.length > 0 ? (
            skills.slice(0, 3).map((skill) => (
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

          {skills.length > 3 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              +{skills.length - 3} skill
            </span>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-3">
          <p className="text-xs leading-relaxed text-slate-500">
            Lihat detail profile freelancer untuk mengetahui skill, bio, dan
            informasi lengkap lainnya.
          </p>

          <Link
            href={`/freelancers/profile/${dev.id}`}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const authUser = await requireAuth(["client"]);

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
  });

  if (!user || user.role !== "client") {
    notFound();
  }

  const params = await Promise.resolve(searchParams);

  const search = params?.search?.trim() || "";
  const skill = params?.skill?.trim() || "";

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

  const developers: Developer[] = freelancers.map((freelancer) => ({
    id: freelancer.id,
    name: freelancer.name || "Anonymous",
    title: freelancer.freelancerProfile?.title || "",
    skills: freelancer.freelancerProfile?.skills || "",
    bio: freelancer.freelancerProfile?.bio || "",
  }));

  const allSkills = Array.from(
    new Set(developers.flatMap((dev) => getSkillList(dev.skills)))
  ).sort();

  const filteredDevelopers = developers.filter((dev) => {
    const keyword = search.toLowerCase();
    const selectedSkill = skill.toLowerCase();

    const matchSearch =
      !keyword ||
      dev.name.toLowerCase().includes(keyword) ||
      dev.title.toLowerCase().includes(keyword) ||
      dev.bio.toLowerCase().includes(keyword) ||
      dev.skills.toLowerCase().includes(keyword);

    const matchSkill =
      !selectedSkill ||
      getSkillList(dev.skills).some(
        (item) => item.toLowerCase() === selectedSkill
      );

    return matchSearch && matchSkill;
  });

  return (
    <main className="min-h-screen w-full bg-[#F5FBF8] font-sans">
      <ClientNavbar userName={user.name || "Client"} userId={user.id} />

      <Hero
        name={user.name || "Client"}
        totalFreelancers={developers.length}
      />

      <Services />

      <section id="freelancers" className="px-10 py-16">
        <div className="mx-auto max-w-275">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
              Freelancers
            </p>

            <h2 className="mt-2 font-serif text-4xl font-bold text-slate-950">
              Available Web Developers
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              Gunakan pencarian untuk menemukan freelancer berdasarkan nama,
              title, bio, atau skill yang sesuai dengan kebutuhan project.
            </p>
          </div>

          <SearchFilter search={search} skill={skill} skills={allSkills} />

          {(search || skill) && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-sm text-slate-600">
              <p>
                Menampilkan{" "}
                <span className="font-semibold text-emerald-700">
                  {filteredDevelopers.length}
                </span>{" "}
                freelancer
                {search && (
                  <>
                    {" "}
                    untuk pencarian{" "}
                    <span className="font-semibold text-slate-900">
                      “{search}”
                    </span>
                  </>
                )}
                {skill && (
                  <>
                    {" "}
                    dengan skill{" "}
                    <span className="font-semibold text-slate-900">
                      {skill}
                    </span>
                  </>
                )}
              </p>

              <Link href="/clients" className="font-semibold text-emerald-700">
                Reset Filter
              </Link>
            </div>
          )}

          {filteredDevelopers.length > 0 ? (
            <div className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-3">
              {filteredDevelopers.map((dev) => (
                <DeveloperCard key={dev.id} dev={dev} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-emerald-100 bg-white px-6 py-14 text-center shadow-[0_10px_25px_rgba(16,185,129,0.08)]">
              <h3 className="font-serif text-2xl font-bold text-slate-950">
                Freelancer tidak ditemukan
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                Coba gunakan keyword lain atau reset filter untuk melihat semua
                freelancer yang tersedia.
              </p>

              <Link
                href="/clients"
                className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Reset Filter
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}