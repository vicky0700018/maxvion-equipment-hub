import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import { Badge, Button, EmptyState, Input, Kpi, Modal, Select, TableWrap, Td, Th, Toolbar, Tr, useTableTools } from "../components/kit";
import { addRecord, deleteRecord, updateRecord, useStore } from "../lib/erp-store";
import { inr, newId, categories, type Vendor } from "../lib/erp-data";

export const Route = createFileRoute("/admin/vendors")({
  head: () => ({
    meta: [
      { title: "Vendors — MAXVION ERP Demo" },
      { name: "description", content: "Vendor directory and payable tracking for MAXVION equipment procurement." },
      { property: "og:title", content: "MAXVION ERP — Vendors" },
      { property: "og:description", content: "Manage equipment suppliers, GST details and outstanding payables." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VendorsPage,
});

const statuses: Vendor["status"][] = ["Active", "On Hold", "Blacklisted"];
const blank = { name: "", category: categories[0] ?? "Medical Equipment", contact: "", phone: "", email: "", gstin: "", payable: 0, status: "Active" as Vendor["status"] };

function VendorsPage() {
  const vendors = useStore((s) => s.vendors);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState({ ...blank });
  const tools = useTableTools(vendors as unknown as Record<string, unknown>[], ["name", "category", "contact", "gstin"], "status");
  const rows = tools.filtered as unknown as Vendor[];
  const totalPayable = vendors.reduce((sum, vendor) => sum + vendor.payable, 0);

  const openNew = () => { setEditing(null); setForm({ ...blank }); setOpen(true); };
  const save = () => {
    if (!form.name || !form.contact) return;
    const record = { ...form, payable: Number(form.payable) };
    if (editing) updateRecord("vendors", { ...editing, ...record }, "Vendor");
    else addRecord("vendors", { id: newId("V"), ...record }, "Vendor");
    setOpen(false);
  };

  return (
    <AdminShell title="Vendors" subtitle="Supplier directory, GST records and outstanding payables across procurement." breadcrumb="Vendors" actions={<Button size="sm" onClick={openNew}>+ Add Vendor</Button>}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Vendors" value={String(vendors.length)} sub="Supplier records" />
        <Kpi label="Active Vendors" value={String(vendors.filter((v) => v.status === "Active").length)} sub="Approved suppliers" tone="teal" />
        <Kpi label="Outstanding Payable" value={inr(totalPayable)} sub="Across active accounts" tone="amber" />
        <Kpi label="On Hold / Blocked" value={String(vendors.filter((v) => v.status !== "Active").length)} sub="Review required" tone="navy" />
      </div>
      <Toolbar query={tools.query} setQuery={tools.setQuery} status={tools.status} setStatus={tools.setStatus} statuses={tools.statuses} placeholder="Search vendor, category, contact or GSTIN" action={<Button size="sm" onClick={openNew}>+ Add Vendor</Button>} />
      {rows.length === 0 ? <EmptyState title="No vendors match this filter" hint="Adjust the search or add a supplier record." /> : (
        <TableWrap>
          <thead><tr><Th>Vendor Name</Th><Th>Category</Th><Th>Contact</Th><Th>Phone / Email</Th><Th>GSTIN</Th><Th>Outstanding Payable</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
          <tbody>{rows.map((v) => <Tr key={v.id}>
            <Td className="font-semibold text-navy">{v.name}</Td><Td>{v.category}</Td><Td><p className="font-medium text-navy">{v.contact}</p></Td>
            <Td><p className="whitespace-nowrap">{v.phone}</p><p className="text-xs text-slate-500">{v.email}</p></Td><Td className="font-mono text-xs">{v.gstin}</Td>
            <Td className="font-semibold text-navy">{inr(v.payable)}</Td><Td><Badge>{v.status}</Badge></Td>
            <Td><div className="flex gap-1.5"><Button size="sm" variant="outline" onClick={() => { setEditing(v); setForm({ ...v }); setOpen(true); }}>Edit</Button><Button size="sm" variant="danger" onClick={() => deleteRecord("vendors", v.id, "Vendor")}>Delete</Button></div></Td>
          </Tr>)}</tbody>
        </TableWrap>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Vendor" : "Add Vendor"} description="Supplier contact and payable details." footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save Changes" : "Add Vendor"}</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Vendor Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={categories} />
          <Input label="Contact Person" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /><Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><Input label="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
          <Input label="Outstanding Payable (₹)" type="number" min="0" value={form.payable} onChange={(e) => setForm({ ...form, payable: Number(e.target.value) })} /><Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Vendor["status"] })} options={statuses} />
        </div>
      </Modal>
    </AdminShell>
  );
}