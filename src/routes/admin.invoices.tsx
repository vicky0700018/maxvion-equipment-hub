import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import {
  Badge,
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
  useTableTools,
} from "../components/kit";
import { addRecord, deleteRecord, useStore } from "../lib/erp-store";
import { inr, newId, type Proforma } from "../lib/erp-data";

export const Route = createFileRoute("/admin/invoices")({
  head: () => ({
    meta: [
      { title: "Proforma Invoices — MAXVION ERP Demo" },
      { name: "description", content: "Proforma invoices for institutional equipment sales with serial, delivery and payment terms." },
      { property: "og:title", content: "MAXVION ERP — Proforma Invoices" },
      { property: "og:description", content: "Institutional proforma invoicing with GST and delivery terms." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Proformas,
});

function Proformas() {
  const proformas = useStore((s) => s.proformas);
  const customers = useStore((s) => s.customers);
  const products = useStore((s) => s.products);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Proforma | null>(null);
  const [form, setForm] = useState({
    buyer: "",
    equipment: "",
    serial: "",
    qty: 1,
    unitPrice: 0,
    gstRate: 18,
    deliveryTerms: "4 weeks, FOR site",
    paymentTerms: "50% advance, 50% on installation",
  });

  const t = useTableTools(proformas as unknown as Record<string, unknown>[], ["no", "buyer", "equipment", "serial"]);
  const rows = t.filtered as unknown as Proforma[];
  const totalOf = (p: Proforma) => p.qty * p.unitPrice * (1 + p.gstRate / 100);

  const save = () => {
    if (!form.buyer || form.unitPrice <= 0) return;
    addRecord("proformas", { id: newId("P"), no: `MAX/PI/2026-00${93 + proformas.length}`, ...form }, "Proforma invoice");
    setOpen(false);
  };

  return (
    <AdminShell
      title="Proforma Invoices"
      subtitle="Pre-sale institutional documents with serial/batch, delivery and payment terms."
      breadcrumb="Proforma Invoices"
      actions={<Button size="sm" onClick={() => setOpen(true)}>+ Create Proforma</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Open Proformas" value={String(proformas.length)} sub="Awaiting confirmation" />
        <Kpi label="Proforma Value" value={inr(proformas.reduce((a, p) => a + totalOf(p), 0))} sub="Incl. GST" tone="navy" />
        <Kpi label="Advance Expected" value={inr(proformas.reduce((a, p) => a + totalOf(p) * 0.4, 0))} sub="Indicative 40%" tone="teal" />
        <Kpi label="Units Committed" value={String(proformas.reduce((a, p) => a + p.qty, 0))} sub="Across all buyers" tone="amber" />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        placeholder="Search PI number, buyer, equipment or serial"
        action={<Button size="sm" onClick={() => setOpen(true)}>+ Create Proforma</Button>}
      />

      {rows.length === 0 ? (
        <EmptyState title="No proforma invoices found" hint="Try a different search term." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>PI Number</Th>
              <Th>Buyer</Th>
              <Th>Equipment</Th>
              <Th>Serial / Batch</Th>
              <Th>Qty</Th>
              <Th>Unit Price</Th>
              <Th>GST</Th>
              <Th>Total</Th>
              <Th>Delivery Terms</Th>
              <Th>Payment Terms</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <Tr key={p.id}>
                <Td className="font-mono text-xs font-semibold text-navy">{p.no}</Td>
                <Td className="font-medium text-navy">{p.buyer}</Td>
                <Td>{p.equipment}</Td>
                <Td className="font-mono text-xs">{p.serial}</Td>
                <Td>{p.qty}</Td>
                <Td>{inr(p.unitPrice)}</Td>
                <Td>{p.gstRate}%</Td>
                <Td className="font-semibold text-navy">{inr(totalOf(p))}</Td>
                <Td className="max-w-[180px] text-xs">{p.deliveryTerms}</Td>
                <Td className="max-w-[180px] text-xs">{p.paymentTerms}</Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setPreview(p)}>View</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("proformas", p.id, "Proforma")}>Delete</Button>
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
        title="Create Proforma Invoice"
        description="Institutional equipment sale — mock record."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Create Proforma</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Buyer" value={form.buyer} onChange={(e) => setForm({ ...form, buyer: e.target.value })} options={customers.map((c) => c.name)} />
          <Select label="Equipment" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} options={products.map((p) => p.name)} />
          <Input label="Serial / Batch" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} placeholder="MAX-XXXX-2026-00000" />
          <Input label="Quantity" type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
          <Input label="Unit Price (₹)" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} />
          <Select label="GST Rate (%)" value={String(form.gstRate)} onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })} options={["5", "12", "18", "28"]} />
          <Input label="Delivery Terms" value={form.deliveryTerms} onChange={(e) => setForm({ ...form, deliveryTerms: e.target.value })} />
          <Input label="Payment Terms" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
        </div>
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Proforma Invoice Preview" description="Demo document layout">
        {preview && (
          <Card className="p-0">
            <div className="bg-navy px-5 py-4 text-white">
              <p className="text-base font-black">MAXVION INFRASTRUCTURE PRIVATE LIMITED</p>
              <p className="mt-1 text-[11px] text-white/60">GSTIN 27AAXCM1234K1ZP · Hinjawadi, Pune - 411057</p>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Buyer</p>
                  <p className="font-semibold text-navy">{preview.buyer}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-navy">{preview.no}</p>
                  <Badge tone="blue">Proforma</Badge>
                </div>
              </div>
              <div className="rounded-lg bg-surface p-4">
                <p className="font-semibold text-navy">{preview.equipment}</p>
                <p className="mt-1 font-mono text-xs text-slate-500">{preview.serial}</p>
                <div className="mt-3 grid gap-1 text-xs text-slate-600">
                  <div className="flex justify-between"><span>Quantity</span><span>{preview.qty}</span></div>
                  <div className="flex justify-between"><span>Unit Price</span><span>{inr(preview.unitPrice)}</span></div>
                  <div className="flex justify-between"><span>Taxable Value</span><span>{inr(preview.qty * preview.unitPrice)}</span></div>
                  <div className="flex justify-between"><span>GST @ {preview.gstRate}%</span><span>{inr(preview.qty * preview.unitPrice * (preview.gstRate / 100))}</span></div>
                  <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold text-navy"><span>Total</span><span>{inr(totalOf(preview))}</span></div>
                </div>
              </div>
              <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                <p><span className="font-semibold text-navy">Delivery:</span> {preview.deliveryTerms}</p>
                <p><span className="font-semibold text-navy">Payment:</span> {preview.paymentTerms}</p>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </AdminShell>
  );
}
