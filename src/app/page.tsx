import "./globals.css";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Developer = {
  id: number;
  name: string;
  title: string;
  skills: string;
  bio: string;
};

function Navbar() {
  return (
    <nav className="mx-auto mt-3.75 flex max-w-275 items-center justify-between rounded-[20px] border border-emerald-100 bg-white/80 px-8 py-3 text-slate-900 shadow-[0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur-md">
      <div className="font-serif text-[30px] font-bold tracking-tight text-emerald-700">
        InfoWebLancers
      </div>

      <ul className="flex list-none items-center gap-12.5 font-serif text-[15px] text-slate-600">
        <li className="rounded-full bg-emerald-600 px-4 py-1.5 text-white shadow-sm">
          Home
        </li>

        <li className="cursor-pointer transition duration-300 hover:text-emerald-700">
          About
        </li>

        <li className="cursor-pointer transition duration-300 hover:text-emerald-700">
          Services
        </li>

        <li className="cursor-pointer transition duration-300 hover:text-emerald-700">
          Contact
        </li>
      </ul>

      <div className="flex items-center">
        <Link href="/login">
          <button className="cursor-pointer rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 transition-all duration-300 hover:bg-emerald-600 hover:text-white">
            Login
          </button>
        </Link>

        <Link href="/register">
          <button className="ml-2.5 cursor-pointer rounded-full border border-emerald-600 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-emerald-700">
            Register
          </button>
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="px-10 py-10 text-center">
      <p className="mb-5 inline-block rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm">
        Hire trusted freelance web developers
      </p>

      <h1 className="font-serif text-[85px] font-bold leading-[1.1] tracking-[-4px] text-slate-950">
        Connect with Skilled <br />
        Web Developers <br />
        for Your Project
      </h1>

      <div className="mx-auto mt-12 h-150 w-full max-w-7xl overflow-hidden rounded-[28px] border border-emerald-100 bg-[url('/images/hero3.jpg')] bg-cover bg-center shadow-[0_25px_70px_rgba(16,185,129,0.22)]">
        <div className="flex h-full w-full items-end bg-linear-to-t from-emerald-950/60 via-emerald-950/10 to-transparent p-10"></div>
      </div>
    </section>
  );
}

type DeveloperCardProps = {
  data: Developer;
};

function DeveloperCard({ data }: DeveloperCardProps) {
  const initial = data.name.charAt(0).toUpperCase();
  const hiddenName = `${initial}${"•".repeat(5)}`;

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-emerald-100 bg-white p-3 shadow-[0_10px_25px_rgba(16,185,129,0.08)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_24px_50px_rgba(16,185,129,0.18)]">
      <div className="absolute right-4 top-4 z-10 rounded-full border border-emerald-100 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
        Login Required
      </div>

      <div className="mb-4 flex h-37.5 items-center justify-center rounded-[18px] bg-linear-to-br from-emerald-100 via-slate-100 to-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-serif text-2xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-110">
          {initial}
        </div>
      </div>

      <div className="px-1 pb-1">
        <h4 className="font-serif text-xl font-bold text-slate-950">
          {hiddenName}
        </h4>

        <p className="mt-2 text-sm font-semibold text-emerald-700">
          {data.title || "Freelance Web Developer"}
        </p>

        <div className="relative mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <p className="line-clamp-2 select-none text-sm leading-relaxed text-slate-400 blur-[3px]">
            {data.bio ||
              "Experienced freelancer with professional web development skills."}
          </p>

          <div className="absolute inset-0 flex items-center justify-center bg-white/35 backdrop-blur-[1px]">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              Bio hidden
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Web Developer
          </span>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            Skills locked
          </span>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            Portfolio locked
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-3">
          <p className="text-xs leading-relaxed text-slate-500">
            Login terlebih dahulu untuk melihat profile lengkap, skill detail,
            portofolio, dan informasi freelancer.
          </p>

          <Link
            href={`/login?redirect=/freelancers/profile/${data.id}`}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
          >
            Login to View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-white px-10 py-10 font-serif text-slate-950 shadow-[0_-10px_30px_rgba(16,185,129,0.06)]">
      <div className="mx-auto max-w-275">
        <div className="grid grid-cols-4 gap-10">
          <div>
            <h3 className="text-3xl font-bold text-emerald-700">
              InfoWebLancers
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Platform untuk menghubungkan client dengan freelance web developer
              profesional secara cepat, mudah, dan terpercaya.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Menu
            </h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li className="cursor-pointer transition hover:text-emerald-700">
                Home
              </li>
              <li className="cursor-pointer transition hover:text-emerald-700">
                About
              </li>
              <li className="cursor-pointer transition hover:text-emerald-700">
                Services
              </li>
              <li className="cursor-pointer transition hover:text-emerald-700">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Services
            </h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li className="cursor-pointer transition hover:text-emerald-700">
                Web Development
              </li>
              <li className="cursor-pointer transition hover:text-emerald-700">
                UI/UX Design
              </li>
              <li className="cursor-pointer transition hover:text-emerald-700">
                Frontend Developer
              </li>
              <li className="cursor-pointer transition hover:text-emerald-700">
                Backend Developer
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Contact
            </h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li>Email: infoweblancers@email.com</li>
              <li>Location: Jakarta, Indonesia</li>
              <li>Phone: +62 812 3456 7890</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>© 2026 InfoWebLancers. All rights reserved.</p>

          <div className="flex gap-5">
            <span className="cursor-pointer transition hover:text-emerald-700">
              Privacy Policy
            </span>

            <span className="cursor-pointer transition hover:text-emerald-700">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default async function App() {
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

  return (
    <main className="min-h-screen w-full bg-[#F5FBF8] font-sans">
      <Navbar />
      <Hero />

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
              <DeveloperCard key={dev.id} data={dev} />
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