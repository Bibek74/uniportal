"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

type AdmissionFormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  nationality: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  previousSchool: string;
  graduationYear: string;
  gpa: string;
  programId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  termsAgreed: boolean;
};

type ProgramOption = {
  _id: string;
  name: string;
};

type AdmissionFormProps = {
  initialProgramId?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4200/api";

export default function AdmissionForm({ initialProgramId = "" }: AdmissionFormProps) {
  const [formData, setFormData] = useState<AdmissionFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
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
    programId: initialProgramId,
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    termsAgreed: false,
  });
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const step1Fields: Array<keyof AdmissionFormData> = [
    "firstName",
    "middleName",
    "lastName",
    "dob",
    "gender",
    "programId",
    "nationality",
    "email",
    "phone",
  ];

  const step2Fields: Array<keyof AdmissionFormData> = [
    "streetAddress",
    "city",
    "state",
    "country",
    "previousSchool",
    "graduationYear",
    "gpa",
    "emergencyContactName",
    "emergencyContactPhone",
    "emergencyContactRelationship",
    "termsAgreed",
  ];

  const validateStep = (fields: Array<keyof AdmissionFormData>) => {
    const missingField = fields.find((field) => {
      const value = formData[field];
      return typeof value === "boolean" ? value === false : !value;
    });

    if (missingField) {
      setMessage("Please fill in all required fields before continuing.");
      setStatus("error");
      return false;
    }

    setMessage("");
    setStatus("idle");
    return true;
  };

  const handleNext = () => {
    if (validateStep(step1Fields)) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStatus("idle");
    setMessage("");
    setStep(1);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? (target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/programs`);
      const data = await response.json();
      if (response.ok && data.programs) {
        setPrograms(data.programs);
      }
    } catch (err) {
      console.error("Failed to load programs", err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setStatus("idle");

    if (step === 1) {
      handleNext();
      return;
    }

    if (!validateStep(step2Fields)) {
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      gender: formData.gender.toLowerCase(),
      graduationYear: Number(formData.graduationYear),
      gpa: Number(formData.gpa),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admission/apply`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to submit admission.");
        setStatus("error");
        return;
      }

      setMessage(data.message || "Your admission application was submitted successfully.");
      setStatus("success");
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        gender: "",
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
        programId: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        termsAgreed: false,
      });
    } catch (error) {
      setMessage("Could not connect to the server. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="get-started" className="mt-20 rounded-[2.5rem] border border-slate-200/80 bg-white px-8 py-12 shadow-2xl shadow-slate-200/20 sm:px-10 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Admission application</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Apply now in a few simple steps.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Complete your application and submit your academic details securely through our system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 rounded-[2.5rem] border border-slate-200/80 bg-slate-50 p-8">
          <div className="flex flex-col gap-3 rounded-[1.75rem] bg-slate-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Step {step} of 2</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {step === 1 ? "Personal & program details" : "Academic & emergency details"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${step === 1 ? "bg-cyan-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                  1
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${step === 2 ? "bg-cyan-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                  2
                </span>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  First name
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Middle name
                  <input
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Last name
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Date of birth
                  <input
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    type="date"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Gender
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Program
                  <select
                    name="programId"
                    value={formData.programId}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">Select program</option>
                    {programs.map((program) => (
                      <option key={program._id} value={program._id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Nationality
                  <input
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Email
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Phone
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Street address
                  <input
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  City
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  State
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Country
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Previous school
                  <input
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Graduation year
                  <input
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    type="number"
                    min="1900"
                    max="2100"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  GPA
                  <input
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Emergency contact name
                  <input
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Emergency contact phone
                  <input
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    type="tel"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Relationship
                  <input
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    type="text"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 rounded-3xl bg-slate-100 p-4">
                <input
                  id="termsAgreed"
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="termsAgreed" className="text-sm text-slate-700">
                  I agree to the terms and conditions.
                </label>
              </div>
            </>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Back
                </button>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (step === 2 ? "Submitting..." : "Loading...") : step === 1 ? "Continue to next step" : "Submit application"}
              </button>
            </div>

            {message ? (
              <p className={`rounded-3xl px-5 py-4 text-sm ${status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                {message}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
