import React, { useState } from "react";
import { Link } from "react-router";
import { AwningHeader, AwningIcon } from "../components/qrstore/headers";
import { AwningBand } from "../components/qrstore/headers/awning-band";
import {
  BlockingErrorScreen,
  InlineErrorCard,
  PersistentBanner,
  ProcessingOverlay,
  ReconnectingBanner,
} from "../components/qrstore/error-states";
import { cn } from "../components/ui/utils";
import {
  LogOut,
  Mail,
  Clock,
  Lock,
  Fingerprint,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Shield,
  ShieldAlert,
  AlertTriangle,
  WifiOff,
  Server,
  Gauge,
  Wrench,
  Camera,
  CameraOff,
  Bell,
  RefreshCw,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

// ─── Page-level layout primitives ─────────────────────────────────────────────

const TABS = ["Auth", "Checkout", "System", "Permissions", "Data", "Docs", "Copy"] as const;
type Tab = (typeof TABS)[number];

/** Returns a Tailwind bg class for the small severity dot on each frame key label */
function categoryDotClass(frameKey: string): string {
  if (frameKey.startsWith("auth."))         return "bg-amber-400";
  if (frameKey.startsWith("checkout."))     return "bg-destructive/70";
  if (frameKey.startsWith("system."))       return "bg-orange-400";
  if (frameKey.startsWith("permissions."))  return "bg-violet-400";
  if (frameKey.startsWith("data."))         return "bg-amber-500";
  return "bg-muted-foreground/40";
}

/** Wraps a single error-state frame in a labelled phone-sized card */
function FrameCard({
  frameKey,
  behaviorNote,
  children,
}: {
  frameKey: string;
  behaviorNote?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Frame key label — dot signals category at a glance */}
      <div className="self-start flex items-center gap-1.5">
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", categoryDotClass(frameKey))} />
        <code className="text-[10px] text-muted-foreground tracking-wide font-mono leading-none">
          {frameKey}
        </code>
      </div>

      {/* Phone-width container */}
      <div className="rounded-2xl border border-border overflow-hidden shadow-md shadow-foreground/[0.04] bg-background w-full max-w-[360px]">
        {children}
      </div>

      {/* Behavior note — annotation style */}
      {behaviorNote && (
        <div className="flex items-start gap-1.5 max-w-[360px]">
          <span className="text-muted-foreground/40 text-[10px] mt-0.5 shrink-0 select-none">↳</span>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
            {behaviorNote}
          </p>
        </div>
      )}
    </div>
  );
}

/** A responsive 2–3 column grid for frame cards */
function FrameGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
      {children}
    </div>
  );
}

