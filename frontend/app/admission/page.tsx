import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdmissionForm from "../components/AdmissionForm";

type AdmissionPageProps = {
  searchParams?: {
    programId?: string;
  };
};

export default function AdmissionPage({ searchParams }: AdmissionPageProps) {
  const programId = searchParams?.programId ?? "";

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8 pt-10 lg:pt-16">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Admission Application</p>
            <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              Apply to UniPortal with confidence
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Complete your application now and submit your academic details securely in one place.
            </p>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-slate-200/20 sm:p-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-600">Ready to apply?</p>
              <h2 className="text-3xl font-semibold text-slate-950">Fill out your admission form.</h2>
              <p className="text-sm leading-7 text-slate-600">
                Our application form sends your details directly to the admissions team.
              </p>
            </div>
          </div>
        </section>

        <AdmissionForm initialProgramId={programId} />
      </main>

      <Footer />
    </div>
  );
}
