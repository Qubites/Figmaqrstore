import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerStatusRow, DrawerActions, DrawerActionButton } from "../components/admin/drawer";
import { WEBHOOKS, fmtTs, type WebhookRow } from "../components/admin/data";
import { CheckCircle2, AlertTriangle, XCircle, Wifi } from "lucide-react";

const STATUS_ICON: Record<string, React.ReactNode> = {
  healthy:  <CheckCircle2 className="w-4 h-4 text-primary" />,
  degraded: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  failing:  <AlertTriangle className="w-4 h-4 text-orange-600" />,
  down:     <XCircle      className="w-4 h-4 text-destructive" />,
};

const COLUMNS: Column<WebhookRow>[] = [
  { key: "id",          label: "Webhook ID",   render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "merchant",    label: "Merchant",     render: (r) => <span className="text-sm">{r.merchant_name}</span> },
  { key: "endpoint",    label: "Endpoint",     render: (r) => <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[200px] block">{r.endpoint}</span>, mono: true },
  { key: "event_type",  label: "Event",        render: (r) => <span className="font-mono text-xs text-foreground">{r.event_type}</span> },
  { key: "attempts",    label: "Attempts",     render: (r) => <span className={`font-mono text-xs font-medium ${r.attempts > 3 ? "text-destructive" : r.attempts > 1 ? "text-amber-700" : "text-foreground"}`}>{r.attempts}</span> },
  { key: "code",        label: "Last Code",    render: (r) => <span className={`font-mono text-xs ${r.last_status_code === 200 ? "text-primary" : "text-destructive"}`}>{r.last_status_code || "—"}</span> },
  { key: "latency",     label: "Latency",      render: (r) => <span className={`font-mono text-xs ${r.latency_ms > 2000 ? "text-destructive" : r.latency_ms > 500 ? "text-amber-700" : "text-primary"}`}>{r.latency_ms > 0 ? `${r.latency_ms}ms` : "—"}</span> },
  { key: "status",      label: "Status",       render: (r) => <AdminChip status={r.status} /> },
];

export default function AdminWebhookHealthPage() {
  const lp = useListPage<WebhookRow>(
    WEBHOOKS,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.id.includes(q) || r.merchant_name.toLowerCase().includes(q) || r.endpoint.toLowerCase().includes(q) || r.event_type.includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  const counts = {
    healthy:  WEBHOOKS.filter((w) => w.status === "healthy").length,
    degraded: WEBHOOKS.filter((w) => w.status === "degraded").length,
    failing:  WEBHOOKS.filter((w) => w.status === "failing").length,
    down:     WEBHOOKS.filter((w) => w.status === "down").length,
  };

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Webhook Health" description="Endpoint delivery status and attempt counts across all merchants" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Webhook — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Webhook ID"  id={row.id} />
            <DrawerMonoRow label="Merchant ID" id={row.merchant_id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Endpoint">
            <DrawerStatusRow label="Status"       status={row.status} />
            <DrawerField     label="Event Type"   value={row.event_type} mono />
            <DrawerField     label="URL"          value={row.endpoint} mono />
            <DrawerField     label="Last Attempt" value={fmtTs(row.last_attempt)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Delivery">
            <DrawerField label="Attempts"    value={String(row.attempts)} mono />
            <DrawerField label="Last Code"   value={String(row.last_status_code)} mono />
            <DrawerField label="Latency"     value={row.latency_ms > 0 ? `${row.latency_ms}ms` : "—"} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name} to="/admin/support/merchants" />
            <DrawerLinkedEntity label="Events"   id={row.id} name="View events →" to="/admin/system/events" />
          </DrawerSection>
          {row.status !== "healthy" && (
            <DrawerActions>
              <DrawerActionButton label="Retry delivery now"     variant="primary" />
              <DrawerActionButton label="Disable endpoint"       variant="destructive" />
              <DrawerActionButton label="Notify merchant"        variant="ghost" />
            </DrawerActions>
          )}
        </>
      )}
    >
      {/* Summary status panel */}
      <div className="px-5 pt-5 pb-0">
        <div className="grid grid-cols-4 gap-4 mb-0">
          {(["healthy", "degraded", "failing", "down"] as const).map((s) => (
            <div
              key={s}
              className={`bg-card rounded-xl border p-4 flex items-center gap-3 cursor-pointer transition-colors hover:border-primary/30
                ${lp.status === s ? "border-primary/40 bg-primary/[0.02]" : "border-border"}
              `}
              onClick={() => lp.setStatus(lp.status === s ? "all" : s)}
            >
              {STATUS_ICON[s]}
              <div>
                <p className="text-xl font-mono font-semibold text-foreground leading-none">{counts[s]}</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1 capitalize">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdminFilterBar
        config={{ search: true, dateRange: false, statuses: ["healthy", "degraded", "failing", "down"], merchantFilter: true }}
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
