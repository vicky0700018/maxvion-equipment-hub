// Tiny global store (no external state library). React state only, resets on refresh.
import { useSyncExternalStore } from "react";
import * as D from "./erp-data";

export interface Toast {
  id: number;
  message: string;
  tone: "success" | "error" | "info";
}

export interface State {
  authed: boolean;
  toasts: Toast[];
  content: D.SiteContent;
  invoices: D.Invoice[];
  quotations: D.Quotation[];
  proformas: D.Proforma[];
  products: D.Product[];
  serials: D.SerialRecord[];
  amcs: D.AMC[];
  tickets: D.Ticket[];
  calibrations: D.Calibration[];
  warranties: D.Warranty[];
  customers: D.Customer[];
  purchases: D.Purchase[];
  vendors: D.Vendor[];
}

let state: State = {
  authed: false,
  toasts: [],
  content: D.defaultContent,
  invoices: D.invoices,
  quotations: D.quotations,
  proformas: D.proformas,
  products: D.products,
  serials: D.serials,
  amcs: D.amcs,
  tickets: D.tickets,
  calibrations: D.calibrations,
  warranties: D.warranties,
  customers: D.customers,
  purchases: D.purchases,
  vendors: D.vendors,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const getState = () => state;

export function setState(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

export const auth = {
  login(email: string, password: string) {
    const ok = email.trim().toLowerCase() === "admin@maxvioninfra.com" && password === "admin123";
    if (ok) setState({ authed: true });
    return ok;
  },
  logout() {
    setState({ authed: false });
  },
};

let toastId = 0;
export function toast(message: string, tone: Toast["tone"] = "success") {
  const id = ++toastId;
  setState((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
  setTimeout(() => {
    setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  }, 3200);
}

type ListKeys = {
  [K in keyof State]: State[K] extends Array<{ id: string }> ? K : never;
}[keyof State];

export function addRecord<K extends ListKeys>(key: K, record: State[K][number], label = "Record") {
  setState((s) => ({ [key]: [record, ...(s[key] as unknown[])] }) as unknown as Partial<State>);
  toast(`${label} created successfully`);
}

export function updateRecord<K extends ListKeys>(key: K, record: State[K][number], label = "Record") {
  setState(
    (s) =>
      ({
        [key]: (s[key] as { id: string }[]).map((r) => (r.id === record.id ? record : r)),
      }) as unknown as Partial<State>,
  );
  toast(`${label} updated successfully`);
}

export function deleteRecord<K extends ListKeys>(key: K, id: string, label = "Record") {
  setState(
    (s) => ({ [key]: (s[key] as { id: string }[]).filter((r) => r.id !== id) }) as unknown as Partial<State>,
  );
  toast(`${label} deleted`, "error");
}

export function updateContent(patch: Partial<D.SiteContent>) {
  setState((s) => ({ content: { ...s.content, ...patch } }));
  toast("Website content saved");
}
