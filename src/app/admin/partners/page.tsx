import React from "react";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  let partners: any[] = [];
  try {
    partners = await prisma.partnership.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (err) {
    console.warn("Admin partners fetch fallback:", err);
  }
  
  const editingPartner = edit ? partners.find(p => p.id === edit) : null;

  async function addPartner(formData: FormData) {
    "use server";
    const organizationName = formData.get("organizationName") as string;
    const organizationType = formData.get("organizationType") as string;
    await prisma.partnership.create({ data: { organizationName, organizationType } });
    revalidatePath("/admin/partners"); revalidatePath("/");
  }

  async function updatePartner(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const organizationName = formData.get("organizationName") as string;
    const organizationType = formData.get("organizationType") as string;
    await prisma.partnership.update({ where: { id }, data: { organizationName, organizationType } });
    revalidatePath("/admin/partners"); revalidatePath("/");
    redirect("/admin/partners");
  }

  async function deletePartner(id: string) {
    "use server";
    await prisma.partnership.delete({ where: { id } });
    revalidatePath("/admin/partners"); revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Manage Partners</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">{editingPartner ? "Edit Partner" : "Add New Partner"}</h2>
        <form action={editingPartner ? updatePartner : addPartner} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {editingPartner && <input type="hidden" name="id" value={editingPartner.id} />}
          <input type="text" name="organizationName" defaultValue={editingPartner?.organizationName || ""} placeholder="Organization Name" required className="border p-2 rounded md:col-span-1" />
          <input type="text" name="organizationType" defaultValue={editingPartner?.organizationType || ""} placeholder="Type (e.g. NGO, Corporate)" required className="border p-2 rounded md:col-span-1" />
          <div className="flex gap-4 md:col-span-2">
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-full md:w-auto">
              {editingPartner ? "Update Partner" : "Add Partner"}
            </button>
            {editingPartner && <Link href="/admin/partners" className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded hover:bg-slate-300 w-full md:w-auto text-center">Cancel</Link>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-700">Organization Name</th>
              <th className="p-4 font-semibold text-slate-700">Type</th>
              <th className="p-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(p => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900">{p.organizationName}</td>
                <td className="p-4 text-slate-500">{p.organizationType}</td>
                <td className="p-4 flex items-center gap-4">
                  <Link href={"/admin/partners?edit=" + p.id} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</Link>
                  <form action={async () => { "use server"; await deletePartner(p.id); }}>
                    <button className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
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