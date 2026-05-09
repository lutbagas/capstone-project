"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Portfolio = {
  id: number;
  projectTitle: string | null;
  projectDescription: string | null;
  projectLink: string | null;
  image: string | null;
};

type Profile = {
  id: number;
  userId: number;
  title: string | null;
  bio: string | null;
  skills: string | null;
  phone: string | null;
  visibility: "public" | "limited";
  user: {
    id: number;
    name: string | null;
    email: string;
    role: string;
  };
  portfolios: Portfolio[];
};

type Props = {
  profile: Profile;
};

export default function FreelancerProfileEditor({ profile }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: profile.title || "",
    bio: profile.bio || "",
    skills: profile.skills || "",
    phone: profile.phone || "",
    visibility: profile.visibility || "public",
  });

  const [portfolioForm, setPortfolioForm] = useState({
    projectTitle: "",
    projectDescription: "",
    projectLink: "",
    image: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  const skillList = form.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePortfolioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPortfolioForm({
      ...portfolioForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      const res = await fetch(`/api/freelancers/${profile.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal update profile");
        return;
      }

      alert("Profile berhasil diupdate");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPortfolio(true);

    try {
      const res = await fetch(`/api/freelancers/${profile.userId}/portfolios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolioForm),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal tambah portfolio");
        return;
      }

      alert("Portfolio berhasil ditambahkan");

      setPortfolioForm({
        projectTitle: "",
        projectDescription: "",
        projectLink: "",
        image: "",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const handleDeletePortfolio = async (portfolioId: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus portfolio ini?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal hapus portfolio");
        return;
      }

      alert("Portfolio berhasil dihapus");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[30px] bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white shadow-xl">
          <p className="text-sm text-indigo-100">Freelancer Dashboard</p>

          <h1 className="mt-2 text-3xl font-bold">
            Halo, {profile.user.name || "Freelancer"}
          </h1>

          <p className="mt-2 text-indigo-100">{profile.user.email}</p>

          <div className="mt-6">
            <h2 className="text-2xl font-bold">
              {form.title || "Belum ada title"}
            </h2>

            <p className="mt-3 max-w-2xl text-indigo-100">
              {form.bio || "Belum ada bio."}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {skillList.length > 0 ? (
              skillList.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur-md"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-white/20 px-4 py-1 text-sm">
                Belum ada skill
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Visibility</p>
            <h2 className="mt-1 text-2xl font-bold capitalize text-slate-800">
              {form.visibility}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Phone</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800">
              {form.phone || "-"}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Portfolio</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              {profile.portfolios.length}
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800">
              Edit Profile
            </h2>

            <form onSubmit={handleUpdateProfile} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Frontend Web Developer"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={5}
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Ceritakan tentang pengalaman dan keahlian kamu..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Skills
                </label>
                <input
                  name="skills"
                  type="text"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Next.js, Tailwind CSS"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Pisahkan skill dengan koma.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+62 812-3456-7890"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={form.visibility}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="public">Public</option>
                  <option value="limited">Limited</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loadingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              Profile Info
            </h2>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">User ID:</span>{" "}
                {profile.user.id}
              </p>

              <p>
                <span className="font-semibold text-slate-800">
                  Freelancer Profile ID:
                </span>{" "}
                {profile.id}
              </p>

              <p>
                <span className="font-semibold text-slate-800">Role:</span>{" "}
                {profile.user.role}
              </p>

              <p>
                <span className="font-semibold text-slate-800">
                  Visibility:
                </span>{" "}
                {form.visibility}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              Add Portfolio
            </h2>

            <form onSubmit={handleAddPortfolio} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project Title
                </label>
                <input
                  name="projectTitle"
                  type="text"
                  value={portfolioForm.projectTitle}
                  onChange={handlePortfolioChange}
                  placeholder="E-Commerce Website"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project Description
                </label>
                <textarea
                  name="projectDescription"
                  rows={4}
                  value={portfolioForm.projectDescription}
                  onChange={handlePortfolioChange}
                  placeholder="Deskripsi singkat project..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project Link
                </label>
                <input
                  name="projectLink"
                  type="text"
                  value={portfolioForm.projectLink}
                  onChange={handlePortfolioChange}
                  placeholder="https://example.com"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Image URL
                </label>
                <input
                  name="image"
                  type="text"
                  value={portfolioForm.image}
                  onChange={handlePortfolioChange}
                  placeholder="https://image-url.com/image.jpg"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPortfolio}
                className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loadingPortfolio ? "Adding..." : "Add Portfolio"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800">Portfolio</h2>

            <p className="mt-1 text-sm text-slate-500">
              Portfolio terhubung ke FreelancerProfile ID {profile.id}.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {profile.portfolios.length > 0 ? (
                profile.portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50"
                  >
                    {portfolio.image ? (
                      <img
                        src={portfolio.image}
                        alt={portfolio.projectTitle || "Portfolio image"}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center bg-slate-200 text-sm text-slate-500">
                        No Image
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-800">
                        {portfolio.projectTitle || "Untitled Project"}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {portfolio.projectDescription ||
                          "Belum ada deskripsi project."}
                      </p>

                      {portfolio.projectLink && (
                        <a
                          href={portfolio.projectLink}
                          target="_blank"
                          className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
                        >
                          Lihat Project
                        </a>
                      )}

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePortfolio(portfolio.id)}
                          className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center md:col-span-2">
                  <h3 className="text-lg font-bold text-slate-800">
                    Belum ada portfolio
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Tambahkan project pertama kamu agar client bisa melihat
                    hasil kerja kamu.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}