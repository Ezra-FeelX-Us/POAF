import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { sendChatMessage } from "@/actions/chat";

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  let member: any = null;
  let chatMessages: any[] = [];

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
    joinedDate: new Date()
  };

  const inviteLink = `https://poaf.org/apply?ref=${currentMember.inviteCode || currentMember.poafId || "PIONEER"}`;

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
              <p className="text-xs font-bold text-slate-500 mt-1">Department: <strong className="text-blue-700">{currentMember.department?.name || "General Assembly"}</strong></p>
              <div className="mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  {currentMember.role}
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

        {/* Invite Link & Referral Counter Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-700/50 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
              Pioneer Recruitment and Referral Engine
            </span>
            <h2 className="text-2xl font-black text-white">Your Unique Invitation Link</h2>
            <p className="text-xs text-blue-200 max-w-xl">
              Share your personal referral link with fellow African students. When they apply and get approved, your referral counter updates automatically in real time across the platform.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="text" 
                readOnly 
                value={inviteLink} 
                className="bg-slate-950/80 border border-blue-500/40 text-blue-300 font-mono text-xs px-3 py-2 rounded-xl w-full max-w-md select-all focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[200px]">
            <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block">Pioneers Recruited</span>
            <div className="text-4xl font-black text-amber-400 mt-1 mb-0.5">{currentMember.inviteCount || 0}</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Active Recruiter Status</span>
          </div>
        </div>

        {/* 2-Column Grid: Left (Department & Projects) / Right (Live Community Chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Department & Tasks (1 Col) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 space-y-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                Assigned Division
              </span>
              <h3 className="text-xl font-bold text-slate-900">{currentMember.department?.name || "Technology and Innovation"}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are registered in active service with this department. Check in regularly for project task dispatches.
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">Department Announcements:</div>
                <p className="text-slate-600 italic">Welcome to the department roster! Review open tasks and participate in continental initiatives.</p>
              </div>
              <Link href="/departments" className="block text-center w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition">
                View All Departments &rarr;
              </Link>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 space-y-4">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded">
                My Initiatives
              </span>
              <h3 className="text-lg font-bold text-slate-900">Active Projects</h3>
              <p className="text-xs text-slate-600">
                Track ongoing solutions and submit project progress reports directly to the Executive Council.
              </p>
              <Link href="/projects" className="block text-center w-full py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition">
                Explore Projects Board &rarr;
              </Link>
            </div>
          </div>

          {/* Right: Live Community Chat (2 Cols) */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 text-slate-900 lg:col-span-2 flex flex-col justify-between h-[580px]">
            <div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    Pan-African Community Chat Channel
                  </h3>
                  <p className="text-xs text-slate-500">Real-time collaboration across all continental pioneers</p>
                </div>
                <span className="text-[10px] font-bold font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">#GENERAL</span>
              </div>

              {/* Chat Feed */}
              <div className="overflow-y-auto max-h-[360px] space-y-3 pr-2">
                {chatMessages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 italic">
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
                className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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