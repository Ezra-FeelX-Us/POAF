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

  const staticPartners = [
    {
      id: "part-1",
      name: "KB's Opportunity Hub",
      type: "Youth Empowerment NGO",
      collaboration: "Pan-African Youth Scholarships & Mentorship Fellowships",
      website: "https://kbopportunityhub.org",
      logo: "/images/media_1787222340022.png",
      tier: "Founding Strategic Partner"
    },
    {
      id: "part-2",
      name: "Pan-African Academic Consortium",
      type: "University Alliances",
      collaboration: "Cross-border Academic Research & Engineering Prototype Labs",
      website: "https://africanuniversities.edu",
      logo: "/images/media_1787223249571.jpg",
      tier: "Academic Partner"
    },
    {
      id: "part-3",
      name: "Continental STEM Foundation",
      type: "Technology Foundation",
      collaboration: "Youth Coding Bootcamps & CAD Engineering Blueprints",
      website: "https://stemafrica.tech",
      logo: "/images/media_1787223395009.png",
      tier: "Technology Partner"
    },
    {
      id: "part-4",
      name: "Green Horizons Africa",
      type: "Environmental & Climate NGO",
      collaboration: "Solar Micro-Irrigation & Grassroots Water Filtration Audits",
      website: "https://greenhorizons.ngo",
      logo: "/images/media_1787223618684.jpg",
      tier: "Community Impact Partner"
    },
    {
      id: "part-5",
      name: "African Youth Diplomacy Forum",
      type: "Diplomatic Institute",
      collaboration: "Pan-African Student Debate Cup & Continental Model AU",
      website: "https://youthdiplomacy.africa",
      logo: "/images/media_1787223704562.jpg",
      tier: "Diplomatic Partner"
    },
    {
      id: "part-6",
      name: "Sahara Tech Labs",
      type: "Innovation Accelerator",
      collaboration: "Digital Platform Infrastructure & Offline Education Portal",
      website: "https://saharatech.io",
      logo: "/images/media_1787224603096.jpg",
      tier: "Infrastructure Partner"
    }
  ];

  // Merge DB dynamic partners
  const partnersList = [
    ...dbPartners.map((p) => ({
      id: p.id,
      name: p.organizationName,
      type: p.organizationType || "Institutional Partner",
      collaboration: p.collaborationAreas || "Youth Empowerment & Continental Programs",
      website: p.website || "#",
      logo: p.logoUrl || "/images/media_1787222340022.png",
      tier: "Official Partner"
    })),
    ...staticPartners.filter(sp => !dbPartners.some(dp => dp.organizationName?.toLowerCase() === sp.name.toLowerCase()))
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative font-serif italic">
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
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-slate-900 flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
              Institutional Network
            </span>
            <h2 className="text-2xl font-black mt-1">{partnersList.length} Accredited Partner Alliances</h2>
            <p className="text-xs text-slate-600">Co-funding youth projects, hosting continental hackathons, and expanding opportunities.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnersList.map((partner, idx) => (
            <div 
              key={idx} 
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-md border border-white/30 text-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-16 h-16 rounded-2xl bg-cover bg-center shadow border-2 border-slate-200"
                    style={{ backgroundImage: `url('${partner.logo}')` }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    {partner.tier}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{partner.type}</p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">Collaboration Scope</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{partner.collaboration}</p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Active Alliance
                </span>
                {partner.website && partner.website !== "#" && (
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    Visit Portal &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}