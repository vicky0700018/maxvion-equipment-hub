import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/PublicLayout";
import { Badge, Card, SectionTitle } from "../components/kit";
import { DashboardPreview, DemoCta, FeaturesGrid, PageHero } from "../components/public-sections";

export const Route = createFileRoute("/software-demo")({
  head: () => ({
    meta: [
      { title: "Industrial ERP Demo — Equipment Management Platform | MAXVION" },
      {
        name: "description",
        content:
          "Explore the MAXVION Industrial ERP demo: serialized asset tracking, AMC management, calibration ledger, warranty tracking and B2B GST billing.",
      },
      { property: "og:title", content: "MAXVION Industrial ERP & Equipment Management Demo" },
      { property: "og:description", content: "A demonstration platform for equipment lifecycle, service and compliance management." },
    ],
  }),
  component: SoftwareDemo,
});

const modules = [
  ["Sales & Invoices", "GST invoices with status tracking across institutional buyers."],
  ["Quotations & Proforma", "B2B quotations, validity tracking and proforma invoices with delivery terms."],
  ["Inventory", "Serialized units, batch tracking, warehouse allocation and stock status."],
  ["Serial Number Ledger", "Full lifecycle timeline from purchase to installation and service."],
  ["Service & AMC", "Contracts, engineers, next service dates and expiry countdowns."],
  ["Calibration & Compliance", "Certificate validity, sterilization records and overdue alerts."],
  ["Warranty", "Coverage windows with visual countdown to expiry."],
  ["Purchase & Vendors", "Purchase orders, vendor payables and delivery status."],
  ["Reports", "Sales, receivables, inventory valuation, AMC and compliance reporting."],
];

function SoftwareDemo() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Industrial ERP Demo"
        title="MAXVION Industrial ERP & Equipment Management Platform"
        subtitle="A demonstration concept showing how MAXVION's equipment sales, inventory, service, AMC, compliance and B2B operations can be digitally managed. This is a portfolio demo, not a commercially launched product."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl">Launch the demo dashboard</h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in with the demo credentials below to explore all ERP modules with realistic mock data.
            </p>
          </div>
          <DemoCta />
        </div>
        <Card className="mt-6 bg-lightblue/60">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Demo Email</p>
              <p className="font-mono font-bold text-navy">admin@maxvioninfra.com</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Demo Password</p>
              <p className="font-mono font-bold text-navy">admin123</p>
            </div>
            <Badge tone="teal">Mock authentication · data resets on refresh</Badge>
          </div>
        </Card>
        <div className="mt-10">
          <DashboardPreview />
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Modules" title="What's inside the platform" center />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(([t, d], i) => (
              <Card key={t} className="hover:-translate-y-1">
                <span className="text-xs font-bold text-teal">MODULE {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-base">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Capabilities" title="Feature highlights" center />
        <div className="mt-10">
          <FeaturesGrid />
        </div>
      </section>
    </PublicLayout>
  );
}
