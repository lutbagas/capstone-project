import "./globals.css";

type Developer = {
  title: string;
  price: string;
};

function Navbar() {
  return (
    <nav className="mx-auto mt-15px flex max-w-1100px items-center justify-between rounded-[20px] border border-black/10 bg-white/70 px-8 py-3 text-black shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <div className="font-serif text-[30px] font-bold tracking-tight">
        DevConnect
      </div>

      <ul className="flex list-none items-center gap-12.5 font-serif text-[15px] text-black/70">
        <li className="rounded-full bg-black px-4 py-1.5 text-white shadow-sm">
          Home
        </li>
        <li className="cursor-pointer transition duration-300 hover:text-black">
          About
        </li>
        <li className="cursor-pointer transition duration-300 hover:text-black">
          Services
        </li>
        <li className="cursor-pointer transition duration-300 hover:text-black">
          Contact
        </li>
      </ul>

      <div className="flex items-center">
        <button className="cursor-pointer rounded-full border border-black px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-black hover:text-white">
          Login
        </button>

        <button className="ml-2.5 cursor-pointer rounded-full border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black">
          Register
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="px-10 py-10 text-center">
      <p className="mb-5 inline-block rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-medium text-black/60 shadow-sm">
        Hire trusted freelance developers
      </p>

      <h1 className="font-serif text-[100px] font-bold leading-[1.1] tracking-[-4px] text-black">
        Find the Best Web <br />
        Developers for Your <br />
        Project
      </h1>

      <div className="mx-auto mt-8 h-150 w-full overflow-hidden rounded-[28px] border border-black/10 bg-[url('/images/hero.png')] bg-cover bg-center shadow-[0_25px_70px_rgba(0,0,0,0.18)]">
        <div className="h-full w-full bg-linear-to-t from-black/35 via-black/5 to-transparent" />
      </div>
    </section>
  );
}

type DeveloperCardProps = {
  data: Developer;
};

function DeveloperCard({ data }: DeveloperCardProps) {
  return (
    <div className="group rounded-[22px] border border-black/10 bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_24px_50px_rgba(0,0,0,0.14)]">
      <div className="mb-4 flex h-37.5 items-center justify-center rounded-[18px] bg-linear-to-br from-neutral-200 to-neutral-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black font-serif text-2xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-110">
          {data.title.charAt(0)}
        </div>
      </div>

      <div className="px-1 pb-1">
        <h4 className="font-serif text-xl font-bold text-black">
          {data.title}
        </h4>

        <div className="mt-3 flex items-center justify-between">
          <p className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-black">
            {data.price}
          </p>

          <button className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-black/70 transition duration-300 hover:border-black hover:bg-black hover:text-white">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 bg-white px-10 py-8 font-serif text-black shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
      <div className="mx-auto max-w-275">
        <h3 className="text-2xl font-bold">
          DevConnect
        </h3>

        <div className="mt-6 flex justify-around rounded-2xl bg-[#f5f5f5] px-6 py-5 text-black/70">
          <div className="cursor-pointer transition hover:text-black">Menu</div>
          <div className="cursor-pointer transition hover:text-black">Services</div>
          <div className="cursor-pointer transition hover:text-black">Contact</div>
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
    <main className="min-h-screen w-full bg-[#f5f5f5] font-sans">
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