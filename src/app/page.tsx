import "./globals.css";
import Link from "next/link";

type Developer = {
  title: string;
  price: string;
};

function Navbar() {
  return (
    <nav className="mx-auto mt-3.75 flex max-w-275 items-center justify-between rounded-[20px] border border-indigo-100 bg-white/80 px-8 py-3 text-slate-900 shadow-[0_10px_30px_rgba(79,70,229,0.12)] backdrop-blur-md">
      <div className="font-serif text-[30px] font-bold tracking-tight text-indigo-700">
        DevConnect
      </div>

      <ul className="flex list-none items-center gap-12.5 font-serif text-[15px] text-slate-600">
        <li className="rounded-full bg-indigo-600 px-4 py-1.5 text-white shadow-sm">
          Home
        </li>
        <li className="cursor-pointer transition duration-300 hover:text-indigo-700">
          About
        </li>
        <li className="cursor-pointer transition duration-300 hover:text-indigo-700">
          Services
        </li>
        <li className="cursor-pointer transition duration-300 hover:text-indigo-700">
          Contact
        </li>
      </ul>

      <div className="flex items-center">
        <Link href="/login">
          <button className="cursor-pointer rounded-full border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white">
            Login
          </button>
        </Link>

        <Link href="/register">
          <button className="ml-2.5 cursor-pointer rounded-full border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-indigo-600">
            Register
          </button>
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="px-10 py-10 text-center">
      <p className="mb-5 inline-block rounded-full border border-indigo-100 bg-white px-5 py-2 text-sm font-medium text-indigo-700 shadow-sm">
        Hire trusted freelance web developers
      </p>

      <h1 className="font-serif text-[100px] font-bold leading-[1.1] tracking-[-4px] text-slate-950">
        Find the Best Web <br />
        Developers for Your <br />
        Project
      </h1>

      <div className="mx-auto mt-8 h-150 w-full overflow-hidden rounded-[28px] border border-indigo-100 bg-[url('/images/hero.png')] bg-cover bg-center shadow-[0_25px_70px_rgba(79,70,229,0.22)]">
        <div className="flex h-full w-full items-end bg-linear-to-t from-indigo-950/55 via-indigo-950/10 to-transparent p-10">
          <div className="rounded-2xl bg-white/15 px-6 py-4 text-left text-white backdrop-blur-md">
            <p className="text-sm text-white/80">Available Talent</p>
            <h2 className="mt-1 font-serif text-4xl font-bold">500+</h2>
            <p className="mt-1 text-sm text-white/80">
              Professional developers ready to work
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type DeveloperCardProps = {
  data: Developer;
};

function DeveloperCard({ data }: DeveloperCardProps) {
  return (
    <div className="group rounded-[22px] border border-indigo-100 bg-white p-3 shadow-[0_10px_25px_rgba(79,70,229,0.08)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_24px_50px_rgba(79,70,229,0.18)]">
      <div className="mb-4 flex h-37.5 items-center justify-center rounded-[18px] bg-linear-to-br from-indigo-100 via-slate-100 to-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 font-serif text-2xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-110">
          {data.title.charAt(0)}
        </div>
      </div>

      <div className="px-1 pb-1">
        <h4 className="font-serif text-xl font-bold text-slate-950">
          {data.title}
        </h4>

        <div className="mt-3 flex items-center justify-between">
          <p className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
            {data.price}
          </p>

          <button className="rounded-full border border-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 transition duration-300 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-white px-10 py-10 font-serif text-slate-950 shadow-[0_-10px_30px_rgba(79,70,229,0.06)]">
      <div className="mx-auto max-w-275">
        <div className="grid grid-cols-4 gap-10">
          <div>
            <h3 className="text-3xl font-bold text-indigo-700">
              DevConnect
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Platform untuk menghubungkan client dengan freelance web developer
              profesional secara cepat, mudah, dan terpercaya.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Menu
            </h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li className="cursor-pointer transition hover:text-indigo-700">
                Home
              </li>
              <li className="cursor-pointer transition hover:text-indigo-700">
                About
              </li>
              <li className="cursor-pointer transition hover:text-indigo-700">
                Services
              </li>
              <li className="cursor-pointer transition hover:text-indigo-700">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Services
            </h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li className="cursor-pointer transition hover:text-indigo-700">
                Web Development
              </li>
              <li className="cursor-pointer transition hover:text-indigo-700">
                UI/UX Design
              </li>
              <li className="cursor-pointer transition hover:text-indigo-700">
                Frontend Developer
              </li>
              <li className="cursor-pointer transition hover:text-indigo-700">
                Backend Developer
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Contact
            </h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li>Email: devconnect@email.com</li>
              <li>Location: Jakarta, Indonesia</li>
              <li>Phone: +62 812 3456 7890</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>© 2026 DevConnect. All rights reserved.</p>

          <div className="flex gap-5">
            <span className="cursor-pointer transition hover:text-indigo-700">
              Privacy Policy
            </span>
            <span className="cursor-pointer transition hover:text-indigo-700">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const developers: Developer[] = [
    { title: "John Doe", price: "$75/hr" },
    { title: "Robert Johnson", price: "$60/hr" },
    { title: "Sarah Williams", price: "$65/hr" },
    { title: "Michael Brown", price: "$70/hr" },
    { title: "Emily Davis", price: "$65/hr" },
    { title: "David Wilson", price: "$60/hr" },
    { title: "Lisa Anderson", price: "$75/hr" },
    { title: "Alex Turner", price: "$55/hr" },
    { title: "Jennifer Lee", price: "$80/hr" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#F5F7FB] font-sans">
      <Navbar />
      <Hero />

      <section className="px-10 py-5">
        <div className="grid grid-cols-3 gap-4.5">
          {developers.map((dev, index) => (
            <DeveloperCard key={index} data={dev} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default App;