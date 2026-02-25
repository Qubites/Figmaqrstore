import React, { useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerLinkedEntity, DrawerStatusRow, DrawerActions, DrawerActionButton } from "../components/admin/drawer";
import { USERS, fmtTs, type UserRow } from "../components/admin/data";

const COLUMNS: Column<UserRow>[] = [
  { key: "id",             label: "User ID",       render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "display_name",   label: "Name",          render: (r) => <span className="text-sm font-medium">{r.display_name}</span> },
  { key: "email",          label: "Email",         render: (r) => <span className="text-xs font-mono text-muted-foreground">{r.email}</span> },
  { key: "country",        label: "Country",       render: (r) => <span className="font-mono text-xs">{r.country}</span> },
  { key: "sessions_total", label: "Sessions",      render: (r) => <span className="font-mono text-xs">{r.sessions_total}</span> },
  { key: "payments_total", label: "Payments",      render: (r) => <span className="font-mono text-xs">{r.payments_total}</span> },
  { key: "last_seen",      label: "Last Seen",     render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.last_seen)}</span>, mono: true },
  { key: "status",         label: "Status",        render: (r) => <AdminChip status={r.status} /> },
];

export default function AdminUsersPage() {
  const lp = useListPage<UserRow>(
    USERS,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.id.includes(q) || r.email.toLowerCase().includes(q) || r.display_name.toLowerCase().includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Users" description="All registered end-users (buyers) across all surfaces" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? row.display_name : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="User ID" id={row.id} />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Profile">
            <DrawerStatusRow label="Status"      status={row.status} />
            <DrawerField     label="Name"        value={row.display_name} />
            <DrawerField     label="Email"       value={row.email} mono />
            <DrawerField     label="Country"     value={row.country} mono />
            <DrawerField     label="Created"     value={row.created_at} mono />
            <DrawerField     label="Last Seen"   value={fmtTs(row.last_seen)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Activity">
            <DrawerField label="Total Sessions" value={String(row.sessions_total)} mono />
            <DrawerField label="Total Payments" value={String(row.payments_total)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Sessions" id={row.id} name="View sessions →"  to="/admin/support/sessions" />
            <DrawerLinkedEntity label="Payments" id={row.id} name="View payments →"  to="/admin/support/payments" />
          </DrawerSection>
          {(row.status === "active" || row.status === "flagged" || row.status === "blocked") && (
            <DrawerActions>
              {row.status === "flagged"  && <DrawerActionButton label="Block user"        variant="destructive" />}
              {row.status === "blocked"  && <DrawerActionButton label="Unblock user"      variant="primary" />}
              {row.status !== "blocked"  && <DrawerActionButton label="Flag for review"   variant="ghost" />}
            </DrawerActions>
          )}
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["active", "flagged", "blocked"], merchantFilter: false }}
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
