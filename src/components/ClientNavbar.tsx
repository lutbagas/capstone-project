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
    <nav className="mx-auto mt-3.5 flex max-w-[1100px] items-center justify-between rounded-[20px] border border-indigo-100 bg-white/80 px-8 py-3 text-slate-900 shadow-[0_10px_30px_rgba(79,70,229,0.12)] backdrop-blur-md">
      <div className="font-serif text-[30px] font-bold tracking-tight text-indigo-700">
        InfoWebLancers
      </div>

      <ul className="flex list-none items-center gap-12 font-serif text-[15px] text-slate-600">
        <li className="rounded-full bg-indigo-600 px-4 py-1.5 text-white shadow-sm">
          Home
        </li>

        <li className="cursor-pointer transition hover:text-indigo-700">
          Developers
        </li>

        <li className="cursor-pointer transition hover:text-indigo-700">
          Projects
        </li>

        <li className="cursor-pointer transition hover:text-indigo-700">
          Contact
        </li>
      </ul>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
          {userName}
        </div>

        <Link href={`/clients/profile/${userId}`}>
          <button className="cursor-pointer rounded-full border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-indigo-600">
            Profile
          </button>
        </Link>
      </div>
    </nav>
  );
}