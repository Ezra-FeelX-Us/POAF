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

  const projectsToDisplay = dbProjects.map(p => ({
    id: p.id,
    poafId: p.poafId || "POAF-PRJ-ACTIVE",
    title: p.title,
    status: p.status || "APPROVED",
    department: p.department?.name || "General Division",
    country: "Pan-Africa",
    description: p.description || "Youth-led community impact project.",
    leader: p.teamMembers?.find((tm: any) => tm.role === "LEADER")?.member ? `${p.teamMembers.find((tm: any) => tm.role === "LEADER").member.firstName} ${p.teamMembers.find((tm: any) => tm.role === "LEADER").member.lastName}` : "Project Team",
    assistants: p.teamMembers?.filter((tm: any) => tm.role !== "LEADER").map((tm: any) => `${tm.member?.firstName} ${tm.member?.lastName}`) || [],
    image: "/images/media_1787223249571.jpg",
    progress: p.progressPct || 0,
    targetBeneficiaries: 500,
    actualBeneficiaries: 0
  }));

  const filteredProjects = activeFilter === "ALL" 
    ? projectsToDisplay 
    : projectsToDisplay.filter(p => p.status.toUpperCase() === activeFilter.toUpperCase());

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
            Measurable Pan-African Impact
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Projects & Impact Reports</h1>
          <p className="text-sm md:text-base text-blue-200 max-w-2xl mx-auto">
            Explore continuous project proposals, ongoing initiatives, and verified completion reports driven by POAF student pioneers.
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
        {filteredProjects.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 inline-block">
              Open Proposal Track
            </span>
            <h3 className="text-2xl font-black text-white">No Active Projects in this Stage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have a grassroots community solution or technological prototype for Africa? Submit an official project proposal to assemble a pioneer team and receive support.
            </p>
            <div className="pt-2">
              <Link 
                href="/apply?tab=project" 
                className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                Submit Project Proposal &rarr;
              </Link>
            </div>
          </div>
        ) : (
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
        )}

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