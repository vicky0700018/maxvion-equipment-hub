import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "../assets/hero-equipment.jpg";
import { PublicLayout } from "../components/PublicLayout";
import { Badge, Card, SectionTitle } from "../components/kit";
import {
  DashboardPreview,
  DemoCta,
  FeaturesGrid,
  IndustriesStrip,
  SolutionsGrid,
  equipmentCategories,
  IconTile,
} from "../components/public-sections";
import { useStore } from "../lib/erp-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAXVION Infrastructure — Medical & Scientific Equipment Solutions" },
      {
        name: "description",
        content:
          "MAXVION Infrastructure Pvt Ltd supplies, services and manages medical, surgical and scientific equipment for hospitals, laboratories and diagnostic centres across India.",
      },
      { property: "og:title", content: "MAXVION Infrastructure — Medical & Scientific Equipment Solutions" },
      {
        property: "og:description",
        content: "B2B equipment supply, AMC service and a digital equipment management platform demo.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const c = useStore((s) => s.content);
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="grid-backdrop relative overflow-hidden border-b border-border bg-lightblue/40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <Badge tone="teal">Medical • Surgical • Scientific Infrastructure</Badge>
            <h1 className="mt-5 text-3xl leading-[1.1] sm:text-4xl lg:text-[46px]">{c.heroTitle}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">{c.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/software-demo"
                className="inline-flex h-12 items-center rounded-lg bg-medblue px-6 text-sm font-semibold text-white shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 hover:bg-problue"
              >
                Explore Software Demo
              </Link>
              <Link
                to="/solutions"
                className="inline-flex h-12 items-center rounded-lg border border-border bg-card px-6 text-sm font-semibold text-navy transition-colors hover:border-medblue hover:bg-lightblue"
              >
                View Our Solutions
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["8", "Equipment Categories"],
                ["24", "Active AMC Contracts"],
                ["100%", "Serialized Tracking"],
              ].map(([v, l]) => (
                <div key={l} className="border-l-2 border-teal pl-3">
                  <p className="text-xl font-bold text-navy">{v}</p>
                  <p className="text-xs text-slate-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
              <img
                src={heroImg}
                alt="Service engineer inspecting autoclave sterilizers and laboratory analyzers in a modern hospital equipment facility"
                width={1600}
                height={1104}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="card-surface absolute -bottom-6 left-4 hidden w-64 p-4 sm:block">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Live Serial Tracking</p>
              <p className="mt-1 font-mono text-sm font-bold text-navy">MAX-AUTO-2026-00128</p>
              <p className="mt-1 text-xs text-slate-500">Autoclave Sterilizer • AMC Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Software demo intro */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionTitle
            eyebrow="Industrial ERP Demo"
            title="MAXVION Industrial ERP & Equipment Management Platform"
            subtitle="This software demo is designed for infrastructure companies managing high-value medical, surgical and scientific assets. It transforms standard billing and inventory management into an integrated Industrial ERP and Equipment Compliance Ledger — enabling businesses to track equipment sales, service contracts, serial numbers, calibration schedules, warranty periods and institutional billing requirements."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {["Serial Number Ledger", "AMC & Service Desk", "Calibration Compliance", "GST B2B Billing"].map((t, i) => (
              <div key={t} className="card-surface flex items-center gap-3 p-4">
                <IconTile icon={["⌗", "⚙", "◎", "₹"][i] ?? "◈"} tone={i % 2 ? "teal" : "blue"} />
                <span className="text-sm font-semibold text-navy">{t}</span>
              </div>
            ))}
            <div className="sm:col-span-2">
              <DemoCta />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="Dashboard Preview"
            title="Operational visibility across every equipment asset"
            subtitle="A snapshot of the demo dashboard used to monitor receivables, service contracts and serialized inventory."
            center
          />
          <div className="mt-10">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionTitle eyebrow="Solutions" title="What we deliver" subtitle={c.solutionsIntro} center />
        <div className="mt-10">
          <SolutionsGrid />
        </div>
      </section>

      {/* Categories */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Equipment Categories" title="Eight core equipment verticals" center />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentCategories.map((e, i) => (
              <Card key={e.name} className="hover:-translate-y-1">
                <IconTile icon={e.icon} tone={i % 2 ? "teal" : "blue"} />
                <h3 className="mt-4 text-base">{e.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{e.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionTitle eyebrow="Software Features" title="Built for equipment lifecycle management" center />
        <div className="mt-10">
          <FeaturesGrid />
        </div>
      </section>

      {/* Industries */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Industries Served" title="Institutional buyers we support" center />
          <div className="mt-10">
            <IndustriesStrip />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-navy px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl text-white sm:text-3xl">Ready to see the equipment management platform?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            Launch the demo dashboard with the provided credentials and explore sales, inventory, serial tracking, AMC,
            calibration and compliance modules.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <DemoCta />
            <Link
              to="/contact"
              className="inline-flex h-12 items-center rounded-lg border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
