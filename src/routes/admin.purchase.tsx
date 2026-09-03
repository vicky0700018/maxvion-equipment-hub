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
import { inr, newId, type Purchase } from "../lib/erp-data";

export const Route = createFileRoute("/admin/purchase")({
  head: () => ({
    meta: [
      { title: "Purchase Orders — MAXVION ERP Demo" },
      { name: "description", content: "Purchase order tracking for medical, surgical and scientific equipment vendors." },
      { property: "og:title", content: "MAXVION ERP — Purchase Orders" },
      { property: "og:description", content: "Track supplier orders, delivery dates and receiving status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PurchasePage,
});

const statuses: Purchase["status"][] = ["Draft", "Ordered", "Partially Received", "Received", "Cancelled"];

const blank = {
  vendor: "",
  equipment: "",
  qty: 1,
  amount: 0,
  delivery: "2026-10-01",
  status: "Draft" as Purchase["status"],
};

function PurchasePage() {
  const purchases = useStore((s) => s.purchases);
  const vendors = useStore((s) => s.vendors);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Purchase | null>(null);
  const [form, setForm] = useState({ ...blank });
  const tools = useTableTools(
    purchases as unknown as Record<string, unknown>[],
    ["no", "vendor", "equipment"],
    "status",
  );
  const rows = tools.filtered as unknown as Purchase[];

  const openNew = () => {
    setEditing(null);
    setForm({ ...blank, vendor: vendors[0]?.name ?? "" });
    setOpen(true);
  };

  const save = () => {
    if (!form.vendor || !form.equipment || form.amount <= 0) return;
    const record = { ...form, qty: Number(form.qty), amount: Number(form.amount) };
    if (editing) updateRecord("purchases", { ...editing, ...record }, "Purchase order");
    else addRecord("purchases", { id: newId("PO"), no: `MAX/PO/2026-0${97 + purchases.length}`, ...record }, "Purchase order");
    setOpen(false);
  };

  const orderedValue = purchases
    .filter((p) => ["Ordered", "Partially Received"].includes(p.status))
    .reduce((total, p) => total + p.amount, 0);

  return (
    <AdminShell
      title="Purchase Orders"
      subtitle="Supplier orders, expected deliveries and goods-received status for equipment procurement."
      breadcrumb="Purchase"
      actions={<Button size="sm" onClick={openNew}>+ Create Purchase Order</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Open Orders" value={String(purchases.filter((p) => ["Ordered", "Partially Received"].includes(p.status)).length)} sub="In procurement" />
        <Kpi label="Order Value" value={inr(orderedValue)} sub="Open commitments" tone="navy" />
        <Kpi label="Received" value={String(purchases.filter((p) => p.status === "Received").length)} sub="Closed procurement" tone="teal" />
        <Kpi label="Due in 30 Days" value={String(purchases.filter((p) => p.status !== "Cancelled" && new Date(p.delivery) >= new Date("2026-09-03") && new Date(p.delivery) <= new Date("2026-10-03")).length)} sub="Delivery follow-up" tone="amber" />
      </div>

      <Toolbar
        query={tools.query}
        setQuery={tools.setQuery}
        status={tools.status}
        setStatus={tools.setStatus}
        statuses={tools.statuses}
        placeholder="Search PO, vendor or equipment"
        action={<Button size="sm" onClick={openNew}>+ Create Purchase Order</Button>}
      />

      {rows.length === 0 ? (
        <EmptyState title="No purchase orders match this filter" hint="Try another status or search term." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th><button onClick={() => tools.toggleSort("no")} className="uppercase hover:text-medblue">PO Number</button></Th>
              <Th>Vendor</Th>
              <Th>Equipment</Th>
              <Th><button onClick={() => tools.toggleSort("qty")} className="uppercase hover:text-medblue">Quantity</button></Th>
              <Th><button onClick={() => tools.toggleSort("amount")} className="uppercase hover:text-medblue">Amount</button></Th>
              <Th>Expected Delivery</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <Tr key={p.id}>
                <Td className="font-mono text-xs font-semibold text-navy">{p.no}</Td>
                <Td className="font-semibold text-navy">{p.vendor}</Td>
                <Td>{p.equipment}</Td>
                <Td>{p.qty.toLocaleString("en-IN")}</Td>
                <Td className="font-semibold text-navy">{inr(p.amount)}</Td>
                <Td className="whitespace-nowrap">{p.delivery}</Td>
                <Td><Badge>{p.status}</Badge></Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(p); setForm({ vendor: p.vendor, equipment: p.equipment, qty: p.qty, amount: p.amount, delivery: p.delivery, status: p.status }); setOpen(true); }}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("purchases", p.id, "Purchase order")}>Delete</Button>
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
        title={editing ? "Edit Purchase Order" : "Create Purchase Order"}
        description="Add a supplier commitment to the procurement ledger."
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save Changes" : "Create Order"}</Button></>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} options={vendors.map((v) => v.name)} />
          <Input label="Equipment" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} />
          <Input label="Quantity" type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
          <Input label="Order Amount (₹)" type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          <Input label="Expected Delivery" type="date" value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Purchase["status"] })} options={statuses} />
        </div>
      </Modal>
    </AdminShell>
  );
}