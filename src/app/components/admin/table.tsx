import React, { useState, useMemo } from "react";
import { cn } from "../ui/utils";
import type { AdminStatus } from "./data";
import { Search, ChevronDown, AlertCircle, RefreshCw, Inbox } from "lucide-react";

// ─── AdminChip ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AdminStatus, { label: string; className: string }> = {
  active:      { label: "Active",       className: "bg-primary/10 text-primary" },
  inactive:    { label: "Inactive",     className: "bg-muted text-muted-foreground" },
  suspended:   { label: "Suspended",    className: "bg-amber-500/10 text-amber-700" },
  pending:     { label: "Pending",      className: "bg-amber-500/10 text-amber-700" },
  flagged:     { label: "Flagged",      className: "bg-orange-500/10 text-orange-700" },
  blocked:     { label: "Blocked",      className: "bg-destructive/10 text-destructive" },
  paid:        { label: "Paid",         className: "bg-primary/10 text-primary" },
  failed:      { label: "Failed",       className: "bg-destructive/10 text-destructive" },
  processing:  { label: "Processing",   className: "bg-blue-500/10 text-blue-700" },
  refunded:    { label: "Refunded",     className: "bg-violet-500/10 text-violet-700" },
  disputed:    { label: "Disputed",     className: "bg-orange-500/10 text-orange-700" },
  open:        { label: "Open",         className: "bg-amber-500/10 text-amber-700" },
  in_progress: { label: "In Progress",  className: "bg-blue-500/10 text-blue-700" },
  resolved:    { label: "Resolved",     className: "bg-primary/10 text-primary" },
  closed:      { label: "Closed",       className: "bg-muted text-muted-foreground" },
  completed:   { label: "Completed",    className: "bg-primary/10 text-primary" },
  on_hold:     { label: "On Hold",      className: "bg-amber-500/10 text-amber-700" },
  in_transit:  { label: "In Transit",   className: "bg-blue-500/10 text-blue-700" },
  settled:     { label: "Settled",      className: "bg-primary/10 text-primary" },
  returned:    { label: "Returned",     className: "bg-violet-500/10 text-violet-700" },
  healthy:     { label: "Healthy",      className: "bg-primary/10 text-primary" },
  degraded:    { label: "Degraded",     className: "bg-amber-500/10 text-amber-700" },
  failing:     { label: "Failing",      className: "bg-orange-500/10 text-orange-700" },
  down:        { label: "Down",         className: "bg-destructive/10 text-destructive" },
  matched:     { label: "Matched",      className: "bg-primary/10 text-primary" },
  unmatched:   { label: "Unmatched",    className: "bg-destructive/10 text-destructive" },
  partial:     { label: "Partial",      className: "bg-amber-500/10 text-amber-700" },
  credit:      { label: "Credit",       className: "bg-primary/10 text-primary" },
  debit:       { label: "Debit",        className: "bg-foreground/8 text-foreground" },
  expired:     { label: "Expired",      className: "bg-muted text-muted-foreground" },
  abandoned:   { label: "Abandoned",    className: "bg-muted text-muted-foreground" },
};

export function AdminChip({ status, className }: { status: AdminStatus; className?: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn(
      "inline-flex items-center text-[11px] font-mono font-medium px-2 py-0.5 rounded-md",
      cfg.className, className
    )}>
      {cfg.label}
    </span>
  );
}

// ─── AdminFilterBar ───────────────────────────────────────────────────────────

export interface FilterConfig {
  search?: boolean;
  dateRange?: boolean;
  statuses?: AdminStatus[];
  merchantFilter?: boolean;
  customRight?: React.ReactNode;
}

interface AdminFilterBarProps {
  config: FilterConfig;
  searchValue: string;
  onSearch: (v: string) => void;
  activeStatus: string;
  onStatus: (s: string) => void;
  dateRange: string;
  onDateRange: (v: string) => void;
}

