"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import ProfileModal from "./ProfileModal";

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
    image?: string | null;
  } | null;
}

export default function PortalRoleSwitcher({
  isAuthenticated,
  primaryPortal,
  allowedPortals = [],
  user
}: PortalRoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
          href="/auth/register" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          Register
        </Link>
      </div>
    );
  }

  const badgeColorMap: Record<string, string> = {
    ADMIN: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black",
    STAFF: "bg-indigo-600 hover:bg-indigo-700 text-white",
    OFFICE: "bg-emerald-600 hover:bg-emerald-700 text-white",
    CLASSROOM: "bg-blue-600 hover:bg-blue-700 text-white"
  };

  const currentBadgeColor = badgeColorMap[primaryPortal?.id] || "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          {/* Quick Workspace Access */}
          <Link
            href={primaryPortal.href}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition shadow-md flex items-center gap-1.5 ${currentBadgeColor}`}
          >
            <span>{primaryPortal.label}</span>
          </Link>

          {/* 3-Dash Menu & Profile Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700 flex items-center gap-1.5 focus:outline-none"
            aria-label="User menu and profile settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs font-bold hidden xl:inline">Account</span>
          </button>
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 ring-1 ring-black/50 focus:outline-none z-50 overflow-hidden font-sans">
            {/* User Header */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Signed in as</p>
              <p className="text-xs font-black text-white truncate mt-0.5">{user?.name || user?.email || "POAF Pioneer"}</p>
            </div>

            {/* Profile Settings Action */}
            <div className="p-2 border-b border-slate-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-blue-400 hover:bg-blue-950/40 rounded-xl transition flex items-center justify-between"
              >
                <span>Edit Profile & Avatar</span>
                <span className="text-[10px] bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-mono">Settings</span>
              </button>
            </div>

            {/* Switch Workspace Section */}
            <div className="p-2 space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Authorized Workspaces
              </div>

              {allowedPortals.map((portal) => {
                const isCurrent = portal.id === primaryPortal.id;
                return (
                  <Link
                    key={portal.id}
                    href={portal.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-start justify-between px-3 py-2 rounded-xl transition text-xs ${
                      isCurrent 
                        ? "bg-blue-600/20 border border-blue-500/30 text-white font-bold" 
                        : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="font-black text-xs text-white">{portal.label}</div>
                      <div className="text-[10px] text-slate-400">{portal.roleLabel}</div>
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
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
