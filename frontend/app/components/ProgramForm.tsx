"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4200/api";

type RequestStatus = "idle" | "success" | "error";

export type Program = {
  _id: string;
  name: string;
  description: string;
};

type ProgramFormProps = {
  onCreated?: (program: Program) => void;
};

export default function ProgramForm({ onCreated }: ProgramFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setStatus("idle");

    if (!name.trim()) {
      setMessage("Program name is required.");
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/programs`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Unable to create program.");
        setStatus("error");
        return;
      }

      setMessage(data.message || "Program created successfully.");
      setStatus("success");
      setName("");
      setDescription("");
      onCreated?.(data.program);
    } catch (error) {
      console.error("Program creation failed", error);
      setMessage("Could not connect to the server. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-[2.5rem] border border-slate-200/80 bg-slate-50 p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Program creation</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">Add a new program</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Create programs for applicants to choose from when they submit an admission request.
        </p>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Program name
        <input
          name="name"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          type="text"
          placeholder="e.g. Science"
          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Description
        <textarea
          name="description"
          value={description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
          rows={5}
          placeholder="Describe what this program offers"
          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Saving program..." : "Create program"}
      </button>

      {status !== "idle" && (
        <div
          className={`rounded-3xl px-4 py-3 text-sm ${
            status === "success"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
