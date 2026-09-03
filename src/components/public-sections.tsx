import { Link } from "@tanstack/react-router";
import { Badge, Card, Kpi, SectionTitle, cx } from "./kit";

export const solutions = [
  { title: "Medical Equipment Solutions", desc: "Supply and lifecycle support for healthcare equipment.", icon: "✚" },
  { title: "Surgical Infrastructure", desc: "Equipment and service support for operating rooms and surgical facilities.", icon: "⚕" },
  { title: "Scientific & Laboratory Solutions", desc: "Scientific instruments and laboratory equipment for research and diagnostic environments.", icon: "⚗" },
  { title: "Diagnostic Infrastructure", desc: "Equipment solutions for diagnostic centres and healthcare institutions.", icon: "◉" },
  { title: "AMC & Technical Services", desc: "Long-term service, maintenance and lifecycle support.", icon: "⚙" },
  { title: "Calibration & Compliance", desc: "Tracking and management of calibration and certification schedules.", icon: "◎" },
];

export const features = [
  { title: "Serialized Asset Tracking", desc: "Track every high-value equipment unit using its unique factory serial number." },
  { title: "AMC Management", desc: "Manage annual maintenance contracts and upcoming service deadlines." },
  { title: "Calibration Ledger", desc: "Track calibration dates, certification and compliance status." },
  { title: "B2B GST Billing", desc: "Generate professional GST quotations, proforma invoices and institutional billing records." },
  { title: "Warranty Management", desc: "Track warranty coverage and expiry dates." },
  { title: "Equipment Lifecycle", desc: "Maintain complete equipment history from purchase to service and maintenance." },
  { title: "Inventory Valuation", desc: "Monitor the value of serialized medical and scientific equipment." },
  { title: "Service Management", desc: "Track service tickets, engineers, repairs and service history." },
];

export const industries = [
  { name: "Hospitals", icon: "✚" },
  { name: "Diagnostic Centres", icon: "◉" },
  { name: "Laboratories", icon: "⚗" },
  { name: "Research Institutions", icon: "🔬" },
  { name: "Government Healthcare", icon: "⛨" },
  { name: "Medical Infrastructure", icon: "▤" },
  { name: "Scientific Facilities", icon: "◎" },
];

export const equipmentCategories = [
  { name: "Medical Equipment", desc: "Anaesthesia workstations, patient monitoring systems and ward equipment.", icon: "✚" },
  { name: "Surgical Machinery", desc: "Operating theatre equipment, surgical tables and precision surgical systems.", icon: "⚕" },
  { name: "Scientific Equipment", desc: "Spectrophotometers, analyzers and research-grade instrumentation.", icon: "⚗" },
  { name: "Diagnostic Equipment", desc: "Digital X-ray panels, ultrasound and imaging systems.", icon: "◉" },
  { name: "Laboratory Equipment", desc: "Centrifuges, incubators and clinical laboratory benches.", icon: "▣" },
  { name: "Medical Infrastructure", desc: "Medical gas pipelines, vacuum systems and turnkey facility support.", icon: "▤" },
  { name: "Consumables & Components", desc: "High-precision polymer surgical seals, tubing kits and spares.", icon: "◈" },
  { name: "Sterilization Equipment", desc: "Automated autoclave sterilizer units and CSSD infrastructure.", icon: "♨" },
];

export function IconTile({ icon, tone = "blue" }: { icon: string; tone?: "blue" | "teal" }) {
  return (
    <span
      className={cx(
        "flex h-12 w-12 items-center justify-center rounded-xl text-xl",
        tone === "blue" ? "bg-lightblue text-medblue" : "bg-softteal text-teal",
      )}
    >
      {icon}
    </span>
  );
}

export function SolutionsGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {solutions.map((s, i) => (
        <Card key={s.title} className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
          <IconTile icon={s.icon} tone={i % 2 ? "teal" : "blue"} />
          <h3 className="mt-4 text-lg">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
        </Card>
      ))}
    </div>
  );
}

export function FeaturesGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <Card key={f.title} className="border-t-2 border-t-medblue/70 transition-all duration-200 hover:-translate-y-1">
          <span className="text-xs font-bold text-teal">0{i + 1}</span>
          <h3 className="mt-2 text-base">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
        </Card>
      ))}
    </div>
  );
}

export function IndustriesStrip() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
      {industries.map((i) => (
        <div
          key={i.name}
          className="card-surface flex flex-col items-center gap-3 p-5 text-center transition-all hover:-translate-y-1"
        >
          <IconTile icon={i.icon} tone="teal" />
          <span className="text-sm font-semibold text-navy">{i.name}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPreview() {
  return (
    <div className="card-surface overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-navy px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs font-semibold text-white/70">MAXVION ERP — Dashboard Preview</span>
        </div>
        <Badge tone="teal">Demo</Badge>
      </div>
      <div className="grid gap-4 bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Total Receivables" value="₹48,75,000" sub="B2B Institutional / Hospital Receivables" trend="8.4% MoM" />
        <Kpi label="Active Service Contracts" value="24" sub="AMC & Service Agreements" trend="3 new" tone="teal" />
        <Kpi label="Serialized Inventory Value" value="₹1,86,40,000" sub="Medical & Scientific Assets" trend="2.1% MoM" tone="navy" />
        <Kpi label="Equipment Under Service" value="12" sub="Current Technical Service Jobs" trend="-4 resolved" tone="amber" />
      </div>
    </div>
  );
}

export function DemoCta({ label = "Launch Software Demo" }: { label?: string }) {
  return (
    <Link
      to="/admin/login"
      className="inline-flex h-12 items-center justify-center rounded-lg bg-medblue px-6 text-sm font-semibold text-white shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 hover:bg-problue"
    >
      {label}
    </Link>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="grid-backdrop border-b border-border bg-lightblue/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
      </div>
    </section>
  );
}
