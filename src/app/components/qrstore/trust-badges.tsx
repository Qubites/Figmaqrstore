import React from "react";
import { CheckCircle2, ShieldCheck, CreditCard, Smartphone } from "lucide-react";
import { Badge } from "../ui/badge";

interface TrustBadgeProps {
  verified?: boolean;
  className?: string;
}

/**
 * Verified badge - strict verification indicator
 * Shows only when merchant is fully verified
 */
export function VerifiedBadge({ verified = true, className = "" }: TrustBadgeProps) {
  if (!verified) return null;

  return (
    <div className={`inline-flex items-center gap-1 text-[var(--brand-verified)] ${className}`}>
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span className="text-xs font-medium tracking-tight">Verified</span>
    </div>
  );
}

interface SalesBucketBadgeProps {
  salesCount: number;
  className?: string;
}

/**
 * Sales bucket badge - shows trust through transaction history
 * Buckets: New, 10+, 100+, 1,000+
 */
export function SalesBucketBadge({ salesCount, className = "" }: SalesBucketBadgeProps) {
  let label = "New Seller";
  
  if (salesCount >= 1000) {
    label = "1k+ sales";
  } else if (salesCount >= 100) {
    label = "100+ sales";
  } else if (salesCount >= 10) {
    label = "10+ sales";
  }

  return (
    <span className={`text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full font-commerce font-medium ${className}`}>
      {label}
    </span>
  );
}

interface PaymentTrustRowProps {
  methods?: ("card" | "apple_pay" | "google_pay")[];
  className?: string;
}

/**
 * Payment trust row - shows accepted payment methods
 * Minimal icon-only version for cleaner look
 */
export function PaymentTrustRow({ 
  methods = ["card", "apple_pay", "google_pay"],
  className = "" 
}: PaymentTrustRowProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
        <span>Trusted</span>
      </div>
      <div className="h-3 w-[1px] bg-stone-200" />
      <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-all text-stone-700">
        {methods.includes("apple_pay") && (
          <Smartphone className="w-4 h-4" />
        )}
        {methods.includes("google_pay") && (
          <Smartphone className="w-4 h-4" />
        )}
        {methods.includes("card") && (
           <CreditCard className="w-4 h-4" />
        )}
      </div>
    </div>
  );
}

interface TrustLayerProps {
  merchantName: string;
  merchantLogo?: string;
  verified?: boolean;
  salesCount?: number;
  paymentMethods?: ("card" | "apple_pay" | "google_pay")[];
  className?: string;
}

/**
 * TrustLayer - Complete pre-payment trust component
 * Refined for minimal Apple-style aesthetic
 */
export function TrustLayer({
  merchantName,
  merchantLogo,
  verified = false,
  salesCount = 0,
  paymentMethods,
  className = ""
}: TrustLayerProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Merchant identity */}
      <div className="flex items-center gap-3">
        {merchantLogo && (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-200 bg-white flex-shrink-0">
            <img src={merchantLogo} alt={merchantName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-neutral-900 truncate">{merchantName}</h3>
            <VerifiedBadge verified={verified} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <SalesBucketBadge salesCount={salesCount} />
          </div>
        </div>
      </div>

      {/* Payment methods - subtle separator */}
      <div className="pt-2 border-t border-stone-200">
        <PaymentTrustRow methods={paymentMethods} />
      </div>
    </div>
  );
}
