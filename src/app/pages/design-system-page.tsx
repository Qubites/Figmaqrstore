import React from "react";
import { StorefrontIcon } from "../components/brand/storefront-icon";
import { VerifiedBadge, SalesBucketBadge, PaymentTrustRow, TrustLayer } from "../components/qrstore/trust-badges";
import { StatusChip, RiskBadge, LiveStatusIndicator } from "../components/qrstore/status-chips";
import { PriceInput, ProductPriceDisplay } from "../components/qrstore/price-input";
import { EmptyState } from "../components/qrstore/empty-state";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Link } from "react-router";
import { Home, AlertTriangle } from "lucide-react";

export default function DesignSystemPage() {
  const [priceValue, setPriceValue] = React.useState("10.50");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StorefrontIcon variant="filled" size={32} className="text-[var(--brand-primary)]" />
              <h1 className="text-xl font-semibold">QrStore Design System</h1>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Brand Identity */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Brand Identity</h2>
          
          <Card className="p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">Storefront Awning Motif</h3>
            <p className="text-muted-foreground mb-6">
              The core brand element. Must be present in logos, empty states, onboarding, and key headers.
              Works at 16px–512px and in monochrome.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-8 mb-3 flex items-center justify-center">
                  <StorefrontIcon variant="outline" size={64} />
                </div>
                <h4 className="font-semibold mb-1">Outline</h4>
                <p className="text-sm text-muted-foreground">
                  Empty states, large headers
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                  variant="outline"
                </code>
              </div>

              <div className="text-center">
                <div className="bg-[var(--brand-primary)] rounded-lg p-8 mb-3 flex items-center justify-center">
                  <StorefrontIcon variant="filled" size={64} className="text-white" />
                </div>
                <h4 className="font-semibold mb-1">Filled</h4>
                <p className="text-sm text-muted-foreground">
                  Logo mark, app icons
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                  variant="filled"
                </code>
              </div>

              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-8 mb-3 flex items-center justify-center">
                  <StorefrontIcon variant="badge" size={64} />
                </div>
                <h4 className="font-semibold mb-1">Badge</h4>
                <p className="text-sm text-muted-foreground">
                  Small inline usage 16-24px
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                  variant="badge"
                </code>
              </div>
            </div>
          </Card>
        </section>

        {/* Design Tokens */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Design Tokens</h2>
          
          <Card className="p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">Brand Colors</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="w-full h-24 rounded-lg bg-[var(--brand-primary)] mb-2"></div>
                <p className="font-semibold">Primary</p>
                <code className="text-xs text-muted-foreground">#6366f1</code>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg bg-[var(--brand-success)] mb-2"></div>
                <p className="font-semibold">Success</p>
                <code className="text-xs text-muted-foreground">#10b981</code>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg bg-[var(--brand-warning)] mb-2"></div>
                <p className="font-semibold">Warning</p>
                <code className="text-xs text-muted-foreground">#f59e0b</code>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg bg-[var(--brand-awning)] mb-2"></div>
                <p className="font-semibold">Awning</p>
                <code className="text-xs text-muted-foreground">#ef4444</code>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">Status Colors</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="w-full h-24 rounded-lg bg-[var(--status-paid)] mb-2"></div>
                <p className="font-semibold">Paid</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg bg-[var(--status-pending)] mb-2"></div>
                <p className="font-semibold">Pending</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg bg-[var(--status-failed)] mb-2"></div>
                <p className="font-semibold">Failed</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg bg-[var(--status-risky)] mb-2"></div>
                <p className="font-semibold">Risky</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-4">Spacing & Typography</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Spacing System</p>
                <p className="text-muted-foreground">8pt grid (8px, 16px, 24px, 32px, 48px...)</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Border Radius</p>
                <div className="text-muted-foreground space-y-1">
                  <p>• rounded-full: Buttons, badges, avatars</p>
                  <p>• rounded-2xl: Inputs, controls, popovers</p>
                  <p>• rounded-3xl: Cards, dialogs, sheets, containers</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Typography Scale</p>
                <div className="space-y-2 mt-3">
                  <p className="text-3xl">Heading 1 (3xl)</p>
                  <p className="text-2xl">Heading 2 (2xl)</p>
                  <p className="text-xl">Heading 3 (xl)</p>
                  <p className="text-base">Body (base)</p>
                  <p className="text-sm">Small (sm)</p>
                  <p className="text-xs">Tiny (xs)</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Components</h2>

          {/* Trust Components */}
          <Card className="p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">Trust Layer Components</h3>
            <p className="text-muted-foreground mb-6">
              Pre-payment trust elements. Only show before payment is requested.
            </p>

            {/* NON-NEGOTIABLE WARNING */}
            <Alert className="mb-6 border-[var(--brand-warning)] bg-[var(--brand-warning)]/5">
              <AlertTriangle className="h-5 w-5 text-[var(--brand-warning)]" />
              <AlertTitle className="text-[var(--brand-warning)] font-bold">
                NON-NEGOTIABLE: 4 Required Trust Elements
              </AlertTitle>
              <AlertDescription className="text-sm space-y-2 mt-2">
                <p>
                  The following <strong>4 elements MUST be displayed</strong> on every checkout and storefront page <strong>BEFORE</strong> any payment request:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li><strong>Merchant name + logo</strong> (visual identity)</li>
                  <li><strong>Verified badge</strong> (KYB/compliance status)</li>
                  <li><strong>Sales bucket badge</strong> (New / 10+ / 100+ / 1,000+ sales)</li>
                  <li><strong>Payment methods row</strong> (Card, Apple Pay, Google Pay)</li>
                </ol>
                <p className="pt-2 text-xs">
                  ⚠️ <strong>This is a trust and compliance requirement.</strong> These elements cannot be hidden, removed, or shown after payment initiation. Use the <code className="bg-white/50 px-1 rounded">TrustLayer</code> component which includes all 4 elements automatically.
                </p>
              </AlertDescription>
            </Alert>

            <div className="space-y-8">
              <div>
                <h4 className="font-semibold mb-3">Verified Badge</h4>
                <VerifiedBadge verified={true} />
              </div>

              <div>
                <h4 className="font-semibold mb-3">Sales Bucket Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <SalesBucketBadge salesCount={0} />
                  <SalesBucketBadge salesCount={15} />
                  <SalesBucketBadge salesCount={150} />
                  <SalesBucketBadge salesCount={1500} />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Payment Trust Row</h4>
                <PaymentTrustRow />
              </div>

              <div>
                <h4 className="font-semibold mb-3">Complete Trust Layer</h4>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <TrustLayer
                    merchantName="Bella's Coffee Shop"
                    merchantLogo="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop"
                    verified={true}
                    salesCount={245}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Status Components */}
          <Card className="p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">Status Indicators</h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="font-semibold mb-3">Status Chips</h4>
                <div className="flex flex-wrap gap-3">
                  <StatusChip status="pending" />
                  <StatusChip status="paid" />
                  <StatusChip status="failed" />
                  <StatusChip status="new" />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Risk Badge</h4>
                <RiskBadge risk="risky" />
              </div>

              <div>
                <h4 className="font-semibold mb-3">Live Status Indicator</h4>
                <div className="space-y-3">
                  <LiveStatusIndicator status="pending" />
                  <LiveStatusIndicator status="paid" animated={false} />
                </div>
              </div>
            </div>
          </Card>

          {/* Price Components */}
          <Card className="p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">Price Components</h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="font-semibold mb-3">Price Input</h4>
                <div className="max-w-md">
                  <PriceInput
                    value={priceValue}
                    onChange={setPriceValue}
                    label="Amount"
                    currency="EUR"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Product Price Display</h4>
                <div className="space-y-4">
                  <ProductPriceDisplay
                    amount="3.50"
                    currency="EUR"
                    vatRate={9}
                    vatIncluded={true}
                  />
                  <ProductPriceDisplay
                    amount="10.00"
                    currency="EUR"
                    vatRate={0}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Empty State */}
          <Card className="p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4">Empty State</h3>
            <p className="text-muted-foreground mb-6">
              Uses storefront motif. Consistent across all surfaces.
            </p>
            <EmptyState
              title="No items yet"
              description="Your items will appear here once you add them"
              action={{
                label: "Add First Item",
                onClick: () => alert("Action clicked")
              }}
            />
          </Card>
        </section>

        {/* Design Rules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Design Rules</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">✓ DO</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• One primary CTA per screen</li>
                <li>• Show trust layer before payment</li>
                <li>• Use storefront motif in empty states</li>
                <li>• Make buttons big (44px+ touch target)</li>
                <li>• Show charged currency clearly</li>
                <li>• Keep copy simple: Scan. Pay. Done.</li>
                <li>• Separate seller and owner surfaces</li>
                <li>• Allow guest checkout</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">✗ DON'T</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use POS terminal wording</li>
                <li>• Force signup before payment</li>
                <li>• Mix seller and owner functions</li>
                <li>• Show both inc/ex VAT unless needed</li>
                <li>• Imply currency changes by display</li>
                <li>• Use HIGH_RISK (only SAFE/RISKY)</li>
                <li>• Put settings in seller app</li>
                <li>• Add friction to checkout</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Surface Boundaries */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Surface Boundaries</h2>
          <p className="text-muted-foreground mb-6">
            Hard separation between user types. Do not mix functionality.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">A) Client Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Guest-first. Pay fast. Trust layer. No account required.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">B) Merchant Device</h3>
              <p className="text-sm text-muted-foreground">
                Seller execution only. Create sale, show QR, see status. Big buttons.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">C) Merchant Backoffice</h3>
              <p className="text-sm text-muted-foreground">
                Owner settings only. Products, team, payouts, compliance.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">D) Admin</h3>
              <p className="text-sm text-muted-foreground">
                Read-only operations monitoring. Not implemented in this prototype.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">E) Storefront</h3>
              <p className="text-sm text-muted-foreground">
                Public merchant page. Product list, trust, pay button.
              </p>
            </Card>
          </div>
        </section>

        {/* Performance Guidelines */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Performance Guidelines</h2>
          
          <Card className="p-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">First Paint Target</h3>
                <p className="text-muted-foreground">
                  Show usable shell immediately: merchant + item + total + Pay button
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Loading States</h3>
                <p className="text-muted-foreground">
                  Use skeleton loaders for async content. Never block primary CTA.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Image Optimization</h3>
                <p className="text-muted-foreground">
                  Small logo thumbnails. Lazy load product images. Optimize for mobile networks.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Success Metrics</h3>
                <ul className="text-muted-foreground space-y-1 mt-2">
                  <li>• Scan-to-paid: &lt;45s on good network</li>
                  <li>• Seller creates QR: &lt;10s</li>
                  <li>• Storefront first paint: &lt;2s</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <StorefrontIcon variant="badge" size={16} />
              <span>QrStore Design System</span>
            </div>
            <div>
              Feb 2026 • Figma Make Prototype
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}