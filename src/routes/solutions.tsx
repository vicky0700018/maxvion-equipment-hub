import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/PublicLayout";
import { Card, SectionTitle } from "../components/kit";
import { DemoCta, FeaturesGrid, PageHero, SolutionsGrid } from "../components/public-sections";
import { useStore } from "../lib/erp-store";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Medical, Surgical & Laboratory Equipment | MAXVION" },
      {
        name: "description",
        content:
          "Equipment supply, surgical infrastructure, laboratory solutions, diagnostic infrastructure, AMC services and calibration compliance from MAXVION Infrastructure.",
      },
      { property: "og:title", content: "MAXVION Solutions for Healthcare & Scientific Institutions" },
      { property: "og:description", content: "Six solution tracks covering supply, installation, service and compliance." },
    ],
  }),
  component: Solutions,
});

function Solutions() {
  const c = useStore((s) => s.content);
  return (
    <PublicLayout>
      <PageHero eyebrow="Solutions" title="Equipment solutions across the institutional lifecycle" subtitle={c.solutionsIntro} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SolutionsGrid />
      </section>
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="Delivery Model"
            title="How an institutional order moves through MAXVION"
            center
          />
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {[
              ["Requirement", "Technical scoping with the buyer's biomedical team."],
              ["Quotation", "GST quotation with HSN, delivery and payment terms."],
              ["Supply", "Serialized dispatch from warehouse with batch records."],
              ["Installation", "Commissioning, safety checks and calibration."],
              ["Lifecycle", "AMC, service visits, warranty and compliance tracking."],
            ].map(([t, d], i) => (
              <Card key={t}>
                <span className="text-xs font-bold text-teal">STEP {i + 1}</span>
                <h3 className="mt-2 text-base">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Software Features" title="Digitally managed through our ERP demo" center />
        <div className="mt-10">
          <FeaturesGrid />
        </div>
        <div className="mt-10 text-center">
          <DemoCta />
        </div>
      </section>
    </PublicLayout>
  );
}
