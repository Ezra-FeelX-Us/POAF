import React from "react";
import prisma from "@/lib/prisma";
import { addMember, updateMember, deleteMember } from "@/actions/members";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminAmbassadorsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;

  let countries: any[] = [];
  let departments: any[] = [];
  let dbAmbassadors: any[] = [];

  try {
    const results = await Promise.all([
      prisma.country.findMany({ orderBy: { name: "asc" } }),
      prisma.department.findMany({ orderBy: { name: "asc" } }),
      prisma.member.findMany({
        where: {
          OR: [
            { role: { contains: "Ambassador" } },
            { leaderPosition: { contains: "Ambassador" } }
          ],
          deletedAt: null
        },
        include: { country: true, department: true },
        orderBy: { leaderOrder: "asc" }
      })
    ]);
    countries = results[0];
    departments = results[1];
    dbAmbassadors = results[2];
  } catch (err) {
    console.warn("Admin ambassadors fetch fallback:", err);
  }

  const defaultAmbassadors = [
    { id: "amb-1", firstName: "Ali Omari", lastName: "Washikala", role: "Ambassador of Kenya", leaderPosition: "Ambassador of Kenya", country: "Kenya", photoUrl: "/images/amb-kenya.png", leaderOrder: 1 },
    { id: "amb-2", firstName: "Kofi", lastName: "Mensah", role: "Ambassador of Ghana", leaderPosition: "Ambassador of Ghana", country: "Ghana", photoUrl: "/images/amb-ghana.png", leaderOrder: 2 },
    { id: "amb-3", firstName: "Caleb-John", lastName: "Dismas", role: "Ambassador of Tanzania", leaderPosition: "Ambassador of Tanzania", country: "Tanzania", photoUrl: "/images/amb-tanzania.png", leaderOrder: 3 },
    { id: "amb-4", firstName: "Lerato", lastName: "Mthembu", role: "Ambassador of South Africa", leaderPosition: "Ambassador of South Africa", country: "South Africa", photoUrl: "/images/amb-southafrica.png", leaderOrder: 4 },
    { id: "amb-5", firstName: "Chinedu", lastName: "Okafor", role: "Ambassador of Nigeria", leaderPosition: "Ambassador of Nigeria", country: "Nigeria", photoUrl: "/images/amb-nigeria.png", leaderOrder: 5 },
    { id: "amb-6", firstName: "Ahmed", lastName: "Abdellateif", role: "Ambassador of Egypt", leaderPosition: "Ambassador of Egypt", country: "Egypt", photoUrl: "/images/amb-egypt.png", leaderOrder: 6 },
    { id: "amb-7", firstName: "Salma", lastName: "El Idrissi", role: "Morocco Ambassador", leaderPosition: "Morocco Ambassador", country: "Morocco", photoUrl: "/images/amb-morocco-salma.png", leaderOrder: 7 },
    { id: "amb-8", firstName: "Lina", lastName: "Bennani", role: "Morocco Ambassador", leaderPosition: "Morocco Ambassador", country: "Morocco", photoUrl: "/images/amb-morocco-lina.png", leaderOrder: 8 }
  ];

  const editingAmb = edit ? (dbAmbassadors.find(a => a.id === edit) || defaultAmbassadors.find(a => a.id === edit)) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">National Ambassadors Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all country representatives, ambassador portfolios, and diplomatic credentials.</p>
        </div>
        <div className="bg-blue-50 text-blue-800 font-bold px-4 py-2 rounded-xl text-sm border border-blue-200">
          Total Ambassadors: {dbAmbassadors.length > 0 ? dbAmbassadors.length : defaultAmbassadors.length}
        </div>
      </div>

      {/* Ambassador Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {editingAmb ? `Edit Ambassador: ${editingAmb.firstName} ${editingAmb.lastName}` : "Appoint / Add New National Ambassador"}
        </h2>
        <form action={editingAmb && !editingAmb.id.startsWith("amb-") ? updateMember : addMember} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editingAmb && !editingAmb.id.startsWith("amb-") && <input type="hidden" name="id" value={editingAmb.id} />}
          <input type="hidden" name="isLeader" value="on" />
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">First Name</label>
            <input 
              type="text" 
              name="firstName" 
              defaultValue={editingAmb?.firstName || ""} 
              required 
              placeholder="e.g. Ali Omari"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              defaultValue={editingAmb?.lastName || ""} 
              required 
              placeholder="e.g. Washikala"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Ambassador Title / Role</label>
            <input 
              type="text" 
              name="leaderPosition" 
              defaultValue={editingAmb?.leaderPosition || editingAmb?.role || ""} 
              required 
              placeholder="e.g. Ambassador of Kenya"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
            <input type="hidden" name="role" value={editingAmb?.role || "National Ambassador"} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Country</label>
            <select 
              name="countryId" 
              defaultValue={editingAmb && 'countryId' in editingAmb ? editingAmb.countryId : (countries[0]?.id || "")} 
              required 
              className="w-full rounded-xl border border-slate-300 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Display Order</label>
            <input 
              type="number" 
              name="leaderOrder" 
              defaultValue={editingAmb?.leaderOrder || 1} 
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Portrait Photo URL</label>
            <input 
              type="text" 
              name="photoUrl" 
              defaultValue={editingAmb?.photoUrl || ""} 
              placeholder="/images/amb-kenya.png"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>

          <div className="md:col-span-3 flex gap-4 mt-2">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
            >
              {editingAmb ? "Save Ambassador Changes" : "Save & Publish Ambassador"}
            </button>
            {editingAmb && (
              <Link 
                href="/admin/ambassadors" 
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Cancel Edit
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Ambassadors Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900">National Ambassadors Roster</h3>
          <span className="text-xs text-slate-500">Live on Public Homepage</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Ambassador</th>
                <th className="p-4">Portfolio / Title</th>
                <th className="p-4">Country</th>
                <th className="p-4">Display Order</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {(dbAmbassadors.length > 0 ? dbAmbassadors : defaultAmbassadors).map((amb: any) => (
                <tr key={amb.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full border border-slate-200 bg-cover bg-center shadow-sm"
                        style={{ backgroundImage: `url('${amb.photoUrl || "/images/media_1787222340022.png"}')` }}
                      ></div>
                      <div>
                        <div className="font-bold text-slate-900">{amb.firstName} {amb.lastName}</div>
                        <div className="text-xs text-slate-400 font-mono">{amb.poafId || "VERIFIED-AMB"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      {amb.leaderPosition || amb.role}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {amb.country?.name || amb.country || "Pan-Africa"}
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-500">
                    #{amb.leaderOrder || 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/admin/ambassadors?edit=${amb.id}`}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition"
                      >
                        Edit
                      </Link>
                      {!amb.id.startsWith("amb-") && (
                        <form action={async () => { "use server"; await deleteMember(amb.id); }}>
                          <button 
                            type="submit" 
                            className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition"
                          >
                            Delete
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}