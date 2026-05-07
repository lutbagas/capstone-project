"use client";

import { useState } from "react";
import {
  Pencil,
  Eye,
  Phone,
  Briefcase,
  User,
  Globe,
  Plus,
  FolderOpen,
} from "lucide-react";

type Portfolio = {
  id: number;
  title: string;
  image: string;
  description: string;
};

type FreelancerProfile = {
  id: number;
  title: string;
  bio: string;
  skills: string[];
  phone: string;
  visibility: "public" | "private";
  createdAt: string;
  portfolios: Portfolio[];
};

const profile: FreelancerProfile = {
  id: 1,
  title: "Frontend Web Developer",
  bio: "Saya adalah freelance web developer yang fokus pada pembuatan website modern menggunakan Next.js, React, dan Tailwind CSS.",
  skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "MySQL"],
  phone: "+62 812-3456-7890",
  visibility: "public",
  createdAt: "2026",
  portfolios: [
    {
      id: 1,
      title: "E-Commerce Website",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      description: "Website toko online modern dengan fitur checkout.",
    },
    {
      id: 2,
      title: "Freelance Marketplace",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      description: "Platform freelance menggunakan Next.js.",
    },
  ],
};

export default function FreelancerDashboard() {
  const [data] = useState(profile);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <section className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[30px] bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <User size={40} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  {data.title || "Freelancer"}
                </h1>

                <p className="mt-2 max-w-xl text-sm text-indigo-100">
                  {data.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-indigo-700 shadow-lg transition hover:scale-105">
              <Pencil size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Visibility</p>
                <h2 className="mt-1 text-2xl font-bold capitalize">
                  {data.visibility}
                </h2>
              </div>

              <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600">
                <Eye />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <h2 className="mt-1 text-xl font-bold">{data.phone}</h2>
              </div>

              <div className="rounded-2xl bg-violet-100 p-4 text-violet-600">
                <Phone />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Portfolio</p>
                <h2 className="mt-1 text-2xl font-bold">
                  {data.portfolios.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-purple-100 p-4 text-purple-600">
                <Briefcase />
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT + ACTION */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* ABOUT */}
          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <Globe size={20} />
              </div>

              <h2 className="text-xl font-bold">About Freelancer</h2>
            </div>

            <p className="leading-relaxed text-slate-600">{data.bio}</p>

            <div className="mt-6">
              <h3 className="mb-3 font-semibold">Skills</h3>

              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PORTFOLIO */}
          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-purple-100 p-3 text-purple-600">
                  <FolderOpen size={20} />
                </div>

                <h2 className="text-xl font-bold">Portfolio Projects</h2>
              </div>

              <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
                <Plus size={18} />
                Add Portfolio
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {data.portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={portfolio.image}
                    alt={portfolio.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-lg font-bold">
                      {portfolio.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {portfolio.description}
                    </p>

                    <button className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}