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
import { categories, inr, newId, type Product } from "../lib/erp-data";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Equipment Inventory — MAXVION ERP Demo" },
      { name: "description", content: "Serialized and batch-tracked inventory of medical, surgical and scientific equipment with warranty and AMC status." },
      { property: "og:title", content: "MAXVION ERP — Inventory" },
      { property: "og:description", content: "Warehouse, serial, batch, warranty and AMC tracking for equipment stock." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Inventory,
});

const warehouses = ["Hinjawadi WH-1", "Hinjawadi WH-2", "Chakan WH-3"];
const blank: Omit<Product, "id"> = {
  name: "",
  category: categories[0]!,
  sku: "",
  serial: "—",
  batch: "—",
  qty: 1,
  warehouse: warehouses[0]!,
  purchasePrice: 0,
  sellingPrice: 0,
  warranty: "12 Months",
  amc: "Not Applicable",
  stock: "In Stock",
};

function Inventory() {
  const products = useStore((s) => s.products);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...blank });

  const t = useTableTools(products as unknown as Record<string, unknown>[], ["name", "sku", "serial", "batch", "warehouse"], "category");
  const rows = t.filtered as unknown as Product[];

  const save = () => {
    if (!form.name) return;
    if (editing) updateRecord("products", { ...editing, ...form }, "Equipment");
    else addRecord("products", { id: newId("PR"), ...form }, "Equipment");
    setOpen(false);
  };

  const value = products.reduce((a, p) => a + p.sellingPrice * p.qty, 0);

  return (
    <AdminShell
      title="Inventory"
      subtitle="Serialized equipment, batch-tracked consumables, warehouse allocation and stock status."
      breadcrumb="Inventory"
      actions={<Button size="sm" onClick={() => { setEditing(null); setForm({ ...blank }); setOpen(true); }}>+ Add Equipment</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Inventory Value" value={inr(value)} sub="At selling price" tone="navy" />
        <Kpi label="Line Items" value={String(products.length)} sub="Across 3 warehouses" />
        <Kpi label="Low / Out of Stock" value={String(products.filter((p) => p.stock !== "In Stock").length)} sub="Requires reorder" tone="amber" />
        <Kpi label="Under AMC" value={String(products.filter((p) => p.amc === "Active").length)} sub="Serialized units" tone="teal" />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search product, SKU, serial or batch"
        action={<Button size="sm" onClick={() => { setEditing(null); setForm({ ...blank }); setOpen(true); }}>+ Add Equipment</Button>}
      />

      {rows.length === 0 ? (
        <EmptyState title="No inventory items found" hint="Adjust filters or add new equipment to the ledger." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Product ID</Th>
              <Th><button onClick={() => t.toggleSort("name")} className="uppercase hover:text-medblue">Product Name</button></Th>
              <Th>Category</Th>
              <Th>SKU</Th>
              <Th>Serial Number</Th>
              <Th>Batch</Th>
              <Th><button onClick={() => t.toggleSort("qty")} className="uppercase hover:text-medblue">Qty</button></Th>
              <Th>Warehouse</Th>
              <Th>Purchase</Th>
              <Th>Selling</Th>
              <Th>Warranty</Th>
              <Th>AMC</Th>
              <Th>Stock</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <Tr key={p.id}>
                <Td className="font-mono text-xs">{p.id}</Td>
                <Td className="font-semibold text-navy">{p.name}</Td>
                <Td className="text-xs">{p.category}</Td>
                <Td className="font-mono text-xs">{p.sku}</Td>
                <Td className="font-mono text-xs">{p.serial}</Td>
                <Td className="text-xs">{p.batch}</Td>
                <Td className="font-semibold text-navy">{p.qty}</Td>
                <Td className="text-xs whitespace-nowrap">{p.warehouse}</Td>
                <Td>{inr(p.purchasePrice)}</Td>
                <Td className="font-semibold text-navy">{inr(p.sellingPrice)}</Td>
                <Td className="text-xs whitespace-nowrap">{p.warranty}</Td>
                <Td><Badge>{p.amc}</Badge></Td>
                <Td><Badge>{p.stock}</Badge></Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(p); setForm({ ...p }); setOpen(true); }}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("products", p.id, "Equipment")}>Delete</Button>
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
        title={editing ? "Edit Equipment" : "Add Equipment"}
        description="Inventory record with serial/batch, warranty and AMC state."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Add Equipment"}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={categories} />
          <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <Input label="Serial Number" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
          <Input label="Batch Number" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
          <Input label="Quantity" type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
          <Select label="Warehouse" value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })} options={warehouses} />
          <Input label="Purchase Price (₹)" type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })} />
          <Input label="Selling Price (₹)" type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })} />
          <Select label="Warranty" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} options={["Not Applicable", "12 Months", "18 Months", "24 Months", "36 Months"]} />
          <Select label="AMC Status" value={form.amc} onChange={(e) => setForm({ ...form, amc: e.target.value as Product["amc"] })} options={["Active", "Expiring", "Expired", "Not Applicable"]} />
          <Select label="Stock Status" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value as Product["stock"] })} options={["In Stock", "Low Stock", "Out of Stock"]} />
        </div>
      </Modal>
    </AdminShell>
  );
}
