import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import { BarChart, Badge, Card, Kpi, ProgressRow, TableWrap, Td, Th, Tr } from "../components/kit";
import { useStore } from "../lib/erp-store";
import { inr } from "../lib/erp-data";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "ERP Dashboard — MAXVION Industrial ERP Demo" },
      { name: "description", content: "Operational overview of sales, receivables, AMC contracts, inventory and service jobs." },
      { property: "og:title", content: "MAXVION ERP Dashboard" },
      { property: "og:description", content: "Demo dashboard for equipment operations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = useStore((st) => st);
  const totalSales = s.invoices.reduce((a, i) => a + i.amount, 0);
  const outstanding = s.customers.reduce((a, c) => a + c.outstanding, 0);
  const inventoryValue = s.products.reduce((a, p) => a + p.sellingPrice * p.qty, 0);
  const activeAmc = s.amcs.filter((a) => a.status === "Active" || a.status === "Due Soon").length;
  const underService = s.tickets.filter((t) => !["Resolved", "Closed"].includes(t.status)).length;
  const pendingCal = s.calibrations.filter((c) => c.status !== "Compliant").length;
  const expiringWarranty = s.warranties.filter((w) => w.status !== "Active").length;
  const openQuotes = s.quotations.filter((q) => ["Draft", "Sent"].includes(q.status)).length;

  const monthly = [
    { label: "Apr", value: 3820000 },
    { label: "May", value: 4410000 },
    { label: "Jun", value: 3960000 },
    { label: "Jul", value: 5240000 },
    { label: "Aug", value: 6180000 },
    { label: "Sep", value: 2140000 },
  ];

  return (
    <AdminShell
      title="Good Morning, Admin"
      subtitle="Here's the latest overview of MAXVION operations."
      breadcrumb="Dashboard"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Sales" value={inr(totalSales)} sub="Financial year to date" trend="9.2% MoM" />
        <Kpi label="Outstanding Receivables" value={inr(outstanding)} sub="Institutional buyers" trend="-3.1%" tone="amber" />
        <Kpi label="Active AMC Contracts" value={String(activeAmc)} sub="Comprehensive & standard" trend="2 renewals" tone="teal" />
        <Kpi label="Inventory Value" value={inr(inventoryValue)} sub="Serialized & batch stock" trend="1.8%" tone="navy" />
        <Kpi label="Equipment Under Service" value={String(underService)} sub="Open technical jobs" trend="-2" tone="amber" />
        <Kpi label="Pending Calibration" value={String(pendingCal)} sub="Due soon or overdue" trend="1 overdue" tone="amber" />
        <Kpi label="Expiring Warranties" value={String(expiringWarranty)} sub="Within 60 days / expired" trend="2 alerts" tone="teal" />
        <Kpi label="Open Quotations" value={String(openQuotes)} sub="Draft and sent" trend="4 sent" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg">Monthly institutional sales</h2>
              <p className="text-xs text-slate-500">Invoice value across hospitals, labs and government buyers</p>
            </div>
            <Badge tone="teal">FY 2026-27</Badge>
          </div>
          <div className="mt-6">
            <BarChart data={monthly} unit="₹" />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg">Operational health</h2>
          <div className="mt-5 space-y-4">
            <ProgressRow label="AMC coverage" value={activeAmc} max={s.amcs.length} tone="teal" />
            <ProgressRow label="Calibration compliance" value={s.calibrations.length - pendingCal} max={s.calibrations.length} />
            <ProgressRow label="Service tickets closed" value={s.tickets.length - underService} max={s.tickets.length} tone="amber" />
            <ProgressRow label="Collection efficiency" value={62} max={100} />
          </div>
          <Link to="/admin/reports" className="mt-6 inline-block text-sm font-semibold text-medblue hover:underline">
            View full reports →
          </Link>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Recent invoices</h2>
            <Link to="/admin/sales" className="text-sm font-semibold text-medblue hover:underline">
              All sales →
            </Link>
          </div>
          <TableWrap>
            <thead>
              <tr>
                <Th>Invoice</Th>
                <Th>Customer</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {s.invoices.slice(0, 5).map((i) => (
                <Tr key={i.id}>
                  <Td className="font-mono text-xs font-semibold text-navy">{i.no}</Td>
                  <Td>{i.customer}</Td>
                  <Td className="font-semibold text-navy">{inr(i.amount)}</Td>
                  <Td>
                    <Badge>{i.status}</Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Priority service tickets</h2>
            <Link to="/admin/service" className="text-sm font-semibold text-medblue hover:underline">
              Service desk →
            </Link>
          </div>
          <TableWrap>
            <thead>
              <tr>
                <Th>Ticket</Th>
                <Th>Equipment</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {s.tickets.slice(0, 5).map((t) => (
                <Tr key={t.id}>
                  <Td className="font-mono text-xs font-semibold text-navy">{t.id}</Td>
                  <Td>{t.equipment}</Td>
                  <Td>
                    <Badge>{t.priority}</Badge>
                  </Td>
                  <Td>
                    <Badge>{t.status}</Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </div>
      </div>
    </AdminShell>
  );
}
