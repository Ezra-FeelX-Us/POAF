import React from "react";
import prisma from "@/lib/prisma";
import { requirePortalAccess } from "@/lib/portalResolver";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OfficePortalPage() {
  const authGuard = await requirePortalAccess('OFFICE');
  if (!authGuard.authorized && !authGuard.resolution.hasRole('ADMIN')) {
    redirect("/auth/login?role=ambassador");
  }

  let country: any = null;
  let nationalMembers: any[] = [];

  try {
    country = await prisma.country.findFirst({
      include: {
        members: { where: { status: "ACTIVE", deletedAt: null } }
      }
    });

    if (country) {
      nationalMembers = country.members || [];
    }
  } catch (err) {
    console.error("Office DB query fallback:", err);
  }

  const currentCountry = country || {
    name: "Kenya",
    code: "KE",
    flagUrl: "/images/flags/ke.png",
    description: "East African diplomatic mission, university chapter network, and youth technology hubs."
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-serif italic py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Office Header */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                National Ambassador Sovereign Office
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Diplomatic Accreditation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Embassy & Chapter of {currentCountry.name}</h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">{currentCountry.description}</p>
          </div>

          <div className="flex gap-3">
            <span className="bg-emerald-100 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs">
              {nationalMembers.length} Registered Citizens / Pioneers
            </span>
          </div>
        </div>

        {/* National Roster & Country Operations */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                National Pioneer Registry
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Active Citizens & Leaders in {currentCountry.name}</h2>
            </div>
            <Link href="/nations" className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
              Nations Directory &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <th className="p-3">POAF ID</th>
                  <th className="p-3">Pioneer Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Tasks Completed</th>
                  <th className="p-3 text-center">Cumulative Points</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {nationalMembers.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{m.poafId}</td>
                    <td className="p-3 font-black text-slate-900">{m.firstName} {m.lastName}</td>
                    <td className="p-3 text-slate-600">{m.role}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{m.tasksCompleted || 0}</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-700">{m.totalPoints || 0} pts</td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
