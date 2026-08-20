import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AmbassadorPortalPage() {
  let sampleAmbassador: any = null;
  try {
    sampleAmbassador = await prisma.member.findFirst({
      where: { 
        isLeader: true,
        role: { contains: "Ambassador", mode: "insensitive" },
        deletedAt: null 
      },
      include: { country: true, department: true }
    });
  } catch (e) {
    console.error(e);
  }

  const amb = sampleAmbassador || {
    firstName: "Ali Omari",
    lastName: "Washikala",
    poafId: "POAF-AMB-0001",
    role: "Ambassador of Kenya",
    country: { name: "Kenya", code: "KE" },
    photoUrl: "/images/amb-kenya.png"
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center relative font-serif italic text-slate-900"
      style={{ backgroundImage: "url('/images/media_1787223427061.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10 space-y-10">
        
        {/* Ambassador Banner */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div 
              className="w-28 h-28 rounded-2xl bg-cover bg-center shadow-lg border-4 border-amber-400 shrink-0"
              style={{ backgroundImage: `url('${amb.photoUrl || "/images/amb-kenya.png"}')` }}
            ></div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">{amb.poafId}</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">National Diplomatic Charter</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Sovereign Chapter</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">{amb.firstName} {amb.lastName}</h1>
              <p className="text-xs font-bold text-blue-600 mt-1">Official Position: <strong>{amb.role}</strong> ({amb.country?.name || "Pan-Africa"})</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/nations" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow">
              View Sovereign Nations &rarr;
            </Link>
            <Link href="/apply?tab=proposal" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition shadow">
              Submit Country Chapter Initiative &rarr;
            </Link>
          </div>
        </div>

        {/* Diplomatic Workspaces */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">Country Pioneers</span>
            <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">{amb.country?.name} Chapter Members</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Oversee registered students and high school chapter presidents across cities and secondary schools in your assigned nation.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4">
              <span className="font-bold text-emerald-600">Active Chapter Registry:</span> All local member IDs verified.
            </div>
            <Link href="/members" className="block text-center w-full py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition">
              Inspect Country Member List &rarr;
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">Diplomatic Chat</span>
            <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">Continental Ambassador Council</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Direct private channel connecting National Ambassadors from Ghana, Kenya, Nigeria, Tanzania, South Africa, Egypt, and Morocco with Executive Leadership.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4">
              <span className="font-bold text-blue-600">Next Diplomatic Assembly:</span> Sunday 3:00 PM GMT
            </div>
            <Link href="/leadership" className="block text-center w-full py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition">
              Open Ambassador Council &rarr;
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded">National Initiatives</span>
            <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">Regional Action Plans</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Submit whitepapers, youth parliament resolutions, and local secondary school chapter accreditation requests.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4">
              <span className="font-bold text-purple-600">Status:</span> 3 Accredited School Chapters Pending Review
            </div>
            <Link href="/apply?tab=proposal" className="block text-center w-full py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition">
              Submit National Chapter Proposal &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}