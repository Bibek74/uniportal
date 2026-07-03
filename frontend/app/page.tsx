import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthSection from "./components/AuthSection";
import ProgramCards from "./components/ProgramCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8 pt-10 lg:pt-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm shadow-cyan-200/80">
              <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
              Fast & secure applications
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
                Your Path to <span className="text-cyan-600">Academic Excellence</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Apply to world-class programs with our streamlined online admission system. Track your application in real-time and get admitted to your dream institution.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/admission"
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
              >
                Start Your Application
              </a>
              <a
                href="#watch-demo"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Watch Demo
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-3xl bg-white p-5 text-center shadow-sm shadow-slate-200/70">
                <p className="text-2xl font-semibold text-slate-950">150K+</p>
                <p className="mt-2 text-sm text-slate-500">Students Enrolled</p>
              </div>
              <div className="rounded-3xl bg-white p-5 text-center shadow-sm shadow-slate-200/70">
                <p className="text-2xl font-semibold text-slate-950">98%</p>
                <p className="mt-2 text-sm text-slate-500">Satisfaction Rate</p>
              </div>
              <div className="rounded-3xl bg-white p-5 text-center shadow-sm shadow-slate-200/70">
                <p className="text-2xl font-semibold text-slate-950">24/7</p>
                <p className="mt-2 text-sm text-slate-500">Support Available</p>
              </div>
              <div className="rounded-3xl bg-white p-5 text-center shadow-sm shadow-slate-200/70">
                <p className="text-2xl font-semibold text-slate-950">100%</p>
                <p className="mt-2 text-sm text-slate-500">Secure & Safe</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 to-cyan-600 px-8 py-10 text-white shadow-2xl shadow-slate-950/20 sm:px-10 sm:py-12">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl"></div>
            <div className="relative space-y-8">
              <div className="rounded-[2rem] bg-slate-950/95 p-6 shadow-lg shadow-black/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Application Progress</p>
                    <p className="mt-2 text-xl font-semibold">Step 3 of 7 completed</p>
                  </div>
                  <div className="rounded-3xl bg-cyan-400/10 px-4 py-3 text-cyan-200 backdrop-blur-sm">
                    Progress
                  </div>
                </div>
                <div className="mt-6 overflow-hidden rounded-full bg-white/10">
                  <div className="h-3 w-2/3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.55)]"></div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] bg-white/8 p-6">
                  <p className="text-3xl font-semibold">50K+</p>
                  <p className="mt-2 text-sm text-slate-200">Applications</p>
                </div>
                <div className="rounded-[2rem] bg-white/8 p-6">
                  <p className="text-3xl font-semibold">94%</p>
                  <p className="mt-2 text-sm text-slate-200">Success Rate</p>
                </div>
                <div className="rounded-[2rem] bg-white/8 p-6">
                  <p className="text-3xl font-semibold">200+</p>
                  <p className="mt-2 text-sm text-slate-200">Programs</p>
                </div>
                <div className="rounded-[2rem] bg-white/8 p-6">
                  <p className="text-3xl font-semibold">50+</p>
                  <p className="mt-2 text-sm text-slate-200">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AuthSection />

        <section id="features" className="mt-20 rounded-[3rem] border border-slate-200/80 bg-white px-8 py-12 shadow-2xl shadow-slate-200/20 sm:px-10 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Why choose UniPortal</p>
            <h2 className="mt-6 text-3xl font-semibold text-slate-950 sm:text-4xl">A complete admission experience built for students.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Easy application", description: "Submit your forms in minutes with a guided process." },
              { title: "Real-time tracking", description: "Check admission status anytime from one dashboard." },
              { title: "Global programs", description: "Access universities and colleges worldwide." },
              { title: "Secure data", description: "Your personal information is protected end-to-end." },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-6 shadow-sm shadow-slate-200/40">
                <p className="text-xl font-semibold text-slate-950">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <ProgramCards />

        <section id="testimonials" className="mt-20 rounded-[3rem] border border-slate-200/80 bg-white px-8 py-14 shadow-2xl shadow-slate-200/30 sm:px-10 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-600">Testimonials</p>
            <h2 className="mt-5 text-3xl font-semibold text-slate-950">Hear from successful applicants.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { name: "Aisha", note: "Fast application process and instant support." },
              { name: "Rohit", note: "I got accepted in weeks, not months." },
              { name: "Nina", note: "The dashboard kept me updated every step." },
            ].map((item) => (
              <div key={item.name} className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-6">
                <p className="font-semibold text-slate-950">{item.name}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-20 grid gap-8 lg:grid-cols-3">
          {[
            { title: "Create account", description: "Sign up and start your application in minutes." },
            { title: "Complete form", description: "Add your academic and personal details securely." },
            { title: "Get admitted", description: "Receive your offer and move forward with confidence." },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-sm shadow-slate-200/40">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">{item.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
