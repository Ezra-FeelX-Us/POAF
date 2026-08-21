"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function MobileMenu({
  portalInfo = {
    label: "Sign In \u2192",
    href: "/auth/login",
    badgeColor: "bg-blue-600 hover:bg-blue-700 text-white"
  }
}: {
  portalInfo?: {
    label: string;
    href: string;
    badgeColor: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-blue-400 focus:outline-none p-2 rounded-lg"
        aria-label="Toggle Menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-900 border-t border-slate-800 shadow-xl py-4 px-6 flex flex-col gap-3 text-sm font-semibold z-50">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">About</Link>
          <Link href="/members" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Membership</Link>
          <Link href="/leadership" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Leadership</Link>
          <Link href="/departments" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Departments</Link>
          <Link href="/partners" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Official Partners</Link>
          <Link href="/projects" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Projects</Link>
          <Link href="/apply" onClick={() => setIsOpen(false)} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Apply</Link>
          <Link href="/verify" onClick={() => setIsOpen(false)} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">Verify ID</Link>
          
          <div className="border-t border-slate-800 pt-3 mt-1 flex flex-col gap-2">
            <Link 
              href={portalInfo.href} 
              onClick={() => setIsOpen(false)} 
              className={`w-full text-center px-4 py-2.5 font-bold rounded-xl text-xs transition shadow-md ${portalInfo.badgeColor}`}
            >
              {portalInfo.label}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
