import React, { useState } from "react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Loader2, Copy, Check, WifiOff } from "lucide-react";
import { AwningBand } from "./headers/awning-band";

// ─── Shared helpers ────────────────────────────────────────────────────────────

export type ErrorIconVariant = "destructive" | "warning" | "primary" | "muted";

function iconBgClass(v: ErrorIconVariant): string {
  switch (v) {
    case "destructive": return "bg-destructive/10 text-destructive";
    case "warning":     return "bg-amber-500/10 text-amber-600";
    case "primary":     return "bg-primary/10 text-primary";
    case "muted":
    default:            return "bg-muted text-muted-foreground";
  }
}

/** Left-border accent color for InlineErrorCard */
function accentBorderClass(v: ErrorIconVariant): string {
  switch (v) {
    case "destructive": return "border-l-destructive/60";
    case "warning":     return "border-l-amber-400";
    case "primary":     return "border-l-primary/60";
    case "muted":
    default:            return "border-l-border";
  }
}

/** Very faint background tint for InlineErrorCard */
function accentBgClass(v: ErrorIconVariant): string {
  switch (v) {
    case "destructive": return "bg-destructive/[0.025]";
    case "warning":     return "bg-amber-500/[0.025]";
    case "primary":     return "bg-primary/[0.02]";
    case "muted":
    default:            return "";
  }
}

// ─── 1. BlockingErrorScreen ────────────────────────────────────────────────────
//
// Full-screen replacement for critical states. Includes the awning band at the
// top so it can stand alone as a complete screen.
//
// Variant props: hasSecondary · hasDetails · showsReferenceId

export interface BlockingErrorScreenProps {
  title: string;
  body: string;
  primaryCta: string;
  onPrimary?: () => void;
  /** Show a second ghost-style subordinate button */
  hasSecondary?: boolean;
  secondaryCta?: string;
  onSecondary?: () => void;
  /** Show a "Details →" text link below the CTAs */
  hasDetails?: boolean;
  onDetails?: () => void;
  /** Show a copyable mono Reference ID row at the bottom */
  showsReferenceId?: boolean;
  referenceId?: string;
  /** Optional icon node placed in a rounded container above the title */
  icon?: React.ReactNode;
  iconVariant?: ErrorIconVariant;
  /** Arbitrary extra node rendered between body text and the hairline separator */
  extra?: React.ReactNode;
  /** Whether to render the AwningBand stripe at the very top (default true) */
  showAwning?: boolean;
}

