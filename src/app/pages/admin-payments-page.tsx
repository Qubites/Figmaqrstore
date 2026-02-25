import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerStatusRow, DrawerRefId } from "../components/admin/drawer";
import { PAYMENTS, fmt, fmtTs, type PaymentRow } from "../components/admin/data";

const RISK_STYLE: Record<string, string> = {
  low:    "text-primary",
  medium: "text-amber-700",
  high:   "text-destructive",
};

const COLUMNS: Column<PaymentRow>[] = [
  { key: "id",          label: "Payment ID",   render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "session_id",  label: "Session",      render: (r) => <MonoId id={r.session_id} />, mono: true },
  { key: "merchant",    label: "Merchant",     render: (r) => <span className="text-sm">{r.merchant_name}</span> },
  { key: "amount",      label: "Amount",       render: (r) => <span className="font-mono text-sm font-medium">{fmt(r.amount, r.currency)}</span> },
  { key: "method",      label: "Method",       render: (r) => <span className="text-[11px] text-muted-foreground">{r.method.replace("_", " ")}</span> },
  { key: "risk",        label: "Risk",         render: (r) => <span className={`text-[11px] font-mono font-medium capitalize ${RISK_STYLE[r.risk]}`}>{r.risk}</span> },
  { key: "status",      label: "Status",       render: (r) => <AdminChip status={r.status} /> },
  { key: "created_at",  label: "Created",      render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.created_at)}</span>, mono: true },
];

export default function AdminPaymentsPage() {
  const lp = useListPage<PaymentRow>(
    PAYMENTS,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.id.includes(q) || r.session_id.includes(q) || r.merchant_name.toLowerCase().includes(q) || r.reference_id.toLowerCase().includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Payments" description="All payment attempts with risk and method breakdown" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Payment — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Payment ID"  id={row.id} />
            <DrawerMonoRow label="Session ID"  id={row.session_id} />
            <DrawerMonoRow label="Merchant ID" id={row.merchant_id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Payment">
            <DrawerStatusRow label="Status"   status={row.status} />
            <DrawerField     label="Merchant" value={row.merchant_name} />
            <DrawerField     label="Amount"   value={fmt(row.amount, row.currency)} mono />
            <DrawerField     label="Method"   value={row.method.replace("_", " ")} />
            <DrawerField     label="Risk"     value={row.risk} mono />
            <DrawerField     label="Created"  value={fmtTs(row.created_at)} mono />
            {row.settled_at && <DrawerField label="Settled" value={fmtTs(row.settled_at)} mono />}
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Session"  id={row.session_id}  name={row.session_id}  to="/admin/support/sessions" />
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name} to="/admin/support/merchants" />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerRefId referenceId={row.reference_id} />
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["paid", "pending", "processing", "failed", "refunded", "disputed"], merchantFilter: true }}
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
