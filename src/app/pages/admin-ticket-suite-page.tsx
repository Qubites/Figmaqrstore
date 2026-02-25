import React, { useState, useCallback } from "react";
import { AdminShell, AdminPageHeader } from "../components/admin/shell";
import { AdminTable, AdminFilterBar, AdminChip, MonoId, SeverityChip, useListPage, type Column } from "../components/admin/table";
import { DrawerSection, DrawerMonoRow, DrawerField, DrawerSeparator, DrawerStatusRow, DrawerLinkedEntity, DrawerSeverityRow, DrawerActions, DrawerActionButton } from "../components/admin/drawer";
import { TICKETS, fmtTs, type TicketRow } from "../components/admin/data";
import { MessageSquare, Send } from "lucide-react";

const COLUMNS: Column<TicketRow>[] = [
  { key: "id",          label: "Ticket ID",  render: (r) => <MonoId id={r.id} />, mono: true },
  { key: "severity",    label: "Severity",   render: (r) => <SeverityChip severity={r.severity} /> },
  { key: "subject",     label: "Subject",    render: (r) => <span className="text-sm">{r.subject}</span> },
  { key: "merchant",    label: "Merchant",   render: (r) => <span className="text-xs text-muted-foreground">{r.merchant_name}</span> },
  { key: "category",    label: "Category",   render: (r) => <span className="text-[11px] font-mono text-muted-foreground capitalize">{r.category}</span> },
  { key: "assignee",    label: "Assignee",   render: (r) => <span className="text-xs text-foreground">{r.assignee ?? "—"}</span> },
  { key: "status",      label: "Status",     render: (r) => <AdminChip status={r.status} /> },
  { key: "created_at",  label: "Created",    render: (r) => <span className="font-mono text-xs text-muted-foreground">{fmtTs(r.created_at)}</span>, mono: true },
];

// Mock internal notes
const MOCK_NOTES = [
  { author: "Sophie R.", ts: "2026-02-21T10:30:00Z", text: "Escalated to payments team. Provider confirmation pending." },
  { author: "Luc B.",    ts: "2026-02-20T15:15:00Z", text: "Initial investigation: session ses_k3l4m5 processed but never settled." },
];

export default function AdminTicketSuitePage() {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [newStatus, setNewStatus] = useState("");

  const lp = useListPage<TicketRow>(
    TICKETS,
    useCallback((r, search, status) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.id.includes(q) || r.subject.toLowerCase().includes(q) || r.merchant_name.toLowerCase().includes(q);
      const matchStatus = status === "all" || r.status === status;
      return matchSearch && matchStatus;
    }, [])
  );

  const row = lp.selectedRow;

  function addNote() {
    if (!noteText.trim()) return;
    setNotes([...notes, { author: "Admin", ts: new Date().toISOString(), text: noteText }]);
    setNoteText("");
  }

  return (
    <AdminShell
      pageHeader={<AdminPageHeader title="Tickets" description="Support ticket queue — list and detail" />}
      drawerOpen={lp.drawerOpen}
      drawerTitle={row ? `Ticket — ${row.id}` : undefined}
      onDrawerClose={lp.closeDrawer}
      drawer={row && (
        <>
          <DrawerSection title="IDs">
            <DrawerMonoRow label="Ticket ID"   id={row.id} />
            <DrawerMonoRow label="Merchant ID" id={row.merchant_id} />
            {row.user_id && <DrawerMonoRow label="User ID" id={row.user_id} />}
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Ticket">
            <DrawerStatusRow   label="Status"   status={row.status} />
            <DrawerSeverityRow severity={row.severity} />
            <DrawerField       label="Subject"  value={row.subject} />
            <DrawerField       label="Category" value={row.category} mono />
            <DrawerField       label="Assignee" value={row.assignee ?? "Unassigned"} />
            <DrawerField       label="Created"  value={fmtTs(row.created_at)} mono />
            <DrawerField       label="Updated"  value={fmtTs(row.updated_at)} mono />
          </DrawerSection>
          <DrawerSeparator />
          <DrawerSection title="Linked">
            <DrawerLinkedEntity label="Merchant" id={row.merchant_id} name={row.merchant_name} to="/admin/support/merchants" />
            {row.user_id && <DrawerLinkedEntity label="User" id={row.user_id} name={row.user_id} to="/admin/support/users" />}
            <DrawerLinkedEntity label="Payments" id={row.merchant_id} name="View payments →" to="/admin/support/payments" />
          </DrawerSection>
          <DrawerSeparator />

          {/* Internal notes */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2.5">
              Internal Notes
            </p>
            <div className="space-y-2.5 mb-3">
              {notes.map((n, i) => (
                <div key={i} className="bg-muted/40 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-foreground">{n.author}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{fmtTs(n.ts, true)}</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Add internal note…"
                className="flex-1 text-xs border border-border rounded-lg px-3 py-2 bg-background outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60"
              />
              <button
                onClick={addNote}
                className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Controlled actions */}
          {row.status !== "closed" && (
            <DrawerActions>
              <div className="mb-2">
                <p className="text-[10px] text-muted-foreground/60 mb-1.5">Change Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["open", "in_progress", "resolved", "closed"] as const).filter((s) => s !== row.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewStatus(s)}
                      className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border transition-colors capitalize ${newStatus === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-foreground/30"}`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <DrawerActionButton label={newStatus ? `Apply: ${newStatus.replace("_", " ")}` : "Select status above"} variant={newStatus ? "primary" : "ghost"} disabled={!newStatus} />
              <DrawerActionButton label="Escalate to engineering" variant="ghost" />
            </DrawerActions>
          )}
        </>
      )}
    >
      <AdminFilterBar
        config={{ search: true, dateRange: true, statuses: ["open", "in_progress", "resolved", "closed"], merchantFilter: true }}
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
