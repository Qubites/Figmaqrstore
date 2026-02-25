/**
 * DashboardCharts — lazy-loaded so recharts (~300 KB) is excluded from the
 * initial bundle. Imported via React.lazy in admin-dashboard-page.tsx.
 */
import React, { memo } from "react";
import { Link } from "react-router";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  DISPUTE_TREND, MERCHANT_GROWTH, SUPPORT_QUEUE, WEBHOOKS,
  DISPUTE_STATS, fmtCurrency,
} from "./data";
import {
  TrendingUp, Globe, Ticket, Store,
  CheckCircle2, AlertTriangle, XCircle,
} from "lucide-react";
import { cn } from "../ui/utils";

// ─── Colour tokens (duplicated from page to keep this module self-contained) ──
const PRIMARY = "#006241";
const DANGER  = "#dc2626";
const AMBER   = "#d97706";
const MUTED   = "#9ca3af";

// ─── Shared lookup maps (module-level → allocated once) ───────────────────────
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
const WHK_STATUS_KEYS = ["healthy", "degraded", "failing", "down"] as const;

// Precompute webhook counts at module level (static data, never changes)
const WHK_COUNTS = {
  healthy:  WEBHOOKS.filter(w => w.status === "healthy").length,
  degraded: WEBHOOKS.filter(w => w.status === "degraded").length,
  failing:  WEBHOOKS.filter(w => w.status === "failing").length,
  down:     WEBHOOKS.filter(w => w.status === "down").length,
};

// Precompute severity total for bar-width math
const SEV_TOTAL = SUPPORT_QUEUE.open + SUPPORT_QUEUE.in_progress;

// Static legend arrays — allocated once
const DISPUTE_LEGEND: [string, string][] = [["Refunds","#3b82f6"],["Disputes",AMBER],["CB",DANGER]];
const GROWTH_LEGEND:  [string, string][] = [["New", PRIMARY],["Churned", DANGER]];

const QUEUE_STATS = [
  { label: "Open",           value: SUPPORT_QUEUE.open,             color: "text-red-600",          bg: "bg-red-50"     },
  { label: "In Progress",    value: SUPPORT_QUEUE.in_progress,      color: "text-blue-600",          bg: "bg-blue-50"    },
  { label: "Resolved Today", value: SUPPORT_QUEUE.resolved_today,   color: "text-emerald-600",       bg: "bg-emerald-50" },
  { label: "Avg Res. (hrs)", value: SUPPORT_QUEUE.avg_resolution_hrs, color: "text-muted-foreground", bg: "bg-gray-50"    },
] as const;

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = memo(function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-md ring-1 ring-black/5 px-3 py-2 text-[11px]">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-mono">{p.value}</span>
        </p>
      ))}
    </div>
  );
});

// ─── Panel shell ─────────────────────────────────────────────────────────────
const Panel = memo(function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-card rounded-3xl border-none shadow-sm ring-1 ring-black/5 overflow-hidden", className)}>
      {children}
    </div>
  );
});

// ─── Section title ────────────────────────────────────────────────────────────
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

