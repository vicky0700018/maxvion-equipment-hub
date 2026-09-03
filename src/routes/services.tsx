import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/PublicLayout";
import { Badge, Card, ProgressRow, SectionTitle } from "../components/kit";
import { DemoCta, IconTile, PageHero } from "../components/public-sections";
import { useStore } from "../lib/erp-store";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Service, AMC, Calibration & Compliance | MAXVION Infrastructure" },
      {
        name: "description",
        content:
          "Annual maintenance contracts, preventive service, breakdown support, calibration scheduling and compliance tracking for medical and scientific equipment.",
      },
      { property: "og:title", content: "MAXVION Service & AMC Support" },
      { property: "og:description", content: "Lifecycle service, calibration and compliance management for institutional equipment." },
    ],
  }),
  component: Services,
});

const serviceCards = [
  { icon: "⚙", title: "Annual Maintenance Contracts", desc: "Comprehensive and non-comprehensive AMC packages with defined service frequency and response times." },
  { icon: "⏱", title: "Preventive Maintenance", desc: "Scheduled quarterly and half-yearly visits recorded against each equipment serial number." },
  { icon: "⚑", title: "Breakdown Support", desc: "Priority-based service tickets with assigned engineers and spare part tracking." },
  { icon: "◎", title: "Calibration Coordination", desc: "Calibration due tracking, certificate management and re-calibration scheduling." },
  { icon: "⛨", title: "Safety Certification", desc: "Safety certification and sterilization records maintained per unit." },
  { icon: "◷", title: "Warranty Administration", desc: "Warranty start and expiry tracking with countdown alerts before lapse." },
];

function Services() {
  const c = useStore((s) => s.content);
  const amcs = useStore((s) => s.amcs);
  const tickets = useStore((s) => s.tickets);
  const active = amcs.filter((a) => a.status === "Active").length;

  return (
    <PublicLayout>
      <PageHero eyebrow="Service & AMC" title="Lifecycle service for high-value equipment" subtitle={c.servicesIntro} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCards.map((s, i) => (
            <Card key={s.title} className="hover:-translate-y-1">
              <IconTile icon={s.icon} tone={i % 2 ? "teal" : "blue"} />
              <h3 className="mt-4 text-base">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl grid gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle
              eyebrow="Compliance & Calibration"
              title="Precision equipment demands documented compliance"
              subtitle="Scientific and diagnostic instruments require periodic calibration, valid safety certification and traceable sterilization records. Every serialized unit carries a compliance ledger inside the demo platform."
            />
            <div className="mt-7">
              <DemoCta label="View Compliance Ledger Demo" />
            </div>
          </div>
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-base">Service operations snapshot</h3>
              <Badge tone="teal">Demo data</Badge>
            </div>
            <div className="mt-5 space-y-4">
              <ProgressRow label="Active AMC contracts" value={active} max={amcs.length} tone="teal" />
              <ProgressRow
                label="Tickets resolved / closed"
                value={tickets.filter((t) => ["Resolved", "Closed"].includes(t.status)).length}
                max={tickets.length}
              />
              <ProgressRow
                label="Critical priority load"
                value={tickets.filter((t) => t.priority === "Critical").length}
                max={tickets.length}
                tone="red"
              />
              <ProgressRow
                label="Calibration compliance"
                value={4}
                max={7}
                tone="amber"
              />
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
