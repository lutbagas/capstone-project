export default function Footer() {
  return (
    <footer className="mt-16 bg-white px-10 py-10 font-serif text-slate-950 shadow-[0_-10px_30px_rgba(79,70,229,0.06)]">
      <div className="mx-auto max-w-275">
        <div className="grid grid-cols-4 gap-10">
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
            <h4 className="mb-4 text-lg font-semibold text-slate-900">
              Menu
            </h4>

            <ul className="space-y-3 text-sm text-slate-500">
              <li>Home</li>
              <li>Developers</li>
              <li>Projects</li>
              <li>Contact</li>
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

            <ul className="space-y-3 text-sm text-slate-500">
              <li>Email: info@infoweblancers.com</li>
              <li>Location: Jakarta, Indonesia</li>
              <li>Phone: +62 812 3456 7890</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>© 2026 InfoWebLancers. All rights reserved.</p>

          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}