/** One-line section description row shown above the frame grid */
function SectionMeta({
  description,
  count,
  dotClass,
}: {
  description: string;
  count: number;
  dotClass: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-border/40">
      <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{description}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={cn("w-1.5 h-1.5 rounded-full", dotClass)} />
        <span className="text-xs font-mono text-muted-foreground/60">
          {count} frame{count !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

/** Styled documentation panel (Retry Rules, Logging Hooks) */
function DocPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Panel header */}
      <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
        <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/** Simulated screen context for inline / banner components */
function MockScreen({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-background min-h-[300px]">
      <AwningBand />
      {/* Fake top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
        <div className="w-6 h-6 rounded bg-muted/60" />
        <div className="flex-1 h-3 bg-muted/60 rounded w-32 max-w-[120px]" />
      </div>
      {/* Label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="px-4 pb-5 flex-1 flex flex-col justify-center gap-3">
        {children}
      </div>
    </div>
  );
}

// ─── Auth frames (A–G) ────────────────────────────────────────────────────────

function AuthTab() {
  return (
    <>
      <SectionMeta
        description="Session expiry, magic-link validity failures, voluntary sign-out, and biometric lock states. All auth errors restart a clean flow — never silent-retry tokens."
        count={7}
        dotClass="bg-amber-400"
      />
      <FrameGrid>
        {/* A */}
        <FrameCard
          frameKey="auth.session_expired.client_portal"
          behaviorNote="Clears auth state and restarts magic-link flow."
        >
          <BlockingErrorScreen
            title="You've been signed out."
            body="For security, your session ended."
            primaryCta="Send sign-in link"
            hasSecondary
            secondaryCta="Contact support"
            icon={<LogOut className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* B */}
        <FrameCard
          frameKey="auth.session_expired.seller"
          behaviorNote="Clears seller session token and returns to sign-in."
        >
          <BlockingErrorScreen
            title="Session expired. Please sign in again."
            body="Your device session ended."
            primaryCta="Sign in"
            hasSecondary
            secondaryCta="Contact support"
            icon={<LogOut className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* C */}
        <FrameCard
          frameKey="auth.magic_link_invalid"
          behaviorNote="Invalidate token and never retry token exchange."
        >
          <BlockingErrorScreen
            title="This sign-in link is not valid."
            body="Request a new sign-in link to continue."
            primaryCta="Send sign-in link"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<Mail className="w-6 h-6" />}
            iconVariant="destructive"
          />
        </FrameCard>

        {/* D */}
        <FrameCard
          frameKey="auth.magic_link_expired"
          behaviorNote="Expired token path only; do not auto-retry."
        >
          <BlockingErrorScreen
            title="This sign-in link expired."
            body="Request a new sign-in link to continue."
            primaryCta="Send sign-in link"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<Clock className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* E */}
        <FrameCard
          frameKey="auth.logged_out"
          behaviorNote="User-initiated or remote logout complete."
        >
          <BlockingErrorScreen
            title="You're signed out."
            body="Sign in to continue."
            primaryCta="Sign in again"
            hasSecondary
            secondaryCta="Contact support"
            icon={<LogOut className="w-6 h-6" />}
            iconVariant="muted"
          />
        </FrameCard>

        {/* F — inline lock error */}
        <FrameCard
          frameKey="auth.biometrics_failed"
          behaviorNote="App stays locked; retry count follows OS."
        >
          <MockScreen label="Inline lock error">
            <InlineErrorCard
              title="Face ID/Touch ID didn't match."
              body="Try again or use your passcode."
              primaryCta="Try again"
              hasSecondary
              secondaryCta="Use passcode"
              icon={<Fingerprint className="w-5 h-5" />}
              iconVariant="destructive"
            />
          </MockScreen>
        </FrameCard>

        {/* G */}
        <FrameCard
          frameKey="auth.biometrics_locked_out"
          behaviorNote="Stop biometric prompts until OS unlock window resets."
        >
          <BlockingErrorScreen
            title="Biometric unlock is temporarily unavailable."
            body="Use your device passcode to continue."
            primaryCta="Use passcode"
            hasSecondary
            secondaryCta="Not now"
            icon={<Lock className="w-6 h-6" />}
            iconVariant="destructive"
          />
        </FrameCard>
      </FrameGrid>
    </>
  );
}

// ─── Checkout frames (H–N) ────────────────────────────────────────────────────

