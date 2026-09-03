import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/AdminShell";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Kpi,
  Modal,
  Select,
  TableWrap,
  Td,
  Th,
  Toolbar,
  Tr,
  useTableTools,
} from "../components/kit";
import { addRecord, deleteRecord, updateRecord, useStore } from "../lib/erp-store";
import { engineers, newId, type Ticket } from "../lib/erp-data";

export const Route = createFileRoute("/admin/service")({
  head: () => ({
    meta: [
      { title: "Service Tickets — MAXVION ERP Demo" },
      {
        name: "description",
        content: "Technical service ticket management for medical, surgical and scientific equipment installations.",
      },
      { property: "og:title", content: "MAXVION ERP — Service Management" },
      { property: "og:description", content: "Track tickets, engineers, priorities and repair status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ServicePage,
});

const priorities = ["Low", "Medium", "High", "Critical"];
const statuses = ["Open", "Assigned", "In Progress", "Waiting for Parts", "Resolved", "Closed"];

const blank = {
  customer: "",
  equipment: "",
  serial: "",
  issue: "",
  priority: "Medium" as Ticket["priority"],
  engineer: engineers[0]!,
  openDate: "2026-09-03",
  dueDate: "2026-09-10",
  status: "Open" as Ticket["status"],
};

function ServicePage() {
  const tickets = useStore((s) => s.tickets);
  const customers = useStore((s) => s.customers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [form, setForm] = useState({ ...blank });

  const t = useTableTools(
    tickets as unknown as Record<string, unknown>[],
    ["id", "customer", "equipment", "serial", "issue", "engineer"],
    "status",
  );
  const rows = t.filtered as unknown as Ticket[];

  const count = (fn: (x: Ticket) => boolean) => String(tickets.filter(fn).length);

  const save = () => {
    if (!form.customer || !form.equipment) return;
    if (editing) updateRecord("tickets", { ...editing, ...form }, "Service ticket");
    else addRecord("tickets", { id: newId("TKT"), ...form }, "Service ticket");
    setOpen(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...blank, customer: customers[0]?.name ?? "" });
    setOpen(true);
  };

  return (
    <AdminShell
      title="Service & Tickets"
      subtitle="Breakdown support, preventive visits and engineer assignment across installed equipment."
      breadcrumb="Service & AMC"
      actions={
        <Button size="sm" onClick={openNew}>
          + Create Ticket
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Open Tickets" value={count((x) => x.status === "Open")} sub="Awaiting assignment" tone="amber" />
        <Kpi label="Assigned" value={count((x) => x.status === "Assigned")} sub="Engineer allocated" />
        <Kpi label="In Progress" value={count((x) => x.status === "In Progress")} sub="On-site work" tone="teal" />
        <Kpi
          label="Waiting for Parts"
          value={count((x) => x.status === "Waiting for Parts")}
          sub="Spares pending"
          tone="amber"
        />
        <Kpi
          label="Resolved / Closed"
          value={count((x) => x.status === "Resolved" || x.status === "Closed")}
          sub="Completed service"
          tone="navy"
        />
      </div>

      <Toolbar
        query={t.query}
        setQuery={t.setQuery}
        status={t.status}
        setStatus={t.setStatus}
        statuses={t.statuses}
        placeholder="Search ticket, customer, serial or engineer"
        action={
          <Button size="sm" onClick={openNew}>
            + Create Ticket
          </Button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState title="No service tickets match this filter" hint="Try another status or search term." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Ticket ID</Th>
              <Th>
                <button onClick={() => t.toggleSort("customer")} className="uppercase hover:text-medblue">
                  Customer
                </button>
              </Th>
              <Th>Equipment</Th>
              <Th>Serial Number</Th>
              <Th>Issue</Th>
              <Th>Priority</Th>
              <Th>Engineer</Th>
              <Th>Open Date</Th>
              <Th>Due Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <Tr key={x.id}>
                <Td className="font-mono text-xs font-semibold text-navy">{x.id}</Td>
                <Td className="font-semibold text-navy">{x.customer}</Td>
                <Td>{x.equipment}</Td>
                <Td className="font-mono text-xs">{x.serial}</Td>
                <Td className="max-w-[220px] text-xs">{x.issue}</Td>
                <Td>
                  <Badge tone={x.priority === "Critical" ? "red" : x.priority === "High" ? "amber" : "slate"}>
                    {x.priority}
                  </Badge>
                </Td>
                <Td className="whitespace-nowrap">{x.engineer}</Td>
                <Td className="whitespace-nowrap">{x.openDate}</Td>
                <Td className="whitespace-nowrap">{x.dueDate}</Td>
                <Td>
                  <Badge>{x.status}</Badge>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(x);
                        setForm({ ...x });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord("tickets", x.id, "Service ticket")}>
                      Delete
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Update Service Ticket" : "Create Service Ticket"}
        description="Assign an engineer and track resolution progress."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Create Ticket"}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Customer"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            options={customers.map((c) => c.name)}
          />
          <Input
            label="Equipment"
            value={form.equipment}
            onChange={(e) => setForm({ ...form, equipment: e.target.value })}
          />
          <Input
            label="Serial Number"
            value={form.serial}
            onChange={(e) => setForm({ ...form, serial: e.target.value })}
          />
          <Input label="Issue" value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as Ticket["priority"] })}
            options={priorities}
          />
          <Select
            label="Assigned Engineer"
            value={form.engineer}
            onChange={(e) => setForm({ ...form, engineer: e.target.value })}
            options={engineers}
          />
          <Input
            label="Open Date"
            type="date"
            value={form.openDate}
            onChange={(e) => setForm({ ...form, openDate: e.target.value })}
          />
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Ticket["status"] })}
            options={statuses}
          />
        </div>
      </Modal>
    </AdminShell>
  );
}
