"use client";
import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-serif italic">
        Loading Pioneer Gateway...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "member";
  
  const [selectedRole, setSelectedRole] = useState<"member" | "leader" | "ambassador" | "admin">(
    initialRole as any || "member"
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleConfigs = {
    member: {
      title: "Student / Member Sign In",
      subtitle: "Access your assignments, task submissions, scorecard & digital ID.",
      idLabel: "Membership ID or Email",
      idPlaceholder: "e.g. POAF-MEM-0001 or pioneer@domain.com",
      pinLabel: "Membership PIN / Password",
      buttonText: "Sign In as Student Member",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      redirectPath: "/portal/member",
      unregisteredText: "Not a registered member yet?",
      applyLink: "/apply?tab=membership",
      applyText: "Fill Member Registration Application Form &rarr;"
    },
    leader: {
      title: "Department Leader Sign In",
      subtitle: "Access the Task Giver, Reviewer console & Department Grade Board.",
      idLabel: "Leadership ID / POAF ID",
      idPlaceholder: "e.g. POAF-LDR-0001 or leader@domain.com",
      pinLabel: "Leadership PIN / Password",
      buttonText: "Sign In as Department Leader",
      buttonBg: "bg-indigo-600 hover:bg-indigo-700",
      redirectPath: "/portal/department",
      unregisteredText: "Not a department leader yet?",
      applyLink: "/apply?tab=department",
      applyText: "Apply for Department Leadership using the form &rarr;"
    },
    ambassador: {
      title: "Nation Representative Sign In",
      subtitle: "Access Sovereign Diplomatic dashboard & National Pioneer chapters.",
      idLabel: "Ambassador ID / Membership ID",
      idPlaceholder: "e.g. POAF-AMB-0001 or ambassador@domain.com",
      pinLabel: "Ambassador PIN / Password",
      buttonText: "Sign In as Nation Representative",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700",
      redirectPath: "/portal/ambassador",
      unregisteredText: "Not an official country representative yet?",
      applyLink: "/apply?tab=ambassador",
      applyText: "Fill Country Representation Application Form &rarr;"
    },
    admin: {
      title: "Executive Admin Sign In",
      subtitle: "Access central application review, database studio & audit logs.",
      idLabel: "Admin Email Address",
      idPlaceholder: "admin@poaf.org",
      pinLabel: "Admin PIN / Password",
      buttonText: "Sign In to Admin Control Center",
      buttonBg: "bg-slate-900 hover:bg-slate-800",
      redirectPath: "/admin/dashboard",
      unregisteredText: "Default Super Admin Credentials:",
      applyLink: "#",
      applyText: "admin@poaf.org / password123"
    }
  };

  const config = roleConfigs[selectedRole];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false
      });

      if (res?.error) {
        setError(res.error || "Invalid ID/Email or PIN/Password");
        setLoading(false);
      } else {
        router.push(config.redirectPath);
        router.refresh();
      }
    } catch (err: any) {
      setError("Sign in error. Please verify your credentials.");
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-serif italic"
      style={{ backgroundImage: "url('/images/media_1787222862970.jpg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg">P</span>
            <span className="text-3xl font-black tracking-widest text-white">POAF</span>
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Pioneer Portal Gateway
          </h2>
          <p className="mt-1 text-xs text-blue-200">
            Select your role category below to sign in or apply for credentials.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => { setSelectedRole("member"); setError(""); }}
            className={`py-2.5 px-2 rounded-xl transition-all ${
              selectedRole === "member" ? "bg-blue-600 text-white shadow" : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Student Member
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRole("leader"); setError(""); }}
            className={`py-2.5 px-2 rounded-xl transition-all ${
              selectedRole === "leader" ? "bg-indigo-600 text-white shadow" : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Dept Leader
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRole("ambassador"); setError(""); }}
            className={`py-2.5 px-2 rounded-xl transition-all ${
              selectedRole === "ambassador" ? "bg-emerald-600 text-white shadow" : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Ambassador
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRole("admin"); setError(""); }}
            className={`py-2.5 px-2 rounded-xl transition-all ${
              selectedRole === "admin" ? "bg-slate-900 text-white shadow" : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Sign In Form Box */}
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-white/30 text-slate-900">
          <div className="mb-6 border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Role Access
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">{config.title}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{config.subtitle}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-xl text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {config.idLabel} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={config.idPlaceholder}
                className="block w-full rounded-xl border border-slate-300 p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {config.pinLabel} <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PIN / Password"
                className="block w-full rounded-xl border border-slate-300 p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg text-xs font-black text-white transition-all hover:-translate-y-0.5 ${config.buttonBg}`}
            >
              {loading ? "Verifying Credentials..." : `${config.buttonText} \u2192`}
            </button>
          </form>

          {/* Registration / Application Guidance Footer */}
          <div className="mt-6 border-t border-slate-200 pt-5 text-center text-xs text-slate-600 space-y-2">
            <div>
              <span className="font-semibold text-slate-700">{config.unregisteredText}</span>
            </div>
            <div>
              {selectedRole === "admin" ? (
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                  {config.applyText}
                </span>
              ) : (
                <Link 
                  href={config.applyLink} 
                  className="font-bold text-blue-600 hover:text-blue-800 hover:underline inline-block bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
                >
                  {config.applyText}
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}