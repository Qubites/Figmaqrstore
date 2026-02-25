import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader, AdminKpiGrid, KpiCard } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerStatusRow } from "../components/admin/drawer";
import { RECON_ENTRIES, fmt, type ReconRow } from "../components/admin/data";

const COLUMNS: Column<ReconRow>[] = [
  { key: "id",          label: "Recon ID",     render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "period",      label: "Period",       render: (r) => <span className="font-mono text-xs">{r.period}</span>, mono: true },
  { key: "merchant",    label: "Merchant",     render: (r) => <span className="text-sm">{r.merchant_name}</span> },
  { key: "expected",    label: "Expected",     render: (r) => <span className="font-mono text-xs">{fmt(r.expected, r.currency)}</span> },
  { key: "actual",      label: "Actual",       render: (r) => <span className="font-mono text-xs">{fmt(r.actual, r.currency)}</span> },
  { key: "delta",       label: "Δ Delta",      render: (r) => (
    <span className={`font-mono text-xs font-medium ${r.delta !== 0 ? "text-destructive" : "text-primary"}`}>
      {r.delta === 0 ? "—" : (r.delta > 0 ? "+" : "") + fmt(r.delta, r.currency)}
    </span>
  )},
  { key: "entries",     label: "Entries",      render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.entries}</span> },
  { key: "status",      label: "Status",       render: (r) => <AdminChip status={r.status} /> },
];

export default function AdminReconciliationPage() {
  const lp = useListPage<ReconRow>(
    RECON_ENTRIES,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.merchant_name.toLowerCase().includes(q) || r.id.includes(q) || r.period.includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;
  const unmatched = RECON_ENTRIES.filter((r) => r.status === "unmatched").length;
  const partial   = RECON_ENTRIES.filter((r) => r.status === "partial").length;

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Reconciliation" description="Period match status between expected and actual settled amounts" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Recon — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Recon ID"    id={row.id} />
            <DrawerMonoRow label="Merchant ID" id={row.merchant_id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Match">
            <DrawerStatusRow label="Status"   status={row.status} />
            <DrawerField     label="Merchant" value={row.merchant_name} />
            <DrawerField     label="Period"   value={row.period} mono />
            <DrawerField     label="Expected" value={fmt(row.expected, row.currency)} mono />
            <DrawerField     label="Actual"   value={fmt(row.actual, row.currency)}   mono />
            <DrawerField     label="Δ Delta"  value={row.delta === 0 ? "—" : (row.delta > 0 ? "+" : "") + fmt(row.delta, row.currency)} mono />
            <DrawerField     label="Entries"  value={String(row.entries)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name} to="/admin/support/merchants" />
            <DrawerLinkedEntity label="Ledger"   id={row.id}          name="View ledger →"      to="/admin/finance/ledger" />
          </DrawerSection>
        </>
      )}
    >
      {/* Mini KPI strip */}
      <div className="px-5 pt-5 pb-0">
        <div className="grid grid-cols-3 gap-4 mb-0">
          <KpiCard label="Matched"   value={String(RECON_ENTRIES.filter(r => r.status === "matched").length)}   />
          <KpiCard label="Partial"   value={String(partial)}   alert={partial > 0}   />
          <KpiCard label="Unmatched" value={String(unmatched)} alert={unmatched > 0} />
        </div>
      </div>

      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["matched", "partial", "unmatched"], merchantFilter: true }}
        searchValue={lp.search}    onSearch={lp.setSearch}
        activeStatus={lp.status}  onStatus={lp.setStatus}
        dateRange={lp.dateRange}  onDateRange={lp.setDateRange}
      />
      <AdminTable
        columns={COLUMNS}
        rows={lp.filteredRows}
        selectedId={lp.selectedRow?.id}
        onRowClick={lp.setSelectedRow}
      />
    </AdminShell>
  );
}