export function BlockingErrorScreen({
  title,
  body,
  primaryCta,
  onPrimary,
  hasSecondary = false,
  secondaryCta,
  onSecondary,
  hasDetails = false,
  onDetails,
  showsReferenceId = false,
  referenceId = "REF-A1B2C3D4",
  icon,
  iconVariant = "destructive",
  extra,
  showAwning = true,
}: BlockingErrorScreenProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(referenceId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex flex-col min-h-[440px] bg-background">
      {showAwning && <AwningBand />}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-5 text-center">

        {/* Icon — lifted with shadow so it reads against cream */}
        {icon && (
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center shadow-sm",
              iconBgClass(iconVariant)
            )}
          >
            {icon}
          </div>
        )}

        {/* Title + body — title needs authority, not just size */}
        <div className="space-y-2 max-w-[272px]">
          <h2 className="text-xl font-semibold text-foreground leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
        </div>

        {/* Extra slot (e.g. countdown pill) */}
        {extra}

        {/* Hairline */}
        <div className="w-full border-t border-border/40" />

        {/* CTAs — strict visual hierarchy: filled > ghost-muted > text-link */}
        <div className="w-full space-y-2">
          {/* Primary — full green fill */}
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 text-sm font-medium"
            onClick={onPrimary}
          >
            {primaryCta}
          </Button>

          {/* Secondary — ghost-muted so primary dominates */}
          {hasSecondary && secondaryCta && (
            <Button
              variant="ghost"
              className="w-full rounded-xl h-11 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all"
              onClick={onSecondary}
            >
              {secondaryCta}
            </Button>
          )}

          {/* Details — text-link, green so it reads as navigation not content */}
          {hasDetails && (
            <button
              className="flex items-center gap-1 mx-auto text-xs text-primary/70 hover:text-primary transition-colors pt-0.5"
              onClick={onDetails}
            >
              Details
              <span aria-hidden>→</span>
            </button>
          )}
        </div>

        {/* Reference ID — mono pill with copy affordance */}
        {showsReferenceId && (
          <>
            <div className="w-full border-t border-border/40" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground/60 uppercase tracking-widest font-mono">
                Ref
              </span>
              <code className="text-[11px] font-mono tracking-wider text-foreground/55 bg-muted/60 px-2 py-0.5 rounded">
                {referenceId}
              </code>
              <button
                onClick={handleCopy}
                title="Copy reference ID"
                className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                {copied
                  ? <Check className="w-3 h-3 text-primary" />
                  : <Copy className="w-3 h-3" />
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── 2. InlineErrorCard ────────────────────────────────────────────────────────
//
// Compact card for non-blocking states embedded within a screen.
// Left accent border signals severity without taking up space.

export interface InlineErrorCardProps {
  title: string;
  body: string;
  primaryCta: string;
  onPrimary?: () => void;
  /** Show a second subordinate button */
  hasSecondary?: boolean;
  secondaryCta?: string;
  onSecondary?: () => void;
  icon?: React.ReactNode;
  iconVariant?: ErrorIconVariant;
}

export function InlineErrorCard({
  title,
  body,
  primaryCta,
  onPrimary,
  hasSecondary = false,
  secondaryCta,
  onSecondary,
  icon,
  iconVariant = "destructive",
}: InlineErrorCardProps) {
  return (
    <div
      className={cn(
        // Base card
        "rounded-xl border border-border p-4 space-y-3 shadow-sm",
        // Left accent — 3 px strip, colored by severity
        "border-l-[3px]",
        accentBorderClass(iconVariant),
        // Very faint tint to reinforce the severity
        accentBgClass(iconVariant)
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              iconBgClass(iconVariant)
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-0.5">
        <Button
          size="sm"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 rounded-lg"
          onClick={onPrimary}
        >
          {primaryCta}
        </Button>

        {hasSecondary && secondaryCta && (
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-xs h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={onSecondary}
          >
            {secondaryCta}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── 3. PersistentBanner ──────────────────────────────────────────────────────
//
// Full-width sticky banner. Icon anchors reading; action lives at the right.

export interface PersistentBannerProps {
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "offline" | "warning";
}

export function PersistentBanner({
  text,
  actionLabel,
  onAction,
  variant = "offline",
}: PersistentBannerProps) {
  return (
    <div
      className={cn(
        "w-full px-4 py-2.5 flex items-center gap-2.5",
        variant === "offline" ? "bg-foreground/92 text-background" : "bg-amber-500 text-white"
      )}
    >
      {/* Leading icon — gives instant recognition before reading text */}
      {variant === "offline"
        ? <WifiOff className="w-3.5 h-3.5 shrink-0 opacity-80" />
        : <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
      }

      <p className="text-sm font-medium flex-1">{text}</p>

      {actionLabel && (
        <button
          className="text-sm font-semibold underline underline-offset-2 shrink-0 opacity-80 hover:opacity-100 transition-opacity"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ─── 4. ProcessingOverlay ─────────────────────────────────────────────────────
//
// Absolute overlay when Pay is tapped. Pulsing ring gives visual weight.

export function ProcessingOverlay({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
      {/* Spinner with pulsing ring for visual mass */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-14 h-14 rounded-full border-2 border-primary/20 animate-ping" />
        <div className="w-10 h-10 rounded-full border-2 border-primary/10 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      </div>
      <p className="text-sm font-medium text-foreground tracking-wide">Processing…</p>
    </div>
  );
}

// ─── 5. ReconnectingBanner ────────────────────────────────────────────────────
//
// Slim mono banner for Seller polling degraded state.
// Never regress from Paid state once shown.

export function ReconnectingBanner({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;
  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-400/20 px-4 py-2 flex items-center justify-center gap-2">
      {/* Blinking dot — presence over spinner for slim banners */}
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
      <Loader2 className="w-3 h-3 text-amber-600 animate-spin shrink-0" />
      <span className="text-[11px] font-mono tracking-widest text-amber-700">
        Reconnecting…
      </span>
    </div>
  );
}
