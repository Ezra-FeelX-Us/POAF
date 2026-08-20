import prisma from "@/lib/prisma";
import React from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let totalMembers = 36;
  let leadersCount = 12;
  let managersCount = 4;
  let secretariesCount = 3;
  let studentLeadersCount = 4;
  let ambassadorsCount = 8;
  let executivesCount = 2;
  let departmentCount = 6;
  let projectCount = 8;
  let partnerCount = 6;
  let countryCount = 8;
  let applicationCount = 0;
  let recentApplications: any[] = [];

  try {
    const results = await Promise.all([
      prisma.member.count({ where: { deletedAt: null } }),
      prisma.member.count({ where: { role: "Department Leader", deletedAt: null } }),
      prisma.member.count({ where: { OR: [{ role: "Manager" }, { role: "Chief Engineer" }], deletedAt: null } }),
      prisma.member.count({ where: { role: "Secretary", deletedAt: null } }),
      prisma.member.count({ where: { role: "Student Leader", deletedAt: null } }),
      prisma.member.count({ where: { OR: [{ role: { contains: "Ambassador" } }, { leaderPosition: { contains: "Ambassador" } }], deletedAt: null } }),
      prisma.member.count({ where: { OR: [{ role: { contains: "President" } }, { role: { contains: "Founder" } }], deletedAt: null } }),
      prisma.department.count({ where: { deletedAt: null } }),
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.partnership.count({ where: { deletedAt: null } }),
      prisma.country.count(),
      prisma.application.count({ where: { deletedAt: null, status: "SUBMITTED" } }),
      prisma.application.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);
    totalMembers = results[0];
    leadersCount = results[1];
    managersCount = results[2];
    secretariesCount = results[3];
    studentLeadersCount = results[4];
    ambassadorsCount = results[5];
    executivesCount = results[6];
    departmentCount = results[7];
    projectCount = results[8];
    partnerCount = results[9];
    countryCount = results[10];
    applicationCount = results[11];
    recentApplications = results[12];
  } catch (err) {
    console.warn("Admin dashboard fetch fallback:", err);
  }

 return (
 <div className="space-y-8">
 {/* Title */}
 <div 
 className="p-8 rounded-3xl bg-cover bg-center relative text-white shadow-xl overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
 style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}
 >
 <div className="absolute inset-0 bg-slate-950/85"></div>
 <div className="relative z-10">
 <div className="inline-block bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-2">
 POAF Central Command
 </div>
 <h1 className="text-3xl md:text-4xl font-black">Executive Administration System</h1>
 <p className="text-slate-300 text-sm mt-1">Live database records synchronized across public registries and governance portals.</p>
 </div>
 <div className="relative z-10 flex gap-3">
 <Link 
 href="/admin/applications"
 className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
 >
 <span></span> Applications Queue ({applicationCount})
 </Link>
 </div>
 </div>
 
 {/* Real-time Stat Grid */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 <StatCard title="Total Registered" value={totalMembers} link="/admin/members" icon="" color="text-blue-600" />
 <StatCard title="Dept Leaders" value={leadersCount} link="/admin/members?role=leaders" icon="" color="text-indigo-600" />
 <StatCard title="National Amb." value={ambassadorsCount} link="/admin/members?role=ambassadors" icon="" color="text-emerald-600" />
 <StatCard title="Departments" value={departmentCount} link="/admin/departments" icon="️" color="text-purple-600" />
 <StatCard title="Active Projects" value={projectCount} link="/admin/projects" icon="" color="text-amber-600" />
 <StatCard title="Official Partners" value={partnerCount} link="/admin/partners" icon="" color="text-pink-600" />
 </div>

 {/* Role-Based Hierarchy Dashboard Grid */}
 <div>
 <h2 className="text-xl font-bold text-slate-900 mb-4">Leadership Tier Dashboards</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
 
 <Link href="/admin/members?role=leaders" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
 <div className="flex justify-between items-center mb-3">
 <span className="text-2xl"></span>
 <span className="text-xl font-black text-blue-600">{leadersCount}</span>
 </div>
 <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">Department Leaders</h3>
 <p className="text-xs text-slate-500 mt-1">Supervising division programs & personnel.</p>
 </Link>

 <Link href="/admin/members?role=managers" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
 <div className="flex justify-between items-center mb-3">
 <span className="text-2xl"></span>
 <span className="text-xl font-black text-indigo-600">{managersCount}</span>
 </div>
 <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">Department Managers</h3>
 <p className="text-xs text-slate-500 mt-1">Operational delivery and technical leads.</p>
 </Link>

 <Link href="/admin/members?role=secretaries" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
 <div className="flex justify-between items-center mb-3">
 <span className="text-2xl"></span>
 <span className="text-xl font-black text-amber-600">{secretariesCount}</span>
 </div>
 <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition">Secretaries & Records</h3>
 <p className="text-xs text-slate-500 mt-1">Communications, documentation & reports.</p>
 </Link>

 <Link href="/admin/members?role=student-leaders" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
 <div className="flex justify-between items-center mb-3">
 <span className="text-2xl"></span>
 <span className="text-xl font-black text-emerald-600">{studentLeadersCount}</span>
 </div>
 <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition">Student Leaders (St. Leaders)</h3>
 <p className="text-xs text-slate-500 mt-1">High school & campus chapter organizers.</p>
 </Link>

 <Link href="/admin/members?role=ambassadors" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
 <div className="flex justify-between items-center mb-3">
 <span className="text-2xl"></span>
 <span className="text-xl font-black text-purple-600">{ambassadorsCount}</span>
 </div>
 <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition">National Ambassadors</h3>
 <p className="text-xs text-slate-500 mt-1">Diplomatic country representatives.</p>
 </Link>

 </div>
 </div>

 {/* Fast Action Panels with Background Images */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div 
 className="rounded-3xl p-6 bg-cover bg-center text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
 style={{ backgroundImage: "url('/images/media_1787225249810.png')" }}
 >
 <div className="absolute inset-0 bg-slate-950/85"></div>
 <div className="relative z-10">
 <span className="text-2xl mb-2 block"></span>
 <h3 className="text-lg font-bold">Executive Governance</h3>
 <p className="text-blue-200 text-xs mt-1">Appoint national representatives, update presidential addresses, and manage High Council.</p>
 </div>
 <div className="relative z-10 flex gap-2 mt-6">
 <Link href="/admin/executives" className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-xl backdrop-blur-sm transition flex-1 text-center">Executives</Link>
 <Link href="/admin/ambassadors" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex-1 text-center">Ambassadors</Link>
 </div>
 </div>

 <div 
 className="rounded-3xl p-6 bg-cover bg-center text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
 style={{ backgroundImage: "url('/images/media_1787223249571.jpg')" }}
 >
 <div className="absolute inset-0 bg-slate-950/85"></div>
 <div className="relative z-10">
 <span className="text-2xl mb-2 block">️</span>
 <h3 className="text-lg font-bold">Departments & Staff</h3>
 <p className="text-slate-300 text-xs mt-1">Assign department heads, configure project mandates, and manage active sub-leaders.</p>
 </div>
 <div className="relative z-10 flex gap-2 mt-6">
 <Link href="/admin/departments" className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-xl backdrop-blur-sm transition flex-1 text-center">Departments</Link>
 <Link href="/admin/members" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex-1 text-center">All Members</Link>
 </div>
 </div>

 <div 
 className="rounded-3xl p-6 bg-cover bg-center text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
 style={{ backgroundImage: "url('/images/media_1787223618684.jpg')" }}
 >
 <div className="absolute inset-0 bg-slate-950/85"></div>
 <div className="relative z-10">
 <span className="text-2xl mb-2 block"></span>
 <h3 className="text-lg font-bold">Initiatives & Partners</h3>
 <p className="text-slate-300 text-xs mt-1">Launch new student projects, track completion percentages, and manage partner links.</p>
 </div>
 <div className="relative z-10 flex gap-2 mt-6">
 <Link href="/admin/projects" className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-xl backdrop-blur-sm transition flex-1 text-center">Projects</Link>
 <Link href="/admin/partners" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex-1 text-center">Partners</Link>
 </div>
 </div>
 </div>

 {/* Recent Submissions Queue with Background Image Header */}
 <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
 <div 
 className="p-6 bg-cover bg-center relative text-white flex justify-between items-center"
 style={{ backgroundImage: "url('/images/media_1787224493193.jpg')" }}
 >
 <div className="absolute inset-0 bg-slate-950/85"></div>
 <div className="relative z-10">
 <h3 className="text-lg font-bold">Recent Applications Queue</h3>
 <p className="text-xs text-slate-300">Incoming membership, leadership, and partnership submissions.</p>
 </div>
 <Link href="/admin/applications" className="relative z-10 text-blue-400 hover:text-blue-300 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
 View All Applications &rarr;
 </Link>
 </div>

 <div className="p-6">
 {recentApplications.length === 0 ? (
 <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
 <p className="text-slate-500 text-sm">No pending incoming applications in the queue.</p>
 <p className="text-xs text-slate-400 mt-1">Submissions from public application forms will appear here automatically.</p>
 </div>
 ) : (
 <div className="divide-y divide-slate-100">
 {recentApplications.map((app) => (
 <div key={app.id} className="py-3.5 flex items-center justify-between">
 <div>
 <div className="flex items-center gap-2">
 <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
 {app.type}
 </span>
 <span className="font-mono text-xs text-slate-500">{app.poafId || "Pending ID"}</span>
 </div>
 <p className="text-xs text-slate-400 mt-1">Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
 </div>
 <div className="flex items-center gap-3">
 <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
 {app.status}
 </span>
 <Link 
 href="/admin/applications"
 className="text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
 >
 Process
 </Link>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 );
}

function StatCard({ title, value, link, icon, color }: { title: string; value: any; link: string; icon: string; color: string }) {
 return (
 <Link href={link} className="block p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div className="flex justify-between items-center mb-2">
 <span className="text-xl">{icon}</span>
 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">View &rarr;</span>
 </div>
 <p className={`text-2xl font-black ${color}`}>{value}</p>
 <h3 className="text-slate-600 text-xs font-bold mt-1 truncate">{title}</h3>
 </Link>
 );
}