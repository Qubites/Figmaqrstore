import React from "react";
import { cn } from "../../ui/utils";

interface AwningBandProps {
  className?: string;
  variant?: "default" | "mono";
}

export function AwningBand({ className, variant = "default" }: AwningBandProps) {
  // Deep Green #006241
  // Cream #F7F5EF
  
  const isMono = variant === "mono";
  
  // For the default variant, we use the brand colors
  // For mono, we use grayscale or opacity based approach
  
  const style: React.CSSProperties = isMono 
    ? {
        backgroundImage: `repeating-linear-gradient(
          90deg,
          #333333,
          #333333 12px,
          #E5E5E5 12px,
          #E5E5E5 24px
        )`
      }
    : {
        backgroundImage: `repeating-linear-gradient(
          90deg,
          #006241,
          #006241 12px,
          #F7F5EF 12px,
          #F7F5EF 24px
        )`
      };

  return (
    <div 
      className={cn("w-full h-1.5", className)} 
      style={style}
      aria-hidden="true"
    />
  );
}
