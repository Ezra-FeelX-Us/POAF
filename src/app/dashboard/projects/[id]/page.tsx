import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createTask, updateTaskStatus, createIssue } from "@/actions/projects";

export const dynamic = "force-dynamic";

export default async function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      department: true,
      teamMembers: { include: { member: true } },
      tasks: { include: { assignee: true }, orderBy: { createdAt: 'desc' } },
      issues: { include: { reporter: true }, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!project) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-white">&larr; Dashboard</Link>
            <span className="text-xl font-bold">Workspace: {project.title}</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="bg-blue-800 px-3 py-1 rounded-full text-xs">{project.poafId || "Pending ID"}</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        
        {/* Header Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">{project.department.name}</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{project.title}</h1>
            <p className="text-slate-600 max-w-2xl">{project.description}</p>
          </div>
          
          <div className="flex gap-8 text-center bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[300px]">
            <div className="flex-1">
              <div className="text-3xl font-black text-slate-800">{project.progressPct}%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Progress</div>
            </div>
            <div className="flex-1 border-l border-slate-200">
              <div className="text-3xl font-black text-slate-800">{project.tasks.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Tasks</div>
            </div>
            <div className="flex-1 border-l border-slate-200">
              <div className="text-3xl font-black text-slate-800">{project.teamMembers.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Members</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Task Column (Kanban-ish) */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-2xl font-bold text-slate-800">Tasks</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                {project.tasks.filter(t => t.status !== "COMPLETED").length} Active
              </span>
            </div>

            <div className="space-y-4">
              {/* New Task Form Inline */}
              <form action={createTask} className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex gap-3 items-center">
                <input type="hidden" name="projectId" value={project.id} />
                <input type="text" name="title" required placeholder="Add a new task..." className="flex-1 border-none focus:ring-0 bg-transparent text-sm font-medium" />
                <select name="assigneeId" className="text-xs border-slate-200 rounded p-2 bg-slate-50 w-32">
                  <option value="">Unassigned</option>
                  {project.teamMembers.map(tm => (
                    <option key={tm.member.id} value={tm.member.id}>{tm.member.firstName} {tm.member.lastName}</option>
                  ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white text-xs px-4 py-2 rounded font-bold hover:bg-blue-700">Add Task</button>
              </form>

              {/* Task List */}
              {project.tasks.map(task => (
                <div key={task.id} className={`bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between ${task.status === 'COMPLETED' ? 'border-green-200 opacity-60' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <form action={async () => {
                      "use server"; 
                      await updateTaskStatus(task.id, task.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED", project.id);
                    }}>
                      <button type="submit" className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-blue-500'}`}>
                        {task.status === "COMPLETED" && <span className="text-white text-xs">?</span>}
                      </button>
                    </form>
                    
                    <div>
                      <h4 className={`font-semibold text-sm ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-800'}`}>{task.title}</h4>
                      <div className="flex gap-2 mt-1 items-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
                          task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>{task.priority}</span>
                        {task.assignee && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url('${task.assignee.photoUrl || ''}')` }}></div>
                            {task.assignee.firstName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Dropdown */}
                  <form action={async (formData) => {
                    "use server";
                    const status = formData.get("status") as string;
                    await updateTaskStatus(task.id, status, project.id);
                  }}>
                    <select name="status" defaultValue={task.status} onChange={(e) => e.target.form?.requestSubmit()} className="text-xs border border-slate-200 rounded p-1 bg-slate-50 text-slate-600">
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </form>
                </div>
              ))}
            </div>

          </div>

          {/* Sidebar (Issues & Team) */}
          <div className="space-y-8">
            
            {/* Team */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                Project Roster
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">{project.teamMembers.length}</span>
              </h3>
              <ul className="space-y-3">
                {project.teamMembers.map(tm => (
                  <li key={tm.member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url('${tm.member.photoUrl || '/images/media_1787222340022.png'}')` }}></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{tm.member.firstName} {tm.member.lastName}</p>
                      <p className="text-xs text-slate-500">{tm.role || tm.member.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Issues */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                Issue Tracker
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">{project.issues.filter(i => i.status === 'OPEN').length} Open</span>
              </h3>
              
              <ul className="space-y-3 mb-4">
                {project.issues.map(issue => (
                  <li key={issue.id} className="border-l-2 border-red-500 pl-3 py-1">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{issue.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Reported by {issue.reporter?.firstName || "Unknown"}</p>
                  </li>
                ))}
                {project.issues.length === 0 && <p className="text-xs text-slate-500 italic">No issues reported.</p>}
              </ul>
              
              <form action={createIssue} className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <input type="hidden" name="projectId" value={project.id} />
                <input type="text" name="title" required placeholder="New issue title..." className="text-xs border border-slate-300 rounded p-2" />
                <button type="submit" className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded">Report Issue</button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
