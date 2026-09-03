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
import { daysBetween, newId, type Calibration } from "../lib/erp-data";

export const Route = createFileRoute("/admin/calibration")({
  head: () => ({
    meta: [
      { title: "Calibration Ledger — MAXVION ERP Demo" },
      {
        name: "description",
        content: "Calibration schedules, certificates and sterilization records for scientific and diagnostic equipment.",
      },
      { property: "og:title", content: "MAXVION ERP — Calibration Ledger" },
      { property: "og:description", content: "Track calibration due dates, certificates and compliance status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CalibrationPage,
});

const calStatuses = ["Compliant", "Due Soon", "Overdue"];
const certStatuses = ["Valid", "Expiring", "Expired"];

const blank = {
  equipment: "",
  serial: "",
  customer: "",
  last: "2026-03-01",
  next: "2027-03-01",
  certificate: "",
  safetyCert: "Valid" as Calibration["safetyCert"],
  sterilization: "2026-08-01",
  status: "Compliant" as Calibration["status"],
};

export function CalibrationAlert({ next }: { next: string }) {
  const d = daysBetween(next);
  if (d < 0) return <Badge tone="red">⚠ Overdue by {Math.abs(d)}d</Badge>;
  if (d <= 30) return <Badge tone="amber">⚠ Due in {d}d</Badge>;
  return <Badge tone="green">In {d}d</Badge>;
}

function CalibrationPage() {
  const calibrations = useStore((s) => s.calibrations);
  const customers = useStore((s) => s.customers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Calibration | null>(null);
  const [form, setForm] = useState({ ...blank });

  const t = useTableTools(
    calibrations as unknown as Record<string, unknown>[],
    ["equipment", "serial", "customer", "certificate"],
    "status",
  );
  const rows = t.filtered as unknown as Calibration[];

  const dueSoon = calibrations.filter((c) => daysBetween(c.next) >= 0 && daysBetween(c.next) <= 30).length;
  const overdue = calibrations.filter((c) => daysBetween(c.next) < 0).length;

  const save = () => {
    if (!form.equipment) return;
    if (editing) updateRecord("calibrations", { ...editing, ...form }, "Calibration record");
    else addRecord("calibrations", { id: newId("CAL"), ...form }, "Calibration record");
    setOpen(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...blank, customer: customers[0]?.name ?? "" });
    setOpen(true);
  };

  return (
    <AdminShell
      title="Calibration Ledger"
      subtitle="Precision calibration schedules, certificates and sterilization records for regulated equipment."
      breadcrumb="Calibration"
      actions={
        <Button size="sm" onClick={openNew}>
          + Add Record
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Calibration Due Soon" value={String(dueSoon)} sub="Within next 30 days" tone="amber" />
        <Kpi label="Overdue Calibration" value={String(overdue)} sub="Immediate action required" tone="navy" />
        <Kpi
          label="Valid Certifications"
          value={String(calibrations.filter((c) => c.safetyCert === "Valid").length)}
          sub="Safety certificates in force"
          tone="teal"
        />
        <Kpi
          label="Expiring Certifications"
          value={String(calibrations.filter((c) => c.safetyCert === "Expiring").length)}
          sub="Renewal in progress"
        />
      </div>

      {overdue > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          <span className="text-lg text-rose-600">⚠</span>
          <p className="text-sm text-rose-700">
            <span className="font-bold">{overdue} equipment unit(s)</span> have overdue calibration. Schedule a
            technical visit to restore compliance.
          </p>
        </div>
      )}

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search equipment, serial, customer or certificate"
        action={
          <Button size="sm" onClick={openNew}>
            + Add Record
          </Button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState title="No calibration records match this filter" hint="Try another status or search term." />
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
              <Th>Last Calibration</Th>
              <Th>
                <button onClick={() => t.toggleSort("next")} className="uppercase hover:text-medblue">
                  Next Calibration
                </button>
              </Th>
              <Th>Alert</Th>
              <Th>Certificate</Th>
              <Th>Safety Certification</Th>
              <Th>Sterilization</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <Tr key={c.id}>
                <Td className="font-semibold text-navy">{c.equipment}</Td>
                <Td className="font-mono text-xs">{c.serial}</Td>
                <Td>{c.customer}</Td>
                <Td className="whitespace-nowrap">{c.last}</Td>
                <Td className="whitespace-nowrap">{c.next}</Td>
                <Td>
                  <CalibrationAlert next={c.next} />
                </Td>
                <Td className="font-mono text-xs">{c.certificate}</Td>
                <Td>
                  <Badge>{c.safetyCert}</Badge>
                </Td>
                <Td className="whitespace-nowrap">{c.sterilization}</Td>
                <Td>
                  <Badge>{c.status}</Badge>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(c);
                        setForm({ ...c });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteRecord("calibrations", c.id, "Calibration record")}
                    >
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
        title={editing ? "Update Calibration Record" : "Add Calibration Record"}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Add Record"}</Button>
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
          <Input label="Last Calibration" type="date" value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} />
          <Input label="Next Calibration" type="date" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
          <Input
            label="Calibration Certificate"
            value={form.certificate}
            onChange={(e) => setForm({ ...form, certificate: e.target.value })}
          />
          <Select
            label="Safety Certification"
            value={form.safetyCert}
            onChange={(e) => setForm({ ...form, safetyCert: e.target.value as Calibration["safetyCert"] })}
            options={certStatuses}
          />
          <Input
            label="Sterilization Date"
            type="date"
            value={form.sterilization}
            onChange={(e) => setForm({ ...form, sterilization: e.target.value })}
          />
          <Select
            label="Compliance Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Calibration["status"] })}
            options={calStatuses}
          />
        </div>
      </Modal>
    </AdminShell>
  );
}
