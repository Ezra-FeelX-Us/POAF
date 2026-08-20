import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DepartmentPortalPage() {
  let sampleDept: any = null;
  try {
    sampleDept = await prisma.department.findFirst({
      where: { deletedAt: null },
      include: {
        leader: true,
        members: { where: { status: "ACTIVE", deletedAt: null } },
        projects: { where: { deletedAt: null } }
      }
    });
  } catch (e) {
    console.error(e);
  }

  const dept = sampleDept || {
    name: "Technology & Innovation",
    description: "Building digital platforms, hosting continental coding bootcamps, and providing technology literacy.",
    leader: { firstName: "Tebarek", lastName: "Alemu", role: "Department Leader", photoUrl: "/images/tebarek-alemu.png" },
    members: [
      { firstName: "Henok", lastName: "Hankore", role: "Leader & Ambassador" },
      { firstName: "Keneriyan", lastName: "Fikadu", role: "Leader & Ambassador" },
      { firstName: "Ali", lastName: "Usman", role: "Chief Engineer" }
    ],
    projects: [
      { title: "POAF Digital Platform & Offline Portal", status: "ONGOING", progressPct: 65 }
    ]
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center relative font-serif italic text-slate-900"
      style={{ backgroundImage: "url('/images/media_1787223427061.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10 space-y-10">
        
        {/* Department Workspace Banner */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div 
              className="w-28 h-28 rounded-2xl bg-cover bg-center shadow-lg border-4 border-emerald-500 shrink-0"
              style={{ backgroundImage: `url('${dept.leader?.photoUrl || "/images/tebarek-alemu.png"}')` }}
            ></div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Department Operational Workspace</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Active Division</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">{dept.name}</h1>
              <p className="text-xs font-bold text-slate-600 mt-1">Department Head: <strong className="text-emerald-700">{dept.leader?.firstName} {dept.leader?.lastName}</strong> ({dept.leader?.role})</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/departments" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow">
              Public Department Page &rarr;
            </Link>
            <Link href="/projects" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow">
              Submit Project Proposal &rarr;
            </Link>
          </div>
        </div>

        {/* Operational Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Department Pioneers & Attendance */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">Assigned Personnel</span>
              <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">Division Roster ({dept.members?.length || 3})</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                View active members, track session attendance, and coordinate task distributions across sub-teams.
              </p>
              <div className="space-y-2 mb-4">
                {dept.members?.slice(0, 3).map((m: any, i: number) => (
                  <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{m.firstName} {m.lastName}</span>
                    <span className="text-[10px] text-blue-600 font-bold">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/members" className="block text-center w-full py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition">
              View Complete Roster &rarr;
            </Link>
          </div>

          {/* 2. Department Initiatives & Project Milestones */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">Initiatives & Deliverables</span>
              <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">Active Projects</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Monitor engineering blueprints, research surveys, and milestone progress percentages.
              </p>
              <div className="space-y-2 mb-4">
                {dept.projects?.slice(0, 2).map((p: any, i: number) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-800">{p.title}</span>
                      <span className="text-emerald-600">{p.progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${p.progressPct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/projects" className="block text-center w-full py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition">
              Manage Project Pipeline &rarr;
            </Link>
          </div>

          {/* 3. Department Announcements & Live Chat */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded">Internal Communications</span>
              <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">Department Chat & Notices</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Broadcast official division notices and participate in real-time coordination with managers and student leaders.
              </p>
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-slate-800 mb-4">
                <span className="font-bold text-amber-900">Weekly Division Standup:</span> Every Friday 4:00 PM
              </div>
            </div>
            <Link href="/leadership" className="block text-center w-full py-2.5 bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-xl text-xs font-bold transition shadow">
              Open Leadership Workspace &rarr;
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}