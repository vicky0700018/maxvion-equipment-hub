import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import {
  Button,
  Card,
  EmptyState,
  Input,
  Kpi,
  Modal,
  Select,
  TableWrap,
  Td,
  Th,
  Toolbar,
  Tr,
  Badge,
  useTableTools,
} from "../components/kit";
import { addRecord, deleteRecord, updateRecord, useStore } from "../lib/erp-store";
import { inr, newId, type Customer } from "../lib/erp-data";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "B2B Customers — MAXVION ERP Demo" },
      { name: "description", content: "Manage hospitals, laboratories, diagnostic centres and government institutional customers." },
      { property: "og:title", content: "MAXVION ERP — Customers" },
      { property: "og:description", content: "Institutional customer master with GSTIN, outstanding and contracts." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Customers,
});

const orgTypes = [
  "Hospital",
  "Diagnostic Centre",
  "Laboratory",
  "Research Institution",
  "Government Institution",
  "Healthcare Infrastructure Company",
];

const blank = { name: "", type: orgTypes[0]!, contact: "", phone: "", email: "", gstin: "", city: "Pune", outstanding: 0, contracts: 0 };

function Customers() {
  const customers = useStore((s) => s.customers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [detail, setDetail] = useState<Customer | null>(null);
  const [form, setForm] = useState({ ...blank });

  const t = useTableTools(customers as unknown as Record<string, unknown>[], ["name", "contact", "city", "gstin"], "type");
  const rows = t.filtered as unknown as Customer[];

  const save = () => {
    if (!form.name) return;
    if (editing) updateRecord("customers", { ...editing, ...form }, "Customer");
    else addRecord("customers", { id: newId("C"), ...form }, "Customer");
    setOpen(false);
  };

  return (
    <AdminShell
      title="Customers"
      subtitle="Institutional buyers, contacts, GSTIN records and outstanding balances."
      breadcrumb="Customers"
      actions={<Button size="sm" onClick={() => { setEditing(null); setForm({ ...blank }); setOpen(true); }}>+ Add Customer</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Customers" value={String(customers.length)} sub="Active institutional accounts" />
        <Kpi label="Total Outstanding" value={inr(customers.reduce((a, c) => a + c.outstanding, 0))} sub="Receivables" tone="amber" />
        <Kpi label="Active Contracts" value={String(customers.reduce((a, c) => a + c.contracts, 0))} sub="AMC & service" tone="teal" />
        <Kpi label="Government Buyers" value={String(customers.filter((c) => c.type === "Government Institution").length)} sub="Tender-based" tone="navy" />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search customer, contact, city or GSTIN"
        action={<Button size="sm" onClick={() => { setEditing(null); setForm({ ...blank }); setOpen(true); }}>+ Add Customer</Button>}
      />

      {rows.length === 0 ? (
        <EmptyState title="No customers match this filter" hint="Try another organization type or search term." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th><button onClick={() => t.toggleSort("name")} className="uppercase hover:text-medblue">Customer</button></Th>
              <Th>Organization Type</Th>
              <Th>Contact Person</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>GSTIN</Th>
              <Th>City</Th>
              <Th><button onClick={() => t.toggleSort("outstanding")} className="uppercase hover:text-medblue">Outstanding</button></Th>
              <Th>Contracts</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <Tr key={c.id}>
                <Td className="font-semibold text-navy">{c.name}</Td>
                <Td><Badge tone="blue">{c.type}</Badge></Td>
                <Td>{c.contact}</Td>
                <Td className="whitespace-nowrap">{c.phone}</Td>
                <Td className="text-xs">{c.email}</Td>
                <Td className="font-mono text-xs">{c.gstin}</Td>
                <Td>{c.city}</Td>
                <Td className="font-semibold text-navy">{inr(c.outstanding)}</Td>
                <Td>{c.contracts}</Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setDetail(c)}>View</Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(c); setForm({ ...c }); setOpen(true); }}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("customers", c.id, "Customer")}>Delete</Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Customer" : "Add Customer"}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Add Customer"}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Customer Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select label="Organization Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={orgTypes} />
          <Input label="Contact Person" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Input label="Outstanding (₹)" type="number" value={form.outstanding} onChange={(e) => setForm({ ...form, outstanding: Number(e.target.value) })} />
          <Input label="Active Contracts" type="number" value={form.contracts} onChange={(e) => setForm({ ...form, contracts: Number(e.target.value) })} />
        </div>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name ?? ""} description="Customer profile">
        {detail && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Organization Type", detail.type],
              ["Contact Person", detail.contact],
              ["Phone", detail.phone],
              ["Email", detail.email],
              ["GSTIN", detail.gstin],
              ["City", detail.city],
              ["Outstanding", inr(detail.outstanding)],
              ["Active Contracts", String(detail.contracts)],
            ].map(([k, v]) => (
              <Card key={k} className="bg-surface p-4">
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{k}</p>
                <p className="mt-1 font-semibold break-all text-navy">{v}</p>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
