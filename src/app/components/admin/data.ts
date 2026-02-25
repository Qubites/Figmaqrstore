// ─── Admin Mock Data & Types ──────────────────────────────────────────────────
// Consistent IDs cross-referenced across all admin pages.

export type AdminStatus =
  | "active" | "inactive" | "suspended" | "pending" | "flagged" | "blocked"
  | "paid" | "failed" | "processing" | "refunded" | "disputed"
  | "open" | "in_progress" | "resolved" | "closed"
  | "completed" | "on_hold" | "in_transit" | "settled" | "returned"
  | "healthy" | "degraded" | "failing" | "down"
  | "matched" | "unmatched" | "partial"
  | "credit" | "debit"
  | "expired" | "abandoned";

export type Environment = "DEV" | "STAGING" | "PROD";

// ─── Merchants ────────────────────────────────────────────────────────────────
export interface Merchant {
  id: string;
  name: string;
  slug: string;
  email: string;
  plan: "starter" | "growth" | "business";
  status: AdminStatus;
  country: string;
  currency: string;
  created_at: string;
  gmv_30d: number;
  sessions_30d: number;
  compliance: "verified" | "pending" | "flagged";
}

export const MERCHANTS: Merchant[] = [
  { id: "mch_a1b2c3", name: "Le Petit Café",    slug: "le-petit-cafe",    email: "hello@lepetit.fr",     plan: "growth",    status: "active",    country: "FR", currency: "EUR", created_at: "2024-03-12", gmv_30d: 18420, sessions_30d: 342, compliance: "verified" },
  { id: "mch_d4e5f6", name: "Mercat del Born",  slug: "mercat-del-born",  email: "info@mercat.es",       plan: "business",  status: "active",    country: "ES", currency: "EUR", created_at: "2023-11-05", gmv_30d: 54800, sessions_30d: 891, compliance: "verified" },
  { id: "mch_g7h8i9", name: "Studio Lune",      slug: "studio-lune",      email: "contact@studiolune.fr",plan: "starter",   status: "active",    country: "FR", currency: "EUR", created_at: "2025-01-20", gmv_30d:  4230, sessions_30d:  98, compliance: "pending"  },
  { id: "mch_j1k2l3", name: "Green Garden",     slug: "green-garden",     email: "shop@greengarden.nl",  plan: "growth",    status: "suspended", country: "NL", currency: "EUR", created_at: "2024-07-08", gmv_30d:  9100, sessions_30d: 175, compliance: "flagged"  },
  { id: "mch_m4n5o6", name: "TechBit Shop",     slug: "techbit-shop",     email: "ops@techbit.de",       plan: "business",  status: "active",    country: "DE", currency: "EUR", created_at: "2023-06-14", gmv_30d: 82350, sessions_30d: 1240,compliance: "verified" },
  { id: "mch_p7q8r9", name: "Brasserie Nord",   slug: "brasserie-nord",   email: "admin@bnord.fr",       plan: "growth",    status: "active",    country: "FR", currency: "EUR", created_at: "2024-04-01", gmv_30d: 31200, sessions_30d: 519, compliance: "verified" },
  { id: "mch_s1t2u3", name: "La Libreria",      slug: "la-libreria",      email: "hola@lalibreria.es",   plan: "starter",   status: "inactive",  country: "ES", currency: "EUR", created_at: "2025-02-11", gmv_30d:   820, sessions_30d:  22, compliance: "pending"  },
  { id: "mch_v4w5x6", name: "Ocean Surf Co",    slug: "ocean-surf-co",    email: "surf@oceansurf.pt",    plan: "growth",    status: "flagged",   country: "PT", currency: "EUR", created_at: "2024-09-19", gmv_30d: 14700, sessions_30d: 264, compliance: "flagged"  },
];

// ─── Sessions ────────────────────────────────────────────────────────────────
export interface SessionRow {
  id: string;
  merchant_id: string;
  merchant_name: string;
  order_id: string;
  amount: number;
  currency: string;
  status: AdminStatus;
  created_at: string;
  expires_at: string;
  user_id: string;
  surface: "client_portal" | "storefront" | "qr_scan";
}

