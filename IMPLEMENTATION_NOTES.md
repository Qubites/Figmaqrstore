# QrStore Design System - Implementation Notes

## Project Structure

```
/src/app/
├── components/
│   ├── brand/
│   │   └── storefront-icon.tsx      # Core brand element (3 variants)
│   ├── qrstore/
│   │   ├── trust-badges.tsx         # Trust layer components
│   │   ├── status-chips.tsx         # Status indicators
│   │   ├── price-input.tsx          # Price input & display
│   │   └── empty-state.tsx          # Empty state with motif
│   └── ui/                           # Shadcn base components
├── pages/
│   ├── home-page.tsx                # Role chooser
│   ├── storefront-page.tsx          # Public merchant page
│   ├── client-checkout-page.tsx     # Guest checkout flow
│   ├── seller-app-page.tsx          # Seller execution app
│   ├── owner-backoffice-page.tsx    # Owner settings/config
│   └── design-system-page.tsx       # Component showcase
├── routes.ts                         # React Router config
└── App.tsx                           # Entry point
```

## Key Design Decisions

### 1. Storefront Awning Icon
- **Implementation**: 3 SVG variants (outline, filled, badge)
- **Scalability**: Works 16px–512px
- **Monochrome**: Uses currentColor for flexibility
- **Usage**: Logo, empty states, headers, badges

### 2. Trust Layer (Pre-Payment Only)
- **Components**: VerifiedBadge, SalesBucketBadge, PaymentTrustRow, TrustLayer
- **Rule**: Only displayed before payment request
- **4 Required Elements**:
  1. Merchant name + logo
  2. Verified badge (strict)
  3. Sales bucket (New/10+/100+/1,000+)
  4. Payment methods (Card/Apple Pay/Google Pay)

### 3. Surface Separation
- **Hard boundaries** enforced via routing
- Each surface has distinct purpose and user type
- No mixing of seller/owner functionality
- Separate files per surface for clarity

### 4. Speed-First Design
- One primary CTA per screen
- Guest checkout (no forced signup)
- Large touch targets (44px+)
- Minimal form fields
- Clear hierarchy

### 5. Status System
- **Colors**: Semantic status colors in theme.css
- **Types**: pending, paid, failed, new
- **Risk**: Only SAFE/RISKY (no HIGH_RISK)
- **Animation**: Pending status shows live indicator

### 6. Price Display
- **Currency clarity**: Always show charged currency
- **VAT handling**: Clear about included vs. added
- **No currency conversion**: Display setting doesn't change charge
- **Format**: Decimal input with currency prefix

## Key Assumptions

1. **Merchant is seller-of-record**
   - Receipt shows merchant legal details
   - VAT registration handled at merchant level
   - Not a marketplace model

2. **Guest-first checkout**
   - No account required to pay
   - Optional receipt delivery
   - Optional post-payment feedback

3. **Mobile-optimized**
   - Design assumes mobile-first usage
   - Touch-friendly targets
   - Responsive but mobile-primary

4. **Single currency per merchant**
   - Default currency set in settings
   - No multi-currency in this prototype

5. **Demo/prototype constraints**
   - Mock data used throughout
   - Simulated QR code (visual only)
   - Simulated payment processing
   - No real backend integration

## Open Questions for Client

### Business Logic
1. **Multi-product orders**
   - Current: Quick single item or custom amount
   - Question: Full shopping cart with quantities?

2. **Order types**
   - Current: Fixed price, custom amount
   - Question: Variable pricing? Measured units (kg, hours)?

3. **Receipt delivery**
   - Current: Optional email/SMS
   - Question: Required vs. optional? Default behavior?

4. **Reviews/ratings**
   - Current: Optional, post-payment, skip always visible
   - Question: When to show? Incentives?

### Technical
1. **QR code content**
   - Question: What data in QR? URL to checkout? Order ID?
   - Question: Dynamic vs. static QR?

2. **Session management**
   - Question: How long QR valid? Auto-expire?
   - Question: One-time use vs. reusable?

3. **Real-time updates**
   - Current: Simulated polling
   - Question: WebSocket? Server-Sent Events? Polling interval?

4. **Offline capability**
   - Question: Queue orders offline? Show cached data?

### Compliance
1. **KYB/KYC flow**
   - Current: Simple status display
   - Question: In-app verification? External provider?

2. **Payout timing**
   - Current: Daily automatic
   - Question: Configurable schedule? Instant payouts?

3. **Dispute handling**
   - Question: Chargeback flow? Seller interface?

### UI/UX Details
1. **Language support**
   - Question: How many languages? RTL support?
   - Question: Merchant sets default? Customer chooses?

2. **Dark mode**
   - Question: Support needed? Auto-detect? Toggle?

3. **Accessibility**
   - Question: WCAG level? Screen reader priority?

4. **Branding customization**
   - Question: Can merchants customize colors? Logo only?

## Performance Targets

✅ **Implemented**
- Clean component structure
- Minimal re-renders
- Lazy loading routes
- Optimized images (via Unsplash)

🎯 **Production Needs**
- Image optimization pipeline
- Bundle size optimization
- API response caching
- Progressive Web App features

## Next Steps

### Phase 1: Refinement
- [ ] Client review and feedback
- [ ] Adjust based on business rules
- [ ] Finalize color palette
- [ ] Complete missing states (errors, loading)

### Phase 2: Expansion
- [ ] Complete flows (signup, onboarding)
- [ ] Add client portal screens
- [ ] Implement admin monitoring
- [ ] Add more product types

### Phase 3: Polish
- [ ] Micro-interactions
- [ ] Advanced animations
- [ ] Accessibility audit
- [ ] Performance optimization

## Design System Usage

### For Developers
```tsx
// Import brand element
import { StorefrontIcon } from "../components/brand/storefront-icon";
<StorefrontIcon variant="outline" size={64} />

// Use trust layer
import { TrustLayer } from "../components/qrstore/trust-badges";
<TrustLayer merchantName="..." verified={true} salesCount={245} />

// Status indicators
import { LiveStatusIndicator } from "../components/qrstore/status-chips";
<LiveStatusIndicator status="pending" />

// Price handling
import { PriceInput } from "../components/qrstore/price-input";
<PriceInput value={amount} onChange={setAmount} currency="EUR" />
```

### Color Tokens
```css
--brand-primary: #6366f1
--brand-success: #10b981
--brand-warning: #f59e0b
--brand-awning: #ef4444
--status-paid: #10b981
--status-pending: #f59e0b
--status-failed: #ef4444
```

### Spacing
- 8pt grid: 8, 16, 24, 32, 48, 64px
- Border radius: 10px (--radius)
- Touch targets: Minimum 44px

## Contact
For questions or clarifications, refer to the design system page at `/design-system` or review component documentation in source files.
