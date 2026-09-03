import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Kpi,
  Modal,
  TableWrap,
  Td,
  Th,
  Toolbar,
  Tr,
  useTableTools,
} from "../components/kit";
import { useStore } from "../lib/erp-store";
import { daysBetween, type SerialRecord } from "../lib/erp-data";

export const Route = createFileRoute("/admin/serial-numbers")({
  head: () => ({
    meta: [
      { title: "Serial Number Tracking — MAXVION ERP Demo" },
      {
        name: "description",
        content:
          "Track every high-value medical and scientific equipment unit by unique serial number, with full lifecycle timeline and service history.",
      },
      { property: "og:title", content: "MAXVION ERP — Serial Number Tracking" },
      { property: "og:description", content: "Equipment lifecycle from purchase to calibration, per serial number." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SerialNumbers,
});

function SerialNumbers() {
  const serials = useStore((s) => s.serials);
  const [detail, setDetail] = useState<SerialRecord | null>(null);

  const t = useTableTools(
    serials as unknown as Record<string, unknown>[],
    ["serial", "equipment", "customer"],
    "status",
  );
  const rows = t.filtered as unknown as SerialRecord[];

  const installed = serials.filter((s) => s.status === "Installed").length;
  const repair = serials.filter((s) => s.status === "Under Repair").length;
  const calSoon = serials.filter((s) => daysBetween(s.calibrationDue) <= 30).length;

  return (
    <AdminShell
      title="Serial Number Tracking"
      subtitle="Unique factory serial numbers with complete equipment lifecycle and service history."
      breadcrumb="Serial Numbers"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Tracked Units" value={String(serials.length)} sub="Serialized high-value assets" />
        <Kpi label="Installed at Site" value={String(installed)} sub="Commissioned equipment" tone="teal" />
        <Kpi label="Under Repair" value={String(repair)} sub="Currently in technical service" tone="amber" />
        <Kpi label="Calibration ≤ 30 Days" value={String(calSoon)} sub="Upcoming compliance actions" tone="navy" />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search serial number, equipment or customer"
      />

      {rows.length === 0 ? (
        <EmptyState title="No serialized units match this filter" hint="Try a different status or search term." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>
                <button onClick={() => t.toggleSort("serial")} className="uppercase hover:text-medblue">
                  Serial Number
                </button>
              </Th>
              <Th>Equipment</Th>
              <Th>Customer</Th>
              <Th>Installed</Th>
              <Th>Warranty Expiry</Th>
              <Th>AMC Expiry</Th>
              <Th>Last Service</Th>
              <Th>Next Service</Th>
              <Th>Calibration Due</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <Tr key={s.id}>
                <Td className="font-mono text-xs font-semibold text-navy">{s.serial}</Td>
                <Td className="font-semibold text-navy">{s.equipment}</Td>
                <Td>{s.customer}</Td>
                <Td className="whitespace-nowrap">{s.installed}</Td>
                <Td className="whitespace-nowrap">{s.warrantyExpiry}</Td>
                <Td className="whitespace-nowrap">{s.amcExpiry}</Td>
                <Td className="whitespace-nowrap">{s.lastService}</Td>
                <Td className="whitespace-nowrap">{s.nextService}</Td>
                <Td className="whitespace-nowrap">
                  <span className={daysBetween(s.calibrationDue) <= 30 ? "font-semibold text-amber-600" : ""}>
                    {s.calibrationDue}
                  </span>
                </Td>
                <Td>
                  <Badge>{s.status}</Badge>
                </Td>
                <Td>
                  <Button size="sm" variant="outline" onClick={() => setDetail(s)}>
                    Lifecycle
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.equipment ?? ""}
        description={detail ? `Serial ${detail.serial} · ${detail.customer}` : undefined}
      >
        {detail && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Installation Date", detail.installed],
                ["Warranty Expiry", detail.warrantyExpiry],
                ["AMC Expiry", detail.amcExpiry],
                ["Last Service", detail.lastService],
                ["Next Service", detail.nextService],
                ["Calibration Due", detail.calibrationDue],
              ].map(([k, v]) => (
                <Card key={k} className="bg-surface p-4">
                  <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{k}</p>
                  <p className="mt-1 font-semibold text-navy">{v}</p>
                </Card>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wide text-navy uppercase">Equipment Timeline</h4>
              <ol className="mt-4 space-y-0">
                {detail.timeline.map((step, i) => (
                  <li key={step.stage} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-medblue text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      {i < detail.timeline.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-navy">{step.stage}</p>
                      <p className="text-xs text-slate-500">
                        {step.date} — {step.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wide text-navy uppercase">Service History</h4>
              <div className="mt-3 space-y-2">
                {detail.history.map((h) => (
                  <div
                    key={h.date + h.type}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy">{h.type}</p>
                      <p className="text-xs text-slate-500">{h.remarks}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p className="font-semibold text-navy">{h.date}</p>
                      <p>Engineer: {h.engineer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
