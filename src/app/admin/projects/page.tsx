import React from "react";
import prisma from "@/lib/prisma";
import { addProject, deleteProject, updateProject, updateProjectStatus } from "@/actions/projects";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  let departments: any[] = [];
  let projects: any[] = [];

  try {
    departments = await prisma.department.findMany();
    projects = await prisma.project.findMany({ include: { department: true }, orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.warn("Admin projects fetch fallback:", err);
  }
  
  const editingProj = edit ? projects.find(p => p.id === edit) : null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Manage Projects & Proposals</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">{editingProj ? "Edit Project" : "Create New Project"}</h2>
        <form action={editingProj ? updateProject : addProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editingProj && <input type="hidden" name="id" value={editingProj.id} />}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Project Title</label>
            <input type="text" name="title" defaultValue={editingProj?.title || ""} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" defaultValue={editingProj?.description || ""} rows={3} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Department</label>
            <select name="departmentId" defaultValue={editingProj?.departmentId || ""} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2 bg-white">
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select name="status" defaultValue={editingProj?.status || "PROPOSED"} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2 bg-white">
              <option value="PROPOSED">Proposed</option>
              <option value="APPROVED">Approved</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          {editingProj && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Progress (%)</label>
              <input type="number" name="progressPct" defaultValue={editingProj.progressPct} min="0" max="100" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2" />
            </div>
          )}
          <div className="md:col-span-2 mt-2 flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              {editingProj ? "Update Project" : "Create Project"}
            </button>
            {editingProj && <Link href="/admin/projects" className="px-4 py-2 bg-slate-200 rounded-md text-slate-700 hover:bg-slate-300">Cancel</Link>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status & Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {projects.map(project => (
              <tr key={project.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{project.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{project.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{project.department.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 mb-2">
                    {project.status}
                  </span>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: project.progressPct + "%" }}></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4 items-center">
                  {project.status === "PROPOSED" && (
                    <form action={async () => { "use server"; await updateProjectStatus(project.id, "ONGOING"); }}>
                      <button type="submit" className="text-indigo-600 hover:text-indigo-900">Start</button>
                    </form>
                  )}
                  {project.status === "ONGOING" && (
                    <form action={async () => { "use server"; await updateProjectStatus(project.id, "COMPLETED"); }}>
                      <button type="submit" className="text-green-600 hover:text-green-900">Complete</button>
                    </form>
                  )}
                  <Link href={"/admin/projects?edit=" + project.id} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  <form action={async () => { "use server"; await deleteProject(project.id); }}>
                    <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}