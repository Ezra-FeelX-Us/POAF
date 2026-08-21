"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
        Loading Pioneer Identity Gateway...
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
  const registered = searchParams.get("registered") === "true";
  
  const [selectedRole, setSelectedRole] = useState<
    "member" | "leader" | "manager" | "student_leader" | "secretary" | "assistant" | "ambassador" | "admin"
  >(initialRole as any || "member");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleConfigs = {
    member: {
      title: "Student Member Sign In",
      subtitle: "Access the classroom, active tasks, 1–100 scorecards, and department assembly chat.",
      idLabel: "POAF ID or Email Address",
      idPlaceholder: "e.g. POAF-MEM-1001 or pioneer@poaf.org",
      pinLabel: "Password / Account PIN",
      buttonText: "Sign In as Student Member",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      badge: "🎓 Member Classroom",
      redirectPath: "/classroom",
      helpText: "New to POAF? Register into one of our 6 continental departments:",
      helpLink: "/auth/register",
      helpLinkText: "Register as Member &rarr;"
    },
    leader: {
      title: "Department Leader Sign In",
      subtitle: "Issue strategic task directives and promote division pioneers across leadership tiers.",
      idLabel: "Leader POAF ID or Email",
      idPlaceholder: "e.g. POAF-LDR-TECH-01 or leader@poaf.org",
      pinLabel: "Leadership PIN / Password",
      buttonText: "Sign In to Department Leader Console",
      buttonBg: "bg-indigo-600 hover:bg-indigo-700",
      badge: "👑 Department Leader",
      redirectPath: "/staff?view=leader",
      helpText: "Department Leaders are appointed directly by Super Admin.",
      helpLink: "#",
      helpLinkText: "Contact Executive Administration"
    },
    manager: {
      title: "Department Manager Sign In",
      subtitle: "Manage GitHub-style project execution engines, milestone tracking, and deliverable review.",
      idLabel: "Manager POAF ID or Email",
      idPlaceholder: "e.g. POAF-MGR-0001 or manager@poaf.org",
      pinLabel: "Manager PIN / Password",
      buttonText: "Sign In to Operations & Project Console",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
      badge: "⚙️ Project Manager",
      redirectPath: "/staff?view=manager",
      helpText: "Promoted from within division by Department Leader.",
      helpLink: "/about",
      helpLinkText: "Learn about 5-Tier Leadership"
    },
    student_leader: {
      title: "Student Leader Sign In",
      subtitle: "Rate students on a 1–100 scale, assign strength badges, and moderate student assembly chat.",
      idLabel: "Student Leader ID or Email",
      idPlaceholder: "e.g. POAF-SLD-0001 or studentleader@poaf.org",
      pinLabel: "PIN / Password",
      buttonText: "Sign In to Student Voice Console",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700",
      badge: "🎓 Student Leader",
      redirectPath: "/staff?view=student_leader",
      helpText: "Promoted through peer excellence and leadership.",
      helpLink: "/leadership",
      helpLinkText: "View Leadership Board"
    },
    secretary: {
      title: "Department Secretary Sign In",
      subtitle: "Archive structured meeting minutes, action items, and broadcast public news announcements.",
      idLabel: "Secretary ID or Email",
      idPlaceholder: "e.g. POAF-SEC-0001 or secretary@poaf.org",
      pinLabel: "PIN / Password",
      buttonText: "Sign In to Secretariat Console",
      buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
      badge: "🗂️ Department Secretary",
      redirectPath: "/staff?view=secretary",
      helpText: "Appointed by Department Leadership.",
      helpLink: "/departments",
      helpLinkText: "Explore Continental Divisions"
    },
    assistant: {
      title: "Department Assistant Sign In",
      subtitle: "Execute supervisor briefs, submit deliverables, and assist division taskforces.",
      idLabel: "Assistant ID or Email",
      idPlaceholder: "e.g. POAF-AST-0001 or assistant@poaf.org",
      pinLabel: "PIN / Password",
      buttonText: "Sign In to Assistant Workspace",
      buttonBg: "bg-cyan-600 hover:bg-cyan-700",
      badge: "🤝 Department Assistant",
      redirectPath: "/staff?view=assistant",
      helpText: "First-tier leadership role promoted from verified members.",
      helpLink: "/auth/register",
      helpLinkText: "Join as Member First"
    },
    ambassador: {
      title: "National Sovereign Ambassador Sign In",
      subtitle: "Oversee sovereign diplomatic embassy offices, national pioneer rosters, and regional projects.",
      idLabel: "Ambassador ID or Email",
      idPlaceholder: "e.g. POAF-AMB-ETH-01 or ambassador@poaf.org",
      pinLabel: "Diplomatic PIN / Password",
      buttonText: "Sign In to Sovereign Embassy Office",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700",
      badge: "🌍 National Ambassador",
      redirectPath: "/office",
      helpText: "Appointed via Sovereign AU Nation Representation intake.",
      helpLink: "/apply?tab=ambassador",
      helpLinkText: "Ambassador Application Form &rarr;"
    },
    admin: {
      title: "Super Admin Control Center",
      subtitle: "Access master continental governance, direct leader provisioning, applications, and audit engine.",
      idLabel: "Executive Admin Email",
      idPlaceholder: "admin@poaf.org",
      pinLabel: "Executive Master Password",
      buttonText: "Sign In to Super Admin Console",
      buttonBg: "bg-slate-900 hover:bg-slate-800 border border-slate-700",
      badge: "🛡️ Super Admin (Full Governance)",
      redirectPath: "/admin",
      helpText: "Default Master Credentials: admin@poaf.org / password123",
      helpLink: "#",
      helpLinkText: "Confidential Executive Terminal"
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
      className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundImage: "url('/images/media_1787222862970.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg">P</span>
            <span className="text-3xl font-black tracking-widest text-white">POAF</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Pioneer Portal & Workspace Gateway
          </h1>
          <p className="mt-1 text-xs text-blue-200">
            Select your specific role below to access your authorized workspace.
          </p>
        </div>

        {registered && (
          <div className="mb-4 bg-emerald-950 border border-emerald-800 text-emerald-300 p-4 rounded-2xl text-xs font-bold text-center">
            ✓ Registration successful! Sign in below to enter your department classroom.
          </div>
        )}

        {/* 8-Role Gateway Grid Selector */}
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-xl mb-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => { setSelectedRole("member"); setError(""); }}
            className={`py-2 px-1.5 rounded-xl transition text-[11px] ${
              selectedRole === "member" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            🎓 Member
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole("assistant"); setError(""); }}
            className={`py-2 px-1.5 rounded-xl transition text-[11px] ${
              selectedRole === "assistant" ? "bg-cyan-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            🤝 Assistant
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole("secretary"); setError(""); }}
            className={`py-2 px-1.5 rounded-xl transition text-[11px] ${
              selectedRole === "secretary" ? "bg-amber-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            🗂️ Secretary
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole("student_leader"); setError(""); }}
            className={`py-2 px-1.5 rounded-xl transition text-[11px] ${
              selectedRole === "student_leader" ? "bg-emerald-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            🎓 Student Leader
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole("manager"); setError(""); }}
            className={`py-2 px-1.5 rounded-xl transition text-[11px] ${
              selectedRole === "manager" ? "bg-purple-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            ⚙️ Manager
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole("leader"); setError(""); }}
            className={`py-2 px-1.5 rounded-xl transition text-[11px] ${
              selectedRole === "leader" ? "bg-indigo-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            👑 Dept Leader
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole("ambassador"); setError(""); }}
            className={`py-2 px-1.5 rounded-xl transition text-[11px] ${
              selectedRole === "ambassador" ? "bg-emerald-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            🌍 Ambassador
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole("admin"); setError(""); }}
            className={`py-2 px-1.5 rounded-xl transition text-[11px] ${
              selectedRole === "admin" ? "bg-slate-800 text-white border border-slate-700 shadow-md" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            🛡️ Super Admin
          </button>
        </div>

        {/* Login Form Container */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl rounded-3xl text-white space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
              {config.badge}
            </span>
            <h2 className="text-xl font-black text-white mt-2">{config.title}</h2>
            <p className="text-xs text-slate-400 mt-1">{config.subtitle}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                {config.idLabel} *
              </label>
              <input 
                type="text" 
                required 
                placeholder={config.idPlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                {config.pinLabel} *
              </label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl shadow-lg text-xs font-bold text-white transition-all disabled:opacity-50 ${config.buttonBg}`}
              >
                {loading ? "Authenticating Credentials..." : `${config.buttonText} →`}
              </button>
            </div>
          </form>

          <div className="border-t border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-400">
              {config.helpText}{" "}
              <Link href={config.helpLink} className="font-bold text-blue-400 hover:underline">
                {config.helpLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}