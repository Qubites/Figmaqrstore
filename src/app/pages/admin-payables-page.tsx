import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerRefId, DrawerStatusRow } from "../components/admin/drawer";
import { MERCHANTS, fmt, fmtTs } from "../components/admin/data";

// Derive payables from merchants (amounts owed)
const PAYABLES = MERCHANTS.map((m) => ({
  id: `pbl_${m.id.split("_")[1]}`,
  merchant_id: m.id,
  merchant_name: m.name,
  amount: Math.round(m.gmv_30d * 0.92 * 100) / 100, // net of fees
  currency: m.currency,
  status: m.status === "suspended" ? "on_hold" as const : m.status === "flagged" ? "on_hold" as const : "pending" as const,
  due_date: "2026-02-25",
  created_at: "2026-02-21T00:00:00Z",
  reference_id: `REF-PBL-${m.id.split("_")[1].toUpperCase()}`,
}));

const COLUMNS = [
  { key: "id",          label: "Payable ID",   render: (r: typeof PAYABLES[0]) => <MonoId id={r.id} />, mono: true },
  { key: "merchant",    label: "Merchant",     render: (r: typeof PAYABLES[0]) => <span className="text-sm font-medium">{r.merchant_name}</span> },
  { key: "amount",      label: "Amount Owed",  render: (r: typeof PAYABLES[0]) => <span className="font-mono text-sm">{fmt(r.amount, r.currency)}</span> },
  { key: "due_date",    label: "Due Date",     render: (r: typeof PAYABLES[0]) => <span className="font-mono text-xs text-muted-foreground">{r.due_date}</span> },
  { key: "status",      label: "Status",       render: (r: typeof PAYABLES[0]) => <AdminChip status={r.status} /> },
];

export default function AdminPayablesPage() {
  const lp = useListPage(
    PAYABLES,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.merchant_name.toLowerCase().includes(q) || r.id.includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Payables" description="Amounts owed to merchants, net of fees" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Payable — ${row.merchant_name}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Payable ID"   id={row.id} />
            <DrawerMonoRow label="Merchant ID"  id={row.merchant_id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Payable">
            <DrawerStatusRow label="Status"   status={row.status} />
            <DrawerField     label="Merchant" value={row.merchant_name} />
            <DrawerField     label="Amount"   value={fmt(row.amount, row.currency)} mono />
            <DrawerField     label="Due Date" value={row.due_date} mono />
            <DrawerField     label="Created"  value={fmtTs(row.created_at)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name} to="/admin/support/merchants" />
            <DrawerLinkedEntity label="Payouts"  id="pyt_view" name="View payouts →"            to="/admin/finance/payouts" />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerRefId referenceId={row.reference_id} />
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["pending", "on_hold"], merchantFilter: true }}
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
