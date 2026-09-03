import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import { Button, Card, Input, Select } from "../components/kit";
import { updateContent, useStore } from "../lib/erp-store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MAXVION ERP Demo" },
      { name: "description", content: "Manage MAXVION demo company profile, billing defaults and operational preferences." },
      { property: "og:title", content: "MAXVION ERP — Settings" },
      { property: "og:description", content: "Configure company, billing and website content settings for the demo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const content = useStore((s) => s.content);
  const [form, setForm] = useState({ ...content });
  const [gstRate, setGstRate] = useState("18");
  const [currency, setCurrency] = useState("INR — Indian Rupee");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [serviceAlerts, setServiceAlerts] = useState(true);

  const save = () => updateContent({ ...form });
  const update = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  return (
    <AdminShell title="Settings" subtitle="Manage demo company information, billing defaults and operational alerts." breadcrumb="Settings" actions={<Button size="sm" onClick={save}>Save Changes</Button>}>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg">Company profile</h2><p className="mt-1 text-xs text-slate-500">Used across invoices, website content and the demo workspace.</p></div><span className="rounded-md bg-softteal px-2 py-1 text-[10px] font-bold tracking-wide text-teal">PROFILE</span></div>
          <div className="mt-5 space-y-4"><Input label="Company Name" value="MAXVION INFRASTRUCTURE PRIVATE LIMITED" readOnly /><div className="grid gap-4 sm:grid-cols-2"><Input label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} /><Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div><Input label="Registered Address" value={form.address} onChange={(e) => update("address", e.target.value)} /></div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg">Billing defaults</h2><p className="mt-1 text-xs text-slate-500">Default values for new B2B equipment transactions.</p></div><span className="rounded-md bg-lightblue px-2 py-1 text-[10px] font-bold tracking-wide text-medblue">GST</span></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><Select label="Default GST Rate" value={gstRate} onChange={(e) => setGstRate(e.target.value)} options={["5", "12", "18", "28"]} /><Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={["INR — Indian Rupee", "USD — US Dollar"]} /><Input label="GSTIN" defaultValue="27AAXCM1234K1ZP" /><Input label="Default HSN / SAC" defaultValue="9018" /></div>
          <div className="mt-4 rounded-lg bg-surface px-4 py-3 text-sm text-slate-600">New invoices will use <span className="font-semibold text-navy">{gstRate}% GST</span> and <span className="font-semibold text-navy">{currency.split(" ")[0]}</span> by default.</div>
        </Card>

        <Card>
          <div><h2 className="text-lg">Website content</h2><p className="mt-1 text-xs text-slate-500">Edit the public-facing positioning shown in the portfolio experience.</p></div>
          <div className="mt-5 space-y-4"><Input label="Hero Title" value={form.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} /><label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Hero Description</span><textarea value={form.heroDescription} onChange={(e) => update("heroDescription", e.target.value)} className="min-h-24 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-medblue focus:ring-4 focus:ring-medblue/10" /></label><Input label="Solutions Intro" value={form.solutionsIntro} onChange={(e) => update("solutionsIntro", e.target.value)} /><Input label="Services Intro" value={form.servicesIntro} onChange={(e) => update("servicesIntro", e.target.value)} /></div>
        </Card>

        <Card>
          <div><h2 className="text-lg">Notifications & workspace</h2><p className="mt-1 text-xs text-slate-500">Choose which operational reminders are visible in this demo.</p></div>
          <div className="mt-5 space-y-3"><Toggle label="Invoice and receivable alerts" hint="Show collection reminders on the workspace." checked={emailAlerts} onChange={setEmailAlerts} /><Toggle label="Service and calibration alerts" hint="Highlight upcoming visits and compliance deadlines." checked={serviceAlerts} onChange={setServiceAlerts} /><div className="mt-5 border-t border-border pt-4"><p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Workspace status</p><div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"><span className="text-sm font-semibold text-navy">Demo data mode</span><span className="rounded-full bg-softteal px-2.5 py-1 text-xs font-semibold text-teal">Active</span></div><p className="mt-2 text-xs text-slate-500">Changes are stored in React state and reset on refresh.</p></div></div>
        </Card>
      </div>
      <div className="flex justify-end"><Button onClick={save}>Save All Settings</Button></div>
    </AdminShell>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3"><span><span className="block text-sm font-semibold text-navy">{label}</span><span className="mt-0.5 block text-xs text-slate-500">{hint}</span></span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--medblue)]" /></label>;
}