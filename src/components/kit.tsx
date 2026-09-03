import {
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "../lib/erp-store";

export const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

/* ---------------- Button ---------------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "teal" | "danger" | "navy";
  size?: "sm" | "md" | "lg";
};

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-problue";

const btnVariants: Record<string, string> = {
  primary: "bg-medblue text-white hover:bg-problue shadow-[var(--shadow-lift)] hover:-translate-y-0.5",
  navy: "bg-navy text-white hover:bg-medblue",
  teal: "bg-teal text-white hover:brightness-110",
  outline: "border border-border bg-card text-navy hover:border-medblue hover:bg-lightblue",
  ghost: "text-medblue hover:bg-lightblue",
  danger: "border border-destructive/30 text-destructive hover:bg-destructive/10",
};

const btnSizes: Record<string, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export function Button({ variant = "primary", size = "md", className, ...rest }: BtnProps) {
  return <button className={cx(btnBase, btnVariants[variant], btnSizes[size], className)} {...rest} />;
}

/* ---------------- Card ---------------- */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("card-surface p-5 sm:p-6", className)}>{children}</div>;
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-softteal px-3 py-1 text-xs font-bold tracking-[0.14em] text-teal uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-2xl leading-tight sm:text-3xl md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{subtitle}</p>}
    </div>
  );
}

/* ---------------- Badge ---------------- */
const tones: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blue: "bg-lightblue text-medblue ring-medblue/25",
  teal: "bg-softteal text-teal ring-teal/25",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function statusTone(status: string): keyof typeof tones {
  const s = status.toLowerCase();
  if (/(paid|active|approved|received|resolved|closed|compliant|valid|in stock|installed)/.test(s)) return "green";
  if (/(due soon|expiring|partially|pending|in progress|assigned|sent|low stock|ordered|waiting)/.test(s)) return "amber";
  if (/(overdue|expired|rejected|cancelled|unpaid|out of stock|critical|blacklisted|under repair)/.test(s)) return "red";
  if (/(draft|not applicable|on hold|low)/.test(s)) return "slate";
  if (/(high|medium)/.test(s)) return "amber";
  return "blue";
}

export function Badge({ children, tone }: { children: ReactNode; tone?: keyof typeof tones }) {
  const t = tone ?? statusTone(String(children));
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1 ring-inset",
        tones[t],
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- KPI ---------------- */
export function Kpi({
  label,
  value,
  sub,
  trend,
  tone = "blue",
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  tone?: "blue" | "teal" | "amber" | "navy";
}) {
  const accents: Record<string, string> = {
    blue: "bg-lightblue text-medblue",
    teal: "bg-softteal text-teal",
    amber: "bg-amber-50 text-amber-700",
    navy: "bg-navy/5 text-navy",
  };
  return (
    <div className="card-surface group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
        <span className={cx("rounded-md px-2 py-1 text-[10px] font-bold", accents[tone])}>ERP</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-navy sm:text-[26px]">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
      {trend && (
        <p
          className={cx(
            "mt-3 inline-flex items-center gap-1 text-xs font-semibold",
            trend.startsWith("-") ? "text-rose-600" : "text-emerald-600",
          )}
        >
          {trend.startsWith("-") ? "▼" : "▲"} {trend.replace("-", "")}
        </p>
      )}
    </div>
  );
}

/* ---------------- Table ---------------- */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="card-surface overflow-hidden p-0">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">{children}</table>
      </div>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cx(
        "border-b border-border bg-surface px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-500 uppercase whitespace-nowrap",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cx("border-b border-border px-4 py-3 align-middle text-slate-600", className)}>{children}</td>;
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="transition-colors hover:bg-lightblue/50">{children}</tr>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card-surface flex flex-col items-center justify-center gap-2 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lightblue text-xl text-medblue">◎</div>
      <p className="font-semibold text-navy">{title}</p>
      {hint && <p className="max-w-sm text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

/* ---------------- Inputs ---------------- */
const fieldCls =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-medblue focus:ring-4 focus:ring-medblue/10";

export function Input({ label, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>}
      <input className={cx(fieldCls, className)} {...rest} />
    </label>
  );
}

export function Select({
  label,
  options,
  className,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: string[] }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>}
      <select className={cx(fieldCls, className)} {...rest}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------------- Modal ---------------- */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h3 className="text-lg">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-slate-400 hover:bg-surface hover:text-navy">
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------------- Toasts ---------------- */
export function Toaster() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            "pointer-events-auto flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm shadow-[var(--shadow-card)]",
            t.tone === "error" ? "border-rose-200" : t.tone === "info" ? "border-medblue/30" : "border-emerald-200",
          )}
        >
          <span
            className={cx(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
              t.tone === "error" ? "bg-rose-500" : t.tone === "info" ? "bg-medblue" : "bg-emerald-500",
            )}
          >
            {t.tone === "error" ? "!" : "✓"}
          </span>
          <span className="font-medium text-navy">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Breadcrumbs ---------------- */
