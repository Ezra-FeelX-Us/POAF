import React from "react";
import prisma from "@/lib/prisma";
import { addMember, deleteMember, updateMember } from "@/actions/members";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage({
 searchParams,
}: {
 searchParams: Promise<{ edit?: string; role?: string }>;
}) {
 const { edit, role } = await searchParams;

 let countries: any[] = [];
 let departments: any[] = [];
 let allMembers: any[] = [];

 try {
   const results = await Promise.all([
     prisma.country.findMany({ orderBy: { name: "asc" } }),
     prisma.department.findMany({ orderBy: { name: "asc" } }),
     prisma.member.findMany({
       where: { deletedAt: null },
       include: { country: true, department: true },
       orderBy: { leaderOrder: "asc" }
     })
   ]);
   countries = results[0];
   departments = results[1];
   allMembers = results[2];
 } catch (err) {
   console.warn("Admin members fetch fallback:", err);
 }

 const editingMember = edit ? allMembers.find(m => m.id === edit) : null;

 // Filtered lists by role tiers
 const leaders = allMembers.filter(m => m.role === "Department Leader" || (m.isLeader && m.leaderPosition?.toLowerCase().includes("leader") && !m.role.toLowerCase().includes("student")));
 const managers = allMembers.filter(m => m.role === "Manager" || m.role.toLowerCase().includes("engineer") || m.leaderPosition?.toLowerCase().includes("manager"));
 const secretaries = allMembers.filter(m => m.role === "Secretary" || m.leaderPosition?.toLowerCase().includes("secretary"));
 const studentLeaders = allMembers.filter(m => m.role === "Student Leader" || m.leaderPosition?.toLowerCase().includes("student leader"));
 const ambassadors = allMembers.filter(m => m.role.toLowerCase().includes("ambassador") || m.leaderPosition?.toLowerCase().includes("ambassador"));
 const executives = allMembers.filter(m => m.role.toLowerCase().includes("president") || m.role.toLowerCase().includes("founder") || m.leaderPosition?.toLowerCase().includes("president"));
 const generalMembers = allMembers.filter(m => !m.isLeader);

 let filteredMembers = allMembers;
 if (role === "leaders") filteredMembers = leaders;
 else if (role === "managers") filteredMembers = managers;
 else if (role === "secretaries") filteredMembers = secretaries;
 else if (role === "student-leaders") filteredMembers = studentLeaders;
 else if (role === "ambassadors") filteredMembers = ambassadors;
 else if (role === "executives") filteredMembers = executives;
 else if (role === "general") filteredMembers = generalMembers;

 return (
 <div className="space-y-8">
 {/* Title */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div>
 <h1 className="text-3xl font-extrabold text-slate-900">Personnel & Roles Directory</h1>
 <p className="text-slate-500 text-sm mt-1">Multi-tier role management: Leaders, Managers, Secretaries, Student Leaders, Ambassadors, and Members.</p>
 </div>
 <div className="bg-blue-50 text-blue-800 font-bold px-4 py-2 rounded-xl text-sm border border-blue-200">
 Total Registered: {allMembers.length}
 </div>
 </div>

 {/* Role Tabs / Dashboards Bar */}
 <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
 <Link 
 href="/admin/members" 
 className={`p-4 rounded-2xl border text-center transition-all ${!role ? "bg-blue-600 text-white shadow-md border-blue-600 font-bold" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"}`}
 >
 <div className="text-xl mb-1"></div>
 <div className="text-xs uppercase font-bold tracking-wider">All ({allMembers.length})</div>
 </Link>

 <Link 
 href="/admin/members?role=leaders" 
 className={`p-4 rounded-2xl border text-center transition-all ${role === "leaders" ? "bg-blue-600 text-white shadow-md border-blue-600 font-bold" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"}`}
 >
 <div className="text-xl mb-1"></div>
 <div className="text-xs uppercase font-bold tracking-wider">Leaders ({leaders.length})</div>
 </Link>

 <Link 
 href="/admin/members?role=managers" 
 className={`p-4 rounded-2xl border text-center transition-all ${role === "managers" ? "bg-blue-600 text-white shadow-md border-blue-600 font-bold" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"}`}
 >
 <div className="text-xl mb-1"></div>
 <div className="text-xs uppercase font-bold tracking-wider">Managers ({managers.length})</div>
 </Link>

 <Link 
 href="/admin/members?role=secretaries" 
 className={`p-4 rounded-2xl border text-center transition-all ${role === "secretaries" ? "bg-blue-600 text-white shadow-md border-blue-600 font-bold" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"}`}
 >
 <div className="text-xl mb-1"></div>
 <div className="text-xs uppercase font-bold tracking-wider">Secretaries ({secretaries.length})</div>
 </Link>

 <Link 
 href="/admin/members?role=student-leaders" 
 className={`p-4 rounded-2xl border text-center transition-all ${role === "student-leaders" ? "bg-blue-600 text-white shadow-md border-blue-600 font-bold" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"}`}
 >
 <div className="text-xl mb-1"></div>
 <div className="text-xs uppercase font-bold tracking-wider">St. Leaders ({studentLeaders.length})</div>
 </Link>

 <Link 
 href="/admin/members?role=ambassadors" 
 className={`p-4 rounded-2xl border text-center transition-all ${role === "ambassadors" ? "bg-blue-600 text-white shadow-md border-blue-600 font-bold" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"}`}
 >
 <div className="text-xl mb-1"></div>
 <div className="text-xs uppercase font-bold tracking-wider">Ambassadors ({ambassadors.length})</div>
 </Link>

 <Link 
 href="/admin/members?role=executives" 
 className={`p-4 rounded-2xl border text-center transition-all ${role === "executives" ? "bg-blue-600 text-white shadow-md border-blue-600 font-bold" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"}`}
 >
 <div className="text-xl mb-1"></div>
 <div className="text-xs uppercase font-bold tracking-wider">Founders ({executives.length})</div>
 </Link>
 </div>

 {/* Member / Leader Form with Background Image */}
 <div 
 className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden"
 >
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-bold text-slate-900">
 {editingMember ? `Edit Personnel: ${editingMember.firstName} ${editingMember.lastName}` : "Register New Personnel / Assign Role"}
 </h2>
 {editingMember && (
 <span className="text-xs font-mono font-bold bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full">
 ID: {editingMember.poafId}
 </span>
 )}
 </div>

 <form action={editingMember ? updateMember : addMember} className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {editingMember && <input type="hidden" name="id" value={editingMember.id} />}
 
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">First Name *</label>
 <input type="text" name="firstName" defaultValue={editingMember?.firstName || ""} required placeholder="First Name" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Last Name *</label>
 <input type="text" name="lastName" defaultValue={editingMember?.lastName || ""} required placeholder="Last Name" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">POAF ID (Optional)</label>
 <input type="text" name="poafId" defaultValue={editingMember?.poafId || ""} placeholder="e.g. POAF-LDR-0012 (Auto-generated if empty)" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Role Category *</label>
 <select name="role" defaultValue={editingMember?.role || "Member"} required className="w-full rounded-xl border border-slate-300 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
 <option value="Department Leader">Department Leader ( Leader)</option>
 <option value="Manager">Department Manager ( Manager)</option>
 <option value="Secretary">Department Secretary ( Secretary)</option>
 <option value="Student Leader">Student Leader / St. Leader ( St. Leader)</option>
 <option value="National Ambassador">National Ambassador ( Ambassador)</option>
 <option value="Founder & Executive President">Founder & Executive President ( Founder)</option>
 <option value="Member">General Pioneer Member ( Member)</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Custom Title / Position</label>
 <input type="text" name="leaderPosition" defaultValue={editingMember?.leaderPosition || ""} placeholder="e.g. Leader & Ambassador, Tech" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Assigned Department</label>
 <select name="departmentId" defaultValue={editingMember?.departmentId || ""} className="w-full rounded-xl border border-slate-300 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
 <option value="">No Department / Executive Assembly</option>
 {departments.map(d => (
 <option key={d.id} value={d.id}>{d.name}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Country *</label>
 <select name="countryId" defaultValue={editingMember?.countryId || countries[0]?.id || ""} required className="w-full rounded-xl border border-slate-300 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
 {countries.map(c => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Photo URL</label>
 <input type="text" name="photoUrl" defaultValue={editingMember?.photoUrl || ""} placeholder="/images/lydia-teshibelay.png" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Hierarchy Rank Order</label>
 <input type="number" name="leaderOrder" defaultValue={editingMember?.leaderOrder || 1} className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
 </div>

 <div className="md:col-span-3 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
 <input type="checkbox" name="isLeader" id="isLeader" defaultChecked={editingMember ? editingMember.isLeader : true} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
 <label htmlFor="isLeader" className="text-xs font-bold text-slate-800 cursor-pointer">
 Public Leadership Registry Status (Display on Homepage, Department Rosters, and Public Directories)
 </label>
 </div>

 <div className="md:col-span-3 flex gap-4 mt-2">
 <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition text-sm">
 {editingMember ? "Save Personnel Changes" : "Create & Publish Personnel"}
 </button>
 {editingMember && (
 <Link href="/admin/members" className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-3.5 rounded-xl transition text-sm">
 Cancel Edit
 </Link>
 )}
 </div>
 </form>
 </div>

 {/* Roster Table with Background Image Banner */}
 <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
 <div 
 className="px-6 py-5 bg-cover bg-center relative flex justify-between items-center text-white"
 style={{ backgroundImage: "url('/images/media_1787224493193.jpg')" }}
 >
 <div className="absolute inset-0 bg-slate-950/85"></div>
 <div className="relative z-10">
 <h3 className="font-extrabold text-base">Personnel Roster ({filteredMembers.length})</h3>
 <p className="text-xs text-slate-300">Live verified database records</p>
 </div>
 <span className="relative z-10 text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
 Active Registry
 </span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse text-sm">
 <thead>
 <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
 <th className="p-4">Name & Headshot</th>
 <th className="p-4">Role Tier</th>
 <th className="p-4">Position / Portfolio</th>
 <th className="p-4">Department</th>
 <th className="p-4">Country</th>
 <th className="p-4">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {filteredMembers.map(m => (
 <tr key={m.id} className="hover:bg-slate-50 transition-colors">
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div 
 className="w-12 h-12 rounded-full border border-slate-200 bg-cover bg-center shadow-sm flex-shrink-0"
 style={{ backgroundImage: `url('${m.photoUrl || "/images/media_1787222340022.png"}')` }}
 ></div>
 <div>
 <div className="font-bold text-slate-900">{m.firstName} {m.lastName}</div>
 <div className="text-xs text-slate-400 font-mono">{m.poafId || "VERIFIED"}</div>
 </div>
 </div>
 </td>
 <td className="p-4">
 <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
 {m.role}
 </span>
 </td>
 <td className="p-4 font-semibold text-blue-700">
 {m.leaderPosition || m.role}
 </td>
 <td className="p-4 text-slate-600">
 {m.department?.name || "Executive Assembly"}
 </td>
 <td className="p-4 font-semibold text-slate-700">
 {m.country?.name}
 </td>
 <td className="p-4">
 <div className="flex items-center gap-2">
 <Link 
 href={`/admin/members?edit=${m.id}`}
 className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition"
 >
 Edit
 </Link>
 <form action={async () => { "use server"; await deleteMember(m.id); }}>
 <button 
 type="submit" 
 className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition"
 >
 Delete
 </button>
 </form>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}