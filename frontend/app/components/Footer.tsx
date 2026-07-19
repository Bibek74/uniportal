import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:px-12">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">UniPortal</p>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Empowering students worldwide to achieve their academic dreams through innovative admission solutions.
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-white">Quick Links</p>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">About Us</Link>
          <Link href="/#programs" className="block text-sm text-slate-400 transition hover:text-white">Programs</Link>
          <Link href="/#features" className="block text-sm text-slate-400 transition hover:text-white">Admissions</Link>
          <Link href="/#contact" className="block text-sm text-slate-400 transition hover:text-white">Contact</Link>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-white">Resources</p>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">Help Center</Link>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">FAQs</Link>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">Blog</Link>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">Documentation</Link>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-white">Legal</p>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">Privacy Policy</Link>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">Terms of Service</Link>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">Cookie Policy</Link>
          <Link href="#" className="block text-sm text-slate-400 transition hover:text-white">GDPR</Link>
        </div>
      </div>
      <div className="border-t border-slate-800/80 px-6 py-6 text-center text-sm text-slate-500 lg:px-12">
        © 2026 UniPortal. All rights reserved.
      </div>
    </footer>
  );
}
