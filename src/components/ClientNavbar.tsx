"use client";

import Link from "next/link";

type Props = {
  userName: string;
  userId: number;
  role: "client" | "freelancer" | "admin";
};

export default function ClientNavbar({
  userName,
  userId,
  role,
}: Props) {
  const homeHref =
    role === "client"
      ? "/clients"
      : role === "freelancer"
      ? `/freelancers/${userId}`
      : "/admin";

  const profileHref =
    role === "freelancer"
      ? `/freelancers/${userId}`
      : role === "client"
      ? `/clients/profile/${userId}`
      : "/admin";

  const profileLabel = role === "freelancer" ? "Dashboard" : "Profile";

  return (
    <nav className="mx-auto mt-3.5 flex max-w-[1100px] items-center justify-between rounded-[20px] border border-emerald-100 bg-white/80 px-8 py-3 text-slate-900 shadow-[0_10px_30px_rgba(79,70,229,0.12)] backdrop-blur-md">
      <Link href={homeHref}>
        <div className="cursor-pointer font-serif text-[30px] font-bold tracking-tight text-emerald-700 transition hover:text-emerald-800">
          InfoWebLancers
        </div>
      </Link>

      <ul className="flex list-none items-center gap-12 font-serif text-[15px] text-slate-600">
        <li>
          <Link
            href={homeHref}
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-white shadow-sm transition hover:bg-emerald-700"
          >
            Home
          </Link>
        </li>

        <li className="cursor-pointer transition hover:text-emerald-700">
          Developers
        </li>

        <li className="cursor-pointer transition hover:text-emerald-700">
          Projects
        </li>

        <li className="cursor-pointer transition hover:text-emerald-700">
          Contact
        </li>
      </ul>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {userName}
        </div>

        <Link href={profileHref}>
          <button className="cursor-pointer rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-emerald-600">
            {profileLabel}
          </button>
        </Link>

        <Link href="/api/auth/logout">
          <button className="cursor-pointer rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-emerald-600 hover:text-emerald-700">
            Logout
          </button>
        </Link>
      </div>
    </nav>
  );
}