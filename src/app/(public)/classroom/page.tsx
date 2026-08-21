import React from "react";
import prisma from "@/lib/prisma";
import { resolveCurrentUserPortals } from "@/lib/portalResolver";
import Link from "next/link";
import { submitTaskWorkAction } from "@/actions/tasks";
import { sendChatMessage } from "@/actions/chat";

export const dynamic = "force-dynamic";

export default async function ClassroomPage() {
  const portalRes = await resolveCurrentUserPortals();

  let member = portalRes.member;
  if (!member) {
    try {
      member = await prisma.member.findFirst({
        where: { status: "ACTIVE", deletedAt: null },
        include: { department: true, country: true }
      });
    } catch (e) {
      console.error(e);
    }
  }

  const currentMember = member || {
    id: "mem-default",
    poafId: "POAF-MEM-0001",
    firstName: "Pioneer",
    lastName: "Member",
    role: "Student Pioneer",
    totalPoints: 340,
    tasksCompleted: 4,
    gradeTier: "DISTINCTION",
    inviteCode: "PIONEER",
    inviteCount: 12,
    department: { name: "Technology & Innovation" },
    country: { name: "Pan-Africa" }
  };

  let memberTasks: any[] = [];
  let chatMessages: any[] = [];

  try {
    memberTasks = await prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: currentMember.id },
          { departmentId: currentMember.departmentId || undefined }
        ]
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    chatMessages = await prisma.chatMessage.findMany({
      where: { channel: "GENERAL" },
      orderBy: { createdAt: "asc" },
      take: 15
    });
  } catch (err) {
    console.error("Classroom DB query fallback:", err);
  }

  const courses = [
    { title: "Pan-African Technology & AI Infrastructure", code: "TECH-301", instructor: "Ezra Michael Jofe", progress: 75, modules: "6 / 8 Modules" },
    { title: "Grassroots Economic Modeling & Impact", code: "ECON-202", instructor: "Ali Usman", progress: 90, modules: "9 / 10 Modules" },
    { title: "Continental Diplomacy & Policy Systems", code: "POL-104", instructor: "Amb. Ali Omari", progress: 50, modules: "4 / 8 Modules" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Student Classroom Banner */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-cover bg-center shadow-lg border-4 border-blue-500 shrink-0"
              style={{ backgroundImage: `url('${currentMember.photoUrl || "/images/media_1787222340022.png"}')` }}
            ></div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">{currentMember.poafId}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Enrolled Student Member</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{currentMember.country?.name || "Pan-Africa"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{currentMember.firstName} {currentMember.lastName}</h1>
              <p className="text-xs font-bold text-slate-500 mt-1">Department: <strong className="text-blue-700">{currentMember.department?.name || "Technology & Innovation"}</strong></p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  {currentMember.role}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-full">
                  Honor: {currentMember.gradeTier || "DISTINCTION"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/verify" className="text-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow">
              Digital ID Card &rarr;
            </Link>
            <Link href="/grades" className="text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow">
              Grade Board &rarr;
            </Link>
          </div>
        </div>

        {/* Classroom Scorecard & Training Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Points Earned</span>
            <div className="text-3xl font-black text-emerald-700 mt-1">{currentMember.totalPoints || 340} <span className="text-xs font-normal text-slate-500">pts</span></div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Tasks Completed</span>
            <div className="text-3xl font-black text-blue-900 mt-1">{currentMember.tasksCompleted || 4}</div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Active Courses</span>
            <div className="text-3xl font-black text-indigo-700 mt-1">3</div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pioneers Recruited</span>
            <div className="text-3xl font-black text-purple-700 mt-1">{currentMember.inviteCount || 14}</div>
          </div>
        </div>

        {/* 2-Column: Courses & Training (Left) / Assignments & Tasks (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Courses & Learning Modules */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Curriculum
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Enrolled Courses & Masterclasses</h2>
              <p className="text-xs text-slate-600">Access training materials, technical blueprints, and complete module exams.</p>
            </div>

            <div className="space-y-4">
              {courses.map((c, i) => (
                <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{c.code}</span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{c.title}</h4>
                      <p className="text-xs text-slate-500">Instructor: {c.instructor}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">{c.modules}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Completion Progress</span>
                      <span>{c.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${c.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments & Task Board */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Assignments & Tasks
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Classroom Assignments</h2>
              <p className="text-xs text-slate-600">Submit deliverables and documentation for evaluation by department leaders.</p>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {memberTasks.map((task) => (
                <div key={task.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{task.poafId || "TASK"}</span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{task.title}</h4>
                      <p className="text-xs text-slate-600">{task.description}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">{task.maxPoints} pts</span>
                  </div>

                  {task.status === "GRADED" ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 font-bold flex justify-between items-center">
                      <span>Evaluated & Graded:</span>
                      <span className="font-mono text-sm">{task.awardedGrade} / {task.maxPoints} pts</span>
                    </div>
                  ) : (
                    <details className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                      <summary className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer">Submit Deliverable Report</summary>
                      <form action={submitTaskWorkAction} className="mt-2 space-y-2">
                        <input type="hidden" name="taskId" value={task.id} />
                        <textarea name="submissionContent" required rows={2} placeholder="Summary of work..." className="w-full text-xs border border-slate-300 rounded p-2" />
                        <input type="url" name="submissionLink" placeholder="Drive / GitHub link..." className="w-full text-xs border border-slate-300 rounded p-2" />
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold text-xs py-1.5 rounded">Submit for Grading &rarr;</button>
                      </form>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
