import React from "react";
import prisma from "@/lib/prisma";
import { requirePortalAccess } from "@/lib/portalResolver";
import { createTaskAction, reviewAndGradeTaskAction } from "@/actions/tasks";
import { createDepartmentAnnouncement } from "@/actions/chat";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StaffPortalPage() {
  const authGuard = await requirePortalAccess('STAFF');
  if (!authGuard.authorized && !authGuard.resolution.hasRole('ADMIN')) {
    // If not leader or admin, redirect to login or classroom
    redirect("/auth/login?role=leader");
  }

  let dept: any = null;
  let membersList: any[] = [];
  let departmentTasks: any[] = [];

  try {
    dept = await prisma.department.findFirst({
      include: {
        leader: true,
        members: { where: { status: "ACTIVE", deletedAt: null } }
      }
    });

    if (dept) {
      membersList = dept.members || [];
      departmentTasks = await prisma.task.findMany({
        where: { departmentId: dept.id },
        include: { assignee: true },
        orderBy: { createdAt: "desc" }
      });
    }
  } catch (err) {
    console.error("Staff DB query fallback:", err);
  }

  const currentDept = dept || {
    id: "dept-tech",
    name: "Technology and Innovation",
    focus: "Pan-African open-source tools, offline hubs, and digital leadership training.",
    leader: { firstName: "Ali", lastName: "Usman", role: "Chief Engineer & Department Leader" }
  };

  const pendingSubmissions = departmentTasks.filter(t => t.status === "SUBMITTED");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-serif italic py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Staff Header */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                Staff & Department Leader Console
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Authorized Scope
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{currentDept.name}</h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">{currentDept.focus}</p>
          </div>

          <div className="flex gap-3">
            <span className="bg-indigo-100 text-indigo-950 font-bold px-4 py-2 rounded-xl text-xs">
              {membersList.length} Department Pioneers
            </span>
          </div>
        </div>

        {/* 2-Column: Task Giver (Left) / Reviewer & Grading Station (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TASK GIVER */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                1. Task Giver & Dispatch
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Create & Assign Tasks</h2>
              <p className="text-xs text-slate-600">Dispatch operational assignments with deadlines and evaluation criteria.</p>
            </div>

            <form action={createTaskAction} className="space-y-4">
              <input type="hidden" name="departmentId" value={currentDept.id} />
              <input type="hidden" name="giverName" value={`${currentDept.leader?.firstName || "Dept"} ${currentDept.leader?.lastName || "Leader"}`} />
              <input type="hidden" name="giverRole" value="Department Leader" />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Task Title *</label>
                <input type="text" name="title" required placeholder="e.g. Conduct Secondary School Outreach Survey" className="w-full text-xs border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Priority</label>
                  <select name="priority" className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white">
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Max Points</label>
                  <input type="number" name="maxPoints" defaultValue={100} min={10} max={500} className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Deadline Date</label>
                  <input type="date" name="deadline" className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Instructions & Guidelines *</label>
                <textarea name="description" required rows={3} placeholder="Expected deliverables..." className="w-full text-xs border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition shadow">
                Publish & Dispatch Task &rarr;
              </button>
            </form>
          </div>

          {/* TASK REVIEWER */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                2. Task Reviewer & Grading
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Evaluate Submissions</h2>
              <p className="text-xs text-slate-600">Review member work reports, award points, and upgrade distinction tiers.</p>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                No submissions pending review. Newly submitted member work will appear here automatically.
              </div>
            ) : (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {pendingSubmissions.map((task) => (
                  <div key={task.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-sm font-black text-slate-900">{task.title}</h4>
                    <p className="text-xs text-slate-700">{task.submissionContent || "No written summary provided."}</p>
                    {task.submissionLink && (
                      <a href={task.submissionLink} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-bold hover:underline block">
                        Open Submitted Work Link &rarr;
                      </a>
                    )}
                    <form action={reviewAndGradeTaskAction} className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="reviewerName" value={`${currentDept.leader?.firstName || "Dept"} Leader`} />
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Award Points</label>
                        <input type="number" name="awardedGrade" defaultValue={task.maxPoints} max={task.maxPoints} className="w-full text-xs border border-slate-300 rounded-lg p-2" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Feedback</label>
                        <input type="text" name="gradeFeedback" placeholder="Feedback notes..." className="w-full text-xs border border-slate-300 rounded-lg p-2" />
                      </div>
                      <button type="submit" className="bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg">Grade &rarr;</button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
