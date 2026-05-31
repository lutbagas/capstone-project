export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  role: "freelancer" | "client";
};

export type LoginBody = {
  email: string;
  password: string;
};