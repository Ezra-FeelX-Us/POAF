import React from "react";
import prisma from "@/lib/prisma";
import { resolveCurrentUserPortals } from "@/lib/portalResolver";
import { createTaskAction, reviewAndGradeTaskAction } from "@/actions/tasks";
import { createDepartmentAnnouncement, sendChatMessage } from "@/actions/chat";
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

  try {
    dept = await prisma.department.findFirst({
      include: {
        leader: true,
        members: { where: { status: "ACTIVE", deletedAt: null }, include: { country: true } },
        projects: { where: { deletedAt: null } },
        initiatives: { where: { deletedAt: null } }
      }
    });

    if (dept) {
      membersList = dept.members || [];
      departmentTasks = await prisma.task.findMany({
        where: { departmentId: dept.id },
        include: { assignee: true },
        orderBy: { createdAt: "desc" }
      });
      announcements = await prisma.departmentAnnouncement.findMany({
        where: { departmentId: dept.id },
        orderBy: { createdAt: "desc" },
        take: 5
      });
    }
  } catch (err) {
    console.error("Staff DB query fallback:", err);
  }

  const currentDept = dept || {
    id: "dept-tech",
    name: "Technology and Innovation",
    focus: "Pan-African open-source tools, offline hubs, and digital leadership training.",
    leader: { firstName: "Ali", lastName: "Usman", role: "Chief Engineer & Department Leader" },
    projects: [
      { id: "p1", title: "Pan-African Offline Digital Mesh Hub", status: "ACTIVE", budget: 15000 },
      { id: "p2", title: "Youth STEM Mentorship Curriculum", status: "ACTIVE", budget: 8500 }
    ],
    initiatives: [
      { id: "i1", title: "10,000 Rural Coders Initiative", status: "ACTIVE" }
    ]
  };

  const pendingSubmissions = departmentTasks.filter(t => t.status === "SUBMITTED");
  const gradedTasks = departmentTasks.filter(t => t.status === "GRADED");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Top Department Header & Scope Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                Staff Department Console
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                Authorized Department Scope
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{currentDept.name}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">{currentDept.focus}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Pioneers</span>
              <span className="text-lg font-black text-indigo-400">{membersList.length || 48}</span>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Projects</span>
              <span className="text-lg font-black text-emerald-400">{currentDept.projects?.length || 6}</span>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Pending Tasks</span>
              <span className="text-lg font-black text-amber-400">{pendingSubmissions.length || 3}</span>
            </div>
          </div>
        </div>

        {/* Role Hierarchy Navigation Switcher */}
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl backdrop-blur-md">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 mb-1">
            Department Leadership Scope & Dashboards:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
            <Link
              href="/staff?view=leader"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "leader" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">Department Leader</span>
              <span className="text-[10px] font-normal opacity-80">Strategy & Oversight</span>
            </Link>

            <Link
              href="/staff?view=manager"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "manager" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">Manager</span>
              <span className="text-[10px] font-normal opacity-80">Daily Operations</span>
            </Link>

            <Link
              href="/staff?view=student_leader"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "student_leader" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">Student Leader</span>
              <span className="text-[10px] font-normal opacity-80">Member Engagement</span>
            </Link>

            <Link
              href="/staff?view=secretary"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "secretary" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">Secretary</span>
              <span className="text-[10px] font-normal opacity-80">Minutes & Records</span>
            </Link>

            <Link
              href="/staff?view=assistant"
              className={`p-3 rounded-xl transition text-center flex flex-col items-center justify-center gap-1 ${
                activeView === "assistant" 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-sm font-black">Assistant</span>
              <span className="text-[10px] font-normal opacity-80">Executive Support</span>
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: DEPARTMENT LEADER DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeView === "leader" && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Department Pioneers</span>
                <div className="text-3xl font-black text-white mt-1">{membersList.length || 48}</div>
                <p className="text-[11px] text-slate-500 mt-1">Active verified members</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Active Projects</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">{currentDept.projects?.length || 6}</div>
                <p className="text-[11px] text-slate-500 mt-1">Under leadership supervision</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Initiatives & Outreach</span>
                <div className="text-3xl font-black text-indigo-400 mt-1">{currentDept.initiatives?.length || 4}</div>
                <p className="text-[11px] text-slate-500 mt-1">Community impact tracks</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Submissions Pending</span>
                <div className="text-3xl font-black text-amber-400 mt-1">{pendingSubmissions.length || 3}</div>
                <p className="text-[11px] text-slate-500 mt-1">Awaiting leader review</p>
              </div>
            </div>

            {/* Task Giver & Reviewer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Task Giver */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
                    Leader Task Giver
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2">Dispatch Department Deliverables</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Assign goals with points and completion guidelines to department pioneers.</p>
                </div>

                <form action={createTaskAction} className="space-y-4">
                  <input type="hidden" name="departmentId" value={currentDept.id} />
                  <input type="hidden" name="giverName" value={`${currentDept.leader?.firstName || "Leader"} ${currentDept.leader?.lastName || ""}`} />
                  <input type="hidden" name="giverRole" value="Department Leader" />

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Task Title *</label>
                    <input type="text" name="title" required placeholder="e.g. Prototype Offline Education Hub Protocol" className="w-full text-xs border border-slate-700 rounded-xl p-3 bg-slate-800 text-white focus:outline-none focus:border-indigo-500" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Priority</label>
                      <select name="priority" className="w-full text-xs border border-slate-700 rounded-xl p-2.5 bg-slate-800 text-white">
                        <option value="HIGH">High Priority</option>
                        <option value="URGENT">Urgent Deliverable</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="LOW">Low Priority</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Max Grade / Points</label>
                      <input type="number" name="maxPoints" defaultValue={100} min={10} max={500} className="w-full text-xs border border-slate-700 rounded-xl p-2.5 bg-slate-800 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Deadline Date</label>
                      <input type="date" name="deadline" className="w-full text-xs border border-slate-700 rounded-xl p-2.5 bg-slate-800 text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Instructions & Deliverables *</label>
                    <textarea name="description" required rows={3} placeholder="Detail requirements, research methods, and standards..." className="w-full text-xs border border-slate-700 rounded-xl p-3 bg-slate-800 text-white focus:outline-none focus:border-indigo-500" />
                  </div>

                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg">
                    Dispatch Assignment to Pioneers &rarr;
                  </button>
                </form>
              </div>

              {/* Task Reviewer */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                      Task Reviewer & Grading
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">Evaluate Submissions</h3>
                  </div>
                  <span className="bg-amber-950 text-amber-300 font-bold px-3 py-1 rounded-full text-xs border border-amber-800">
                    {pendingSubmissions.length} In Queue
                  </span>
                </div>

                {pendingSubmissions.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-slate-800/40 rounded-2xl border border-slate-800 text-xs">
                    No submissions currently pending review. Member reports will appear here automatically for grading.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                    {pendingSubmissions.map((task) => (
                      <div key={task.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">{task.poafId || "TASK"}</span>
                            <h4 className="text-sm font-black text-white mt-1">{task.title}</h4>
                            <p className="text-xs text-slate-400">Pioneer: <strong className="text-slate-200">{task.assignee?.firstName} {task.assignee?.lastName}</strong></p>
                          </div>
                          <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800">Max: {task.maxPoints} pts</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                          <p className="text-slate-300 leading-relaxed">{task.submissionContent || "Report summary provided."}</p>
                          {task.submissionLink && (
                            <a href={task.submissionLink} target="_blank" rel="noreferrer" className="text-indigo-400 font-bold hover:underline block mt-2">
                              Open Submitted Document &rarr;
                            </a>
                          )}
                        </div>
                        <form action={reviewAndGradeTaskAction} className="pt-2 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                          <input type="hidden" name="taskId" value={task.id} />
                          <input type="hidden" name="reviewerName" value="Department Leader" />
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Points</label>
                            <input type="number" name="awardedGrade" defaultValue={task.maxPoints} max={task.maxPoints} className="w-full text-xs border border-slate-700 rounded-lg p-2 bg-slate-900 text-white" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Feedback</label>
                            <input type="text" name="gradeFeedback" placeholder="Feedback notes..." className="w-full text-xs border border-slate-700 rounded-lg p-2 bg-slate-900 text-white" />
                          </div>
                          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition">Grade &rarr;</button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: DEPARTMENT MANAGER DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeView === "manager" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  Manager Console • Daily Operations
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Operations & Assignment Follow-up</h3>
                <p className="text-xs text-slate-400 mt-0.5">Coordinate member workflows, track deadlines, and monitor daily progress.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="text-sm font-black text-white">Active Assignments Tracker</h4>
                  <div className="space-y-2">
                    {departmentTasks.slice(0, 4).map((t, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                        <span className="text-slate-300 font-bold truncate max-w-[160px]">{t.title}</span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded">{t.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="text-sm font-black text-white">Project Milestones</h4>
                  <div className="space-y-2">
                    {currentDept.projects?.map((p: any, idx: number) => (
                      <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                        <div className="font-bold text-white">{p.title}</div>
                        <div className="text-[11px] text-emerald-400 mt-0.5">Budget: ${p.budget || 10000} • Status: {p.status}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="text-sm font-black text-white">Upcoming Department Meetings</h4>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <span className="font-bold text-indigo-400 block">Weekly Engineering Sync</span>
                    <p className="text-slate-400 text-[11px]">Thursday at 15:00 GMT • Virtual Hub Room #3</p>
                    <span className="inline-block bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded text-[10px]">Agenda Set by Secretary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: STUDENT LEADER DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeView === "student_leader" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
                  Student Leader Console • Member Engagement
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Student Coordination & Feedback</h3>
                <p className="text-xs text-slate-400 mt-0.5">Gather suggestions from student pioneers and coordinate peer mentorship activities.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                  <h4 className="text-sm font-black text-white">Student Pioneer Suggestions & Voice</h4>
                  <div className="space-y-3">
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-indigo-300 block">Expand Offline Documentation Access</span>
                      <p className="text-slate-400">"Can we provide PDF exports of weekly engineering courses for schools with limited connectivity?"</p>
                      <span className="text-[10px] text-slate-500 block pt-1">Submitted by Pioneer student from Kenya</span>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-indigo-300 block">Weekly Peer Study Circles</span>
                      <p className="text-slate-400">"Let's host Saturday peer coding review sessions for new student pioneers."</p>
                      <span className="text-[10px] text-slate-500 block pt-1">Submitted by Pioneer student from Ghana</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                  <h4 className="text-sm font-black text-white">Student Activities & Events</h4>
                  <div className="space-y-3">
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-black text-white">Pan-African Student Hackathon</span>
                        <p className="text-[11px] text-slate-400">Next Month • 12 Teams Registered</p>
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 font-bold px-2.5 py-1 rounded text-xs">Active</span>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-black text-white">High School STEM Mentorship Tour</span>
                        <p className="text-[11px] text-slate-400">Bi-Weekly Outreach</p>
                      </div>
                      <span className="bg-blue-950 text-blue-400 font-bold px-2.5 py-1 rounded text-xs">Planning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: DEPARTMENT SECRETARY DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeView === "secretary" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                  Secretariat • Documentation & Minutes
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Meeting Minutes & Official Records</h3>
                <p className="text-xs text-slate-400 mt-0.5">Record attendance, meeting decisions, action items, and official notices.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Meeting Minutes Form */}
                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                  <h4 className="text-sm font-black text-white">Record Meeting Minutes & Decisions</h4>
                  <form action={createDepartmentAnnouncement} className="space-y-3">
                    <input type="hidden" name="departmentId" value={currentDept.id} />
                    <input type="hidden" name="authorName" value="Department Secretary" />
                    <input type="hidden" name="authorRole" value="Secretary" />
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Meeting Title & Date</label>
                      <input type="text" name="title" required placeholder="e.g. Executive Sync Minutes - 21 Aug 2026" className="w-full text-xs border border-slate-700 rounded-xl p-2.5 bg-slate-900 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Decisions & Action Items</label>
                      <textarea name="content" required rows={4} placeholder="Key decisions agreed upon, assigned individuals, and deadlines..." className="w-full text-xs border border-slate-700 rounded-xl p-2.5 bg-slate-900 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition">
                      Publish Official Record & Notice &rarr;
                    </button>
                  </form>
                </div>

                {/* Published Minutes Repository */}
                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                  <h4 className="text-sm font-black text-white">Secretariat Records & Announcements</h4>
                  <div className="space-y-3">
                    {announcements.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                        No official minutes published yet.
                      </div>
                    ) : (
                      announcements.map((a: any) => (
                        <div key={a.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                          <span className="font-bold text-white block">{a.title}</span>
                          <p className="text-slate-300">{a.content}</p>
                          <span className="text-[10px] text-slate-500 block pt-1">By {a.authorName} ({a.authorRole})</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 5: DEPARTMENT ASSISTANT DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeView === "assistant" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
                  Executive Assistant Console
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Assigned Supervisor Support</h3>
                <p className="text-xs text-slate-400 mt-0.5">Assigned to support: <strong className="text-white">{currentDept.leader?.firstName} {currentDept.leader?.lastName} (Department Leader)</strong></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="text-sm font-black text-white">Assistant Action Items</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span>Prepare weekly outreach briefing for Department Leader</span>
                      <span className="text-[10px] font-bold bg-amber-950 text-amber-400 px-2 py-0.5 rounded">Due Tomorrow</span>
                    </li>
                    <li className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span>Follow up on STEM mentorship student submissions</span>
                      <span className="text-[10px] font-bold bg-blue-950 text-blue-400 px-2 py-0.5 rounded">In Progress</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="text-sm font-black text-white">Supervisor Communication</h4>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
                    <p className="text-slate-400">Direct leadership channel with Department Leader.</p>
                    <Link href="/staff?view=leader" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
                      Open Leader Briefing &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
