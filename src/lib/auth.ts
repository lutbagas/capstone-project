import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

type AuthPayload = {
  id: number;
  role: "client" | "freelancer" | "admin";
  iat?: number;
  exp?: number;
};

export async function getAuthPayload() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles: string[] = ["client", "freelancer", "admin"]) {
  const payload = await getAuthPayload();

  if (!payload || !allowedRoles.includes(payload.role)) {
    redirect("/login");
  }

  return payload;
}

export async function redirectIfAuthenticated() {
  const payload = await getAuthPayload();

  if (!payload) {
    return;
  }

  if (payload.role === "client") {
    redirect("/clients");
  }

  if (payload.role === "freelancer") {
    redirect(`/freelancers/${payload.id}`);
  }

  if (payload.role === "admin") {
    redirect("/admin");
  }
}
