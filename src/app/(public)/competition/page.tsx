import React from "react";
import Link from "next/link";

export default async function CompetitionPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; cycle?: string }>;
}) {
  const { tab = "overview", cycle = "2026" } = await searchParams;

  const cycleYears = ["2026", "2025", "2024"];

  const finalists = [
    {
      title: "Solar-Powered Low-Cost Micro Filtration Unit",
      team: "Addis Ababa Institute of Technology & Hawassa Chapter",
      country: "Ethiopia",
      category: "Water & Sanitation",
      status: "Grand Winner (2025)",
      award: "Gold Laureate • $5,000 Seed Grant",
      desc: "An open-source gravity-assisted filtration apparatus capable of purifying 1,200 liters of surface water daily for rural highland villages.",
      img: "/images/media_1787224493193.jpg"
    },
    {
      title: "Pan-African Offline STEM Curriculum Node",
      team: "Nairobi & Kumasi Technology Alliance",
      country: "Kenya & Ghana",
      category: "Education & Tech",
      status: "First Runner-Up (2025)",
      award: "Silver Laureate • $3,000 Seed Grant",
      desc: "Solar-powered Raspberry Pi mesh micro-servers delivering digital textbooks, CAD exercises, and debate records to schools without internet.",
      img: "/images/media_1787223249571.jpg"
    },
    {
      title: "Youth Bio-Pesticide & Organic Compost Cooperative",
      team: "Kilimanjaro Youth Agriculture Chapter",
      country: "Tanzania",
      category: "Agriculture & Ecology",
      status: "Finalist (2026 Active)",
      award: "Finalist • Seed Stage",
      desc: "Producing locally sourced biological pest deterrence solutions from indigenous neem and moringa plants to replace expensive chemical imports.",
      img: "/images/media_1787222887149.jpg"
    },
    {
      title: "Renewable Cold Storage for Fisherfolk Cooperatives",
      team: "Alexandria Coastal Youth Coalition",
      country: "Egypt",
      category: "Energy & Cold Chain",
      status: "Shortlisted (2026 Active)",
      award: "Semi-Finalist",
      desc: "Thermal battery refrigeration hubs powered by shoreline solar arrays to prevent fish spoilage across artisanal fishing communities.",
      img: "/images/media_1787223395009.png"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center relative font-serif italic text-slate-900"
      style={{ backgroundImage: "url('/images/media_1787223427061.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      {/* Header Banner */}
      <div 
        className="py-24 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787224434429.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-950/85"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto animate-[slideIn_1s_ease-out]">
          <div className="inline-block bg-amber-500/30 text-amber-300 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4 border border-amber-400/30">
            Pan-African Youth Challenge
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">Community Impact Competition</h1>
          <p className="text-base md:text-lg text-blue-200 max-w-2xl mx-auto">
            Annual continental contest funding youth-engineered grassroots solutions in health, clean water, clean energy, education, and economic empowerment.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl relative z-20 -mt-12 space-y-10">

        {/* Cycle & Tab Selector */}
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/20 flex flex-wrap justify-between items-center gap-4">
          
          {/* Cycle Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Cycle:</span>
            {cycleYears.map((cYear) => (
              <Link
                key={cYear}
                href={`/competition?cycle=${cYear}&tab=${tab}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${cycle === cYear ? "bg-amber-500 text-slate-950 shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {cYear} {cYear === "2026" ? "(Active)" : "Cycle"}
              </Link>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            <Link 
              href={`/competition?cycle=${cycle}&tab=overview`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === "overview" ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              Overview & Rules
            </Link>
            <Link 
              href={`/competition?cycle=${cycle}&tab=shortlisted`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === "shortlisted" ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              Shortlisted & Finalists
            </Link>
            <Link 
              href={`/competition?cycle=${cycle}&tab=winners`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === "winners" ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              Laureates & Winners
            </Link>
            <Link 
              href="/apply?tab=proposal"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Submit Project &rarr;
            </Link>
          </div>
        </div>

        {/* Tab 1: Overview & Guidelines */}
        {tab === "overview" && (
          <div className="space-y-10">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
              <div className="max-w-3xl mb-8">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-200">
                  {cycle} Annual Cycle
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-3">Empowering Grassroots Innovation</h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  The POAF Community Impact Competition invites student teams across Africa to submit high-impact, low-cost community solutions. Winning teams receive direct seed financing, executive mentorship, and pilot deployment assistance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-base mb-1">1. Call for Proposals</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Teams of 2–5 students formulate actionable blueprints addressing real local challenges.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-base mb-1">2. Jury Review & Shortlist</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">The Executive Research Council audits feasibility, budget discipline, and measurable impact metrics.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-base mb-1">3. Seed Grants & Laureates</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Top finalists present at the Continental Virtual Showcase and receive immediate seed grants.</p>
                </div>
              </div>

              <div className="bg-blue-900 text-white p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Ready to submit your chapter's proposal?</h3>
                  <p className="text-xs text-blue-200">Applications for the {cycle} cycle are reviewed continuously by the Executive Committee.</p>
                </div>
                <Link 
                  href="/apply?tab=proposal"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg shrink-0"
                >
                  Submit Proposal Now &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Shortlisted & Finalists / Tab 3: Winners */}
        {(tab === "shortlisted" || tab === "winners") && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
                {cycle} Competition Cohort
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-3">
                {tab === "winners" ? "Laureates & Seed Grant Recipients" : "Shortlisted & Finalist Initiatives"}
              </h2>
              <p className="text-slate-600 text-sm mt-1">Verified grassroots engineering and community development prototypes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {finalists.map((prj, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                  <div>
                    <div 
                      className="w-full h-52 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${prj.img}')` }}
                    >
                      <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow border border-white/40">
                        {prj.status}
                      </div>
                      <div className="absolute top-4 right-4 bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow border border-white/40">
                        {prj.country}
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{prj.category}</span>
                      <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">{prj.title}</h3>
                      <p className="text-xs font-semibold text-slate-500 mb-3">Led by {prj.team}</p>
                      <p className="text-xs text-slate-700 leading-relaxed mb-4">{prj.desc}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-700">{prj.award}</span>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}