// ─── Dispute trend chart panel ────────────────────────────────────────────────
const DisputeTrendPanel = memo(function DisputeTrendPanel() {
  return (
    <div className="space-y-3">
      <SectionTitle
        icon={TrendingUp}
        label="Disputes & Refunds (7d)"
        action={
          <Link to="/admin/support/payments" className="text-[10px] text-primary hover:underline">
            View all →
          </Link>
        }
      />
      <Panel className="p-5">
        {/* Summary chips */}
        <div className="flex gap-3 mb-5">
          {[
            { label: "Disputes", value: "38", color: "text-orange-600 bg-orange-50" },
            { label: "Refunds",  value: "82", color: "text-blue-600 bg-blue-50"    },
            { label: "CB",       value: "14", color: "text-red-600 bg-red-50"      },
          ].map(s => (
            <div key={s.label} className={cn("flex-1 text-center rounded-xl py-2 px-1", s.color)}>
              <p className="text-lg font-mono font-bold leading-none">{s.value}</p>
              <p className="text-[10px] font-semibold mt-0.5 opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Area chart */}
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={DISPUTE_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
            <defs>
              <linearGradient id="gradDisputes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={AMBER}      stopOpacity={0.3} />
                <stop offset="95%" stopColor={AMBER}      stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gradRefunds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6"    stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6"    stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gradCB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={DANGER}     stopOpacity={0.3} />
                <stop offset="95%" stopColor={DANGER}     stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="day"  tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis               tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="refunds"     name="Refunds"  stroke="#3b82f6" strokeWidth={1.5} fill="url(#gradRefunds)"  dot={false} />
            <Area type="monotone" dataKey="disputes"    name="Disputes" stroke={AMBER}   strokeWidth={1.5} fill="url(#gradDisputes)" dot={false} />
            <Area type="monotone" dataKey="chargebacks" name="CB"       stroke={DANGER}  strokeWidth={1.5} fill="url(#gradCB)"       dot={false} />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-4 mt-2">
          {DISPUTE_LEGEND.map(([l, c]) => (
            <span key={l} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  );
});

// ─── Webhook reliability panel ────────────────────────────────────────────────
const WebhookPanel = memo(function WebhookPanel() {
  return (
    <div className="space-y-3">
      <SectionTitle
        icon={Globe}
        label="Webhook Reliability"
        action={
          <Link to="/admin/system/webhooks" className="text-[10px] text-primary hover:underline">
            Details →
          </Link>
        }
      />
      <Panel className="h-[calc(100%-2.5rem)]">
        {/* Summary bar */}
        <div className="flex border-b border-border/40">
          {WHK_STATUS_KEYS.map(s => (
            <div key={s} className={cn("flex-1 text-center py-3", WHK_BG[s])}>
              <p className={cn(
                "text-xl font-mono font-bold",
                s === "healthy"  ? "text-emerald-600" :
                s === "degraded" ? "text-amber-600"   :
                s === "failing"  ? "text-orange-600"  :
                "text-red-600"
              )}>
                {WHK_COUNTS[s]}
              </p>
              <p className="text-[9px] uppercase tracking-widest font-semibold opacity-60 capitalize mt-0.5">{s}</p>
            </div>
          ))}
        </div>

        {/* Webhook rows */}
        <div className="divide-y divide-border/40">
          {WEBHOOKS.map(w => (
            <div key={w.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", WHK_BG[w.status])}>
                {WHK_ICON[w.status]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{w.merchant_name}</p>
                <p className="text-[10px] font-mono text-muted-foreground truncate">{w.event_type}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={cn(
                  "text-[11px] font-mono font-semibold",
                  w.last_status_code === 200 ? "text-emerald-600" : "text-red-600"
                )}>
                  {w.last_status_code || "—"}
                </p>
                <p className={cn(
                  "text-[10px] font-mono",
                  w.latency_ms > 2000 ? "text-red-500"  :
                  w.latency_ms > 500  ? "text-amber-500" :
                  w.latency_ms === 0  ? "text-muted-foreground" :
                  "text-emerald-600"
                )}>
                  {w.latency_ms > 0 ? `${w.latency_ms}ms` : "—"}
                </p>
              </div>
              {w.attempts > 1 && (
                <span className={cn(
                  "text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full shrink-0",
                  w.attempts >= 5 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                )}>
                  ×{w.attempts}
                </span>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});

// ─── Support queue + merchant growth panel ────────────────────────────────────
const SupportQueuePanel = memo(function SupportQueuePanel() {
  return (
    <div className="space-y-3">
      <SectionTitle
        icon={Ticket}
        label="Support Queue"
        action={
          <Link to="/admin/support/tickets" className="text-[10px] text-primary hover:underline">
            Open tickets →
          </Link>
        }
      />
      <Panel className="p-5 space-y-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {QUEUE_STATS.map(s => (
            <div key={s.label} className={cn("rounded-xl p-3 text-center", s.bg)}>
              <p className={cn("text-2xl font-mono font-bold leading-none", s.color)}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Severity breakdown */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">By Severity</p>
          <div className="space-y-1.5">
            {SUPPORT_QUEUE.by_severity.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full shrink-0", s.color)} />
                <span className="text-xs text-foreground flex-1">{s.label}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", s.color)}
                    style={{ width: `${(s.count / SEV_TOTAL) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold w-4 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-dashed border-border/60 pt-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Store className="w-3 h-3" /> Merchant Growth (6m)
          </p>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart
              data={MERCHANT_GROWTH}
              margin={{ top: 0, right: 0, bottom: 0, left: -30 }}
              barSize={8}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis                 tick={{ fontSize: 9, fill: MUTED }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="new"     name="New"     fill={PRIMARY} radius={[4,4,0,0]} />
              <Bar dataKey="churned" name="Churned" fill={DANGER}  radius={[4,4,0,0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-1">
            {GROWTH_LEGEND.map(([l, c]) => (
              <span key={l} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                {l}
              </span>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
});

// ─── Default export — the full bottom row ─────────────────────────────────────
export default memo(function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DisputeTrendPanel />
      <WebhookPanel />
      <SupportQueuePanel />
    </div>
  );
});
