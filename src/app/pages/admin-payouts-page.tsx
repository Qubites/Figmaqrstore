import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerRefId, DrawerStatusRow, DrawerActions, DrawerActionButton } from "../components/admin/drawer";
import { PAYOUTS, fmt, fmtTs, type PayoutRow } from "../components/admin/data";

const COLUMNS: Column<PayoutRow>[] = [
  { key: "id",          label: "Payout ID",   render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "merchant",    label: "Merchant",    render: (r) => <span className="text-sm">{r.merchant_name}</span> },
  { key: "amount",      label: "Amount",      render: (r) => <span className="font-mono text-sm font-medium">{fmt(r.amount, r.currency)}</span> },
  { key: "method",      label: "Method",      render: (r) => <span className="text-xs text-muted-foreground uppercase tracking-wide">{r.method}</span> },
  { key: "iban",        label: "IBAN …",      render: (r) => <span className="font-mono text-xs text-muted-foreground">••••{r.iban_last4}</span> },
  { key: "status",      label: "Status",      render: (r) => <AdminChip status={r.status} /> },
  { key: "created_at",  label: "Initiated",   render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.created_at)}</span>, mono: true },
];

export default function AdminPayoutsPage() {
  const lp = useListPage<PayoutRow>(
    PAYOUTS,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.merchant_name.toLowerCase().includes(q) || r.id.includes(q) || r.reference_id.toLowerCase().includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;
  const canAct = row && (row.status === "on_hold" || row.status === "pending");

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Payouts" description="Executed and scheduled merchant payouts" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Payout — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Payout ID"    id={row.id} />
            <DrawerMonoRow label="Merchant ID"  id={row.merchant_id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Payout">
            <DrawerStatusRow label="Status"     status={row.status} />
            <DrawerField     label="Merchant"   value={row.merchant_name} />
            <DrawerField     label="Amount"     value={fmt(row.amount, row.currency)} mono />
            <DrawerField     label="Method"     value={row.method.replace("_", " ")} />
            <DrawerField     label="IBAN"       value={`•••• •••• •••• ${row.iban_last4}`} mono />
            <DrawerField     label="Initiated"  value={fmtTs(row.created_at)} mono />
            {row.settled_at && <DrawerField label="Settled" value={fmtTs(row.settled_at)} mono />}
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name} to="/admin/support/merchants" />
            <DrawerLinkedEntity label="Transit"  id={row.id} name="View transit →" to="/admin/finance/transit" />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerRefId referenceId={row.reference_id} />
          {canAct && (
            <DrawerActions>
              <DrawerActionButton label="Release hold"      variant="primary"      />
              <DrawerActionButton label="Cancel payout"     variant="destructive"  />
              <DrawerActionButton label="Flag for review"   variant="ghost"        />
            </DrawerActions>
          )}
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["pending", "in_transit", "completed", "on_hold", "failed"], merchantFilter: true }}
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