function CheckoutTab() {
  return (
    <>
      <SectionMeta
        description="Checkout session lifecycle, payment outcomes (fail, cancel, already paid), and risk step-up flows. Never auto-retry payment writes; always status-check first."
        count={7}
        dotClass="bg-destructive/70"
      />
      <FrameGrid>
        {/* H */}
        <FrameCard
          frameKey="checkout.session_expired"
          behaviorNote="Clear checkout token, invalidate pay attempt, return to start."
        >
          <BlockingErrorScreen
            title="This payment session expired."
            body="Start a new checkout to continue."
            primaryCta="Start over"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<Clock className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* I */}
        <FrameCard
          frameKey="checkout.already_paid"
          behaviorNote="Fetch paid order and route to receipt."
        >
          <BlockingErrorScreen
            title="This session is already paid."
            body="You can view the receipt."
            primaryCta="View receipt"
            hasSecondary
            secondaryCta="Contact support"
            icon={<CheckCircle2 className="w-6 h-6" />}
            iconVariant="primary"
          />
        </FrameCard>

        {/* J */}
        <FrameCard
          frameKey="checkout.payment_failed"
          behaviorNote="Re-enable checkout safely; do not duplicate charge."
        >
          <BlockingErrorScreen
            title="Payment didn't go through."
            body="Try again or use a different method."
            primaryCta="Try again"
            hasSecondary
            secondaryCta="Use a different method"
            hasDetails
            showsReferenceId
            icon={<XCircle className="w-6 h-6" />}
            iconVariant="destructive"
          />
        </FrameCard>

        {/* K */}
        <FrameCard
          frameKey="checkout.payment_cancelled"
          behaviorNote="Keep session if still valid."
        >
          <BlockingErrorScreen
            title="Payment was cancelled."
            body="You can return to checkout."
            primaryCta="Back to checkout"
            hasSecondary
            secondaryCta="Contact support"
            icon={<ArrowLeft className="w-6 h-6" />}
            iconVariant="muted"
          />
        </FrameCard>

        {/* L */}
        <FrameCard
          frameKey="checkout.payment_requires_action"
          behaviorNote="Launch 3DS/SCA and hold checkout state."
        >
          <BlockingErrorScreen
            title="Confirm this payment with your bank."
            body="Complete verification to finish payment."
            primaryCta="Continue"
            hasSecondary
            secondaryCta="Cancel payment"
            icon={<Shield className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* M */}
        <FrameCard
          frameKey="checkout.risk_stepup_required"
          behaviorNote="Launch risk step-up challenge flow."
        >
          <BlockingErrorScreen
            title="We need one more verification step."
            body="Complete verification to continue this payment."
            primaryCta="Continue"
            hasSecondary
            secondaryCta="Cancel payment"
            icon={<ShieldAlert className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* N */}
        <FrameCard
          frameKey="checkout.risk_stepup_failed"
          behaviorNote="Keep session valid if possible; allow alternate method."
        >
          <BlockingErrorScreen
            title="We couldn't verify this payment."
            body="Try again or use a different method."
            primaryCta="Try again"
            hasSecondary
            secondaryCta="Use a different method"
            hasDetails
            showsReferenceId
            icon={<ShieldAlert className="w-6 h-6" />}
            iconVariant="destructive"
          />
        </FrameCard>
      </FrameGrid>
    </>
  );
}

// ─── System frames (O–S) + component demos ────────────────────────────────────

function SystemTab() {
  return (
    <>
      <SectionMeta
        description="Connectivity, server, rate-limit, and maintenance states — plus live demos of the ProcessingOverlay and ReconnectingBanner components."
        count={7}
        dotClass="bg-orange-400"
      />
      <FrameGrid>
        {/* O — Banner + blocking */}
        <FrameCard
          frameKey="system.offline"
          behaviorNote="Pause network actions; resume on connectivity restore."
        >
          <div className="flex flex-col bg-background min-h-[440px]">
            <AwningBand />
            <PersistentBanner text="No internet connection." actionLabel="Try again" variant="offline" />
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-5 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-muted text-muted-foreground">
                <WifiOff className="w-6 h-6" />
              </div>
              <div className="space-y-2 max-w-[260px]">
                <h2 className="text-lg font-medium text-foreground leading-snug">
                  No internet connection.
                </h2>
                <p className="text-sm text-muted-foreground">Reconnect to continue.</p>
              </div>
              <div className="w-full border-t border-border/40" />
              <div className="w-full space-y-2.5">
                <button className="w-full bg-primary text-primary-foreground rounded-xl h-11 text-sm font-medium">
                  Try again
                </button>
                <button className="w-full rounded-xl h-11 text-sm border border-border text-foreground">
                  Enter code
                </button>
              </div>
            </div>
          </div>
        </FrameCard>

        {/* P */}
        <FrameCard
          frameKey="system.timeout"
          behaviorNote="Auto-retry safe reads first, then user retry."
        >
          <BlockingErrorScreen
            title="Request timed out."
            body="The server took too long to respond."
            primaryCta="Try again"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<Clock className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* Q */}
        <FrameCard
          frameKey="system.server_error"
          behaviorNote="No blind retry for payment writes; status-check first."
        >
          <BlockingErrorScreen
            title="We're having trouble right now."
            body="Please try again in a moment."
            primaryCta="Try again"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<Server className="w-6 h-6" />}
            iconVariant="destructive"
          />
        </FrameCard>

        {/* R — with countdown UI placeholder */}
        <FrameCard
          frameKey="system.rate_limited"
          behaviorNote="Honor Retry-After; disable primary until countdown ends."
        >
          <BlockingErrorScreen
            title="Too many attempts."
            body="Please wait a moment and try again."
            primaryCta="Try again"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<Gauge className="w-6 h-6" />}
            iconVariant="warning"
            extra={
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted border border-border">
                <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-mono tracking-widest text-muted-foreground">
                  Retry in 00:10
                </span>
              </div>
            }
          />
        </FrameCard>

        {/* S */}
        <FrameCard
          frameKey="system.maintenance"
          behaviorNote="Keep user state; periodic lightweight health recheck."
        >
          <BlockingErrorScreen
            title="We're doing maintenance right now."
            body="Please try again later."
            primaryCta="Try again later"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<Wrench className="w-6 h-6" />}
            iconVariant="muted"
          />
        </FrameCard>

        {/* Component demo: ProcessingOverlay */}
        <FrameCard
          frameKey="component.processing_overlay"
          behaviorNote="Used when Pay is tapped. Disables Pay, freezes inputs, blocks back."
        >
          <div className="relative flex flex-col bg-background min-h-[300px]">
            <AwningBand />
            {/* Simulated checkout content behind the overlay */}
            <div className="flex-1 p-6 space-y-4 opacity-25 pointer-events-none select-none">
              <div className="h-5 bg-muted rounded-lg w-2/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="mt-4 h-px bg-border" />
              <div className="h-12 bg-primary/20 rounded-xl" />
            </div>
            <ProcessingOverlay visible />
          </div>
        </FrameCard>

        {/* Component demo: ReconnectingBanner */}
        <FrameCard
          frameKey="component.reconnecting_banner"
          behaviorNote="Seller polling degraded state. Never regress from Paid once shown."
        >
          <div className="flex flex-col bg-background min-h-[260px]">
            <AwningBand />
            <ReconnectingBanner visible />
            {/* Simulated seller screen behind the banner */}
            <div className="flex-1 p-6 space-y-3 opacity-35 select-none">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="mt-3 h-px bg-border" />
              <div className="h-32 bg-muted rounded-xl" />
            </div>
          </div>
        </FrameCard>
      </FrameGrid>
    </>
  );
}

