import React from "react";
import prisma from "@/lib/prisma";
import { processApplication, deleteApplication } from "@/actions/adminApplications";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  let applications: any[] = [];
  let departments: any[] = [];
  let countries: any[] = [];

  try {
    const [apps, depts, cnts] = await Promise.all([
      prisma.application.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      }),
      prisma.department.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' }
      }),
      prisma.country.findMany({
        orderBy: { name: 'asc' }
      })
    ]);
    applications = apps;
    departments = depts;
    countries = cnts;
  } catch (err) {
    console.warn("Applications fetch fallback:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Application Review & Full Assignment Engine</h1>
          <p className="text-sm text-slate-600">Review pioneer applications and explicitly define identity, roles, departments, invite codes, and public display destinations.</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-black text-sm border border-blue-200">
          Applications in Queue: {applications.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            No applications pending in the queue.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {applications.map((app) => {
              let parsedPayload: any = {};
              try {
                parsedPayload = JSON.parse(app.payload || "{}");
              } catch (e) {
                parsedPayload = {};
              }

              return (
                <div key={app.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Left: Applicant Information & Payload Viewer */}
                    <div className="w-full lg:w-1/3 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          {app.poafId || `APP-${app.id.slice(0, 8).toUpperCase()}`}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider bg-slate-800 text-white px-2.5 py-1 rounded-md">
                          {app.type}
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                        <div><span className="font-bold text-slate-700">Applicant:</span> {parsedPayload.fullName || `${parsedPayload.firstName || ''} ${parsedPayload.lastName || ''}`}</div>
                        <div><span className="font-bold text-slate-700">Email:</span> {parsedPayload.email || app.user?.email || "None provided"}</div>
                        <div><span className="font-bold text-slate-700">Phone:</span> {parsedPayload.phone || "None provided"}</div>
                        <div><span className="font-bold text-slate-700">Country:</span> {parsedPayload.country || parsedPayload.countryName || "Not specified"}</div>
                        <div><span className="font-bold text-slate-700">Invited By / Ref:</span> <span className="font-mono font-bold text-purple-700">{parsedPayload.invitedBy || parsedPayload.ref || "Direct Signup"}</span></div>
                        <div><span className="font-bold text-slate-700">Submitted:</span> {new Date(app.createdAt).toLocaleString()}</div>
                        
                        <details className="mt-3 pt-2 border-t border-slate-200 cursor-pointer">
                          <summary className="font-bold text-blue-600 hover:text-blue-700">Inspect Full Submission Payload</summary>
                          <pre className="mt-2 p-2 bg-slate-900 text-emerald-400 rounded-lg overflow-x-auto text-[11px] font-mono max-h-48 whitespace-pre-wrap">
                            {JSON.stringify(parsedPayload, null, 2)}
                          </pre>
                        </details>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Current Status:</span>
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          app.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-800" :
                          app.status === "REJECTED" ? "bg-red-100 text-red-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Right: Full Explicit Admin Acceptance & Assignment Station */}
                    <div className="w-full lg:w-2/3 bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        Admin Custom Assignment & Destination Configuration
                      </h3>

                      <form action={processApplication} className="space-y-4">
                        <input type="hidden" name="id" value={app.id} />
                        <input type="hidden" name="invitedBy" value={parsedPayload.invitedBy || parsedPayload.ref || ""} />

                        {/* Status & POAF ID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                              Application Decision <span className="text-red-500">*</span>
                            </label>
                            <select name="status" defaultValue={app.status} className="w-full text-xs font-semibold border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500">
                              <option value="SUBMITTED">Submitted (Pending Review)</option>
                              <option value="UNDER_REVIEW">Under Review</option>
                              <option value="REVISION_REQUIRED">Revision Required</option>
                              <option value="ACCEPTED">ACCEPTED (Execute Full Provisioning)</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                              Custom POAF ID <span className="text-slate-400 font-normal">(e.g. POAF-MEM-0050)</span>
                            </label>
                            <input 
                              type="text" 
                              name="poafId" 
                              defaultValue={app.poafId || ""} 
                              placeholder="Enter Custom ID or leave blank to auto-generate" 
                              className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                        </div>

                        {/* Name & Contact */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">First Name</label>
                            <input 
                              type="text" 
                              name="firstName" 
                              defaultValue={parsedPayload.firstName || parsedPayload.fullName?.split(" ")[0] || ""} 
                              placeholder="Enter First Name" 
                              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Last Name</label>
                            <input 
                              type="text" 
                              name="lastName" 
                              defaultValue={parsedPayload.lastName || parsedPayload.fullName?.split(" ").slice(1).join(" ") || ""} 
                              placeholder="Enter Last Name" 
                              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Email Address</label>
                            <input 
                              type="email" 
                              name="email" 
                              defaultValue={parsedPayload.email || app.user?.email || ""} 
                              placeholder="Enter Email" 
                              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                        </div>

                        {/* Role, Custom Title & Department */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                              Role Category <span className="text-red-500">*</span>
                            </label>
                            <select name="assignedRole" className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2 bg-white">
                              <option value="Member">General Member</option>
                              <option value="Department Leader">Department Leader</option>
                              <option value="Manager">Department Manager</option>
                              <option value="Secretary">Department Secretary</option>
                              <option value="Student Leader">Student Leader</option>
                              <option value="National Ambassador">National Ambassador</option>
                              <option value="Executive Council">Executive Council</option>
                              <option value="Project Director">Project Director</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                              Custom Title / Position
                            </label>
                            <input 
                              type="text" 
                              name="leaderPosition" 
                              defaultValue={parsedPayload.position || ""} 
                              placeholder="e.g. Lead Ambassador & Engineer" 
                              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                              Assigned Department
                            </label>
                            <select name="departmentId" className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white">
                              <option value="">-- No Department / Sovereign General --</option>
                              {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Country & Photo URL & Custom Invite Code */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Country</label>
                            <select name="countryId" className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white">
                              <option value="">Select Sovereign Nation...</option>
                              {countries.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Photo URL / Upload</label>
                            <input 
                              type="text" 
                              name="photoUrl" 
                              defaultValue={app.photoUrl || parsedPayload.photoUrl || ""} 
                              placeholder="/images/... or https://..." 
                              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Custom Invite / Referral Code</label>
                            <input 
                              type="text" 
                              name="inviteCode" 
                              defaultValue={parsedPayload.customInviteCode || ""} 
                              placeholder="e.g. EZRA-REF or leave blank" 
                              className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                        </div>

                        {/* Bio & Skills */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Biography / Statement</label>
                            <textarea 
                              name="bio" 
                              defaultValue={parsedPayload.bio || parsedPayload.statement || ""} 
                              rows={2} 
                              placeholder="Pioneer biography..." 
                              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Key Skills & Focus</label>
                            <textarea 
                              name="skills" 
                              defaultValue={parsedPayload.skills || ""} 
                              rows={2} 
                              placeholder="e.g. Python, Robotics, Community Water..." 
                              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                            />
                          </div>
                        </div>

                        {/* Explicit Public Display Destinations (Checkboxes) */}
                        <div className="bg-white rounded-xl p-3.5 border border-slate-300/80">
                          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-900 mb-2">
                            Explicit Display Destinations (Choose where this pioneer will appear):
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                              <input type="checkbox" name="displayOnMembersBoard" value="true" className="w-4 h-4 rounded text-blue-600" />
                              Official Members Board
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                              <input type="checkbox" name="displayOnLeadershipBoard" value="true" className="w-4 h-4 rounded text-blue-600" />
                              Leadership Board
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                              <input type="checkbox" name="displayOnHomepage" value="true" className="w-4 h-4 rounded text-blue-600" />
                              Homepage Spotlight
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                              <input type="checkbox" name="displayOnDepartmentRoster" value="true" className="w-4 h-4 rounded text-blue-600" />
                              Department Portal Roster
                            </label>
                          </div>
                        </div>

                        {/* Admin Notes */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Internal Admin Notes / Audit Instructions</label>
                          <input 
                            type="text" 
                            name="notes" 
                            defaultValue={app.notes || ""} 
                            placeholder="Add internal notes on this review..." 
                            className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                          <button 
                            type="submit" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <span>✓ Save Assignment & Process Application</span>
                          </button>
                          <button 
                            formAction={async () => { "use server"; await deleteApplication(app.id); }} 
                            className="bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition"
                          >
                            Delete Application
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
