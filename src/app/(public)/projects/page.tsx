import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ searchParams }: { searchParams?: Promise<{ filter?: string }> }) {
  const search = await searchParams;
  const activeFilter = search?.filter || "ALL";

  let dbProjects: any[] = [];
  try {
    dbProjects = await prisma.project.findMany({
      where: { deletedAt: null },
      include: {
        department: true,
        teamMembers: {
          include: { member: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (err) {
    console.error("Projects DB fetch fallback:", err);
  }

  const staticProjects = [
    {
      id: "p1",
      poafId: "POAF-PRJ-2026-001",
      title: "POAF Digital Platform & Offline Portal",
      status: "ONGOING",
      department: "Technology & Innovation",
      country: "Pan-Africa (HQ Ethiopia)",
      description: "Developing pan-African tools for student collaboration, resource sharing, and offline caching for schools with low bandwidth.",
      leader: "Tebarek Alemu",
      assistants: ["Henok Hankore", "Ali Usman"],
      image: "/images/media_1787223249571.jpg",
      progress: 65,
      targetBeneficiaries: 1500,
      actualBeneficiaries: 1820
    },
    {
      id: "p2",
      poafId: "POAF-PRJ-2026-002",
      title: "Clean Water & Village Sanitation Survey",
      status: "ONGOING",
      department: "Community Outreach",
      country: "Ethiopia",
      description: "Conducting grassroots household surveys in rural communities and implementing low-cost filtration solutions.",
      leader: "Lydia Teshibelay",
      assistants: ["Fireab Mulugeta", "Behailu Berehanu"],
      image: "/images/media_1787224493193.jpg",
      progress: 45,
      targetBeneficiaries: 500,
      actualBeneficiaries: 637
    },
    {
      id: "p3",
      poafId: "POAF-PRJ-2026-003",
      title: "Solar Micro-Irrigation Blueprint",
      status: "APPROVED",
      department: "Research & Engineering",
      country: "Tanzania & Kenya",
      description: "Open-source engineering blueprints for affordable solar pumps designed for youth agricultural initiatives.",
      leader: "Ali Usman",
      assistants: ["Abel Tilahun", "Kibreab Dilamo"],
      image: "/images/media_1787223395009.png",
      progress: 80,
      targetBeneficiaries: 300,
      actualBeneficiaries: 340
    },
    {
      id: "p4",
      poafId: "POAF-PRJ-2025-004",
      title: "Pan-African Student Debate Cup",
      status: "COMPLETED",
      department: "Debate & Communication",
      country: "Pan-Africa (12 Nations)",
      description: "Continental virtual tournament uniting students across 12 countries to debate economic growth and youth leadership.",
      leader: "Dagmawit Getye",
      assistants: ["Dagmawit Sileshi", "Abyalew Ayele"],
      image: "/images/media_1787223618684.jpg",
      progress: 100,
      targetBeneficiaries: 800,
      actualBeneficiaries: 1140
    },
    {
      id: "p5",
      poafId: "POAF-PRJ-2025-005",
      title: "High School Leadership Chapters (50 Schools)",
      status: "COMPLETED",
      department: "Youth Empowerment",
      country: "Ethiopia, Kenya, Ghana",
      description: "Established accredited student chapters with structured governance and community service curricula.",
      leader: "Yeabsira Belete",
      assistants: ["Israel Tamirat", "Barkot Esubalew"],
      image: "/images/media_1787223704562.jpg",
      progress: 100,
      targetBeneficiaries: 2000,
      actualBeneficiaries: 2450
    },
    {
      id: "p6",
      poafId: "POAF-PRJ-2026-006",
      title: "CAD Solar Desalination Prototype",
      status: "PROPOSED",
      department: "Research & Engineering",
      country: "Egypt & Morocco",
      description: "Engineering research into parabolic solar reflectors to produce potable drinking water in coastal communities.",
      leader: "Ali Usman",
      assistants: ["Yared Tadesse", "Ahmed Abdellateif"],
      image: "/images/media_1787224434429.jpg",
      progress: 20,
      targetBeneficiaries: 400,
      actualBeneficiaries: 400
    }
  ];

  const projectsToDisplay = dbProjects.length > 0 ? dbProjects.map((p, i) => {
    const staticInfo = staticProjects[i % staticProjects.length];
    return {
      id: p.id,
      poafId: p.poafId || staticInfo.poafId,
      title: p.title,
      status: p.status,
      department: p.department?.name || staticInfo.department,
      country: p.country || staticInfo.country,
      description: p.description,
      leader: staticInfo.leader,
      assistants: staticInfo.assistants,
      image: staticInfo.image,
      progress: p.progressPct || staticInfo.progress,
      targetBeneficiaries: p.targetBeneficiaries || staticInfo.targetBeneficiaries,
      actualBeneficiaries: p.actualBeneficiaries || staticInfo.actualBeneficiaries
    };
  }) : staticProjects;

  const filteredProjects = activeFilter === "ALL" 
    ? projectsToDisplay 
    : projectsToDisplay.filter(p => p.status.toUpperCase() === activeFilter.toUpperCase());

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center relative font-serif italic text-slate-900"
      style={{ backgroundImage: "url('/images/media_1787223427061.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      {/* Header Banner */}
      <div 
        className="py-24 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-950/85"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto animate-[slideIn_1s_ease-out]">
          <div className="inline-block bg-blue-500/30 text-blue-300 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4 border border-blue-400/30">
            Measurable Pan-African Impact
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">Projects & Impact Reports</h1>
          <p className="text-base md:text-lg text-blue-200 max-w-2xl mx-auto">
            From proposal and peer review to field implementation and verified impact reporting.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl relative z-20 -mt-12 space-y-12">
        
        {/* Lifecycle Status Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/20 max-w-3xl mx-auto">
          {[
            { label: "All Initiatives", key: "ALL" },
            { label: "Ongoing Execution", key: "ONGOING" },
            { label: "Completed & Verified", key: "COMPLETED" },
            { label: "Approved (Starting Soon)", key: "APPROVED" },
            { label: "Under Review & Proposed", key: "PROPOSED" }
          ].map((tab) => (
            <Link
              key={tab.key}
              href={`/projects?filter=${tab.key}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.key
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-white/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Project Image */}
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${project.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-full border border-white/20">
                      {project.poafId}
                    </span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow ${
                      project.status === "COMPLETED" ? "bg-emerald-500 text-white" :
                      project.status === "ONGOING" ? "bg-blue-600 text-white" :
                      project.status === "APPROVED" ? "bg-amber-400 text-slate-950" :
                      "bg-slate-700 text-white"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 text-xs font-bold text-white flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{project.country}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {project.department}
                  </span>

                  <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Progress & Beneficiaries */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>Progress</span>
                      <span className="font-mono text-blue-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                      <span>Target: {project.targetBeneficiaries} pioneers</span>
                      <span className="text-emerald-600 font-bold">Reached: {project.actualBeneficiaries}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0">
                <Link
                  href={`/projects/${project.id}`}
                  className="block w-full text-center py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md group-hover:shadow-lg"
                >
                  View Full Proposal & Impact Report &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Proposal Banner */}
        <div 
          className="p-10 md:p-14 rounded-3xl bg-cover bg-center text-white shadow-2xl relative overflow-hidden text-center border border-white/10"
          style={{ backgroundImage: "url('/images/media_1787224434429.jpg')" }}
        >
          <div className="absolute inset-0 bg-blue-950/85"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black mb-3">Lead an Impact Initiative</h3>
            <p className="text-sm text-blue-200 mb-8 leading-relaxed">
              Have a grassroots engineering or community outreach solution? Submit a structured project proposal for review by the POAF Executive Council.
            </p>
            <Link 
              href="/apply?tab=proposal" 
              className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 px-8 rounded-2xl text-sm transition-all shadow-xl hover:scale-105"
            >
              Submit Structured Project Proposal &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}