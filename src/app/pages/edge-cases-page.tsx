import React from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { 
  WifiOff, CloudOff, Camera, Settings, BellOff, Lock, User, CheckCircle2, AlertTriangle, Copy, ShieldCheck
} from "lucide-react";
import { cn } from "../components/ui/utils";

// --- Components ---

function ComponentSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold border-b pb-2">{title}</h2>
      {children}
    </section>
  );
}

// 1. Offline Legal Viewer
export function OfflineLegalViewer() {
  return (
    <div className="max-w-md mx-auto border rounded-xl bg-gray-50 overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <h3 className="font-semibold">Terms of Service</h3>
        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">v2.1</span>
      </div>
      <div className="p-6 text-sm text-muted-foreground bg-white h-48 overflow-y-auto">
        <p className="mb-4">
          1. Acceptance of Terms. By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement...
        </p>
        <p className="mb-4">
          2. Privacy Policy. We respect your privacy and permit you to control the treatment of your personal information...
        </p>
        <p className="opacity-50">
          [Cached content displayed]
        </p>
      </div>
      <div className="p-3 bg-yellow-50 border-t border-yellow-100 flex items-center justify-center gap-2 text-xs text-yellow-700">
        <WifiOff className="w-3 h-3" />
        <span>Offline mode. Content will sync when online.</span>
      </div>
    </div>
  );
}

// 2. Consent Event Queued State
export function ConsentEventQueuedState() {
  return (
    <div className="max-w-md mx-auto p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
      <CloudOff className="w-4 h-4 text-blue-500 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-700">Consent saved offline</p>
        <p className="text-xs text-blue-600">Your agreement will sync automatically when back online.</p>
      </div>
    </div>
  );
}

// 3. Camera Denied State
export function CameraDeniedState() {
  return (
    <div className="max-w-sm mx-auto p-5 border border-gray-200 rounded-xl bg-white shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
          <Camera className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Camera access denied</h4>
          <p className="text-xs text-muted-foreground mt-1">
            We can't scan QR codes without permission. You can still pay by entering the code manually.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="sm" className="w-full">
          Enter code manually
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <Copy className="w-3 h-3 mr-2" />
          Paste code
        </Button>
      </div>

      <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        <Settings className="w-3 h-3 mr-1.5" />
        Open Settings
      </Button>
    </div>
  );
}

// 4. Notifications Denied State
export function NotificationsDeniedState() {
  return (
    <div className="max-w-sm mx-auto p-4 bg-gray-50 rounded-lg flex items-start gap-3">
      <BellOff className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-900">Notifications are off</p>
        <p className="text-xs text-muted-foreground">
          You won't get push alerts, but you can still see all your updates in the <span className="font-medium text-foreground">Receipts</span> tab.
        </p>
      </div>
    </div>
  );
}

// 5. Biometrics Unavailable/Restricted
export function BiometricsUnavailable() {
  return (
    <div className="max-w-sm mx-auto border rounded-xl bg-white overflow-hidden divide-y divide-gray-100">
      {/* Variant: Unavailable */}
      <div className="p-4 flex items-center justify-between opacity-60">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">App Lock</span>
            <span className="text-[10px] text-muted-foreground">Unavailable on this device</span>
          </div>
        </div>
        <Switch disabled />
      </div>

      {/* Variant: Restricted */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-orange-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">App Lock</span>
            <span className="text-[10px] text-orange-600 font-medium">Restricted by device policy</span>
          </div>
        </div>
        <Switch disabled checked={false} />
      </div>
    </div>
  );
}

// 6. Guest-First Reminder
export function GuestFirstReminder() {
  return (
    <div className="max-w-sm mx-auto p-3 bg-gray-50/80 rounded-lg flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <User className="w-3 h-3" />
      <span>Checking out as guest. No account required.</span>
    </div>
  );
}

// 7. App Review Safety Checklist
export function AppReviewSafetyChecklist() {
  const items = [
    "Optional permissions never block core payment",
    "No repeated nag prompts after denial",
    "One primary CTA per screen",
    "Opt-ins unchecked by default",
    "Currency shown clearly before Pay"
  ];

  return (
    <Card className="max-w-md mx-auto p-6 bg-white shadow-sm border-l-4 border-l-green-500">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-lg">App Review Safety</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// --- Main Page ---

export default function EdgeCasesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Edge Cases UI</h1>
          <p className="text-muted-foreground">Reusable state components for offline, denied permissions, and restrictions.</p>
        </div>

        <ComponentSection title="1. Offline Legal Viewer">
          <OfflineLegalViewer />
        </ComponentSection>

        <ComponentSection title="2. Consent Event Queued">
          <ConsentEventQueuedState />
        </ComponentSection>

        <ComponentSection title="3. Camera Denied State">
          <CameraDeniedState />
        </ComponentSection>

        <ComponentSection title="4. Notifications Denied Helper">
          <NotificationsDeniedState />
        </ComponentSection>

        <ComponentSection title="5. Biometrics Unavailable / Restricted">
          <BiometricsUnavailable />
        </ComponentSection>

        <ComponentSection title="6. Guest-First Reminder">
          <GuestFirstReminder />
        </ComponentSection>

        <ComponentSection title="7. App Review Safety Checklist">
          <AppReviewSafetyChecklist />
        </ComponentSection>

      </div>
    </div>
  );
}
