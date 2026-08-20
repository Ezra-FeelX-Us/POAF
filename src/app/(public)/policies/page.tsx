import React from "react";
import Link from "next/link";

export default function PoliciesPage() {
 const policies = [
 {
 number: "01",
 title: "Application Accuracy & Truthfulness",
 icon: "",
 rules: [
 "Applicants must provide truthful, authentic, and verifiable personal and academic information.",
 "All required application fields and documentation must be submitted completely.",
 "Submission of forged documents or false identities results in immediate permanent blacklisting.",
 "Applicants may request corrections or update pending submissions prior to final executive decision."
 ]
 },
 {
 number: "02",
 title: "Administrative Accuracy & Auditability",
 icon: "️",
 rules: [
 "Every administrative action, decision, role change, and status progression is immutably logged in the audit trail.",
 "Application acceptance or rejection decisions must include explicit formal reasoning and feedback.",
 "Permanent deletion of historical data requires multi-step executive confirmation.",
 "High-privilege alterations generate instant audit entries detailing initiator, timestamp, and delta values."
 ]
 },
 {
 number: "03",
 title: "Role-Based Access & Permissions",
 icon: "️",
 rules: [
 "Strict adherence to the 6-tier permission hierarchy: Super Admin → Admin → Dept Leader → Project Manager → Team Leader → Member.",
 "Department leaders possess authority strictly over their assigned division portfolios.",
 "Members and applicants are strictly prohibited from reviewing or approving their own submissions.",
 "Administrative credentials require two-factor authentication and active session monitoring."
 ]
 },
 {
 number: "04",
 title: "Content & Code of Conduct",
 icon: "",
 rules: [
 "Zero tolerance for harassment, discrimination, hate speech, threats, spam, or unlawful material.",
 "All project proposals, whitepapers, and debates must align with POAF's pan-African developmental mission.",
 "Uploaded intellectual property must belong to the applicant or possess verified authorization for publication."
 ]
 },
 {
 number: "05",
 title: "Photo, Media & Digital Assets",
 icon: "",
 rules: [
 "Explicit consent and authorization are mandatory before uploading portraits or representations of third parties.",
 "Approved portrait assets are displayed across public rosters in strict accordance with the POAF media consent agreement.",
 "Executive administration reserves the immediate right to remove non-compliant or inappropriate media."
 ]
 },
 {
 number: "06",
 title: "Project Precision & Milestone Verification",
 icon: "",
 rules: [
 "Reported project metrics and completion percentages must be backed by documented milestone outputs.",
 "Completed status requires a formal close-out report approved by the supervising Department Leader.",
 "Falsification of task completion or project progress results in immediate leadership revocation."
 ]
 },
 {
 number: "07",
 title: "Data Privacy & Protection",
 icon: "",
 rules: [
 "Personal contact information, passwords, and identity documents are private and encrypted by default.",
 "Only executive-approved public profile data (name, role, country, department) is displayed publicly.",
 "Members retain the right to inspect and request rectification of their registry records at any time."
 ]
 },
 {
 number: "08",
 title: "Application Decisions & Lifecycle",
 icon: "",
 rules: [
 "Applications follow the structured lifecycle: Submitted → Under Review → Revision Required → Accepted / Rejected.",
 "Applications marked 'Revision Required' allow the applicant to update and resubmit without creating duplicate records.",
 "Accepted applicants are auto-provisioned into the central database with permanent POAF identification codes."
 ]
 },
 {
 number: "09",
 title: "Institutional Transparency",
 icon: "",
 rules: [
 "Every organizational transformation follows the transparent trace: Who → What → When → Previous Value → New Value.",
 "Public impact counters and department metrics are directly driven by validated database records.",
 "Continental partners and chapter bodies operate under open accountability standards."
 ]
 },
 {
 number: "10",
 title: "Policy Versioning & Evolution",
 icon: "",
 rules: [
 "All active policy frameworks (Membership, Leadership, Conduct, Privacy, Projects, Partnerships) are formally versioned.",
 "Members receive digital notices regarding constitutional amendments and are required to acknowledge updates.",
 "The current effective policy standard is published globally with clear date-stamps and revisions."
 ]
 }
 ];

 return (
 <div 
 className="min-h-screen bg-cover bg-fixed bg-center relative py-20 px-6"
 style={{ backgroundImage: "url('/images/media_1787224603096.png')" }}
 >
 <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
 <div className="container mx-auto max-w-5xl relative z-10">
 {/* Header */}
 <div className="text-center mb-16">
 <div className="inline-block bg-blue-100 text-blue-800 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4">
 Official Governance Framework
 </div>
 <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
 POAF Policies & Accuracy Standards
 </h1>
 <p className="text-slate-600 max-w-2xl mx-auto text-base">
 The 10 constitutional pillars governing integrity, security, role hierarchy, and accountability across Pioneers of Africa's Future.
 </p>
 <div className="mt-4 text-xs font-mono text-slate-400">
 Current Version: v2.4 • Effective Date: August 2026 • Published by POAF High Executive Council
 </div>
 </div>

 {/* Policy Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {policies.map((p) => (
 <div key={p.number} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
 <div>
 <div className="flex justify-between items-center mb-6">
 <span className="text-3xl">{p.icon}</span>
 <span className="text-xs font-black text-slate-300 font-mono tracking-widest">PILLAR {p.number}</span>
 </div>
 <h3 className="text-xl font-bold text-slate-900 mb-4">{p.title}</h3>
 <ul className="space-y-3">
 {p.rules.map((rule, idx) => (
 <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
 <span className="text-blue-500 font-bold mt-0.5">•</span>
 <span>{rule}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 ))}
 </div>

 {/* Footnote */}
 <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
 <h3 className="text-2xl font-bold mb-3">Commitment to Continental Excellence</h3>
 <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed mb-6">
 Pioneers of Africa's Future holds every member, executive, and partner to the highest ethical and professional standards as we build Africa's future.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link href="/apply/membership" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition">
 Apply for Membership
 </Link>
 <Link href="/verify" className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20 transition">
 Verify Official Credentials
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}