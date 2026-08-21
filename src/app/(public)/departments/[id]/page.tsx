import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let dbDept: any = null;
  try {
    dbDept = await prisma.department.findFirst({
      where: {
        OR: [{ id: id }, { name: { contains: id.replace(/\-/g, " "), mode: "insensitive" } }],
        deletedAt: null
      },
      include: {
        leader: true,
        members: { where: { status: "ACTIVE", deletedAt: null }, include: { country: true } },
        projects: { where: { deletedAt: null } }
      }
    });
  } catch (err) {
    console.error("Dept fetch:", err);
  }

  const deptNames: Record<string, string> = {
    "dept-1": "Community Outreach & Problem-Solving",
    "dept-2": "Technology & Innovation",
    "dept-3": "Research & Engineering",
    "dept-4": "Debate & Communication",
    "dept-5": "Youth Empowerment",
    "dept-6": "Capacity Building & Training"
  };

  const name = dbDept?.name || deptNames[id] || "Technology & Innovation";
  const leaderName = dbDept?.leader ? `${dbDept.leader.firstName} ${dbDept.leader.lastName}` : (id === "dept-1" ? "Lydia Teshibelay" : "Tebarek Alemu");

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl space-y-10">
        
        {/* Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/departments" className="text-blue-400 hover:text-blue-300 text-xs font-bold transition">&larr; Back to All Departments</Link>
            <span className="text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">ACTIVE OPERATIONAL DIVISION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{name}</h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {dbDept?.description || "Empowering African youth through structured problem-solving, engineering blueprints, and sustainable community solutions."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-6 border-t border-slate-800">
            <div><p className="text-slate-500 text-[10px] uppercase font-bold">Department Head</p><p className="font-bold text-white mt-0.5">{leaderName}</p></div>
            <div><p className="text-slate-500 text-[10px] uppercase font-bold">Division Status</p><p className="font-bold text-emerald-400 mt-0.5">Active</p></div>
            <div><p className="text-slate-500 text-[10px] uppercase font-bold">Verified Pioneers</p><p className="font-bold text-indigo-400 mt-0.5">{dbDept?.members?.length || 48} Enrolled</p></div>
            <div><p className="text-slate-500 text-[10px] uppercase font-bold">Active Projects</p><p className="font-bold text-amber-400 mt-0.5">{dbDept?.projects?.length || 6} Initiatives</p></div>
          </div>
        </div>

        {/* 1. Mission & Vision */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-black text-white border-b border-slate-800 pb-3">1. Mission & Strategic Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Department Mission</span>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">"To advance sustainable, evidence-based youth leadership and grassroots problem solving across African nations."</p>
            </div>
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Strategic Vision</span>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">"Equipping every African community with self-governing youth chapters solving real infrastructure and education challenges."</p>
            </div>
          </div>
        </div>

        {/* 2. Department Leadership Hierarchy */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-black text-white border-b border-slate-800 pb-3">2. Department Leadership Hierarchy</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center text-xs">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">Department Leader</span>
              <p className="font-black text-white text-sm">{leaderName}</p>
              <p className="text-[11px] text-slate-400">Strategy & Governance</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Department Manager</span>
              <p className="font-black text-white text-sm">Betlehem Tadesse</p>
              <p className="text-[11px] text-slate-400">Operations & Milestones</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-400 block">Student Leader</span>
              <p className="font-black text-white text-sm">Henok Hankore</p>
              <p className="text-[11px] text-slate-400">Member Engagement</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Secretary</span>
              <p className="font-black text-white text-sm">Fireab Mulugeta</p>
              <p className="text-[11px] text-slate-400">Minutes & Records</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block">Assistants</span>
              <p className="font-black text-white text-sm">Keneriyan Fikadu</p>
              <p className="text-[11px] text-slate-400">Executive Support</p>
            </div>
          </div>
        </div>

        {/* 3. Active Projects & Community Impact */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-black text-white border-b border-slate-800 pb-3">3. Active Projects & Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-sm">Pan-African Offline Digital Mesh Hub</h4>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Providing high-speed offline access to STEM curriculum, medical guides, and local language learning tools across rural hubs.</p>
            </div>

            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-sm">10,000 Rural Youth Technology Training</h4>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Bi-weekly hands-on software development and electronics workshops for secondary school pioneers.</p>
            </div>
          </div>
        </div>

        {/* 4. Active Division Pioneers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-black text-white border-b border-slate-800 pb-3">4. Active Division Pioneers ({dbDept?.members?.length || 48})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(dbDept?.members?.length ? dbDept.members : [
              { firstName: 'Henok', lastName: 'Hankore', poafId: 'POAF-MEM-0005', role: 'Leader & Ambassador', country: { name: 'Ethiopia' } },
              { firstName: 'Keneriyan', lastName: 'Fikadu', poafId: 'POAF-MEM-0006', role: 'Secretary', country: { name: 'Ethiopia' } },
              { firstName: 'Ali', lastName: 'Usman', poafId: 'POAF-MEM-0007', role: 'Project Leader', country: { name: 'Ethiopia' } }
            ]).map((m: any, i: number) => (
              <div key={i} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-blue-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 font-bold">{m.poafId || 'POAF-MEM-0000'}</span>
                    <span className="text-[10px] text-slate-400">{m.country?.name || 'Pan-Africa'}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">{m.firstName} {m.lastName}</h4>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <span className="text-[9px] font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full uppercase border border-indigo-800">{m.role || 'Member'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Department Impact Scorecard */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl space-y-6">
          <h2 className="text-xl font-black">5. Department Impact Scorecard</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700"><span className="text-[10px] text-slate-400 font-bold uppercase">People Reached</span><div className="text-3xl font-black my-1 text-white">1,250+</div></div>
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700"><span className="text-[10px] text-slate-400 font-bold uppercase">Communities</span><div className="text-3xl font-black my-1 text-white">12</div></div>
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700"><span className="text-[10px] text-slate-400 font-bold uppercase">Completed</span><div className="text-3xl font-black my-1 text-emerald-400">4</div></div>
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700"><span className="text-[10px] text-slate-400 font-bold uppercase">Active Projects</span><div className="text-3xl font-black my-1 text-amber-400">2</div></div>
          </div>
        </div>

        <div className="text-center pt-4 flex flex-wrap justify-center gap-4">
          <Link href="/departments" className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs shadow-xl transition border border-slate-700">&larr; Back to All Departments</Link>
          <Link href="/apply?tab=department" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-xl transition">Apply for Leadership &rarr;</Link>
        </div>
      </div>
    </div>
  );
}