"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Role = "admin" | "freelancer" | "client";
type Visibility = "public" | "limited";

type TokenPayload = {
  role?: Role;
  exp?: number;
};

type ManagedUser = {
  id: number;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  freelancerProfile: {
    id: number;
    title: string | null;
    bio: string | null;
    skills: string | null;
    phone: string | null;
    visibility: Visibility;
    updatedAt: string;
  } | null;
};

type DashboardForm = {
  name: string;
  title: string;
  bio: string;
  skills: string;
  phone: string;
  visibility: Visibility;
  password: string;
  confirmPassword: string;
};

const emptyForm: DashboardForm = {
  name: "",
  title: "",
  bio: "",
  skills: "",
  phone: "",
  visibility: "public",
  password: "",
  confirmPassword: "",
};

function toDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildForm(user: ManagedUser): DashboardForm {
  return {
    name: user.name || "",
    title: user.freelancerProfile?.title || "",
    bio: user.freelancerProfile?.bio || "",
    skills: user.freelancerProfile?.skills || "",
    phone: user.freelancerProfile?.phone || "",
    visibility: user.freelancerProfile?.visibility || "public",
    password: "",
    confirmPassword: "",
  };
}

function decodeTokenPayload(token: string): TokenPayload | null {
  const payload = token.split(".")[1];

  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(window.atob(paddedBase64)) as TokenPayload;
  } catch {
    return null;
  }
}

const authStorageKeys = ["token", "authToken", "adminToken", "user", "role"];
const authCookieNames = ["token", "authToken", "adminToken"];

function expireCookie(name: string) {
  const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const hostname = window.location.hostname;

  document.cookie = `${name}=; path=/; ${expires}; SameSite=Lax`;
  document.cookie = `${name}=; path=${window.location.pathname}; ${expires}; SameSite=Lax`;

  if (hostname) {
    document.cookie = `${name}=; path=/; domain=${hostname}; ${expires}; SameSite=Lax`;
    document.cookie = `${name}=; path=/; domain=.${hostname}; ${expires}; SameSite=Lax`;
  }
}

function clearStoredAuthToken() {
  authStorageKeys.forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });

  authCookieNames.forEach(expireCookie);
}

function roleBadge(role: Role) {
  if (role === "admin") {
    return "bg-red-50 text-red-600 border-red-100";
  }

  if (role === "freelancer") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  return "bg-blue-50 text-blue-700 border-blue-100";
}

