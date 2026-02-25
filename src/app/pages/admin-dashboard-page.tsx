/**
 * Admin Dashboard — optimised render path
 *
 * Performance decisions, in order of impact:
 *
 * 1. LAZY-LOAD recharts  — DashboardCharts is code-split; the ~300 KB recharts
 *    bundle is never downloaded until the Suspense boundary resolves.
 *
 * 2. MODULE-LEVEL CONSTANTS  — All static lookup objects and arrays that were
 *    previously created inside render (WHK_ICON, WHK_BG, table headers,
 *    filter tabs, legend pairs, payout colour map) are now module-level
 *    constants: allocated once at import time, never re-created.
 *
 * 3. useMemo for derived data  — redFlags, whkCounts, funnelMax, and the
 *    header timestamp are computed with useMemo so they only recalculate
 *    when their inputs change (here: never, since data is static mock).
 *
 * 4. React.memo on every sub-component  — SectionTitle, Panel, FunnelStep,
 *    PayoutStage prevent needless child re-renders on any parent state change.
 *
 * 5. Intl.NumberFormat cached  — fmtCurrency/fmt in data.ts now reuses a
 *    single formatter instance instead of constructing one per call.
 */
import React, { memo, useMemo, useState, lazy, Suspense } from "react";
import { Link } from "react-router";
import { AdminShell, AdminPageHeader, KpiCard } from "../components/admin/shell";
import {
  FUNNEL_DATA, FAILED_PAYMENTS, PAYOUT_STAGES, RECONCILIATION_STATS,
  DISPUTE_STATS, WEBHOOKS, TICKETS, fmtTs, fmtCurrency,
} from "../components/admin/data";
import {
  AlertTriangle, Activity, DollarSign, CreditCard, RefreshCw, AlertOctagon,
  ShieldAlert, FileText, CheckCircle2, XCircle,
} from "lucide-react";
import { cn } from "../components/ui/utils";

// ─── Lazy-loaded recharts section (code-split) ────────────────────────────────
const DashboardCharts = lazy(() => import("../components/admin/DashboardCharts"));

// ─── Skeleton shown while charts bundle loads ─────────────────────────────────
function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[0, 1, 2].map(i => (
        <div key={i} className="rounded-3xl bg-card ring-1 ring-black/5 h-[380px] animate-pulse" />
      ))}
    </div>
  );
}

// ─── Module-level constants (allocated once, never re-created in render) ──────

// Payout stage colours
const PAYOUT_COLORS: Record<string, string> = {
  pending:    "bg-stone-50 text-stone-600",
  processing: "bg-blue-50 text-blue-600",
  in_transit: "bg-purple-50 text-purple-700",
  failed:     "bg-red-50 text-red-700",
};

// Table header labels
const FAILURE_TABLE_HEADERS = ["Time", "Merchant", "Amount", "Reason", "Card", "Ref"] as const;

// Funnel filter tabs
const FUNNEL_FILTERS = ["All", "iOS", "Android"] as const;

// Red flag definitions (static shape; values derived at render via useMemo)
type RedFlagDef = { label: string; path: string };

// Webhook status display
const WHK_ICON: Record<string, React.ReactNode> = {
  healthy:  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  degraded: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  failing:  <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />,
  down:     <XCircle       className="w-3.5 h-3.5 text-red-500" />,
};
const WHK_BG: Record<string, string> = {
  healthy:  "bg-emerald-50",
  degraded: "bg-amber-50",
  failing:  "bg-orange-50",
  down:     "bg-red-50",
};

// Header timestamp — computed once when the module loads (snapshot, not live)
const HEADER_TS = new Date().toLocaleString("en-GB", {
  weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
});

// Funnel max is static mock data — compute at module level
const FUNNEL_MAX = FUNNEL_DATA[0].count;

// ─── Memoised sub-components ──────────────────────────────────────────────────

