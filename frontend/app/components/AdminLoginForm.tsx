"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4200/api";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("ram@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setStatus("idle");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to sign in as admin.");
        setStatus("error");
        return;
      }

      setMessage(data.message || "Admin signed in successfully.");
      setStatus("success");
      router.push("/dashboard");
    } catch {
      setMessage("Unable to reach the server right now.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <Navbar />

      <main className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16 lg:px-12 lg:py-24">
        <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/20 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-950 px-8 py-12 text-white sm:px-10 lg:px-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Admin Access
            </div>
            <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Securely manage admissions from one dashboard.</h1>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Sign in to review applications, update status between pending and confirmed, and remove submissions in one place.
            </p>
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Why admins use UniPortal</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li>• Review every application from one screen</li>
                <li>• Move applicants between pending and confirmed</li>
                <li>• Keep admissions records organized and current</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-8 py-12 sm:px-10 lg:px-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Login</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Admin sign in</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use your admin credentials to access the management dashboard.
              </p>
            </div>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                placeholder="admin@uniportal.com"
                required
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                placeholder="Enter admin password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-cyan-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {message ? (
              <p className={`rounded-3xl px-4 py-3 text-sm ${status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
