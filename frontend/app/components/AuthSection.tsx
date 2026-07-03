"use client";

import { useState, type FormEvent } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4200/api";

export default function AuthSection() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const submitPath = mode === "login" ? "login" : "signup";

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setStatus("idle");

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setStatus("error");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/${submitPath}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        setStatus("error");
        return;
      }

      setMessage(data.message || `${mode === "login" ? "Logged in" : "Signed up"} successfully!`);
      setStatus("success");

      if (mode === "signup") {
        resetForm();
        setMode("login");
      }
    } catch (error) {
      setMessage("Unable to connect to the server. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login" className="mt-20 rounded-[2.5rem] border border-slate-200/80 bg-white px-8 py-12 shadow-2xl shadow-slate-200/20 sm:px-10 lg:px-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Account access</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Login or sign up to continue.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Use your account to apply directly and track your progress in real time.
          </p>
        </div>

        <div className="inline-flex overflow-hidden rounded-full border border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-6 py-3 text-sm font-semibold transition ${mode === "login" ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`px-6 py-3 text-sm font-semibold transition ${mode === "signup" ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Sign up
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2 grid gap-4">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Email address
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          {mode === "signup" ? (
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Confirm password
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type="password"
                placeholder="Re-enter your password"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
          ) : null}
        </div>

        <div className="sm:col-span-2 flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Processing..." : mode === "login" ? "Login" : "Create account"}
          </button>

          {message ? (
            <p className={`rounded-3xl px-5 py-4 text-sm ${status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
