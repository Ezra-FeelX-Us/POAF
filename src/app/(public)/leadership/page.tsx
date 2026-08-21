import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeadershipPage() {
  let allLeaders: any[] = [];
  try {
    allLeaders = await prisma.member.findMany({
      where: {
        isLeader: true,
        deletedAt: null,
        status: "ACTIVE"
      },
      include: {
        department: true,
        country: true
      },
      orderBy: { leaderOrder: "asc" }
    });
  } catch (err) {
    console.error("Leadership fetch fallback:", err);
  }

  // 1. Co-Founders & Executives
  const coFounders = [
    {
      name: "Ezra Michael Jofe",
      role: "Founder & Executive President",
      bio: "Visionary founder of Pioneers of Africa's Future (POAF), empowering youth and pioneering sustainable, youth-led pan-African solutions.",
      country: "Ethiopia",
      department: "Executive Council",
      img: "/images/media_1787225249810.png"
    }
  ];

  // 2. National Ambassadors
  const nationalAmbassadors = [
    { name: "Ali Omari Washikala", role: "Ambassador of Kenya", country: "Kenya", img: "/images/amb-kenya.png" },
    { name: "Kofi Mensah", role: "Ambassador of Ghana", country: "Ghana", img: "/images/amb-ghana.png" },
    { name: "Caleb-John Dismas", role: "Ambassador of Tanzania", country: "Tanzania", img: "/images/amb-tanzania.png" },
    { name: "Lerato Mthembu", role: "Ambassador of South Africa", country: "South Africa", img: "/images/amb-southafrica.png" },
    { name: "Chinedu Okafor", role: "Ambassador of Nigeria", country: "Nigeria", img: "/images/amb-nigeria.png" },
    { name: "Ahmed Abdellateif", role: "Ambassador of Egypt", country: "Egypt", img: "/images/amb-egypt.png" },
    { name: "Salma El Idrissi", role: "Morocco Ambassador", country: "Morocco", img: "/images/amb-morocco-salma.png" },
    { name: "Lina Bennani", role: "Morocco Ambassador", country: "Morocco", img: "/images/amb-morocco-lina.png" }
  ];

  // 3. Department Leaders
  const departmentLeaders = [
    { name: "Lydia Teshibelay", role: "Department Leader", dept: "Community Outreach", img: "/images/lydia-teshibelay.png" },
    { name: "Tebarek Alemu", role: "Department Leader", dept: "Technology & Innovation", img: "/images/tebarek-alemu.png" },
    { name: "Dagmawit Getye", role: "Department Leader", dept: "Debate & Communication", img: "/images/dagmawit-getye.png" },
    { name: "Yeabsira Belete", role: "Department Leader", dept: "Youth Empowerment", img: "/images/yeabsira-belete.png" },
    { name: "Sosena Maru", role: "Department Leader", dept: "Capacity Building", img: "/images/sosena-maru.png" },
    { name: "Abel Tilahun", role: "Department Leader", dept: "Research & Engineering", img: "/images/abel-tilahun.jpg" },
    { name: "Dagmawit Sileshi", role: "Department Leader", dept: "Debate & Communication", img: "/images/dagmawit-sileshi.jpg" },
    { name: "Eleni Getachew", role: "Department Leader", dept: "Capacity Building", img: "/images/eleni-getachew.jpg" },
    { name: "Henok Hankore", role: "Department Leader", dept: "Technology & Innovation", img: "/images/henok-hankore.png" },
    { name: "Keneriyan Fikadu", role: "Department Leader", dept: "Technology & Innovation", img: "/images/keneriyan-fikadu.jpg" },
    { name: "Kibreab Dilamo", role: "Department Leader", dept: "Research & Engineering", img: "/images/kibreab-dilamo.jpg" }
  ];

  // 4. Project Leaders & Managers
  const projectManagers = [
    { name: "Ali Usman", role: "Chief Engineer & Manager", dept: "Research & Engineering", img: "/images/media_1787223395009.png" },
    { name: "Betlehem Tadesse", role: "Manager & Ambassador", dept: "Community Outreach", img: "/images/betlehem-tadesse.jpg" },
    { name: "Edom Esayas", role: "Manager & Ambassador", dept: "Capacity Building", img: "/images/edom-esayas.jpg" },
    { name: "Yididya Melkamu", role: "Manager & Ambassador", dept: "Capacity Building", img: "/images/yididya-melkamu.jpg" }
  ];

  // 5. Student Leaders & Chapter Heads
  const studentLeaders = [
    { name: "Fireab Mulugeta", role: "Secretary & Ambassador", dept: "Community Outreach", img: "/images/fireab-mulugeta.jpg" },
    { name: "Behailu Berehanu", role: "Secretary & Ambassador", dept: "Community Outreach", img: "/images/behailu-berehanu.jpg" },
    { name: "Abyalew Ayele", role: "Secretary & Ambassador", dept: "Debate & Communication", img: "/images/abyalew-ayele.jpg" },
    { name: "Israel Tamirat", role: "Student Leader & Ambassador", dept: "Youth Empowerment", img: "/images/israel-tamirat.jpg" },
    { name: "Barkot Esubalew", role: "Student Leader & Ambassador", dept: "Youth Empowerment", img: "/images/barkot-esubalew.jpg" },
    { name: "Bony Zerihun", role: "Student Leader & Ambassador", dept: "Youth Empowerment", img: "/images/bony-zerihun.jpg" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative font-serif italic">
      {/* Header */}
      <div 
        className="py-16 md:py-20 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-950/90"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto">
          <div className="inline-block bg-blue-500/30 text-blue-300 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-3 border border-blue-400/30">
            Governance & Executive Roster
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Official Leadership Board</h1>
          <p className="text-sm md:text-base text-blue-200 max-w-2xl mx-auto">
            The visionary executives, national ambassadors, department heads, and chapter leaders guiding our pan-African youth movement.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl relative z-20 space-y-16">

        {/* 1. Co-Founders & Executive Council */}
        <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 text-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
              Executive Presidency
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Founder & Executive Council</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Guiding overall vision, strategic alliances, and institutional integrity.</p>
          </div>

          <div className="grid grid-cols-1 max-w-2xl mx-auto gap-6">
            {coFounders.map((founder, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div 
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-cover bg-center shadow-md border-4 border-amber-400 shrink-0"
                  style={{ backgroundImage: `url('${founder.img}')` }}
                ></div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {founder.department}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1.5">{founder.name}</h3>
                  <p className="text-xs sm:text-sm font-bold text-blue-600 mb-2">{founder.role}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. National Ambassadors - 5 Columns */}
        <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 text-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest">
              Diplomatic Network
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">National Ambassadors</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Representing POAF sovereign student chapters across African nations.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {nationalAmbassadors.map((amb, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 shadow hover:shadow-lg transition-all text-center group flex flex-col items-center">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cover bg-center shadow border-2 border-slate-200 group-hover:scale-105 transition-transform mb-2.5"
                  style={{ backgroundImage: `url('${amb.img}')` }}
                ></div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">{amb.name}</h4>
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 mt-0.5 line-clamp-1">{amb.role}</p>
                <span className="inline-block mt-1.5 text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {amb.country}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Department Leaders - 5 Columns */}
        <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 text-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest">
              Department Operations
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Department Leaders</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Leading specialized divisions in outreach, technology, debate, research, and youth empowerment.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {departmentLeaders.map((ldr, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 shadow hover:shadow-lg transition-all text-center group flex flex-col items-center">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cover bg-center shadow border-2 border-slate-200 group-hover:scale-105 transition-transform mb-2.5"
                  style={{ backgroundImage: `url('${ldr.img}')` }}
                ></div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors line-clamp-1 leading-snug">{ldr.name}</h4>
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 mt-0.5 line-clamp-1">{ldr.role}</p>
                <span className="inline-block mt-1.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 line-clamp-1">
                  {ldr.dept}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Project Leaders & Managers - 5 Columns */}
        <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 text-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 uppercase tracking-widest">
              Engineering & Execution
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Project Leaders & Managers</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Driving technological prototypes, community surveys, and laboratory execution.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {projectManagers.map((mgr, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 shadow hover:shadow-lg transition-all text-center group flex flex-col items-center">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cover bg-center shadow border-2 border-slate-200 group-hover:scale-105 transition-transform mb-2.5"
                  style={{ backgroundImage: `url('${mgr.img}')` }}
                ></div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-purple-600 transition-colors line-clamp-1 leading-snug">{mgr.name}</h4>
                <p className="text-[10px] sm:text-xs font-semibold text-purple-600 mt-0.5 line-clamp-1">{mgr.role}</p>
                <span className="inline-block mt-1.5 text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 line-clamp-1">
                  {mgr.dept}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Secretaries & Student Leaders - 5 Columns */}
        <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 text-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
              Campus Governance
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Secretaries & Student Leaders</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Coordinating documentation, debate forums, and secondary school chapters.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {studentLeaders.map((st, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 shadow hover:shadow-lg transition-all text-center group flex flex-col items-center">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cover bg-center shadow border-2 border-slate-200 group-hover:scale-105 transition-transform mb-2.5"
                  style={{ backgroundImage: `url('${st.img}')` }}
                ></div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">{st.name}</h4>
                <p className="text-[10px] sm:text-xs font-semibold text-amber-600 mt-0.5 line-clamp-1">{st.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action for Leadership */}
        <div 
          className="p-10 md:p-14 rounded-3xl bg-cover bg-center text-white shadow-2xl relative overflow-hidden text-center border border-white/10"
          style={{ backgroundImage: "url('/images/media_1787224434429.jpg')" }}
        >
          <div className="absolute inset-0 bg-blue-950/85"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black mb-3">Aspiring to Lead?</h3>
            <p className="text-sm text-blue-200 mb-8 leading-relaxed">
              We welcome visionary African students to apply for department leadership, national ambassadorships, and project director roles.
            </p>
            <Link 
              href="/apply?tab=leadership" 
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-2xl text-sm transition-all shadow-xl hover:scale-105 border border-white/20"
            >
              Submit Leadership Application &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}