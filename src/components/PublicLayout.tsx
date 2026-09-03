import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cx, Toaster } from "./kit";
import { useStore } from "../lib/erp-store";

const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Solutions", to: "/solutions" },
  { label: "Equipment", to: "/equipment" },
  { label: "Services", to: "/services" },
  { label: "Software Demo", to: "/software-demo" },
  { label: "Contact", to: "/contact" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-medblue to-teal text-lg font-black text-white shadow-[var(--shadow-lift)]">
        M
      </span>
      <span className="leading-tight">
        <span className={cx("block text-lg font-black tracking-tight", dark ? "text-white" : "text-navy")}>MAXVION</span>
        <span className={cx("block text-[9px] font-semibold tracking-[0.18em]", dark ? "text-white/60" : "text-slate-500")}>
          INFRASTRUCTURE PRIVATE LIMITED
        </span>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 xl:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "bg-lightblue text-medblue" }}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-surface hover:text-navy"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/software-demo"
            className="inline-flex h-10 items-center rounded-lg bg-medblue px-4 text-sm font-semibold text-white transition-colors hover:bg-problue"
          >
            Explore Software Demo
          </Link>
          <Link
            to="/admin/login"
            className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-semibold text-navy transition-colors hover:border-medblue hover:bg-lightblue"
          >
            Admin Login
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-navy lg:hidden"
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-card px-4 pt-2 pb-4 xl:hidden">
          <div className="grid gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-surface"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 grid gap-2">
            <Link
              to="/software-demo"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-medblue text-sm font-semibold text-white"
            >
              Explore Software Demo
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border text-sm font-semibold text-navy"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const c = useStore((s) => s.content);
  return (
    <footer className="mt-24 bg-navy text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            Wholesale supply, servicing and infrastructure support of scientific, medical and surgical machinery and
            equipment for hospitals, laboratories, diagnostic centres and institutional buyers.
          </p>
          <p className="mt-5 text-xs leading-relaxed text-white/50">{c.address}</p>
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-wide text-white uppercase">Quick Links</h4>
          <div className="mt-4 grid gap-2 text-sm">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Solutions", to: "/solutions" },
              { label: "Services", to: "/services" },
              { label: "Contact", to: "/contact" },
              { label: "Software Demo", to: "/software-demo" },
              { label: "Admin Login", to: "/admin/login" },
            ].map((l) => (
              <Link key={l.label} to={l.to} className="w-fit transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-wide text-white uppercase">Contact</h4>
          <div className="mt-4 grid gap-2 text-sm">
            <a href={`tel:${c.phone}`} className="hover:text-white">
              ☏ {c.phone}
            </a>
            <a href={`mailto:${c.email}`} className="break-all hover:text-white">
              ✉ {c.email}
            </a>
            <span>Hinjawadi, Pune — 411057</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} MAXVION INFRASTRUCTURE PRIVATE LIMITED. All rights reserved.</span>
          <span className="text-white/40">
            The ERP platform shown on this website is a demonstration concept, not a commercially launched product.
          </span>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-card">
      <Header />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
