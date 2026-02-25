import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerRefId, DrawerStatusRow } from "../components/admin/drawer";
import { TRANSIT_ENTRIES, fmt, fmtTs, type TransitRow } from "../components/admin/data";

const COLUMNS: Column<TransitRow>[] = [
  { key: "id",          label: "Transit ID",   render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "payout_id",   label: "Payout",       render: (r) => <MonoId id={r.payout_id} />, mono: true },
  { key: "merchant",    label: "Merchant",     render: (r) => <span className="text-sm">{r.merchant_name}</span> },
  { key: "amount",      label: "Amount",       render: (r) => <span className="font-mono text-sm">{fmt(r.amount, r.currency)}</span> },
  { key: "provider",    label: "Provider",     render: (r) => <span className="text-xs font-medium">{r.provider}</span> },
  { key: "provider_ref",label: "Provider Ref", render: (r) => <span className="font-mono text-[11px] text-muted-foreground">{r.provider_ref}</span>, mono: true },
  { key: "status",      label: "Status",       render: (r) => <AdminChip status={r.status} /> },
  { key: "expected_at", label: "Expected",     render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.expected_at)}</span>, mono: true },
];

export default function AdminTransitPage() {
  const lp = useListPage<TransitRow>(
    TRANSIT_ENTRIES,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.merchant_name.toLowerCase().includes(q) || r.id.includes(q) || r.provider_ref.toLowerCase().includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Transit" description="In-flight provider transfers between QrStore and banking rails" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Transit — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Transit ID"   id={row.id} />
            <DrawerMonoRow label="Payout ID"    id={row.payout_id} />
            <DrawerMonoRow label="Merchant ID"  id={row.merchant_id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Transfer">
            <DrawerStatusRow label="Status"       status={row.status} />
            <DrawerField     label="Merchant"     value={row.merchant_name} />
            <DrawerField     label="Amount"       value={fmt(row.amount, row.currency)} mono />
            <DrawerField     label="Provider"     value={row.provider} />
            <DrawerField     label="Provider Ref" value={row.provider_ref} mono />
            <DrawerField     label="Created"      value={fmtTs(row.created_at)} mono />
            <DrawerField     label="Expected"     value={fmtTs(row.expected_at)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Payout"   id={row.payout_id}   name={`${row.payout_id} →`} to="/admin/finance/payouts" />
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name}     to="/admin/support/merchants" />
          </DrawerSection>
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["in_transit", "settled", "failed", "returned"], merchantFilter: true }}
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
