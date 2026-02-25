import React from "react";

export type StorefrontVariant = "outline" | "filled" | "badge" | "stripe";

interface StorefrontIconProps {
  variant?: StorefrontVariant;
  size?: number;
  className?: string;
}

/**
 * StorefrontIcon - The core brand element for QrStore
 * Represents a storefront with awning motif
 * 
 * Usage:
 * - Logo mark: variant="filled" size={32-64}
 * - Empty states: variant="outline" size={48-128}
 * - Small badge: variant="badge" size={16-24}
 * - Header stripe: variant="stripe" (full width awning band)
 */
export function StorefrontIcon({ 
  variant = "outline", 
  size = 24,
  className = ""
}: StorefrontIconProps) {
  const commonClasses = className || "text-current";

  if (variant === "stripe") {
    // Awning stripe band - subtle, stuck to top of header
    return (
      <div className={`w-full h-1.5 bg-gradient-to-b from-[var(--brand-awning)] to-[var(--brand-primary)] ${className}`}>
        <svg 
          className="w-full h-full" 
          viewBox="0 0 100 6" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle scalloped edge pattern */}
          <pattern id="scallop" x="0" y="0" width="8" height="6" patternUnits="userSpaceOnUse">
            <path 
              d="M0,0 Q2,3 4,0 T8,0" 
              fill="var(--brand-awning)" 
              opacity="0.3"
            />
          </pattern>
          <rect width="100" height="4" fill="var(--brand-awning)" />
          <rect width="100" height="2" y="4" fill="url(#scallop)" />
        </svg>
      </div>
    );
  }

  if (variant === "filled") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        {/* Awning */}
        <path
          d="M3 8L5 3H19L21 8V10C21 10.5 20.8 11 20.4 11.3C20 11.7 19.5 12 19 12C18.4 12 17.9 11.7 17.5 11.3C17 12.3 16 13 15 13C14 13 13 12.3 12.5 11.3C12 12.3 11 13 10 13C9 13 8 12.3 7.5 11.3C7.1 11.7 6.6 12 6 12C5.4 12 4.9 11.7 4.5 11.3C4.1 11 3.9 10.5 3.9 10V8H3Z"
          fill="currentColor"
        />
        {/* Storefront body */}
        <path
          d="M5 13V21H19V13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Door */}
        <rect
          x="9"
          y="15"
          width="6"
          height="6"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
    );
  }

  if (variant === "badge") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={commonClasses}
      >
        {/* Simple awning stripe */}
        <path
          d="M4 9L5.5 5H18.5L20 9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Storefront */}
        <path
          d="M5 10V19H19V10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default: outline variant
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={commonClasses}
    >
      {/* Awning structure */}
      <path
        d="M3 8L5 3H19L21 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle scalloped edge */}
      <path
        d="M3 8C3 8 5 10 7 10C9 10 10 8 12 8C14 8 15 10 17 10C19 10 21 8 21 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {/* Storefront body */}
      <path
        d="M5 10V21H19V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door with subtle detail */}
      <rect
        x="9"
        y="14"
        width="6"
        height="7"
        stroke="currentColor"
        strokeWidth="1.5"
        rx="0.5"
      />
    </svg>
  );
}

/**
 * AwningStripeBand - Subtle awning stripe to stick at top of headers
 * Non-cartoonish, Apple-style implementation
 */
export function AwningStripeBand({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-1 bg-[var(--brand-awning)] relative overflow-hidden ${className}`}>
      {/* Subtle gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
    </div>
  );
}
