"use client";

import Link from "next/link";

type Props = {
  userName: string;
  userId: number;
};

export default function ClientNavbar({
  userName,
  userId,
}: Props) {
  return (
    <nav className="mx-auto mt-3.5 flex max-w-275 items-center justify-between rounded-[20px] border border-emerald-100 bg-white/80 px-8 py-3 text-slate-900 shadow-[0_10px_30px_rgba(79,70,229,0.12)] backdrop-blur-md">
      <div className="font-serif text-[30px] font-bold tracking-tight text-emerald-700">
        InfoWebLancers
      </div>

      <ul className="flex list-none items-center gap-12 font-serif text-[15px] text-slate-600">
        <li className="rounded-full bg-emerald-600 px-4 py-1.5 text-white shadow-sm">
          Home
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
        <Link
  href="/api/auth/logout"
  className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
>
  Logout
</Link>

        <Link href={`/clients/profile/${userId}`}>
          <button className="cursor-pointer rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-emerald-600">
            Profile
          </button>
        </Link>
      </div>
    </nav>
  );
}