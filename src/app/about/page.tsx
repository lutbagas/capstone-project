import Link from "next/link";
import Footer from "@/components/Footer";

type TeamMember = {
  name: string;
  role: string;
  image: string;
  description: string;
};

const teamMembers: TeamMember[] = [
  {
    name: "Lutfi Bagas W",
    role: "Project Manager",
    image: "/images/lutfi.jpeg",
    description:
      "Bertanggung jawab mengatur alur kerja tim, membagi tugas, memantau progress project, dan memastikan pengembangan InfoWebLancers berjalan sesuai rencana.",
  },
  {
    name: "Muhammad Sauqi H",
    role: "Frontend Developer",
    image: "/images/sauqi.jpg",
    description:
      "Bertanggung jawab membuat tampilan website, layout halaman, komponen UI, dan memastikan pengalaman pengguna terlihat rapi serta nyaman digunakan.",
  },
  {
    name: "Yafi Ariella W",
    role: "Backend Developer",
    image: "/images/yafi.jpg",
    description:
      "Bertanggung jawab membuat database, API, autentikasi, validasi data, dan logic sistem agar aplikasi berjalan dengan baik.",
  },
  {
    name: "Maulvi Azami",
    role: "System Analyst",
    image: "/images/maulvi.png",
    description:
      "Bertanggung jawab menganalisis kebutuhan sistem, menyusun alur proses, membuat rancangan fitur, dan memastikan solusi yang dibuat sesuai kebutuhan pengguna.",
  },
];

function Navbar() {
  return (
    <nav className="sticky top-3 z-50 mx-auto mt-3 flex max-w-275 items-center justify-between rounded-[20px] border border-emerald-100 bg-white/85 px-8 py-3 text-slate-900 shadow-[0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur-md">
      <Link
        href="/"
        className="font-serif text-[30px] font-bold tracking-tight text-emerald-700"
      >
        InfoWebLancers
      </Link>

      <ul className="hidden list-none items-center gap-10 font-serif text-[15px] text-slate-600 md:flex">
        <li>
          <Link href="/" className="transition hover:text-emerald-700">
            Home
          </Link>
        </li>

        <li>
          <Link
            href="/about"
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-white shadow-sm"
          >
            About Us
          </Link>
        </li>

        <li>
          <Link href="/login" className="transition hover:text-emerald-700">
            Login
          </Link>
        </li>

        <li>
          <Link href="/register" className="transition hover:text-emerald-700">
            Register
          </Link>
        </li>
      </ul>

      <Link
        href="/"
        className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
      >
        Back Home
      </Link>
    </nav>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <div className="group rounded-3xl border border-emerald-100 bg-white p-4 shadow-[0_10px_25px_rgba(16,185,129,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(16,185,129,0.18)]">
      <div className="mb-5 overflow-hidden rounded-[20px] bg-linear-to-br from-emerald-100 via-slate-100 to-white p-3">
        <img
          src={member.image}
          alt={member.name}
          className="h-55 w-full rounded-2xl object-cover object-center transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[3px] text-emerald-600">
          Profile 0{index + 1}
        </p>

        <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">
          {member.name}
        </h3>

        <p className="mt-2 text-sm font-semibold text-emerald-700">
          {member.role}
        </p>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-500">
        {member.description}
      </p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5FBF8] font-sans text-slate-950">
      <Navbar />

      <section className="px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-300 items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="mb-5 inline-block rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              About Us
            </p>

            <h1 className="font-serif text-[52px] font-bold leading-[1.05] tracking-[-2px] text-slate-950 md:text-[76px]">
              Tim Pengembang InfoWebLancers
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Halaman ini menampilkan profile anggota tim yang mengembangkan
              platform InfoWebLancers. Setiap anggota memiliki role penting
              dalam membangun tampilan, sistem, dan alur aplikasi.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#team"
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.24)] transition hover:bg-emerald-700"
              >
                Lihat Profile Tim
              </a>

              <Link
                href="/"
                className="rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500"
              >
                Kembali ke Home
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">
                  {teamMembers.length}
                </h3>
                <p className="mt-1 text-xs text-slate-500">Anggota</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">1</h3>
                <p className="mt-1 text-xs text-slate-500">PM</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">2</h3>
                <p className="mt-1 text-xs text-slate-500">Developer</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">1</h3>
                <p className="mt-1 text-xs text-slate-500">Analyst</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-4xl border border-emerald-100 bg-white p-6 shadow-[0_25px_70px_rgba(16,185,129,0.18)]">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-emerald-100" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-emerald-50" />

            <div className="relative">
              <div className="flex h-70 items-center justify-center rounded-[26px] bg-linear-to-br from-emerald-100 via-slate-100 to-white">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 font-serif text-4xl font-bold text-white shadow-lg">
                    IW
                  </div>

                  <h2 className="mt-5 font-serif text-3xl font-bold text-slate-950">
                    InfoWebLancers
                  </h2>

                  <p className="mt-2 text-sm font-medium text-emerald-700">
                    Capstone Project Team
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-emerald-100 bg-[#F5FBF8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[3px] text-emerald-600">
                  Project Summary
                </p>

                <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">
                  Platform pencarian freelance web developer.
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Project ini dibuat untuk membantu client menemukan freelancer
                  web developer berdasarkan profile, skill, dan portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="px-6 py-12 md:px-10">
        <div className="mx-auto max-w-300">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
              Our Team
            </p>

            <h2 className="mt-2 font-serif text-4xl font-bold text-slate-950">
              Profile Anggota Tim
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              Berikut adalah nama, foto profile, dan role anggota tim dalam
              pengembangan website InfoWebLancers.
            </p>
          </div>

          <div className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <TeamCard key={member.role} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}