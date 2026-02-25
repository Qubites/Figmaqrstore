import React from "react";
import { AwningBand } from "./awning-band";
import { cn } from "../../ui/utils";

interface AwningHeaderProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "mono";
  sticky?: boolean;
}

export function AwningHeader({ 
  children, 
  className, 
  variant = "default",
  sticky = true
}: AwningHeaderProps) {
  return (
    <header className={cn(
      "bg-background border-b border-border/50 flex flex-col z-40 transition-all",
      sticky && "sticky top-0",
      className
    )}>
      <AwningBand variant={variant} />
      <div className="w-full">
        {children}
      </div>
    </header>
  );
}
