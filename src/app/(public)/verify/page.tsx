import React from "react";
import prisma from "@/lib/prisma";

export default async function VerifyPage({
 searchParams,
}: {
 searchParams: Promise<{ id?: string }>;
}) {
 const { id } = await searchParams;
 const query = id ? id.trim() : "";

 let member = null;
 let application = null;

 if (query) {
 member = await prisma.member.findFirst({
 where: {
 OR: [
 { poafId: { equals: query } },
 { id: query },
 { firstName: { contains: query } },
 { lastName: { contains: query } }
 ],
 deletedAt: null
 },
 include: {
 department: true,
 country: true
 }
 });

 if (!member) {
 application = await prisma.application.findFirst({
 where: {
 OR: [
 { poafId: { equals: query } },
 { id: query }
 ],
 deletedAt: null
 }
 });
 }
 }

 return (
 <div 
 className="min-h-screen bg-cover bg-fixed bg-center relative py-16 px-6"
 style={{ backgroundImage: "url('/images/media_1787223427061.png')" }}
 >
 <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
 <div className="container mx-auto max-w-3xl relative z-10">
 <div className="text-center mb-10">
 <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-lg">
 P|AF
 </div>
 <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">POAF Official Verification Registry</h1>
 <p className="text-slate-600 mt-2 text-sm">
 Verify official credentials, member status, leadership portfolios, and digital badges issued by Pioneers of Africa's Future.
 </p>
 </div>

 {/* Search Bar */}
 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
 <form method="GET" action="/verify" className="flex flex-col sm:flex-row gap-3">
 <input 
 type="text" 
 name="id" 
 defaultValue={query} 
 placeholder="Enter POAF ID (e.g. POAF-LDR-0001, POAF-MEM-0001) or Full Name..."
 className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
 required
 />
 <button 
 type="submit" 
 className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
 >
 Verify Credential
 </button>
 </form>
 <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
 <span>Try searching:</span>
 <a href="/verify?id=POAF-LDR-0001" className="text-blue-600 hover:underline">POAF-LDR-0001</a>
 <span>•</span>
 <a href="/verify?id=Ezra Michael" className="text-blue-600 hover:underline">Ezra Michael</a>
 <span>•</span>
 <a href="/verify?id=Ali Omari" className="text-blue-600 hover:underline">Ali Omari</a>
 </div>
 </div>

 {/* Results */}
 {query && (
 <div>
 {member ? (
 <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden relative animate-[fadeIn_0.5s_ease-out]">
 {/* Verified Header */}
 <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex justify-between items-center">
 <div className="flex items-center gap-3">
 <span className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black text-lg"></span>
 <div>
 <h3 className="font-bold text-lg">Official POAF Verified Credential</h3>
 <p className="text-xs text-emerald-100">Authenticated on Global Registry</p>
 </div>
 </div>
 <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider">
 ACTIVE
 </span>
 </div>

 {/* Profile Details */}
 <div className="p-8">
 <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100">
 <div 
 className="w-28 h-28 rounded-2xl bg-cover bg-center border-4 border-slate-100 shadow-md flex-shrink-0"
 style={{ backgroundImage: `url('${member.photoUrl || "/images/media_1787222340022.png"}')` }}
 ></div>
 <div className="text-center sm:text-left flex-1">
 <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-1">
 <h2 className="text-2xl font-black text-slate-900">{member.firstName} {member.lastName}</h2>
 {member.isLeader && (
 <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
 LEADER
 </span>
 )}
 </div>
 <p className="text-blue-600 font-bold text-sm mb-3">
 {member.leaderPosition || member.role}
 </p>
 <div className="inline-block bg-slate-100 font-mono text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200">
 ID: {member.poafId || "POAF-MEM-VERIFIED"}
 </div>
 </div>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
 <p className="font-bold text-slate-800 text-sm">{member.department?.name || "General Assembly"}</p>
 </div>
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Country</p>
 <p className="font-bold text-slate-800 text-sm">{member.country?.name || "Continental"}</p>
 </div>
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Joined Date</p>
 <p className="font-bold text-slate-800 text-sm">{new Date(member.joinedDate).toLocaleDateString()}</p>
 </div>
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
 <p className="font-bold text-emerald-600 text-sm">{member.status}</p>
 </div>
 </div>

 {member.bio && (
 <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mandate / Bio</p>
 <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
 </div>
 )}
 </div>
 </div>
 ) : application ? (
 <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8 text-center">
 <span className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">⏳</span>
 <h3 className="text-xl font-bold text-slate-900 mb-1">Application Under Processing</h3>
 <p className="text-xs font-mono text-slate-400 mb-4">Application ID: {application.poafId}</p>
 <div className="inline-block bg-blue-50 text-blue-800 px-4 py-2 rounded-xl text-sm font-bold border border-blue-200">
 Status: {application.status.replace("_", " ")}
 </div>
 <p className="text-xs text-slate-500 mt-4 max-w-md mx-auto">
 This application has been registered in the POAF intake queue and is currently undergoing credential verification.
 </p>
 </div>
 ) : (
 <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
 <span className="text-4xl mb-3 block"></span>
 <h3 className="text-xl font-bold text-slate-900 mb-2">No Record Found</h3>
 <p className="text-slate-500 text-sm max-w-md mx-auto">
 No matching POAF credential was found for "<strong className="text-slate-800">{query}</strong>". Please verify the ID format or spelling.
 </p>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 );
}