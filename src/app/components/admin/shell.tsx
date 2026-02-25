import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "../ui/utils";
import { AwningBand } from "../qrstore/headers/awning-band";
import {
  LayoutDashboard, DollarSign, BookOpen, CreditCard, Banknote, ArrowRightLeft,
  CheckSquare, Globe, Zap, Ticket, Users, Store, Activity, Search, ChevronDown,
  Shield, BarChart3, X,
} from "lucide-react";
import type { Environment } from "./data";

// ─── Navigation structure ──────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "Platform",
    items: [
      { label: "Dashboard",      path: "/admin",                         icon: LayoutDashboard },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Overview",       path: "/admin/finance",                 icon: BarChart3 },
      { label: "Ledger",         path: "/admin/finance/ledger",          icon: BookOpen },
      { label: "Payables",       path: "/admin/finance/payables",        icon: DollarSign },
      { label: "Payouts",        path: "/admin/finance/payouts",         icon: Banknote },
      { label: "Transit",        path: "/admin/finance/transit",         icon: ArrowRightLeft },
      { label: "Reconciliation", path: "/admin/finance/reconciliation",  icon: CheckSquare },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Sessions",       path: "/admin/support/sessions",        icon: Activity },
      { label: "Payments",       path: "/admin/support/payments",        icon: CreditCard },
      { label: "Merchants",      path: "/admin/support/merchants",       icon: Store },
      { label: "Users",          path: "/admin/support/users",           icon: Users },
      { label: "Tickets",        path: "/admin/support/tickets",         icon: Ticket },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Webhooks",       path: "/admin/system/webhooks",         icon: Globe },
      { label: "Events",         path: "/admin/system/events",           icon: Zap },
    ],
  },
];

// ─── Environment badge ────────────────────────────────────────────────────────

const ENV_CYCLE: Environment[] = ["PROD", "STAGING", "DEV"];
const ENV_STYLE: Record<Environment, string> = {
  PROD:    "bg-primary/10 text-primary border-primary/20",
  STAGING: "bg-amber-500/10 text-amber-700 border-amber-300/40",
  DEV:     "bg-muted text-muted-foreground border-border",
};
const ENV_DOT: Record<Environment, string> = {
  PROD: "bg-primary", STAGING: "bg-amber-500", DEV: "bg-muted-foreground",
};

// ─── KPI Card ────────────────────────────────────────────────────────────────

export interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  alert?: boolean;
}

export function KpiCard({ label, value, sub, trend, trendValue, alert }: KpiCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-3xl border-none shadow-sm ring-1 ring-black/5 p-4 flex flex-col gap-2 min-w-0",
      alert ? "bg-destructive/[0.02] ring-destructive/30" : ""
    )}>
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest leading-none">
        {label}
      </span>
      <span className="text-2xl font-mono font-medium text-foreground tracking-tight leading-none">
        {value}
      </span>
      <div className="flex items-center gap-1.5">
        {trend && trendValue && (
          <span className={cn(
            "text-[11px] font-mono font-medium",
            trend === "up"   ? "text-primary"     : "",
            trend === "down" ? "text-destructive" : "",
            trend === "neutral" ? "text-muted-foreground" : ""
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"} {trendValue}
          </span>
        )}
        {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}

// ─── Admin Shell ──────────────────────────────────────────────────────────────

export interface AdminShellProps {
  children: React.ReactNode;
  /** Drawer content. If provided and drawerOpen=true, drawer slides in */
  drawer?: React.ReactNode;
  drawerOpen?: boolean;
  drawerTitle?: string;
  onDrawerClose?: () => void;
  /** Page-level header area (title + action bar), rendered above main content */
  pageHeader?: React.ReactNode;
}

export function AdminShell({
  children,
  drawer,
  drawerOpen = false,
  drawerTitle,
  onDrawerClose,
  pageHeader,
}: AdminShellProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [env, setEnv] = useState<Environment>("PROD");
  const [search, setSearch] = useState("");

  function cycleEnv() {
    const idx = ENV_CYCLE.indexOf(env);
    setEnv(ENV_CYCLE[(idx + 1) % ENV_CYCLE.length]);
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && search.trim()) {
      // Global search navigates to payments with query pre-filled (prototype)
      navigate(`/admin/support/payments`);
    }
  }

  function isActive(path: string) {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-[220px] shrink-0 flex flex-col border-r border-border bg-card z-30">
        {/* Awning stripe at top */}
        <AwningBand />

        {/* Logo row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground tracking-tight">Admin</span>
          </div>
          <button
            onClick={cycleEnv}
            title="Click to cycle environment"
            className={cn(
              "text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border transition-colors",
              ENV_STYLE[env]
            )}
          >
            <span className={cn("inline-block w-1 h-1 rounded-full mr-1 align-middle", ENV_DOT[env])} />
            {env}
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-2 py-1.5">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-colors mb-0.5",
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1 h-1 rounded-full bg-primary shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-3 border-t border-border/50">
          <Link
            to="/admin/gaps"
            className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Repo gaps →
          </Link>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-12 shrink-0 flex items-center gap-3 px-5 border-b border-border bg-card z-20">
          {/* Global search */}
          <div className="flex items-center gap-2 flex-1 max-w-sm bg-background rounded-2xl border-none ring-1 ring-black/5 px-3 py-1.5 shadow-sm">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search IDs, refs, merchants…"
              className="flex-1 text-xs bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[11px] font-mono text-muted-foreground/60">v2.0</span>
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[11px] font-semibold text-primary">AD</span>
            </div>
          </div>
        </header>

        {/* Page header slot */}
        {pageHeader && (
          <div className="shrink-0 border-b border-border/60 bg-card">
            {pageHeader}
          </div>
        )}

        {/* Content + Drawer */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Scrollable main content */}
          <main className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            drawerOpen ? "mr-[400px]" : ""
          )}>
            {children}
          </main>

          {/* Details Drawer */}
          {drawer && (
            <div className={cn(
              "absolute right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border flex flex-col z-10",
              "transition-transform duration-300 ease-in-out",
              drawerOpen ? "translate-x-0" : "translate-x-full"
            )}>
              {/* Drawer top bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
                {drawerTitle && (
                  <span className="text-sm font-semibold text-foreground truncate">{drawerTitle}</span>
                )}
                <button
                  onClick={onDrawerClose}
                  className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto p-5">
                {drawer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page-level layout helpers ────────────────────────────────────────────────

export function AdminPageHeader({
  title, description, action,
}: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div>
        <h1 className="text-base font-semibold text-foreground leading-none">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function AdminSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function AdminKpiGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {children}
    </div>
  );
}
