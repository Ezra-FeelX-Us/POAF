import React from "react";
import Link from "next/link";
import { submitApplicationAction } from "@/actions/applications";

export default async function UnifiedApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; ref?: string; invite?: string }>;
}) {
  const { tab, ref: refCode, invite } = await searchParams;
  const currentTab = (tab || "membership").toLowerCase();
  const activeReferral = refCode || invite || "";

  const tabs = [
    { id: "membership", label: "1. Membership", activeBg: "bg-blue-600 text-white" },
    { id: "ambassador", label: "2. Country Ambassador", activeBg: "bg-emerald-600 text-white" },
    { id: "department", label: "3. Dept Leadership", activeBg: "bg-indigo-600 text-white" },
    { id: "executive", label: "4. Executive Council", activeBg: "bg-amber-600 text-white" },
    { id: "partnership", label: "5. Partnership", activeBg: "bg-purple-600 text-white" },
    { id: "chapter", label: "6. Club Chapter", activeBg: "bg-teal-600 text-white" },
    { id: "award", label: "7. Awards & Grants", activeBg: "bg-red-600 text-white" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative font-serif italic">
      {/* Header Banner */}
      <div 
        className="py-16 md:py-20 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787224434429.jpg')" }} 
      >
        <div className="absolute inset-0 bg-blue-950/90"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto">
          <div className="inline-block bg-blue-500/30 text-blue-300 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-3 border border-blue-400/30">
            Official POAF Global Intake Station
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Unified International Application Portal</h1>
          <p className="text-sm md:text-base text-blue-200 max-w-2xl mx-auto">
            Submit your application in one place to join as a pioneer member, represent your sovereign nation as an ambassador, lead a department, join the executive council, or establish an institutional partnership.
          </p>
          {activeReferral && (
            <div className="mt-3 inline-block bg-purple-500/20 text-purple-200 border border-purple-400/40 px-3.5 py-1 rounded-full text-xs font-bold">
              ✨ Applying via Pioneer Referral Code: <span className="font-mono text-amber-300">{activeReferral}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-24 max-w-5xl relative z-20 -mt-12">
        {/* Application Track Selector Bar */}
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/20 mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={`/apply?tab=${t.id}${activeReferral ? `&ref=${activeReferral}` : ''}`}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                currentTab === t.id
                  ? `${t.activeBg} shadow-md scale-[1.02]`
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{t.label}</span>
            </Link>
          ))}
        </div>

        {/* Selected Form Container */}
        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl border border-white/30 text-slate-900">
          {currentTab === "membership" && <MembershipForm invitedBy={activeReferral} />}
          {currentTab === "ambassador" && <CountryAmbassadorForm invitedBy={activeReferral} />}
          {currentTab === "department" && <DepartmentLeaderForm invitedBy={activeReferral} />}
          {currentTab === "executive" && <ExecutiveCouncilForm invitedBy={activeReferral} />}
          {currentTab === "partnership" && <PartnershipForm invitedBy={activeReferral} />}
          {currentTab === "chapter" && <ClubChapterForm invitedBy={activeReferral} />}
          {currentTab === "award" && <AwardForm invitedBy={activeReferral} />}
          {currentTab === "competition" && <CommunityImpactCompetitionForm invitedBy={activeReferral} />}
        </div>
      </div>
    </div>
  );
}

