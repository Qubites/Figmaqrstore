import React from "react";
import { StorefrontIcon } from "../brand/storefront-icon";
import { Button } from "../ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState - Uses storefront motif for empty screens
 * Consistent across all surfaces
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className="text-muted-foreground mb-4">
        {icon || <StorefrontIcon variant="outline" size={64} />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
