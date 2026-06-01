import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { redirectIfAuthenticated } from "@/lib/auth";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <main className="min-h-screen bg-[#F5FBF8] px-6 py-8 font-sans text-slate-950">
      <div className="mx-auto flex max-w-275 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-[30px] font-bold tracking-tight text-emerald-700"
        >
          InfoWebLancers
        </Link>

        <Link
          href="/"
          className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50"
        >
          Home
        </Link>
      </div>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-275 items-center gap-10 py-10 lg:grid-cols-[1fr_440px]">
        <div className="hidden lg:block">
          <p className="mb-5 inline-block rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm">
            Join InfoWebLancers
          </p>

          <h1 className="font-serif text-[64px] font-bold leading-[1.05] tracking-[-2px] text-slate-950">
            Buat akun dan mulai terhubung dengan peluang project.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
            Daftar sebagai client untuk mencari freelancer web developer, atau
            sebagai freelancer untuk membuat profile dan menampilkan kemampuan
            kamu.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">Client</h3>
              <p className="mt-1 text-xs text-slate-500">Buat project</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">Talent</h3>
              <p className="mt-1 text-xs text-slate-500">Tampilkan skill</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">Profile</h3>
              <p className="mt-1 text-xs text-slate-500">Lebih dipercaya</p>
            </div>
          </div>
        </div>

        <div className="w-full rounded-4xl border border-emerald-100 bg-white/90 p-8 shadow-[0_25px_70px_rgba(16,185,129,0.18)] backdrop-blur-md">
          <div className="mb-7 text-center">
            <p className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 font-serif text-2xl font-bold text-emerald-700">
              IW
            </p>

            <h1 className="font-serif text-3xl font-bold text-slate-950">
              Create Account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join InfoWebLancers and start your journey.
            </p>
          </div>

          <AuthForm type="register" />

          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Login
            </Link>
          </div>

          <Link
            href="/"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}