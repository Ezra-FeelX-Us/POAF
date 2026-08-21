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
  if (!member && portalRes.user?.email) {
    try {
      const userRec = await prisma.user.findUnique({
        where: { email: portalRes.user.email },
        include: {
          member: {
            include: { department: true, country: true }
          }
        }
      });
      if (userRec?.member) {
        member = userRec.member;
      }
    } catch (e) {
      console.error(e);
    }
  }

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
    skills: "Grassroots Problem Solving",
    bio: "Active pioneer contributing to continental initiatives.",
    school: "Addis Ababa University",
    department: { id: "d1", name: "Technology & Innovation" },
    country: { name: "Pan-Africa" },
    photoUrl: "/images/media_1787222340022.png"
  };

  let memberTasks: any[] = [];
  let departmentProjects: any[] = [];
  let chatMessages: any[] = [];

  try {
    const deptId = currentMember.departmentId || currentMember.department?.id;

    const [tasks, prjs, msgs] = await Promise.all([
      prisma.task.findMany({
        where: {
          OR: [
            { assigneeId: currentMember.id },
            deptId ? { departmentId: deptId } : {}
          ]
        },
        orderBy: { createdAt: "desc" },
        take: 12
      }),
      deptId ? prisma.project.findMany({
        where: { departmentId: deptId, deletedAt: null },
        orderBy: { updatedAt: "desc" },
        take: 4
      }) : [],
      deptId ? prisma.chatMessage.findMany({
        where: { channel: deptId },
        orderBy: { createdAt: "desc" },
        take: 15
      }) : []
    ]);

    memberTasks = tasks;
    departmentProjects = prjs;
    chatMessages = msgs.reverse();
  } catch (err) {
    console.error("Classroom DB query fallback:", err);
  }

  const performanceScore = (currentMember as any).ratingScore || 88;
  const strengthBadge = currentMember.skills || "Pioneer Problem Solver";
  const instructorFeedback = currentMember.bio || "Consistent participation in department initiatives.";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Student Classroom Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-cover bg-center shadow-lg border-2 border-blue-500 shrink-0"
              style={{ backgroundImage: `url('${currentMember.photoUrl || "/images/media_1787222340022.png"}')` }}
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800">
                  {currentMember.poafId}
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded uppercase border border-emerald-800">
                  {currentMember.role || "Member"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {currentMember.country?.name || "Pan-Africa"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{currentMember.firstName} {currentMember.lastName}</h1>
              <p className="text-xs text-slate-400">
                Division: <strong className="text-blue-400">{currentMember.department?.name || "Technology & Innovation"}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link 
              href="/verify" 
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 shadow"
            >
              Verify POAF Credential
            </Link>
            <Link 
              href="/staff" 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-lg"
            >
              Department Workspace &rarr;
            </Link>
          </div>
        </div>

        {/* 1-100 Performance Scorecard & Standing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Performance Rating</span>
              <div className="text-3xl font-black text-amber-400 mt-1">{performanceScore}<span className="text-xs text-slate-400 font-normal"> / 100</span></div>
              <span className="text-[10px] text-emerald-400 font-semibold">Evaluated by Student Leader</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 font-black text-lg">
              ★
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Recognized Strength Badge</span>
              <div className="text-sm font-black text-blue-300 mt-1 line-clamp-1">{strengthBadge}</div>
              <span className="text-[10px] text-slate-400 font-semibold">Specialization Record</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 font-black text-lg">
              🎖️
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Attendance & Standing</span>
              <div className="text-xl font-black text-emerald-400 mt-1">100% Good Standing</div>
              <span className="text-[10px] text-slate-400 font-semibold">Verified Active Pioneer</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 font-black text-lg">
              ✓
            </div>
          </div>
        </div>

        {/* 2-Column: Tasks & Deliverables Submission (Left) / Active Projects & Chat (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Assignments Board with Strict Deadline Enforcement */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">
                Deliverables & Submissions
              </span>
              <h2 className="text-xl font-black text-white mt-2">Division Assignments & Task Directives</h2>
              <p className="text-xs text-slate-400">
                Upload static files (PDF, images, prototypes, documents). Submissions are accepted within the active deadline.
              </p>
            </div>

            {memberTasks.length === 0 ? (
              <div className="p-12 text-center text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-800 text-xs">
                No active directives assigned to your division yet. When tasks are issued by your Department Leader, they will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {memberTasks.map((task) => {
                  const deadlineTime = task.deadline ? new Date(task.deadline).getTime() : Date.now() + 86400000;
                  const isExpired = Date.now() > deadlineTime;

                  return (
                    <div key={task.id} className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                              {task.poafId || "TASK"}
                            </span>
                            <h4 className="text-sm font-black text-white">{task.title}</h4>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{task.description}</p>
                        </div>

                        {/* Deadline Status Badge */}
                        <div>
                          {isExpired ? (
                            <span className="text-[10px] font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-full border border-red-800 block text-center">
                              🔴 Deadline Passed
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800 block text-center">
                              🟢 Open until {new Date(task.deadline || task.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Submission Status or Submission Form */}
                      {task.status === "GRADED" ? (
                        <div className="bg-emerald-950/50 border border-emerald-800 p-3 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-center text-emerald-300 font-bold">
                            <span>Evaluated by Department Manager:</span>
                            <span className="font-mono bg-emerald-900 px-2 py-0.5 rounded text-white">{task.grade || "A"}</span>
                          </div>
                          {task.feedback && (
                            <p className="text-slate-300 text-[11px] mt-1 italic">"{task.feedback}"</p>
                          )}
                        </div>
                      ) : task.status === "SUBMITTED" ? (
                        <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl text-xs text-amber-300 font-bold flex justify-between items-center">
                          <span>Deliverable Submitted • Awaiting Evaluation</span>
                          <span className="text-[10px] bg-amber-900 px-2 py-0.5 rounded text-amber-200">Pending Review</span>
                        </div>
                      ) : isExpired ? (
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-500 text-center font-bold">
                          Submissions locked. The deadline for this deliverable has concluded.
                        </div>
                      ) : (
                        <details className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
                          <summary className="font-bold text-blue-400 hover:text-blue-300 cursor-pointer flex justify-between items-center">
                            <span>Submit Deliverable Archive &rarr;</span>
                            <span className="text-[10px] text-slate-400">PDF / Image / Video / Link</span>
                          </summary>
                          <form action={submitTaskWorkAction} className="mt-3 space-y-3 pt-2 border-t border-slate-800">
                            <input type="hidden" name="taskId" value={task.id} />
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deliverable File Link or Description *</label>
                              <input 
                                type="text" 
                                name="submissionLink" 
                                required 
                                placeholder="https://drive.google.com/... or GitHub link" 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Summary of Work Executed</label>
                              <textarea 
                                name="submissionContent" 
                                rows={2} 
                                placeholder="Summary of results and findings..." 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" 
                              />
                            </div>
                            <button 
                              type="submit" 
                              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow"
                            >
                              Submit to Department Manager &rarr;
                            </button>
                          </form>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active Department Projects & Assembly Chat */}
          <div className="space-y-6">
            
            {/* Active Department Projects */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Active Division Projects</h3>
              {departmentProjects.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No projects in this division currently.</p>
              ) : (
                <div className="space-y-3">
                  {departmentProjects.map((p) => (
                    <div key={p.id} className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-white text-xs line-clamp-1">{p.title}</h5>
                        <span className="text-[9px] font-bold bg-slate-900 text-emerald-400 px-2 py-0.5 rounded">{p.status}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{p.progressPct || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progressPct || 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Department Assembly Chat */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col h-[400px]">
              <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Department Assembly Chat</h3>
                <span className="text-[9px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded uppercase font-bold border border-blue-800">Live</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-slate-500 py-10 text-center">No messages in room yet.</p>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700 text-xs">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                        <span className="font-bold text-white">{msg.senderName || "Pioneer"}</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-200">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form action={sendChatMessage} className="flex gap-2">
                <input type="hidden" name="departmentId" value={currentMember.departmentId || currentMember.department?.id || ""} />
                <input 
                  type="text" 
                  name="content" 
                  required 
                  placeholder="Share with peers..." 
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Send
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
