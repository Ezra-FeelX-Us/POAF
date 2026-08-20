import React from "react";
import Link from "next/link";

export default function AdminLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-serif italic">
 {/* Sidebar Navigation */}
 <aside className="w-full md:w-72 bg-slate-900 text-slate-300 flex-shrink-0 md:min-h-screen flex flex-col shadow-xl">
 <div className="p-6 border-b border-slate-800 flex items-center justify-between">
 <Link href="/admin/dashboard" className="text-xl font-black text-white tracking-widest flex items-center gap-2">
 <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base">P</span>
 POAF ADMIN
 </Link>
 </div>
 <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
 <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Executive Governance</p>
 <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span></span> Dashboard Overview
 </Link>
 <Link href="/admin/executives" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span></span> Founders & Executives
 </Link>
 <Link href="/admin/ambassadors" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span></span> National Ambassadors
 </Link>

 <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-5 mb-2">Operations & Personnel</p>
 <Link href="/admin/members" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span></span> Members & Dept Leaders
 </Link>
 <Link href="/admin/departments" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span>️</span> Manage Departments
 </Link>
 <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span></span> Projects & Proposals
 </Link>
 <Link href="/admin/partners" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span></span> Partner Organizations
 </Link>

 <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-5 mb-2">Submissions & Security</p>
 <Link href="/admin/applications" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span></span> Applications Inbox
 </Link>
 <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-semibold text-sm">
 <span>️</span> Audit & Governance Logs
 </Link>

 <div className="pt-6 border-t border-slate-800 mt-5">
 <Link href="/" className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm flex items-center gap-2 font-bold">
 ← View Public Website
 </Link>
 </div>
 </nav>
 </aside>

 {/* Main Admin Content */}
 <main 
 className="flex-1 flex flex-col min-w-0 bg-cover bg-fixed bg-center relative"
 style={{ backgroundImage: "url('/images/media_1787224493193.jpg')" }}
 >
 <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-sm pointer-events-none"></div>
 {/* Admin Topbar */}
 <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
 <div className="flex items-center gap-3">
 <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
 <h2 className="font-bold text-slate-800 text-sm">POAF Global Executive Governance</h2>
 </div>
 <div className="flex items-center gap-4">
 <div className="text-xs text-right">
 <p className="font-bold text-slate-800">Executive Administrator</p>
 <p className="text-slate-400">Super Admin Access</p>
 </div>
 <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md">
 A
 </div>
 </div>
 </header>
 
 {/* Page Content */}
 <div className="p-6 md:p-8 flex-1 overflow-auto max-w-7xl w-full mx-auto relative z-10">
 {children}
 </div>
 </main>
 </div>
 );
}