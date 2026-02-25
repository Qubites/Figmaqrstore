import React from "react";
import { Badge } from "../ui/badge";

export type OrderStatus = "pending" | "paid" | "failed" | "new";
export type RiskLevel = "safe" | "risky";

interface StatusChipProps {
  status: OrderStatus;
  className?: string;
}

/**
 * StatusChip - Visual indicator for order/payment status
 * Colors match QrStore brand palette
 */
export function StatusChip({ status, className = "" }: StatusChipProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-[var(--status-pending)] text-white"
    },
    paid: {
      label: "Paid",
      className: "bg-[var(--status-paid)] text-white"
    },
    failed: {
      label: "Failed",
      className: "bg-[var(--status-failed)] text-white"
    },
    new: {
      label: "New",
      className: "bg-[var(--status-new)] text-white"
    }
  };

  const config = statusConfig[status];

  return (
    <Badge className={`${config.className} ${className} font-commerce`}>
      {config.label}
    </Badge>
  );
}

interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

/**
 * RiskBadge - Shows risk level for transactions
 * Only SAFE or RISKY (no HIGH_RISK)
 * RISKY triggers step-up verification fields
 */
export function RiskBadge({ risk, className = "" }: RiskBadgeProps) {
  if (risk === "safe") return null;

  return (
    <Badge variant="outline" className={`border-[var(--status-risky)] text-[var(--status-risky)] ${className}`}>
      Additional verification required
    </Badge>
  );
}

interface LiveStatusIndicatorProps {
  status: OrderStatus;
  animated?: boolean;
  className?: string;
}

/**
 * LiveStatusIndicator - Real-time status with animation
 * Used in seller app for live order monitoring
 */
export function LiveStatusIndicator({ 
  status, 
  animated = true,
  className = "" 
}: LiveStatusIndicatorProps) {
  const isPending = status === "pending";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div 
          className={`w-3 h-3 rounded-full ${
            status === "paid" ? "bg-[var(--status-paid)]" :
            status === "pending" ? "bg-[var(--status-pending)]" :
            status === "failed" ? "bg-[var(--status-failed)]" :
            "bg-[var(--status-new)]"
          }`}
        />
        {isPending && animated && (
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-[var(--status-pending)] animate-ping opacity-75" />
        )}
      </div>
      <StatusChip status={status} />
    </div>
  );
}