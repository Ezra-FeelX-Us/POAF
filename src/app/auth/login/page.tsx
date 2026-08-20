"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/images/media_1787222862970.jpg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg">P</span>
            <span className="text-3xl font-black tracking-widest text-white">P|AF</span>
          </Link>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Pioneer Portal Sign In
          </h2>
          <p className="mt-2 text-sm text-blue-200">
            Access your membership workspace, leadership tasks, and applications.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm font-semibold">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email address</label>
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="pioneer@poaf.org"
                className="mt-1 block w-full rounded-xl border-slate-300 p-3 border shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Password</label>
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••"
                className="mt-1 block w-full rounded-xl border-slate-300 p-3 border shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
            >
              Sign In to Workspace
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{" "}
              <Link href="/auth/register" className="font-bold text-blue-600 hover:underline">
                Create new account
              </Link>
            </p>
            <div className="mt-4">
              <Link href="/apply/membership" className="text-xs text-slate-500 hover:text-slate-800">
                Or submit a membership application &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}