import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Breadcrumbs, Toaster, cx } from "./kit";
import { auth, useStore } from "../lib/erp-store";

const modules: { label: string; to: string; icon: string }[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "▦" },
  { label: "Sales", to: "/admin/sales", icon: "₹" },
  { label: "Quotations", to: "/admin/quotations", icon: "✎" },
  { label: "Proforma Invoices", to: "/admin/invoices", icon: "▤" },
  { label: "Customers", to: "/admin/customers", icon: "☖" },
  { label: "Inventory", to: "/admin/inventory", icon: "▣" },
  { label: "Serial Numbers", to: "/admin/serial-numbers", icon: "⌗" },
  { label: "Service & AMC", to: "/admin/service", icon: "⚙" },
  { label: "AMC Contracts", to: "/admin/amc", icon: "⛨" },
  { label: "Calibration", to: "/admin/calibration", icon: "◎" },
  { label: "Compliance", to: "/admin/compliance", icon: "✓" },
  { label: "Warranty", to: "/admin/warranty", icon: "◷" },
  { label: "Purchase", to: "/admin/purchase", icon: "⇩" },
  { label: "Vendors", to: "/admin/vendors", icon: "⛬" },
  { label: "Reports", to: "/admin/reports", icon: "◧" },
  { label: "Settings", to: "/admin/settings", icon: "⚒" },
];

export function AdminShell({
  title,
  subtitle,
  breadcrumb,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const authed = useStore((s) => s.authed);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (!authed) navigate({ to: "/admin/login", replace: true });
  }, [authed, navigate]);

  useEffect(() => setOpen(false), [path]);

  if (!ready || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-medblue border-t-transparent" />
          Loading MAXVION ERP…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy text-white/70 transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-medblue to-teal font-black text-white">
            M
          </span>
          <span className="leading-tight">
            <span className="block text-base font-black text-white">MAXVION</span>
            <span className="block text-[9px] font-semibold tracking-[0.16em] text-white/50">INDUSTRIAL ERP DEMO</span>
          </span>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              activeProps={{ className: "bg-medblue text-white" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="w-4 text-center opacity-80">{m.icon}</span>
              {m.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
              A
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-white">Admin Profile</p>
              <p className="truncate text-[11px] text-white/50">admin@maxvioninfra.com</p>
            </div>
          </div>
          <button
            onClick={() => {
              auth.logout();
              navigate({ to: "/admin/login", replace: true });
            }}
            className="mt-3 w-full rounded-lg border border-white/15 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-navy/50 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-navy lg:hidden"
                aria-label="Open sidebar"
              >
                ☰
              </button>
              <div className="min-w-0">
                <Breadcrumbs items={[{ label: "ERP", to: "/admin/dashboard" }, { label: breadcrumb }]} />
                <h1 className="truncate text-lg sm:text-xl">{title}</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {actions}
              <Link
                to="/"
                className="hidden h-10 items-center rounded-lg border border-border px-3 text-xs font-semibold text-navy hover:bg-lightblue sm:inline-flex"
              >
                ← Website
              </Link>
            </div>
          </div>
        </header>
        <main className="space-y-6 p-4 sm:p-6">
          {subtitle && <p className="-mb-2 text-sm text-slate-500">{subtitle}</p>}
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
