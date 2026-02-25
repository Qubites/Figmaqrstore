import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * PriceInput - Specialized input for monetary values
 * Shows currency clearly, formats as user types
 * Used in seller app and owner backoffice
 */
export function PriceInput({
  value,
  onChange,
  currency = "EUR",
  label = "Amount",
  placeholder = "0.00",
  disabled = false,
  className = ""
}: PriceInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only numbers and decimal point
    const sanitized = input.replace(/[^\d.]/g, "");
    // Ensure only one decimal point
    const parts = sanitized.split(".");
    const formatted = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join("")}`
      : sanitized;
    onChange(formatted);
  };

  return (
    <div className={className}>
      {label && (
        <Label className="block mb-2">{label}</Label>
      )}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none font-commerce text-sm">
          {currency}
        </div>
        <Input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-16 text-2xl h-14 font-commerce ${isFocused ? 'ring-2 ring-primary/20' : ''}`}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Charged in {currency}
      </p>
    </div>
  );
}

interface ProductPriceDisplayProps {
  amount: string;
  currency: string;
  vatIncluded?: boolean;
  vatRate?: number;
  className?: string;
}

/**
 * ProductPriceDisplay - Shows product price with VAT info
 * Clear about whether VAT is included/charged
 */
export function ProductPriceDisplay({
  amount,
  currency,
  vatIncluded = false,
  vatRate,
  className = ""
}: ProductPriceDisplayProps) {
  return (
    <div className={className}>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold font-commerce">
          {currency} {amount}
        </span>
      </div>
      {vatRate !== undefined && vatRate > 0 ? (
        <p className="text-xs text-muted-foreground mt-1 font-commerce">
          {vatIncluded ? `Includes ${vatRate}% VAT` : `+ ${vatRate}% VAT`}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground mt-1">
          VAT not charged
        </p>
      )}
    </div>
  );
}