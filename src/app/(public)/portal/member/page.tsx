import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { sendChatMessage } from "@/actions/chat";
import { submitTaskWorkAction } from "@/actions/tasks";

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  let member: any = null;
  let chatMessages: any[] = [];
  let memberTasks: any[] = [];

  try {
    const [dbMember, msgs] = await Promise.all([
      prisma.member.findFirst({
        where: { deletedAt: null, status: "ACTIVE" },
        include: { department: true, country: true }
      }),
      prisma.chatMessage.findMany({
        where: { channel: "GENERAL" },
        orderBy: { createdAt: "desc" },
        take: 20
      })
    ]);
    member = dbMember;
    chatMessages = msgs.reverse();

    if (dbMember) {
      memberTasks = await prisma.task.findMany({
        where: {
          OR: [
            { assigneeId: dbMember.id },
            { departmentId: dbMember.departmentId || undefined },
            { assigneeId: null }
          ],
          deletedAt: null
        },
        orderBy: { createdAt: "desc" }
      });
    }
  } catch (e) {
    console.error(e);
  }

  const currentMember = member || {
    id: "mem-default",
    poafId: "POAF-MEM-0001",
    firstName: "Ezra Michael",
    lastName: "Jofe",
    role: "Pioneer Member",
    roles: "MEMBER",
    status: "ACTIVE",
    photoUrl: "/images/media_1787225249810.png",
    department: { name: "Technology and Innovation", id: "dept-tech" },
    country: { name: "Ethiopia" },
    inviteCode: "EZRA-2026",
    inviteCount: 14,
    totalPoints: 340,
    tasksCompleted: 4,
    gradeTier: "DISTINCTION",
    joinedDate: new Date()
  };

  const tasksList = memberTasks.length > 0 ? memberTasks : [
    {
      id: "tsk-1",
      poafId: "POAF-TSK-0012",
      title: "Develop Student Outreach Prototype & Community Survey",
      description: "Gather feedback from at least 15 secondary school students regarding STEM mentorship interests.",
      priority: "HIGH",
      maxPoints: 100,
      awardedGrade: 95,
      gradeFeedback: "Outstanding survey execution and structured data summary!",
      reviewedBy: "Tebarek Alemu (Dept Leader)",
      status: "GRADED",
      giverName: "Tebarek Alemu",
      deadline: new Date(Date.now() + 86400000 * 5)
    },
    {
      id: "tsk-2",
      poafId: "POAF-TSK-0018",
      title: "Draft Pan-African Innovation Blueprint Documentation",
      description: "Document the technical architecture and offline sync protocol for rural school hubs.",
      priority: "URGENT",
      maxPoints: 150,
      awardedGrade: null,
      gradeFeedback: null,
      reviewedBy: null,
      status: "PENDING",
      giverName: "Ali Usman",
      deadline: new Date(Date.now() + 86400000 * 3)
    }
  ];

  const inviteLink = `https://poaf.org/apply?ref=${currentMember.inviteCode || currentMember.poafId || "PIONEER"}`;
  const gradedTasks = tasksList.filter(t => t.status === "GRADED");
  const pendingTasks = tasksList.filter(t => t.status === "PENDING" || t.status === "IN_PROGRESS");
  const submittedTasks = tasksList.filter(t => t.status === "SUBMITTED");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-serif italic py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* Header Profile Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-cover bg-center shadow-lg border-4 border-blue-500 shrink-0"
              style={{ backgroundImage: `url('${currentMember.photoUrl || "/images/media_1787222340022.png"}')` }}
            ></div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">{currentMember.poafId}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Official Pioneer</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{currentMember.country?.name || "Pan-Africa"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{currentMember.firstName} {currentMember.lastName}</h1>
              <p className="text-xs font-bold text-slate-500 mt-1">Department: <strong className="text-blue-700">{currentMember.department?.name || "Technology and Innovation"}</strong></p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  {currentMember.role}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-full">
                  🏆 Honor: {currentMember.gradeTier || "DISTINCTION"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/verify" className="text-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow">
              Digital ID Card &rarr;
            </Link>
            <Link href="/portal/department" className="text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow">
              Department Workspace &rarr;
            </Link>
          </div>
        </div>

        {/* Member Performance & Scorecard Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Points Earned</span>
            <div className="text-3xl font-black text-emerald-700 mt-1">{currentMember.totalPoints || 340} <span className="text-xs font-normal text-slate-500">pts</span></div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Tasks Completed</span>
            <div className="text-3xl font-black text-blue-900 mt-1">{currentMember.tasksCompleted || gradedTasks.length || 4}</div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Under Review</span>
            <div className="text-3xl font-black text-amber-600 mt-1">{submittedTasks.length}</div>
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-slate-900 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pioneers Recruited</span>
            <div className="text-3xl font-black text-purple-700 mt-1">{currentMember.inviteCount || 14}</div>
          </div>
        </div>

        {/* 2-Column Section: Active Tasks Board & Work Submission (Left) / Grade Board & Evaluation Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* MY ACTIVE TASKS & SUBMISSION STATION */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Task Board
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">My Assigned Tasks</h2>
                <p className="text-xs text-slate-600">Review your operational goals, complete deliverables, and submit for evaluation.</p>
              </div>
              <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-full text-xs">
                {pendingTasks.length + submittedTasks.length} Active
              </span>
            </div>

            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {tasksList.map((task) => (
                <div key={task.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          {task.poafId || "TASK"}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === "URGENT" ? "bg-red-100 text-red-800" :
                          task.priority === "HIGH" ? "bg-amber-100 text-amber-800" :
                          "bg-slate-200 text-slate-700"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 mt-1.5">{task.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.description}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                      {task.maxPoints} pts
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex flex-wrap justify-between border-t border-slate-200 pt-2">
                    <span>Assigned by: <strong>{task.giverName || "Department Leader"}</strong></span>
                    {task.deadline && (
                      <span>Deadline: <strong className="text-slate-700">{new Date(task.deadline).toLocaleDateString()}</strong></span>
                    )}
                  </div>

                  {/* Submission Status or Submission Form */}
                  {task.status === "GRADED" ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-800">✅ Evaluated & Graded:</span>
                        <span className="font-black text-emerald-900 font-mono text-sm">{task.awardedGrade} / {task.maxPoints} pts</span>
                      </div>
                      <p className="text-emerald-700 text-[11px]">Feedback: "{task.gradeFeedback || "Great work!"}"</p>
                    </div>
                  ) : task.status === "SUBMITTED" ? (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                      <span>⏳ Work submitted. Awaiting leader review & points award.</span>
                      <span className="text-[10px] font-bold uppercase bg-amber-200/80 px-2 py-0.5 rounded">In Queue</span>
                    </div>
                  ) : (
                    <details className="bg-white p-3 rounded-xl border border-slate-200 text-xs cursor-pointer">
                      <summary className="font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between">
                        <span>📤 Submit Work for Leader Review</span>
                        <span className="text-[10px] text-slate-400 font-normal">Click to open form</span>
                      </summary>
                      
                      <form action={submitTaskWorkAction} className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                        <input type="hidden" name="taskId" value={task.id} />
                        
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Work Summary / Report *</label>
                          <textarea 
                            name="submissionContent" 
                            required 
                            rows={2} 
                            placeholder="Briefly describe what you completed and key findings..." 
                            className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Document Link / Drive / GitHub URL</label>
                          <input 
                            type="url" 
                            name="submissionLink" 
                            placeholder="https://docs.google.com/... or https://github.com/..." 
                            className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white"
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg transition"
                        >
                          Submit Assignment for Leader Review &rarr;
                        </button>
                      </form>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MY PERSONAL GRADE BOARD & EVALUATION FEED */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Grade Board
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Evaluation & Honors Scorecard</h2>
                <p className="text-xs text-slate-600">Review feedback and earned points awarded by your department leadership.</p>
              </div>
              <span className="bg-purple-100 text-purple-900 font-bold px-2.5 py-1 rounded-full text-xs">
                {currentMember.totalPoints || 340} Total Points
              </span>
            </div>

            {/* Distinction Honor Banner */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow border border-purple-400/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Pioneer Standing</span>
                <h3 className="text-lg font-black mt-0.5">Tier: {currentMember.gradeTier || "DISTINCTION"}</h3>
                <p className="text-[11px] text-purple-200">Eligible for Continental Leadership Distinctions & POAF Grants.</p>
              </div>
              <div className="text-3xl">🏅</div>
            </div>

            {/* Graded Tasks Feed */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Graded Assignments History</span>
              {gradedTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  No evaluated assignments yet. Submit active tasks to earn your initial points and honors!
                </div>
              ) : (
                gradedTasks.map((t, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{t.title}</h4>
                        <span className="text-[10px] text-slate-500">Evaluated by: {t.reviewedBy || "Department Lead"}</span>
                      </div>
                      <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                        +{t.awardedGrade || t.maxPoints} pts
                      </span>
                    </div>
                    {t.gradeFeedback && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 italic">
                        "{t.gradeFeedback}"
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Unique Invitation Link & Community Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Referral Box (1 Col) */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 space-y-4 lg:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
              Recruitment Station
            </span>
            <h3 className="text-lg font-black text-slate-900">Your Invitation Code</h3>
            <p className="text-xs text-slate-600">
              Share your link to recruit pioneers. When they are accepted, your recruitment counter updates instantly.
            </p>
            <input 
              type="text" 
              readOnly 
              value={inviteLink} 
              className="bg-slate-50 border border-slate-300 text-blue-700 font-mono text-xs px-3 py-2.5 rounded-xl w-full select-all focus:outline-none"
            />
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Total Recruited:</span>
              <span className="font-mono font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                {currentMember.inviteCount || 14} Pioneers
              </span>
            </div>
          </div>

          {/* Live Community Chat (2 Cols) */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 lg:col-span-2 flex flex-col justify-between h-[450px]">
            <div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    Pan-African Community Chat Channel
                  </h3>
                  <p className="text-xs text-slate-500">Real-time collaboration across all continental pioneers</p>
                </div>
                <span className="text-[10px] font-bold font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">#GENERAL</span>
              </div>

              {/* Chat Feed */}
              <div className="overflow-y-auto max-h-[260px] space-y-3 pr-2">
                {chatMessages.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 italic">
                    No messages in the channel yet. Be the first to start the discussion!
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
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">{msg.senderRole || "Member"}</span>
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
              <input type="hidden" name="channel" value="GENERAL" />
              <input type="hidden" name="senderName" value={`${currentMember.firstName} ${currentMember.lastName}`} />
              <input type="hidden" name="senderRole" value={currentMember.role} />
              <input type="hidden" name="senderPhoto" value={currentMember.photoUrl || "/images/media_1787222340022.png"} />
              <input type="hidden" name="senderPoafId" value={currentMember.poafId || ""} />
              
              <input 
                type="text" 
                name="content" 
                required 
                placeholder="Type a message to the pioneer community..." 
                className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow"
              >
                Send
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}