import React from "react";
import { cn } from "../../ui/utils";

type AwningIconVariant = "outline" | "filled" | "badge";

interface AwningIconProps extends React.SVGProps<SVGSVGElement> {
  variant?: AwningIconVariant;
  size?: number;
}

export function AwningIcon({ variant = "outline", size = 24, className, ...props }: AwningIconProps) {
  // Outline: Thin strokes (1.5px), minimal details
  if (variant === "outline") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-foreground", className)}
        {...props}
      >
        <path
          d="M4 9L6 4H18L20 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 9C4 9 5.5 10.5 7 10.5C8.5 10.5 10 9 10 9C10 9 11.5 10.5 13 10.5C14.5 10.5 16 9 16 9C16 9 17.5 10.5 19 10.5C20.5 10.5 22 9 22 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 10.5V20H18V10.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Filled: Solid shape, for emphasis or logos
  if (variant === "filled") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-primary", className)}
        {...props}
      >
        <path
          d="M4 9L6 4H18L20 9"
          fill="currentColor"
        />
        <path
          d="M4 9C4 9 5.5 10.5 7 10.5C8.5 10.5 10 9 10 9C10 9 11.5 10.5 13 10.5C14.5 10.5 16 9 16 9C16 9 17.5 10.5 19 10.5C20.5 10.5 22 9 22 9V9.5C22 10 21.5 10.5 21 10.5H3C2.5 10.5 2 10 2 9.5V9C2 9 3.5 10.5 4 9Z"
          fill="currentColor"
        />
        <rect x="6" y="11" width="12" height="9" rx="1" fill="currentColor" opacity="0.8" />
      </svg>
    );
  }

  // Badge: Small, simple, often used inline or as status
  if (variant === "badge") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-primary", className)}
        {...props}
      >
        <rect x="2" y="6" width="20" height="12" rx="3" fill="currentColor" fillOpacity="0.1" />
        <path
          d="M7 10L8 7H16L17 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 11V16H17V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
}
