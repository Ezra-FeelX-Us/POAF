"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface PortalItem {
  id: string;
  label: string;
  roleLabel: string;
  href: string;
}

interface PortalRoleSwitcherProps {
  isAuthenticated: boolean;
  primaryPortal: PortalItem;
  allowedPortals: PortalItem[];
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function PortalRoleSwitcher({
  isAuthenticated,
  primaryPortal,
  allowedPortals = [],
  user
}: PortalRoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href="/auth/login" 
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700"
        >
          Sign In
        </Link>
        <Link 
          href="/apply" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          Join POAF
        </Link>
      </div>
    );
  }

  const badgeColorMap: Record<string, string> = {
    ADMIN: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
    STAFF: "bg-indigo-600 hover:bg-indigo-700 text-white",
    OFFICE: "bg-emerald-600 hover:bg-emerald-700 text-white",
    CLASSROOM: "bg-blue-600 hover:bg-blue-700 text-white"
  };

  const currentBadgeColor = badgeColorMap[primaryPortal?.id] || "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2 rounded-xl text-xs font-black transition shadow-md flex items-center gap-1.5 ${currentBadgeColor}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>{primaryPortal.label}</span>
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Link
          href="/classroom"
          className="hidden sm:inline-block px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition border border-slate-700"
        >
          Profile
        </Link>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 ring-1 ring-black/50 focus:outline-none z-50 overflow-hidden font-sans">
          {/* User Header */}
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <p className="text-xs font-bold text-slate-400">Signed in as</p>
            <p className="text-xs font-black text-white truncate mt-0.5">{user?.name || user?.email || "POAF Pioneer"}</p>
          </div>

          {/* Switch Portal Section */}
          <div className="p-2 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Switch Workspace
            </div>

            {allowedPortals.map((portal) => {
              const isCurrent = portal.id === primaryPortal.id;
              return (
                <Link
                  key={portal.id}
                  href={portal.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start justify-between px-3 py-2.5 rounded-xl transition text-xs ${
                    isCurrent 
                      ? "bg-blue-600/20 border border-blue-500/30 text-white font-bold" 
                      : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                  }`}
                >
                  <div>
                    <div className="font-black text-xs text-white">{portal.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{portal.roleLabel}</div>
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.5 rounded uppercase">Active</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Account & Sign Out */}
          <div className="border-t border-slate-800 p-2 bg-slate-950/40">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 rounded-xl transition flex items-center justify-between"
            >
              <span>Sign Out</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