export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-1.5">
          {it.to ? (
            <Link to={it.to} className="hover:text-medblue">
              {it.label}
            </Link>
          ) : (
            <span className="font-semibold text-navy">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="text-slate-300">/</span>}
        </span>
      ))}
    </nav>
  );
}

/* ---------------- Charts (pure CSS) ---------------- */
export function BarChart({ data, unit = "" }: { data: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-52 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
            {unit}
            {d.value.toLocaleString("en-IN")}
          </span>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-medblue to-teal transition-all duration-300 hover:brightness-110"
            style={{ height: `${Math.max(6, (d.value / max) * 100)}%` }}
          />
          <span className="text-[10px] font-medium text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProgressRow({ label, value, max, tone = "blue" }: { label: string; value: number; max: number; tone?: "blue" | "teal" | "amber" | "red" }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  const bars: Record<string, string> = {
    blue: "bg-medblue",
    teal: "bg-teal",
    amber: "bg-amber-500",
    red: "bg-rose-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span>{label}</span>
        <span className="font-bold text-navy">{pct}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface">
        <div className={cx("h-full rounded-full transition-all duration-500", bars[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------------- Table toolbar hook ---------------- */
export function useTableTools<T extends Record<string, unknown>>(
  rows: T[],
  searchKeys: (keyof T)[],
  statusKey?: keyof T,
) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [asc, setAsc] = useState(true);

  const statuses = useMemo(
    () => (statusKey ? ["All", ...Array.from(new Set(rows.map((r) => String(r[statusKey]))))] : ["All"]),
    [rows, statusKey],
  );

  const filtered = useMemo(() => {
    let out = rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(query.trim().toLowerCase())),
    );
    if (statusKey && status !== "All") out = out.filter((r) => String(r[statusKey]) === status);
    if (sortKey) {
      out = [...out].sort((a, b) => {
        const av = a[sortKey] as unknown, bv = b[sortKey] as unknown;
        if (typeof av === "number" && typeof bv === "number") return asc ? av - bv : bv - av;
        return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return out;
  }, [rows, query, status, statusKey, sortKey, asc, searchKeys]);

  const toggleSort = (k: keyof T) => {
    if (sortKey === k) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(true);
    }
  };

  return { query, setQuery, status, setStatus, statuses, filtered, toggleSort, sortKey, asc };
}

export function Toolbar({
  query,
  setQuery,
  status,
  setStatus,
  statuses,
  placeholder,
  action,
}: {
  query: string;
  setQuery: (v: string) => void;
  status?: string;
  setStatus?: (v: string) => void;
  statuses?: string[];
  placeholder: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={cx(fieldCls, "pl-8")}
          />
        </div>
        {statuses && statuses.length > 1 && setStatus && (
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={cx(fieldCls, "sm:w-52")}>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
      {action}
    </div>
  );
}
