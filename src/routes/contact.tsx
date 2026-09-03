import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/PublicLayout";
import { Button, Card, Input, Select } from "../components/kit";
import { PageHero } from "../components/public-sections";
import { toast, useStore } from "../lib/erp-store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MAXVION Infrastructure Pvt Ltd — Hinjawadi, Pune" },
      {
        name: "description",
        content:
          "Reach MAXVION Infrastructure Private Limited at Gera's Imperium Rise, Hinjawadi, Pune for equipment procurement, AMC and service enquiries.",
      },
      { property: "og:title", content: "Contact MAXVION Infrastructure Private Limited" },
      { property: "og:description", content: "Equipment procurement, service and AMC enquiries — Pune, Maharashtra." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const c = useStore((s) => s.content);
  const [form, setForm] = useState({ name: "", org: "", email: "", phone: "", type: "Equipment Enquiry", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast("Please fill in your name and email", "error");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", org: "", email: "", phone: "", type: "Equipment Enquiry", message: "" });
      toast("Enquiry submitted — our team will respond shortly");
    }, 900);
  };

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Contact"
        title="Talk to our equipment and service team"
        subtitle="Share your institutional requirement and our team will respond with technical scoping and a GST quotation."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <h2 className="text-xl">Enquiry form</h2>
            <p className="mt-1 text-sm text-slate-500">This demo form uses React state only — no data is transmitted.</p>
            <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              <Input label="Organization" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="Hospital / Laboratory" />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@organization.com" />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" />
              <div className="sm:col-span-2">
                <Select
                  label="Enquiry Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  options={["Equipment Enquiry", "AMC / Service", "Calibration & Compliance", "Spare Parts", "Software Demo Access"]}
                />
              </div>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Message</span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your requirement, quantity and expected timeline"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-medblue focus:ring-4 focus:ring-medblue/10"
                />
              </label>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Submit Enquiry"}
                </Button>
              </div>
            </form>
          </Card>

          <div className="grid gap-5 lg:col-span-2">
            <Card>
              <h3 className="text-base">Registered Office</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.address}</p>
            </Card>
            <Card>
              <h3 className="text-base">Direct Contact</h3>
              <div className="mt-3 space-y-2 text-sm">
                <a href={`tel:${c.phone}`} className="block text-slate-600 hover:text-medblue">
                  ☏ {c.phone}
                </a>
                <a href={`mailto:${c.email}`} className="block break-all text-slate-600 hover:text-medblue">
                  ✉ {c.email}
                </a>
              </div>
            </Card>
            <Card className="bg-navy">
              <h3 className="text-base text-white">Business Hours</h3>
              <p className="mt-3 text-sm text-white/70">Monday – Saturday · 9:30 AM to 6:30 PM IST</p>
              <p className="mt-2 text-sm text-white/70">Emergency service escalation available for AMC customers.</p>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