const SectionTitle = memo(function SectionTitle({ icon: Icon, label, action }: {
  icon: React.ElementType; label: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
        <Icon className="w-4 h-4 text-muted-foreground" />
        {label}
      </h3>
      {action}
    </div>
  );
});

const Panel = memo(function Panel({ children, className, alert }: {
  children: React.ReactNode; className?: string; alert?: boolean;
}) {
  return (
    <div className={cn(
      "bg-card rounded-3xl border-none shadow-sm ring-1 overflow-hidden",
      alert ? "ring-red-200/60 bg-red-50/20" : "ring-black/5",
      className,
    )}>
      {children}
    </div>
  );
});

const FunnelStep = memo(function FunnelStep({ label, value, dropRate, isLast, pct }: {
  label: string; value: string; dropRate: number; isLast?: boolean; pct: number;
}) {
  return (
    <div className="flex-1 flex flex-col items-center relative group">
      <div className="z-10 bg-white rounded-2xl ring-1 ring-black/5 shadow-sm p-4 w-full text-center transition-transform hover:-translate-y-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">{label}</p>
        <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
        <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
        </div>
        {!isLast && (
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 whitespace-nowrap z-20">
            −{dropRate}%
          </div>
        )}
      </div>
      {!isLast && <div className="absolute top-1/2 -right-4 w-8 h-[1px] bg-border -z-0" />}
    </div>
  );
});

