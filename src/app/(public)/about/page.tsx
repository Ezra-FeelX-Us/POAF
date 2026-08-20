"use client";

import React, { useState } from "react";

export default function AboutPage() {
 const [isExpanded, setIsExpanded] = useState(false);

 return (
 <div className="min-h-screen bg-slate-50">
 {/* Header */}
 <div 
 className="py-24 px-6 text-center bg-cover bg-center relative"
 style={{ backgroundImage: "url('/images/media_1787222862970.jpg')" }}
 >
 <div className="absolute inset-0 bg-blue-900/85"></div>
 <div className="relative z-10 text-white animate-[slideIn_1s_ease-out]">
 <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About POAF</h1>
 <p className="text-lg text-blue-100 max-w-2xl mx-auto">
 The history, mission, and foundational pillars of Pioneers of Africa's Future.
 </p>
 </div>
 </div>

 <div className="container mx-auto px-6 py-16 max-w-5xl">
 
 {/* The Story Section */}
 <section className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 mb-16 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none -mt-20 -mr-20"></div>
 <h2 className="text-3xl font-extrabold text-slate-900 mb-6 relative z-10">Our Origin Story</h2>
 
 <div className="text-slate-700 leading-relaxed space-y-6 relative z-10">
 <p>
 The story of Pioneers of Africa's Future (POAF) began not in a boardroom or a grand hall, but in the quiet halls of Higa Model Boarding School in Durame, Ethiopia. In 2024, a student named Ezra Michael Jofe looked around his community and saw a continent brimming with potential yet held back by seemingly unsolvable problems: dirty water, lack of electricity, students without leadership skills, and a digital divide that left millions behind. But every time Ezra raised his hand to speak, to share an idea, to propose a solution, he was met with silence. Adults told him he was too young. Peers said he was dreaming too big. This specific pain of being ignored became the fuel for a movement. Instead of giving up, Ezra sat down with a simple notebook and began to brainstorm an organisation run entirely by young people, where every member's voice would matter. He called it "Pioneers of Africa's Future" because pioneers are the first – the ones who go ahead and clear the path for others to follow.
 </p>
 
 {!isExpanded && (
 <button 
 onClick={() => setIsExpanded(true)}
 className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
 >
 Show more...
 </button>
 )}

 {isExpanded && (
 <div className="space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
 <p>
 The idea was too powerful to keep to himself. Ezra shared his vision with his closest friend, Yshurun Tekle, who immediately understood its magnitude. Together, they began to organise. Their first step was to recruit a small group of like-minded students from their own school, holding meetings under a large tree on the school grounds. Their first project was a simple water and sanitation survey in a nearby village, conducted with paper forms and a borrowed camera. The results were shocking: over eighty percent of households had no proper latrine. This data became the foundation of POAF’s first intervention: a small distribution of soap and sanitary kits, paid for by the members' own pocket money. It was a tiny step, but it proved that students could do real research and take real action. Word of their success spread to neighbouring schools, and soon POAF had grown beyond a single campus, becoming a recognised student organisation at the Ethiopia level.
 </p>
 <p>
 By late 2024, the founders had created a simple online portal, introduced digital ID cards, and written a formal constitution that defined the six departments and a code of conduct. But they knew that to truly make an impact, POAF needed to become continental. The year 2025 was a turning point. Ezra and Yshurun began reaching out to students in other African countries through social media – Instagram, WhatsApp, and Telegram. Slowly, the first international members joined from Nigeria, Kenya, Ghana, Egypt, and Zimbabwe. The Debate and Communication department organised its first virtual debate on intra‑African trade, attracting over five hundred viewers. The Technology department ran its first coding bootcamp, using free online materials and offline exercises for students with poor internet. The ambassador programme was launched, appointing country representatives to recruit new members and organise local events.
 </p>
 <p>
 By early 2026, POAF had officially become a pan‑African organisation. Over five hundred members were registered across twenty‑three regions. The six departments became fully operational, each with a volunteer department head and regular online meetings. The portal was upgraded with a project submission system, and small grants of up to fifty dollars were made available for the most promising student-led solutions. The monthly honours system was introduced to recognise outstanding members, creating a culture of celebration and achievement. Despite the rapid growth, the founders never forgot their roots. Both remained students at Higa Model Boarding School, balancing their studies with the demands of leading a growing organisation. They learned to delegate, to trust their department heads, and to see every setback not as a failure, but as a lesson.
 </p>
 <p>
 Today, POAF stands as living proof that even the smallest voice, when joined with others, can move a continent. The founders now have two big dreams for the future. First, within the next two years, they want to take POAF international – inviting young people from Asia, Europe, and the Americas to join as associate members. Second, within five years, they plan to organise the first in‑person Continental Assembly – a week‑long gathering where POAF members from all fifty‑four African nations can finally meet face to face. This history – from a single notebook under a tree in Durame to a pan‑African movement of over five hundred members – is the heart of POAF. It shows that no voice is too small, no idea is too humble, and no student is too young to start changing the world. The founders invite every young African to join them in writing the next chapter.
 </p>
 <button 
 onClick={() => setIsExpanded(false)}
 className="text-blue-600 font-bold hover:text-blue-800 transition-colors mt-4 block"
 >
 Show less...
 </button>
 </div>
 )}
 </div>
 </section>

 {/* The Six Departments Section */}
 <section>
 <h2 className="text-3xl font-extrabold text-slate-900 mb-10 text-center">The Six Departments</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 
 <DeptCard 
 title="Community Outreach & Problem‑Solving"
 bg="/images/media_1787224493193.jpg"
 desc="Water, sanitation, health – village surveys, sanitary kits, low‑cost filtration."
 bullets={["Village audit teams", "Educational kit distribution", "Non‑profit partnerships"]}
 />
 
 <DeptCard 
 title="Debate & Communication"
 bg="/images/media_1787223618684.jpg"
 desc="Pan‑African voices, monthly bulletin, translation channels, debates."
 bullets={["Pan‑African debate forums", "Newsletter in 3 languages", "Cross‑border communication"]}
 />
 
 <DeptCard 
 title="Student Development & Capacity Building"
 bg="/images/media_1787224603096.png"
 desc="Leadership masterclasses, mental health peer support, skill labs."
 bullets={["Executive Governance Masterclass", "Mental health check‑ins", "Professional skill labs"]}
 />
 
 <DeptCard 
 title="Youth Empowerment & Community Development"
 bg="/images/media_1787223704562.jpg"
 desc="Mock parliaments, high school chapters, ambassador network."
 bullets={["Student parliamentary panels", "High school leadership chapters", "National ambassador promotion"]}
 />
 
 <DeptCard 
 title="Research & Engineering"
 bg="/images/media_1787223395009.png"
 desc="CAD blueprints, academic whitepapers, low‑cost prototypes."
 bullets={["Solar water pump diagrams", "Academic whitepapers", "University lab collaborations"]}
 />
 
 <DeptCard 
 title="Technology & Innovation"
 bg="/images/media_1787223249571.jpg"
 desc="Coding bootcamps, offline data caching, digital tools."
 bullets={["Offline coding bootcamps", "Web portal templates", "Cross‑campus programming groups"]}
 />
 
 </div>
 </section>

 </div>
 </div>
 );
}

function DeptCard({ title, desc, bullets, bg }: { title: string, desc: string, bullets: string[], bg: string }) {
 return (
 <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full">
 <div 
 className="h-40 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
 style={{ backgroundImage: `url('${bg}')` }}
 ></div>
 <div className="p-8 relative bg-white flex-1 flex flex-col">
 <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
 <p className="text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100 flex-1">{desc}</p>
 <ul className="space-y-3">
 {bullets.map((b, i) => (
 <li key={i} className="flex items-start gap-3">
 <span className="text-blue-500 mt-1"></span>
 <span className="text-sm font-semibold text-slate-700">{b}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 );
}
