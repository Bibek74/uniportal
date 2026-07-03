"use client";

import { useEffect, useState } from "react";

type ProgramOption = {
  _id: string;
  name: string;
  description: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4200/api";

export default function ProgramCards() {
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/programs`);
        const data = await response.json();
        if (response.ok && data.programs) {
          setPrograms(data.programs);
        }
      } catch (error) {
        console.error("Failed to load programs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <section id="programs" className="mt-20 rounded-[3rem] bg-slate-950 px-8 py-14 text-white shadow-2xl shadow-slate-950/30 sm:px-10 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Programs</p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight">Choose your program and enroll now.</h2>
          <p className="mt-4 max-w-xl text-slate-300">
            Select a program below to start your admission application directly with the right study track.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {loading ? (
            <div className="col-span-2 rounded-[2rem] bg-white/10 p-8 text-slate-200">Loading programs...</div>
          ) : programs.length ? (
            programs.map((program) => (
              <div key={program._id} className="rounded-[2rem] bg-white/10 p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold">{program.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{program.description}</p>
                  </div>
                  <a
                    href={`/admission?programId=${encodeURIComponent(program._id)}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Enroll now
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 rounded-[2rem] bg-white/10 p-8 text-slate-200">No programs available yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
