import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgramCards from "../components/ProgramCards";

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <section className="space-y-8 pt-10 lg:pt-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Programs</p>
            <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              Find the right program and enroll today.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
              Browse available programs, then click enroll to begin your admission application with the selected study track.
            </p>
          </div>
        </section>

        <ProgramCards />
      </main>

      <Footer />
    </div>
  );
}
