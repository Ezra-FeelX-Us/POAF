import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  let sampleMember: any = null;
  try {
    sampleMember = await prisma.member.findFirst({
      where: { deletedAt: null, status: "ACTIVE" },
      include: { department: true, country: true }
    });
  } catch (e) {
    console.error(e);
  }

  const member = sampleMember || {
    poafId: "POAF-MEM-0001",
    firstName: "Ezra Michael",
    lastName: "Jofe",
    role: "Pioneer Member",
    roles: "MEMBER,DEPARTMENT_LEADER,NATIONAL_AMBASSADOR",
    status: "ACTIVE",
    photoUrl: "/images/media_1787225249810.png",
    department: { name: "Technology & Innovation" },
    country: { name: "Ethiopia" },
    joinedDate: new Date()
  };

  const rolesList = (member.roles || "MEMBER").split(",").map((r: string) => r.trim());

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center relative font-serif italic text-slate-900"
      style={{ backgroundImage: "url('/images/media_1787223427061.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10 space-y-10">
        
        {/* Header Profile Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div 
              className="w-28 h-28 rounded-2xl bg-cover bg-center shadow-lg border-4 border-blue-500 shrink-0"
              style={{ backgroundImage: `url('${member.photoUrl || "/images/media_1787222340022.png"}')` }}
            ></div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">{member.poafId}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active Member</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{member.country?.name || "Pan-Africa"}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">{member.firstName} {member.lastName}</h1>
              <p className="text-xs font-bold text-slate-500 mt-1">Department: <strong className="text-blue-700">{member.department?.name || "General Assembly"}</strong></p>
              
              {/* Active Roles Badge List */}
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                {rolesList.map((r: string, idx: number) => (
                  <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    {r.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/verify" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow">
              Digital ID Card &rarr;
            </Link>
            <Link href="/apply?tab=leadership" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow">
              Apply for Leadership &rarr;
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. My Department & Team Chat */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">Department Roster</span>
              <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">{member.department?.name || "Technology & Innovation"}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Participate in weekly division problem-solving sessions, submit task updates, and coordinate with your Department Leader.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                <p className="text-xs font-bold text-slate-700 mb-1">Department Bulletin:</p>
                <p className="text-xs text-slate-500 italic">"Continental Coding Bootcamp registration starts next Monday. Check task assignments."</p>
              </div>
            </div>
            <Link href="/departments" className="block text-center w-full py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition">
              Open Department Workspace &rarr;
            </Link>
          </div>

          {/* 2. My Projects & Initiatives */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">Active Initiatives</span>
              <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">Project Engagements</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Track deliverables, evidence uploads, and milestones for community projects and CAD engineering prototypes.
              </p>
              <div className="space-y-2 mb-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">POAF Digital Platform</span>
                  <span className="text-[10px] font-mono font-bold text-blue-600">65% Progress</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Clean Water Village Survey</span>
                  <span className="text-[10px] font-mono font-bold text-amber-600">45% Progress</span>
                </div>
              </div>
            </div>
            <Link href="/projects" className="block text-center w-full py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition">
              View All Projects & Submit Proposal &rarr;
            </Link>
          </div>

          {/* 3. Community Impact Competition */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded">Annual Challenge</span>
              <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">2026 Impact Competition</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Submit your chapter's grassroots engineering solution for a chance to win from the $10,000 pan-African seed pool.
              </p>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 mb-4">
                <span className="text-[10px] font-bold text-amber-800 uppercase">2026 Cycle Status</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Continuous Review Cohort Active</p>
                <p className="text-[11px] text-slate-600 mt-1">Shortlisted teams announced monthly by Executive Research Council.</p>
              </div>
            </div>
            <Link href="/competition" className="block text-center w-full py-2.5 bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-xl text-xs font-bold transition shadow">
              Explore Competition Hub &rarr;
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}