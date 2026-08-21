import React from "react";
import Link from "next/link";
import { submitApplicationAction } from "@/actions/applications";

export const dynamic = "force-dynamic";

export default async function UnifiedApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; success?: string }>;
}) {
  const { tab, success } = await searchParams;
  const currentTab = (tab || "executive").toLowerCase();

  const tabs = [
    { id: "executive", label: "Executive Council", badge: "Governance" },
    { id: "partnership", label: "Strategic Partnership", badge: "Institutions" },
    { id: "chapter", label: "School Club Chapter", badge: "Campus" },
    { id: "ambassador", label: "Country Ambassador", badge: "Diplomacy" }
  ];

  const countries = [
    "Ethiopia", "Kenya", "Rwanda", "Nigeria", "Ghana", "South Africa", 
    "Tanzania", "Uganda", "Egypt", "Morocco", "Senegal", "Zambia", 
    "Zimbabwe", "Cameroon", "Cote d'Ivoire", "Other Sovereign AU State"
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 relative">
      {/* Header Banner */}
      <div 
        className="py-16 md:py-20 px-6 text-center bg-cover bg-center relative z-10"
        style={{ backgroundImage: "url('/images/media_1787224434429.jpg')" }} 
      >
        <div className="absolute inset-0 bg-blue-950/90"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto space-y-3">
          <div className="inline-block bg-blue-500/30 text-blue-300 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest border border-blue-400/30">
            Official POAF Institutional Intake
          </div>
          <h1 className="text-3xl md:text-5xl font-black">Applications & Alliances Hub</h1>
          <p className="text-xs sm:text-sm md:text-base text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Apply to join the Executive Council, establish an accredited institutional partnership, charter a school club chapter, or serve as a Sovereign Country Ambassador.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-24 max-w-4xl relative z-20 -mt-10 space-y-8">
        
        {/* Membership Callout Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-700/60 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
              Pioneer Membership Intake
            </span>
            <h3 className="text-lg font-black text-white mt-1">Looking to join as a Student Member?</h3>
            <p className="text-xs text-blue-200">
              Register directly into one of our 6 continental departments to receive your POAF ID and access the classroom.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg transition whitespace-nowrap"
          >
            Register as Member &rarr;
          </Link>
        </div>

        {success === "submitted" && (
          <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-5 rounded-2xl text-xs font-bold text-center space-y-1">
            <p className="text-sm">✓ Application Received Successfully!</p>
            <p className="text-emerald-400 font-normal">
              Your submission has been securely routed to the POAF Executive Council and Super Admin. You will receive an official response shortly.
            </p>
          </div>
        )}

        {/* Tab Selector */}
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={`/apply?tab=${t.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentTab === t.id
                  ? "bg-blue-600 text-white shadow-lg scale-[1.02]"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{t.label}</span>
              <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded uppercase">{t.badge}</span>
            </Link>
          ))}
        </div>

        {/* Application Forms Container */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-2xl text-white">
          {currentTab === "executive" && (
            <ShortApplicationForm 
              type="EXECUTIVE"
              title="Executive Council Application"
              subtitle="Join the continental leadership council guiding strategic alliances, governance, and organizational impact."
              countries={countries}
            />
          )}

          {currentTab === "partnership" && (
            <PartnershipShortForm countries={countries} />
          )}

          {currentTab === "chapter" && (
            <ShortApplicationForm 
              type="CHAPTER"
              title="School / University Club Chapter Charter"
              subtitle="Establish and lead an accredited POAF Student Club Chapter at your high school or university."
              countries={countries}
            />
          )}

          {currentTab === "ambassador" && (
            <ShortApplicationForm 
              type="AMBASSADOR"
              title="National Sovereign Ambassador Application"
              subtitle="Represent POAF as the official diplomatic ambassador for your sovereign African nation."
              countries={countries}
            />
          )}
        </div>

      </div>
    </div>
  );
}

function ShortApplicationForm({ 
  type, 
  title, 
  subtitle,
  countries 
}: { 
  type: string; 
  title: string; 
  subtitle: string;
  countries: string[];
}) {
  return (
    <form action={submitApplicationAction} className="space-y-6">
      <input type="hidden" name="applicationType" value={type} />
      
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white">{title}</h2>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Full Name *</label>
          <input type="text" name="fullName" required placeholder="Pioneer Name" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Email Address *</label>
          <input type="email" name="email" required placeholder="pioneer@example.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">WhatsApp / Phone *</label>
          <input type="text" name="phone" required placeholder="+251 900 000000" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Age *</label>
          <input type="number" name="age" required min={14} max={35} placeholder="21" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Sovereign Country *</label>
          <select name="country" required defaultValue="Ethiopia" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500">
            {countries.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Photo / Avatar URL</label>
          <input type="text" name="photoUrl" placeholder="Image URL (optional)" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Brief Statement & Vision *</label>
        <textarea name="statement" rows={3} required placeholder="Why are you applying for this position and how will you advance Africa's future?" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
      </div>

      <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
        Submit to Super Admin &rarr;
      </button>
    </form>
  );
}

function PartnershipShortForm({ countries }: { countries: string[] }) {
  return (
    <form action={submitApplicationAction} className="space-y-6">
      <input type="hidden" name="applicationType" value="PARTNERSHIP" />
      
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white">Strategic Partnership Application</h2>
        <p className="text-xs text-slate-400 mt-1">For universities, NGOs, corporations, accelerators, and foundations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Organization / Institution Name *</label>
          <input type="text" name="orgName" required placeholder="Organization Name" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Representative Name *</label>
          <input type="text" name="repName" required placeholder="Full Name" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Official Email *</label>
          <input type="email" name="email" required placeholder="contact@organization.org" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Website / Portal</label>
          <input type="text" name="website" placeholder="https://..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Country Headquarters *</label>
          <select name="country" required defaultValue="Ethiopia" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500">
            {countries.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Organization Logo URL</label>
          <input type="text" name="logoUrl" placeholder="Logo image link (optional)" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Collaboration Scope & Objectives *</label>
        <textarea name="collaborationScope" rows={3} required placeholder="Describe proposed co-funding, joint workshops, tech hackathons, or fellowship programs..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
      </div>

      <button type="submit" className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition">
        Submit Partnership Request &rarr;
      </button>
    </form>
  );
}