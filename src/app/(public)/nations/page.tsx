import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NationsPage() {
  let dbCountries: any[] = [];
  let dbAmbassadors: any[] = [];

  try {
    const [cnts, ambs] = await Promise.all([
      prisma.country.findMany({
        include: {
          members: { where: { deletedAt: null, status: "ACTIVE" } }
        },
        orderBy: { name: "asc" }
      }),
      prisma.member.findMany({
        where: {
          deletedAt: null,
          status: "ACTIVE",
          OR: [
            { role: { contains: "Ambassador" } },
            { leaderPosition: { contains: "Ambassador" } }
          ]
        },
        include: { country: true }
      })
    ]);
    dbCountries = cnts;
    dbAmbassadors = ambs;
  } catch (err) {
    console.error("Nations fetch fallback:", err);
  }

  const nationsList = dbCountries.map(c => {
    const matchingAmb = dbAmbassadors.find(a => a.countryId === c.id || a.country?.name?.toLowerCase() === c.name.toLowerCase());
    return {
      name: c.name,
      code: c.code || "AF",
      ambassador: matchingAmb ? `${matchingAmb.firstName} ${matchingAmb.lastName}` : "Accreditation Open",
      pioneers: c.members?.length || 0,
      status: matchingAmb ? "Active Sovereign Mission" : "Accreditation Open"
    };
  });

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 relative">
      {/* Header Banner */}
      <div 
        className="py-16 md:py-20 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-950/90"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto">
          <div className="inline-block bg-blue-500/30 text-blue-300 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-3 border border-blue-400/30">
            Diplomatic Footprint
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Nations Represented</h1>
          <p className="text-sm md:text-base text-blue-200 max-w-2xl mx-auto">
            POAF has mobilized youth pioneers, secondary school chapters, and official national ambassadors across sovereign African nations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl relative z-20 space-y-12 -mt-10">
        {/* Country Statistics Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800">
              Continental Coverage
            </span>
            <h2 className="text-2xl font-black mt-1">{nationsList.length} Sovereign Nations in Registry</h2>
            <p className="text-xs text-slate-400">Empowering student leaders across East, West, North, Central, and Southern Africa.</p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/apply?tab=ambassador" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow"
            >
              Apply as National Ambassador &rarr;
            </Link>
          </div>
        </div>

        {/* Nations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nationsList.map((nation, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white hover:border-blue-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">
                    {nation.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                    {nation.pioneers} Pioneers
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mb-1">{nation.name}</h3>
                <p className="text-xs text-slate-400">Ambassador: <strong className="text-white">{nation.ambassador}</strong></p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-[11px] text-slate-500">{nation.status}</span>
                <Link href="/apply?tab=member" className="text-blue-400 hover:text-blue-300 font-bold">
                  Join Chapter &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}