export const SESSIONS: SessionRow[] = [
  { id: "ses_r3a9x2", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", order_id: "ord_f1e2d3", amount: 142.50, currency: "EUR", status: "active",    created_at: "2026-02-21T14:32:00Z", expires_at: "2026-02-21T14:47:00Z", user_id: "usr_u1v2w3", surface: "client_portal" },
  { id: "ses_k8m7n6", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   order_id: "ord_g4h5i6", amount:  18.90, currency: "EUR", status: "paid",      created_at: "2026-02-21T14:28:00Z", expires_at: "2026-02-21T14:43:00Z", user_id: "usr_x4y5z6", surface: "qr_scan"      },
  { id: "ses_p2q1w0", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    order_id: "ord_j7k8l9", amount: 529.00, currency: "EUR", status: "processing",created_at: "2026-02-21T14:25:00Z", expires_at: "2026-02-21T14:40:00Z", user_id: "usr_a7b8c9", surface: "storefront"   },
  { id: "ses_t5s4r3", merchant_id: "mch_p7q8r9", merchant_name: "Brasserie Nord",  order_id: "ord_m1n2o3", amount:  67.80, currency: "EUR", status: "failed",    created_at: "2026-02-21T14:10:00Z", expires_at: "2026-02-21T14:25:00Z", user_id: "usr_d1e2f3", surface: "qr_scan"      },
  { id: "ses_w8v7u6", merchant_id: "mch_g7h8i9", merchant_name: "Studio Lune",     order_id: "ord_p4q5r6", amount:  89.00, currency: "EUR", status: "expired",   created_at: "2026-02-21T13:50:00Z", expires_at: "2026-02-21T14:05:00Z", user_id: "usr_g4h5i6", surface: "client_portal" },
  { id: "ses_z1y0x9", merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   order_id: "ord_s7t8u9", amount: 219.99, currency: "EUR", status: "abandoned", created_at: "2026-02-21T13:40:00Z", expires_at: "2026-02-21T13:55:00Z", user_id: "usr_j7k8l9", surface: "storefront"   },
  { id: "ses_b3c4d5", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", order_id: "ord_v1w2x3", amount: 398.00, currency: "EUR", status: "paid",      created_at: "2026-02-21T13:20:00Z", expires_at: "2026-02-21T13:35:00Z", user_id: "usr_m1n2o3", surface: "qr_scan"      },
  { id: "ses_e6f7g8", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    order_id: "ord_y4z5a6", amount: 1299.00,currency: "EUR", status: "paid",      created_at: "2026-02-21T12:55:00Z", expires_at: "2026-02-21T13:10:00Z", user_id: "usr_p4q5r6", surface: "client_portal" },
  { id: "ses_h9i1j2", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   order_id: "ord_b7c8d9", amount:  24.50, currency: "EUR", status: "paid",      created_at: "2026-02-21T12:30:00Z", expires_at: "2026-02-21T12:45:00Z", user_id: "usr_s7t8u9", surface: "qr_scan"      },
  { id: "ses_k3l4m5", merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    order_id: "ord_e1f2g3", amount:  55.00, currency: "EUR", status: "disputed",  created_at: "2026-02-21T11:45:00Z", expires_at: "2026-02-21T12:00:00Z", user_id: "usr_v1w2x3", surface: "storefront"   },
];

// ─── Payments ────────────────────────────────────────────────────────────────
export interface PaymentRow {
  id: string;
  session_id: string;
  merchant_id: string;
  merchant_name: string;
  amount: number;
  currency: string;
  method: "card" | "apple_pay" | "google_pay" | "bank_transfer";
  status: AdminStatus;
  created_at: string;
  settled_at?: string;
  reference_id: string;
  risk: "low" | "medium" | "high";
}

export const PAYMENTS: PaymentRow[] = [
  { id: "pay_a1b2c3", session_id: "ses_k8m7n6", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   amount:  18.90, currency: "EUR", method: "apple_pay",    status: "paid",       created_at: "2026-02-21T14:28:00Z", settled_at: "2026-02-21T14:29:00Z", reference_id: "REF-A1B2C3D4", risk: "low"    },
  { id: "pay_d4e5f6", session_id: "ses_b3c4d5", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", amount: 398.00, currency: "EUR", method: "card",         status: "paid",       created_at: "2026-02-21T13:20:00Z", settled_at: "2026-02-21T13:22:00Z", reference_id: "REF-D4E5F6G7", risk: "low"    },
  { id: "pay_g7h8i9", session_id: "ses_e6f7g8", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    amount: 1299.00,currency: "EUR", method: "card",         status: "paid",       created_at: "2026-02-21T12:55:00Z", settled_at: "2026-02-21T12:58:00Z", reference_id: "REF-G7H8I9J0", risk: "medium" },
  { id: "pay_j1k2l3", session_id: "ses_t5s4r3", merchant_id: "mch_p7q8r9", merchant_name: "Brasserie Nord",  amount:  67.80, currency: "EUR", method: "google_pay",   status: "failed",     created_at: "2026-02-21T14:10:00Z", reference_id: "REF-J1K2L3M4", risk: "low"    },
  { id: "pay_m4n5o6", session_id: "ses_k3l4m5", merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    amount:  55.00, currency: "EUR", method: "card",         status: "disputed",   created_at: "2026-02-21T11:45:00Z", reference_id: "REF-M4N5O6P7", risk: "high"   },
  { id: "pay_p7q8r9", session_id: "ses_h9i1j2", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   amount:  24.50, currency: "EUR", method: "apple_pay",    status: "paid",       created_at: "2026-02-21T12:30:00Z", settled_at: "2026-02-21T12:31:00Z", reference_id: "REF-P7Q8R9S0", risk: "low"    },
  { id: "pay_s1t2u3", session_id: "ses_p2q1w0", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    amount: 529.00, currency: "EUR", method: "bank_transfer",status: "processing", created_at: "2026-02-21T14:25:00Z", reference_id: "REF-S1T2U3V4", risk: "medium" },
  { id: "pay_v4w5x6", session_id: "ses_r3a9x2", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", amount: 142.50, currency: "EUR", method: "card",         status: "pending",    created_at: "2026-02-21T14:32:00Z", reference_id: "REF-V4W5X6Y7", risk: "low"    },
  { id: "pay_y7z8a9", session_id: "ses_z1y0x9", merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   amount: 219.99, currency: "EUR", method: "card",         status: "refunded",   created_at: "2026-02-20T09:10:00Z", settled_at: "2026-02-20T09:15:00Z", reference_id: "REF-Y7Z8A9B0", risk: "medium" },
];

// ─── Ledger entries ───────────────────────────────────────────────────────────
export interface LedgerEntry {
  id: string;
  merchant_id: string;
  merchant_name: string;
  type: AdminStatus; // credit | debit
  amount: number;
  currency: string;
  description: string;
  reference_id: string;
  created_at: string;
  balance_after: number;
}

export const LEDGER_ENTRIES: LedgerEntry[] = [
  { id: "ldg_001", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", type: "credit", amount:  398.00, currency: "EUR", description: "Payment settled",    reference_id: "REF-D4E5F6G7", created_at: "2026-02-21T13:22:00Z", balance_after: 54230.80 },
  { id: "ldg_002", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    type: "credit", amount: 1299.00, currency: "EUR", description: "Payment settled",    reference_id: "REF-G7H8I9J0", created_at: "2026-02-21T12:58:00Z", balance_after: 82350.10 },
  { id: "ldg_003", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   type: "debit",  amount:   15.00, currency: "EUR", description: "Platform fee",       reference_id: "REF-FEE-0021", created_at: "2026-02-21T12:00:00Z", balance_after: 18405.00 },
  { id: "ldg_004", merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    type: "debit",  amount:   55.00, currency: "EUR", description: "Chargeback debit",   reference_id: "REF-M4N5O6P7", created_at: "2026-02-21T11:45:00Z", balance_after:  9045.00 },
  { id: "ldg_005", merchant_id: "mch_p7q8r9", merchant_name: "Brasserie Nord",  type: "credit", amount:  420.00, currency: "EUR", description: "Batch payout",       reference_id: "REF-BATCH-019", created_at: "2026-02-21T10:30:00Z", balance_after: 31200.00 },
  { id: "ldg_006", merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   type: "debit",  amount:  219.99, currency: "EUR", description: "Refund processed",   reference_id: "REF-Y7Z8A9B0", created_at: "2026-02-20T09:15:00Z", balance_after: 14480.01 },
  { id: "ldg_007", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   type: "credit", amount:   18.90, currency: "EUR", description: "Payment settled",    reference_id: "REF-A1B2C3D4", created_at: "2026-02-21T14:29:00Z", balance_after: 18423.90 },
  { id: "ldg_008", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    type: "debit",  amount:   42.00, currency: "EUR", description: "Subscription fee",   reference_id: "REF-SUB-0034", created_at: "2026-02-20T00:00:00Z", balance_after: 81051.10 },
];

// ─── Payouts ─────────────────────────────────────────────────────────────────
export interface PayoutRow {
  id: string;
  merchant_id: string;
  merchant_name: string;
  amount: number;
  currency: string;
  status: AdminStatus;
  method: "bank_transfer" | "sepa" | "swift";
  iban_last4: string;
  created_at: string;
  settled_at?: string;
  reference_id: string;
}

export const PAYOUTS: PayoutRow[] = [
  { id: "pyt_001", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", amount: 48200.00, currency: "EUR", status: "completed",   method: "sepa",          iban_last4: "4421", created_at: "2026-02-20T08:00:00Z", settled_at: "2026-02-20T16:00:00Z", reference_id: "REF-PYT-001" },
  { id: "pyt_002", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    amount: 75000.00, currency: "EUR", status: "in_transit",  method: "swift",         iban_last4: "8810", created_at: "2026-02-21T08:00:00Z", reference_id: "REF-PYT-002" },
  { id: "pyt_003", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   amount:  1820.00, currency: "EUR", status: "pending",     method: "sepa",          iban_last4: "2233", created_at: "2026-02-21T10:00:00Z", reference_id: "REF-PYT-003" },
  { id: "pyt_004", merchant_id: "mch_p7q8r9", merchant_name: "Brasserie Nord",  amount: 28400.00, currency: "EUR", status: "completed",   method: "sepa",          iban_last4: "6674", created_at: "2026-02-19T08:00:00Z", settled_at: "2026-02-19T14:00:00Z", reference_id: "REF-PYT-004" },
  { id: "pyt_005", merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    amount:  8900.00, currency: "EUR", status: "on_hold",     method: "sepa",          iban_last4: "9901", created_at: "2026-02-18T08:00:00Z", reference_id: "REF-PYT-005" },
  { id: "pyt_006", merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   amount: 14200.00, currency: "EUR", status: "failed",      method: "bank_transfer", iban_last4: "3345", created_at: "2026-02-17T08:00:00Z", reference_id: "REF-PYT-006" },
];

// ─── Transit entries ──────────────────────────────────────────────────────────
export interface TransitRow {
  id: string;
  payout_id: string;
  merchant_id: string;
  merchant_name: string;
  amount: number;
  currency: string;
  status: AdminStatus;
  provider: "Stripe" | "Adyen" | "Mollie";
  provider_ref: string;
  created_at: string;
  expected_at: string;
}

export const TRANSIT_ENTRIES: TransitRow[] = [
  { id: "trn_001", payout_id: "pyt_002", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    amount: 75000.00, currency: "EUR", status: "in_transit", provider: "Adyen",  provider_ref: "ADYEN-88120041", created_at: "2026-02-21T08:00:00Z", expected_at: "2026-02-21T23:59:00Z" },
  { id: "trn_002", payout_id: "pyt_003", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   amount:  1820.00, currency: "EUR", status: "pending",    provider: "Stripe", provider_ref: "pi_3Pf8Rd2eZvKYlo2",  created_at: "2026-02-21T10:00:00Z", expected_at: "2026-02-22T00:00:00Z" },
  { id: "trn_003", payout_id: "pyt_001", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", amount: 48200.00, currency: "EUR", status: "settled",    provider: "Mollie", provider_ref: "tr_WDqYK93zAg",        created_at: "2026-02-20T08:00:00Z", expected_at: "2026-02-20T16:00:00Z" },
  { id: "trn_004", payout_id: "pyt_006", merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   amount: 14200.00, currency: "EUR", status: "returned",   provider: "Stripe", provider_ref: "pi_3Pf2Xm2eZvKYlo0",  created_at: "2026-02-17T08:00:00Z", expected_at: "2026-02-17T23:59:00Z" },
];

// ─── Reconciliation ───────────────────────────────────────────────────────────
export interface ReconRow {
  id: string;
  period: string;
  merchant_id: string;
  merchant_name: string;
  expected: number;
  actual: number;
  delta: number;
  currency: string;
  status: AdminStatus;
  entries: number;
}

export const RECON_ENTRIES: ReconRow[] = [
  { id: "rec_001", period: "2026-02-20", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", expected: 48200, actual: 48200, delta: 0,      currency: "EUR", status: "matched",   entries: 23 },
  { id: "rec_002", period: "2026-02-20", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    expected: 75000, actual: 74950, delta: -50,    currency: "EUR", status: "partial",   entries: 41 },
  { id: "rec_003", period: "2026-02-20", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   expected:  1820, actual:  1820, delta: 0,      currency: "EUR", status: "matched",   entries:  8 },
  { id: "rec_004", period: "2026-02-20", merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    expected:  8900, actual:  9100, delta: 200,    currency: "EUR", status: "unmatched", entries: 12 },
  { id: "rec_005", period: "2026-02-19", merchant_id: "mch_p7q8r9", merchant_name: "Brasserie Nord",  expected: 28400, actual: 28400, delta: 0,      currency: "EUR", status: "matched",   entries: 31 },
  { id: "rec_006", period: "2026-02-19", merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   expected: 14200, actual:  9900, delta: -4300,  currency: "EUR", status: "unmatched", entries: 18 },
];

// ─── Users ───────────────────────────────────────────────────────────────────
export interface UserRow {
  id: string;
  email: string;
  display_name: string;
  country: string;
  status: AdminStatus;
  created_at: string;
  last_seen: string;
  sessions_total: number;
  payments_total: number;
}

export const USERS: UserRow[] = [
  { id: "usr_u1v2w3", email: "alice@example.com",   display_name: "Alice M.",   country: "FR", status: "active",    created_at: "2024-06-01", last_seen: "2026-02-21T14:32:00Z", sessions_total: 48, payments_total: 45 },
  { id: "usr_x4y5z6", email: "bob@example.com",     display_name: "Bob K.",     country: "DE", status: "active",    created_at: "2024-11-15", last_seen: "2026-02-21T14:28:00Z", sessions_total: 12, payments_total: 11 },
  { id: "usr_a7b8c9", email: "carol@example.com",   display_name: "Carol P.",   country: "ES", status: "flagged",   created_at: "2025-01-10", last_seen: "2026-02-21T14:25:00Z", sessions_total:  5, payments_total:  3 },
  { id: "usr_d1e2f3", email: "dan@example.com",     display_name: "Dan T.",     country: "FR", status: "active",    created_at: "2024-03-22", last_seen: "2026-02-21T14:10:00Z", sessions_total: 89, payments_total: 84 },
  { id: "usr_g4h5i6", email: "ella@example.com",    display_name: "Ella W.",    country: "NL", status: "active",    created_at: "2025-02-01", last_seen: "2026-02-21T13:50:00Z", sessions_total:  3, payments_total:  2 },
  { id: "usr_j7k8l9", email: "frank@example.com",   display_name: "Frank H.",   country: "PT", status: "blocked",   created_at: "2024-09-05", last_seen: "2026-02-21T13:40:00Z", sessions_total: 21, payments_total: 18 },
  { id: "usr_m1n2o3", email: "grace@example.com",   display_name: "Grace L.",   country: "ES", status: "active",    created_at: "2023-12-01", last_seen: "2026-02-21T13:20:00Z", sessions_total:132, payments_total:128 },
  { id: "usr_p4q5r6", email: "hiro@example.com",    display_name: "Hiro N.",    country: "DE", status: "active",    created_at: "2024-05-20", last_seen: "2026-02-21T12:55:00Z", sessions_total: 67, payments_total: 65 },
];

// ─── Tickets ─────────────────────────────────────────────────────────────────
export interface TicketRow {
  id: string;
  subject: string;
  merchant_id: string;
  merchant_name: string;
  user_id?: string;
  severity: "critical" | "high" | "medium" | "low";
  status: AdminStatus;
  created_at: string;
  updated_at: string;
  assignee?: string;
  category: "payment" | "compliance" | "technical" | "payout" | "account";
}

export const TICKETS: TicketRow[] = [
  { id: "tkt_001", subject: "Payment failed but customer charged",   merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    user_id: "usr_v1w2x3", severity: "critical", status: "open",        created_at: "2026-02-21T11:50:00Z", updated_at: "2026-02-21T11:50:00Z", category: "payment"    },
  { id: "tkt_002", subject: "Payout missing after 5 business days",  merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   severity: "high",     status: "in_progress", created_at: "2026-02-20T09:00:00Z", updated_at: "2026-02-21T10:30:00Z", assignee: "Sophie R.",  category: "payout"     },
  { id: "tkt_003", subject: "KYC document re-submission required",   merchant_id: "mch_g7h8i9", merchant_name: "Studio Lune",                            severity: "medium",   status: "open",        created_at: "2026-02-19T14:00:00Z", updated_at: "2026-02-19T14:00:00Z", category: "compliance" },
  { id: "tkt_004", subject: "QR scanner not working on iOS 17.4",    merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",                          severity: "medium",   status: "in_progress", created_at: "2026-02-18T10:00:00Z", updated_at: "2026-02-20T16:00:00Z", assignee: "Luc B.",     category: "technical"  },
  { id: "tkt_005", subject: "Request to increase payout limit",      merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",                           severity: "low",      status: "resolved",    created_at: "2026-02-15T09:00:00Z", updated_at: "2026-02-17T11:00:00Z", assignee: "Sophie R.",  category: "account"    },
  { id: "tkt_006", subject: "Account suspended without notice",      merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",                           severity: "high",     status: "open",        created_at: "2026-02-21T08:00:00Z", updated_at: "2026-02-21T08:00:00Z", category: "compliance" },
  { id: "tkt_007", subject: "Duplicate charge — refund requested",   merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", user_id: "usr_m1n2o3", severity: "high",     status: "in_progress", created_at: "2026-02-20T14:00:00Z", updated_at: "2026-02-21T09:00:00Z", assignee: "Luc B.",     category: "payment"    },
];

// ─── Webhooks ────────────────────────────────────────────────────────────────
export interface WebhookRow {
  id: string;
  merchant_id: string;
  merchant_name: string;
  endpoint: string;
  event_type: string;
  status: AdminStatus;
  last_attempt: string;
  attempts: number;
  last_status_code: number;
  latency_ms: number;
}

export const WEBHOOKS: WebhookRow[] = [
  { id: "whk_001", merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", endpoint: "https://mercat.es/hooks/qr",     event_type: "payment.paid",       status: "healthy",  last_attempt: "2026-02-21T14:29:00Z", attempts: 1,  last_status_code: 200, latency_ms:  82 },
  { id: "whk_002", merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    endpoint: "https://techbit.de/wh/qrstore", event_type: "payment.paid",       status: "healthy",  last_attempt: "2026-02-21T12:58:00Z", attempts: 1,  last_status_code: 200, latency_ms: 145 },
  { id: "whk_003", merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   endpoint: "https://lepetit.fr/api/hook",   event_type: "session.created",    status: "degraded", last_attempt: "2026-02-21T14:30:00Z", attempts: 3,  last_status_code: 503, latency_ms: 4200 },
  { id: "whk_004", merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    endpoint: "https://greengarden.nl/wh",     event_type: "payment.failed",     status: "failing",  last_attempt: "2026-02-21T11:50:00Z", attempts: 5,  last_status_code: 500, latency_ms: 8100 },
  { id: "whk_005", merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   endpoint: "https://oceansurf.pt/events",   event_type: "payout.completed",   status: "down",     last_attempt: "2026-02-21T10:00:00Z", attempts: 10, last_status_code: 404, latency_ms: 0    },
  { id: "whk_006", merchant_id: "mch_p7q8r9", merchant_name: "Brasserie Nord",  endpoint: "https://bnord.fr/webhook",      event_type: "payment.paid",       status: "healthy",  last_attempt: "2026-02-21T13:22:00Z", attempts: 1,  last_status_code: 200, latency_ms:  66 },
];

// ─── Events ──────────────────────────────────────────────────────────────────
export interface EventRow {
  id: string;
  event_type: string;
  merchant_id: string;
  merchant_name: string;
  entity_id: string;
  entity_type: "session" | "payment" | "payout" | "merchant" | "webhook";
  created_at: string;
  reference_id: string;
  payload_size: number;
}

export const EVENTS: EventRow[] = [
  { id: "evt_001", event_type: "payment.paid",         merchant_id: "mch_a1b2c3", merchant_name: "Le Petit Café",   entity_id: "pay_a1b2c3", entity_type: "payment", created_at: "2026-02-21T14:29:10Z", reference_id: "REF-A1B2C3D4", payload_size: 892 },
  { id: "evt_002", event_type: "session.created",      merchant_id: "mch_d4e5f6", merchant_name: "Mercat del Born", entity_id: "ses_r3a9x2", entity_type: "session", created_at: "2026-02-21T14:32:05Z", reference_id: "REF-SES-R3A9", payload_size: 412 },
  { id: "evt_003", event_type: "payment.processing",   merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    entity_id: "pay_s1t2u3", entity_type: "payment", created_at: "2026-02-21T14:25:12Z", reference_id: "REF-S1T2U3V4", payload_size: 904 },
  { id: "evt_004", event_type: "payment.failed",       merchant_id: "mch_p7q8r9", merchant_name: "Brasserie Nord",  entity_id: "pay_j1k2l3", entity_type: "payment", created_at: "2026-02-21T14:11:00Z", reference_id: "REF-J1K2L3M4", payload_size: 788 },
  { id: "evt_005", event_type: "payout.in_transit",    merchant_id: "mch_m4n5o6", merchant_name: "TechBit Shop",    entity_id: "pyt_002",    entity_type: "payout",  created_at: "2026-02-21T08:01:00Z", reference_id: "REF-PYT-002",  payload_size: 602 },
  { id: "evt_006", event_type: "webhook.failed",       merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    entity_id: "whk_004",    entity_type: "webhook", created_at: "2026-02-21T11:50:30Z", reference_id: "REF-WHK-004",  payload_size: 220 },
  { id: "evt_007", event_type: "merchant.suspended",   merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    entity_id: "mch_j1k2l3", entity_type: "merchant",created_at: "2026-02-21T08:02:00Z", reference_id: "REF-MCH-J1K2", payload_size: 310 },
  { id: "evt_008", event_type: "payment.disputed",     merchant_id: "mch_j1k2l3", merchant_name: "Green Garden",    entity_id: "pay_m4n5o6", entity_type: "payment", created_at: "2026-02-21T11:46:00Z", reference_id: "REF-M4N5O6P7", payload_size: 1104 },
  { id: "evt_009", event_type: "session.expired",      merchant_id: "mch_g7h8i9", merchant_name: "Studio Lune",     entity_id: "ses_w8v7u6", entity_type: "session", created_at: "2026-02-21T14:05:10Z", reference_id: "REF-SES-W8V7", payload_size: 330 },
  { id: "evt_010", event_type: "payment.refunded",     merchant_id: "mch_v4w5x6", merchant_name: "Ocean Surf Co",   entity_id: "pay_y7z8a9", entity_type: "payment", created_at: "2026-02-20T09:15:20Z", reference_id: "REF-Y7Z8A9B0", payload_size: 766 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Cache the formatter so Intl.NumberFormat is only constructed once.
const _eurFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export function fmt(amount: number, currency = "EUR"): string {
  if (currency === "EUR") return _eurFormatter.format(amount);
  return new Intl.NumberFormat("en-IE", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
}

export function fmtTs(iso: string, compact = false): string {
  const d = new Date(iso);
  if (compact) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ─── Dashboard Specific Mocks ─────────────────────────────────────────────────

export const fmtCurrency = fmt;

// 1. Funnel Data
export const FUNNEL_DATA = [
  { step: "QR Scans", count: 12540, drop: 0 },
  { step: "Sessions", count: 8900, drop: 29 }, // 29% drop from scans
  { step: "Payment Init", count: 7200, drop: 19 }, // 19% drop from sessions
  { step: "Paid", count: 6850, drop: 4.8 }, // 4.8% drop from init (failure rate)
];

// 2. Failed Payments (Latest 50 mock)
export const FAILED_PAYMENTS = [
  { id: "pay_992", merchant: "Green Garden", amount: 12.50, reason: "insufficient_funds", country: "NL", ts: "2026-02-21T14:20:00Z", card: "Visa ••4242" },
  { id: "pay_991", merchant: "Ocean Surf", amount: 45.00, reason: "do_not_honor", country: "US", ts: "2026-02-21T14:15:00Z", card: "Mastercard ••8821" },
  { id: "pay_990", merchant: "TechBit Shop", amount: 299.00, reason: "risk_block", country: "DE", ts: "2026-02-21T14:12:00Z", card: "Visa ••1102" },
  { id: "pay_989", merchant: "Bella's Coffee", amount: 4.20, reason: "expired_card", country: "NL", ts: "2026-02-21T14:10:00Z", card: "Amex ••3004" },
  { id: "pay_988", merchant: "Green Garden", amount: 22.00, reason: "3ds_failed", country: "FR", ts: "2026-02-21T14:05:00Z", card: "Visa ••9921" },
];

// 3. Payout Pipeline
export const PAYOUT_STAGES = [
  { label: "Ready", amount: 14500, count: 42, status: "pending" },
  { label: "Scheduled", amount: 8200, count: 18, status: "processing" },
  { label: "In Transit", amount: 1200, count: 4, status: "in_transit" },
  { label: "Failed", amount: 450, count: 2, status: "failed", alert: true },
];

// 4. Reconciliation
export const RECONCILIATION_STATS = {
  stripe_balance: 145200.50,
  ledger_balance: 145250.00,
  diff: -49.50,
  status: "unmatched", // matched | unmatched
  unmatched_txs: [
    { id: "tx_123", desc: "Refund - Order #9921", amount: -49.50, ts: "2026-02-20T10:00:00Z" }
  ]
};

// 5. Disputes & Refunds
export const DISPUTE_STATS = {
  rate: 0.42, // %
  trend: "up", // up | down | neutral
  volume: 1250,
  top_merchants: [
    { name: "TechBit Shop", disputes: 4, rate: 1.2 },
    { name: "Ocean Surf", disputes: 2, rate: 0.8 },
    { name: "Green Garden", disputes: 1, rate: 0.1 },
  ]
};

// 6. Dispute + Refund 7-day trend (hourly buckets collapsed to days)
export const DISPUTE_TREND = [
  { day: "Mon", disputes: 3, refunds: 7,  chargebacks: 1 },
  { day: "Tue", disputes: 5, refunds: 9,  chargebacks: 2 },
  { day: "Wed", disputes: 4, refunds: 11, chargebacks: 1 },
  { day: "Thu", disputes: 6, refunds: 8,  chargebacks: 3 },
  { day: "Fri", disputes: 8, refunds: 14, chargebacks: 2 },
  { day: "Sat", disputes: 5, refunds: 10, chargebacks: 1 },
  { day: "Sun", disputes: 7, refunds: 13, chargebacks: 4 },
];

// 7. Merchant growth (last 6 months activations)
export const MERCHANT_GROWTH = [
  { month: "Sep", active: 108, churned: 3, new: 6 },
  { month: "Oct", active: 116, churned: 4, new: 12 },
  { month: "Nov", active: 122, churned: 2, new: 8  },
  { month: "Dec", active: 128, churned: 5, new: 11 },
  { month: "Jan", active: 135, churned: 3, new: 10 },
  { month: "Feb", active: 142, churned: 2, new: 9  },
];

// 8. Support queue snapshot
export const SUPPORT_QUEUE = {
  open: 4,
  in_progress: 2,
  resolved_today: 5,
  avg_resolution_hrs: 6.4,
  by_severity: [
    { label: "Critical", count: 1, color: "bg-red-500" },
    { label: "High",     count: 3, color: "bg-orange-400" },
    { label: "Medium",   count: 2, color: "bg-yellow-400" },
    { label: "Low",      count: 1, color: "bg-gray-300" },
  ]
};