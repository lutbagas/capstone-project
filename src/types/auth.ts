export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "freelancer" | "client";
};

export type LoginBody = {
  email: string;
  password: string;
};