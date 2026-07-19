"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

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
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center bg-[#f8fbff] px-6 py-20">
      <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/30 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-slate-950 px-8 py-12 text-white sm:px-10 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Admin Access</p>
          <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Manage admissions from one secure dashboard.</h1>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            Sign in to review every student application, change status to confirmed or pending, and remove outdated submissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-12 sm:px-10 lg:px-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Login</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Admin sign in</h2>
          </div>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
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
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
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
    </div>
  );
}
