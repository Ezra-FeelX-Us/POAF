import React from "react";
import prisma from "@/lib/prisma";
import { resolveCurrentUserPortals } from "@/lib/portalResolver";
import { createTaskAction } from "@/actions/tasks";
import { 
  promoteMemberAction, 
  rateStudentAction, 
  upgradeStudentToAssistantAction,
  saveProjectAction, 
  reviewDeliverableAction, 
  recordMinutesAndAnnouncementAction 
} from "@/actions/departmentOps";
import { sendChatMessage } from "@/actions/chat";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StaffPortalPage({
  searchParams
}: {
  searchParams?: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const activeView = params?.view || "leader"; // leader | manager | student_leader | secretary | assistant

  const portalRes = await resolveCurrentUserPortals();

  let dept: any = null;
  let membersList: any[] = [];
  let departmentTasks: any[] = [];
  let announcements: any[] = [];
  let departmentProjects: any[] = [];
  let departmentChats: any[] = [];

  try {
    dept = await prisma.department.findFirst({
      include: {
        leader: true,
        members: { where: { status: "ACTIVE", deletedAt: null }, include: { country: true } },
        projects: { where: { deletedAt: null }, orderBy: { updatedAt: "desc" } },
        initiatives: { where: { deletedAt: null } }
      }
    });

    if (dept) {
      membersList = dept.members || [];
      departmentProjects = dept.projects || [];
      
      const [tasks, anncs, msgs] = await Promise.all([
        prisma.task.findMany({
          where: { departmentId: dept.id },
          include: { assignee: true },
          orderBy: { createdAt: "desc" }
        }),
        prisma.departmentAnnouncement.findMany({
          where: { departmentId: dept.id },
          orderBy: { createdAt: "desc" },
          take: 6
        }),
        prisma.chatMessage.findMany({
          where: { channel: dept.id },
          orderBy: { createdAt: "desc" },
          take: 20
        })
      ]);

      departmentTasks = tasks;
      announcements = anncs;
      departmentChats = msgs.reverse();
    }
  } catch (err) {
    console.error("Staff DB query fallback:", err);
  }

  const currentDept = dept || {
    id: "dept-tech",
    name: "Technology & Innovation",
    focus: "Pan-African open-source tools, offline mesh learning hubs, and software engineering chapters.",
    leader: { firstName: "Ali", lastName: "Usman", role: "Department Leader" },
    projects: []
  };

  const pendingSubmissions = departmentTasks.filter(t => t.status === "SUBMITTED");
  const gradedTasks = departmentTasks.filter(t => t.status === "GRADED");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Top Department Header & Scope Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800">
                International Administrative Console
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                5-Tier Operational Hierarchy
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{currentDept.name}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">{currentDept.focus}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Pioneers</span>
              <span className="text-lg font-black text-indigo-400">{membersList.length}</span>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Projects</span>
              <span className="text-lg font-black text-emerald-400">{departmentProjects.length}</span>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Submissions</span>
              <span className="text-lg font-black text-amber-400">{pendingSubmissions.length}</span>
            </div>
          </div>
        </div>

        {/* 5-Tier Role Hierarchy Navigation Switcher */}
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 mb-1">
            Role Responsibility & Operating Console:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
            <Link
              href="/staff?view=leader"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "leader" 
                  ? "bg-indigo-600 text-white shadow-lg" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">👑 Leader</span>
              <span className="text-[10px] opacity-80">Directives & Promotions</span>
            </Link>

            <Link
              href="/staff?view=manager"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "manager" 
                  ? "bg-purple-600 text-white shadow-lg" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">⚙️ Manager</span>
              <span className="text-[10px] opacity-80">Projects & Reviews</span>
            </Link>

            <Link
              href="/staff?view=student_leader"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "student_leader" 
                  ? "bg-emerald-600 text-white shadow-lg" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">🎓 Student Leader</span>
              <span className="text-[10px] opacity-80">1–100 Ratings & Upgrades</span>
            </Link>

            <Link
              href="/staff?view=secretary"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "secretary" 
                  ? "bg-amber-600 text-white shadow-lg" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">🗂️ Secretary</span>
              <span className="text-[10px] opacity-80">Minutes & News</span>
            </Link>

            <Link
              href="/staff?view=assistant"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "assistant" 
                  ? "bg-cyan-600 text-white shadow-lg" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">🤝 Assistant</span>
              <span className="text-[10px] opacity-80">Action Items</span>
            </Link>
          </div>
        </div>

        {/* ---------------- 1. DEPARTMENT LEADER VIEW ---------------- */}
        {activeView === "leader" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Giver Directive Station */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-800">
                    Highest Division Authority
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">Issue Strategic Task Directive</h2>
                  <p className="text-xs text-slate-400">Broadcast official deliverables and milestones to all division tiers.</p>
                </div>

                <form action={createTaskAction} className="space-y-4">
                  <input type="hidden" name="departmentId" value={currentDept.id} />
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Directive Title *</label>
                    <input type="text" name="title" required placeholder="e.g. Conduct Secondary School Tech Survey in Addis Ababa" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Executive Instructions & Blueprint *</label>
                    <textarea name="description" rows={3} required placeholder="State exact deliverables, target research metrics, or software architecture required..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Target Assignee Scope</label>
                      <select name="assigneeRole" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500">
                        <option value="ALL">All Division Members & Assistants</option>
                        <option value="MANAGER">Department Manager</option>
                        <option value="STUDENT_LEADER">Student Leader</option>
                        <option value="SECRETARY">Secretary</option>
                        <option value="ASSISTANT">Assistants Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Submission Deadline *</label>
                      <input type="datetime-local" name="deadline" required defaultValue={new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
                    Broadcast Directive to Division &rarr;
                  </button>
                </form>
              </div>

              {/* Task List */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white">Active Directives & Directives Ledger ({departmentTasks.length})</h3>
                {departmentTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No directives issued yet.</p>
                ) : (
                  <div className="space-y-3">
                    {departmentTasks.map((t) => (
                      <div key={t.id} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{t.title}</span>
                            <span className="text-[10px] font-mono bg-slate-900 text-blue-300 px-2 py-0.5 rounded border border-slate-700">{t.status}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                          <p className="text-[10px] text-slate-500 mt-2 font-mono">Deadline: {new Date(t.deadline || t.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pioneer Promotion Control (Leader Authority) */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
                    Leader Authority
                  </span>
                  <h3 className="text-lg font-black text-white mt-2">Promote Division Pioneer</h3>
                  <p className="text-xs text-slate-400">Shift verified members into leadership roles without external application.</p>
                </div>

                <form action={promoteMemberAction} className="space-y-4">
                  <input type="hidden" name="departmentId" value={currentDept.id} />
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Select Pioneer</label>
                    <select name="memberId" required className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500">
                      {membersList.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.firstName} {m.lastName} ({m.role || 'Member'} - {m.poafId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Promote to Leadership Role</label>
                    <select name="newRole" required className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500">
                      <option value="ASSISTANT">Department Assistant</option>
                      <option value="SECRETARY">Department Secretary</option>
                      <option value="STUDENT_LEADER">Department Student Leader</option>
                      <option value="MANAGER">Department Manager</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition">
                    Execute Promotion &rarr;
                  </button>
                </form>
              </div>

              {/* Department Roster */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Department Leadership Tiers</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {membersList.map((m) => (
                    <div key={m.id} className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{m.firstName} {m.lastName}</span>
                        <span className="text-[10px] text-slate-400">{m.country?.name} • {m.poafId}</span>
                      </div>
                      <span className="text-[9px] font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 2. DEPARTMENT MANAGER VIEW ---------------- */}
        {activeView === "manager" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* GitHub-style Project Execution Hub */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800">
                    GitHub-Style Project Engine
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">Manage Projects & Milestones</h2>
                  <p className="text-xs text-slate-400">Push project progress %, upload blueprints, and coordinate milestones.</p>
                </div>

                <form action={saveProjectAction} className="space-y-4">
                  <input type="hidden" name="departmentId" value={currentDept.id} />
                  <input type="hidden" name="projectId" value="new" />
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Project Name *</label>
                    <input type="text" name="title" required placeholder="e.g. Solar Water Purification Prototype" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Project Scope & Whitepaper Summary</label>
                    <textarea name="description" rows={3} required placeholder="Summarize engineering blueprint, community partners, and deliverables..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Progress Completion (%)</label>
                      <input type="number" name="progressPct" min={0} max={100} defaultValue={10} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Project Status</label>
                      <select name="status" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500">
                        <option value="ONGOING">Ongoing Execution</option>
                        <option value="APPROVED">Approved & Starting</option>
                        <option value="COMPLETED">Completed & Verified</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
                    Publish Project to Continental Registry &rarr;
                  </button>
                </form>
              </div>

              {/* Active Projects List */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white">Active Projects in Division ({departmentProjects.length})</h3>
                {departmentProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No projects registered yet.</p>
                ) : (
                  <div className="space-y-4">
                    {departmentProjects.map((prj) => (
                      <div key={prj.id} className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800 font-bold">{prj.poafId}</span>
                            <h4 className="font-bold text-white text-base mt-1">{prj.title}</h4>
                          </div>
                          <span className="text-[10px] font-bold bg-slate-900 text-emerald-400 px-2.5 py-1 rounded-full border border-slate-700">{prj.status}</span>
                        </div>
                        <p className="text-xs text-slate-300">{prj.description}</p>
                        
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                            <span>Completion</span>
                            <span className="text-purple-300">{prj.progressPct || 0}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${prj.progressPct || 0}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Static Deliverables & Submissions Reviewer */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    Submissions Reviewer
                  </span>
                  <h3 className="text-lg font-black text-white mt-2">Review Deliverables</h3>
                  <p className="text-xs text-slate-400">Review student PDF/image files, check deadlines, and leave feedback.</p>
                </div>

                {pendingSubmissions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No pending deliverables waiting for review.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingSubmissions.map((task) => (
                      <div key={task.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-white text-xs">{task.title}</h5>
                          <span className="text-[9px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded uppercase border border-amber-800">Submitted</span>
                        </div>
                        <p className="text-[11px] text-slate-300">By: {task.assignee?.firstName} {task.assignee?.lastName}</p>
                        {task.submissionLink && (
                          <div className="bg-slate-950 p-2.5 rounded-xl text-xs font-mono text-blue-400 truncate border border-slate-800">
                            📎 {task.submissionLink}
                          </div>
                        )}
                        <form action={reviewDeliverableAction} className="space-y-2 pt-2 border-t border-slate-700">
                          <input type="hidden" name="taskId" value={task.id} />
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" name="grade" defaultValue="95" placeholder="Score (1-100)" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                            <button type="submit" className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition">
                              Approve & Archive
                            </button>
                          </div>
                          <input type="text" name="feedback" placeholder="Feedback notes..." className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                        </form>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 3. STUDENT LEADER VIEW ---------------- */}
        {activeView === "student_leader" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student 1-100 Performance Rating & Gradual Upgrade */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Rating Station */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                    Student Voice & Performance Hub
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">Rate Department Student (1–100)</h2>
                  <p className="text-xs text-slate-400">Evaluate peer participation, assign strength badges, and provide mentorship feedback.</p>
                </div>

                <form action={rateStudentAction} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Select Student Pioneer *</label>
                    <select name="memberId" required className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500">
                      {membersList.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.firstName} {m.lastName} ({m.poafId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Performance Score (1–100) *</label>
                      <input type="number" name="score" min={1} max={100} defaultValue={90} required className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Recognized Strength Badge *</label>
                      <select name="strength" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500">
                        <option value="Grassroots Problem Solver">Grassroots Problem Solver</option>
                        <option value="Pioneer Code Architect">Pioneer Code Architect</option>
                        <option value="Continental Rhetoric & Debate">Continental Rhetoric & Debate</option>
                        <option value="Community Taskforce Leader">Community Taskforce Leader</option>
                        <option value="Research & Blueprint Engineering">Research & Blueprint Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Qualitative Feedback Notes</label>
                    <textarea name="notes" rows={2} placeholder="Exceptional punctuality, organized peer study circles, delivered prototype on schedule..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none" />
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
                    Save Student Scorecard &rarr;
                  </button>
                </form>
              </div>

              {/* Gradual Student Upgrade to Assistant */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
                    Gradual Peer Promotion
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">Upgrade Student to Department Assistant</h2>
                  <p className="text-xs text-slate-400">Promote active, consistent student members into assistant leadership taskforces.</p>
                </div>

                <form action={upgradeStudentToAssistantAction} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Select Member *</label>
                      <select name="memberId" required className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500">
                        {membersList.filter(m => m.role === "Member" || !m.isLeader).map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.firstName} {m.lastName} ({m.poafId})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Taskforce Assignment *</label>
                      <select name="committee" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500">
                        <option value="Field Research Taskforce">Field Research Taskforce</option>
                        <option value="Campus & Student Outreach">Campus & Student Outreach</option>
                        <option value="Technical Lab & Hackathons">Technical Lab & Hackathons</option>
                        <option value="Media & Communications">Media & Communications</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
                    Promote to Department Assistant &rarr;
                  </button>
                </form>
              </div>

              {/* Student Standing Roster */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white">Student Standing Roster ({membersList.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {membersList.map((m) => (
                    <div key={m.id} className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white text-xs block">{m.firstName} {m.lastName}</span>
                        <span className="text-[10px] text-slate-400">{m.skills || "Pioneer Member"}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-800">
                        {m.totalPoints ? Math.round(m.totalPoints / 10) : 88}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Department Community Chat Moderation */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col h-[520px]">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
                      Community Chat
                    </span>
                    <h3 className="text-base font-black text-white mt-1">Student Assembly Room</h3>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                  {departmentChats.length === 0 ? (
                    <p className="text-xs text-slate-500 py-12 text-center">No messages yet. Say hello to fellow pioneers!</p>
                  ) : (
                    departmentChats.map((c) => (
                      <div key={c.id} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-xs">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-white">{c.senderName || "Pioneer"}</span>
                          <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-200">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <form action={sendChatMessage} className="flex gap-2">
                  <input type="hidden" name="departmentId" value={currentDept.id} />
                  <input type="text" name="content" required placeholder="Type peer message..." className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 4. SECRETARY VIEW ---------------- */}
        {activeView === "secretary" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800">
                    Secretariat & Records
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">Record Meeting Minutes & Publish News</h2>
                  <p className="text-xs text-slate-400">Archive official meeting decisions and broadcast public news to the main website feed.</p>
                </div>

                <form action={recordMinutesAndAnnouncementAction} className="space-y-4">
                  <input type="hidden" name="departmentId" value={currentDept.id} />
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Announcement / Minutes Title *</label>
                    <input type="text" name="title" required placeholder="e.g. Continental Standup: Q3 Engineering Goals" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Minutes, Decisions & Action Items *</label>
                    <textarea name="content" rows={4} required placeholder="1. Attendance: Ezra, Ali, Lydia...&#10;2. Key Decision: Deploy offline digital hubs...&#10;3. Action Item: Submit final blueprints by Friday." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none font-mono" />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
                    Publish Minutes & Announcements &rarr;
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Recent Department Records</h3>
                <div className="space-y-3">
                  {announcements.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No meeting records yet.</p>
                  ) : (
                    announcements.map((a) => (
                      <div key={a.id} className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                        <span className="text-[10px] text-amber-400 font-mono font-bold block">{new Date(a.createdAt).toLocaleDateString()}</span>
                        <h4 className="font-bold text-white text-xs">{a.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-3">{a.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 5. ASSISTANT VIEW ---------------- */}
        {activeView === "assistant" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
                Action Items & Deliverables
              </span>
              <h2 className="text-xl font-black text-white mt-2">Department Assistant Dashboard</h2>
              <p className="text-xs text-slate-400">Execute assigned supervisor action items and submit deliverables directly for review.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 space-y-3">
                <h3 className="font-bold text-white text-sm">Assigned Division Directives</h3>
                <p className="text-xs text-slate-400">View tasks designated by the Department Leader and Manager for execution.</p>
                <div className="space-y-2 pt-2">
                  {departmentTasks.slice(0, 3).map((t) => (
                    <div key={t.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                      <span className="font-bold text-white block">{t.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Due: {new Date(t.deadline || t.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 space-y-3">
                <h3 className="font-bold text-white text-sm">Submit Completed Deliverable</h3>
                <p className="text-xs text-slate-400">Provide document link or static PDF archive for Department Manager review.</p>
                <Link href="/classroom" className="inline-block mt-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow transition">
                  Open Classroom Submission Console &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
