"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4200/api";

type AdmissionRecord = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "pending" | "confirmed";
  program?: { name?: string };
  createdAt?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<AdmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");

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

    void fetchApplications();

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
              onClick={logout}
              className="inline-flex items-center justify-center rounded-full border border-rose-300 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Logout
            </button>
          </div>
        </div>

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
                  visibleApplications.map((application) => (
                    <tr key={application._id} className="border-t border-slate-200/80">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">{application.firstName} {application.lastName}</div>
                        <div className="mt-1 text-slate-500">{application.email}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-700">{application.program?.name || "—"}</td>
                      <td className="px-5 py-4 text-slate-700">{application.phone || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${application.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {application.status === "confirmed" ? "Confirmed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
