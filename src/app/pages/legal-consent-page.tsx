import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Card } from "../components/ui/card";
import { Shield, FileText, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { cn } from "../components/ui/utils";

// --- Components ---

function ImplementationNote({ text }: { text: string }) {
  return (
    <div className="mt-4 p-2 bg-yellow-50 border border-yellow-100 rounded text-[10px] text-yellow-700 flex items-start gap-1.5 max-w-sm">
      <Info className="w-3 h-3 shrink-0 mt-0.5" />
      <span>{text}</span>
    </div>
  );
}

function LegalLink({ children }: { children: React.ReactNode }) {
  return (
    <a href="#" className="text-primary hover:underline font-medium" onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
}

// 1. Client Consent Interstitial (Authenticated)
export function ClientConsentInterstitial() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto border rounded-xl bg-white shadow-sm">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-gray-600" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Welcome to QrStore</h3>
      <p className="text-sm text-muted-foreground mb-6">
        By continuing, you agree to the <LegalLink>Terms of Service</LegalLink> and <LegalLink>Privacy Policy</LegalLink>.
      </p>
      <Button className="w-full" size="lg">Continue</Button>
      <ImplementationNote text="Store consent version and timestamp. Re-consent required when terms version changes." />
    </div>
  );
}

// 2. Guest Checkout Legal Notice (Inline)
export function GuestCheckoutLegalNotice() {
  return (
    <div className="max-w-sm mx-auto p-4 border rounded-xl bg-white">
      <h4 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">Checkout Context</h4>
      <div className="p-4 bg-gray-50 rounded-lg text-xs text-muted-foreground mb-4">
        <p>
          You’re checking out as a guest. No account is required. By placing this order, you agree to the <LegalLink>Terms of Service</LegalLink> and <LegalLink>Privacy Policy</LegalLink>.
        </p>
      </div>
      <Button size="lg" className="w-full">Pay $24.50</Button>
      <ImplementationNote text="Guest consent captured at pay step only (implicit acceptance)." />
    </div>
  );
}

// 3. Seller Policy Acceptance (First Login / Update)
export function SellerConsentInterstitial() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto border rounded-xl bg-white shadow-sm">
      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <FileText className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Seller Updates</h3>
      <p className="text-sm text-muted-foreground mb-6">
        We've updated our policies. By continuing, you agree to the <LegalLink>Seller Use Policy</LegalLink> and <LegalLink>Privacy Policy</LegalLink>.
      </p>
      <Button className="w-full" size="lg">Continue</Button>
      <ImplementationNote text="Store consent version and timestamp. Re-consent required when policy version changes." />
    </div>
  );
}

// 4. Merchant Owner Terms Acceptance (Backoffice)
export function OwnerConsentInterstitial() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto border rounded-xl bg-white shadow-sm">
      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-xl mb-2">Merchant Terms</h3>
      <p className="text-sm text-muted-foreground mb-8">
        Please review our updated terms. By continuing, you agree to the <LegalLink>Merchant Terms</LegalLink> and <LegalLink>Privacy Policy</LegalLink>.
      </p>
      <Button className="w-full bg-gray-900 hover:bg-gray-800" size="lg">Accept & Continue</Button>
      <ImplementationNote text="Store consent version and timestamp. Re-consent required when terms version changes." />
    </div>
  );
}

// 5. Receipt Delivery Opt-Ins
export function ReceiptOptInComponent() {
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(false);

  return (
    <div className="max-w-sm mx-auto p-4 border rounded-xl bg-white space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Receipt Options</h4>
      
      <div className="flex items-start space-x-3">
        <Checkbox id="email-opt" checked={email} onCheckedChange={(c) => setEmail(!!c)} />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="email-opt"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Email my receipt to this address.
          </label>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox id="sms-opt" checked={sms} onCheckedChange={(c) => setSms(!!c)} />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="sms-opt"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Text my receipt to this number.
          </label>
          <p className="text-[10px] text-muted-foreground">Message and data rates may apply.</p>
        </div>
      </div>
      
      <ImplementationNote text="Checkboxes unchecked by default. Explicit opt-in required." />
    </div>
  );
}

// 6. Storefront Legal Footer
export function StorefrontLegalFooter() {
  return (
    <div className="max-w-md mx-auto border rounded-xl bg-gray-50 overflow-hidden">
      <div className="p-8 h-32 flex items-center justify-center text-muted-foreground bg-gray-100 border-b">
        Content Area
      </div>
      <footer className="p-6 text-center">
        <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
          <a href="#" className="hover:underline hover:text-foreground">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-foreground">Privacy Policy</a>
        </div>
        <div className="mt-4 text-[10px] text-muted-foreground/50">
          © 2024 QrStore Inc.
        </div>
      </footer>
      <div className="p-4 bg-white border-t">
        <ImplementationNote text="Persistent legal links in footer. No active consent required here." />
      </div>
    </div>
  );
}

// --- Main Page ---

export default function LegalConsentPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Legal & Consent Patterns</h1>
          <p className="text-muted-foreground">Reusable consent UI components for Client, Guest, Seller, and Owner flows.</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">1. Client Consent Interstitial</h2>
          <ClientConsentInterstitial />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">2. Guest Checkout Notice</h2>
          <GuestCheckoutLegalNotice />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">3. Seller Policy Acceptance</h2>
          <SellerConsentInterstitial />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">4. Merchant Owner Terms</h2>
          <OwnerConsentInterstitial />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">5. Receipt Delivery Opt-Ins</h2>
          <ReceiptOptInComponent />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">6. Storefront Legal Footer</h2>
          <StorefrontLegalFooter />
        </section>

      </div>
    </div>
  );
}
