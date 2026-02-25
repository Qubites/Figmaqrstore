import React from "react";
import { Link } from "react-router";
import { cn } from "../ui/utils";
import { AdminChip, MonoId, SeverityChip } from "./table";
import type { AdminStatus } from "./data";
import { ExternalLink } from "lucide-react";

// ─── DrawerSection ────────────────────────────────────────────────────────────

export function DrawerSection({
  title, children, className,
}: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-5", className)}>
      <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2.5 leading-none">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// ─── DrawerField ──────────────────────────────────────────────────────────────

export function DrawerField({
  label, value, mono = false, className,
}: { label: string; value: React.ReactNode; mono?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-3 min-w-0", className)}>
      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{label}</span>
      <span className={cn("text-xs text-right truncate max-w-[240px]", mono ? "font-mono text-foreground/70" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}

// ─── DrawerMonoRow ────────────────────────────────────────────────────────────

export function DrawerMonoRow({ label, id }: { label: string; id: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <MonoId id={id} />
    </div>
  );
}

// ─── DrawerSeparator ─────────────────────────────────────────────────────────

export function DrawerSeparator() {
  return <div className="border-t border-border/40 my-4" />;
}

// ─── DrawerStatusRow ─────────────────────────────────────────────────────────

export function DrawerStatusRow({ label, status }: { label: string; status: AdminStatus }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <AdminChip status={status} />
    </div>
  );
}

// ─── DrawerLinkedEntity ───────────────────────────────────────────────────────
// Clickable pill that navigates to another admin page

export function DrawerLinkedEntity({
  label, id, to, name,
}: { label: string; id: string; to: string; name?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <Link
        to={to}
        className="flex items-center gap-1 text-xs font-mono text-primary hover:underline underline-offset-2 truncate max-w-[220px]"
      >
        <span className="truncate">{name ?? id}</span>
        <ExternalLink className="w-3 h-3 shrink-0" />
      </Link>
    </div>
  );
}

// ─── DrawerTimestamps ─────────────────────────────────────────────────────────

export function DrawerTimestamps({
  created, updated,
}: { created?: string; updated?: string }) {
  function fmt(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }
  return (
    <DrawerSection title="Timestamps">
      {created && <DrawerField label="Created"  value={fmt(created)} mono />}
      {updated && <DrawerField label="Updated"  value={fmt(updated)} mono />}
    </DrawerSection>
  );
}

// ─── DrawerActions ────────────────────────────────────────────────────────────
// Controlled action area — only for tickets, merchants (limited), payouts (limited)

export function DrawerActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-border/40 pt-4 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3">
        Actions
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function DrawerActionButton({
  label, variant = "ghost", onClick, disabled = false,
}: {
  label: string;
  variant?: "primary" | "destructive" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left text-xs font-medium px-3 py-2 rounded-lg border transition-colors",
        variant === "primary"     && "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
        variant === "destructive" && "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
        variant === "ghost"       && "bg-transparent text-foreground border-border hover:bg-muted/60",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {label}
    </button>
  );
}

// ─── DrawerRefId ─────────────────────────────────────────────────────────────

export function DrawerRefId({ referenceId }: { referenceId: string }) {
  return (
    <div className="bg-muted/40 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2">
      <span className="text-[10px] text-muted-foreground/70 uppercase tracking-widest font-mono">Ref</span>
      <span className="font-mono text-[11px] text-foreground/60 tracking-wider">{referenceId}</span>
    </div>
  );
}

// ─── DrawerSeverity ──────────────────────────────────────────────────────────

export function DrawerSeverityRow({ severity }: { severity: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">Severity</span>
      <SeverityChip severity={severity} />
    </div>
  );
}