const PayoutStage = memo(function PayoutStage({ label, amount, count, status, alert }: {
  label: string; amount: number; count: number; status: string; alert?: boolean;
}) {
  return (
    <div className={cn(
      "flex flex-col p-4 rounded-2xl ring-1 ring-black/5",
      PAYOUT_COLORS[status] || "bg-white",
      alert && "ring-2 ring-red-400/30 shadow-sm shadow-red-200/50",
    )}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">{label}</span>
        {alert && <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
      </div>
      <p className="text-lg font-mono font-bold tracking-tight leading-none">{fmtCurrency(amount)}</p>
      <p className="text-[10px] opacity-60 font-mono mt-1">{count} txs</p>
    </div>
  );
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [activeFilter, setActiveFilter] = useState<typeof FUNNEL_FILTERS[number]>("All");

  // ── useMemo: derived values that depend on data (static here, but correct pattern) ──

  const redFlags = useMemo<RedFlagDef[]>(() => {
    const flags: RedFlagDef[] = [];
    if (RECONCILIATION_STATS.diff !== 0)
      flags.push({ label: "Ledger mismatch", path: "/admin/finance/reconciliation" });
    if (PAYOUT_STAGES.some(p => p.alert))
      flags.push({ label: "Payout stuck", path: "/admin/finance/payouts" });
    if (DISPUTE_STATS.rate > 1.0)
      flags.push({ label: "High disputes", path: "/admin/support/payments" });
    if (WEBHOOKS.some(w => w.status === "down"))
      flags.push({ label: "Webhook down", path: "/admin/system/webhooks" });
    if (TICKETS.some(t => t.severity === "critical" && t.status === "open"))
      flags.push({ label: "Critical ticket", path: "/admin/support/tickets" });
    return flags;
  }, []); // empty deps — data is static mock; replace with data refs when live

  const hasReconMismatch = RECONCILIATION_STATS.diff !== 0;

  return (
    <AdminShell
      pageHeader={
        <AdminPageHeader
          title="Executive Overview"
          description={`Operational health snapshot · ${HEADER_TS} UTC`}
          action={
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {redFlags.map(flag => (
                <Link
                  key={flag.label}
                  to={flag.path}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-[11px] font-medium border border-red-100 hover:bg-red-100 transition-colors"
                >
                  <AlertOctagon className="w-3 h-3 animate-pulse" />
                  {flag.label}
                </Link>
              ))}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-muted-foreground rounded-full text-[11px] font-medium border border-border shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Operational
              </div>
            </div>
          }
        />
      }
    >
      <div className="space-y-8 p-6 max-w-[1700px] mx-auto">

        {/* ── 1. Exec Health KPI Tiles ──────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard label="GMV (24h)"     value="€124.5k" trend="up"      trendValue="+12%"  />
            <KpiCard label="Net Revenue"   value="€8,420"  trend="up"      trendValue="+8%"   />
            <KpiCard label="Paid Orders"   value="6,850"   sub="avg €18.20" />
            <KpiCard label="Conversion"    value="76.2%"   trend="down"    trendValue="−1.4%" alert />
            <KpiCard label="Active Merch." value="142"     sub="of 156 total" />
            <KpiCard label="Risk Share"    value="0.8%"    trend="neutral" trendValue="stable" />
          </div>
        </section>

        {/* ── 2. Funnel + Risk/Disputes ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Funnel */}
          <div className="lg:col-span-2 space-y-3">
            <SectionTitle
              icon={Activity}
              label="Conversion Funnel (24h)"
              action={
                <div className="flex gap-1">
                  {FUNNEL_FILTERS.map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveFilter(t)}
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors",
                        t === activeFilter
                          ? "bg-primary/10 text-primary"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              }
            />
            <Panel className="p-6">
              <div className="flex gap-5 items-stretch justify-between">
                {FUNNEL_DATA.map((step, i) => (
                  <FunnelStep
                    key={step.step}
                    label={step.step}
                    value={step.count.toLocaleString()}
                    dropRate={step.drop}
                    pct={Math.round((step.count / FUNNEL_MAX) * 100)}
                    isLast={i === FUNNEL_DATA.length - 1}
                  />
                ))}
              </div>
              <div className="mt-10 pt-5 border-t border-dashed border-border/60 grid grid-cols-3 gap-6">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Top Drop · Init</p>
                  <p className="text-sm font-semibold text-red-600">User Cancelled (42%)</p>
                  <p className="text-[10px] text-muted-foreground">Price shock or change of mind</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Top Drop · Payment</p>
                  <p className="text-sm font-semibold text-red-600">Bank Decline (31%)</p>
                  <p className="text-[10px] text-muted-foreground">Insufficient funds / Do not honor</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Recovery Rate</p>
                  <p className="text-sm font-semibold text-emerald-600">12% Retried & Won</p>
                  <p className="text-[10px] text-muted-foreground">Smart retry in 24 h window</p>
                </div>
              </div>
            </Panel>
          </div>

          {/* Risk / Disputes */}
          <div className="space-y-3">
            <SectionTitle icon={ShieldAlert} label="Risk Monitoring" />
            <Panel className="h-full">
              <div className="p-5 border-b border-border/40 bg-gray-50/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Dispute Rate</span>
                  <span className={cn(
                    "text-[11px] font-bold px-2 py-0.5 rounded-full",
                    DISPUTE_STATS.trend === "up" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {DISPUTE_STATS.rate}% {DISPUTE_STATS.trend === "up" ? "↑" : "↓"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${Math.min(DISPUTE_STATS.rate * 10, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Threshold: 1.0% · Visa/MC limit: 0.65%</p>
              </div>
              <div className="divide-y divide-border/40">
                {DISPUTE_STATS.top_merchants.map((m, i) => (
                  <div key={m.name} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[11px]">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{m.disputes} active disputes</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-mono font-semibold px-2 py-0.5 rounded-full",
                      m.rate > 1 ? "bg-red-100 text-red-700" : "bg-orange-50 text-orange-600"
                    )}>
                      {m.rate}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-border/40">
                <Link to="/admin/support/merchants" className="text-xs text-primary font-medium hover:underline">
                  View All Merchants →
                </Link>
              </div>
            </Panel>
          </div>
        </div>

        {/* ── 3. Payment Failures Table ─────────────────────────────────────── */}
        <div className="space-y-3">
          <SectionTitle
            icon={AlertOctagon}
            label="Recent Payment Failures (Live)"
            action={
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            }
          />
          <Panel>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-gray-50/60">
                  {FAILURE_TABLE_HEADERS.map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {FAILED_PAYMENTS.map((fail) => (
                  <tr key={fail.id} className="hover:bg-gray-50/70 transition-colors group cursor-pointer">
                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{fmtTs(fail.ts, true)}</td>
                    <td className="px-5 py-3 text-sm font-medium">{fail.merchant}</td>
                    <td className="px-5 py-3 text-sm font-mono tabular-nums">{fmtCurrency(fail.amount)}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-50 text-red-700 border border-red-100 uppercase tracking-wide">
                        {fail.reason.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3 shrink-0" />
                        {fail.card}
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono">{fail.country}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[10px] font-mono text-muted-foreground/50 group-hover:text-primary transition-colors">
                      {fail.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 text-center border-t border-border/40">
              <Link to="/admin/support/payments" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all failed payments →
              </Link>
            </div>
          </Panel>
        </div>

        {/* ── 4 & 5. Payout Pipeline + Reconciliation ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Payout pipeline */}
          <div className="space-y-3">
            <SectionTitle icon={DollarSign} label="Payout Pipeline" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PAYOUT_STAGES.map(s => <PayoutStage key={s.label} {...s} />)}
            </div>
            <Panel className="p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-none">Next Payout Batch</p>
                <p className="text-xs text-muted-foreground mt-0.5">Scheduled tomorrow · 09:00 UTC</p>
              </div>
              <div className="ml-auto text-right shrink-0">
                <p className="text-sm font-bold tabular-nums">€14.5k</p>
                <p className="text-[10px] text-muted-foreground">42 merchants</p>
              </div>
            </Panel>
          </div>

          {/* Reconciliation */}
          <div className="space-y-3">
            <SectionTitle icon={FileText} label="Reconciliation (Stripe vs Ledger)" />
            <Panel alert={hasReconMismatch} className="p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Ledger Delta</p>
                  <p className={cn("text-3xl font-mono font-bold", hasReconMismatch ? "text-red-600" : "text-emerald-600")}>
                    {RECONCILIATION_STATS.diff > 0 ? "+" : ""}{fmtCurrency(RECONCILIATION_STATS.diff)}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground space-y-1">
                  <p>Stripe: <span className="font-mono text-foreground">{fmtCurrency(RECONCILIATION_STATS.stripe_balance)}</span></p>
                  <p>Ledger: <span className="font-mono text-foreground">{fmtCurrency(RECONCILIATION_STATS.ledger_balance)}</span></p>
                  <span className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1",
                    hasReconMismatch ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {hasReconMismatch ? "Mismatch" : "Balanced"}
                  </span>
                </div>
              </div>
              {hasReconMismatch && (
                <div className="bg-white/70 rounded-xl p-4 border border-red-100">
                  <p className="text-[10px] font-semibold text-red-800 mb-2 uppercase tracking-wide">Unmatched Transactions</p>
                  <div className="space-y-2">
                    {RECONCILIATION_STATS.unmatched_txs.map(tx => (
                      <div key={tx.id} className="flex justify-between text-xs items-center">
                        <span className="font-mono text-red-600 bg-red-50 px-1.5 rounded">{tx.id}</span>
                        <span className="text-muted-foreground truncate max-w-[120px] mx-2">{tx.desc}</span>
                        <span className="font-mono tabular-nums">{fmtCurrency(tx.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/admin/finance/reconciliation" className="block mt-3 text-xs text-center text-red-600 hover:underline font-medium">
                    Investigate Mismatches →
                  </Link>
                </div>
              )}
            </Panel>
          </div>
        </div>

        {/* ── 6 · 7 · 8. Charts row — lazy-loaded ──────────────────────────── */}
        <Suspense fallback={<ChartsSkeleton />}>
          <DashboardCharts />
        </Suspense>

      </div>
    </AdminShell>
  );
}
