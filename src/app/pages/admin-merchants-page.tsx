import React, { useCallback } from "react";
import { useNavigate } from "react-router";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerStatusRow, DrawerLinkedEntity, DrawerActions, DrawerActionButton } from "../components/admin/drawer";
import { MERCHANTS, fmt, type Merchant } from "../components/admin/data";
import { ExternalLink } from "lucide-react";

const COMPLIANCE_STYLE: Record<string, string> = {
  verified: "text-primary",
  pending:  "text-amber-700",
  flagged:  "text-destructive",
};

const COLUMNS: Column<Merchant>[] = [
  { key: "id",       label: "Merchant ID",  render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "name",     label: "Name",         render: (r) => <span className="text-sm font-medium">{r.name}</span> },
  { key: "plan",     label: "Plan",         render: (r) => <span className="text-xs text-muted-foreground capitalize">{r.plan}</span> },
  { key: "country",  label: "Country",      render: (r) => <span className="font-mono text-xs">{r.country}</span> },
  { key: "gmv",      label: "GMV 30d",      render: (r) => <span className="font-mono text-sm">{fmt(r.gmv_30d, r.currency)}</span> },
  { key: "sessions", label: "Sessions 30d", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.sessions_30d.toLocaleString()}</span> },
  { key: "compliance",label: "Compliance",  render: (r) => <span className={`text-[11px] font-mono font-medium capitalize ${COMPLIANCE_STYLE[r.compliance]}`}>{r.compliance}</span> },
  { key: "status",   label: "Status",       render: (r) => <AdminChip status={r.status} /> },
];

export default function AdminMerchantsPage() {
  const navigate = useNavigate();
  const lp = useListPage<Merchant>(
    MERCHANTS,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.id.includes(q) || r.email.toLowerCase().includes(q) || r.slug.includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;
  const canAct = row && (row.status === "active" || row.status === "suspended" || row.status === "flagged");

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Merchants" description="All registered merchants with compliance and GMV summary" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? row.name : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Merchant ID" id={row.id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Profile">
            <DrawerStatusRow label="Status"     status={row.status} />
            <DrawerField     label="Name"       value={row.name} />
            <DrawerField     label="Email"      value={row.email} mono />
            <DrawerField     label="Plan"       value={row.plan}  />
            <DrawerField     label="Country"    value={row.country} mono />
            <DrawerField     label="Created"    value={row.created_at} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Commerce">
            <DrawerField label="GMV 30d"      value={fmt(row.gmv_30d, row.currency)} mono />
            <DrawerField label="Sessions 30d" value={String(row.sessions_30d)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Compliance">
            <DrawerField label="Status" value={
              <span className={`text-[11px] font-mono font-medium capitalize ${COMPLIANCE_STYLE[row.compliance]}`}>
                {row.compliance}
              </span>
            } />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Sessions" id={row.id} name="View sessions →"   to="/admin/support/sessions" />
            <DrawerLinkedEntity label="Payments" id={row.id} name="View payments →"   to="/admin/support/payments" />
            <DrawerLinkedEntity label="Tickets"  id={row.id} name="View tickets →"    to="/admin/support/tickets" />
          </DrawerSection>
          <DrawerSeparator />
          <button
            onClick={() => { lp.closeDrawer(); navigate(`/admin/support/merchants/${row.id}`); }}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-primary hover:underline underline-offset-2 py-1"
          >
            <ExternalLink className="w-3 h-3" /> Open Merchant Detail
          </button>
          {canAct && (
            <DrawerActions>
              {row.status === "active" && <DrawerActionButton label="Suspend merchant"    variant="destructive" />}
              {row.status === "suspended" && <DrawerActionButton label="Reinstate merchant" variant="primary"     />}
              <DrawerActionButton label="Flag for compliance review" variant="ghost" />
              <DrawerActionButton label="Request KYC re-submission"  variant="ghost" />
            </DrawerActions>
          )}
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["active", "inactive", "suspended", "flagged"], merchantFilter: false }}
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
