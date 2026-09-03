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
import { addRecord, deleteRecord, updateRecord, useStore } from "../lib/erp-store";
import { inr, newId, type Invoice } from "../lib/erp-data";

export const Route = createFileRoute("/admin/sales")({
  head: () => ({
    meta: [
      { title: "Sales & GST Invoices — MAXVION ERP Demo" },
      { name: "description", content: "Institutional sales invoices with GST, status tracking and invoice creation." },
      { property: "og:title", content: "MAXVION ERP — Sales Module" },
      { property: "og:description", content: "B2B GST invoicing for hospitals, labs and government buyers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Sales,
});

const emptyForm = {
  customer: "",
  equipment: "",
  amount: 0,
  gst: 18,
  status: "Unpaid" as Invoice["status"],
  date: "2026-09-03",
  discount: 0,
  hsn: "9018",
  interState: false,
};

function Sales() {
  const invoices = useStore((s) => s.invoices);
  const customers = useStore((s) => s.customers);
  const products = useStore((s) => s.products);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [preview, setPreview] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const t = useTableTools(invoices as unknown as Record<string, unknown>[], ["no", "customer", "equipment"], "status");
  const rows = t.filtered as unknown as Invoice[];

  const taxable = form.amount - form.discount;
  const gstAmount = (taxable * form.gst) / 100;

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, customer: customers[0]?.name ?? "", equipment: products[0]?.name ?? "" });
    setOpen(true);
  };

  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setForm({ ...emptyForm, customer: inv.customer, equipment: inv.equipment, amount: inv.amount, gst: inv.gst, status: inv.status, date: inv.date });
    setOpen(true);
  };

  const save = () => {
    if (!form.customer || !form.equipment || form.amount <= 0) return;
    if (editing) {
      updateRecord("invoices", { ...editing, ...form, amount: Number(form.amount), gst: Number(form.gst) }, "Invoice");
    } else {
      addRecord(
        "invoices",
        {
          id: newId("I"),
          no: `MAX/INV/2026-0${156 + invoices.length}`,
          customer: form.customer,
          equipment: form.equipment,
          amount: Number(form.amount),
          gst: Number(form.gst),
          status: form.status,
          date: form.date,
        },
        "Invoice",
      );
    }
    setOpen(false);
  };

  const total = invoices.reduce((a, i) => a + i.amount * (1 + i.gst / 100), 0);
  const unpaid = invoices.filter((i) => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);

  return (
    <AdminShell
      title="Sales & GST Invoices"
      subtitle="Institutional equipment sales with GST breakdown and payment status."
      breadcrumb="Sales"
      actions={<Button size="sm" onClick={openCreate}>+ Create Invoice</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Invoiced (incl. GST)" value={inr(total)} sub={`${invoices.length} invoices`} trend="7.4%" />
        <Kpi label="Unpaid Value" value={inr(unpaid)} sub="Awaiting collection" tone="amber" />
        <Kpi label="Overdue Invoices" value={String(invoices.filter((i) => i.status === "Overdue").length)} sub="Escalated to accounts" tone="amber" />
        <Kpi label="Paid Invoices" value={String(invoices.filter((i) => i.status === "Paid").length)} sub="Settled in full" tone="teal" />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search invoice, customer or equipment"
        action={<Button size="sm" onClick={openCreate}>+ Create Invoice</Button>}
      />

      {rows.length === 0 ? (
        <EmptyState title="No invoices match your filters" hint="Adjust the search term or status filter to see records." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              {(["no", "customer", "equipment", "amount", "gst", "status", "date"] as const).map((k) => (
                <Th key={k}>
                  <button onClick={() => t.toggleSort(k)} className="uppercase hover:text-medblue">
                    {k === "no" ? "Invoice No." : k === "gst" ? "GST" : k}
                    {t.sortKey === k ? (t.asc ? " ▲" : " ▼") : ""}
                  </button>
                </Th>
              ))}
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <Tr key={i.id}>
                <Td className="font-mono text-xs font-semibold text-navy">{i.no}</Td>
                <Td className="font-medium text-navy">{i.customer}</Td>
                <Td>{i.equipment}</Td>
                <Td className="font-semibold text-navy">{inr(i.amount)}</Td>
                <Td>{i.gst}%</Td>
                <Td>
                  <Badge>{i.status}</Badge>
                </Td>
                <Td className="whitespace-nowrap">{i.date}</Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setPreview(i)}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(i)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("invoices", i.id, "Invoice")}>
                      Delete
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      {/* Create / edit modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Invoice" : "Create GST Invoice"}
        description="B2B institutional billing — mock record stored in React state."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Create Invoice"}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Customer (GSTIN buyer)" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} options={customers.map((c) => c.name)} />
          <Select label="Equipment" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} options={products.map((p) => p.name)} />
          <Input label="Taxable Amount (₹)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          <Input label="Discount (₹)" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
          <Input label="HSN / SAC" value={form.hsn} onChange={(e) => setForm({ ...form, hsn: e.target.value })} />
          <Select label="GST Rate (%)" value={String(form.gst)} onChange={(e) => setForm({ ...form, gst: Number(e.target.value) })} options={["5", "12", "18", "28"]} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Invoice["status"] })} options={["Paid", "Partially Paid", "Unpaid", "Overdue"]} />
          <Input label="Invoice Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
            <input type="checkbox" checked={form.interState} onChange={(e) => setForm({ ...form, interState: e.target.checked })} className="h-4 w-4 accent-[var(--medblue)]" />
            Inter-state supply (apply IGST instead of CGST + SGST)
          </label>
          <Card className="bg-surface sm:col-span-2">
            <div className="grid gap-1.5 text-sm">
              <Row label="Taxable Amount" value={inr(taxable)} />
              {form.interState ? (
                <Row label={`IGST @ ${form.gst}%`} value={inr(gstAmount)} />
              ) : (
                <>
                  <Row label={`CGST @ ${form.gst / 2}%`} value={inr(gstAmount / 2)} />
                  <Row label={`SGST @ ${form.gst / 2}%`} value={inr(gstAmount / 2)} />
                </>
              )}
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold text-navy">
                <span>Grand Total</span>
                <span>{inr(taxable + gstAmount)}</span>
              </div>
            </div>
          </Card>
        </div>
      </Modal>

      {/* Invoice preview */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Tax Invoice Preview" description="GST invoice layout — demo preview only">
        {preview && (
          <div className="rounded-xl border border-border">
            <div className="flex flex-wrap items-start justify-between gap-4 bg-navy px-5 py-4 text-white">
              <div>
                <p className="text-base font-black">MAXVION INFRASTRUCTURE PRIVATE LIMITED</p>
                <p className="mt-1 max-w-sm text-[11px] text-white/60">
                  Office 237, 2nd Floor, Gera's Imperium Rise, Hinjawadi, Pune - 411057 · GSTIN 27AAXCM1234K1ZP
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="font-mono font-bold">{preview.no}</p>
                <p className="text-white/60">{preview.date}</p>
              </div>
            </div>
            <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Billed To</p>
                <p className="mt-1 font-semibold text-navy">{preview.customer}</p>
                <p className="text-xs text-slate-500">GSTIN: {customers.find((c) => c.name === preview.customer)?.gstin ?? "27AAAAA0000A1Z5"}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-bold text-slate-500 uppercase">Payment / Delivery Terms</p>
                <p className="mt-1 text-sm text-slate-600">Net 30 days · FOR site delivery</p>
              </div>
            </div>
            <table className="w-full border-t border-border text-sm">
              <thead>
                <tr>
                  <Th>Description</Th>
                  <Th>HSN</Th>
                  <Th>Taxable</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td className="font-medium text-navy">{preview.equipment}</Td>
                  <Td>9018</Td>
                  <Td>{inr(preview.amount)}</Td>
                </Tr>
              </tbody>
            </table>
            <div className="grid gap-1.5 px-5 py-4 text-sm">
              <Row label="Taxable Amount" value={inr(preview.amount)} />
              <Row label={`CGST @ ${preview.gst / 2}%`} value={inr((preview.amount * preview.gst) / 200)} />
              <Row label={`SGST @ ${preview.gst / 2}%`} value={inr((preview.amount * preview.gst) / 200)} />
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold text-navy">
                <span>Grand Total</span>
                <span>{inr(preview.amount * (1 + preview.gst / 100))}</span>
              </div>
              <div className="mt-3">
                <Badge>{preview.status}</Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-slate-600">
      <span>{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}
