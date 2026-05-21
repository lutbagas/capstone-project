"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Profile = {
  id: number;
  userId: number;
  companyName: string | null;
  description: string | null;
  user: {
    id: number;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
  };
};

type Props = {
  profile: Profile;
};

export default function ClientProfileEditor({ profile }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: profile.companyName || "",
    description: profile.description || "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      const res = await fetch(`/api/clients/${profile.userId}`, {
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

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[30px] bg-linear-to-r from-emerald-600 via-violet-600 to-purple-600 p-8 text-white shadow-xl">
          <p className="text-sm text-emerald-100">Client Dashboard</p>

          <h1 className="mt-2 text-3xl font-bold">
            Halo, {profile.user.name || "Client"}
          </h1>

          <p className="mt-2 text-emerald-100">{profile.user.email}</p>

          <div className="mt-6">
            <h2 className="text-2xl font-bold">
              {form.companyName || "Belum ada nama perusahaan"}
            </h2>

            <p className="mt-3 max-w-2xl text-emerald-100">
              {form.description || "Belum ada deskripsi perusahaan."}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Company Name</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              {form.companyName || "-"}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Role</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800">
              {profile.user.role}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Member Since</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              {new Date(profile.user.createdAt).toLocaleDateString()}
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
                  Company Name
                </label>
                <input
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="PT. Example Company"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Ceritakan tentang perusahaan Anda..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
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
                <span className="font-semibold text-slate-800">Client Profile ID:</span>{" "}
                {profile.id}
              </p>

              <p>
                <span className="font-semibold text-slate-800">Role:</span>{" "}
                {profile.user.role}
              </p>

              <p>
                <span className="font-semibold text-slate-800">Email:</span>{" "}
                {profile.user.email}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}