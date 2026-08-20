import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  let dbDepartments: any[] = [];
  try {
    dbDepartments = await prisma.department.findMany({
      where: { deletedAt: null },
      include: {
        leader: true,
        members: true,
        projects: {
          where: { status: "ONGOING" }
        }
      }
    });
  } catch (err) {
    console.error("Departments DB fetch fallback:", err);
  }

  const staticDepartments = [
    {
      id: "dept-1",
      name: "Community Outreach & Problem-Solving",
      description: "Identifying grassroots challenges in water, sanitation, and health across rural and urban communities and implementing sustainable, youth-led solutions.",
      bgImg: "/images/media_1787222887149.jpg",
      leaderName: "Lydia Teshibelay",
      leaderRole: "Ambassador, Community Outreach",
      leaderPhoto: "/images/lydia-teshibelay.png",
      members: [
        { name: "Fireab Mulugeta", role: "Ambassador & Secretary" },
        { name: "Behailu Berehanu", role: "Ambassador & Secretary" },
        { name: "Betlehem Tadesse", role: "Manager & Ambassador" }
      ],
      projects: [
        { title: "Clean Water & Sanitation Survey", desc: "Conducting household audits and distributing low-cost filtration systems." }
      ]
    },
    {
      id: "dept-2",
      name: "Technology & Innovation",
      description: "Building digital platforms, hosting continental coding bootcamps, and providing technology literacy to empower African students.",
      bgImg: "/images/media_1787223249571.jpg",
      leaderName: "Tebarek Alemu",
      leaderRole: "Leader & Ambassador, Tech",
      leaderPhoto: "/images/tebarek-alemu.png",
      members: [
        { name: "Henok Hankore", role: "Leader & Ambassador" },
        { name: "Keneriyan Fikadu", role: "Leader & Ambassador" },
        { name: "Ali Usman", role: "Chief Engineer" }
      ],
      projects: [
        { title: "POAF Digital Platform & Offline Portal", desc: "Developing pan-African tools for collaboration and resource access." }
      ]
    },
    {
      id: "dept-3",
      name: "Research & Engineering",
      description: "Pioneering scientific inquiry, CAD engineering blueprints, academic whitepapers, and low-cost infrastructure prototypes.",
      bgImg: "/images/media_1787223395009.png",
      leaderName: "Ali Usman",
      leaderRole: "Chief Engineer & Research Lead",
      leaderPhoto: "/images/media_1787223395009.png",
      members: [
        { name: "Abel Tilahun", role: "Leader & Ambassador" },
        { name: "Kibreab Dilamo", role: "Leader & Ambassador" }
      ],
      projects: [
        { title: "Solar Micro-Irrigation Blueprint", desc: "Engineering accessible solar power schematics for agricultural youth." }
      ]
    },
    {
      id: "dept-4",
      name: "Debate & Communication",
      description: "Empowering youth voices through structured debate tournaments, pan-African diplomacy forums, and multilingual bulletins.",
      bgImg: "/images/media_1787223618684.jpg",
      leaderName: "Dagmawit Getye",
      leaderRole: "Leader & Ambassador, Debate",
      leaderPhoto: "/images/dagmawit-getye.png",
      members: [
        { name: "Dagmawit Sileshi", role: "Leader & Ambassador" },
        { name: "Abyalew Ayele", role: "Secretary & Ambassador" }
      ],
      projects: [
        { title: "Pan-African Student Debate Cup", desc: "Continental virtual tournament addressing economic and climate resilience." }
      ]
    },
    {
      id: "dept-5",
      name: "Youth Empowerment & Community Development",
      description: "Fostering personal and professional growth through student parliaments, high school leadership chapters, and national ambassador networks.",
      bgImg: "/images/media_1787223704562.jpg",
      leaderName: "Yeabsira Belete",
      leaderRole: "Leader & Ambassador, Youth",
      leaderPhoto: "/images/yeabsira-belete.png",
      members: [
        { name: "Israel Tamirat", role: "Student Leader & Ambassador" },
        { name: "Barkot Esubalew", role: "Student Leader & Ambassador" },
        { name: "Bony Zerihun", role: "Ambassador & Student Leader" }
      ],
      projects: [
        { title: "High School Leadership Chapters", desc: "Establishing campus-level leadership bodies across 50 secondary schools." }
      ]
    },
    {
      id: "dept-6",
      name: "Student Development & Capacity Building",
      description: "Delivering executive governance masterclasses, mental health peer support, career mentorship, and professional skill laboratories.",
      bgImg: "/images/media_1787224603096.png",
      leaderName: "Sosena Maru",
      leaderRole: "Leader & Ambassador, Capacity",
      leaderPhoto: "/images/sosena-maru.png",
      members: [
        { name: "Edom Esayas", role: "Manager & Ambassador" },
        { name: "Yididya Melkamu", role: "Manager & Ambassador" },
        { name: "Eleni Getachew", role: "Leader & Ambassador" }
      ],
      projects: [
        { title: "Executive Leadership Masterclass Series", desc: "Intensive training for student executives and chapter presidents." }
      ]
    }
  ];

  const displayDepartments = dbDepartments.length > 0 ? dbDepartments.map((dbDept: any, idx: number) => ({
    id: dbDept.id,
    name: dbDept.name,
    description: dbDept.description,
    bgImg: staticDepartments[idx % staticDepartments.length].bgImg,
    leaderName: dbDept.leader ? `${dbDept.leader.firstName} ${dbDept.leader.lastName}` : staticDepartments[idx % staticDepartments.length].leaderName,
    leaderRole: dbDept.leader ? dbDept.leader.role : staticDepartments[idx % staticDepartments.length].leaderRole,
    leaderPhoto: dbDept.leader?.photoUrl || staticDepartments[idx % staticDepartments.length].leaderPhoto,
    members: dbDept.members.length > 0 ? dbDept.members.map((m: any) => ({ name: `${m.firstName} ${m.lastName}`, role: m.role })) : staticDepartments[idx % staticDepartments.length].members,
    projects: dbDept.projects.length > 0 ? dbDept.projects.map((p: any) => ({ title: p.title, desc: p.description })) : staticDepartments[idx % staticDepartments.length].projects
  })) : staticDepartments;

  return (
    <div className="min-h-screen bg-slate-50">
      <div 
        className="py-24 px-6 text-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <div className="relative z-10 text-white animate-[slideIn_1s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">POAF Departments</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Discover the specialized divisions that drive our mission, meet their leaders, and explore their active initiatives.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="space-y-16">
          {displayDepartments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
              
              {/* Department Image & Title */}
              <div 
                className="lg:w-1/3 w-full min-h-[300px] bg-cover bg-center relative p-8 flex flex-col justify-end"
                style={{ backgroundImage: `url('${dept.bgImg}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2">{dept.name}</h2>
                  <p className="text-sm text-slate-200">{dept.description}</p>
                </div>
              </div>

              {/* Department Details */}
              <div className="lg:w-2/3 w-full p-8 md:p-12">
                
                {/* Leadership Section */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Department Leadership</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 bg-cover bg-center shadow-sm" style={{ backgroundImage: `url('${dept.leaderPhoto}')` }}></div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{dept.leaderName}</h4>
                      <p className="text-blue-600 font-medium text-sm">{dept.leaderRole}</p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100 mb-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Members List */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Members & Sub-Leaders</h3>
                    <ul className="space-y-3">
                      {dept.members.map((member: any, i: number) => (
                        <li key={i} className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl">
                          <span className="text-slate-800 text-sm font-semibold">{member.name}</span>
                          <span className="text-blue-600 text-xs font-bold">{member.role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ongoing Projects List */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ongoing Initiatives</h3>
                    <ul className="space-y-4">
                      {dept.projects.map((project: any, i: number) => (
                        <li key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <h4 className="font-bold text-slate-900 text-sm mb-1">{project.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{project.desc}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link href={`/departments/${dept.id}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow">
                        View Full Department &rarr;
                      </Link>
                      <Link href="/projects" className="text-xs font-bold text-blue-600 hover:underline">
                        Explore Projects &rarr;
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}