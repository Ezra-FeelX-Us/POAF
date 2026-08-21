import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDatabasePage({ searchParams }: { searchParams?: Promise<{ tab?: string; q?: string }> }) {
  const search = await searchParams;
  const currentTab = search?.tab || "members";

  const [members, apps, depts, projects, partners, users, logs] = await Promise.all([
    prisma.member.findMany({ where: { deletedAt: null }, include: { department: true, country: true }, orderBy: { joinedDate: "desc" } }),
    prisma.application.findMany({ where: { deletedAt: null }, include: { user: true }, orderBy: { createdAt: "desc" } }),
    prisma.department.findMany({ where: { deletedAt: null }, include: { leader: true, members: true, projects: true }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ where: { deletedAt: null }, include: { department: true }, orderBy: { createdAt: "desc" } }),
    prisma.partnership.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ where: { deletedAt: null }, include: { member: true }, orderBy: { createdAt: "desc" } }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Database Studio & Table View</h1>
          <p className="text-sm text-slate-600">High-speed structured table manager for all PostgreSQL models and records.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-300">
            Neon PostgreSQL Connected
          </span>
        </div>
      </div>

      {/* Database Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "members", label: "Members", count: members.length },
          { id: "applications", label: "Applications", count: apps.length },
          { id: "departments", label: "Departments", count: depts.length },
          { id: "projects", label: "Projects", count: projects.length },
          { id: "partnerships", label: "Partnerships", count: partners.length },
          { id: "users", label: "User Accounts", count: users.length },
          { id: "logs", label: "Audit Logs", count: logs.length },
        ].map((t) => (
          <Link
            key={t.id}
            href={`/admin/database?tab=${t.id}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === t.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{t.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              currentTab === t.id ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-600"
            }`}>
              {t.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {currentTab === "members" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 uppercase font-black text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">POAF ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role / Title</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Invite Code</th>
                  <th className="p-3">Invited Pioneers</th>
                  <th className="p-3">Display Boards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{m.poafId || "--"}</td>
                    <td className="p-3 font-bold">{m.firstName} {m.lastName}</td>
                    <td className="p-3 text-slate-500">{m.email || "--"}</td>
                    <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{m.role}</span></td>
                    <td className="p-3">{m.department?.name || "General"}</td>
                    <td className="p-3">{m.country?.name || "--"}</td>
                    <td className="p-3 font-mono font-bold text-purple-700">{m.inviteCode || "--"}</td>
                    <td className="p-3 font-bold text-center">{m.inviteCount}</td>
                    <td className="p-3 space-x-1">
                      {m.displayOnMembersBoard && <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Members</span>}
                      {m.displayOnLeadershipBoard && <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Leadership</span>}
                      {m.displayOnHomepage && <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Home</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === "applications" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 uppercase font-black text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">App ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payload Summary</th>
                  <th className="p-3">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {apps.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{a.poafId || a.id.slice(0, 8)}</td>
                    <td className="p-3"><span className="bg-slate-800 text-white px-2 py-0.5 rounded font-bold text-[10px]">{a.type}</span></td>
                    <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">{a.status}</span></td>
                    <td className="p-3 font-mono text-[11px] max-w-md truncate">{a.payload}</td>
                    <td className="p-3 text-slate-500">{new Date(a.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === "departments" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 uppercase font-black text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Department Name</th>
                  <th className="p-3">Leader</th>
                  <th className="p-3">Members Count</th>
                  <th className="p-3">Ongoing Projects</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {depts.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{d.name}</td>
                    <td className="p-3 text-blue-700 font-semibold">{d.leader ? `${d.leader.firstName} ${d.leader.lastName}` : "Not Appointed"}</td>
                    <td className="p-3 font-bold text-center">{d.members.length}</td>
                    <td className="p-3 font-bold text-center">{d.projects.length}</td>
                    <td className="p-3 text-slate-600 max-w-md truncate">{d.description || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === "projects" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 uppercase font-black text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Project ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Beneficiaries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{p.poafId || "--"}</td>
                    <td className="p-3 font-bold">{p.title}</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{p.status}</span></td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.department?.name || "--"}</td>
                    <td className="p-3 font-bold">{p.progressPct}%</td>
                    <td className="p-3">{p.actualBeneficiaries} / {p.targetBeneficiaries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === "partnerships" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 uppercase font-black text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Organization Name</th>
                  <th className="p-3">Partner Type</th>
                  <th className="p-3">Website</th>
                  <th className="p-3">Collaboration Areas</th>
                  <th className="p-3">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {partners.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{pr.organizationName}</td>
                    <td className="p-3">{pr.organizationType || "Corporate/NGO"}</td>
                    <td className="p-3 text-blue-600">{pr.website || "--"}</td>
                    <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">{pr.collaborationAreas || "All Chapters"}</span></td>
                    <td className="p-3 text-slate-500">{new Date(pr.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === "users" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 uppercase font-black text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Access Role</th>
                  <th className="p-3">Linked Member Profile</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold">{u.name || "--"}</td>
                    <td className="p-3 font-mono text-blue-700">{u.email}</td>
                    <td className="p-3"><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">{u.role}</span></td>
                    <td className="p-3">{u.member ? `${u.member.firstName} ${u.member.lastName} (${u.member.poafId})` : "None linked"}</td>
                    <td className="p-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === "logs" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 uppercase font-black text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-bold text-slate-900">{l.action}</td>
                    <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded">{l.entityType || "SYSTEM"}</span></td>
                    <td className="p-3 text-slate-600 max-w-lg truncate">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
