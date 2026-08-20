import React from "react";

export default function ContactPage() {
 return (
 <div 
 className="min-h-screen flex flex-col bg-cover bg-center relative"
 style={{ backgroundImage: "url('/images/media_1787222939156.jpg')" }}
 >
 <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]"></div>

 {/* Header */}
 <div className="py-24 px-6 text-center relative z-10 text-white animate-[slideIn_1s_ease-out]">
 <div className="inline-block bg-blue-600/30 text-blue-300 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4 border border-blue-400/30">
 Executive Communications
 </div>
 <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Book an Appointment</h1>
 <p className="text-lg text-slate-300 max-w-2xl mx-auto">
 Schedule a direct meeting or dispatch a formal inquiry to the POAF executive leadership team.
 </p>
 </div>

 {/* Form Container */}
 <div className="container mx-auto px-6 pb-20 max-w-3xl relative z-20">
 <div 
 className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

 <form className="space-y-6 relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Your Full Name *</label>
 <input type="text" required placeholder="e.g. Samuel Adewale" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
 </div>
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label>
 <input type="email" required placeholder="samuel@example.com" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Subject / Mandate *</label>
 <input type="text" required placeholder="e.g. Regional Chapter Partnership" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
 </div>
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Country / Region</label>
 <input type="text" placeholder="e.g. Kenya, Ghana, Ethiopia" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Message & Proposed Discussion Topics *</label>
 <textarea required rows={5} className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Provide detailed background regarding your appointment request or institutional proposal..."></textarea>
 </div>

 <div 
 className="p-6 rounded-2xl border border-slate-200 bg-cover bg-center relative overflow-hidden"
 style={{ backgroundImage: "url('/images/media_1787224493193.jpg')" }}
 >
 <div className="absolute inset-0 bg-slate-900/85"></div>
 <div className="relative z-10 text-white">
 <label className="block text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">
 Reference Document / Image Attachment (Optional)
 </label>
 <p className="text-xs text-slate-300 mb-3">
 Attach an agenda brief, institution letter, or project summary.
 </p>
 <input 
 type="file" 
 accept="image/*,.pdf" 
 className="block w-full text-xs text-slate-300
 file:mr-4 file:py-2 file:px-4
 file:rounded-xl file:border-0
 file:text-xs file:font-bold
 file:bg-blue-600 file:text-white
 hover:file:bg-blue-700 transition"
 />
 </div>
 </div>

 <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-sm">
 Dispatch Appointment Request
 </button>
 </form>
 </div>
 </div>
 </div>
 );
}