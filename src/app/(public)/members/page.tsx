import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;

  let dbMembers: any[] = [];
  try {
    dbMembers = await prisma.member.findMany({
      where: { 
        deletedAt: null,
        status: "ACTIVE"
      },
      include: {
        department: true,
        country: true
      },
      orderBy: [
        { joinedDate: "desc" },
        { leaderOrder: "asc" }
      ]
    });
  } catch (err) {
    console.error("Members DB fetch fallback:", err);
  }

  let membersToDisplay = dbMembers.map(m => ({
    id: m.id,
    poafId: m.poafId || "POAF-MEM-VERIFIED",
    name: `${m.firstName} ${m.lastName}`,
    role: m.role || "Member",
    position: m.leaderPosition || m.role,
    department: m.department?.name || "General Assembly",
    country: m.country?.name || "Pan-Africa",
    img: m.photoUrl || "/images/media_1787222340022.png",
    isLeader: m.isLeader,
    joinedDate: m.joinedDate
  }));

  if (filter === "leaders") {
    membersToDisplay = membersToDisplay.filter(m => m.isLeader);
  } else if (filter === "members") {
    membersToDisplay = membersToDisplay.filter(m => !m.isLeader || m.role === "Member");
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 relative">
      {/* Header Banner */}
      <div 
        className="py-16 md:py-20 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-950/90"></div>
        <div className="relative z-10 text-white">
          <div className="inline-block bg-blue-500/30 text-blue-300 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-3 border border-blue-400/30">
            Pan-African Youth Network
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Official Members Board</h1>
          <p className="text-sm md:text-base text-blue-200 max-w-2xl mx-auto">
            The visionary students, leaders, and pioneers powering the sustainable future of Africa.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl relative z-20 -mt-12">
        {/* Filter Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/20 mb-10 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2">
            <Link 
              href="/members" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!filter ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              All Pioneers ({membersToDisplay.length})
            </Link>
            <Link 
              href="/members?filter=leaders" 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === "leaders" ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              Leaders & Ambassadors
            </Link>
          </div>
          <div className="text-xs font-mono text-slate-500 px-3">
            Newest accepted pioneers ordered at top
          </div>
        </div>

        {/* Member Grid - 6 Columns */}
        {membersToDisplay.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800 inline-block">
              Founding Pioneer Cohort Open
            </span>
            <h3 className="text-2xl font-black text-white">Be the First Verified Pioneer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              POAF is officially open for membership applications across Africa. Submit your credentials to receive an accredited POAF ID and join the continental network.
            </p>
            <div className="pt-2">
              <Link 
                href="/apply?tab=member" 
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                Apply for Membership &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {membersToDisplay.map((m, idx) => (
              <MemberCard 
                key={idx}
                name={m.name}
                department={m.department}
                img={m.img} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ name, department, img }: { name: string, department: string, img: string }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-white/30 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
      <div 
        className="w-full h-40 sm:h-44 md:h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url('${img}')` }}
      />
      <div className="p-3 text-center">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 leading-snug line-clamp-1">{name}</h3>
        <p className="text-[10px] sm:text-xs font-semibold text-blue-700 leading-tight line-clamp-1">{department}</p>
      </div>
    </div>
  );
}