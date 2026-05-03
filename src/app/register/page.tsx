import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-6">
      <div className="w-full max-w-md rounded-[24px] border border-indigo-100 bg-white/80 p-8 shadow-[0_20px_60px_rgba(79,70,229,0.15)] backdrop-blur-md">

        <h1 className="text-center font-serif text-3xl font-bold text-indigo-700">
          Create Account
        </h1>

        <p className="mt-2 text-center text-sm text-slate-600">
          Join DevConnect
        </p>

        <div className="mt-6">
          <AuthForm type="register" />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}