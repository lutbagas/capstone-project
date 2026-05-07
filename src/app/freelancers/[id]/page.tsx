type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FreelancerDetailPage({ params }: Props) {
  const { id } = await params;

  const profile = {
    id,
    title: "Frontend Web Developer",
    bio: "Saya adalah freelance web developer yang fokus pada pembuatan website modern menggunakan Next.js, React, dan Tailwind CSS.",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "MySQL"],
    phone: "+62 812-3456-7890",
    visibility: "public",
    portfolios: [],
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[30px] bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold">
            Freelancer ID: {profile.id}
          </h1>

          <p className="mt-2 text-indigo-100">{profile.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/20 px-4 py-1 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Visibility</p>
            <h2 className="mt-1 text-2xl font-bold">{profile.visibility}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Phone</p>
            <h2 className="mt-1 text-xl font-bold">{profile.phone}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Portfolio</p>
            <h2 className="mt-1 text-2xl font-bold">
              {profile.portfolios.length}
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}