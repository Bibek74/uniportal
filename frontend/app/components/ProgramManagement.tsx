"use client";

import { useState } from "react";
import ProgramForm, { type Program } from "./ProgramForm";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4200/api";

type ProgramManagementProps = {
  programs: Program[];
  onProgramsChange: (programs: Program[]) => void;
  onMessage: (message: string) => void;
};

export default function ProgramManagement({
  programs,
  onProgramsChange,
  onMessage,
}: ProgramManagementProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const sortPrograms = (items: Program[]) =>
    [...items].sort((first, second) => first.name.localeCompare(second.name));

  const startEditing = (program: Program) => {
    setEditingId(program._id);
    setEditingName(program.name);
    setEditingDescription(program.description || "");
  };

  const updateProgram = async () => {
    if (!editingId || !editingName.trim()) {
      onMessage("Program name is required.");
      return;
    }

    setBusyId(editingId);
    try {
      const response = await fetch(`${API_BASE_URL}/programs/${editingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingName.trim(),
          description: editingDescription.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update program.");
      }

      onProgramsChange(
        sortPrograms(
          programs.map((program) =>
            program._id === editingId ? data.program : program,
          ),
        ),
      );
      setEditingId(null);
      onMessage(data.message || "Program updated successfully.");
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Unable to update program.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteProgram = async (program: Program) => {
    if (!window.confirm(`Delete "${program.name}"? This cannot be undone.`)) {
      return;
    }

    setBusyId(program._id);
    try {
      const response = await fetch(`${API_BASE_URL}/programs/${program._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete program.");
      }

      onProgramsChange(programs.filter((item) => item._id !== program._id));
      if (editingId === program._id) {
        setEditingId(null);
      }
      onMessage(data.message || "Program deleted successfully.");
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Unable to delete program.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <ProgramForm
        onCreated={(program) => {
          onProgramsChange(sortPrograms([...programs, program]));
          onMessage(`${program.name} was added successfully.`);
        }}
      />

      <section className="rounded-[2.5rem] border border-slate-200/80 bg-white p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">
          Program management
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">Existing programs</h2>

        <div className="mt-6 space-y-4">
          {programs.length === 0 ? (
            <p className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">
              No programs are available yet.
            </p>
          ) : (
            programs.map((program) => {
              const isEditing = editingId === program._id;

              return (
                <div key={program._id} className="rounded-3xl border border-slate-200 p-5">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        aria-label="Program name"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                      />
                      <textarea
                        value={editingDescription}
                        onChange={(event) => setEditingDescription(event.target.value)}
                        aria-label="Program description"
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-slate-950">{program.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {program.description || "No description provided."}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={updateProgram}
                          disabled={busyId === program._id}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {busyId === program._id ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEditing(program)}
                          className="rounded-full bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProgram(program)}
                          disabled={busyId === program._id}
                          className="rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                        >
                          {busyId === program._id ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
