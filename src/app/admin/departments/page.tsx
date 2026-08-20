import React from "react";
import prisma from "@/lib/prisma";
import { addDepartment, deleteDepartment, updateDepartment } from "@/actions/departments";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  let departments: any[] = [];
  try {
    departments = await prisma.department.findMany({
      include: { _count: { select: { members: true, projects: true } }, leader: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (err) {
    console.warn("Admin departments fetch fallback:", err);
  }

  const editingDept = edit ? departments.find(d => d.id === edit) : null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Manage Departments</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">{editingDept ? "Edit Department" : "Add New Department"}</h2>
        <form action={editingDept ? updateDepartment : addDepartment} className="grid grid-cols-1 gap-4">
          {editingDept && <input type="hidden" name="id" value={editingDept.id} />}
          <div>
            <label className="block text-sm font-medium text-slate-700">Department Name</label>
            <input type="text" name="name" defaultValue={editingDept?.name || ""} required className="mt-1 block w-full md:w-1/2 rounded-md border-slate-300 shadow-sm border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" defaultValue={editingDept?.description || ""} rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2"></textarea>
          </div>
          <div className="mt-2 flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              {editingDept ? "Update Department" : "Create Department"}
            </button>
            {editingDept && <Link href="/admin/departments" className="px-4 py-2 bg-slate-200 rounded-md text-slate-700 hover:bg-slate-300">Cancel</Link>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Leader</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {departments.map(dept => (
              <tr key={dept.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{dept.name}</div>
                  <div className="text-xs text-slate-500">{dept.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {dept.leader ? dept.leader.firstName + " " + dept.leader.lastName : <span className="text-slate-400 italic">Unassigned</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                  <Link href={"/admin/departments?edit=" + dept.id} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  <form action={async () => { "use server"; await deleteDepartment(dept.id); }}>
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