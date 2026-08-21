import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { sendChatMessage, createDepartmentAnnouncement } from "@/actions/chat";
import { createTaskAction, reviewAndGradeTaskAction } from "@/actions/tasks";

export const dynamic = "force-dynamic";

export default async function DepartmentPortalPage() {
  let sampleDept: any = null;
  let chatMessages: any[] = [];
  let announcements: any[] = [];
  let departmentTasks: any[] = [];
  let departmentMembers: any[] = [];

  try {
    const [dbDept, msgs, anncs, tasks, members] = await Promise.all([
      prisma.department.findFirst({
        where: { deletedAt: null },
        include: {
          leader: true,
          members: { where: { status: "ACTIVE", deletedAt: null }, include: { country: true }, orderBy: { totalPoints: "desc" } },
          projects: { where: { deletedAt: null } }
        }
      }),
      prisma.chatMessage.findMany({
        where: { channel: "LEADERSHIP" },
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      prisma.departmentAnnouncement.findMany({
        orderBy: { createdAt: "desc" },
        take: 10
      }),
      prisma.task.findMany({
        where: { deletedAt: null },
        include: { assignee: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.member.findMany({
        where: { status: "ACTIVE", deletedAt: null },
        include: { department: true, country: true },
        orderBy: { totalPoints: "desc" },
        take: 15
      })
    ]);
    sampleDept = dbDept;
    chatMessages = msgs.reverse();
    announcements = anncs;
    departmentTasks = tasks;
    departmentMembers = members;
  } catch (e) {
    console.error(e);
  }

  const dept = sampleDept || {
    id: "dept-tech",
    name: "Technology and Innovation",
    description: "Building digital platforms, hosting continental coding bootcamps, and providing technology literacy.",
    leader: { firstName: "Tebarek", lastName: "Alemu", role: "Department Leader", photoUrl: "/images/tebarek-alemu.png", poafId: "POAF-LDR-0001", inviteCode: "TEBAREK-TECH", inviteCount: 22 },
    members: departmentMembers.length > 0 ? departmentMembers : [
      { id: "mem-1", firstName: "Henok", lastName: "Hankore", role: "Leader & Ambassador", country: { name: "Ethiopia" }, inviteCount: 8, totalPoints: 280, tasksCompleted: 3, gradeTier: "HONORS" },
      { id: "mem-2", firstName: "Keneriyan", lastName: "Fikadu", role: "Leader & Ambassador", country: { name: "Ethiopia" }, inviteCount: 5, totalPoints: 190, tasksCompleted: 2, gradeTier: "HONORS" },
      { id: "mem-3", firstName: "Ali", lastName: "Usman", role: "Chief Engineer", country: { name: "Ethiopia" }, inviteCount: 11, totalPoints: 450, tasksCompleted: 5, gradeTier: "DISTINCTION" }
    ],
    projects: [
      { title: "POAF Digital Platform & Offline Portal", status: "ONGOING", progressPct: 65 }
    ]
  };

  const membersList = (dept.members && dept.members.length > 0) ? dept.members : departmentMembers;
  const pendingSubmissions = departmentTasks.filter(t => t.status === "SUBMITTED");
  const gradedTasks = departmentTasks.filter(t => t.status === "GRADED");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-serif italic py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Department Workspace Banner */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-cover bg-center shadow-lg border-4 border-emerald-500 shrink-0"
              style={{ backgroundImage: `url('${dept.leader?.photoUrl || "/images/tebarek-alemu.png"}')` }}
            ></div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Department Governance Console</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Task Giver & Reviewer Role</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{dept.name}</h1>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Department Leader: <strong className="text-emerald-700">{dept.leader?.firstName} {dept.leader?.lastName}</strong> ({dept.leader?.role})
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/departments" className="text-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow">
              Public Department Page &rarr;
            </Link>
            <Link href="/portal/member" className="text-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition shadow">
              Member Workspace &rarr;
            </Link>
          </div>
        </div>

        {/* Quick KPI Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Active Tasks</span>
            <div className="text-2xl font-black text-blue-900 mt-1">{departmentTasks.length}</div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Pending Reviews</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingSubmissions.length}</div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Graded & Completed</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{gradedTasks.length}</div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">Assigned Pioneers</span>
            <div className="text-2xl font-black text-purple-600 mt-1">{membersList.length}</div>
          </div>
        </div>

        {/* 2-Column Task Hub: Task Giver (Left) & Task Reviewer / Grading Console (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TASK GIVER CONSOLE */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                1. Task Giver Console
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Create & Assign New Task</h2>
              <p className="text-xs text-slate-600">Assign operational objectives, research assignments, or outreach tasks to pioneers.</p>
            </div>

            <form action={createTaskAction} className="space-y-4">
              <input type="hidden" name="departmentId" value={dept.id || ""} />
              <input type="hidden" name="giverName" value={`${dept.leader?.firstName || "Department"} ${dept.leader?.lastName || "Leader"}`} />
              <input type="hidden" name="giverRole" value={dept.leader?.role || "Leader & Task Giver"} />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Task Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. Conduct Secondary School Outreach Survey" 
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Priority</label>
                  <select name="priority" className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white outline-none">
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Max Grade / Points</label>
                  <input 
                    type="number" 
                    name="maxPoints" 
                    defaultValue={100} 
                    min={10} 
                    max={500} 
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:bg-white outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Deadline Date</label>
                  <input 
                    type="date" 
                    name="deadline" 
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:bg-white outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Assign To Member (Optional)</label>
                <select name="assigneeId" className="w-full text-xs border border-slate-300 rounded-xl p-3 bg-white outline-none">
                  <option value="">Open to All Department Pioneers</option>
                  {membersList.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.poafId || m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Task Instructions & Deliverables *</label>
                <textarea 
                  name="description" 
                  required 
                  rows={3} 
                  placeholder="Detail the expected deliverables, guidelines, and quality standards for this assignment..." 
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition shadow"
              >
                Publish & Dispatch Task to Pioneers &rarr;
              </button>
            </form>
          </div>

          {/* TASK REVIEWER & GRADE STATION */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  2. Task Reviewer & Grading Station
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Evaluate Submissions</h2>
                <p className="text-xs text-slate-600">Review member work reports, award points, and provide evaluation comments.</p>
              </div>
              <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-xs">
                {pendingSubmissions.length} Pending Review
              </span>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                ✨ No submissions pending review. Newly submitted member work will appear here automatically for evaluation.
              </div>
            ) : (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {pendingSubmissions.map((task) => (
                  <div key={task.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {task.poafId || "TASK"}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-1">{task.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          Submitted by: <strong className="text-slate-800">{task.assignee?.firstName} {task.assignee?.lastName}</strong> ({task.assignee?.poafId})
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Max: {task.maxPoints} pts
                      </span>
                    </div>

                    {/* Member Submission Details */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Member Work Report:</span>
                      <p className="text-slate-700">{task.submissionContent || "No written summary provided."}</p>
                      {task.submissionLink && (
                        <div className="pt-1">
                          <a 
                            href={task.submissionLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            🔗 Open Submitted Work / Document Link &rarr;
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Grading & Feedback Form */}
                    <form action={reviewAndGradeTaskAction} className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="reviewerName" value={`${dept.leader?.firstName || "Leader"} ${dept.leader?.lastName || ""}`} />

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Award Grade</label>
                        <input 
                          type="number" 
                          name="awardedGrade" 
                          required 
                          defaultValue={task.maxPoints} 
                          min={0} 
                          max={task.maxPoints} 
                          className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white" 
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Feedback Comments</label>
                        <input 
                          type="text" 
                          name="gradeFeedback" 
                          placeholder="e.g. Excellent analysis and thorough research." 
                          className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white" 
                        />
                      </div>

                      <div>
                        <button 
                          type="submit" 
                          name="decision" 
                          value="GRADED" 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition"
                        >
                          Approve & Grade &rarr;
                        </button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* DEPARTMENT GRADE BOARD (SCORECARD & LEADERBOARD) */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                3. Department Grade Board & Performance Evaluation
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Pioneer Performance Scorecard</h2>
              <p className="text-xs text-slate-600">Track cumulative earned points, completed assignments, and distinction honors across team members.</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              {membersList.length} Evaluated Pioneers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Pioneer Name</th>
                  <th className="p-3">POAF ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Tasks Completed</th>
                  <th className="p-3 text-center">Cumulative Points</th>
                  <th className="p-3 text-center">Performance Honor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {membersList.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-500">
                      {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                    </td>
                    <td className="p-3 font-black text-slate-900">
                      {m.firstName} {m.lastName}
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-700">
                      {m.poafId || `POAF-MEM-${idx + 1}`}
                    </td>
                    <td className="p-3 text-slate-600">{m.role || "Member"}</td>
                    <td className="p-3 text-center font-bold text-slate-800">
                      {m.tasksCompleted || (idx === 0 ? 5 : 2)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {m.totalPoints || (idx === 0 ? 450 : idx === 1 ? 280 : 190)} pts
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        (m.totalPoints >= 300 || idx === 0) ? "bg-amber-100 text-amber-900 border border-amber-300" :
                        (m.totalPoints >= 150 || idx === 1) ? "bg-blue-100 text-blue-900 border border-blue-300" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {(m.totalPoints >= 300 || idx === 0) ? "DISTINCTION" : (m.totalPoints >= 150 || idx === 1) ? "HONORS" : "COMMENDED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-Column Grid: Announcements & Leadership Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Write Announcements (1 Col) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 space-y-4">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
                Leader Publisher
              </span>
              <h3 className="text-lg font-black text-slate-900">Post Department Announcement</h3>
              
              <form action={createDepartmentAnnouncement} className="space-y-3">
                <input type="hidden" name="departmentId" value={dept.id || "dept-tech"} />
                <input type="hidden" name="authorName" value={`${dept.leader?.firstName || "Department"} ${dept.leader?.lastName || "Leader"}`} />
                <input type="hidden" name="authorRole" value={dept.leader?.role || "Leader"} />
                
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Announcement Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="e.g. Weekly Task Deliverable Schedule" 
                    className="w-full text-xs border border-slate-300 rounded-xl p-2 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Announcement Details</label>
                  <textarea 
                    name="content" 
                    required 
                    rows={3} 
                    placeholder="Write instructions for your department members..." 
                    className="w-full text-xs border border-slate-300 rounded-xl p-2 bg-slate-50 focus:bg-white"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow"
                >
                  Publish Announcement &rarr;
                </button>
              </form>
            </div>
          </div>

          {/* Right: Leadership & Governance Chat (2 Cols) */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 lg:col-span-2 flex flex-col justify-between h-[450px]">
            <div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    Leadership Governance Channel
                  </h3>
                  <p className="text-xs text-slate-500">Coordination between department heads, managers, and ambassadors</p>
                </div>
                <span className="text-[10px] font-bold font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded">#LEADERSHIP</span>
              </div>

              {/* Chat Feed */}
              <div className="overflow-y-auto max-h-[260px] space-y-3 pr-2">
                {chatMessages.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 italic">
                    No messages in the leadership channel yet. Start the strategic discussion!
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs">
                      <div 
                        className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 border border-slate-300"
                        style={{ backgroundImage: `url('${msg.senderPhoto || "/images/media_1787222340022.png"}')` }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-900">{msg.senderName}</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">{msg.senderRole || "Leader"}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Input Form */}
            <form action={sendChatMessage} className="pt-3 border-t border-slate-200 flex gap-2">
              <input type="hidden" name="channel" value="LEADERSHIP" />
              <input type="hidden" name="senderName" value={`${dept.leader?.firstName || "Department"} ${dept.leader?.lastName || "Leader"}`} />
              <input type="hidden" name="senderRole" value={dept.leader?.role || "Department Leader"} />
              <input type="hidden" name="senderPhoto" value={dept.leader?.photoUrl || "/images/tebarek-alemu.png"} />
              <input type="hidden" name="senderPoafId" value={dept.leader?.poafId || ""} />
              
              <input 
                type="text" 
                name="content" 
                required 
                placeholder="Dispatch message to leadership council..." 
                className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow"
              >
                Dispatch
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}