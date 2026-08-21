import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  let dbPartners: any[] = [];
  try {
    dbPartners = await prisma.partnership.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" }
    });
  } catch (err) {
    console.error("Partnership fetch fallback:", err);
  }

  const partnersList = dbPartners.map((p) => ({
    id: p.id,
    name: p.organizationName,
    type: p.organizationType || "Institutional Partner",
    collaboration: p.collaborationAreas || "Youth Empowerment & Continental Programs",
    website: p.website || "#",
    logo: p.logoUrl || "/images/media_1787222340022.png",
    tier: "Official Partner"
  }));

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 relative">
      {/* Header Banner */}
      <div 
        className="py-16 md:py-20 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787224434429.jpg')" }}
      >
        <div className="absolute inset-0 bg-purple-950/90"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto">
          <div className="inline-block bg-purple-500/30 text-purple-300 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-3 border border-purple-400/30">
            Strategic Alliances
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Official Partners Board</h1>
          <p className="text-sm md:text-base text-purple-200 max-w-2xl mx-auto">
            POAF collaborates with academic institutions, international NGOs, corporations, and community foundations to accelerate continental youth empowerment.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl relative z-20 space-y-12 -mt-10">
        {/* Partner Call to Action Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded border border-purple-800">
              Institutional Network
            </span>
            <h2 className="text-2xl font-black mt-1">{partnersList.length} Accredited Partner Alliances</h2>
            <p className="text-xs text-slate-400">Co-funding youth projects, hosting continental hackathons, and expanding opportunities.</p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/apply?tab=partnership" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow"
            >
              Submit Partnership Request &rarr;
            </Link>
          </div>
        </div>

        {/* Partners Grid */}
        {partnersList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-purple-400 bg-purple-950 px-3 py-1 rounded-full border border-purple-800 inline-block">
              Strategic Partnerships Open
            </span>
            <h3 className="text-2xl font-black text-white">Partner with Pioneers of Africa's Future</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We collaborate with universities, technology accelerators, NGOs, and continental institutions to empower African youth. Official accredited alliances are published here.
            </p>
            <div className="pt-2">
              <Link 
                href="/apply?tab=partnership" 
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                Apply for Partnership Alliance &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnersList.map((partner, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="w-16 h-16 rounded-2xl bg-cover bg-center shadow border border-slate-700"
                      style={{ backgroundImage: `url('${partner.logo}')` }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800">
                      {partner.tier}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white">
                    {partner.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">{partner.type}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Collaboration Scope</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{partner.collaboration}</p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                    Active Alliance
                  </span>
                  {partner.website && partner.website !== "#" && (
                    <a 
                      href={partner.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      Visit Portal &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}