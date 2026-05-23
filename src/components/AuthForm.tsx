"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  type: "login" | "register";
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm({ type }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.email || !emailRegex.test(form.email)) {
      alert("Email tidak valid. Gunakan format email lengkap.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        type === "login"
          ? "/api/auth/login"
          : "/api/auth/register";

      const payload =
        type === "login"
          ? { email: form.email, password: form.password }
          : form;

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // 🔐 LOGIN SUCCESS
      if (type === "login" && data.token) {
        localStorage.setItem("token", data.token);

        // redirect berdasarkan role
        if (data.user.role === "client") {
          router.push("/clients");
          return;
        }

        if (data.user.role === "freelancer") {
          router.push(`/freelancers/${data.user.id}`);
          return;
        }

        if (data.user.role === "admin") {
          router.push("/admin");
          return;
        }
      }

      // 🆕 REGISTER SUCCESS
      else if (type === "register" && res.ok) {
        alert("Register berhasil, silakan login");
        router.push("/login"); // 👉 ke login
      }

      // ❌ ERROR
      else {
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      
      {type === "register" && (
        <>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="border border-emerald-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            name="role"
            onChange={handleChange}
            className="border border-emerald-100 rounded-lg p-2"
          >
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border border-emerald-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="border border-emerald-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <button
        disabled={loading}
        className="bg-emerald-600 text-white rounded-lg p-2 hover:bg-emerald-700 transition disabled:opacity-50"
      >
        {loading
          ? "Loading..."
          : type === "login"
          ? "Login"
          : "Register"}
      </button>
    </form>
  );
}