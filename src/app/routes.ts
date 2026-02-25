import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

// Main App Pages
import ClientAppPage from "./pages/client-app-page";
import SellerAppPage from "./pages/seller-app-page";
import OwnerBackofficePage from "./pages/owner-backoffice-page";
import StorefrontPage from "./pages/storefront-page";
import DeveloperPlatformPage from "./pages/developer-platform-page";
import DesignSystemPage from "./pages/design-system-page";
import EdgeCasesPage from "./pages/edge-cases-page";
import ErrorSystemStatesPage from "./pages/error-system-states-page";
import LegalConsentPage from "./pages/legal-consent-page";

// Admin Pages
import AdminDashboardPage from "./pages/admin-dashboard-page";
import AdminEventsViewerPage from "./pages/admin-events-viewer-page";
import AdminFinanceOverviewPage from "./pages/admin-finance-overview-page";
import AdminGapsPage from "./pages/admin-gaps-page";
import AdminLedgerPage from "./pages/admin-ledger-page";
import AdminMerchantDetailPage from "./pages/admin-merchant-detail-page";
import AdminMerchantsPage from "./pages/admin-merchants-page";
import AdminPayablesPage from "./pages/admin-payables-page";
import AdminPaymentsPage from "./pages/admin-payments-page";
import AdminPayoutsPage from "./pages/admin-payouts-page";
import AdminReconciliationPage from "./pages/admin-reconciliation-page";
import AdminSessionsPage from "./pages/admin-sessions-page";
import AdminTicketSuitePage from "./pages/admin-ticket-suite-page";
import AdminTransitPage from "./pages/admin-transit-page";
import AdminUsersPage from "./pages/admin-users-page";
import AdminWebhookHealthPage from "./pages/admin-webhook-health-page";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "",
        Component: Layout,
        children: [
          { index: true, Component: Home },
          { path: "login", Component: Login },
          { path: "signup", Component: Signup },
        ],
      },
      { path: "client", Component: ClientAppPage },
      { path: "seller", Component: SellerAppPage },
      { path: "owner", Component: OwnerBackofficePage },
      { path: "storefront/:merchantSlug", Component: StorefrontPage },
      { path: "dev", Component: DeveloperPlatformPage },
      { path: "design", Component: DesignSystemPage },
      { path: "edge-cases", Component: EdgeCasesPage },
      { path: "errors", Component: ErrorSystemStatesPage },
      { path: "legal", Component: LegalConsentPage },
      
      // Admin Routes
      { path: "admin", Component: AdminDashboardPage },
      { path: "admin/events", Component: AdminEventsViewerPage },
      { path: "admin/finance", Component: AdminFinanceOverviewPage },
      { path: "admin/gaps", Component: AdminGapsPage },
      { path: "admin/ledger", Component: AdminLedgerPage },
      { path: "admin/merchants", Component: AdminMerchantsPage },
      { path: "admin/merchants/:merchantId", Component: AdminMerchantDetailPage },
      { path: "admin/payables", Component: AdminPayablesPage },
      { path: "admin/payments", Component: AdminPaymentsPage },
      { path: "admin/payouts", Component: AdminPayoutsPage },
      { path: "admin/reconciliation", Component: AdminReconciliationPage },
      { path: "admin/sessions", Component: AdminSessionsPage },
      { path: "admin/support", Component: AdminTicketSuitePage },
      { path: "admin/transit", Component: AdminTransitPage },
      { path: "admin/users", Component: AdminUsersPage },
      { path: "admin/webhooks", Component: AdminWebhookHealthPage },
    ]
  }
]);
