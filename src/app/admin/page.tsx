import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function AdminDashboardPage() {
  const authPayload = await requireAuth(["admin"]);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalClients = users.filter((user) => user.role === "client").length;
  const totalFreelancers = users.filter((user) => user.role === "freelancer").length;
  const totalAdmins = users.filter((user) => user.role === "admin").length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-[#F5FBF8] pb-6">
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <div className="flex flex-col gap-6 overflow-hidden rounded-[30px] border border-emerald-100 bg-white px-8 py-8 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[3px] text-emerald-600">
                Admin Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950">
                Kelola Semua Pengguna
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                Lihat statistik akun dan kelola pengguna yang terdaftar di platform.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Link
                href="/admin"
                className="inline-flex rounded-full border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                Home
              </Link>
              <Link
                href="/api/auth/logout"
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Ringkasan Akun</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Statistik Pengguna
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Admin</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{totalAdmins}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Client</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{totalClients}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Freelancer</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{totalFreelancers}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Nama</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Terdaftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">{user.id}</td>
                      <td className="px-4 py-4">{user.name || "-"}</td>
                      <td className="px-4 py-4">{user.email}</td>
                      <td className="px-4 py-4 capitalize">{user.role}</td>
                      <td className="px-4 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <ChangePasswordForm />
          </div>
        </div>
      </section>
    </main>
  );
}
