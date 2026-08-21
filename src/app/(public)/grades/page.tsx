import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PioneerGradeBoardPage() {
  let members: any[] = [];
  try {
    members = await prisma.member.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      include: { department: true, country: true },
      orderBy: { totalPoints: "desc" }
    });
  } catch (err) {
    console.error("Grade board fetch fallback:", err);
  }

  const staticRankings = [
    { name: "Ali Usman", poafId: "POAF-MEM-0003", role: "Chief Engineer", dept: "Research & Engineering", country: "Ethiopia", points: 450, tasks: 5, tier: "DISTINCTION" },
    { name: "Ezra Michael Jofe", poafId: "POAF-MEM-0001", role: "Founder & Executive President", dept: "Technology & Innovation", country: "Ethiopia", points: 380, tasks: 4, tier: "DISTINCTION" },
    { name: "Lydia Teshibelay", poafId: "POAF-MEM-0005", role: "Department Leader", dept: "Community Outreach", country: "Ethiopia", points: 310, tasks: 4, tier: "DISTINCTION" },
    { name: "Henok Hankore", poafId: "POAF-MEM-0008", role: "Leader & Ambassador", dept: "Technology & Innovation", country: "Ethiopia", points: 280, tasks: 3, tier: "HONORS" },
    { name: "Ali Omari Washikala", poafId: "POAF-AMB-0001", role: "Ambassador of Kenya", dept: "International Diplomacy", country: "Kenya", points: 260, tasks: 3, tier: "HONORS" },
    { name: "Kofi Mensah", poafId: "POAF-AMB-0002", role: "Ambassador of Ghana", dept: "International Diplomacy", country: "Ghana", points: 240, tasks: 3, tier: "HONORS" },
    { name: "Keneriyan Fikadu", poafId: "POAF-MEM-0009", role: "Leader & Ambassador", dept: "Technology & Innovation", country: "Ethiopia", points: 190, tasks: 2, tier: "HONORS" },
    { name: "Betlehem Tadesse", poafId: "POAF-MEM-0014", role: "Manager & Ambassador", dept: "Community Outreach", country: "Ethiopia", points: 160, tasks: 2, tier: "HONORS" },
    { name: "Caleb-John Dismas", poafId: "POAF-AMB-0003", role: "Ambassador of Tanzania", dept: "International Diplomacy", country: "Tanzania", points: 140, tasks: 2, tier: "COMMENDED" },
    { name: "Fireab Mulugeta", poafId: "POAF-MEM-0021", role: "Secretary & Ambassador", dept: "Community Outreach", country: "Ethiopia", points: 120, tasks: 2, tier: "COMMENDED" }
  ];

  const rankings = [
    ...members.map(m => ({
      name: `${m.firstName} ${m.lastName}`,
      poafId: m.poafId || "POAF-MEM",
      role: m.role || "Member",
      dept: m.department?.name || "General Pioneer",
      country: m.country?.name || "Pan-Africa",
      points: m.totalPoints || 50,
      tasks: m.tasksCompleted || 1,
      tier: m.gradeTier || (m.totalPoints >= 300 ? "DISTINCTION" : m.totalPoints >= 150 ? "HONORS" : "COMMENDED")
    })),
    ...staticRankings.filter(sr => !members.some(m => `${m.firstName} ${m.lastName}`.toLowerCase() === sr.name.toLowerCase()))
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-serif italic py-10 px-4 sm:px-6">
      {/* Header Banner */}
      <div 
        className="py-16 md:py-20 px-6 text-center bg-cover bg-center relative z-10 rounded-3xl overflow-hidden mb-10 max-w-7xl mx-auto shadow-2xl"
        style={{ backgroundImage: "url('/images/media_1787224434429.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-950/90"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto">
          <div className="inline-block bg-amber-500/30 text-amber-300 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-3 border border-amber-400/30">
            Continental Evaluation & Recognition
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Pan-African Grade Board</h1>
          <p className="text-sm md:text-base text-blue-200 max-w-2xl mx-auto">
            Honoring youth leaders and student pioneers across Africa for task execution, grassroots solutions, and active community contributions.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Tier Badges Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-amber-900/40 backdrop-blur-md rounded-2xl p-5 border border-amber-500/40 text-center">
            <span className="text-2xl">🥇</span>
            <h3 className="text-base font-black text-amber-300 mt-1">Pioneer Distinction</h3>
            <p className="text-xs text-amber-100 mt-0.5">300+ Points • Highest Executive Recognition & Seed Grants</p>
          </div>
          <div className="bg-indigo-900/40 backdrop-blur-md rounded-2xl p-5 border border-indigo-500/40 text-center">
            <span className="text-2xl">🥈</span>
            <h3 className="text-base font-black text-indigo-300 mt-1">Pioneer Honors</h3>
            <p className="text-xs text-indigo-100 mt-0.5">150+ Points • Continental Fellowship & Ambassador Priority</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-600 text-center">
            <span className="text-2xl">🥉</span>
            <h3 className="text-base font-black text-slate-300 mt-1">Pioneer Commended</h3>
            <p className="text-xs text-slate-300 mt-0.5">50+ Points • Active Assignment Contributor</p>
          </div>
        </div>

        {/* Global Scorecard Table */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-900 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Official Leaderboard
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">{rankings.length} Evaluated Pioneers</h2>
              <p className="text-xs text-slate-600">Points are awarded by Department Leaders upon task review and verification.</p>
            </div>
            
            <div className="flex gap-3">
              <Link href="/portal/member" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow">
                My Scorecard &rarr;
              </Link>
              <Link href="/portal/department" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow">
                Task Reviewer Portal &rarr;
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Pioneer Name</th>
                  <th className="p-3">POAF ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Country</th>
                  <th className="p-3 text-center">Tasks Completed</th>
                  <th className="p-3 text-center">Total Points</th>
                  <th className="p-3 text-center">Honor Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankings.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-black text-slate-600">
                      {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                    </td>
                    <td className="p-3 font-black text-slate-900">{p.name}</td>
                    <td className="p-3 font-mono font-bold text-blue-700">{p.poafId}</td>
                    <td className="p-3 text-slate-600">{p.role}</td>
                    <td className="p-3 text-slate-600">{p.dept}</td>
                    <td className="p-3 font-bold text-slate-700">{p.country}</td>
                    <td className="p-3 text-center font-black text-slate-800">{p.tasks}</td>
                    <td className="p-3 text-center">
                      <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {p.points} pts
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        p.tier === "DISTINCTION" ? "bg-amber-100 text-amber-900 border border-amber-300" :
                        p.tier === "HONORS" ? "bg-blue-100 text-blue-900 border border-blue-300" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {p.tier}
                      </span>
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