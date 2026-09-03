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
import { daysBetween, engineers, newId, type AMC } from "../lib/erp-data";

export const Route = createFileRoute("/admin/amc")({
  head: () => ({
    meta: [
      { title: "AMC Contracts — MAXVION ERP Demo" },
      {
        name: "description",
        content: "Annual maintenance contracts, renewal countdowns and preventive service schedules for institutional equipment.",
      },
      { property: "og:title", content: "MAXVION ERP — AMC Contracts" },
      { property: "og:description", content: "Contract periods, engineers and expiry countdown badges." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AmcPage,
});

const amcStatuses = ["Active", "Due Soon", "Expired", "Service Pending"];

const blank = {
  customer: "",
  equipment: "",
  serial: "",
  start: "2026-09-01",
  end: "2027-08-31",
  nextService: "2026-12-01",
  engineer: engineers[0]!,
  status: "Active" as AMC["status"],
};

function Countdown({ end }: { end: string }) {
  const d = daysBetween(end);
  if (d < 0) return <Badge tone="red">Expired {Math.abs(d)}d ago</Badge>;
  if (d <= 30) return <Badge tone="amber">{d} days left</Badge>;
  return <Badge tone="green">{d} days left</Badge>;
}

function AmcPage() {
  const amcs = useStore((s) => s.amcs);
  const customers = useStore((s) => s.customers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AMC | null>(null);
  const [form, setForm] = useState({ ...blank });

  const t = useTableTools(
    amcs as unknown as Record<string, unknown>[],
    ["id", "customer", "equipment", "serial", "engineer"],
    "status",
  );
  const rows = t.filtered as unknown as AMC[];

  const expiringMonth = amcs.filter((a) => daysBetween(a.end) >= 0 && daysBetween(a.end) <= 30).length;

  const save = () => {
    if (!form.customer || !form.equipment) return;
    if (editing) updateRecord("amcs", { ...editing, ...form }, "AMC contract");
    else addRecord("amcs", { id: newId("AMC"), ...form }, "AMC contract");
    setOpen(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...blank, customer: customers[0]?.name ?? "" });
    setOpen(true);
  };

  return (
    <AdminShell
      title="AMC Contracts"
      subtitle="Annual maintenance agreements with renewal countdowns and assigned service engineers."
      breadcrumb="AMC Contracts"
      actions={
        <Button size="sm" onClick={openNew}>
          + Add Contract
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Active AMC" value={String(amcs.filter((a) => a.status === "Active").length)} sub="Running contracts" tone="teal" />
        <Kpi label="Expiring This Month" value={String(expiringMonth)} sub="Renewal follow-up" tone="amber" />
        <Kpi label="Service Pending" value={String(amcs.filter((a) => a.status === "Service Pending").length)} sub="Visit not completed" tone="amber" />
        <Kpi label="Due Soon" value={String(amcs.filter((a) => a.status === "Due Soon").length)} sub="Approaching expiry" />
        <Kpi label="Expired" value={String(amcs.filter((a) => a.status === "Expired").length)} sub="Requires renewal" tone="navy" />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search AMC, customer, serial or engineer"
        action={
          <Button size="sm" onClick={openNew}>
            + Add Contract
          </Button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState title="No AMC contracts match this filter" hint="Try another status or search term." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>AMC ID</Th>
              <Th>
                <button onClick={() => t.toggleSort("customer")} className="uppercase hover:text-medblue">
                  Customer
                </button>
              </Th>
              <Th>Equipment</Th>
              <Th>Serial Number</Th>
              <Th>Contract Start</Th>
              <Th>
                <button onClick={() => t.toggleSort("end")} className="uppercase hover:text-medblue">
                  Contract End
                </button>
              </Th>
              <Th>Countdown</Th>
              <Th>Next Service</Th>
              <Th>Engineer</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <Tr key={a.id}>
                <Td className="font-mono text-xs font-semibold text-navy">{a.id}</Td>
                <Td className="font-semibold text-navy">{a.customer}</Td>
                <Td>{a.equipment}</Td>
                <Td className="font-mono text-xs">{a.serial}</Td>
                <Td className="whitespace-nowrap">{a.start}</Td>
                <Td className="whitespace-nowrap">{a.end}</Td>
                <Td>
                  <Countdown end={a.end} />
                </Td>
                <Td className="whitespace-nowrap">{a.nextService}</Td>
                <Td className="whitespace-nowrap">{a.engineer}</Td>
                <Td>
                  <Badge>{a.status}</Badge>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(a);
                        setForm({ ...a });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("amcs", a.id, "AMC contract")}>
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
        title={editing ? "Update AMC Contract" : "Add AMC Contract"}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Add Contract"}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Customer"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            options={customers.map((c) => c.name)}
          />
          <Input label="Equipment" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} />
          <Input label="Serial Number" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
          <Input label="Contract Start" type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
          <Input label="Contract End" type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
          <Input
            label="Next Service"
            type="date"
            value={form.nextService}
            onChange={(e) => setForm({ ...form, nextService: e.target.value })}
          />
          <Select
            label="Engineer"
            value={form.engineer}
            onChange={(e) => setForm({ ...form, engineer: e.target.value })}
            options={engineers}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as AMC["status"] })}
            options={amcStatuses}
          />
        </div>
      </Modal>
    </AdminShell>
  );
}
