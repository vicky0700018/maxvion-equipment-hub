import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/PublicLayout";
import { Badge, Card, cx } from "../components/kit";
import { IconTile, PageHero, equipmentCategories } from "../components/public-sections";
import { useStore } from "../lib/erp-store";
import { inr } from "../lib/erp-data";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment Categories — Medical, Surgical & Scientific | MAXVION" },
      {
        name: "description",
        content:
          "Browse MAXVION equipment categories: medical, surgical machinery, scientific, diagnostic, laboratory, infrastructure, consumables and sterilization equipment.",
      },
      { property: "og:title", content: "MAXVION Equipment Categories" },
      { property: "og:description", content: "Eight equipment verticals supplied and serviced for institutional buyers." },
    ],
  }),
  component: Equipment,
});

function Equipment() {
  const products = useStore((s) => s.products);
  const [active, setActive] = useState("All");
  const cats = ["All", ...equipmentCategories.map((c) => c.name)];
  const list = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Equipment"
        title="Equipment categories and representative catalogue"
        subtitle="High-value serialized machinery, laboratory instruments and consumable components supplied to hospitals, laboratories and research facilities."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {equipmentCategories.map((e, i) => (
            <Card key={e.name} className="hover:-translate-y-1">
              <IconTile icon={e.icon} tone={i % 2 ? "teal" : "blue"} />
              <h3 className="mt-4 text-base">{e.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{e.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl">Representative catalogue</h2>
          <p className="mt-2 text-sm text-slate-600">Demo records from the MAXVION equipment ledger.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cx(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                  active === c
                    ? "border-medblue bg-medblue text-white"
                    : "border-border bg-card text-slate-600 hover:border-medblue hover:text-medblue",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <Card className="mt-8 text-center text-sm text-slate-500">No equipment listed in this category yet.</Card>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <Card key={p.id} className="flex flex-col hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <Badge tone="blue">{p.category}</Badge>
                    <Badge>{p.stock}</Badge>
                  </div>
                  <h3 className="mt-4 text-base">{p.name}</h3>
                  <dl className="mt-4 grid flex-1 gap-1.5 text-xs text-slate-500">
                    <div className="flex justify-between gap-3">
                      <dt>SKU</dt>
                      <dd className="font-mono font-semibold text-navy">{p.sku}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Serial / Batch</dt>
                      <dd className="font-mono text-right font-semibold text-navy">
                        {p.serial !== "—" ? p.serial : p.batch}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Warranty</dt>
                      <dd className="font-semibold text-navy">{p.warranty}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 border-t border-border pt-4 text-lg font-bold text-medblue">
                    {inr(p.sellingPrice)}
                    <span className="ml-1 text-xs font-medium text-slate-400">+ GST</span>
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
