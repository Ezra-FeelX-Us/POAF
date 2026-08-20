import React from "react";
import prisma from "@/lib/prisma";
import { addMember, updateMember, deleteMember } from "@/actions/members";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminExecutivesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;

  let countries: any[] = [];
  let dbExecutives: any[] = [];

  try {
    const results = await Promise.all([
      prisma.country.findMany({ orderBy: { name: "asc" } }),
      prisma.member.findMany({
        where: {
          OR: [
            { role: { contains: "President" } },
            { role: { contains: "Founder" } },
            { leaderPosition: { contains: "President" } },
            { leaderPosition: { contains: "Founder" } },
            { leaderPosition: { contains: "Executive" } }
          ],
          deletedAt: null
        },
        include: { country: true },
        orderBy: { leaderOrder: "asc" }
      })
    ]);
    countries = results[0];
    dbExecutives = results[1];
  } catch (err) {
    console.warn("Admin executives fetch fallback:", err);
  }

  const defaultExecutives = [
    {
      id: "exec-1",
      firstName: "Ezra Michael",
      lastName: "Jofe",
      role: "Founder & Executive President of POAF",
      leaderPosition: "Founder & Executive President",
      country: "Ethiopia",
      photoUrl: "/images/media_1787225249810.png",
      leaderOrder: 1,
      bio: "Visionary founder of Pioneers of Africa's Future (POAF), empowering youth and pioneering sustainable, youth-led pan-African solutions."
    },
    {
      id: "exec-2",
      firstName: "Yshurun",
      lastName: "Tekle",
      role: "Co-Founder & Executive Vice President",
      leaderPosition: "Co-Founder & Executive Vice President",
      country: "Ethiopia",
      photoUrl: "/images/media_1787222340022.png",
      leaderOrder: 2,
      bio: "Co-founder spearheading institutional alignment, constitutional governance, and pan-African network growth."
    }
  ];

  const editingExec = edit ? (dbExecutives.find(e => e.id === edit) || defaultExecutives.find(e => e.id === edit)) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Founders & Executive Council Management</h1>
          <p className="text-slate-500 text-sm mt-1">Configure presidential messages, spotlights, co-founder profiles, and executive council members.</p>
        </div>
        <div className="bg-yellow-50 text-yellow-900 font-bold px-4 py-2 rounded-xl text-sm border border-yellow-200">
          Executive Leadership Portal
        </div>
      </div>

      {/* Presidential Spotlight Settings Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {editingExec ? `Edit Executive: ${editingExec.firstName} ${editingExec.lastName}` : "Add New Executive Council Member / Founder"}
        </h2>
        <form action={editingExec && !editingExec.id.startsWith("exec-") ? updateMember : addMember} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editingExec && !editingExec.id.startsWith("exec-") && <input type="hidden" name="id" value={editingExec.id} />}
          <input type="hidden" name="isLeader" value="on" />
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">First Name</label>
            <input 
              type="text" 
              name="firstName" 
              defaultValue={editingExec?.firstName || ""} 
              required 
              placeholder="e.g. Ezra Michael"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              defaultValue={editingExec?.lastName || ""} 
              required 
              placeholder="e.g. Jofe"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Executive Position / Role</label>
            <input 
              type="text" 
              name="leaderPosition" 
              defaultValue={editingExec?.leaderPosition || editingExec?.role || ""} 
              required 
              placeholder="e.g. Founder & Executive President of POAF"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
            <input type="hidden" name="role" value={editingExec?.role || "Executive Leader"} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Country</label>
            <select 
              name="countryId" 
              defaultValue={editingExec && 'countryId' in editingExec ? editingExec.countryId : (countries[0]?.id || "")} 
              required 
              className="w-full rounded-xl border border-slate-300 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Display Hierarchy Order</label>
            <input 
              type="number" 
              name="leaderOrder" 
              defaultValue={editingExec?.leaderOrder || 1} 
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Portrait Photo URL</label>
            <input 
              type="text" 
              name="photoUrl" 
              defaultValue={editingExec?.photoUrl || ""} 
              placeholder="/images/media_1787225249810.png"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Executive Bio / Presidential Address</label>
            <textarea 
              name="bio" 
              defaultValue={editingExec?.bio || ""} 
              rows={4}
              placeholder="Enter official executive bio, presidential message excerpt, or constitutional mandate..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="md:col-span-3 flex gap-4 mt-2">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
            >
              {editingExec ? "Update Executive Profile" : "Save Executive Leader"}
            </button>
            {editingExec && (
              <Link 
                href="/admin/executives" 
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Cancel Edit
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Executives Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900">Founders & High Council Roster</h3>
          <span className="text-xs text-slate-500">POAF Executive Governance</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Leader</th>
                <th className="p-4">Executive Mandate</th>
                <th className="p-4">Country</th>
                <th className="p-4">Rank Order</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {(dbExecutives.length > 0 ? dbExecutives : defaultExecutives).map((exec: any) => (
                <tr key={exec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-14 h-14 rounded-full border-2 border-yellow-500 bg-cover bg-center shadow-md"
                        style={{ backgroundImage: `url('${exec.photoUrl || "/images/media_1787225249810.png"}')` }}
                      ></div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">{exec.firstName} {exec.lastName}</div>
                        <div className="text-xs text-blue-600 font-semibold">{exec.poafId || "POAF-EXEC-0001"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full border border-yellow-300">
                      {exec.leaderPosition || exec.role}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{exec.bio}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {exec.country?.name || exec.country || "Ethiopia"}
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-500">
                    Rank #{exec.leaderOrder || 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/admin/executives?edit=${exec.id}`}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition"
                      >
                        Edit
                      </Link>
                      {!exec.id.startsWith("exec-") && (
                        <form action={async () => { "use server"; await deleteMember(exec.id); }}>
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