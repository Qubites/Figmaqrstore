import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminChip, AdminTable, MonoId, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerStatusRow, DrawerRefId, DrawerActions, DrawerActionButton } from "../components/admin/drawer";
import { MERCHANTS, SESSIONS, PAYMENTS, TICKETS, PAYOUTS, fmt, fmtTs, type Merchant, type SessionRow, type PaymentRow, type TicketRow, type PayoutRow } from "../components/admin/data";
import { ArrowLeft, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

type MerchantTab = "Overview" | "Sessions" | "Payments" | "Payouts" | "Tickets" | "Compliance";
const TABS: MerchantTab[] = ["Overview", "Sessions", "Payments", "Payouts", "Tickets", "Compliance"];

const SESSION_COLS: Column<SessionRow>[] = [
  { key: "id",     label: "Session ID", render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "amount", label: "Amount",    render: (r) => <span className="font-mono text-sm">{fmt(r.amount, r.currency)}</span> },
  { key: "status", label: "Status",   render: (r) => <AdminChip status={r.status} /> },
  { key: "ts",     label: "Created",  render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.created_at)}</span>, mono: true },
];

const PAYMENT_COLS: Column<PaymentRow>[] = [
  { key: "id",     label: "Payment ID", render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "amount", label: "Amount",     render: (r) => <span className="font-mono text-sm">{fmt(r.amount, r.currency)}</span> },
  { key: "method", label: "Method",     render: (r) => <span className="text-xs text-muted-foreground">{r.method.replace("_", " ")}</span> },
  { key: "status", label: "Status",     render: (r) => <AdminChip status={r.status} /> },
];

const PAYOUT_COLS: Column<PayoutRow>[] = [
  { key: "id",     label: "Payout ID",  render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "amount", label: "Amount",     render: (r) => <span className="font-mono text-sm">{fmt(r.amount, r.currency)}</span> },
  { key: "method", label: "Method",     render: (r) => <span className="text-xs text-muted-foreground">{r.method.replace("_", " ")}</span> },
  { key: "status", label: "Status",     render: (r) => <AdminChip status={r.status} /> },
];

const TICKET_COLS: Column<TicketRow>[] = [
  { key: "id",       label: "Ticket ID",  render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "subject",  label: "Subject",    render: (r) => <span className="text-sm">{r.subject}</span> },
  { key: "severity", label: "Severity",   render: (r) => <span className={`text-[11px] font-mono capitalize ${r.severity === "critical" ? "text-destructive" : r.severity === "high" ? "text-orange-700" : "text-amber-700"}`}>{r.severity}</span> },
  { key: "status",   label: "Status",     render: (r) => <AdminChip status={r.status} /> },
];

const COMPLIANCE_ITEMS = [
  { label: "KYC Verification",      status: "verified",  note: "Completed 2024-03-14" },
  { label: "AML Screening",         status: "verified",  note: "Last run 2026-01-01" },
  { label: "PCI DSS Compliance",    status: "pending",   note: "Annual review due" },
  { label: "Terms & Conditions",    status: "verified",  note: "Accepted 2024-03-12" },
  { label: "Bank Account Verified", status: "verified",  note: "Confirmed 2024-03-15" },
  { label: "Risk Assessment",       status: "pending",   note: "Q1 2026 review pending" },
];

