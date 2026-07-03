import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <Link href="#" className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">UniPortal</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <Link href="/" className="transition hover:text-white">Home</Link>
          <Link href="/programs" className="transition hover:text-white">Programs</Link>
          <Link href="/admission" className="transition hover:text-white">Apply</Link>
          <Link href="#testimonials" className="transition hover:text-white">Testimonials</Link>
          <Link href="#how-it-works" className="transition hover:text-white">How it Works</Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/programs" className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white">
            Programs
          </Link>
          <Link href="/admission" className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
            Enroll Now
          </Link>
        </div>
      </div>
    </header>
  );
}
