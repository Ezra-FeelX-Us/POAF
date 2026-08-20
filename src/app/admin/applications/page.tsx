import React from "react";
import prisma from "@/lib/prisma";
import { processApplication, deleteApplication } from "@/actions/adminApplications";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  let applications: any[] = [];
  try {
    applications = await prisma.application.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
  } catch (err) {
    console.warn("Applications fetch fallback:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Application Tracking</h1>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
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
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-700">App ID / Type</th>
                  <th className="p-4 font-semibold text-slate-700">Applicant Details</th>
                  <th className="p-4 font-semibold text-slate-700">Status & Processing</th>
                  <th className="p-4 font-semibold text-slate-700 w-1/4">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-bold text-sm text-slate-900">{app.poafId || "Pending ID"}</div>
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded uppercase font-bold mt-1 inline-block">
                        {app.type}
                      </span>
                      <div className="text-xs text-slate-500 mt-2">{new Date(app.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="text-sm font-medium text-slate-700 mb-2">Linked User: {app.user?.email || "Guest"}</div>
                      <details className="text-xs text-slate-600 bg-slate-100 p-2 rounded cursor-pointer">
                        <summary className="font-semibold text-blue-600">View JSON Payload</summary>
                        <pre className="mt-2 overflow-auto max-h-32">{app.payload}</pre>
                      </details>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold px-2 py-1 rounded block w-fit bg-slate-100 text-slate-800">
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 bg-slate-50/50">
                      <form action={processApplication} className="flex flex-col gap-2">
                        <input type="hidden" name="id" value={app.id} />
                        <select name="status" defaultValue={app.status} className="text-sm border border-slate-300 rounded p-1 bg-white">
                          <option value="SUBMITTED">Submitted</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="REVISION_REQUIRED">Revision Required</option>
                          <option value="ACCEPTED">Accepted / Approve</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                        <textarea name="notes" defaultValue={app.notes || ""} placeholder="Admin notes/corrections..." rows={2} className="text-xs border border-slate-300 rounded p-1" />
                        <div className="flex gap-2">
                          <button type="submit" className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 flex-1">Save State</button>
                          <button formAction={async () => { "use server"; await deleteApplication(app.id); }} className="bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded hover:bg-red-50 hover:text-red-600 transition">Delete</button>
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
