import React from "react";
import prisma from "@/lib/prisma";
import { addDepartment, deleteDepartment, updateDepartment, appointDepartmentLeaderAction } from "@/actions/departments";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  let departments: any[] = [];
  try {
    departments = await prisma.department.findMany({
      include: { _count: { select: { members: true, projects: true } }, leader: true },
      orderBy: { name: "asc" }
    });
  } catch (err) {
    console.warn("Admin departments fetch fallback:", err);
  }

  const editingDept = edit ? departments.find(d => d.id === edit) : null;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Continental Departments</h1>
          <p className="text-xs text-slate-500 mt-1">Manage division profiles and provision Department Leaders with custom manual credentials.</p>
        </div>
      </div>

      {/* Appoint Department Leader Form (Super Admin Control) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl text-white space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
            Super Admin Provisioning
          </span>
          <h2 className="text-xl font-black mt-2">Appoint / Create Department Leader</h2>
          <p className="text-xs text-slate-400">Directly assign manual POAF ID, password/PIN, and profile for any continental division.</p>
        </div>

        <form action={appointDepartmentLeaderAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Target Department *</label>
              <select name="departmentId" required className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500">
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Custom Manual POAF ID *</label>
              <input type="text" name="poafId" required placeholder="e.g. POAF-LDR-TECH-01" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Leader Full Name *</label>
              <input type="text" name="name" required placeholder="Leader Name" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Email Address *</label>
              <input type="email" name="email" required placeholder="leader@poaf.org" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Login Password / PIN *</label>
              <input type="text" name="password" required defaultValue="password123" placeholder="Password or PIN" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Photo URL</label>
              <input type="text" name="photoUrl" placeholder="/images/... or URL" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Leader Bio & Academic Summary</label>
            <input type="text" name="bio" placeholder="Visionary leader heading continental innovation initiatives..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>

          <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
            Provision Department Leader Credentials &rarr;
          </button>
        </form>
      </div>

      {/* Departments Roster Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3.5 text-left">Department Name</th>
              <th className="px-6 py-3.5 text-left">Appointed Leader</th>
              <th className="px-6 py-3.5 text-left">Pioneers</th>
              <th className="px-6 py-3.5 text-left">Projects</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {departments.map(dept => (
              <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{dept.name}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{dept.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  {dept.leader ? (
                    <div>
                      <span className="font-bold text-blue-700 block">{dept.leader.firstName} {dept.leader.lastName}</span>
                      <span className="font-mono text-[10px] text-slate-500">{dept.leader.poafId}</span>
                    </div>
                  ) : (
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                  {dept._count?.members || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                  {dept._count?.projects || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}