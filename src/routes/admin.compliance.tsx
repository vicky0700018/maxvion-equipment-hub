import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import {
  Badge,
  Card,
  EmptyState,
  Kpi,
  ProgressRow,
  TableWrap,
  Td,
  Th,
  Toolbar,
  Tr,
  useTableTools,
} from "../components/kit";
import { useStore } from "../lib/erp-store";
import { daysBetween, type Calibration } from "../lib/erp-data";

export const Route = createFileRoute("/admin/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance Overview — MAXVION ERP Demo" },
      {
        name: "description",
        content: "Compliance ledger covering calibration validity, safety certification and sterilization for regulated equipment.",
      },
      { property: "og:title", content: "MAXVION ERP — Compliance" },
      { property: "og:description", content: "Certification validity and compliance health across the installed base." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CompliancePage,
});

function CompliancePage() {
  const calibrations = useStore((s) => s.calibrations);
  const serials = useStore((s) => s.serials);
  const amcs = useStore((s) => s.amcs);
  const warranties = useStore((s) => s.warranties);

  const t = useTableTools(
    calibrations as unknown as Record<string, unknown>[],
    ["equipment", "serial", "customer", "certificate"],
    "safetyCert",
  );
  const rows = t.filtered as unknown as Calibration[];

  const compliant = calibrations.filter((c) => c.status === "Compliant").length;
  const overdue = calibrations.filter((c) => c.status === "Overdue").length;
  const score = Math.round((compliant / Math.max(calibrations.length, 1)) * 100);

  return (
    <AdminShell
      title="Compliance"
      subtitle="Regulatory health of the installed equipment base — calibration, safety certification and sterilization."
      breadcrumb="Compliance"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Compliance Score" value={`${score}%`} sub="Equipment fully compliant" tone="teal" />
        <Kpi label="Compliant Units" value={String(compliant)} sub="All certificates valid" />
        <Kpi label="Non-Compliant" value={String(overdue)} sub="Overdue calibration" tone="amber" />
        <Kpi label="Serialized Assets" value={String(serials.length)} sub="Under compliance tracking" tone="navy" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-base font-bold text-navy">Compliance Health</h3>
          <p className="mt-1 text-xs text-slate-500">Share of records meeting each regulatory requirement.</p>
          <div className="mt-5 space-y-4">
            <ProgressRow label="Calibration valid" value={compliant} max={calibrations.length} tone="teal" />
            <ProgressRow
              label="Safety certification valid"
              value={calibrations.filter((c) => c.safetyCert === "Valid").length}
              max={calibrations.length}
            />
            <ProgressRow
              label="AMC coverage active"
              value={amcs.filter((a) => a.status === "Active").length}
              max={amcs.length}
              tone="blue"
            />
            <ProgressRow
              label="Warranty in force"
              value={warranties.filter((w) => w.status === "Active").length}
              max={warranties.length}
              tone="amber"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-bold text-navy">Certification Register</h3>
          <p className="mt-1 text-xs text-slate-500">Safety certificate validity by equipment unit.</p>
          <div className="mt-5 space-y-2">
            {calibrations.map((c) => {
              const d = daysBetween(c.next);
              return (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">{c.equipment}</p>
                    <p className="font-mono text-[11px] text-slate-500">{c.serial}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{c.safetyCert}</Badge>
                    <Badge tone={d < 0 ? "red" : d <= 30 ? "amber" : "green"}>
                      {d < 0 ? `${Math.abs(d)}d overdue` : `${d}d left`}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search equipment, serial or certificate"
      />

      {rows.length === 0 ? (
        <EmptyState title="No compliance records match this filter" hint="Try another certification state." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Equipment</Th>
              <Th>Serial Number</Th>
              <Th>Customer</Th>
              <Th>Certificate</Th>
              <Th>Safety Certification</Th>
              <Th>Last Sterilization</Th>
              <Th>Next Calibration</Th>
              <Th>Compliance Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <Tr key={c.id}>
                <Td className="font-semibold text-navy">{c.equipment}</Td>
                <Td className="font-mono text-xs">{c.serial}</Td>
                <Td>{c.customer}</Td>
                <Td className="font-mono text-xs">{c.certificate}</Td>
                <Td>
                  <Badge>{c.safetyCert}</Badge>
                </Td>
                <Td className="whitespace-nowrap">{c.sterilization}</Td>
                <Td className="whitespace-nowrap">{c.next}</Td>
                <Td>
                  <Badge>{c.status}</Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </AdminShell>
  );
}
