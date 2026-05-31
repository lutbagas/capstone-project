"use client";

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
  if (!value) {
    return "-";
  }

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

  if (!payload) {
    return null;
  }

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
    if (!user) {
      return "-";
    }

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

    if (!user) {
      return;
    }

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Admin Dashboard
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Mengalihkan ke halaman login...
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Login memakai akun admin lewat halaman login biasa untuk membuka
            dashboard ini.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-4xl bg-linear-to-r from-slate-950 via-indigo-950 to-indigo-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-200">
              Admin Dashboard
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 md:w-auto"
            >
              Logout Admin
            </button>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">
                Kelola dashboard pengguna berdasarkan email
              </h1>
              <p className="mt-4 max-w-3xl text-indigo-100">
                Cari akun pengguna memakai email, lalu update data akun,
                password, dan profil freelancer yang tampil di dashboard.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm text-indigo-100">Mode akses</p>
              <p className="mt-2 text-2xl font-bold">Wajib akun admin</p>
              <p className="mt-2 text-sm text-indigo-100">
                Login lewat halaman login biasa, lalu gunakan akun admin untuk
                mengelola pengguna berdasarkan email.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-8 rounded-3xl bg-white p-6 shadow-sm"
        >
          <label className="block text-sm font-semibold text-slate-700">
            Email pengguna
          </label>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: user@email.com"
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
            <button
              type="submit"
              disabled={loadingSearch}
              className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loadingSearch ? "Mencari..." : "Cari Pengguna"}
            </button>
          </div>
        </form>

        {(message || error) && (
          <div
            className={`mt-5 rounded-2xl border px-5 py-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        {user && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <aside className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Detail Pengguna
              </h2>

              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Nama:</span>{" "}
                  {user.name || "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Email:</span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Role:</span>{" "}
                  <span className="capitalize">{user.role}</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    User ID:
                  </span>{" "}
                  {user.id}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Dibuat:
                  </span>{" "}
                  {toDate(user.createdAt)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Update profil terakhir:
                  </span>{" "}
                  {profileUpdatedAt}
                </p>
              </div>
            </aside>

            <form
              onSubmit={handleSave}
              className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    Editor Dashboard
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Update data {user.role}
                  </h2>
                </div>

                <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium capitalize text-indigo-700">
                  {user.role}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nama pengguna
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama pengguna"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Reset Password
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Kosongkan field password jika tidak ingin mengubah
                      password pengguna ini.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Password baru
                      </label>
                      <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimal 6 karakter"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Konfirmasi password
                      </label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Ulangi password baru"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                </div>

                {user.role === "freelancer" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Title
                      </label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Contoh: Full Stack Developer"
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
                        placeholder="Deskripsi singkat freelancer"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Skills
                        </label>
                        <input
                          name="skills"
                          value={form.skills}
                          onChange={handleChange}
                          placeholder="React, Next.js, UI Design"
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Nomor telepon
                        </label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="08xxxxxxxxxx"
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
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
                  </>
                )}

                {user.role === "client" && (
                  <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
                    Akun client hanya dapat diperbarui nama akun dan
                    passwordnya dari halaman admin ini.
                  </div>
                )}

                {user.role === "admin" && (
                  <div className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-800">
                    Akun admin tidak memiliki profile client/freelancer. Admin
                    dapat memperbarui nama akun dan reset password akun ini.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingSave}
                  className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loadingSave ? "Menyimpan..." : "Update Dashboard"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}