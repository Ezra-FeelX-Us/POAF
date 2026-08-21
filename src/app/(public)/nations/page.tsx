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

  const staticNations = [
    { name: "Ethiopia", code: "ET", region: "East Africa", ambassador: "Ezra Michael Jofe / Lydia Teshibelay", pioneers: 24, status: "Active Chapter & Headquarters", img: "/images/media_1787222887149.jpg" },
    { name: "Kenya", code: "KE", region: "East Africa", ambassador: "Ali Omari Washikala", pioneers: 6, status: "Active Diplomatic Mission", img: "/images/amb-kenya.png" },
    { name: "Ghana", code: "GH", region: "West Africa", ambassador: "Kofi Mensah", pioneers: 5, status: "Active Diplomatic Mission", img: "/images/amb-ghana.png" },
    { name: "Tanzania", code: "TZ", region: "East Africa", ambassador: "Caleb-John Dismas", pioneers: 4, status: "Active Diplomatic Mission", img: "/images/amb-tanzania.png" },
    { name: "South Africa", code: "ZA", region: "Southern Africa", ambassador: "Lerato Mthembu", pioneers: 4, status: "Active Diplomatic Mission", img: "/images/amb-southafrica.png" },
    { name: "Nigeria", code: "NG", region: "West Africa", ambassador: "Chinedu Okafor", pioneers: 7, status: "Active Diplomatic Mission", img: "/images/amb-nigeria.png" },
    { name: "Egypt", code: "EG", region: "North Africa", ambassador: "Ahmed Abdellateif", pioneers: 3, status: "Active Diplomatic Mission", img: "/images/amb-egypt.png" },
    { name: "Morocco", code: "MA", region: "North Africa", ambassador: "Salma El Idrissi & Lina Bennani", pioneers: 4, status: "Active Diplomatic Mission", img: "/images/amb-morocco-salma.png" },
    { name: "Rwanda", code: "RW", region: "East Africa", ambassador: "Regional Delegate", pioneers: 2, status: "Accreditation in Progress", img: "/images/media_1787224434429.jpg" },
    { name: "Uganda", code: "UG", region: "East Africa", ambassador: "Regional Delegate", pioneers: 2, status: "Accreditation in Progress", img: "/images/media_1787223618684.jpg" },
    { name: "Senegal", code: "SN", region: "West Africa", ambassador: "Regional Delegate", pioneers: 2, status: "Accreditation in Progress", img: "/images/media_1787223704562.jpg" },
    { name: "Cameroon", code: "CM", region: "Central Africa", ambassador: "Regional Delegate", pioneers: 1, status: "Accreditation in Progress", img: "/images/media_1787224603096.jpg" }
  ];

  // Merge DB dynamic countries and ambassadors
  const nationsList = staticNations.map(sn => {
    const matchingAmb = dbAmbassadors.find(a => a.country?.name?.toLowerCase() === sn.name.toLowerCase());
    return {
      ...sn,
      ambassador: matchingAmb ? `${matchingAmb.firstName} ${matchingAmb.lastName}` : sn.ambassador
    };
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative font-serif italic">
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
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Continental Coverage
            </span>
            <h2 className="text-2xl font-black mt-1">{nationsList.length} Represented Sovereign Nations</h2>
            <p className="text-xs text-slate-600">Empowering student leaders across East, West, North, Central, and Southern Africa.</p>
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
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-md border border-white/30 text-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl bg-cover bg-center shadow border-2 border-slate-200"
                    style={{ backgroundImage: `url('${nation.img}')` }}
                  />
                  <span className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                    {nation.code}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {nation.name}
                </h3>
                <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  {nation.region}
                </span>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">Ambassador:</span> {nation.ambassador}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Pioneers Mobilized:</span> <strong className="text-emerald-700">{nation.pioneers}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md block text-center border border-emerald-200">
                  {nation.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}