export default function AdminMerchantDetailPage() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const [activeTab, setActiveTab] = useState<MerchantTab>("Overview");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const merchant = MERCHANTS.find((m) => m.id === merchantId) ?? MERCHANTS[0];
  const sessions  = SESSIONS.filter((s) => s.merchant_id === merchant.id);
  const payments  = PAYMENTS.filter((p) => p.merchant_id === merchant.id);
  const payouts   = PAYOUTS.filter((p) => p.merchant_id === merchant.id);
  const tickets   = TICKETS.filter((t) => t.merchant_id === merchant.id);

  function handleRowClick(row: any) {
    setSelectedRow(row);
    setDrawerOpen(true);
  }

  return (
    <AdminShell
      pageHeader={
        <AdminPageHeader
          title={merchant.name}
          description={`${merchant.id} · ${merchant.plan} plan · ${merchant.country}`}
          action={
            <Link to="/admin/support/merchants" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3 h-3" /> Merchants
            </Link>
          }
        />
      }
      drawerOpen={drawerOpen}
      drawerTitle={selectedRow ? (selectedRow.id ?? "Detail") : undefined}
      onDrawerClose={() => { setDrawerOpen(false); setSelectedRow(null); }}
      drawer={selectedRow && (
        <>
          <DrawerSection title="ID">
            <DrawerMonoRow label="ID" id={selectedRow.id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Detail">
            {selectedRow.status && <DrawerStatusRow label="Status" status={selectedRow.status} />}
            {selectedRow.amount && <DrawerField label="Amount" value={fmt(selectedRow.amount, selectedRow.currency ?? "EUR")} mono />}
            {selectedRow.subject && <DrawerField label="Subject" value={selectedRow.subject} />}
            {selectedRow.created_at && <DrawerField label="Created" value={fmtTs(selectedRow.created_at)} mono />}
            {selectedRow.severity && <DrawerField label="Severity" value={selectedRow.severity} mono />}
          </DrawerSection>
        </>
      )}
    >
      {/* ── Merchant header card ────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-0">
        <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-5 mb-5">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-lg font-semibold text-primary">{merchant.name[0]}</span>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-semibold text-foreground">{merchant.name}</h2>
              <AdminChip status={merchant.status} />
              <span className={`text-[11px] font-mono font-medium capitalize ${merchant.compliance === "verified" ? "text-primary" : merchant.compliance === "flagged" ? "text-destructive" : "text-amber-700"}`}>
                KYC {merchant.compliance}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-1">{merchant.id}</p>
            <p className="text-xs text-muted-foreground mt-1">{merchant.email} · {merchant.plan} plan · {merchant.country}</p>
          </div>
          {/* Quick stats */}
          <div className="flex gap-5 shrink-0">
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground/60 uppercase tracking-widest">GMV 30d</p>
              <p className="text-base font-mono font-medium text-foreground">{fmt(merchant.gmv_30d, merchant.currency)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground/60 uppercase tracking-widest">Sessions</p>
              <p className="text-base font-mono font-medium text-foreground">{merchant.sessions_30d}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="px-6 border-b border-border/50">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ────────────────────────────────────────────────── */}
      <div className="p-6">
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Sessions",     value: String(sessions.length) },
                { label: "Total Payments",     value: String(payments.length) },
                { label: "Total Payouts",      value: String(payouts.length) },
                { label: "Open Tickets",       value: String(tickets.filter(t => t.status === "open").length) },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-card rounded-xl border border-border p-4">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
                  <p className="text-2xl font-mono font-medium text-foreground mt-2">{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Profile</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Merchant ID",  merchant.id],
                  ["Email",        merchant.email],
                  ["Slug",         merchant.slug],
                  ["Plan",         merchant.plan],
                  ["Country",      merchant.country],
                  ["Currency",     merchant.currency],
                  ["Created",      merchant.created_at],
                  ["Compliance",   merchant.compliance],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">{k}</span>
                    <span className="text-xs font-mono text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Sessions" && (
          <AdminTable columns={SESSION_COLS} rows={sessions} onRowClick={handleRowClick} selectedId={selectedRow?.id} emptyText="No sessions for this merchant." />
        )}
        {activeTab === "Payments" && (
          <AdminTable columns={PAYMENT_COLS} rows={payments} onRowClick={handleRowClick} selectedId={selectedRow?.id} emptyText="No payments for this merchant." />
        )}
        {activeTab === "Payouts" && (
          <AdminTable columns={PAYOUT_COLS} rows={payouts} onRowClick={handleRowClick} selectedId={selectedRow?.id} emptyText="No payouts for this merchant." />
        )}
        {activeTab === "Tickets" && (
          <AdminTable columns={TICKET_COLS} rows={tickets} onRowClick={handleRowClick} selectedId={selectedRow?.id} emptyText="No tickets for this merchant." />
        )}

        {activeTab === "Compliance" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">Compliance Checklist</h3>
              </div>
              <div className="divide-y divide-border/40">
                {COMPLIANCE_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {item.status === "verified"
                        ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        : <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      }
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-mono font-medium capitalize ${item.status === "verified" ? "text-primary" : "text-amber-700"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Controlled actions */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Compliance Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted/60 transition-colors">
                  Request KYC re-submission
                </button>
                <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted/60 transition-colors">
                  Flag for AML review
                </button>
                <button className="text-xs font-medium px-3 py-2 rounded-lg border border-amber-300/60 bg-amber-500/5 text-amber-700 hover:bg-amber-500/10 transition-colors">
                  Place on compliance hold
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-3">
                All compliance actions are logged and require confirmation.
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
