"use client";

import Link from "next/link";

type Props = {
  userName: string;
  userId: number;
};

export default function ClientNavbar({ userName, userId }: Props) {
  return (
    <nav className="sticky top-3 z-50 mx-auto mt-3.5 flex max-w-275 items-center justify-between rounded-[20px] border border-emerald-100 bg-white/85 px-8 py-3 text-slate-900 shadow-[0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur-md">
      <Link
        href="/clients"
        className="font-serif text-[30px] font-bold tracking-tight text-emerald-700"
      >
        InfoWebLancers
      </Link>

      <ul className="hidden list-none items-center gap-12 font-serif text-[15px] text-slate-600 md:flex">
        <li>
          <Link
            href="/clients"
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-white shadow-sm"
          >
            Home
          </Link>
        </li>

        <li>
          <a
            href="#freelancers"
            className="transition hover:text-emerald-700"
          >
            Developers
          </a>
        </li>

        <li>
          <a href="#services" className="transition hover:text-emerald-700">
            Services
          </a>
        </li>

        <li>
          <a href="#contact" className="transition hover:text-emerald-700">
            Contact
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 md:block">
          {userName}
        </div>

        <Link
          href="/api/auth/logout"
          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
        >
          Logout
        </Link>

        <Link
          href={`/clients/profile/${userId}`}
          className="rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-emerald-600"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
}