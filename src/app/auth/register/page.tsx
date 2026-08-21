"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const departments = [
    "Technology & Innovation",
    "Community Outreach & Problem-Solving",
    "Research & Engineering",
    "Debate & Communication",
    "Youth Empowerment",
    "Capacity Building & Training"
  ];

  const countries = [
    "Ethiopia",
    "Kenya",
    "Rwanda",
    "Nigeria",
    "Ghana",
    "South Africa",
    "Tanzania",
    "Uganda",
    "Egypt",
    "Morocco",
    "Senegal",
    "Zambia",
    "Zimbabwe",
    "Cameroon",
    "Cote d'Ivoire",
    "Pan-Africa (Other)"
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const departmentName = formData.get("department") as string;
    const countryName = formData.get("country") as string;
    const phone = formData.get("phone") as string;
    const age = formData.get("age") as string;
    const school = formData.get("school") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          departmentName,
          countryName,
          phone,
          age,
          school
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please check your details.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login?registered=true");
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundImage: "url('/images/media_1787222887149.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg">P</span>
            <span className="text-3xl font-black tracking-widest text-white">POAF</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Register as a Pioneer Member
          </h1>
          <p className="mt-1 text-xs text-blue-200">
            Join a continental division, receive an accredited POAF ID, and access the student classroom.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto text-xl font-black">
                ✓
              </div>
              <h3 className="text-xl font-black text-white">Registration Complete!</h3>
              <p className="text-xs text-slate-300">
                Your pioneer membership and department assignment have been initialized. Redirecting to sign in...
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Basic Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    placeholder="e.g. Samuel Yohannes"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="pioneer@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              {/* Password & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password *
                  </label>
                  <input 
                    name="password" 
                    type="password" 
                    required 
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Age
                  </label>
                  <input 
                    name="age" 
                    type="number" 
                    min={12} 
                    max={35}
                    placeholder="18"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              {/* Department Selection (Core Requirement) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Choose Your Continental Department *
                </label>
                <select
                  name="department"
                  required
                  defaultValue={departments[0]}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {departments.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Your pioneer application will be routed directly to this department's leadership board.
                </p>
              </div>

              {/* Country & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Country of Residence *
                  </label>
                  <select
                    name="country"
                    required
                    defaultValue="Ethiopia"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {countries.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    WhatsApp / Phone Contact
                  </label>
                  <input 
                    name="phone" 
                    type="text" 
                    placeholder="+251 911 000000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              {/* School / University */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  School / University or Institution
                </label>
                <input 
                  name="school" 
                  type="text" 
                  placeholder="e.g. Addis Ababa University / Bole High School"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? "Registering Pioneer Account..." : "Complete Pioneer Registration →"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Already have a pioneer account?{" "}
              <Link href="/auth/login" className="font-bold text-blue-400 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}