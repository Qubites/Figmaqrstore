import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerStatusRow, DrawerRefId } from "../components/admin/drawer";
import { LEDGER_ENTRIES, fmt, fmtTs, type LedgerEntry } from "../components/admin/data";
import type { Column } from "../components/admin/table";

const COLUMNS: Column<LedgerEntry>[] = [
  { key: "id",            label: "Entry ID",     render: (r) => <MonoId id={r.id} />,              mono: true  },
  { key: "merchant",      label: "Merchant",     render: (r) => <span className="text-sm">{r.merchant_name}</span> },
  { key: "type",          label: "Type",         render: (r) => <AdminChip status={r.type} />                     },
  { key: "amount",        label: "Amount",       render: (r) => <span className="font-mono text-sm">{fmt(r.amount, r.currency)}</span> },
  { key: "balance_after", label: "Balance After",render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmt(r.balance_after, r.currency)}</span> },
  { key: "description",   label: "Description",  render: (r) => <span className="text-xs text-muted-foreground">{r.description}</span> },
  { key: "created_at",    label: "Timestamp",    render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.created_at)}</span>, mono: true },
];

export default function AdminLedgerPage() {
  const lp = useListPage<LedgerEntry>(
    LEDGER_ENTRIES,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.merchant_name.toLowerCase().includes(q) || r.id.includes(q) || r.reference_id.toLowerCase().includes(q);
      const matchStatus = status === "all" || r.type === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Ledger" description="All debit and credit entries" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `${row.type === "credit" ? "Credit" : "Debit"} — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Entry ID"     id={row.id} />
            <DrawerMonoRow label="Merchant ID"  id={row.merchant_id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Entry">
            <DrawerStatusRow label="Type"        status={row.type} />
            <DrawerField     label="Merchant"    value={row.merchant_name} />
            <DrawerField     label="Amount"      value={fmt(row.amount, row.currency)}      mono />
            <DrawerField     label="Balance After" value={fmt(row.balance_after, row.currency)} mono />
            <DrawerField     label="Description" value={row.description} />
            <DrawerField     label="Timestamp"   value={fmtTs(row.created_at)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerRefId referenceId={row.reference_id} />
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["credit", "debit"], merchantFilter: true }}
        searchValue={lp.search}      onSearch={lp.setSearch}
        activeStatus={lp.status}    onStatus={lp.setStatus}
        dateRange={lp.dateRange}    onDateRange={lp.setDateRange}
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
