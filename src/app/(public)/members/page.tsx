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

  const staticLeaders = [
    { poafId: "POAF-AMB-0001", name: "Ali Omari Washikala", role: "Ambassador of Kenya", department: "Pan-African Diplomacy", country: "Kenya", img: "/images/amb-kenya.png", isLeader: true, position: "Ambassador of Kenya" },
    { poafId: "POAF-AMB-0002", name: "Kofi Mensah", role: "Ambassador of Ghana", department: "Pan-African Diplomacy", country: "Ghana", img: "/images/amb-ghana.png", isLeader: true, position: "Ambassador of Ghana" },
    { poafId: "POAF-AMB-0003", name: "Caleb-John Dismas", role: "Ambassador of Tanzania", department: "Pan-African Diplomacy", country: "Tanzania", img: "/images/amb-tanzania.png", isLeader: true, position: "Ambassador of Tanzania" },
    { poafId: "POAF-AMB-0004", name: "Lerato Mthembu", role: "Ambassador of South Africa", department: "Pan-African Diplomacy", country: "South Africa", img: "/images/amb-southafrica.png", isLeader: true, position: "Ambassador of South Africa" },
    { poafId: "POAF-AMB-0005", name: "Chinedu Okafor", role: "Ambassador of Nigeria", department: "Pan-African Diplomacy", country: "Nigeria", img: "/images/amb-nigeria.png", isLeader: true, position: "Ambassador of Nigeria" },
    { poafId: "POAF-AMB-0006", name: "Ahmed Abdellateif", role: "Ambassador of Egypt", department: "Pan-African Diplomacy", country: "Egypt", img: "/images/amb-egypt.png", isLeader: true, position: "Ambassador of Egypt" },
    { poafId: "POAF-AMB-0007", name: "Salma El Idrissi", role: "Morocco Ambassador", department: "Pan-African Diplomacy", country: "Morocco", img: "/images/amb-morocco-salma.png", isLeader: true, position: "Morocco Ambassador" },
    { poafId: "POAF-AMB-0008", name: "Lina Bennani", role: "Morocco Ambassador", department: "Pan-African Diplomacy", country: "Morocco", img: "/images/amb-morocco-lina.png", isLeader: true, position: "Morocco Ambassador" },
    { poafId: "POAF-LDR-0001", name: "Lydia Teshibelay", role: "Department Leader", department: "Community Outreach", country: "Ethiopia", img: "/images/lydia-teshibelay.png", isLeader: true, position: "Ambassador & Department Head" },
    { poafId: "POAF-SEC-0001", name: "Fireab Mulugeta", role: "Secretary", department: "Community Outreach", country: "Ethiopia", img: "/images/fireab-mulugeta.jpg", isLeader: true, position: "Ambassador & Secretary" },
    { poafId: "POAF-LDR-0002", name: "Tebarek Alemu", role: "Department Leader", department: "Technology & Innovation", country: "Ethiopia", img: "/images/tebarek-alemu.png", isLeader: true, position: "Leader & Ambassador, Tech" },
    { poafId: "POAF-SEC-0002", name: "Behailu Berehanu", role: "Secretary", department: "Community Outreach", country: "Ethiopia", img: "/images/behailu-berehanu.jpg", isLeader: true, position: "Ambassador & Secretary" },
    { poafId: "POAF-MGR-0001", name: "Betlehem Tadesse", role: "Manager", department: "Community Outreach", country: "Ethiopia", img: "/images/betlehem-tadesse.jpg", isLeader: true, position: "Manager & Ambassador" },
    { poafId: "POAF-LDR-0003", name: "Dagmawit Getye", role: "Department Leader", department: "Debate & Communication", country: "Ethiopia", img: "/images/dagmawit-getye.png", isLeader: true, position: "Leader & Ambassador, Debate" },
    { poafId: "POAF-STL-0001", name: "Israel Tamirat", role: "Student Leader", department: "Youth Empowerment", country: "Ethiopia", img: "/images/israel-tamirat.jpg", isLeader: true, position: "Student Leader & Ambassador" },
    { poafId: "POAF-MGR-0002", name: "Edom Esayas", role: "Manager", department: "Capacity Building", country: "Ethiopia", img: "/images/edom-esayas.jpg", isLeader: true, position: "Manager & Ambassador" },
    { poafId: "POAF-LDR-0004", name: "Yeabsira Belete", role: "Department Leader", department: "Youth Empowerment", country: "Ethiopia", img: "/images/yeabsira-belete.png", isLeader: true, position: "Leader & Ambassador, Youth" },
    { poafId: "POAF-STL-0002", name: "Barkot Esubalew", role: "Student Leader", department: "Youth Empowerment", country: "Ethiopia", img: "/images/barkot-esubalew.jpg", isLeader: true, position: "Student Leader & Ambassador" },
    { poafId: "POAF-MGR-0003", name: "Yididya Melkamu", role: "Manager", department: "Capacity Building", country: "Ethiopia", img: "/images/yididya-melkamu.jpg", isLeader: true, position: "Manager & Ambassador" },
    { poafId: "POAF-LDR-0005", name: "Sosena Maru", role: "Department Leader", department: "Capacity Building", country: "Ethiopia", img: "/images/sosena-maru.png", isLeader: true, position: "Leader & Ambassador, Capacity" },
    { poafId: "POAF-STL-0003", name: "Bony Zerihun", role: "Student Leader", department: "Youth Empowerment", country: "Ethiopia", img: "/images/bony-zerihun.jpg", isLeader: true, position: "Ambassador & Student Leader" },
    { poafId: "POAF-SEC-0003", name: "Abyalew Ayele", role: "Secretary", department: "Debate & Communication", country: "Ethiopia", img: "/images/abyalew-ayele.jpg", isLeader: true, position: "Secretary & Ambassador" },
    { poafId: "POAF-LDR-0006", name: "Abel Tilahun", role: "Department Leader", department: "Research & Engineering", country: "Ethiopia", img: "/images/abel-tilahun.jpg", isLeader: true, position: "Leader & Ambassador" },
    { poafId: "POAF-LDR-0007", name: "Dagmawit Sileshi", role: "Department Leader", department: "Debate & Communication", country: "Ethiopia", img: "/images/dagmawit-sileshi.jpg", isLeader: true, position: "Leader & Ambassador" },
    { poafId: "POAF-LDR-0008", name: "Eleni Getachew", role: "Department Leader", department: "Capacity Building", country: "Ethiopia", img: "/images/eleni-getachew.jpg", isLeader: true, position: "Leader & Ambassador" },
    { poafId: "POAF-LDR-0009", name: "Henok Hankore", role: "Department Leader", department: "Technology & Innovation", country: "Ethiopia", img: "/images/henok-hankore.png", isLeader: true, position: "Leader & Ambassador" },
    { poafId: "POAF-LDR-0010", name: "Keneriyan Fikadu", role: "Department Leader", department: "Technology & Innovation", country: "Ethiopia", img: "/images/keneriyan-fikadu.jpg", isLeader: true, position: "Leader & Ambassador" },
    { poafId: "POAF-LDR-0011", name: "Kibreab Dilamo", role: "Department Leader", department: "Research & Engineering", country: "Ethiopia", img: "/images/kibreab-dilamo.jpg", isLeader: true, position: "Leader & Ambassador" },
    { poafId: "POAF-MGR-0004", name: "Ali Usman", role: "Chief Engineer", department: "Research & Engineering", country: "Ethiopia", img: "/images/media_1787223395009.png", isLeader: true, position: "Chief Engineer & Manager" }
  ];

  let membersToDisplay = dbMembers.length > 0 ? [
    ...dbMembers.map(m => ({
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
    })),
    ...staticLeaders.filter(sl => !dbMembers.some(dm => `${dm.firstName} ${dm.lastName}`.toLowerCase() === sl.name.toLowerCase()))
  ] : staticLeaders;

  if (filter === "leaders") {
    membersToDisplay = membersToDisplay.filter(m => m.isLeader);
  } else if (filter === "members") {
    membersToDisplay = membersToDisplay.filter(m => !m.isLeader || m.role === "Member");
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center relative"
      style={{ backgroundImage: "url('/images/media_1787223427061.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      {/* Header Banner */}
      <div 
        className="py-24 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-950/85"></div>
        <div className="relative z-10 text-white animate-[slideIn_1s_ease-out]">
          <div className="inline-block bg-blue-500/30 text-blue-300 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4 border border-blue-400/30">
            Pan-African Youth Network
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Official Members Board</h1>
          <p className="text-base md:text-lg text-blue-200 max-w-2xl mx-auto">
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

        {/* Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {membersToDisplay.map((m, idx) => (
            <MemberCard 
              key={idx}
              name={m.name}
              department={m.department}
              img={m.img} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MemberCard({ name, department, img }: { name: string, department: string, img: string }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col">
      <div 
        className="w-full h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url('${img}')` }}
      />
      <div className="p-6 text-center">
        <h3 className="text-lg font-black text-slate-900 mb-1">{name}</h3>
        <p className="text-xs font-bold text-blue-700">{department}</p>
      </div>
    </div>
  );
}