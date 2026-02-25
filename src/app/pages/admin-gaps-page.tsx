import React from "react";
import { Link } from "react-router";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

type GapStatus = "missing" | "partial" | "done";

interface GapItem {
  label: string;
  note: string;
  status: GapStatus;
  priority: "critical" | "high" | "medium" | "low";
}

const GAPS: { section: string; items: GapItem[] }[] = [
  {
    section: "Missing Pages",
    items: [
      { label: "Merchant Create / Onboarding flow",       note: "No page to create a new merchant from admin. Currently requires direct DB access.",                   status: "missing", priority: "high"     },
      { label: "User detail page",                         note: "No /admin/support/users/:userId page. User detail lives only in the drawer.",                          status: "missing", priority: "medium"   },
      { label: "Payout batch creation",                    note: "No page to trigger or schedule batch payouts. Current flow is view-only.",                             status: "missing", priority: "high"     },
      { label: "Audit log viewer",                         note: "No dedicated audit trail. Admin actions are not currently persisted or surfaced.",                     status: "missing", priority: "critical" },
      { label: "Role & permissions management",            note: "No page to manage admin users, roles, or permissions. Everyone sees everything.",                      status: "missing", priority: "critical" },
      { label: "Ledger drilldown",                         note: "Ledger entries don't link to the originating session or payment in the drawer.",                       status: "partial",  priority: "medium"   },
    ],
  },
  {
    section: "Missing Filters",
    items: [
      { label: "Currency filter on finance pages",         note: "All amounts shown in EUR. Multi-currency filtering not implemented.",                                  status: "missing", priority: "medium"   },
      { label: "Date range picker (real UI)",              note: "Date range is a <select> with preset options. No calendar date picker.",                               status: "partial",  priority: "medium"   },
      { label: "Risk level filter on Payments",            note: "Payments can be filtered by status but not by risk level (low/medium/high).",                          status: "missing", priority: "medium"   },
      { label: "Assignee filter on Tickets",               note: "No way to filter tickets by assignee. Important for support team workflow.",                           status: "missing", priority: "high"     },
      { label: "Country filter on Users and Merchants",    note: "No geographic filter. Needed for regional compliance and support ops.",                                status: "missing", priority: "low"      },
      { label: "Reconciliation period picker",             note: "Recon page has no period selector. Currently shows all periods together.",                             status: "missing", priority: "medium"   },
    ],
  },
  {
    section: "Missing Drawer Entity Linking",
    items: [
      { label: "Session drawer → Payment detail",          note: "Session drawer shows 'View payments →' link but doesn't pre-select the drawer row on the target page.",status: "partial",  priority: "high"     },
      { label: "Payment drawer → Session detail",          note: "Same issue in reverse. Cross-entity drawer pre-selection not implemented.",                            status: "partial",  priority: "high"     },
      { label: "Ticket drawer → Payment detail",           note: "Tickets reference payment IDs in notes but don't link to the payment drawer.",                        status: "missing", priority: "high"     },
      { label: "Ledger entry → Source payment or payout",  note: "Ledger drawer doesn't link to the originating entity. Reference ID shown but not navigable.",         status: "missing", priority: "medium"   },
      { label: "Events → Entity drawer auto-open",         note: "Event rows link to entity pages but don't auto-open the drawer for the specific entity.",              status: "missing", priority: "medium"   },
    ],
  },
  {
    section: "Missing Controlled Actions & Role Gating",
    items: [
      { label: "Role-based visibility gating",             note: "Admin UI shows all actions to all authenticated users. No role enforcement.",                         status: "missing", priority: "critical" },
      { label: "Action confirmation dialogs",              note: "Destructive actions (suspend merchant, block user) have no confirmation step.",                        status: "missing", priority: "critical" },
      { label: "Action audit logging",                     note: "No POST calls behind action buttons. Actions are UI placeholders only.",                               status: "missing", priority: "critical" },
      { label: "Payout release / cancel flow",             note: "Drawer actions are placeholders. No actual payout state change is possible.",                         status: "partial",  priority: "high"     },
      { label: "Merchant compliance hold",                 note: "Compliance actions are UI only. No backend integration.",                                              status: "partial",  priority: "high"     },
      { label: "Ticket status change with reason",         note: "Status change UI exists but no reason/comment required field and no backend write.",                   status: "partial",  priority: "high"     },
    ],
  },
  {
    section: "Missing Webhook Health Visualization",
    items: [
      { label: "Latency chart over time",                  note: "Webhook health page shows current latency but no historical trend chart.",                             status: "missing", priority: "medium"   },
      { label: "Attempt history per endpoint",             note: "Only shows last attempt status and count. No per-attempt log with payloads.",                          status: "missing", priority: "high"     },
      { label: "Webhook event type coverage",              note: "No view showing which event types a merchant has registered webhooks for.",                            status: "missing", priority: "low"      },
      { label: "Auto-retry configuration",                 note: "No UI to configure retry policy (interval, max attempts) per endpoint.",                               status: "missing", priority: "medium"   },
    ],
  },
  {
    section: "Missing Ledger Drilldowns",
    items: [
      { label: "Ledger → Payment drilldown",               note: "Credit/debit entries for payment settlements don't link to the payment record.",                       status: "missing", priority: "high"     },
      { label: "Ledger → Payout drilldown",                note: "Debit entries for fees and payouts don't link to the payout record.",                                  status: "missing", priority: "high"     },
      { label: "Merchant ledger balance history",          note: "No running balance chart or export. Only per-entry balance_after shown.",                             status: "missing", priority: "medium"   },
      { label: "Ledger export (CSV)",                      note: "No export functionality for finance ops reconciliation workflows.",                                    status: "missing", priority: "high"     },
      { label: "Multi-period ledger grouping",             note: "All entries shown flat. No grouping by day/week/period with subtotals.",                               status: "missing", priority: "medium"   },
    ],
  },
];

