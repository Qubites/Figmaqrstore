import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerStatusRow, DrawerRefId } from "../components/admin/drawer";
import { SESSIONS, fmt, fmtTs, type SessionRow } from "../components/admin/data";

const COLUMNS: Column<SessionRow>[] = [
  { key: "id",          label: "Session ID",  render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "order_id",    label: "Order ID",    render: (r) => <MonoId id={r.order_id} />, mono: true },
  { key: "merchant",    label: "Merchant",    render: (r) => <span className="text-sm">{r.merchant_name}</span> },
  { key: "amount",      label: "Amount",      render: (r) => <span className="font-mono text-sm">{fmt(r.amount, r.currency)}</span> },
  { key: "surface",     label: "Surface",     render: (r) => <span className="text-[11px] font-mono text-muted-foreground">{r.surface}</span> },
  { key: "status",      label: "Status",      render: (r) => <AdminChip status={r.status} /> },
  { key: "created_at",  label: "Created",     render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.created_at)}</span>, mono: true },
  { key: "expires_at",  label: "Expires",     render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.expires_at, true)}</span>, mono: true },
];

export default function AdminSessionsPage() {
  const lp = useListPage<SessionRow>(
    SESSIONS,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.id.includes(q) || r.order_id.includes(q) || r.merchant_name.toLowerCase().includes(q) || r.user_id.includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Sessions" description="All checkout sessions across all surfaces" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Session — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Session ID"  id={row.id} />
            <DrawerMonoRow label="Order ID"    id={row.order_id} />
            <DrawerMonoRow label="Merchant ID" id={row.merchant_id} />
            {row.user_id && <DrawerMonoRow label="User ID" id={row.user_id} />}
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Session">
            <DrawerStatusRow label="Status"   status={row.status} />
            <DrawerField     label="Merchant" value={row.merchant_name} />
            <DrawerField     label="Amount"   value={fmt(row.amount, row.currency)} mono />
            <DrawerField     label="Surface"  value={row.surface} mono />
            <DrawerField     label="Created"  value={fmtTs(row.created_at)} mono />
            <DrawerField     label="Expires"  value={fmtTs(row.expires_at)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name} to="/admin/support/merchants" />
            <DrawerLinkedEntity label="Payments" id={row.id} name="View payments →" to="/admin/support/payments" />
            {row.user_id && <DrawerLinkedEntity label="User" id={row.user_id} name={row.user_id} to="/admin/support/users" />}
          </DrawerSection>
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["active", "paid", "processing", "failed", "expired", "abandoned", "disputed"], merchantFilter: true }}
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
