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
    <div className="min-h-screen bg-cover bg-fixed bg-center relative font-serif italic text-slate-900" style={{ backgroundImage: "url('/images/media_1787223427061.png')" }}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      <div className="py-20 px-6 bg-cover bg-center relative z-10 text-white" style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}>
        <div className="absolute inset-0 bg-blue-950/85"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Link href="/departments" className="text-blue-300 hover:text-white text-xs font-bold transition">&larr; Back to All Departments</Link>
            <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-emerald-500 text-white">ACTIVE DIVISION</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">{name}</h1>
          <p className="text-sm text-blue-200 leading-relaxed max-w-3xl font-sans">
            {dbDept?.description || "Empowering African youth through structured problem-solving, engineering blueprints, and sustainable community solutions."}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-blue-200 mt-6 pt-6 border-t border-white/20 font-sans">
            <div><p className="text-slate-400 text-[10px] uppercase font-bold">Department Head</p><p className="font-bold text-white mt-0.5">{leaderName}</p></div>
            <div><p className="text-slate-400 text-[10px] uppercase font-bold">Status</p><p className="font-bold text-white mt-0.5">Active Division</p></div>
            <div><p className="text-slate-400 text-[10px] uppercase font-bold">Verified Pioneers</p><p className="font-bold text-white mt-0.5">{dbDept?.members?.length || 6} Active</p></div>
            <div><p className="text-slate-400 text-[10px] uppercase font-bold">Initiatives</p><p className="font-bold text-white mt-0.5">{dbDept?.projects?.length || 2} Projects</p></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl relative z-20 space-y-12">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-3">1. Mission, Vision & Purpose</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Department Mission</span>
              <p className="text-sm font-bold text-slate-900 mt-1">"To advance sustainable, evidence-based youth leadership and grassroots problem solving across African nations."</p>
            </div>
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Strategic Vision</span>
              <p className="text-sm font-bold text-slate-900 mt-1">"Equipping every African community with self-governing youth chapters solving real infrastructure and education challenges."</p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-3">2. Department Leadership Structure</h2>
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 text-center font-sans space-y-3">
            <div className="inline-block bg-blue-600 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md">👑 Department Leader: {leaderName}</div>
            <div className="w-0.5 h-3 bg-slate-600 mx-auto"></div>
            <div className="inline-block bg-amber-500 text-slate-950 px-6 py-2 rounded-xl font-bold text-xs shadow-md">⚙️ Department Manager & Operations Lead</div>
            <div className="w-0.5 h-3 bg-slate-600 mx-auto"></div>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-[11px] font-bold text-blue-300">🗂️ Secretary: Records & Minutes</div>
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-[11px] font-bold text-emerald-300">🤝 Assistant: Operations Support</div>
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-[11px] font-bold text-amber-300">🚀 Project Leaders & Teams</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <strong className="text-blue-700">👑 Department Leader:</strong> Strategy, priorities, executive representation, and organizational governance.
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <strong className="text-amber-700">⚙️ Department Manager:</strong> Daily operations, task assignments, milestone tracking, and attendance coordination.
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-3">3. Active Division Pioneers ({dbDept?.members?.length || 5})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(dbDept?.members?.length ? dbDept.members : [
              { firstName: 'Henok', lastName: 'Hankore', poafId: 'POAF-MEM-0005', role: 'Leader & Ambassador', country: { name: 'Ethiopia' } },
              { firstName: 'Keneriyan', lastName: 'Fikadu', poafId: 'POAF-MEM-0006', role: 'Secretary', country: { name: 'Ethiopia' } },
              { firstName: 'Ali', lastName: 'Usman', poafId: 'POAF-MEM-0007', role: 'Project Leader', country: { name: 'Ethiopia' } }
            ]).map((m: any, i: number) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 font-bold">{m.poafId || 'POAF-MEM-0000'}</span>
                    <span className="text-[10px] text-slate-500">{m.country?.name || 'Pan-Africa'}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{m.firstName} {m.lastName}</h4>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase">{m.role || 'Member'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 shadow-2xl border border-white/10 space-y-6">
          <h2 className="text-2xl font-black">4. Department Impact Scorecard</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-sans">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"><span className="text-[10px] text-blue-300 font-bold uppercase">People Reached</span><div className="text-3xl font-black my-1 text-white">1,250+</div></div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"><span className="text-[10px] text-blue-300 font-bold uppercase">Communities</span><div className="text-3xl font-black my-1 text-white">12</div></div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"><span className="text-[10px] text-blue-300 font-bold uppercase">Completed</span><div className="text-3xl font-black my-1 text-emerald-400">4</div></div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"><span className="text-[10px] text-blue-300 font-bold uppercase">Active Projects</span><div className="text-3xl font-black my-1 text-amber-400">2</div></div>
          </div>
        </div>

        <div className="text-center pt-8 flex justify-center gap-4">
          <Link href="/departments" className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs shadow-xl transition">&larr; Back to All Departments</Link>
          <Link href="/apply?tab=leadership" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-xl transition">Apply for Leadership &rarr;</Link>
        </div>
      </div>
    </div>
  );
}