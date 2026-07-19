"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgramManagement from "../components/ProgramManagement";
import type { Program } from "../components/ProgramForm";

const EMPTY_EDITING_STATE = {
  id: "",
  firstName: "",
  lastName: "",
  middleName: "",
  dob: "",
  gender: "male",
  nationality: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  country: "",
  previousSchool: "",
  graduationYear: "",
  gpa: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  termsAgreed: false,
  status: "pending" as "pending" | "confirmed",
  programId: "",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4200/api";

type AdmissionRecord = {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  email: string;
  phone: string;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  previousSchool?: string;
  graduationYear?: number | string;
  gpa?: number | string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  termsAgreed?: boolean;
  status: "pending" | "confirmed";
  program?: { name?: string; _id?: string };
  createdAt?: string;
};

type EditingState = typeof EMPTY_EDITING_STATE;

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<AdmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showProgramForm, setShowProgramForm] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchApplications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admission/all`, {
          credentials: "include",
        });

        const data = await response.json();
        if (!isActive) {
          return;
        }

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push("/login");
            return;
          }
          throw new Error(data.message || "Failed to load applications.");
        }

        setApplications(data.result || []);
      } catch (error) {
        if (!isActive) {
          return;
        }
        setMessage(error instanceof Error ? error.message : "Unable to load applications.");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/programs`, {
          credentials: "include",
        });

        const data = await response.json();
        if (!isActive) {
          return;
        }

        if (response.ok) {
          setPrograms(data.programs || []);
        }
      } catch {
        // Ignore program loading errors and keep the dashboard usable.
      }
    };

    void fetchApplications();
    void fetchPrograms();

    return () => {
      isActive = false;
    };
  }, [router]);

  const updateStatus = async (id: string, status: "pending" | "confirmed") => {
    setBusyId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/admission/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to update application.");
      }

      setApplications((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
      setMessage("Application status updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update application.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteApplication = async (id: string) => {
    setBusyId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/admission/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to delete application.");
      }

      setApplications((prev) => prev.filter((item) => item._id !== id));
      setMessage("Application removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to remove application.");
    } finally {
      setBusyId(null);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore logout errors and redirect to login anyway.
    } finally {
      router.push("/login");
    }
  };

  const startEdit = (application: AdmissionRecord) => {
    setEditing({
      ...EMPTY_EDITING_STATE,
      id: application._id,
      firstName: application.firstName || "",
      lastName: application.lastName || "",
      middleName: application.middleName || "",
      dob: application.dob || "",
      gender: application.gender || "male",
      nationality: application.nationality || "",
      email: application.email || "",
      phone: application.phone || "",
      streetAddress: application.address?.streetAddress || "",
      city: application.address?.city || "",
      state: application.address?.state || "",
      country: application.address?.country || "",
      previousSchool: application.previousSchool || "",
      graduationYear: application.graduationYear?.toString() || "",
      gpa: application.gpa?.toString() || "",
      emergencyContactName: application.emergencyContact?.name || "",
      emergencyContactPhone: application.emergencyContact?.phone || "",
      emergencyContactRelationship: application.emergencyContact?.relationship || "",
      termsAgreed: application.termsAgreed ?? false,
      status: application.status,
      programId: application.program?._id || "",
    });
  };

  const cancelEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) {
      return;
    }

    setBusyId(editing.id);
    try {
      const response = await fetch(`${API_BASE_URL}/admission/update/${editing.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: editing.firstName,
          middleName: editing.middleName,
          lastName: editing.lastName,
          dob: editing.dob,
          gender: editing.gender,
          nationality: editing.nationality,
          email: editing.email,
          phone: editing.phone,
          streetAddress: editing.streetAddress,
          city: editing.city,
          state: editing.state,
          country: editing.country,
          previousSchool: editing.previousSchool,
          graduationYear: editing.graduationYear ? Number(editing.graduationYear) : undefined,
          gpa: editing.gpa ? Number(editing.gpa) : undefined,
          emergencyContactName: editing.emergencyContactName,
          emergencyContactPhone: editing.emergencyContactPhone,
          emergencyContactRelationship: editing.emergencyContactRelationship,
          termsAgreed: editing.termsAgreed,
          programId: editing.programId || undefined,
          status: editing.status,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to update application.");
      }

      setApplications((prev) => prev.map((item) => (item._id === editing.id ? { ...item, ...editing } : item)));
      setMessage("Application updated successfully.");
      setEditing(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update application.");
    } finally {
      setBusyId(null);
    }
  };

  const visibleApplications = applications.filter((application) => {
    if (filter === "all") {
      return true;
    }

    return application.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#f8fbff] px-6 py-10 text-slate-950 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[2.5rem] border border-slate-200/80 bg-white p-8 shadow-2xl shadow-slate-200/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Application management</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Review all admissions, switch their status between pending and confirmed, and remove applications when necessary.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowProgramForm((current) => !current)}
              className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              {showProgramForm ? "Close program form" : "Add program"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-full border border-rose-300 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Logout
            </button>
          </div>
        </div>

        {showProgramForm ? (
          <div className="mt-8">
            <ProgramManagement
              programs={programs}
              onProgramsChange={setPrograms}
              onMessage={setMessage}
            />
          </div>
        ) : null}

        {message ? (
          <div className="mt-6 rounded-[1.75rem] border border-cyan-200 bg-cyan-50 px-5 py-4 text-sm text-cyan-800">
            {message}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {(["all", "pending", "confirmed"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === option ? "bg-cyan-600 text-white" : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"}`}
            >
              {option === "all" ? "All applications" : option === "pending" ? "Pending" : "Confirmed"}
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/20">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-100">
                <tr>
                  <th className="px-5 py-4 font-medium">Student</th>
                  <th className="px-5 py-4 font-medium">Program</th>
                  <th className="px-5 py-4 font-medium">Contact</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">Loading applications...</td>
                  </tr>
                ) : visibleApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">No applications found for this view.</td>
                  </tr>
                ) : (
                  visibleApplications.map((application) => {
                    const isEditing = editing?.id === application._id;

                    return (
                      <tr key={application._id} className="border-t border-slate-200/80">
                        <td className="px-5 py-4">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">First name</label>
                                  <input
                                    value={editing?.firstName ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, firstName: event.target.value } : prev)}
                                    placeholder="First name"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Middle name</label>
                                  <input
                                    value={editing?.middleName ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, middleName: event.target.value } : prev)}
                                    placeholder="Middle name"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Last name</label>
                                  <input
                                    value={editing?.lastName ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, lastName: event.target.value } : prev)}
                                    placeholder="Last name"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</label>
                                  <input
                                    value={editing?.email ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, email: event.target.value } : prev)}
                                    placeholder="Email"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone</label>
                                  <input
                                    value={editing?.phone ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, phone: event.target.value } : prev)}
                                    placeholder="Phone"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date of birth</label>
                                  <input
                                    value={editing?.dob ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, dob: event.target.value } : prev)}
                                    placeholder="Date of birth"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nationality</label>
                                  <input
                                    value={editing?.nationality ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, nationality: event.target.value } : prev)}
                                    placeholder="Nationality"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Gender</label>
                                  <select
                                    value={editing?.gender ?? "male"}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, gender: event.target.value } : prev)}
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="font-semibold text-slate-900">{application.firstName} {application.lastName}</div>
                              <div className="mt-1 text-slate-500">{application.email}</div>
                            </>
                          )}
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Program</label>
                                <select
                                  value={editing?.programId ?? ""}
                                  onChange={(event) => setEditing((prev) => prev ? { ...prev, programId: event.target.value } : prev)}
                                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                >
                                  <option value="">Select program</option>
                                  {programs.map((program) => (
                                    <option key={program._id} value={program._id}>{program.name}</option>
                                  ))}
                                </select>
                                {application.program?.name ? (
                                  <p className="text-xs text-slate-500">Current: {application.program.name}</p>
                                ) : null}
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Previous school</label>
                                <input
                                  value={editing?.previousSchool ?? ""}
                                  onChange={(event) => setEditing((prev) => prev ? { ...prev, previousSchool: event.target.value } : prev)}
                                  placeholder="Previous school"
                                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Graduation year</label>
                                  <input
                                    value={editing?.graduationYear ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, graduationYear: event.target.value } : prev)}
                                    placeholder="Graduation year"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">GPA</label>
                                  <input
                                    value={editing?.gpa ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, gpa: event.target.value } : prev)}
                                    placeholder="GPA"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div>{application.program?.name || "—"}</div>
                              <div className="text-slate-500">{application.previousSchool || "—"}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Street address</label>
                                <input
                                  value={editing?.streetAddress ?? ""}
                                  onChange={(event) => setEditing((prev) => prev ? { ...prev, streetAddress: event.target.value } : prev)}
                                  placeholder="Street address"
                                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">City</label>
                                  <input
                                    value={editing?.city ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, city: event.target.value } : prev)}
                                    placeholder="City"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">State</label>
                                  <input
                                    value={editing?.state ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, state: event.target.value } : prev)}
                                    placeholder="State"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Country</label>
                                  <input
                                    value={editing?.country ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, country: event.target.value } : prev)}
                                    placeholder="Country"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Emergency contact</label>
                                  <input
                                    value={editing?.emergencyContactName ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, emergencyContactName: event.target.value } : prev)}
                                    placeholder="Emergency contact"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Emergency phone</label>
                                  <input
                                    value={editing?.emergencyContactPhone ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, emergencyContactPhone: event.target.value } : prev)}
                                    placeholder="Emergency phone"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Relationship</label>
                                  <input
                                    value={editing?.emergencyContactRelationship ?? ""}
                                    onChange={(event) => setEditing((prev) => prev ? { ...prev, emergencyContactRelationship: event.target.value } : prev)}
                                    placeholder="Relationship"
                                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div>{application.phone || "—"}</div>
                              <div className="text-slate-500">{application.address?.city ? `${application.address.city}, ${application.address.country || ""}`.trim() : "—"}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</label>
                                <select
                                  value={editing?.status ?? "pending"}
                                  onChange={(event) => setEditing((prev) => prev ? { ...prev, status: event.target.value as "pending" | "confirmed" } : prev)}
                                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                </select>
                              </div>
                              <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={editing?.termsAgreed ?? false}
                                  onChange={(event) => setEditing((prev) => prev ? { ...prev, termsAgreed: event.target.checked } : prev)}
                                />
                                Terms agreed
                              </label>
                            </div>
                          ) : (
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${application.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                              {application.status === "confirmed" ? "Confirmed" : "Pending"}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={saveEdit}
                                  disabled={busyId === editing.id}
                                  className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(application)}
                                  className="rounded-full bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateStatus(application._id, application.status === "confirmed" ? "pending" : "confirmed")}
                                  disabled={busyId === application._id}
                                  className="rounded-full bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  {application.status === "confirmed" ? "Mark pending" : "Mark confirmed"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteApplication(application._id)}
                                  disabled={busyId === application._id}
                                  className="rounded-full border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
