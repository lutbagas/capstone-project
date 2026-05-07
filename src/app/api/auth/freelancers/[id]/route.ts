import { NextResponse } from "next/server";

const freelancers = [
  {
    id: 1,
    name: "Budi",
    email: "budi@gmail.com",
    role: "freelancer",
    bio: "Frontend Developer",
  },
  {
    id: 2,
    name: "Andi",
    email: "andi@gmail.com",
    role: "freelancer",
    bio: "Backend Developer",
  },
];

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const freelancer = freelancers.find(
    (f) => f.id === Number(params.id)
  );

  if (!freelancer) {
    return NextResponse.json(
      { error: "Freelancer tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(freelancer);
}