export default function AdminDashboardManager() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<DashboardForm>(emptyForm);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const payload = token ? decodeTokenPayload(token) : null;
    const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false;

    if (!payload || payload.role !== "admin" || isExpired) {
      clearStoredAuthToken();
      router.replace("/login");
      return;
    }

    setCheckingAdmin(false);
  }, [router]);

  const profileUpdatedAt = useMemo(() => {
    if (!user) return "-";

    if (user.role === "freelancer") {
      return toDate(user.freelancerProfile?.updatedAt);
    }

    return toDate(user.updatedAt);
  }, [user]);

  const authHeaders = (): Record<string, string> => {
    const token = window.localStorage.getItem("token");

    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoadingSearch(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(
        `/api/admin/dashboard?email=${encodeURIComponent(email)}`,
        {
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setUser(null);
        setForm(emptyForm);
        setError(data.error || "Gagal mencari pengguna");
        return;
      }

      setUser(data.user);
      setForm(buildForm(data.user));
      setMessage("Data pengguna berhasil ditemukan.");
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    setMessage("");
    setError("");

    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (password && password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    setLoadingSave(true);

    try {
      const { confirmPassword: _confirmPassword, ...payload } = form;

      const res = await fetch("/api/admin/dashboard", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          email: user.email,
          ...payload,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal update dashboard pengguna");
        return;
      }

      setUser(data.user);
      setForm(buildForm(data.user));
      setMessage(data.message || "Dashboard pengguna berhasil diupdate.");
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoadingSave(false);
    }
  };

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

  const handleLogout = () => {
    clearStoredAuthToken();
    setUser(null);
    setForm(emptyForm);
    setEmail("");
    setMessage("");
    setError("");
    window.location.href = "/api/auth/logout";
  };

  if (checkingAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5FBF8] px-6">
        <div className="w-full max-w-md rounded-[30px] border border-emerald-100 bg-white p-8 text-center shadow-[0_25px_70px_rgba(16,185,129,0.14)]">
          <p className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 font-serif text-2xl font-bold text-emerald-700">
            IW
          </p>

          <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
            Admin Dashboard
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-slate-950">
            Mengecek akses admin...
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Kamu akan diarahkan ke halaman login jika akun tidak memiliki akses
            admin.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5FBF8] px-6 py-8 font-sans text-slate-950 md:px-10">
      <div className="mx-auto max-w-300">
        <nav className="mb-8 flex items-center justify-between rounded-[20px] border border-emerald-100 bg-white/85 px-8 py-3 shadow-[0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur-md">
          <Link
            href="/"
            className="font-serif text-[30px] font-bold tracking-tight text-emerald-700"
          >
            InfoWebLancers
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
            >
              Logout Admin
            </button>
          </div>
        </nav>

        <section className="grid items-center gap-8 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="mb-5 inline-block rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              Admin Dashboard
            </p>

            <h1 className="font-serif text-[48px] font-bold leading-[1.05] tracking-[-2px] text-slate-950 md:text-[68px]">
              Kelola Data Pengguna InfoWebLancers
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Cari akun berdasarkan email, lalu update informasi akun,
              password, dan data profile freelancer jika pengguna tersebut
              memiliki role freelancer.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">Admin</h3>
                <p className="mt-1 text-xs text-slate-500">Mode akses</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">User</h3>
                <p className="mt-1 text-xs text-slate-500">Cari email</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-950">Edit</h3>
                <p className="mt-1 text-xs text-slate-500">Update data</p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-emerald-100 bg-white p-6 shadow-[0_25px_70px_rgba(16,185,129,0.18)]">
            <div className="rounded-[26px] bg-linear-to-br from-emerald-100 via-slate-100 to-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
                Search User
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">
                Cari pengguna berdasarkan email
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Masukkan email akun yang ingin dikelola. Data user akan muncul
                setelah pencarian berhasil.
              </p>
            </div>

            <form onSubmit={handleSearch} className="mt-5">
              <label className="block text-sm font-semibold text-slate-700">
                Email pengguna
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh: user@email.com"
                className="mt-3 w-full rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
                required
              />

              <button
                type="submit"
                disabled={loadingSearch}
                className="mt-4 w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingSearch ? "Mencari..." : "Cari Pengguna"}
              </button>
            </form>
          </div>
        </section>

        {(message || error) && (
          <div
            className={`mt-8 rounded-2xl border px-5 py-4 text-sm font-medium ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        {user ? (
          <section className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
            <aside className="h-fit rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_18px_45px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-serif text-2xl font-bold text-white shadow-lg">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    {user.name || "No Name"}
                  </h2>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${roleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Email</p>
                  <p className="mt-1 break-all font-semibold text-slate-900">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">User ID</p>
                  <p className="mt-1 font-semibold text-slate-900">{user.id}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Dibuat</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {toDate(user.createdAt)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Update terakhir
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {profileUpdatedAt}
                  </p>
                </div>
              </div>
            </aside>

            <form
              onSubmit={handleSave}
              className="rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_18px_45px_rgba(16,185,129,0.1)] md:p-8"
            >
              <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
                    Edit User
                  </p>

                  <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">
                    Update Dashboard Pengguna
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                    Perubahan akan disimpan ke akun pengguna yang sedang dipilih.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loadingSave}
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingSave ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama pengguna"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>
                  <input
                    value={user.role}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Kosongkan jika tidak diganti"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ulangi password baru"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  />
                </div>
              </div>

              {user.role === "freelancer" ? (
                <div className="mt-8 rounded-[26px] border border-emerald-100 bg-[#F5FBF8] p-5 md:p-6">
                  <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
                      Freelancer Profile
                    </p>

                    <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">
                      Data Profile Freelancer
                    </h3>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Title
                      </label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Contoh: Frontend Developer"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Nomor WhatsApp atau telepon"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Skills
                      </label>
                      <input
                        name="skills"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="React, Next.js, Prisma"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Deskripsi singkat profile freelancer"
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Visibility
                      </label>
                      <select
                        name="visibility"
                        value={form.visibility}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                      >
                        <option value="public">Public</option>
                        <option value="limited">Limited</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6">
                  <h3 className="font-serif text-2xl font-bold text-slate-950">
                    User ini bukan freelancer
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Form profile freelancer hanya muncul untuk user dengan role
                    freelancer. Untuk client atau admin, kamu tetap bisa
                    mengubah nama dan password.
                  </p>
                </div>
              )}
            </form>
          </section>
        ) : (
          <section className="mt-10 rounded-[30px] border border-dashed border-emerald-200 bg-white px-6 py-14 text-center shadow-[0_10px_25px_rgba(16,185,129,0.08)]">
            <h2 className="font-serif text-3xl font-bold text-slate-950">
              Belum ada pengguna dipilih
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Cari pengguna berdasarkan email terlebih dahulu. Setelah data
              ditemukan, panel detail dan form update akan muncul di sini.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}