import React from "react";

interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

/**
 * SegmentedControl - Apple-style segmented control
 * Used for role selection (Seller | Owner) on homepage
 */
export function SegmentedControl({ 
  value, 
  onChange, 
  options,
  className = "" 
}: SegmentedControlProps) {
  return (
    <div 
      className={`inline-flex bg-muted rounded-lg p-0.5 ${className}`}
      role="tablist"
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${value === option.value 
              ? 'bg-white text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