const STATUS_CONFIG: Record<GapStatus, { icon: React.ReactNode; label: string; className: string }> = {
  missing: { icon: <AlertCircle className="w-3.5 h-3.5 text-destructive" />, label: "Missing",  className: "text-destructive" },
  partial: { icon: <Circle      className="w-3.5 h-3.5 text-amber-600"  />, label: "Partial",   className: "text-amber-700" },
  done:    { icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary"   />, label: "Done",      className: "text-primary" },
};

const PRIORITY_STYLE: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high:     "bg-orange-500/10 text-orange-700",
  medium:   "bg-amber-500/10 text-amber-700",
  low:      "bg-muted text-muted-foreground",
};

const totalItems    = GAPS.flatMap((g) => g.items).length;
const missingItems  = GAPS.flatMap((g) => g.items).filter((i) => i.status === "missing").length;
const partialItems  = GAPS.flatMap((g) => g.items).filter((i) => i.status === "partial").length;
const criticalItems = GAPS.flatMap((g) => g.items).filter((i) => i.priority === "critical").length;

export default function AdminGapsPage() {
  return (
    <AdminShell
      pageHeader={
        <AdminPageHeader
          title="Current Repo Gaps vs V2 Admin UI"
          description="Documentation frame — placeholder checklist for missing pages, filters, entity linking, actions, and visualizations"
          action={
            <Link to="/admin" className="text-xs text-primary hover:underline">← Dashboard</Link>
          }
        />
      }
    >
      <div className="p-6 space-y-8">
        {/* Summary banner */}
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-6 flex-wrap">
          {[
            { label: "Total gaps",     value: String(totalItems),    color: "text-foreground" },
            { label: "Missing",        value: String(missingItems),  color: "text-destructive" },
            { label: "Partial",        value: String(partialItems),  color: "text-amber-700"  },
            { label: "Critical",       value: String(criticalItems), color: "text-destructive" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className={`text-2xl font-mono font-semibold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
          <p className="ml-auto text-[11px] text-muted-foreground/60 font-mono">
            Last reviewed: 2026-02-21
          </p>
        </div>

        {/* Sections */}
        {GAPS.map((section) => (
          <div key={section.section}>
            <h2 className="text-sm font-semibold text-foreground mb-3">{section.section}</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border/40">
                {section.items.map((item, i) => {
                  const cfg = STATUS_CONFIG[item.status];
                  return (
                    <div key={i} className="flex items-start gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                      <div className="mt-0.5 shrink-0">{cfg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded capitalize ${PRIORITY_STYLE[item.priority]}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.note}</p>
                      </div>
                      <span className={`text-[11px] font-mono font-medium shrink-0 mt-0.5 ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