// ─── Permissions frames (T–W) ─────────────────────────────────────────────────

function PermissionsTab() {
  return (
    <>
      <SectionMeta
        description="Camera, notification, and biometric permission states. Optional permissions must never block the core payment or checkout task."
        count={4}
        dotClass="bg-violet-400"
      />
      <FrameGrid>
        {/* T */}
        <FrameCard
          frameKey="permissions.camera_denied"
          behaviorNote="Deep-link to settings; manual input always available."
        >
          <BlockingErrorScreen
            title="Allow camera access to scan QR codes."
            body="You can still enter a code manually."
            primaryCta="Open Settings"
            hasSecondary
            secondaryCta="Enter code"
            icon={<Camera className="w-6 h-6" />}
            iconVariant="muted"
          />
        </FrameCard>

        {/* U */}
        <FrameCard
          frameKey="permissions.camera_restricted"
          behaviorNote="No prompt loop; show fallback path."
        >
          <BlockingErrorScreen
            title="Camera access is restricted on this device."
            body="This setting is managed by device policy."
            primaryCta="Enter code"
            hasSecondary
            secondaryCta="Contact support"
            icon={<CameraOff className="w-6 h-6" />}
            iconVariant="muted"
          />
        </FrameCard>

        {/* V — non-blocking inline card */}
        <FrameCard
          frameKey="permissions.notifications_denied"
          behaviorNote="Never block checkout or core tasks."
        >
          <MockScreen label="Non-blocking inline card">
            <InlineErrorCard
              title="Notifications are off."
              body="Turn them on to get payment and receipt updates."
              primaryCta="Open Settings"
              hasSecondary
              secondaryCta="Not now"
              icon={<Bell className="w-5 h-5" />}
              iconVariant="muted"
            />
          </MockScreen>
        </FrameCard>

        {/* W — settings row state */}
        <FrameCard
          frameKey="permissions.biometrics_unavailable"
          behaviorNote="Disable biometric toggle when unavailable/restricted."
        >
          <MockScreen label="Settings row state">
            {/* Simulated settings row (disabled) */}
            <div className="bg-card rounded-xl border border-border overflow-hidden mb-3">
              <div className="flex items-center justify-between px-4 py-3.5 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Fingerprint className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Biometric unlock</p>
                    <p className="text-[11px] text-muted-foreground">Not available on this device</p>
                  </div>
                </div>
                {/* Disabled toggle */}
                <div className="w-9 h-5 rounded-full bg-muted border border-border" />
              </div>
            </div>
            <InlineErrorCard
              title="Biometric unlock is not available."
              body="You can use your device passcode instead."
              primaryCta="Use passcode"
              hasSecondary
              secondaryCta="Not now"
              icon={<Fingerprint className="w-5 h-5" />}
              iconVariant="muted"
            />
          </MockScreen>
        </FrameCard>
      </FrameGrid>
    </>
  );
}

