import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import {
  Badge,
  Button,
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
  useTableTools,
} from "../components/kit";
import { addRecord, deleteRecord, updateRecord, useStore } from "../lib/erp-store";
import { inr, newId, type Quotation } from "../lib/erp-data";

export const Route = createFileRoute("/admin/quotations")({
  head: () => ({
    meta: [
      { title: "B2B Quotations — MAXVION ERP Demo" },
      { name: "description", content: "Create and manage institutional equipment quotations with GST, validity and approval status." },
      { property: "og:title", content: "MAXVION ERP — Quotations" },
      { property: "og:description", content: "Quotation management for institutional equipment sales." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Quotations,
});

const statuses: Quotation["status"][] = ["Draft", "Sent", "Approved", "Rejected", "Expired"];

function Quotations() {
  const quotations = useStore((s) => s.quotations);
  const customers = useStore((s) => s.customers);
  const products = useStore((s) => s.products);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Quotation | null>(null);
  const [form, setForm] = useState({
    customer: "",
    equipment: "",
    qty: 1,
    basePrice: 0,
    gstRate: 18,
    validUntil: "2026-10-03",
    status: "Draft" as Quotation["status"],
  });

  const t = useTableTools(quotations as unknown as Record<string, unknown>[], ["no", "customer", "equipment"], "status");
  const rows = t.filtered as unknown as Quotation[];
  const totalOf = (q: Quotation) => q.qty * q.basePrice * (1 + q.gstRate / 100);

  const openCreate = () => {
    setEditing(null);
    setForm({ customer: customers[0]?.name ?? "", equipment: products[0]?.name ?? "", qty: 1, basePrice: 0, gstRate: 18, validUntil: "2026-10-03", status: "Draft" });
    setOpen(true);
  };

  const openEdit = (q: Quotation) => {
    setEditing(q);
    setForm({ customer: q.customer, equipment: q.equipment, qty: q.qty, basePrice: q.basePrice, gstRate: q.gstRate, validUntil: q.validUntil, status: q.status });
    setOpen(true);
  };

  const save = () => {
    if (!form.customer || form.basePrice <= 0) return;
    if (editing) updateRecord("quotations", { ...editing, ...form }, "Quotation");
    else
      addRecord(
        "quotations",
        { id: newId("Q"), no: `MAX/QTN/2026-0${319 + quotations.length}`, ...form },
        "Quotation",
      );
    setOpen(false);
  };

  return (
    <AdminShell
      title="Quotations"
      subtitle="B2B equipment quotations with GST, validity windows and approval tracking."
      breadcrumb="Quotations"
      actions={<Button size="sm" onClick={openCreate}>+ Create Quotation</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Open Quotations" value={String(quotations.filter((q) => ["Draft", "Sent"].includes(q.status)).length)} sub="Draft & sent" />
        <Kpi label="Approved" value={String(quotations.filter((q) => q.status === "Approved").length)} sub="Ready for proforma" tone="teal" />
        <Kpi label="Quoted Value" value={inr(quotations.reduce((a, q) => a + totalOf(q), 0))} sub="Incl. GST" tone="navy" />
        <Kpi label="Expired / Rejected" value={String(quotations.filter((q) => ["Expired", "Rejected"].includes(q.status)).length)} sub="Requires follow-up" tone="amber" />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search quotation, customer or equipment"
        action={<Button size="sm" onClick={openCreate}>+ Create Quotation</Button>}
      />

      {rows.length === 0 ? (
        <EmptyState title="No quotations found" hint="Create a quotation or clear the active filters." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>
                <button onClick={() => t.toggleSort("no")} className="uppercase hover:text-medblue">Quotation No.</button>
              </Th>
              <Th>Customer</Th>
              <Th>Equipment</Th>
              <Th>Qty</Th>
              <Th>Base Price</Th>
              <Th>GST</Th>
              <Th>
                <button onClick={() => t.toggleSort("basePrice")} className="uppercase hover:text-medblue">Total</button>
              </Th>
              <Th>Valid Until</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => (
              <Tr key={q.id}>
                <Td className="font-mono text-xs font-semibold text-navy">{q.no}</Td>
                <Td className="font-medium text-navy">{q.customer}</Td>
                <Td>{q.equipment}</Td>
                <Td>{q.qty}</Td>
                <Td>{inr(q.basePrice)}</Td>
                <Td>{q.gstRate}%</Td>
                <Td className="font-semibold text-navy">{inr(totalOf(q))}</Td>
                <Td className="whitespace-nowrap">{q.validUntil}</Td>
                <Td>
                  <select
                    value={q.status}
                    onChange={(e) => updateRecord("quotations", { ...q, status: e.target.value as Quotation["status"] }, "Quotation status")}
                    className="rounded-md border border-border bg-card px-2 py-1 text-xs font-semibold text-navy"
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => openEdit(q)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("quotations", q.id, "Quotation")}>Delete</Button>
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
        title={editing ? "Edit Quotation" : "Create Quotation"}
        description="Institutional equipment quotation with GST computation."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Create Quotation"}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Customer" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} options={customers.map((c) => c.name)} />
          <Select label="Equipment" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} options={products.map((p) => p.name)} />
          <Input label="Quantity" type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
          <Input label="Base Price per Unit (₹)" type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
          <Select label="GST Rate (%)" value={String(form.gstRate)} onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })} options={["5", "12", "18", "28"]} />
          <Input label="Valid Until" type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Quotation["status"] })} options={statuses} />
          <div className="flex items-end">
            <div className="w-full rounded-lg bg-lightblue px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">Quotation Total (incl. GST)</p>
              <p className="text-lg font-bold text-navy">{inr(form.qty * form.basePrice * (1 + form.gstRate / 100))}</p>
            </div>
          </div>
        </div>
      </Modal>
    </AdminShell>
  );
}