function MembershipForm({ invitedBy }: { invitedBy?: string }) {
  return (
    <>
      <div className="mb-8 border-b pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Track 1: General Continental Pioneer
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-blue-900 mt-2 mb-1">POAF Pioneer Membership Application</h2>
        <p className="text-slate-500 text-sm">Join the continental youth movement as an official student pioneer, project volunteer, or chapter member.</p>
      </div>
      <form action={submitApplicationAction} className="space-y-10">
        <input type="hidden" name="applicationType" value="membership" />
        <input type="hidden" name="invitedBy" value={invitedBy || ""} />
        
        {/* 1. Personal Information */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">1. Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name *</label><input type="text" name="fullName" required placeholder="Full Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Preferred Name</label><input type="text" name="preferredName" placeholder="Preferred Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Date of Birth *</label><input type="date" name="dob" required className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Gender *</label><select name="gender" required className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm bg-white"><option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other / Prefer not to say</option></select></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Country *</label><input type="text" name="country" required placeholder="e.g. Ethiopia, Kenya, Nigeria" className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">City / Region</label><input type="text" name="city" placeholder="City or Region" className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">School / University *</label><input type="text" name="school" required placeholder="School / Campus Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Grade / Year *</label><input type="text" name="grade" required placeholder="e.g. Grade 11, Year 2" className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label><input type="email" name="email" required placeholder="name@domain.com" className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Phone / WhatsApp</label><input type="tel" name="phone" placeholder="+..." className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
          </div>
        </section>

        {/* 2. Profile */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2. Profile & Portrait</h3>
          <div className="space-y-6">
            <PhotoUploadField label="Professional Headshot Photo *" name="headshot" />
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Short Bio *</label><textarea name="bio" required rows={3} placeholder="Brief bio summarizing your background..." className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm"></textarea></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Personal Statement</label><textarea name="personalStatement" rows={3} placeholder="Share your personal philosophy and vision for Africa..." className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm"></textarea></div>
          </div>
        </section>

        {/* 3. Interests & Department */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">3. Department & Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Department of Interest *</label><select name="departmentInterest" required className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm bg-white"><option value="">Select Department</option><option value="Community Outreach & Problem-Solving">Community Outreach & Problem-Solving</option><option value="Technology & Innovation">Technology & Innovation</option><option value="Research & Engineering">Research & Engineering</option><option value="Debate & Communication">Debate & Communication</option><option value="Youth Empowerment & Community Development">Youth Empowerment & Community Development</option><option value="Student Development & Capacity Building">Student Development & Capacity Building</option></select></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Skills & Talents *</label><input type="text" name="skills" required placeholder="e.g. Coding, Debate, Leadership" className="w-full rounded-xl border-slate-300 p-3 border outline-none focus:border-blue-500 text-sm" /></div>
          </div>
        </section>

        {/* 4. Declaration */}
        <section className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
          <h3 className="text-lg font-bold text-blue-950 mb-4 border-b border-blue-200 pb-2">4. Declaration</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="decAccurate" required className="mt-0.5 w-4 h-4 text-blue-600 rounded" />
              <span>I declare all information provided is accurate and authentic. *</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="decValues" required className="mt-0.5 w-4 h-4 text-blue-600 rounded" />
              <span>I agree to POAF's constitutional principles and Code of Conduct. *</span>
            </label>
          </div>
        </section>
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 text-sm">
          Submit Pioneer Membership Application &rarr;
        </button>
      </form>
    </>
  );
}

function CountryAmbassadorForm({ invitedBy }: { invitedBy?: string }) {
  return (
    <>
      <div className="mb-8 border-b pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Track 2: Sovereign Diplomatic Representation
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">National Ambassador Application</h2>
        <p className="text-slate-500 text-sm">Represent POAF as the official diplomatic delegate and national leader for your sovereign African nation or diaspora region.</p>
      </div>

      <form action={submitApplicationAction} className="space-y-8">
        <input type="hidden" name="applicationType" value="ambassador" />
        <input type="hidden" name="invitedBy" value={invitedBy || ""} />

        {/* Personal & Diplomatic Country Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name *</label><input type="text" name="fullName" required placeholder="Full Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Represented Sovereign Nation *</label><input type="text" name="country" required placeholder="e.g. Kenya, Ghana, South Africa, Nigeria" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label><input type="email" name="email" required placeholder="ambassador@domain.com" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Phone / WhatsApp *</label><input type="tel" name="phone" required placeholder="+..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Primary City / Region *</label><input type="text" name="city" required placeholder="City or Administrative Region" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">University / Organization</label><input type="text" name="school" placeholder="Current Institution / Workplace" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">National Mobilization & Diplomatic Strategy *</label><textarea name="bio" required rows={4} placeholder="Describe your vision for establishing secondary school & university chapters, mobilizing youth, and building institutional ties in your country..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Previous Leadership & Community Experience *</label><textarea name="skills" required rows={3} placeholder="Highlight previous leadership roles, student governance, or social impact initiatives..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
        </div>

        <PhotoUploadField label="Official Ambassador Portrait Photo *" name="headshot" />

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 text-sm">
          Submit National Ambassador Application &rarr;
        </button>
      </form>
    </>
  );
}

function DepartmentLeaderForm({ invitedBy }: { invitedBy?: string }) {
  return (
    <>
      <div className="mb-8 border-b pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          Track 3: Operational Department Governance
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">Department Leadership Application</h2>
        <p className="text-slate-500 text-sm">Apply for Head of Department, Manager, Chief Engineer, or Division Secretary portfolios.</p>
      </div>

      <form action={submitApplicationAction} className="space-y-8">
        <input type="hidden" name="applicationType" value="department_leader" />
        <input type="hidden" name="invitedBy" value={invitedBy || ""} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name *</label><input type="text" name="fullName" required placeholder="Full Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Department Portfolio of Choice *</label><select name="departmentInterest" required className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm bg-white"><option value="">Select Department</option><option value="Technology & Innovation">Technology & Innovation</option><option value="Community Outreach & Problem-Solving">Community Outreach & Problem-Solving</option><option value="Research & Engineering">Research & Engineering</option><option value="Debate & Communication">Debate & Communication</option><option value="Youth Empowerment & Community Development">Youth Empowerment & Community Development</option><option value="Student Development & Capacity Building">Student Development & Capacity Building</option></select></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Target Leadership Level *</label><select name="currentRole" required className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm bg-white"><option value="Department Leader">Department Leader (Head)</option><option value="Manager">Department Manager / Coordinator</option><option value="Chief Engineer">Chief Engineer / Technical Lead</option><option value="Secretary">Department Secretary</option></select></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Country of Residence *</label><input type="text" name="country" required placeholder="e.g. Ethiopia, Kenya, Rwanda" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label><input type="email" name="email" required placeholder="leader@domain.com" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Phone / WhatsApp *</label><input type="tel" name="phone" required placeholder="+..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Department Operational Plan & Initiative Vision *</label><textarea name="bio" required rows={4} placeholder="Detail the initiatives, workshops, research projects, or community surveys you will lead in this division..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Technical Skills & Leadership Record *</label><textarea name="skills" required rows={3} placeholder="List relevant engineering, management, debate, or software skills..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
        </div>

        <PhotoUploadField label="Professional Headshot Photo *" name="headshot" />

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 text-sm">
          Submit Department Leadership Application &rarr;
        </button>
      </form>
    </>
  );
}

function ExecutiveCouncilForm({ invitedBy }: { invitedBy?: string }) {
  return (
    <>
      <div className="mb-8 border-b pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Track 4: Executive Council & High Governance
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">Executive Council Application</h2>
        <p className="text-slate-500 text-sm">Apply for Founder, Presidency, Vice-Presidency, and Global Executive Director roles.</p>
      </div>

      <form action={submitApplicationAction} className="space-y-8">
        <input type="hidden" name="applicationType" value="executive" />
        <input type="hidden" name="invitedBy" value={invitedBy || ""} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name *</label><input type="text" name="fullName" required placeholder="Full Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Target Executive Office *</label><select name="currentRole" required className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm bg-white"><option value="Executive Vice President">Executive Vice President</option><option value="Continental Secretary General">Continental Secretary General</option><option value="Executive Director of Strategy">Executive Director of Strategy</option><option value="Executive Director of Expansion">Executive Director of Expansion</option></select></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label><input type="email" name="email" required placeholder="executive@poaf.org" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Country of Citizenship / Residence *</label><input type="text" name="country" required placeholder="e.g. Ethiopia, Ghana, South Africa" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">High-Level Strategic Philosophy & Pan-African Vision *</label><textarea name="bio" required rows={4} placeholder="Outline your governance vision, institutional funding strategies, and continental scaling roadmap for POAF..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Executive Track Record & Board Experience *</label><textarea name="skills" required rows={3} placeholder="Summarize your past organizational management, diplomacy, and executive execution..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
        </div>

        <PhotoUploadField label="Executive Portrait Photo *" name="headshot" />

        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 text-sm">
          Submit Executive Council Application &rarr;
        </button>
      </form>
    </>
  );
}

function ClubChapterForm({ invitedBy }: { invitedBy?: string }) {
  return (
    <>
      <div className="mb-8 border-b pb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-emerald-700 mb-2">Establish a POAF Secondary School / University Chapter</h2>
        <p className="text-slate-500 text-sm">Charter an official student chapter on your campus.</p>
      </div>
      <form action={submitApplicationAction} className="space-y-6">
        <input type="hidden" name="applicationType" value="chapter" />

        <PhotoUploadField label="Charter Lead Photo *" />
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 text-sm">
          Submit Chapter Charter Proposal
        </button>
      </form>
    </>
  );
}

function PartnershipForm({ invitedBy }: { invitedBy?: string }) {
  return (
    <>
      <div className="mb-8 border-b pb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-purple-700 mb-2">POAF Partnership Alliance Application</h2>
        <p className="text-slate-500 text-sm">Partner with POAF to create sustainable continental impact.</p>
      </div>
      <form action={submitApplicationAction} className="space-y-8">
        <input type="hidden" name="applicationType" value="partnership" />
        <input type="hidden" name="invitedBy" value={invitedBy || ""} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Organization Name *</label><input type="text" name="organizationName" required placeholder="e.g. KB's Opportunity Hub" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Organization Type *</label><input type="text" name="organizationType" required placeholder="e.g. NGO, Corporation, University" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Representative Name *</label><input type="text" name="representativeName" required placeholder="Representative Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Official Email *</label><input type="email" name="orgEmail" required placeholder="partner@domain.com" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
        </div>

        <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Proposed Partnership Collaboration Scope *</label><textarea name="whyPartner" required rows={4} placeholder="Outline proposed joint programs, scholarship support, sponsorship, or technological collaboration..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>

        <PhotoUploadField label="Organization Logo *" name="logoPhoto" />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 text-sm">
          Submit Partnership Alliance Request
        </button>
      </form>
    </>
  );
}

function AwardForm({ invitedBy }: { invitedBy?: string }) {
  return (
    <>
      <div className="mb-8 border-b pb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-red-600 mb-2">POAF Honor & Award Application</h2>
        <p className="text-slate-500 text-sm">Apply or nominate a pioneer for continental distinction and awards.</p>
      </div>
      <form action={submitApplicationAction} className="space-y-6">
        <input type="hidden" name="applicationType" value="award" />
        <input type="hidden" name="invitedBy" value={invitedBy || ""} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name *</label><input type="text" name="fullName" required placeholder="Nominee Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Award Category *</label><input type="text" name="awardCategory" required placeholder="e.g. Young Innovator of the Year" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          <div className="md:col-span-2"><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Contact Email / Phone *</label><input type="text" name="contactInfo" required placeholder="contact@domain.com" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
        </div>

        <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Reason for Nomination & Impact Evidence *</label><textarea name="motivation" required rows={4} placeholder="Highlight the specific community impact, research, or leadership that merits this award..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
        
        <PhotoUploadField label="Nominee Portrait *" />
        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 text-sm">
          Submit Award Nomination
        </button>
      </form>
    </>
  );
}

function CommunityImpactCompetitionForm({ invitedBy }: { invitedBy?: string }) {
  return (
    <>
      <div className="mb-8 border-b pb-6">
        <div className="inline-block bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-2">
          POAF Continental Challenge
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-indigo-900 mb-2">POAF Community Impact Competition</h2>
        <p className="text-slate-500 text-sm">Submit your completed or proposed community initiative for evaluation, grant awards, and Impact Verified credentials.</p>
      </div>

      <form action={submitApplicationAction} className="space-y-8">
        <input type="hidden" name="applicationType" value="competition" />
        <input type="hidden" name="invitedBy" value={invitedBy || ""} />
        
        {/* Track Selection */}
        <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-3">1. Competition Track *</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 bg-white p-4 rounded-xl border border-indigo-200 cursor-pointer hover:border-indigo-500 transition">
              <input type="radio" name="competitionTrack" value="COMPLETED" defaultChecked className="mt-1 w-4 h-4 text-indigo-600" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Completed Impact Project</p>
                <p className="text-xs text-slate-500 mt-1">Already implemented project with measured outcomes, evidence, and verified beneficiaries reached.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 bg-white p-4 rounded-xl border border-indigo-200 cursor-pointer hover:border-indigo-500 transition">
              <input type="radio" name="competitionTrack" value="PROPOSED" className="mt-1 w-4 h-4 text-indigo-600" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Proposed Impact Project</p>
                <p className="text-xs text-slate-500 mt-1">Planned project with community problem identified, solution blueprint, budget, and implementation timeline.</p>
              </div>
            </label>
          </div>
        </section>

        {/* Applicant Details */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b pb-2">2. Lead Innovator & Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Lead Applicant Full Name *</label><input type="text" name="fullName" required placeholder="Full Name" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label><input type="email" name="email" required placeholder="name@domain.com" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Country & City *</label><input type="text" name="country" required placeholder="e.g. Kenya, Nairobi" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">School / Community Organization</label><input type="text" name="school" placeholder="Campus / Youth Organization" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Team Members & Portfolios (Optional)</label><input type="text" name="teamMembers" placeholder="e.g. Jane Doe (Tech Lead), John Smith (Field Coordinator)" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
          </div>
        </section>

        {/* Project Description & Impact */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b pb-2">3. Initiative & Measurable Impact</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Project Title *</label><input type="text" name="projectTitle" required placeholder="e.g. Solar Bio-Filtration for Rural Schools" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Primary Category / Department *</label><select name="category" required className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm bg-white"><option value="Community Health & Water">Community Health & Water</option><option value="Technology Literacy & AI">Technology Literacy & AI</option><option value="Renewable Energy & Agriculture">Renewable Energy & Agriculture</option><option value="Youth Leadership & Governance">Youth Leadership & Governance</option><option value="Education & STEM Mentorship">Education & STEM Mentorship</option></select></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Total Beneficiaries Reached / Target *</label><input type="text" name="beneficiaries" required placeholder="e.g. 1,240 students across 3 villages" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Implementation Timeline / Budget</label><input type="text" name="budgetTimeline" placeholder="e.g. 6 months implementation / $1,500 budget" className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm" /></div>
            </div>

            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Community Problem Addressed *</label><textarea name="problem" required rows={3} placeholder="Describe the specific grassroots problem your initiative tackles..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Proposed Solution & Measured Results *</label><textarea name="results" required rows={4} placeholder="Detail how the solution works, innovation aspects, measured outcomes, and long-term sustainability..." className="w-full rounded-xl border-slate-300 p-3 border outline-none text-sm"></textarea></div>
          </div>
        </section>

        {/* Evidence & Photo Upload */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b pb-2">4. Impact Evidence & Media Upload</h3>
          <PhotoUploadField label="Project Photo / Blueprint / Impact Evidence Image *" name="referencePhoto" />
        </section>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 text-sm">
          Submit Community Impact Competition Application
        </button>
      </form>
    </>
  );
}

function PhotoUploadField({ label = "Photo *", name = "referencePhoto" }: { label?: string, name?: string }) {
  return (
    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 border-dashed">
      <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">{label}</label>
      <input 
        type="file" 
        name={name}
        accept="image/*" 
        className="block w-full text-xs text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-xl file:border-0
          file:text-xs file:font-bold
          file:bg-blue-600 file:text-white
          hover:file:bg-blue-700 transition cursor-pointer"
      />
    </div>
  );
}