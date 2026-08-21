import React from "react";
import prisma from "@/lib/prisma";
import { processApplication, deleteApplication } from "@/actions/adminApplications";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  let applications: any[] = [];
  let departments: any[] = [];
  try {
    const [apps, depts] = await Promise.all([
      prisma.application.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      }),
      prisma.department.findMany({
        where: { deletedAt: null }
      })
    ]);
    applications = apps;
    departments = depts;
  } catch (err) {
    console.warn("Applications fetch fallback:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Application Tracking & Review</h1>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm">
          Active Applications: {applications.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No applications in the queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-700">
                  <th className="p-4">App ID / Type</th>
                  <th className="p-4">Applicant Details</th>
                  <th className="p-4">Status & Boards</th>
                  <th className="p-4 w-1/3">Admin Assignment & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-bold text-sm text-slate-900 font-mono">{app.poafId || "Pending ID"}</div>
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded uppercase font-bold mt-1 inline-block">
                        {app.type}
                      </span>
                      <div className="text-xs text-slate-500 mt-2">{new Date(app.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="text-sm font-medium text-slate-700 mb-2">User: {app.user?.email || "Guest Applicant"}</div>
                      <details className="text-xs text-slate-600 bg-slate-100 p-2 rounded cursor-pointer">
                        <summary className="font-semibold text-blue-600">View Application Data</summary>
                        <pre className="mt-2 overflow-auto max-h-32 font-mono text-[11px]">{app.payload}</pre>
                      </details>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                        app.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-800" :
                        app.status === "REJECTED" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {app.status.replace("_", " ")}
                      </span>
                      {app.status === "ACCEPTED" && (
                        <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                          <div>✓ Official Members Board</div>
                          {app.type === "LEADERSHIP" && <div>✓ Leadership Board</div>}
                        </div>
                      )}
                    </td>
                    <td className="p-4 bg-slate-50/50">
                      <form action={processApplication} className="flex flex-col gap-2.5">
                        <input type="hidden" name="id" value={app.id} />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Status</label>
                            <select name="status" defaultValue={app.status} className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white">
                              <option value="SUBMITTED">Submitted</option>
                              <option value="UNDER_REVIEW">Under Review</option>
                              <option value="REVISION_REQUIRED">Revision Required</option>
                              <option value="ACCEPTED">Accepted / Approve</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Role / Category</label>
                            <select name="assignedRole" defaultValue={app.type === "LEADERSHIP" ? "Department Leader" : "Member"} className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white">
                              <option value="Member">General Member</option>
                              <option value="Department Leader">Department Leader</option>
                              <option value="Manager">Manager</option>
                              <option value="Secretary">Secretary</option>
                              <option value="Student Leader">Student Leader</option>
                              <option value="National Ambassador">National Ambassador</option>
                              <option value="Founder & Executive President">Executive Council</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Assign Department</label>
                          <select name="departmentId" className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white">
                            <option value="">No Department / Executive General</option>
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <input type="checkbox" name="isLeader" id={`leader-${app.id}`} value="true" defaultChecked={app.type === "LEADERSHIP"} className="w-3.5 h-3.5 rounded text-blue-600" />
                          <label htmlFor={`leader-${app.id}`} className="text-[11px] font-bold text-slate-700 cursor-pointer">
                            Display on Leadership Board & Homepage
                          </label>
                        </div>

                        <textarea name="notes" defaultValue={app.notes || ""} placeholder="Admin notes/instructions..." rows={1} className="text-xs border border-slate-300 rounded p-1.5 w-full" />
                        
                        <div className="flex gap-2">
                          <button type="submit" className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 flex-1 font-bold shadow-sm">Save & Assign</button>
                          <button formAction={async () => { "use server"; await deleteApplication(app.id); }} className="bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition font-bold">Delete</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
