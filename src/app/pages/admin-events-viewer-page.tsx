import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerRefId } from "../components/admin/drawer";
import { EVENTS, fmtTs, type EventRow } from "../components/admin/data";
import { Zap } from "lucide-react";

const EVENT_TYPE_COLOR: Record<string, string> = {
  "payment.paid":       "text-primary bg-primary/8",
  "payment.failed":     "text-destructive bg-destructive/8",
  "payment.disputed":   "text-orange-700 bg-orange-500/8",
  "payment.processing": "text-blue-700 bg-blue-500/8",
  "payment.refunded":   "text-violet-700 bg-violet-500/8",
  "session.created":    "text-foreground bg-muted/60",
  "session.expired":    "text-muted-foreground bg-muted/60",
  "payout.in_transit":  "text-blue-700 bg-blue-500/8",
  "webhook.failed":     "text-destructive bg-destructive/8",
  "merchant.suspended": "text-amber-700 bg-amber-500/8",
};

const ENTITY_TO_PATH: Record<string, string> = {
  payment:  "/admin/support/payments",
  session:  "/admin/support/sessions",
  payout:   "/admin/finance/payouts",
  merchant: "/admin/support/merchants",
  webhook:  "/admin/system/webhooks",
};

const COLUMNS: Column<EventRow>[] = [
  { key: "id",          label: "Event ID",     render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "event_type",  label: "Event Type",   render: (r) => (
    <span className={`inline-flex items-center text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${EVENT_TYPE_COLOR[r.event_type] ?? "text-muted-foreground bg-muted/60"}`}>
      {r.event_type}
    </span>
  )},
  { key: "merchant",    label: "Merchant",     render: (r) => <span className="text-sm">{r.merchant_name}</span> },
  { key: "entity_id",   label: "Entity ID",    render: (r) => <MonoId id={r.entity_id} />, mono: true },
  { key: "entity_type", label: "Entity Type",  render: (r) => <span className="text-[11px] font-mono text-muted-foreground capitalize">{r.entity_type}</span> },
  { key: "payload",     label: "Payload",      render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.payload_size}B</span> },
  { key: "created_at",  label: "Timestamp",    render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.created_at)}</span>, mono: true },
];

export default function AdminEventsViewerPage() {
  const lp = useListPage<EventRow>(
    EVENTS,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.id.includes(q) || r.event_type.includes(q) || r.merchant_name.toLowerCase().includes(q) || r.entity_id.includes(q) || r.reference_id.toLowerCase().includes(q);
      // For events, "status" filter is by entity type
      const matchStatus = status === "all" || r.entity_type === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Events Viewer" description="Platform event stream — all entity lifecycle events with reference IDs" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Event — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Event ID"   id={row.id} />
            <DrawerMonoRow label="Entity ID"  id={row.entity_id} />
            <DrawerMonoRow label="Merchant ID" id={row.merchant_id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Event">
            <DrawerField label="Type"        value={
              <span className={`inline-flex text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${EVENT_TYPE_COLOR[row.event_type] ?? "text-muted-foreground bg-muted/60"}`}>
                {row.event_type}
              </span>
            } />
            <DrawerField label="Merchant"    value={row.merchant_name} />
            <DrawerField label="Entity Type" value={row.entity_type} mono />
            <DrawerField label="Payload"     value={`${row.payload_size} bytes`} mono />
            <DrawerField label="Timestamp"   value={fmtTs(row.created_at)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity
              label={row.entity_type.charAt(0).toUpperCase() + row.entity_type.slice(1)}
              id={row.entity_id}
              name={`${row.entity_id} →`}
              to={ENTITY_TO_PATH[row.entity_type] ?? "/admin"}
            />
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name} to="/admin/support/merchants" />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerRefId referenceId={row.reference_id} />
        </>
      )}
    >
      {/* Stream header */}
      <div className="px-5 pt-4 pb-0 flex items-center gap-2 border-b border-border/40 bg-card">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-mono text-muted-foreground">Live stream · {EVENTS.length} events loaded</span>
      </div>

      {/* Filter by entity type (repurpose status filter) */}
      <AdminFilterBar
        config={{
          search: true,
          dateRange: true,
          // entity type filter via status chips
          statuses: ["paid", "failed", "disputed", "processing"],
          merchantFilter: true,
          customRight: (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/60">
              <Zap className="w-3 h-3" />
              {EVENTS.length} events
            </div>
          )
        }}
        searchValue={lp.search}    onSearch={lp.setSearch}
        activeStatus={lp.status}  onStatus={lp.setStatus}
        dateRange={lp.dateRange}  onDateRange={lp.setDateRange}
      />
      <AdminTable
        columns={COLUMNS}
        rows={lp.filteredRows}
        selectedId={lp.selectedRow?.id}
        onRowClick={lp.setSelectedRow}
        emptyText="No events match your filters."
      />
    </AdminShell>
  );
}
