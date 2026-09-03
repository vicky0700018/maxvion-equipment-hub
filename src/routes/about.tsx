import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/PublicLayout";
import { Card, SectionTitle } from "../components/kit";
import { IconTile, IndustriesStrip, PageHero } from "../components/public-sections";
import { useStore } from "../lib/erp-store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MAXVION Infrastructure Private Limited | Pune" },
      {
        name: "description",
        content:
          "MAXVION Infrastructure Pvt Ltd, Hinjawadi Pune — wholesale supply, servicing and infrastructure support of medical, surgical and scientific equipment.",
      },
      { property: "og:title", content: "About MAXVION Infrastructure Private Limited" },
      { property: "og:description", content: "Equipment supply, service and infrastructure support company based in Pune." },
    ],
  }),
  component: About,
});

const directors = [
  { name: "Vaibhav Changdev Jagtap", role: "Director / Promoter" },
  { name: "Amitkumar Harishchandra Kasar", role: "Director" },
  { name: "Yogesh Kavade", role: "Director" },
];

function About() {
  const c = useStore((s) => s.content);
  return (
    <PublicLayout>
      <PageHero
        eyebrow="About Us"
        title="An equipment and infrastructure business serving healthcare and science"
        subtitle="MAXVION INFRASTRUCTURE PRIVATE LIMITED delivers equipment supply, installation, servicing and compliance support to institutions that depend on precision machinery."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl">Company Overview</h2>
            <p className="mt-4 leading-relaxed text-slate-600">{c.aboutContent}</p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Operating from Hinjawadi, Pune, the company works with institutional buyers on procurement, installation,
              annual maintenance contracts, calibration coordination and long-term lifecycle support of high-value
              assets. Every serialized unit supplied is tracked from purchase through warehouse receipt, installation,
              warranty, AMC activation and periodic service.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Wholesale & Supply", "Institutional procurement of medical, surgical and scientific machinery."],
                ["Servicing", "Preventive maintenance, breakdown support and spare part management."],
                ["Infrastructure Support", "Site readiness, installation and commissioning of equipment."],
              ].map(([t, d]) => (
                <Card key={t}>
                  <h3 className="text-base">{t}</h3>
                  <p className="mt-2 text-sm text-slate-600">{d}</p>
                </Card>
              ))}
            </div>
          </div>
          <Card className="h-fit bg-surface">
            <h3 className="text-lg">Registered Office</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.address}</p>
            <div className="mt-5 space-y-2 text-sm">
              <p className="text-slate-600">
                <span className="font-semibold text-navy">Phone:</span> {c.phone}
              </p>
              <p className="break-all text-slate-600">
                <span className="font-semibold text-navy">Email:</span> {c.email}
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Leadership" title="Directors & Promoters" center />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {directors.map((d, i) => (
              <Card key={d.name} className="text-center">
                <div className="mx-auto">
                  <IconTile icon={d.name.charAt(0)} tone={i % 2 ? "teal" : "blue"} />
                </div>
                <h3 className="mt-4 text-base">{d.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{d.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Industries Served" title="Who we work with" center />
        <div className="mt-10">
          <IndustriesStrip />
        </div>
      </section>
    </PublicLayout>
  );
}
