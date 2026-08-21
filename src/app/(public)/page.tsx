import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let members = 1;
  let leaders = 1;
  let countries = 15;
  let departmentsCount = 6;
  let partnerships = 0;
  let initiatives = 6;
  let ongoingProjects = 0;
  let completedProjects = 0;
  let eventsCount = 0;
  let activeLeaders: any[] = [];
  let allDepartments: any[] = [];

  try {
    const results = await Promise.all([
      prisma.member.count({ where: { deletedAt: null, status: "ACTIVE" } }),
      prisma.member.count({ where: { deletedAt: null, isLeader: true, status: "ACTIVE" } }),
      prisma.country.count(),
      prisma.department.count({ where: { deletedAt: null } }),
      prisma.partnership.count({ where: { deletedAt: null } }),
      prisma.initiative.count({ where: { deletedAt: null } }),
      prisma.project.count({ where: { deletedAt: null, progressPct: { lt: 100 } } }),
      prisma.project.count({ where: { deletedAt: null, progressPct: 100 } }),
      prisma.event.count({ where: { deletedAt: null } }),
      prisma.member.findMany({ where: { isLeader: true, status: "ACTIVE", deletedAt: null }, orderBy: { leaderOrder: 'asc' } }),
      prisma.department.findMany({ where: { deletedAt: null }, include: { _count: { select: { members: true } } } })
    ]);
    members = results[0];
    leaders = results[1];
    countries = results[2];
    departmentsCount = results[3];
    partnerships = results[4];
    initiatives = results[5];
    ongoingProjects = results[6];
    completedProjects = results[7];
    eventsCount = results[8];
    activeLeaders = results[9];
    allDepartments = results[10];
  } catch (err) {
    console.warn("Home page database fetch fallback:", err);
  }

  const nationalAmbassadors = activeLeaders
    .filter(l => l.role?.toLowerCase().includes("ambassador") || l.leaderPosition?.toLowerCase().includes("ambassador"))
    .map(l => ({
      name: `${l.firstName} ${l.lastName}`,
      role: l.leaderPosition || l.role,
      img: l.photoUrl || "/images/media_1787222340022.png",
      bgPos: "bg-[position:left_top]"
    }));

  const leadersToDisplay = activeLeaders.map(l => ({
    name: `${l.firstName} ${l.lastName}`,
    role: l.leaderPosition || l.role,
    img: l.photoUrl || "/images/media_1787222340022.png",
    bgPos: "bg-[position:left_top]"
  }));

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section 
        className="relative text-white py-32 px-6 text-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/images/media_1787222912157.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-900/75 z-0"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="overflow-hidden">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-[slideIn_2s_ease-out]">
              P|AF
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 animate-[slideIn_2.2s_ease-out]">
              Pioneers of Africa's Future
            </h2>
          </div>
          <p className="text-xl md:text-3xl text-blue-200 font-semibold italic mb-10 max-w-3xl mx-auto leading-relaxed animate-[slideIn_2.5s_ease-out]">
            "Building Leaders. Solving Real Problems. Creating Africa's Future."
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 animate-[slideIn_3s_ease-out]">
            <Link
              href="/apply"
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition-all w-full sm:w-auto text-lg"
            >
              Join PIONEERS OF AFRICA'S FUTURE
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/50 font-bold rounded-xl shadow-lg hover:bg-white/30 hover:-translate-y-1 transition-all w-full sm:w-auto text-lg"
            >
              Book an Appointment
            </Link>
          </div>
          
          <div className="mt-12 animate-[slideIn_3.5s_ease-out]">
            <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-4">Official Application Portal</p>
            <Link 
              href="/apply" 
              className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-base md:text-lg rounded-2xl shadow-xl hover:-translate-y-1 transition-all border border-blue-400/30"
            >
              <span>Apply — All Applications in One Portal</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Movement Introduction */}
      <section className="py-20 bg-white text-center bg-cover bg-center relative" style={{ backgroundImage: "url('/images/media_1787223704562.jpg')" }}>
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
           <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-8">Join the Pan-African Movement</h2>
           <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-semibold">
              <strong className="font-black text-slate-900">PIONEERS OF AFRICA'S FUTURE (POAF)</strong> is a youth-led movement established to empower students and young leaders across Africa. By uniting passionate young hearts, we inspire lasting change-makers to lead, innovate, and thrive.
           </p>
        </div>
      </section>

      {/* Founder's Message & Leadership Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none" 
          style={{ backgroundImage: "url('/images/media_1787222862970.jpg')" }}
        ></div>
        
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start gap-12 mb-16">
            {/* Ezra's Spotlight */}
            <div className="lg:w-1/3 w-full flex flex-col items-center">
              <div 
                className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-cover bg-center shadow-2xl border-4 border-yellow-500 mb-6"
                style={{ backgroundImage: "url('/images/media_1787225249810.png')" }}
              ></div>
              <div className="text-center font-bold text-slate-900">
                <p className="text-2xl text-slate-900">Ezra Michael Jofe</p>
                <p className="text-blue-600 font-medium uppercase tracking-wide text-xs mt-1">Founder & Executive President of POAF</p>
              </div>
            </div>
            
            {/* Ezra's Message */}
            <div className="lg:w-2/3 w-full bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
               <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">A Message to the Continental Pioneers</h2>
               <p className="text-blue-600 font-bold mb-6 uppercase tracking-widest text-xs">Issued by President Ezra Michael Jofe</p>
               
               <blockquote className="border-l-4 border-blue-600 pl-6 text-slate-600 text-sm md:text-base leading-relaxed mb-6 space-y-4">
                  <p>
                    <span className="text-3xl font-serif text-blue-300 leading-none mr-2">"</span>
                    To the Visionary Youth of Africa, our continent stands on the cusp of an intellectual, civic, and practical renaissance. This transformation cannot be driven by abstract, distant guidelines; it must be forged at the grassroots by the brilliant actions, creative minds, and boundless energy of its young pioneers. Pioneers of Africa's Future (POAF) was established to serve as the unified launchpad for this generation of scholars and organizers.
                  </p>
                  <p>
                    We do not look to the historical limitations of our regions as terminal boundaries. Instead, we treat them as active catalysts for the physical engineering blueprints, policy frameworks, and local leadership forums that our departments actively develop. Whether you are building an agricultural system in Kenya, writing a research tract in Nigeria, organizing academic mentorship, or establishing a school club, your actions constitute the physical stones with which we create Africa's future. Keep the standards high, respect our constitutional pillars, and let us march toward a self-determined and prosperous continent.
                    <span className="text-3xl font-serif text-blue-300 leading-none ml-2">"</span>
                  </p>
               </blockquote>
            </div>
          </div>

          {/* Statistics Board */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl mt-8 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500 opacity-20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
            <h3 className="text-2xl font-bold text-center mb-8 relative z-10">Global Impact & Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10 text-center">
              <Link href="/members" className="group p-3 rounded-2xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700">
                <p className="text-4xl font-black text-yellow-400 mb-2 group-hover:scale-105 transition-transform">{members}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-300 group-hover:text-yellow-300 transition-colors">Registered Members</p>
                <p className="text-[10px] text-slate-400 mt-1">Official Members Board &rarr;</p>
              </Link>
              <Link href="/leadership" className="group p-3 rounded-2xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700">
                <p className="text-4xl font-black text-yellow-400 mb-2 group-hover:scale-105 transition-transform">{leaders}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-300 group-hover:text-yellow-300 transition-colors">Active Leaders</p>
                <p className="text-[10px] text-slate-400 mt-1">Leadership Roster &rarr;</p>
              </Link>
              <Link href="/projects" className="group p-3 rounded-2xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700">
                <p className="text-4xl font-black text-yellow-400 mb-2 group-hover:scale-105 transition-transform">{initiatives > 0 ? initiatives : completedProjects + ongoingProjects}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-300 group-hover:text-yellow-300 transition-colors">Active Initiatives</p>
                <p className="text-[10px] text-slate-400 mt-1">Projects & Reports &rarr;</p>
              </Link>
              <Link href="/leadership" className="group p-3 rounded-2xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700">
                <p className="text-4xl font-black text-yellow-400 mb-2 group-hover:scale-105 transition-transform">{countries}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-300 group-hover:text-yellow-300 transition-colors">Nations Represented</p>
                <p className="text-[10px] text-slate-400 mt-1">Pan-African Map &rarr;</p>
              </Link>
              <Link href="/departments" className="group p-3 rounded-2xl hover:bg-slate-800/80 transition-all border border-slate-700/50 hover:border-slate-600 bg-slate-800/40">
                <p className="text-4xl font-black text-yellow-400 mb-2 group-hover:scale-105 transition-transform">{departmentsCount}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-300 group-hover:text-yellow-300 transition-colors">Departments</p>
                <p className="text-[10px] text-slate-400 mt-1">Continental Divisions &rarr;</p>
              </Link>
              <Link href="/about" className="group p-3 rounded-2xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700">
                <p className="text-4xl font-black text-yellow-400 mb-2 group-hover:scale-105 transition-transform">{partnerships}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-300 group-hover:text-yellow-300 transition-colors">Official Partners</p>
                <p className="text-[10px] text-slate-400 mt-1">Partner Network &rarr;</p>
              </Link>
            </div>
          </div>

          {/* National Ambassadors */}
          {nationalAmbassadors.length > 0 && (
            <div className="border-t border-slate-200 pt-12">
              <h3 className="text-xl md:text-2xl font-bold text-center text-slate-900 mb-8">National Ambassadors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 text-center">
                {nationalAmbassadors.map((amb, i) => (
                  <div key={i} className="flex flex-col items-center group p-2">
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full mb-3 shadow-md border-2 border-slate-200 bg-no-repeat transition-transform duration-300 group-hover:scale-105 ${amb.bgPos}`} style={{ backgroundImage: `url('${amb.img}')` }}></div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors leading-snug">{amb.name}</h4>
                    <p className="text-[10px] sm:text-[11px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">{amb.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Our Departments */}
          <div className="py-14 px-4 sm:px-8 rounded-3xl overflow-hidden relative bg-cover bg-center mt-16 mb-16 shadow-xl" style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}>
            <div className="absolute inset-0 bg-slate-900/90"></div>
            <div className="px-2 relative z-10 text-white w-full">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Our Departments</h2>
                <p className="max-w-2xl mx-auto text-slate-300 text-sm">
                  The driving forces behind POAF's organizational success across Africa.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Community Outreach */}
                <div className="relative p-6 rounded-2xl hover:-translate-y-1.5 transition-transform overflow-hidden group min-h-[220px] flex flex-col justify-end">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/media_1787222887149.jpg')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                  <div className="relative z-10 text-left">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 text-blue-300 drop-shadow-md">1. Community Outreach</h3>
                    <p className="text-slate-200 text-xs leading-relaxed drop-shadow">Identifying grassroots challenges and implementing sustainable, youth-led solutions.</p>
                  </div>
                </div>
                {/* 2. Technology */}
                <div className="relative p-6 rounded-2xl hover:-translate-y-1.5 transition-transform overflow-hidden group min-h-[220px] flex flex-col justify-end">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/media_1787223249571.jpg')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                  <div className="relative z-10 text-left">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 text-blue-300 drop-shadow-md">2. Technology & Innovation</h3>
                    <p className="text-slate-200 text-xs leading-relaxed drop-shadow">Building digital solutions and promoting tech literacy across the continent.</p>
                  </div>
                </div>
                {/* 3. Research */}
                <div className="relative p-6 rounded-2xl hover:-translate-y-1.5 transition-transform overflow-hidden group min-h-[220px] flex flex-col justify-end">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/media_1787223395009.png')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                  <div className="relative z-10 text-left">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 text-blue-300 drop-shadow-md">3. Research & Engineering</h3>
                    <p className="text-slate-200 text-xs leading-relaxed drop-shadow">Pioneering scientific inquiry and infrastructure blueprints for Africa's progress.</p>
                  </div>
                </div>
                {/* 4. Debate */}
                <div className="relative p-6 rounded-2xl hover:-translate-y-1.5 transition-transform overflow-hidden group min-h-[220px] flex flex-col justify-end">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/media_1787223618684.jpg')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                  <div className="relative z-10 text-left">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 text-blue-300 drop-shadow-md">4. Debate & Communication</h3>
                    <p className="text-slate-200 text-xs leading-relaxed drop-shadow">Empowering youth voices through structured debate, diplomacy, and dialogue.</p>
                  </div>
                </div>
                {/* 5. Youth Empowerment */}
                <div className="relative p-6 rounded-2xl hover:-translate-y-1.5 transition-transform overflow-hidden group min-h-[220px] flex flex-col justify-end">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/media_1787223704562.jpg')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                  <div className="relative z-10 text-left">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 text-blue-300 drop-shadow-md">5. Youth Empowerment</h3>
                    <p className="text-slate-200 text-xs leading-relaxed drop-shadow">Fostering personal, academic, and professional growth for African youth.</p>
                  </div>
                </div>
                {/* 6. Capacity Building */}
                <div className="relative p-6 rounded-2xl hover:-translate-y-1.5 transition-transform overflow-hidden group min-h-[220px] flex flex-col justify-end">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/media_1787224603096.png')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                  <div className="relative z-10 text-left">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 text-blue-300 drop-shadow-md">6. Capacity Building</h3>
                    <p className="text-slate-200 text-xs leading-relaxed drop-shadow">Training organizational leads and scaling continental outreach initiatives.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Leaders */}
          <div className="bg-slate-100 rounded-3xl py-12 px-4 sm:px-8 mt-16 shadow-inner">
            <h3 className="text-xl md:text-2xl font-bold text-center text-slate-900 mb-8">Department Leaders</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 text-center">
              {leadersToDisplay.map((leader, i) => (
                <div key={i} className="flex flex-col items-center group p-2">
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full mb-3 shadow-md border-2 border-slate-200 bg-cover transition-transform duration-300 group-hover:scale-105 ${leader.bgPos}`} style={{ backgroundImage: `url('${leader.img}')` }}></div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors leading-snug">{leader.name}</h4>
                  <p className="text-[10px] sm:text-[11px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">{leader.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Banner after Leaders & Members */}
          <div 
            className="my-20 p-10 md:p-14 rounded-3xl bg-cover bg-center text-white shadow-2xl relative overflow-hidden text-center border border-white/10"
            style={{ backgroundImage: "url('/images/media_1787224434429.jpg')" }}
          >
            <div className="absolute inset-0 bg-blue-950/85"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest bg-blue-600/40 text-blue-200 px-4 py-1.5 rounded-full border border-blue-400/30 mb-4 inline-block">
                Unified Application Portal
              </span>
              <h3 className="text-3xl md:text-4xl font-black mb-4">
                Ready to Pioneer Africa's Future?
              </h3>
              <p className="text-blue-200 text-base md:text-lg mb-8 leading-relaxed">
                Submit your application today. Membership, Leadership, Club Chapters, Partnerships, and Honors are all available in one easy-to-use page.
              </p>
              <Link 
                href="/apply"
                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-900 hover:bg-blue-50 font-black text-lg rounded-2xl shadow-2xl hover:-translate-y-1 transition-all"
              >
                <span>Apply Now (One Page Application)</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Partner Organizations */}
          <div className="mt-20">
            <h3 className="text-sm font-bold text-center text-slate-400 uppercase tracking-widest mb-8">Official Partner Organizations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 justify-items-center">
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-contain bg-center bg-no-repeat shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/kb-hub-logo.png')" }}
                ></div>
                <div className="text-sm font-black font-serif text-slate-800">KB's OPPORTUNITY HUB</div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-cover bg-center shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/kemba-code-logo.png')" }}
                ></div>
                <div className="text-sm font-black font-sans text-slate-800">KEMBA CODE</div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-cover bg-center shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/ivyroad-logo.png')" }}
                ></div>
                <div className="text-sm font-black font-serif text-slate-800">IVY ROAD</div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-cover bg-center shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/scholarpath-logo.png')" }}
                ></div>
                <div className="text-sm font-black italic text-slate-800">SCHOLARPATH</div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-cover bg-center shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/ctp-ethiopia-logo.png')" }}
                ></div>
                <div className="text-sm font-black text-slate-800">CTP ETHIOPIA</div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-cover bg-center shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/insa-logo.png')" }}
                ></div>
                <div className="text-sm font-black text-slate-800">INSA TALENT CENTER</div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-cover bg-center shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/delys-logo.png')" }}
                ></div>
                <div className="text-sm font-black text-slate-800">DELYs OPPORTUNITY</div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-cover bg-center shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/brightway-logo.png')" }}
                ></div>
                <div className="text-sm font-black text-slate-800">BRIGHT WAY</div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl bg-cover bg-center shadow-md border-2 border-slate-200" 
                  style={{ backgroundImage: "url('/images/afronet-logo.png')" }}
                ></div>
                <div className="text-sm font-black text-slate-800">AFRONET</div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/apply?tab=partnership"
                className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-lg transition-all"
              >
                Partner With POAF Movement &rarr;
              </Link>
            </div>
          </div>

          {/* Community Impact Competition Spotlight */}
          <div className="mt-20 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 md:p-14 shadow-2xl border border-white/10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/30">
                Annual Youth Challenge
              </span>
              <h3 className="text-3xl md:text-4xl font-black mt-3 mb-4">POAF Community Impact Competition</h3>
              <p className="text-sm text-blue-200 leading-relaxed mb-6">
                Funding and accelerating grassroots engineering, clean water, clean energy, and education solutions developed by African student chapters.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/competition"
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg"
                >
                  Explore 2026 Cycle & Finalists &rarr;
                </Link>
                <Link 
                  href="/apply?tab=proposal"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/30 transition"
                >
                  Submit Chapter Proposal
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <span className="text-xs font-mono text-amber-300 font-bold">2026 Continental Seed Pool</span>
              <div className="text-4xl font-black my-2 text-white">$10,000+</div>
              <p className="text-[11px] text-blue-200">Distributed directly to winning student teams across 12 African nations.</p>
            </div>
          </div>

          {/* Latest Announcements */}
          <div className="mt-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-200">
                News & Publications
              </span>
              <h3 className="text-3xl font-black text-slate-900 mt-2">Latest Announcements</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                <span className="text-[10px] font-bold text-slate-400">August 2026 • Policy</span>
                <h4 className="font-bold text-slate-900 text-base mt-1 mb-2">10 Pillars Governance Framework Ratified</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Official adoption of ethical leadership, pan-African unity, and student governance mandates.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                <span className="text-[10px] font-bold text-slate-400">August 2026 • Technology</span>
                <h4 className="font-bold text-slate-900 text-base mt-1 mb-2">Digital Platform & Registry Live on PostgreSQL</h4>
                <p className="text-xs text-slate-600 leading-relaxed">High-speed verification engine and real-time statistics active across continental nodes.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
                <span className="text-[10px] font-bold text-slate-400">August 2026 • Diplomacy</span>
                <h4 className="font-bold text-slate-900 text-base mt-1 mb-2">Morocco, Ghana & Kenya Ambassador Charters</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Expanded sovereign chapter networks established in North and West African regions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}