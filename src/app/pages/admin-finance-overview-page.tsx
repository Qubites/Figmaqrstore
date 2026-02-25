import React from "react";
import { Link } from "react-router";
import { AdminShell, AdminPageHeader, AdminSection, AdminKpiGrid, KpiCard } from "../components/admin/shell";
import { AdminChip } from "../components/admin/table";
import { MERCHANTS, PAYOUTS, RECON_ENTRIES, fmt } from "../components/admin/data";

const totalGmv       = MERCHANTS.reduce((s, m) => s + m.gmv_30d, 0);
const totalPayouts   = PAYOUTS.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
const inTransit      = PAYOUTS.filter((p) => p.status === "in_transit").reduce((s, p) => s + p.amount, 0);
const unreconciledN  = RECON_ENTRIES.filter((r) => r.status !== "matched").length;
const avgSuccessRate = 94.3; // prototype constant

export default function AdminFinanceOverviewPage() {
  return (
    <AdminShell
      pageHeader={
        <AdminPageHeader
          title="Finance Overview"
          description="GMV, payout positions, and reconciliation health — last 30 days"
        />
      }
    >
      <AdminSection className="space-y-8">
        {/* KPIs */}
        <AdminKpiGrid>
          <KpiCard label="Total GMV (30d)"     value={fmt(totalGmv)}    trend="up"      trendValue="+12.4% MoM" />
          <KpiCard label="Paid Out (30d)"      value={fmt(totalPayouts)} trend="up"      trendValue="+9.1% MoM"  />
          <KpiCard label="In Transit"          value={fmt(inTransit)}    sub="today"     />
          <KpiCard label="Unreconciled"        value={String(unreconciledN)} sub="batches"    alert={unreconciledN > 1}  />
          <KpiCard label="Pay Success Rate"    value={`${avgSuccessRate}%`} trend="up"   trendValue="+0.4pp 7d"  />
        </AdminKpiGrid>

        {/* Top merchants by GMV */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Top Merchants by GMV (30d)</h2>
            <Link to="/admin/support/merchants" className="text-xs text-primary hover:underline">All merchants →</Link>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60">
                  {["Merchant", "Plan", "GMV 30d", "Sessions", "Status"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {[...MERCHANTS].sort((a, b) => b.gmv_30d - a.gmv_30d).map((m) => (
                  <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.name}</p>
                        <p className="text-[11px] font-mono text-muted-foreground/60">{m.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground capitalize">{m.plan}</td>
                    <td className="px-4 py-3 font-mono text-sm text-foreground">{fmt(m.gmv_30d)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.sessions_30d.toLocaleString()}</td>
                    <td className="px-4 py-3"><AdminChip status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Finance nav cards */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-4">Finance Modules</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Ledger",          path: "/admin/finance/ledger",         desc: "All debit/credit entries" },
              { label: "Payables",        path: "/admin/finance/payables",       desc: "Amounts owed to merchants" },
              { label: "Payouts",         path: "/admin/finance/payouts",        desc: "Executed and scheduled payouts" },
              { label: "Transit",         path: "/admin/finance/transit",        desc: "In-flight provider transfers" },
              { label: "Reconciliation",  path: "/admin/finance/reconciliation", desc: "Period match status" },
            ].map((c) => (
              <Link
                key={c.path}
                to={c.path}
                className="block bg-card rounded-xl border border-border px-4 py-4 hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </AdminSection>
    </AdminShell>
  );
}
