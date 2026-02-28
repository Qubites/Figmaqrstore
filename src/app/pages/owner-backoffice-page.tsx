import React, { useState } from "react";
import { OwnerHeader } from "../components/qrstore/headers";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  LayoutDashboard, ShoppingBag, Users, DollarSign, 
  ShieldCheck, Settings, Plus, Search, Filter, 
  MoreHorizontal, Archive, Edit, Copy, ChevronRight,
  Upload, CheckCircle2, AlertCircle, FileText, Globe, CreditCard,
  Building, Landmark, Briefcase, Wallet
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { EmptyState } from "../components/qrstore/empty-state";
import { PriceInput } from "../components/qrstore/price-input";
import { GuidedTour, TourStep } from "../components/GuidedTour";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// --- Components ---

const BankLogo = ({ type, size = "md" }: { type: string, size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-14 h-14 rounded-2xl"
  };

  const logos: Record<string, string> = {
    nordea: "https://images.unsplash.com/photo-1582728338776-cb14fd2e42be?w=100&h=100&fit=crop",
    swedbank: "https://images.unsplash.com/photo-1728426340277-b2e45fa616a1?w=100&h=100&fit=crop",
    seb: "https://images.unsplash.com/photo-1535811494373-6c551746eb13?w=100&h=100&fit=crop",
    handelsbanken: "https://images.unsplash.com/photo-1582728338776-cb14fd2e42be?w=100&h=100&fit=crop&q=40",
  };

  return (
    <div className={cn("bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm", sizeClasses[size])}>
      <ImageWithFallback 
        src={logos[type] || logos.nordea} 
        alt={type} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
      />
    </div>
  );
};

// Types
type PageView = 'dashboard' | 'products' | 'product-editor' | 'team' | 'payouts' | 'compliance' | 'settings';

interface Product {
  id: string;
  name: string;
  price: string;
  vatRate: number;
  unit: string;
  status: 'active' | 'draft' | 'archived';
  category: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Seller';
  status: 'active' | 'invited';
}

interface Payout {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'processing';
  method: string;
}

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  { id: "prod_1", name: "Cappuccino", price: "3.50", vatRate: 20, unit: "cup", status: "active", category: "Coffee" },
  { id: "prod_2", name: "Croissant", price: "2.80", vatRate: 20, unit: "piece", status: "active", category: "Pastry" },
  { id: "prod_3", name: "Avocado Toast", price: "7.50", vatRate: 20, unit: "serving", status: "draft", category: "Food" },
];

const MOCK_TEAM: TeamMember[] = [
  { id: "tm_1", name: "Bella Swan", email: "bella@coffee.com", role: "Owner", status: "active" },
  { id: "tm_2", name: "Jacob Black", email: "jacob@coffee.com", role: "Manager", status: "active" },
  { id: "tm_3", name: "Edward Cullen", email: "edward@coffee.com", role: "Seller", status: "invited" },
];

const MOCK_PAYOUTS: Payout[] = [
  { id: "po_1", date: "2023-10-25", amount: "1,240.50", status: "paid", method: "Bank Transfer •••• 4242" },
  { id: "po_2", date: "2023-10-18", amount: "980.00", status: "paid", method: "Bank Transfer •••• 4242" },
  { id: "po_3", date: "2023-11-01", amount: "450.25", status: "pending", method: "Bank Transfer •••• 4242" },
];

