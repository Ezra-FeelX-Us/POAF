import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { sendChatMessage, createDepartmentAnnouncement } from "@/actions/chat";

export const dynamic = "force-dynamic";

export default async function DepartmentPortalPage() {
  let sampleDept: any = null;
  let chatMessages: any[] = [];
  let announcements: any[] = [];

  try {
    const [dbDept, msgs, anncs] = await Promise.all([
      prisma.department.findFirst({
        where: { deletedAt: null },
        include: {
          leader: true,
          members: { where: { status: "ACTIVE", deletedAt: null }, include: { country: true } },
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
      })
    ]);
    sampleDept = dbDept;
    chatMessages = msgs.reverse();
    announcements = anncs;
  } catch (e) {
    console.error(e);
  }

  const dept = sampleDept || {
    id: "dept-tech",
    name: "Technology and Innovation",
    description: "Building digital platforms, hosting continental coding bootcamps, and providing technology literacy.",
    leader: { firstName: "Tebarek", lastName: "Alemu", role: "Department Leader", photoUrl: "/images/tebarek-alemu.png", poafId: "POAF-LDR-0001", inviteCode: "TEBAREK-TECH", inviteCount: 22 },
    members: [
      { firstName: "Henok", lastName: "Hankore", role: "Leader & Ambassador", country: { name: "Ethiopia" }, inviteCount: 8 },
      { firstName: "Keneriyan", lastName: "Fikadu", role: "Leader & Ambassador", country: { name: "Ethiopia" }, inviteCount: 5 },
      { firstName: "Ali", lastName: "Usman", role: "Chief Engineer", country: { name: "Ethiopia" }, inviteCount: 11 }
    ],
    projects: [
      { title: "POAF Digital Platform & Offline Portal", status: "ONGOING", progressPct: 65 }
    ]
  };

  const totalDeptRecruits = (dept.members || []).reduce((acc: number, m: any) => acc + (m.inviteCount || 0), dept.leader?.inviteCount || 0);

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
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Write Permissions Enabled</span>
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
              My Member Dashboard &rarr;
            </Link>
          </div>
        </div>

        {/* Department Recruitment Stats Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
              Department Recruitment & Growth Metrics
            </span>
            <h2 className="text-2xl font-black text-white">Department Recruitment Hub</h2>
            <p className="text-xs text-emerald-100 max-w-xl">
              Track how many pioneers have been brought into POAF through your department leader and team member referral links.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono font-bold text-emerald-200">Leader Invite Code: <strong className="text-white bg-slate-950/60 px-2.5 py-1 rounded-lg">{dept.leader?.inviteCode || "DEPT-LEADER"}</strong></span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[220px]">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">Total Recruited Pioneers</span>
            <div className="text-4xl font-black text-emerald-300 mt-1 mb-0.5">{totalDeptRecruits}</div>
            <span className="text-[10px] text-teal-200 font-semibold">{dept.members?.length || 0} Active Team Members</span>
          </div>
        </div>

        {/* 2-Column Grid: Left (Announcements & Team Roster) / Right (Leadership Chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Write Announcements & Team Roster (1 Col) */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Publisher Box (Write Permission) */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 space-y-4">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
                Leader Publisher (Write Role)
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
                    placeholder="e.g. Weekly Workshop Schedule" 
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

            {/* Department Team Roster */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 space-y-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                Division Personnel ({dept.members?.length || 0})
              </span>
              <h3 className="text-lg font-bold text-slate-900">Team Roster</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {dept.members?.map((m: any, i: number) => (
                  <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{m.firstName} {m.lastName}</div>
                      <div className="text-[10px] text-blue-600 font-semibold">{m.role}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        {m.inviteCount || 0} recruited
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Leadership & Governance Chat (2 Cols) */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 lg:col-span-2 flex flex-col justify-between h-[640px]">
            <div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></span>
                    Leadership & Executive Governance Channel
                  </h3>
                  <p className="text-xs text-slate-500">Secure coordination between department heads, managers, and ambassadors</p>
                </div>
                <span className="text-[10px] font-bold font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded">#LEADERSHIP</span>
              </div>

              {/* Chat Feed */}
              <div className="overflow-y-auto max-h-[420px] space-y-3 pr-2">
                {chatMessages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 italic">
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
                className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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