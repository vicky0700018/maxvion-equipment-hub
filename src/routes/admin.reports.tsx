import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import { BarChart, Badge, Button, Card, Kpi, ProgressRow, TableWrap, Td, Th, Tr } from "../components/kit";
import { useStore } from "../lib/erp-store";
import { inr } from "../lib/erp-data";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — MAXVION ERP Demo" },
      { name: "description", content: "Operational reports for sales, inventory, service, AMC, calibration, warranty and procurement." },
      { property: "og:title", content: "MAXVION ERP — Reports" },
      { property: "og:description", content: "Pure CSS operational analytics for MAXVION equipment operations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportsPage,
});

const reportTabs = ["Overview", "Sales", "Service & AMC", "Inventory", "Compliance"] as const;

function ReportsPage() {
  const s = useStore((state) => state);
  const [tab, setTab] = useState<(typeof reportTabs)[number]>("Overview");
  const sales = s.invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const receivables = s.customers.reduce((sum, customer) => sum + customer.outstanding, 0);
  const inventory = s.products.reduce((sum, product) => sum + product.sellingPrice * product.qty, 0);
  const openTickets = s.tickets.filter((ticket) => !["Resolved", "Closed"].includes(ticket.status)).length;
  const activeAmc = s.amcs.filter((amc) => amc.status === "Active").length;
  const compliant = s.calibrations.filter((record) => record.status === "Compliant").length;
  const monthly = [
    { label: "Apr", value: 3820000 }, { label: "May", value: 4410000 }, { label: "Jun", value: 3960000 },
    { label: "Jul", value: 5240000 }, { label: "Aug", value: 6180000 }, { label: "Sep", value: sales },
  ];
  const categoryRows = Array.from(new Set(s.products.map((product) => product.category))).map((category) => ({
    category,
    value: s.products.filter((product) => product.category === category).reduce((sum, product) => sum + product.sellingPrice * product.qty, 0),
  })).sort((a, b) => b.value - a.value).slice(0, 6);

  return (
    <AdminShell title="Reports & Analytics" subtitle="Decision-ready views across financial, equipment lifecycle and service operations." breadcrumb="Reports" actions={<Button size="sm" variant="outline" onClick={() => window.print()}>Print Report</Button>}>
      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {reportTabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${tab === item ? "bg-lightblue text-medblue" : "text-slate-500 hover:bg-surface hover:text-navy"}`}>{item}</button>)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Sales Value" value={inr(sales)} sub="Invoice taxable value" trend="9.2% MoM" />
        <Kpi label="Receivables" value={inr(receivables)} sub="Institutional buyers" tone="amber" />
        <Kpi label="Inventory Valuation" value={inr(inventory)} sub="At current selling price" tone="navy" />
        <Kpi label="Compliance Health" value={`${Math.round((compliant / Math.max(s.calibrations.length, 1)) * 100)}%`} sub={`${compliant} valid calibration records`} tone="teal" />
      </div>

      {tab === "Overview" || tab === "Sales" ? <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg">Monthly institutional sales</h2><p className="text-xs text-slate-500">Invoice value by month · FY 2026–27</p></div><Badge tone="teal">{tab} report</Badge></div><div className="mt-6"><BarChart data={monthly} unit="₹" /></div></Card>
        <Card><h2 className="text-lg">Sales mix by category</h2><p className="mt-1 text-xs text-slate-500">Current inventory value contribution.</p><div className="mt-5 space-y-4">{categoryRows.map((row) => <ProgressRow key={row.category} label={row.category} value={row.value} max={categoryRows[0]?.value ?? 1} tone={row.category.includes("Scientific") ? "teal" : "blue"} />)}</div></Card>
      </div> : null}

      {tab === "Overview" || tab === "Service & AMC" ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Open Service Tickets" value={String(openTickets)} sub="Technical jobs in queue" tone="amber" /><Kpi label="Active AMC" value={String(activeAmc)} sub="Running service contracts" tone="teal" /><Kpi label="Pending Calibration" value={String(s.calibrations.length - compliant)} sub="Due soon or overdue" tone="amber" /><Kpi label="Warranty Alerts" value={String(s.warranties.filter((w) => w.status !== "Active").length)} sub="Expiry follow-up" tone="navy" />
      </div> : null}

      {tab === "Overview" || tab === "Inventory" ? <Card><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg">Inventory valuation report</h2><p className="text-xs text-slate-500">Top equipment lines by current selling value.</p></div><Badge>{s.products.length} line items</Badge></div><div className="mt-4"><TableWrap><thead><tr><Th>Equipment</Th><Th>Category</Th><Th>Units</Th><Th>Unit Value</Th><Th>Total Value</Th><Th>Stock</Th></tr></thead><tbody>{[...s.products].sort((a, b) => b.sellingPrice * b.qty - a.sellingPrice * a.qty).slice(0, 6).map((p) => <Tr key={p.id}><Td className="font-semibold text-navy">{p.name}</Td><Td>{p.category}</Td><Td>{p.qty}</Td><Td>{inr(p.sellingPrice)}</Td><Td className="font-semibold text-navy">{inr(p.sellingPrice * p.qty)}</Td><Td><Badge>{p.stock}</Badge></Td></Tr>)}</tbody></TableWrap></div></Card> : null}

      {tab === "Compliance" ? <div className="grid gap-5 lg:grid-cols-2"><Card><h2 className="text-lg">Compliance report</h2><p className="mt-1 text-xs text-slate-500">Regulated equipment readiness at a glance.</p><div className="mt-5 space-y-5"><ProgressRow label="Calibration compliant" value={compliant} max={s.calibrations.length} tone="teal" /><ProgressRow label="Safety certificates valid" value={s.calibrations.filter((c) => c.safetyCert === "Valid").length} max={s.calibrations.length} /><ProgressRow label="Warranty coverage active" value={s.warranties.filter((w) => w.status === "Active").length} max={s.warranties.length} tone="amber" /><ProgressRow label="AMC coverage active" value={activeAmc} max={s.amcs.length} tone="blue" /></div></Card><Card><h2 className="text-lg">Report catalogue</h2><p className="mt-1 text-xs text-slate-500">Available operational exports for the demo.</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{["Sales Report", "Receivables Report", "AMC Report", "Service Report", "Calibration Report", "Warranty Expiry Report", "Purchase Report", "GST Summary"].map((name) => <div key={name} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-3 text-sm font-semibold text-navy"><span>{name}</span><span className="text-medblue">→</span></div>)}</div></Card></div> : null}
    </AdminShell>
  );
}