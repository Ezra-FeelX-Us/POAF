import React from "react";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";

export default function PublicLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-serif italic">
 {/* Global Navbar */}
 <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
 <div className="container mx-auto px-6 py-4 flex justify-between items-center">
 <Link href="/" className="text-2xl font-black tracking-widest text-blue-400 flex items-center gap-2">
 <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base">P</span>
 P|AF
 </Link>
 
 <MobileMenu />

      <div className="hidden lg:flex gap-5 font-semibold text-xs xl:text-sm items-center">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <Link href="/about" className="hover:text-blue-400 transition-colors">About</Link>
        <Link href="/members" className="hover:text-blue-400 transition-colors">Members</Link>
        <Link href="/leadership" className="hover:text-blue-400 transition-colors">Leadership</Link>
        <Link href="/nations" className="hover:text-blue-400 transition-colors">Nations</Link>
        <Link href="/grades" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Grade Board</Link>
        <Link href="/departments" className="hover:text-blue-400 transition-colors">Departments</Link>
        <Link href="/partners" className="hover:text-blue-400 transition-colors">Partners</Link>
        <Link href="/projects" className="hover:text-blue-400 transition-colors">Projects</Link>
        <Link href="/verify" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
          Verify ID
        </Link>
      </div>
      <div className="hidden lg:flex gap-2 items-center">
        <Link href="/portal/member" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl text-xs font-bold transition border border-slate-700">
          Member Portal
        </Link>
        <Link href="/apply" className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md">
          Apply Now
        </Link>
        <Link href="/admin/dashboard" className="px-3 py-1.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors text-xs font-bold border border-slate-700 text-slate-300">
          Admin
        </Link>
      </div>
 </div>
 </nav>

 {/* Main Content */}
 <main className="flex-1">
 {children}
 </main>

 {/* Footer */}
 <footer className="border-t border-slate-800 bg-slate-900 text-white py-16 mt-16">
 <div className="container mx-auto px-6 max-w-7xl">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
 <div>
 <div className="flex items-center gap-2 mb-4">
 <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base font-black">P</span>
 <span className="text-xl font-black tracking-widest text-white">POAF</span>
 </div>
 <p className="text-slate-400 text-xs leading-relaxed mb-4">
 Pioneers of Africa's Future is a youth-led movement empowering students and leaders to solve real problems and build Africa's future.
 </p>
 <p className="text-xs font-mono text-slate-500">Established 2024 • Pan-African Registry</p>
 </div>

 <div>
 <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Quick Links</h4>
 <ul className="space-y-2.5 text-xs text-slate-400">
 <li><Link href="/" className="hover:text-white transition">Home</Link></li>
 <li><Link href="/about" className="hover:text-white transition">About Our Movement</Link></li>
 <li><Link href="/members" className="hover:text-white transition">Members Board</Link></li>
 <li><Link href="/leadership" className="hover:text-white transition">Leadership Board</Link></li>
 <li><Link href="/departments" className="hover:text-white transition">Departments & Leaders</Link></li>
 <li><Link href="/projects" className="hover:text-white transition">Projects & Whitepapers</Link></li>
 <li><Link href="/competition" className="text-amber-400 hover:text-amber-300 font-bold transition">Community Impact Competition</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Application Portals</h4>
 <ul className="space-y-2.5 text-xs text-slate-400">
 <li><Link href="/apply?tab=membership" className="hover:text-white transition">Membership Application</Link></li>
 <li><Link href="/apply?tab=leadership" className="hover:text-white transition">Leadership Application</Link></li>
 <li><Link href="/apply?tab=proposal" className="hover:text-white transition">Club Chapter / Proposal</Link></li>
 <li><Link href="/apply?tab=partnership" className="hover:text-white transition">Partnership Application</Link></li>
 <li><Link href="/apply?tab=award" className="hover:text-white transition">Honor & Award Application</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Trust & Governance</h4>
 <ul className="space-y-2.5 text-xs text-slate-400">
 <li><Link href="/verify" className="hover:text-emerald-400 text-emerald-300 font-bold transition flex items-center gap-1"><span></span> Verify Member ID / Credential</Link></li>
 <li><Link href="/policies" className="hover:text-white transition">10 Pillars Policy & Governance</Link></li>
 <li><Link href="/admin/dashboard" className="hover:text-white transition">Executive Portal</Link></li>
 <li><Link href="/contact" className="hover:text-white transition">Contact & Appointments</Link></li>
 </ul>
 </div>
 </div>

 <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
 <p>© {new Date().getFullYear()} Pioneers of Africa's Future (POAF). All rights reserved.</p>
 <p className="font-mono text-[11px]">Building Leaders • Solving Problems • Creating Africa's Future</p>
 </div>
 </div>
 </footer>
 </div>
 );
}