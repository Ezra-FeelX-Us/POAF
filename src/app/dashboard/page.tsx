import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      member: {
        include: {
          department: true,
          ledDepartment: {
            include: {
              members: true,
              projects: true,
              initiatives: true,
            }
          }
        }
      },
      applications: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/auth/login");
  }

  const isLeader = user.role === "DEPT_LEADER" || user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  const managedDepartment = user.member ? user.member.ledDepartment : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-widest text-blue-400">P|AF Workspace</Link>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span>{user.name}</span>
            <span className="bg-blue-800 px-3 py-1 rounded-full text-xs">{user.role.replace("_", " ")}</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Welcome, {user.name}</h1>
          <p className="text-slate-600 text-lg">Manage your applications, profile, and projects from your centralized dashboard.</p>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Your Applications</h2>
          {user.applications.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
              <p className="text-slate-500 mb-4">You have not submitted any applications yet.</p>
              <Link href="/apply/membership" className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Apply for Membership</Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {user.applications.map(app => (
                <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{app.type} Application</span>
                      <span className="text-xs font-mono text-slate-400">{app.poafId || "Pending ID"}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Submitted on {new Date(app.createdAt).toLocaleDateString()}</h3>
                    {app.notes && (
                      <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 text-sm text-blue-900">
                        <strong>Admin Notes:</strong> {app.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 text-slate-700">
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {user.member && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Member Workspace</h2>
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('" + (user.member.photoUrl || "/images/media_1787222340022.png") + "')" }}></div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                    <h3 className="text-3xl font-extrabold">{user.member.firstName} {user.member.lastName}</h3>
                    <span className="bg-yellow-500 text-yellow-950 font-bold px-3 py-1 rounded-full text-xs tracking-widest">{user.member.poafId}</span>
                  </div>
                  <p className="text-blue-200 mb-6">{user.member.role} {user.member.isLeader && (" - " + user.member.leaderPosition)}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                      <p className="text-xs text-blue-300 uppercase tracking-wider mb-1 font-semibold">Department</p>
                      <p className="font-bold">{user.member.department ? user.member.department.name : "Pending"}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                      <p className="text-xs text-blue-300 uppercase tracking-wider mb-1 font-semibold">Status</p>
                      <p className="font-bold text-green-400">{user.member.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {isLeader && managedDepartment && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6 border-b pb-2">
              <h2 className="text-2xl font-bold text-slate-800">Department Administration: {managedDepartment.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-3 grid grid-cols-3 divide-x divide-slate-100">
                <div className="text-center px-4">
                  <div className="text-3xl font-black text-slate-800">{managedDepartment.members.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Members</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-3xl font-black text-slate-800">{managedDepartment.projects.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Projects</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-3xl font-black text-green-600">{managedDepartment.initiatives.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Initiatives</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2">
                <h3 className="font-bold text-slate-800 mb-4 flex justify-between items-center">
                  Department Roster
                  <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded font-semibold transition">Manage Roster</button>
                </h3>
                <ul className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-2">
                  {managedDepartment.members.map(m => (
                    <li key={m.id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('" + (m.photoUrl || "/images/media_1787222340022.png") + "')" }}></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{m.firstName} {m.lastName}</p>
                          <p className="text-xs text-slate-500">{m.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{m.poafId}</span>
                    </li>
                  ))}
                  {managedDepartment.members.length === 0 && <li className="text-sm text-slate-500 italic py-2">No members assigned to this department yet.</li>}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Leader Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold transition flex items-center gap-2">
                    Schedule Event
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-semibold transition flex items-center gap-2">
                    Propose New Project
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold transition flex items-center gap-2">
                    Post Announcement
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}