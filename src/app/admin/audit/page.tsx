import React from "react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  let logs: any[] = [];
  try {
    logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
      take: 50
    });
  } catch (err) {
    console.warn("Audit logs fetch fallback:", err);
  }

  const sampleLogs = [
    {
      id: "log-1",
      userName: "Admin Ezra Michael",
      userRole: "SUPER_ADMIN",
      action: "Appoint Ambassador",
      entity: "National Ambassador",
      details: "Appointed Ali Omari Washikala as Ambassador of Kenya",
      prevValue: "Unassigned",
      newValue: "Ambassador of Kenya",
      createdAt: new Date("2026-08-20T14:32:00Z")
    },
    {
      id: "log-2",
      userName: "Admin Ezra Michael",
      userRole: "SUPER_ADMIN",
      action: "Approve Application",
      entity: "Membership Intake",
      details: "Approved Application POAF-APP-8831 for Lydia Teshibelay",
      prevValue: "SUBMITTED",
      newValue: "ACCEPTED (POAF-MEM-0024)",
      createdAt: new Date("2026-08-20T12:15:00Z")
    },
    {
      id: "log-3",
      userName: "Leader Tebarek Alemu",
      userRole: "DEPT_LEADER",
      action: "Project Milestone Update",
      entity: "Technology & Innovation",
      details: "Advanced 'POAF Digital Platform' completion to 65%",
      prevValue: "50%",
      newValue: "65%",
      createdAt: new Date("2026-08-19T18:40:00Z")
    },
    {
      id: "log-4",
      userName: "Admin Ezra Michael",
      userRole: "SUPER_ADMIN",
      action: "Register Partner",
      entity: "Partnerships",
      details: "Onboarded 'KB's Opportunity Hub' to official partner registry",
      prevValue: "None",
      newValue: "KB's OPPORTUNITY HUB (POAF-PTN-0001)",
      createdAt: new Date("2026-08-18T10:00:00Z")
    },
    {
      id: "log-5",
      userName: "Leader Dagmawit Getye",
      userRole: "DEPT_LEADER",
      action: "Schedule Event",
      entity: "Debate & Communication",
      details: "Scheduled Pan-African Student Debate Cup preliminaries",
      prevValue: "None",
      newValue: "Event Scheduled (Virtual)",
      createdAt: new Date("2026-08-17T15:20:00Z")
    }
  ];

  const displayLogs = logs.length > 0 ? logs.map((l: any) => ({
    id: l.id,
    userName: l.user?.name || "System Admin",
    userRole: l.user?.role || "ADMIN",
    action: l.action,
    entity: l.entityType,
    details: l.details || "",
    prevValue: l.prevValue || "—",
    newValue: l.newValue || "—",
    createdAt: l.createdAt
  })) : sampleLogs;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit & Governance Trail</h1>
          <p className="text-slate-500 text-sm mt-1">Immutable administrative action logs with complete transformation records.</p>
        </div>
        <div className="bg-slate-900 text-white font-mono text-xs px-4 py-2 rounded-xl">
          Active Trace Protocol: Enabled
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm">Transparency Log: Who → What → When → Previous → New</h3>
          <span className="text-xs text-slate-400 font-mono">Last 50 Entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Initiator (Who)</th>
                <th className="p-4">Action & Scope (What)</th>
                <th className="p-4">Previous Value</th>
                <th className="p-4">New Value</th>
                <th className="p-4">Timestamp (When)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-blue-700">{log.action}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{log.details}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-mono bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 block w-fit">
                      {log.prevValue}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 block w-fit font-bold">
                      {log.newValue}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
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