export default function OwnerBackofficePage() {
  const [activePage, setActivePage] = useState<PageView>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Navigation Helper
  const navigateTo = (page: PageView) => {
    setActivePage(page);
    if (page !== 'product-editor') setSelectedProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-editor');
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setActivePage('product-editor');
  };

  // --- Components ---

  const SidebarItem = ({ page, icon: Icon, label }: { page: PageView, icon: any, label: string }) => (
    <button
      onClick={() => navigateTo(page)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
        activePage === page 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700 border-green-200",
      paid: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      draft: "bg-gray-100 text-gray-600 border-gray-200",
      archived: "bg-red-50 text-red-600 border-red-200",
      invited: "bg-blue-50 text-blue-600 border-blue-200",
      processing: "bg-blue-50 text-blue-600 border-blue-200",
    };
    
    return (
      <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full border capitalize", styles[status] || "bg-gray-100 border-gray-200")}>
        {status}
      </span>
    );
  };

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: "EUR 450.25", sub: "+12% vs yesterday" },
          { label: "Orders", value: "32", sub: "4 pending" },
          { label: "Pending Payout", value: "EUR 1,240.00", sub: "Next: Mon, Nov 4" },
          { label: "Compliance", value: "Verified", sub: "All checks passed", status: "good" }
        ].map((kpi, i) => (
          <Card key={i} className="p-5 border shadow-sm">
            <p className="text-sm text-muted-foreground font-medium mb-1">{kpi.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold font-commerce tracking-tight">{kpi.value}</h3>
              {kpi.status === "good" && <CheckCircle2 className="w-5 h-5 text-[var(--brand-success)]" />}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{kpi.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">View all</Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dashed border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    #{890 + i}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Payment from Guest</p>
                    <p className="text-xs text-muted-foreground">Just now • Via QR Code</p>
                  </div>
                </div>
                <span className="font-mono font-medium">EUR {(Math.random() * 20 + 5).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-sm bg-amber-50/50 border-amber-100">
          <h3 className="font-semibold text-lg mb-4 text-amber-900">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-white hover:bg-amber-50 border-amber-200 text-amber-900" onClick={handleNewProduct}>
              <Plus className="w-4 h-4 mr-2" /> New Product
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white hover:bg-amber-50 border-amber-200 text-amber-900" onClick={() => navigateTo('team')}>
              <Users className="w-4 h-4 mr-2" /> Invite Member
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white hover:bg-amber-50 border-amber-200 text-amber-900" onClick={() => navigateTo('settings')}>
              <Settings className="w-4 h-4 mr-2" /> Store Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const ProductsView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={handleNewProduct} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> New Product
        </Button>
      </div>

      <div className="flex gap-2 items-center bg-white p-2 rounded-lg border shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground ml-2" />
        <Input placeholder="Search products..." className="border-0 shadow-none focus-visible:ring-0" />
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-gray-50/50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium text-right">Price</th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PRODUCTS.map((product) => (
                <tr key={product.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4 text-right font-mono font-medium">EUR {product.price}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEditProduct(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {MOCK_PRODUCTS.length === 0 && (
        <EmptyState 
          title="No products yet"
          description="Create your first product to start selling."
          action={{ label: "Create Product", onClick: handleNewProduct }}
        />
      )}
    </div>
  );

  const ProductEditorView = () => (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => navigateTo('products')}>
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span className="text-sm font-medium">Back to Products</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{selectedProduct ? 'Edit Product' : 'New Product'}</h2>
        <div className="flex gap-2">
          {selectedProduct && (
            <Button variant="ghost" className="text-muted-foreground hover:text-destructive">
              <Archive className="w-4 h-4 mr-2" /> Archive
            </Button>
          )}
        </div>
      </div>

      <Card className="p-6 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <Input defaultValue={selectedProduct?.name} placeholder="e.g. Double Espresso" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <PriceInput 
                 value={selectedProduct?.price || ""} 
                 onChange={() => {}} 
                 label="Price" 
                 placeholder="0.00"
                 className="mb-0"
               />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">VAT Rate (%)</label>
               <div className="relative">
                 <Input type="number" defaultValue={selectedProduct?.vatRate || 20} className="pl-3 pr-8" />
                 <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">%</span>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input defaultValue={selectedProduct?.category} placeholder="e.g. Coffee" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="item">Item</option>
                <option value="kg">Kg</option>
                <option value="liter">Liter</option>
                <option value="hour">Hour</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigateTo('products')}>Cancel</Button>
          <div className="flex gap-3">
            <Button variant="outline">Save as Draft</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => navigateTo('products')}>Save Product</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const TeamView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold">Team</h2>
           <p className="text-muted-foreground text-sm mt-1">Manage access to your store.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Users className="w-4 h-4 mr-2" /> Invite Member
        </Button>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-gray-50/50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium text-center">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_TEAM.map((member) => (
              <tr key={member.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{member.email}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="font-normal">{member.role}</Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={member.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const PayoutsView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payouts</h2>
        <Button variant="outline">
          <DownloadIcon className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 md:col-span-2 shadow-sm">
           <h3 className="font-semibold mb-4">Payout History</h3>
           <div className="space-y-1">
             {MOCK_PAYOUTS.map((payout) => (
               <div key={payout.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
                 <div>
                   <p className="font-medium text-sm">{new Date(payout.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                   <p className="text-xs text-muted-foreground">{payout.method}</p>
                 </div>
                 <div className="text-right">
                   <p className="font-mono font-medium">EUR {payout.amount}</p>
                   <StatusBadge status={payout.status} />
                 </div>
               </div>
             ))}
           </div>
         </Card>

         <div className="space-y-6">
           <Card className="p-6 bg-primary/5 border-primary/10 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-primary">Next Payout</h3>
                <DollarSign className="w-5 h-5 text-primary" />
             </div>
             <p className="text-3xl font-bold font-commerce text-primary mb-1">EUR 1,240.00</p>
             <p className="text-xs text-primary/70">Scheduled for Monday, Nov 4</p>
           </Card>

           <Card className="p-6 shadow-sm">
             <h3 className="font-semibold mb-4">Payout Method</h3>
             <div className="flex items-center gap-3 mb-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#006241]/30 transition-all group cursor-pointer">
                <BankLogo type="nordea" size="md" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Nordea Bank Abp</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">•••• 4242 • EUR</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#006241]/10 flex items-center justify-center text-[#006241]">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
             </div>
             
             <div className="space-y-3 pt-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Logo Vault Preview</p>
                <div className="grid grid-cols-4 gap-2">
                   {['nordea', 'swedbank', 'seb', 'handelsbanken'].map((bank) => (
                     <div key={bank} className="flex flex-col items-center gap-1 group">
                       <BankLogo type={bank} size="sm" />
                     </div>
                   ))}
                </div>
             </div>

             <Button variant="outline" className="w-full mt-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Manage Methods</Button>
           </Card>
         </div>
      </div>
    </div>
  );

  const ComplianceView = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2 mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Compliance Center</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We need to verify your business details to enable payouts and higher limits.
        </p>
      </div>

      <Card className="p-6 border-l-4 border-l-blue-500 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Identity Verification (KYC)
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Your personal identity has been confirmed.</p>
          </div>
          <Button variant="ghost" disabled>
             <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" /> Complete
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-amber-500 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Business Verification (KYB)
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Action Required</Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Please provide the following documents to verify your business.</p>
          </div>
        </div>

        <div className="space-y-4">
           {[
             { label: "Articles of Incorporation", status: "pending" },
             { label: "Proof of Address", status: "uploaded" },
             { label: "Ultimate Beneficial Owners (UBO) Registry", status: "pending" }
           ].map((doc, i) => (
             <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
               <div className="flex items-center gap-3">
                 <FileText className="w-5 h-5 text-gray-400" />
                 <span className="font-medium text-sm">{doc.label}</span>
               </div>
               {doc.status === 'uploaded' ? (
                 <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                   <CheckCircle2 className="w-4 h-4" /> Uploaded
                 </span>
               ) : (
                 <Button size="sm" variant="outline" className="h-8">
                   <Upload className="w-3 h-3 mr-2" /> Upload
                 </Button>
               )}
             </div>
           ))}
        </div>
      </Card>
    </div>
  );

  const SettingsView = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-6">Business Settings</h2>

      <Card className="p-6 space-y-6 shadow-sm">
        <h3 className="font-semibold text-lg border-b pb-4">General Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name</label>
            <Input defaultValue="Bella's Coffee" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Legal Name</label>
            <Input defaultValue="Bella's Coffee Ltd." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Support Email</label>
            <Input defaultValue="help@bellascoffee.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input defaultValue="+33 1 23 45 67 89" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6 shadow-sm">
        <h3 className="font-semibold text-lg border-b pb-4">Bank Identity</h3>
        <p className="text-sm text-muted-foreground mt-2">Select your primary bank to display the correct brand logo on customer invoices and platform reports.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
           {['nordea', 'swedbank', 'seb', 'handelsbanken'].map((bank) => (
             <button key={bank} className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-[2rem] hover:border-[#006241]/30 transition-all hover:shadow-xl hover:-translate-y-1 group">
               <BankLogo type={bank} size="md" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#006241]">{bank}</span>
             </button>
           ))}
        </div>
      </Card>

      <Card className="p-6 space-y-6 shadow-sm">
        <h3 className="font-semibold text-lg border-b pb-4">Localization & Currency</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Currency</label>
             <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone</label>
             <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                <option value="UTC">UTC</option>
              </select>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline">Discard Changes</Button>
        <Button className="bg-primary hover:bg-primary/90">Save Settings</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
             Q
           </div>
           <span className="font-bold text-lg tracking-tight">QrStore</span>
        </div>
        
        <nav className="p-4 space-y-1">
          <SidebarItem page="dashboard" icon={LayoutDashboard} label="Overview" />
          <SidebarItem page="products" icon={ShoppingBag} label="Products" />
          <SidebarItem page="team" icon={Users} label="Team" />
          <SidebarItem page="payouts" icon={DollarSign} label="Payouts" />
          <div className="my-4 border-t border-gray-100 mx-4" />
          <SidebarItem page="compliance" icon={ShieldCheck} label="Compliance" />
          <SidebarItem page="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="font-semibold text-xs text-slate-600">BS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Bella Swan</p>
              <p className="text-xs text-muted-foreground truncate">Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <OwnerHeader 
          title={
            activePage === 'dashboard' ? 'Overview' : 
            activePage === 'product-editor' ? 'Product Editor' : 
            activePage.charAt(0).toUpperCase() + activePage.slice(1)
          } 
          className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10"
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activePage === 'dashboard' && <DashboardView />}
          {activePage === 'products' && <ProductsView />}
          {activePage === 'product-editor' && <ProductEditorView />}
          {activePage === 'team' && <TeamView />}
          {activePage === 'payouts' && <PayoutsView />}
          {activePage === 'compliance' && <ComplianceView />}
          {activePage === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

// Icon for Payouts
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}