export function AdminFilterBar({
  config,
  searchValue, onSearch,
  activeStatus, onStatus,
  dateRange, onDateRange,
}: AdminFilterBarProps) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border/60 bg-card shrink-0 flex-wrap">
      {/* Search */}
      {config.search !== false && (
        <div className="flex items-center gap-2 bg-background rounded-lg border border-border px-3 py-1.5 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search…"
            className="flex-1 text-xs bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 min-w-0"
          />
        </div>
      )}

      {/* Date range */}
      {config.dateRange && (
        <select
          value={dateRange}
          onChange={(e) => onDateRange(e.target.value)}
          className="text-xs border border-border rounded-lg px-3 py-1.5 bg-background text-foreground outline-none cursor-pointer appearance-none pr-7 relative"
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      )}

      {/* Status chips */}
      {config.statuses && config.statuses.length > 0 && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onStatus("all")}
            className={cn(
              "text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors",
              activeStatus === "all"
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            All
          </button>
          {config.statuses.map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => onStatus(s)}
                className={cn(
                  "text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border transition-colors",
                  activeStatus === s
                    ? cn("border-transparent", cfg.className)
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                )}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Merchant filter placeholder */}
      {config.merchantFilter && (
        <div className="flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 bg-background text-muted-foreground cursor-pointer hover:border-foreground/30 transition-colors">
          <span>All merchants</span>
          <ChevronDown className="w-3 h-3" />
        </div>
      )}

      {config.customRight && <div className="ml-auto">{config.customRight}</div>}
    </div>
  );
}

// ─── AdminTable ───────────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  width?: string;
  mono?: boolean;
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  selectedId?: string | null;
  onRowClick: (row: T) => void;
  loading?: boolean;
  error?: string;
  emptyText?: string;
  onRetry?: () => void;
}

export function AdminTable<T extends { id: string }>({
  columns, rows, selectedId, onRowClick,
  loading = false, error, emptyText = "No records found.",
  onRetry,
}: AdminTableProps<T>) {
  if (loading) return <TableSkeleton columns={columns.length} />;
  if (error) return <TableError message={error} onRetry={onRetry} />;
  if (rows.length === 0) return <TableEmpty text={emptyText} />;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-4 py-2.5 whitespace-nowrap"
                style={col.width ? { width: col.width } : {}}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick(row)}
              className={cn(
                "cursor-pointer transition-colors group",
                selectedId === row.id
                  ? "bg-primary/[0.05] border-l-2 border-l-primary"
                  : "hover:bg-muted/30 border-l-2 border-l-transparent"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-sm align-middle whitespace-nowrap",
                    col.mono ? "font-mono text-xs text-foreground/70" : "text-foreground"
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Table states ─────────────────────────────────────────────────────────────

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-border/60 px-4 py-2.5 flex gap-6">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-2.5 bg-muted rounded w-16 animate-pulse" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border-b border-border/30 px-4 py-3.5 flex gap-6 items-center">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className="h-3 bg-muted rounded animate-pulse"
              style={{ width: `${48 + (j * 23 + i * 17) % 40}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function TableEmpty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
        <Inbox className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function TableError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-destructive" />
      </div>
      <p className="text-sm text-foreground font-medium">Failed to load</p>
      <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      )}
    </div>
  );
}

// ─── useListPage hook — manages filter + drawer state ─────────────────────────

export function useListPage<T extends { id: string }>(
  allRows: T[],
  filterFn: (row: T, search: string, status: string) => boolean
) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const filteredRows = useMemo(
    () => allRows.filter((r) => filterFn(r, search, status)),
    [allRows, search, status, filterFn]
  );

  return {
    search, setSearch,
    status, setStatus,
    dateRange, setDateRange,
    selectedRow, setSelectedRow,
    filteredRows,
    drawerOpen: selectedRow !== null,
    closeDrawer: () => setSelectedRow(null),
  };
}

// ─── Mono ID display ──────────────────────────────────────────────────────────

export function MonoId({ id, className }: { id: string; className?: string }) {
  return (
    <span className={cn("font-mono text-[11px] text-foreground/60 bg-muted/60 px-1.5 py-0.5 rounded", className)}>
      {id}
    </span>
  );
}

// ─── Severity chip for tickets / alerts ──────────────────────────────────────

const SEV_STYLE: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high:     "bg-orange-500/10 text-orange-700",
  medium:   "bg-amber-500/10 text-amber-700",
  low:      "bg-muted text-muted-foreground",
};

export function SeverityChip({ severity }: { severity: string }) {
  return (
    <span className={cn("text-[11px] font-mono font-medium px-2 py-0.5 rounded-md capitalize", SEV_STYLE[severity] ?? "bg-muted text-muted-foreground")}>
      {severity}
    </span>
  );
}
