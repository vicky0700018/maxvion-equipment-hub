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
import { daysBetween, newId, type Warranty } from "../lib/erp-data";

export const Route = createFileRoute("/admin/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty Tracking — MAXVION ERP Demo" },
      {
        name: "description",
        content: "Warranty coverage, expiry countdown and status for every serialized medical and scientific equipment unit.",
      },
      { property: "og:title", content: "MAXVION ERP — Warranty" },
      { property: "og:description", content: "Visual warranty countdown across the installed equipment base." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WarrantyPage,
});

const wStatuses = ["Active", "Expiring Soon", "Expired"];

const blank = {
  equipment: "",
  serial: "",
  customer: "",
  start: "2026-01-01",
  end: "2028-01-01",
  status: "Active" as Warranty["status"],
};

function Bar({ start, end }: { start: string; end: string }) {
  const total = Math.max(1, (new Date(end).getTime() - new Date(start).getTime()) / 86400000);
  const left = daysBetween(end);
  const pct = Math.max(0, Math.min(100, Math.round((left / total) * 100)));
  const tone = left < 0 ? "bg-rose-500" : pct <= 20 ? "bg-amber-500" : "bg-teal";
  return (
    <div className="min-w-[120px]">
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
        <div className={`h-full rounded-full transition-all duration-500 ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] font-semibold text-slate-500">
        {left < 0 ? `Expired ${Math.abs(left)} days ago` : `${left} days remaining`}
      </p>
    </div>
  );
}

function WarrantyPage() {
  const warranties = useStore((s) => s.warranties);
  const customers = useStore((s) => s.customers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Warranty | null>(null);
  const [form, setForm] = useState({ ...blank });

  const t = useTableTools(
    warranties as unknown as Record<string, unknown>[],
    ["equipment", "serial", "customer"],
    "status",
  );
  const rows = t.filtered as unknown as Warranty[];

  const save = () => {
    if (!form.equipment) return;
    if (editing) updateRecord("warranties", { ...editing, ...form }, "Warranty record");
    else addRecord("warranties", { id: newId("WTY"), ...form }, "Warranty record");
    setOpen(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...blank, customer: customers[0]?.name ?? "" });
    setOpen(true);
  };

  return (
    <AdminShell
      title="Warranty"
      subtitle="Warranty coverage windows and expiry countdown for serialized equipment."
      breadcrumb="Warranty"
      actions={
        <Button size="sm" onClick={openNew}>
          + Add Warranty
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Records" value={String(warranties.length)} sub="Warranty entries" />
        <Kpi
          label="Active Warranty"
          value={String(warranties.filter((w) => w.status === "Active").length)}
          sub="Fully covered units"
          tone="teal"
        />
        <Kpi
          label="Expiring Soon"
          value={String(warranties.filter((w) => w.status === "Expiring Soon").length)}
          sub="Renewal / AMC conversion"
          tone="amber"
        />
        <Kpi
          label="Expired"
          value={String(warranties.filter((w) => w.status === "Expired").length)}
          sub="Out of coverage"
          tone="navy"
        />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search equipment, serial or customer"
        action={
          <Button size="sm" onClick={openNew}>
            + Add Warranty
          </Button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState title="No warranty records match this filter" hint="Try another status or search term." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>
                <button onClick={() => t.toggleSort("equipment")} className="uppercase hover:text-medblue">
                  Equipment
                </button>
              </Th>
              <Th>Serial Number</Th>
              <Th>Customer</Th>
              <Th>Warranty Start</Th>
              <Th>
                <button onClick={() => t.toggleSort("end")} className="uppercase hover:text-medblue">
                  Warranty End
                </button>
              </Th>
              <Th>Countdown</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <Tr key={w.id}>
                <Td className="font-semibold text-navy">{w.equipment}</Td>
                <Td className="font-mono text-xs">{w.serial}</Td>
                <Td>{w.customer}</Td>
                <Td className="whitespace-nowrap">{w.start}</Td>
                <Td className="whitespace-nowrap">{w.end}</Td>
                <Td>
                  <Bar start={w.start} end={w.end} />
                </Td>
                <Td>
                  <Badge>{w.status}</Badge>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(w);
                        setForm({ ...w });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("warranties", w.id, "Warranty record")}>
                      Delete
                    </Button>
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
        title={editing ? "Update Warranty" : "Add Warranty"}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Add Warranty"}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Equipment" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} />
          <Input label="Serial Number" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
          <Select
            label="Customer"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            options={customers.map((c) => c.name)}
          />
          <Input label="Warranty Start" type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
          <Input label="Warranty End" type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Warranty["status"] })}
            options={wStatuses}
          />
        </div>
      </Modal>
    </AdminShell>
  );
}
