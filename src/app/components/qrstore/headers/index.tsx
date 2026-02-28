export { AwningHeader } from "./awning-header";
export { AwningIcon } from "./awning-icons";
import React from "react";
import { AwningHeader } from "./awning-header";
import { AwningIcon } from "./awning-icons";
import { Button } from "../../ui/button";
import { ArrowLeft, ShoppingBag, Settings, Menu, X, Share, ChevronLeft, User } from "lucide-react";
import { cn } from "../../ui/utils";

// Storefront Header
interface StorefrontHeaderProps {
  merchantName?: string;
  cartCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
  showBack?: boolean;
  onBackClick?: () => void;
  className?: string;
}

export function StorefrontHeader({
  merchantName = "Store",
  cartCount = 0,
  onCartClick,
  onMenuClick,
  showBack = false,
  onBackClick,
  className
}: StorefrontHeaderProps) {
  return (
    <AwningHeader className={className}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack ? (
            <Button variant="ghost" size="icon" onClick={onBackClick} className="-ml-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="-ml-2 text-muted-foreground hover:text-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          )}
          <span className="font-medium text-lg tracking-tight truncate max-w-[200px]">
            {merchantName}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onCartClick} className="relative text-muted-foreground hover:text-foreground">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-background">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </AwningHeader>
  );
}

// Checkout Header - Minimal
interface CheckoutHeaderProps {
  onBackClick?: () => void;
  onCloseClick?: () => void;
  title?: string;
  className?: string;
}

export function CheckoutHeader({
  onBackClick,
  onCloseClick,
  title = "Checkout",
  className
}: CheckoutHeaderProps) {
  return (
    <AwningHeader className={className}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
           {onBackClick && (
            <Button variant="ghost" size="icon" onClick={onBackClick} className="-ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <AwningIcon variant="badge" size={20} className="text-primary" />
            <span className="font-medium text-lg">{title}</span>
          </div>
        </div>
        
        {onCloseClick && (
          <Button variant="ghost" size="icon" onClick={onCloseClick} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </AwningHeader>
  );
}

// Seller Header - For merchants
interface SellerHeaderProps {
  title?: string;
  onSettingsClick?: () => void;
  onShareClick?: () => void;
  onProfileClick?: () => void;
  onBackClick?: () => void;
  className?: string;
}

export function SellerHeader({
  title = "Payment QR",
  onSettingsClick,
  onShareClick,
  onProfileClick,
  onBackClick,
  className
}: SellerHeaderProps) {
  return (
    <AwningHeader className={className}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackClick ? (
            <Button variant="ghost" size="icon" onClick={onBackClick} className="-ml-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          ) : (
            <AwningIcon variant="filled" size={24} className="text-primary" />
          )}
          <span className="font-semibold text-lg">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {onShareClick && (
            <Button variant="ghost" size="icon" onClick={onShareClick} className="text-muted-foreground hover:text-foreground">
              <Share className="w-5 h-5" />
            </Button>
          )}
          {onSettingsClick && (
            <Button id="payout-settings" variant="ghost" size="icon" onClick={onSettingsClick} className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          )}
          {onProfileClick && (
            <Button id="profile-btn" variant="ghost" size="icon" onClick={onProfileClick} className="text-muted-foreground hover:text-foreground">
              <User className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </AwningHeader>
  );
}

// Owner Header - Backoffice (Mono variant)
interface OwnerHeaderProps {
  title?: string;
  className?: string;
  onMenuClick?: () => void;
}

export function OwnerHeader({
  title = "Backoffice",
  className,
  onMenuClick
}: OwnerHeaderProps) {
  return (
    <AwningHeader variant="mono" className={className}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="-ml-2 text-muted-foreground hover:text-foreground">
               <Menu className="w-5 h-5" />
            </Button>
          )}
          <AwningIcon variant="outline" size={20} className="text-foreground/80" />
          <span className="font-mono text-sm tracking-tight uppercase text-muted-foreground">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">LIVE</span>
        </div>
      </div>
    </AwningHeader>
  );
}
