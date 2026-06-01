import Link from "next/link";

export default function Footer() {
  const email = "lutfi123456@gmail.com";

  return (
    <footer
      id="contact"
      className="mt-16 bg-white px-6 py-10 font-serif text-slate-950 shadow-[0_-10px_30px_rgba(16,185,129,0.06)] md:px-10"
    >
      <div className="mx-auto max-w-275">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-3xl font-bold text-emerald-700">
              InfoWebLancers
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Platform untuk menghubungkan client dengan freelance web developer
              profesional secara cepat, mudah, dan terpercaya.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">Menu</h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link href="/" className="transition hover:text-emerald-700">
                  Home
                </Link>
              </li>

              <li>
                <a
                  href="#freelancers"
                  className="transition hover:text-emerald-700"
                >
                  Developers
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  className="transition hover:text-emerald-700"
                >
                  Services
                </a>
              </li>

              <li>
                <a href="#contact" className="transition hover:text-emerald-700">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Services
            </h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li>Web Development</li>
              <li>UI/UX Design</li>
              <li>Frontend Developer</li>
              <li>Backend Developer</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Contact
            </h4>

            <p className="mb-4 text-sm leading-relaxed text-slate-500">
              Hubungi kami melalui email untuk diskusi project atau kebutuhan
              platform.
            </p>

            <a
              href={`mailto:${email}`}
              className="inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Send Email
            </a>

            <a
              href={`mailto:${email}`}
              className="mt-3 block text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 InfoWebLancers. All rights reserved.</p>

          <a
            href={`mailto:${email}`}
            className="font-medium text-emerald-700 transition hover:text-emerald-900"
          >
            Contact via Email
          </a>
        </div>
      </div>
    </footer>
  );
}