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

  // DYNAMIC CATEGORIZATION FROM DATABASE RECORDS
  const dbFounders = allLeaders.filter(l => l.role?.toLowerCase().includes("president") || l.role?.toLowerCase().includes("founder") || l.role?.toLowerCase().includes("executive"));
  const dbAmbassadors = allLeaders.filter(l => l.role?.toLowerCase().includes("ambassador") || l.leaderPosition?.toLowerCase().includes("ambassador"));
  const dbDeptLeaders = allLeaders.filter(l => l.role === "Department Leader" || (l.role?.toLowerCase().includes("leader") && !l.role?.toLowerCase().includes("student") && !l.role?.toLowerCase().includes("president") && !l.role?.toLowerCase().includes("founder")));
  const dbManagers = allLeaders.filter(l => l.role === "Manager" || l.role === "Chief Engineer" || l.leaderPosition?.toLowerCase().includes("manager"));
  const dbStudentLeaders = allLeaders.filter(l => l.role === "Secretary" || l.role === "Student Leader" || l.leaderPosition?.toLowerCase().includes("student") || l.leaderPosition?.toLowerCase().includes("secretary"));

  const coFounders = dbFounders.map(l => ({
    name: `${l.firstName} ${l.lastName}`,
    role: l.leaderPosition || l.role,
    bio: l.bio || "Executive council member championing sustainable pan-African student solutions.",
    country: l.country?.name || "Pan-Africa",
    department: l.department?.name || "Executive Council",
    img: l.photoUrl || "/images/media_1787225249810.png"
  }));

  const nationalAmbassadors = dbAmbassadors.map(l => ({
    name: `${l.firstName} ${l.lastName}`,
    role: l.leaderPosition || l.role,
    country: l.country?.name || "Pan-Africa",
    img: l.photoUrl || "/images/media_1787222340022.png"
  }));

  const departmentLeaders = dbDeptLeaders.map(l => ({
    name: `${l.firstName} ${l.lastName}`,
    role: l.leaderPosition || l.role,
    dept: l.department?.name || "General Division",
    img: l.photoUrl || "/images/media_1787222340022.png"
  }));

  const projectManagers = dbManagers.map(l => ({
    name: `${l.firstName} ${l.lastName}`,
    role: l.leaderPosition || l.role,
    dept: l.department?.name || "Engineering & Labs",
    img: l.photoUrl || "/images/media_1787222340022.png"
  }));

  const studentLeaders = dbStudentLeaders.map(l => ({
    name: `${l.firstName} ${l.lastName}`,
    role: l.leaderPosition || l.role,
    dept: l.department?.name || "Campus Affairs",
    img: l.photoUrl || "/images/media_1787222340022.png"
  }));

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 relative">
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
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl text-white">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800 uppercase tracking-widest">
              Executive Presidency
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">Founder & Executive Council</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Guiding overall vision, strategic alliances, and institutional integrity.</p>
          </div>

          <div className="grid grid-cols-1 max-w-2xl mx-auto gap-6">
            {coFounders.map((founder, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div 
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-cover bg-center shadow-md border-4 border-amber-500 shrink-0"
                  style={{ backgroundImage: `url('${founder.img}')` }}
                ></div>
                <div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-800">
                    {founder.department}
                  </span>
                  <h3 className="text-xl font-black text-white mt-1.5">{founder.name}</h3>
                  <p className="text-xs sm:text-sm font-bold text-blue-400 mb-2">{founder.role}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. National Ambassadors */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl text-white">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800 uppercase tracking-widest">
              Diplomatic Network
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">National Ambassadors</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Representing POAF sovereign student chapters across African nations.</p>
          </div>

          {nationalAmbassadors.length === 0 ? (
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-800 text-center max-w-xl mx-auto space-y-3">
              <p className="text-xs text-slate-400">National representative applications are currently open for sovereign AU member states.</p>
              <Link href="/apply?tab=ambassador" className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition">
                Apply as National Representative &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {nationalAmbassadors.map((amb, i) => (
                <div key={i} className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700 shadow hover:shadow-lg transition-all text-center group flex flex-col items-center">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cover bg-center shadow border-2 border-slate-600 group-hover:scale-105 transition-transform mb-2.5"
                    style={{ backgroundImage: `url('${amb.img}')` }}
                  ></div>
                  <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 leading-snug">{amb.name}</h4>
                  <p className="text-[10px] sm:text-xs font-semibold text-blue-400 mt-0.5 line-clamp-1">{amb.role}</p>
                  <span className="inline-block mt-1.5 text-[9px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                    {amb.country}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Department Leaders */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl text-white">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 uppercase tracking-widest">
              Divisional Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">Department Leaders</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Leading technical research, community action, engineering, and youth training.</p>
          </div>

          {departmentLeaders.length === 0 ? (
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-800 text-center max-w-xl mx-auto space-y-3">
              <p className="text-xs text-slate-400">Department leadership positions across our 6 continental divisions are accepting applications.</p>
              <Link href="/apply?tab=department" className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition">
                Apply for Department Leadership &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {departmentLeaders.map((lead, i) => (
                <div key={i} className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700 shadow hover:shadow-lg transition-all text-center group flex flex-col items-center">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cover bg-center shadow border-2 border-slate-600 group-hover:scale-105 transition-transform mb-2.5"
                    style={{ backgroundImage: `url('${lead.img}')` }}
                  ></div>
                  <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 leading-snug">{lead.name}</h4>
                  <p className="text-[10px] sm:text-xs font-semibold text-emerald-400 mt-0.5 line-clamp-1">{lead.role}</p>
                  <span className="inline-block mt-1.5 text-[9px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                    {lead.dept}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Project Leaders & Managers */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl text-white">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-purple-400 bg-purple-950 px-3 py-1 rounded-full border border-purple-800 uppercase tracking-widest">
              Engineering & Execution
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">Project Managers</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Driving technological prototypes, community surveys, and laboratory execution.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {projectManagers.map((mgr, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700 shadow hover:shadow-lg transition-all text-center group flex flex-col items-center">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cover bg-center shadow border-2 border-slate-600 group-hover:scale-105 transition-transform mb-2.5"
                  style={{ backgroundImage: `url('${mgr.img}')` }}
                ></div>
                <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 leading-snug">{mgr.name}</h4>
                <p className="text-[10px] sm:text-xs font-semibold text-purple-400 mt-0.5 line-clamp-1">{mgr.role}</p>
                <span className="inline-block mt-1.5 text-[9px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                  {mgr.dept}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Secretaries & Student Leaders */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl text-white">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800 uppercase tracking-widest">
              Campus Governance
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">Student Leadership</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Coordinating documentation, debate forums, and secondary school chapters.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {studentLeaders.map((st, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700 shadow hover:shadow-lg transition-all text-center group flex flex-col items-center">
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cover bg-center shadow border-2 border-slate-600 group-hover:scale-105 transition-transform mb-2.5"
                  style={{ backgroundImage: `url('${st.img}')` }}
                ></div>
                <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 leading-snug">{st.name}</h4>
                <p className="text-[10px] sm:text-xs font-semibold text-amber-400 mt-0.5 line-clamp-1">{st.role}</p>
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