// ─── Data integrity frames (X–Z) ──────────────────────────────────────────────

function DataTab() {
  return (
    <>
      <SectionMeta
        description="Stale totals, idempotency conflicts, and unknown fallback errors. Always refresh authoritative state before allowing a payment action."
        count={3}
        dotClass="bg-amber-500"
      />
      <FrameGrid>
        {/* X */}
        <FrameCard
          frameKey="data.stale_data"
          behaviorNote="Refresh authoritative state before allowing pay."
        >
          <BlockingErrorScreen
            title="This information changed."
            body="We refreshed your totals before payment."
            primaryCta="Review update"
            hasSecondary
            secondaryCta="Start over"
            hasDetails
            showsReferenceId
            icon={<RefreshCw className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* Y */}
        <FrameCard
          frameKey="data.idempotency_conflict"
          behaviorNote="Query by idempotency key; never fire a second charge blindly."
        >
          <BlockingErrorScreen
            title="This payment is already processing."
            body="We're checking the latest status now."
            primaryCta="View status"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<AlertTriangle className="w-6 h-6" />}
            iconVariant="warning"
          />
        </FrameCard>

        {/* Z */}
        <FrameCard
          frameKey="data.unknown_error"
          behaviorNote="Recover to safe route and attach reference ID."
        >
          <BlockingErrorScreen
            title="Something went wrong."
            body="Please try again."
            primaryCta="Try again"
            hasSecondary
            secondaryCta="Contact support"
            hasDetails
            showsReferenceId
            icon={<HelpCircle className="w-6 h-6" />}
            iconVariant="muted"
          />
        </FrameCard>
      </FrameGrid>
    </>
  );
}

// ─── Documentation tab ────────────────────────────────────────────────────────

const retryRules = [
  "Auto-retry only safe reads (2 retries, backoff 1 s then 2 s).",
  "Never auto-retry payment writes, risk submits, or consent writes.",
  "On Pay tap: disable Pay, show Processing…, freeze inputs, block back.",
  "If outcome unknown: status-check with idempotency key before enabling retry.",
  "Start over for expired checkout; Sign in again for auth failures.",
  "Seller polling: show Reconnecting… when degraded; never regress from Paid once shown.",
];

const loggingRules = [
  "Show Reference ID only when the Details link is present.",
  "Contact support pre-fills metadata: surface, error_type, reference_id, timestamp_utc, app_version, locale, network_state, session / order / checkout IDs when present.",
  "Exclude sensitive data (card numbers, raw tokens, passwords).",
];

function DocsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Retry + State Rules */}
      <DocPanel title="Retry + State Rules">
        <ol className="space-y-4">
          {retryRules.map((rule, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground">
              <span className="font-mono text-[11px] text-muted-foreground w-5 shrink-0 pt-[3px] text-right">
                {i + 1}.
              </span>
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ol>
      </DocPanel>

      {/* Logging + Support Hooks */}
      <DocPanel title="Logging + Support Hooks">
        <ul className="space-y-4">
          {loggingRules.map((rule, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground">
              <span className="text-primary mt-[3px] shrink-0">•</span>
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>

        {/* Support metadata preview */}
        <div className="mt-6 rounded-xl bg-muted/50 border border-border px-4 py-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
            Support payload (example)
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
            {[
              ["surface", "client_portal"],
              ["error_type", "checkout.payment_failed"],
              ["reference_id", "REF-A1B2C3D4"],
              ["timestamp_utc", "2026-02-21T14:32:00Z"],
              ["app_version", "1.4.2"],
              ["locale", "en-GB"],
              ["network_state", "online"],
              ["checkout_id", "chk_xxxxxxxxxxxxx"],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className="font-mono text-muted-foreground shrink-0">{k}</dt>
                <dd className="font-mono text-foreground/70 truncate">{v}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      </DocPanel>
    </div>
  );
}

// ─── Copy Dictionary tab ──────────────────────────────────────────────────────

const ctaLabels = [
  "Try again",
  "Start over",
  "Sign in",
  "Sign in again",
  "Send sign-in link",
  "View receipt",
  "Contact support",
  "Use passcode",
  "Open Settings",
  "Enter code",
  "Back to checkout",
  "Continue",
  "Cancel payment",
  "Use a different method",
  "Try again later",
  "Not now",
  "Review update",
  "View status",
];

const commonLabels = [
  { label: "Details", note: "text link · shown when Reference ID present" },
  { label: "Reference ID", note: "mono row · attach to support payload" },
  { label: "Processing…", note: "overlay · non-mono · shown on Pay tap" },
  { label: "Reconnecting…", note: "mono · slim banner · Seller polling" },
  { label: "Retry in 00:10", note: "countdown pill · mono · rate-limited" },
];

function CopyTab() {
  return (
    <div className="space-y-8">
      {/* CTA labels */}
      <DocPanel title="CTA Labels">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {ctaLabels.map((cta) => (
            <div
              key={cta}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-background hover:border-primary/40 transition-colors group cursor-default"
            >
              <span className="text-sm font-medium text-foreground leading-tight">{cta}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary/50 ml-auto shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      </DocPanel>

      {/* Common labels */}
      <DocPanel title="Common Labels">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commonLabels.map(({ label, note }) => (
            <div
              key={label}
              className="px-4 py-3 rounded-xl border border-border bg-background space-y-0.5"
            >
              <p className="text-sm font-mono font-medium text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </DocPanel>

      {/* Component map */}
      <DocPanel title="Pattern → Component Map">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider pb-2 pr-6 w-1/3">
                  Pattern
                </th>
                <th className="text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider pb-2 pr-6">
                  Component
                </th>
                <th className="text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider pb-2">
                  Used for
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                ["Blocking screen", "BlockingErrorScreen", "Auth failures, checkout errors, system errors"],
                ["Inline lock error", "InlineErrorCard", "Biometrics failure (F)"],
                ["Non-blocking card", "InlineErrorCard", "Notification permission (V), biometrics unavailable (W)"],
                ["Banner + blocking", "PersistentBanner + BlockingErrorScreen", "Offline state (O)"],
                ["Processing overlay", "ProcessingOverlay", "Pay tapped — freeze UI"],
                ["Reconnecting banner", "ReconnectingBanner", "Seller polling degraded"],
              ].map(([pattern, component, usage]) => (
                <tr key={pattern}>
                  <td className="py-2.5 pr-6 text-foreground font-medium">{pattern}</td>
                  <td className="py-2.5 pr-6 font-mono text-xs text-primary bg-primary/5 rounded px-2 w-fit">
                    {component}
                  </td>
                  <td className="py-2.5 text-muted-foreground text-xs">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocPanel>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ErrorSystemStatesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Auth");

  const tabContent: Record<Tab, React.ReactNode> = {
    Auth: <AuthTab />,
    Checkout: <CheckoutTab />,
    System: <SystemTab />,
    Permissions: <PermissionsTab />,
    Data: <DataTab />,
    Docs: <DocsTab />,
    Copy: <CopyTab />,
  };

  const frameCounts: Partial<Record<Tab, number>> = {
    Auth: 7,
    Checkout: 7,
    System: 7,
    Permissions: 4,
    Data: 3,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─ Sticky header ─────────────────────────────────────────────────── */}
      <AwningHeader sticky>
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-1">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <AwningIcon variant="filled" size={16} className="text-primary" />
              <span className="text-xs font-medium">QrStore</span>
            </Link>
            <span className="text-muted-foreground/50 text-xs">/</span>
            <span className="text-xs text-muted-foreground">Design System</span>
          </div>

          <h1 className="text-xl font-medium text-foreground tracking-tight">
            Error &amp; System States
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">
            Reusable components, 26 error frames A–Z, retry rules, and copy dictionary.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="max-w-7xl mx-auto border-t border-border/40">
          <div className="flex overflow-x-auto px-6 gap-0 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
                {frameCounts[tab] !== undefined && (
                  <span
                    className={cn(
                      "text-[10px] font-mono rounded-full px-1.5 py-0.5 leading-none",
                      activeTab === tab
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {frameCounts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </AwningHeader>

      {/* ─ Content ───────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-10">{tabContent[activeTab]}</main>

      {/* ─ Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
            QrStore · Error &amp; System States · v1.0
          </p>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}