"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Portfolio = {
  id: number;
  projectTitle: string | null;
  projectDescription: string | null;
  projectLink: string | null;
  imageUrl: string | null;
  imagePublicId?: string | null;
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
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
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

  const [portfolioForm, setPortfolioForm] = useState<{
    projectTitle: string;
    projectDescription: string;
    projectLink: string;
    image: File | null;
  }>({
    projectTitle: "",
    projectDescription: "",
    projectLink: "",
    image: null,
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatarUrl || null
  );

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
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setPortfolioForm({ ...portfolioForm, image: file });
      return;
    }

    setPortfolioForm({
      ...portfolioForm,
      [e.target.name]: (e.target as HTMLInputElement).value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview(profile.avatarUrl || null);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return alert("Pilih file gambar terlebih dahulu");

    setLoadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const res = await fetch(`/api/freelancers/${profile.userId}/avatar`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal upload avatar");
        return;
      }

      alert("Avatar berhasil diupload");
      setAvatarFile(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Server error saat upload avatar");
    } finally {
      setLoadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus avatar?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/freelancers/${profile.userId}/avatar`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal menghapus avatar");
        return;
      }

      alert("Avatar berhasil dihapus");
      setAvatarPreview(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Server error saat menghapus avatar");
    }
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
      const formData = new FormData();
      formData.append("projectTitle", portfolioForm.projectTitle);
      formData.append("projectDescription", portfolioForm.projectDescription);
      formData.append("projectLink", portfolioForm.projectLink);
      if (portfolioForm.image) {
        formData.append("image", portfolioForm.image);
      }

      const res = await fetch(`/api/freelancers/${profile.userId}/portfolios`, {
        method: "POST",
        body: formData,
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
        image: null,
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
      <div className="rounded-[30px] bg-linear-to-r  from-green-950 via-emerald-900 to-green-800 p-8 text-white shadow-xl shadow-emerald-500/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm text-emerald-50">Freelancer Dashboard</p>

            <div className="mt-2 flex items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={profile.user.name || "Avatar"}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 font-serif text-2xl font-bold text-white">
                    {profile.user.name?.charAt(0) || "F"}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Halo, {profile.user.name || "Freelancer"}
                </h1>

                <p className="mt-1 text-emerald-50">{profile.user.email}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold">
                {form.title || "Belum ada title"}
              </h2>

              <p className="mt-3 max-w-2xl text-emerald-50">
                {form.bio || "Belum ada bio."}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-md">
            <p className="text-sm text-emerald-50">Public Profile</p>
            <p className="mt-1 text-2xl font-bold">
              {profile.portfolios.length} Portfolio
            </p>
            <p className="mt-1 text-sm capitalize text-emerald-50">
              Visibility: {form.visibility}
            </p>
          </div>
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

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#edit-profile"
            className="rounded-2xl bg-emerald-800/35 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-emerald-950/50"
          >
            Update Profile
          </a>

          <a
            href="#add-portfolio"
            className="rounded-2xl bg-white/20 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/30"
          >
            Upload Portfolio
          </a>

          <div className="flex items-center gap-2">
            <input
              id="avatar-input"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <label
              htmlFor="avatar-input"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 cursor-pointer"
            >
              Pilih Foto
            </label>

            <button
              type="button"
              onClick={handleUploadAvatar}
              disabled={loadingAvatar}
              className="rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-900 disabled:opacity-50"
            >
              {loadingAvatar ? "Uploading..." : "Upload Foto"}
            </button>

            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="rounded-2xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Hapus Foto
            </button>
          </div>
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
            {profile.portfolios.length} Project
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div
          id="edit-profile"
          className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Manual Action
              </p>
              <h2 className="text-xl font-bold text-slate-800">
                Update Profile
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              Isi data lalu klik tombol update.
            </p>
          </div>

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
                placeholder="Frontend Developer"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                placeholder="Ceritakan tentang pengalaman kamu..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="public">Public</option>
                <option value="limited">Limited</option>
              </select>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-100 p-5">
              <p className="text-sm font-semibold text-emerald-800">
                Jangan lupa klik tombol ini setelah edit profil.
              </p>

              <button
                type="submit"
                disabled={loadingProfile}
                className="mt-4 rounded-2xl bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {loadingProfile ? "Updating Profile..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Profile Info</h2>

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
              <span className="font-semibold text-slate-800">Visibility:</span>{" "}
              <span className="capitalize">{form.visibility}</span>
            </p>
          </div>

          <div className="mt-6 rounded-3xl bg-emerald-100 p-5">
            <p className="text-sm font-semibold text-emerald-800">
              Tips untuk freelancer
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Lengkapi title, bio, skills, dan portfolio agar client lebih
              percaya saat melihat public profile kamu.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div
          id="add-portfolio"
          className="rounded-3xl bg-white p-6 shadow-sm"
        >
          <div>
            <p className="text-sm font-medium text-emerald-600">
              Manual Action
            </p>
            <h2 className="text-xl font-bold text-slate-800">
              Upload Portfolio
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Tambahkan project agar muncul di profile public.
            </p>
          </div>

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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Image File
              </label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handlePortfolioChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-100 p-5">
              <p className="text-sm font-semibold text-emerald-800">
                Klik tombol ini untuk upload portfolio.
              </p>

              <button
                type="submit"
                disabled={loadingPortfolio}
                className="mt-4 rounded-2xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingPortfolio
                  ? "Uploading Portfolio..."
                  : "Upload Portfolio"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Portfolio List
              </p>
              <h2 className="text-xl font-bold text-slate-800">
                Portfolio Saya
              </h2>
            </div>

            <a
              href="#add-portfolio"
              className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Upload Portfolio Baru
            </a>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {profile.portfolios.length > 0 ? (
              profile.portfolios.map((portfolio) => (
                <article
                  key={portfolio.id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50"
                >
                  {portfolio.imageUrl ? (
                    <img
                      src={portfolio.imageUrl}
                      alt={portfolio.projectTitle || "Portfolio image"}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-slate-200 text-sm text-slate-500">
                      No Image
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      {portfolio.projectTitle || "Untitled Project"}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {portfolio.projectDescription ||
                        "Belum ada deskripsi project."}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {portfolio.projectLink && (
                        <a
                          href={portfolio.projectLink}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-50"
                        >
                          Visit Project
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center md:col-span-2">
                <h3 className="text-lg font-bold text-slate-800">
                  Belum ada portfolio
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Klik tombol Upload Portfolio untuk menambahkan project pertama
                  kamu.
                </p>

                <a
                  href="#add-portfolio"
                  className="mt-5 inline-block rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Upload Portfolio Sekarang
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  </main>
);
}