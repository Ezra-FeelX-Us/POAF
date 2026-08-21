"use client";

import React, { useState } from "react";
import Link from "next/link";

import DesktopModeToggle from "./DesktopModeToggle";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-blue-400 focus:outline-none p-2 rounded-lg"
        aria-label="Toggle Menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-900 border-t border-slate-800 shadow-xl py-4 px-6 flex flex-col gap-3.5 text-sm font-semibold z-50">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">About</Link>
          <Link href="/members" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Members Board</Link>
          <Link href="/leadership" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Leadership Board</Link>
          <Link href="/departments" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Departments</Link>
          <Link href="/projects" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition-colors">Projects</Link>
          <Link href="/competition" onClick={() => setIsOpen(false)} className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Impact Competition</Link>
          <Link href="/verify" onClick={() => setIsOpen(false)} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">Verify ID</Link>
          <div className="pt-1 pb-1">
            <DesktopModeToggle className="w-full" />
          </div>
          <div className="border-t border-slate-700 pt-3 mt-2 flex flex-col gap-2">
            <Link href="/apply" onClick={() => setIsOpen(false)} className="w-full text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md">Apply Now</Link>
            <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="w-full text-center px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors text-white font-bold border border-slate-700 text-xs">Admin Portal</Link>
          </div>
        </div>
      )}
    </div>
  );
}
