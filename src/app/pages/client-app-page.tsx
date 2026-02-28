import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { CheckoutHeader } from "../components/qrstore/headers";
import { AwningBand } from "../components/qrstore/headers/awning-band";
import { EmptyState } from "../components/qrstore/empty-state";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { 
  QrCode, Camera, ShieldCheck, CreditCard, ChevronRight, 
  CheckCircle2, XCircle, Clock, AlertTriangle, ArrowRight,
  Receipt, Share2, Scan, Info, Star, Ticket, User, Home, ListFilter,
  Download, Copy, ExternalLink, Settings, HelpCircle, Mail, MessageSquare,
  LogOut, Trash2, ChevronDown, ChevronUp, Bell, Globe, Lock, FileText, Image as ImageIcon,
  Smartphone, Eye, Shield, CloudOff, MapPin, ChefHat, ShoppingBag, Bike, RotateCcw, History
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { Skeleton } from "../components/ui/skeleton";
import { GuidedTour, TourStep } from "../components/GuidedTour";

// --- Types ---

type Tab = 'pay' | 'receipts' | 'tickets' | 'account';

// Pay Flow Types
type PayView = 
  | 'dashboard' | 'scan' | 'code-entry' | 'checkout' | 'review' 
  | 'step-up' | 'paying' | 'success' | 'failed' | 'expired' | 'already-paid' | 'order-status';

type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered';

// Receipt Flow Types
type ReceiptsView = 'list' | 'detail' | 'token-loading' | 'token-error';

// Settings Flow Types
type SettingsView = 
  | 'main' 
  | 'legal-terms' 
  | 'legal-privacy' 
  | 'legal-consent' 
  | 'delete-confirm' 
  | 'delete-success';

type PermissionState = 'granted' | 'denied' | 'restricted' | 'notDetermined';
type PermissionType = 'camera' | 'biometrics' | 'notifications' | 'photos';

// Support Flow Types
type SupportView = 'home' | 'contact-form' | 'ticket-detail';

interface CheckoutSession {
  id: string;
  merchantName: string;
  merchantLogo?: string;
  isVerified: boolean;
  amount: string;
  currency: string;
  items: Array<{ name: string; qty: number; price: string }>;
  vat?: string;
  code: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  date?: Date;
  receiptToken?: string;
  transactionId?: string;
  expiryTime?: number; // seconds remaining
}

interface ReceiptItem {
  id: string;
  merchantName: string;
  date: Date;
  amount: string;
  currency: string;
  status: 'paid' | 'failed' | 'refunded';
  items: Array<{ name: string; qty: number; price: string }>;
  subtotal: string;
  vat: string;
  total: string;
  txnId: string;
  offlineAvailable?: boolean;
  timeline?: Array<{ status: string, time: Date }>;
}

interface RecentPlace {
  id: string;
  name: string;
  image: string;
}

interface TicketItem {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  lastUpdate: Date;
  messages: Array<{ sender: 'user' | 'support', text: string, time: Date }>;
}

// --- Mock Data ---

const MOCK_SESSION: CheckoutSession = {
  id: "sess_123",
  merchantName: "Bella's Coffee",
  isVerified: true,
  amount: "10.50",
  currency: "EUR",
  items: [
    { name: "Cappuccino", qty: 2, price: "3.50" },
    { name: "Croissant", qty: 1, price: "3.50" }
  ],
  vat: "1.75",
  code: "892", // 3-digit mock
  status: 'pending',
  receiptToken: "tok_abc123",
  expiryTime: 300 // 5 minutes
};

const MOCK_RECENT_PLACES: RecentPlace[] = [
  { id: '1', name: "Bella's Coffee", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=128&h=128&fit=crop" },
  { id: '2', name: "The Daily Grind", image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=128&h=128&fit=crop" },
  { id: '3', name: "Burger Joint", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=128&h=128&fit=crop" },
  { id: '4', name: "Sushi Place", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=128&h=128&fit=crop" },
];

const MOCK_RECEIPTS: ReceiptItem[] = [
  {
    id: "rcpt_1",
    merchantName: "Bella's Coffee",
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    amount: "10.50",
    currency: "EUR",
    status: 'paid',
    items: [
      { name: "Cappuccino", qty: 2, price: "3.50" },
      { name: "Croissant", qty: 1, price: "3.50" }
    ],
    subtotal: "8.75",
    vat: "1.75",
    total: "10.50",
    txnId: "TXN-8923-XJ",
    offlineAvailable: true,
    timeline: [
      { status: 'Order Received', time: new Date(Date.now() - 1000 * 60 * 30) },
      { status: 'Preparing', time: new Date(Date.now() - 1000 * 60 * 25) },
      { status: 'Ready for Pickup', time: new Date(Date.now() - 1000 * 60 * 20) },
      { status: 'Picked Up', time: new Date(Date.now() - 1000 * 60 * 15) }
    ]
  },
  {
    id: "rcpt_2",
    merchantName: "Burger Joint",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    amount: "24.00",
    currency: "EUR",
    status: 'paid',
    items: [
      { name: "Cheeseburger", qty: 2, price: "12.00" }
    ],
    subtotal: "20.00",
    vat: "4.00",
    total: "24.00",
    txnId: "TXN-7721-AB",
    offlineAvailable: true,
    timeline: [
      { status: 'Order Received', time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
      { status: 'Delivered', time: new Date(Date.now() - 1000 * 60 * 60 * 23.5) }
    ]
  },
  {
    id: "rcpt_3",
    merchantName: "Tech Store",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    amount: "199.00",
    currency: "EUR",
    status: 'failed',
    items: [
      { name: "Headphones", qty: 1, price: "199.00" }
    ],
    subtotal: "165.83",
    vat: "33.17",
    total: "199.00",
    txnId: "TXN-FAILED-01",
    offlineAvailable: false
  }
];

const MOCK_TICKETS: TicketItem[] = [
  {
    id: "tkt_1",
    subject: "Payment Issue - Burger Joint",
    status: 'open',
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messages: [
      { sender: 'user', text: "I was charged twice for my burger.", time: new Date(Date.now() - 1000 * 60 * 60 * 5) },
      { sender: 'support', text: "Hi! We're looking into this for you.", time: new Date(Date.now() - 1000 * 60 * 60 * 2) }
    ]
  }
];

const CONSENT_HISTORY = [
  { version: "v2.1", date: "2023-10-15", action: "Accepted" },
  { version: "v2.0", date: "2023-01-10", action: "Accepted" },
  { version: "v1.0", date: "2022-05-20", action: "Accepted" },
];

// --- iOS Native Helpers ---

function IOSListGroup({ title, children, footer }: { title?: string, children: React.ReactNode, footer?: string }) {
  return (
    <div className="mb-6">
      {title && <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">{title}</h3>}
      <div className="bg-white overflow-hidden rounded-3xl border-none ring-1 ring-black/5 shadow-sm mx-4">
        {children}
      </div>
      {footer && <p className="px-5 mt-2 text-xs text-gray-400 ml-1">{footer}</p>}
    </div>
  );
}

function IOSListRow({ 
  icon: Icon, 
  label, 
  value, 
  onClick, 
  isDestructive = false,
  hasChevron = true,
  action
}: { 
  icon?: any, 
  label: string, 
  value?: string | React.ReactNode, 
  onClick?: () => void, 
  isDestructive?: boolean,
  hasChevron?: boolean,
  action?: React.ReactNode
}) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-0 transition-colors",
        onClick ? "active:bg-gray-50 cursor-pointer" : ""
      )}
    >
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0", 
            isDestructive ? "bg-red-500" : "bg-[#006241]"
          )}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <span className={cn("text-[15px] font-medium tracking-tight", isDestructive ? "text-red-600" : "text-slate-900")}>
          {label}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {value && <span className="text-[15px] text-gray-500">{value}</span>}
        {action}
        {hasChevron && <ChevronRight className="w-4 h-4 text-gray-300" />}
      </div>
    </div>
  );
}

function IOSSheetHandle() {
  return (
    <div className="w-full flex justify-center pt-3 pb-1">
      <div className="w-9 h-1 bg-gray-300 rounded-full" />
    </div>
  );
}

function BottomNav({ activeTab, onTabChange }: { activeTab: Tab, onTabChange: (tab: Tab) => void }) {
  const tabs: { id: Tab, icon: any, label: string }[] = [
    { id: 'pay', icon: Home, label: 'Dashboard' },
    { id: 'receipts', icon: Receipt, label: 'Receipts' },
    { id: 'tickets', icon: HelpCircle, label: 'Support' },
    { id: 'account', icon: User, label: 'Account' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] flex items-center justify-around z-40">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`${tab.id}-tab`}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors active:scale-95 duration-100",
            activeTab === tab.id ? "text-[#006241]" : "text-gray-400 hover:text-gray-500"
          )}
        >
          <tab.icon className={cn("w-6 h-6", activeTab === tab.id ? "stroke-[2.5px] fill-current/10" : "stroke-2")} />
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-[var(--brand-success)]/10 text-[var(--brand-success)] border-[var(--brand-success)]/20",
    failed: "bg-red-50 text-red-600 border-red-200",
    refunded: "bg-gray-100 text-gray-600 border-gray-200",
    open: "bg-blue-50 text-blue-600 border-blue-200",
    closed: "bg-gray-100 text-gray-600 border-gray-200",
    pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider", styles[status] || styles.refunded)}>
      {status}
    </span>
  );
}

function ExpiryTimer({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100 animate-pulse">
      <Clock className="w-3 h-3" />
      <span>{mins}:{secs.toString().padStart(2, '0')} remaining</span>
    </div>
  );
}

function PermissionRow({ 
  icon: Icon, 
  title, 
  state, 
  onToggle 
}: { 
  icon: any, 
  title: string, 
  state: PermissionState, 
  onToggle: () => void 
}) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className={cn("w-5 h-5", state === 'granted' ? "text-primary" : "text-gray-400")} />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{title}</span>
          <span className={cn("text-[10px]", 
            state === 'granted' ? "text-[var(--brand-success)] font-medium" : 
            state === 'denied' ? "text-red-500 font-medium" : 
            state === 'restricted' ? "text-orange-500" : "text-muted-foreground"
          )}>
            {state === 'granted' ? 'Allowed' : 
             state === 'denied' ? 'Turn on in Settings' : 
             state === 'restricted' ? 'Restricted by device policy' : 'Not determined'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {state === 'denied' && (
          <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => alert("Opened iOS Settings")}>
            Open Settings
          </Button>
        )}
        <Switch 
          checked={state === 'granted'} 
          onCheckedChange={onToggle}
          disabled={state === 'restricted'}
        />
      </div>
    </div>
  );
}

function PrePromptSheet({ 
  type, 
  isOpen, 
  onClose, 
  onAllow 
}: { 
  type: PermissionType | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onAllow: () => void 
}) {
  if (!isOpen || !type) return null;

  const content = {
    camera: {
      icon: Camera,
      title: "Camera Access",
      desc: "Allow camera access to scan QR codes. You can still enter a code manually.",
    },
    biometrics: {
      icon: ShieldCheck,
      title: "App Lock",
      desc: "Use Face ID/Touch ID to lock this app on this device.",
    },
    notifications: {
      icon: Bell,
      title: "Notifications",
      desc: "Get payment and receipt updates. You can change this anytime.",
    },
    photos: {
      icon: ImageIcon,
      title: "Photo Library",
      desc: "Allow photo access only when you choose a photo to attach.",
    }
  }[type];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-6 animate-in slide-in-from-bottom duration-300">
        <IOSSheetHandle />
        <div className="flex flex-col items-center text-center space-y-4 -mt-2">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <content.icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{content.title}</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">{content.desc}</p>
          </div>
        </div>
        <div className="space-y-3">
          <Button size="lg" className="w-full rounded-full" onClick={onAllow}>Allow Access</Button>
          <Button variant="ghost" className="w-full rounded-full" onClick={onClose}>Maybe Later</Button>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

function OrderTracker({ status, onClose }: { status: OrderStatus, onClose: () => void }) {
  const steps = [
    { id: 'received', label: 'Order Received', icon: Receipt, desc: 'Merchant has your order' },
    { id: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Barista is working magic' },
    { id: 'ready', label: 'Ready', icon: ShoppingBag, desc: 'Pick up at the counter' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);
  if (currentStepIndex === -1 && status === 'delivered') return null; 

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10 pt-2">
        <div className="absolute top-2 left-0 right-0">
           <IOSSheetHandle />
        </div>
        <h2 className="font-semibold text-lg mt-4">Order Status</h2>
        {status === 'ready' && (
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">Close</Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center mb-10 mt-4">
           <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
             {status === 'received' && <Receipt className="w-10 h-10 text-primary" />}
             {status === 'preparing' && <ChefHat className="w-10 h-10 text-primary" />}
             {status === 'ready' && <ShoppingBag className="w-10 h-10 text-primary" />}
           </div>
           <h3 className="text-2xl font-bold mb-2">
             {status === 'received' && "Order Received"}
             {status === 'preparing' && "Preparing your order"}
             {status === 'ready' && "Ready for Pickup!"}
           </h3>
           <p className="text-muted-foreground">
             {status === 'received' && "We've sent your order to the kitchen."}
             {status === 'preparing' && "Almost there, hang tight!"}
             {status === 'ready' && "Head to the counter with your order number."}
           </p>
           {status === 'ready' && (
             <div className="mt-6 p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-black/5">
               <span className="text-xs uppercase text-muted-foreground font-bold tracking-widest block mb-1">Order Number</span>
               <span className="text-4xl font-mono font-bold text-foreground">92</span>
             </div>
           )}
        </div>

        <div className="space-y-8 relative pl-4 max-w-sm mx-auto">
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-100" />
          
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={step.id} className={cn("relative flex gap-4 transition-all duration-500", 
                 isCurrent ? "opacity-100 scale-100" : isCompleted ? "opacity-60" : "opacity-30"
              )}>
                <div className={cn(
                  "relative z-10 w-14 h-14 rounded-full border-4 flex items-center justify-center transition-colors duration-500",
                  isCompleted || isCurrent ? "bg-white border-primary" : "bg-white border-gray-200"
                )}>
                  <step.icon className={cn("w-6 h-6", isCompleted || isCurrent ? "text-primary" : "text-gray-300")} />
                  {isCurrent && (
                     <span className="absolute -top-1 -right-1 flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                     </span>
                  )}
                </div>
                <div className="pt-2">
                  <h4 className={cn("font-bold text-base", isCurrent ? "text-foreground" : "text-muted-foreground")}>{step.label}</h4>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {status === 'ready' && (
         <div className="p-4 bg-white border-t safe-area-bottom">
           <Button size="lg" className="w-full rounded-full" onClick={onClose}>I've picked it up</Button>
         </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background pb-20 animate-pulse">
      <header className="bg-[#F7F5EF] border-b border-primary/10 sticky top-0 z-40">
        <AwningBand />
        <div className="h-14" />
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center gap-3 p-4 bg-white rounded-3xl shadow-sm">
           <Skeleton className="w-12 h-12 rounded-full" />
           <div className="space-y-2">
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-3 w-48" />
           </div>
        </div>
        
        <Skeleton className="w-full h-16 rounded-full" />
        
        <div className="space-y-3">
           <Skeleton className="h-4 w-24" />
           <div className="flex gap-4 overflow-hidden">
             {[1,2,3,4].map(i => (
               <div key={i} className="space-y-2">
                 <Skeleton className="w-16 h-16 rounded-full" />
                 <Skeleton className="h-3 w-12 mx-auto" />
               </div>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20 rounded-3xl" />
          <Skeleton className="h-20 rounded-3xl" />
          <Skeleton className="h-20 rounded-3xl" />
        </div>

        <div className="space-y-3">
           <div className="flex justify-between">
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-4 w-16" />
           </div>
           {[1, 2].map(i => (
             <div key={i} className="bg-white rounded-3xl p-4 flex justify-between">
               <div className="flex gap-3">
                 <Skeleton className="w-10 h-10 rounded-full" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-3 w-16" />
                 </div>
               </div>
               <div className="space-y-2 flex flex-col items-end">
                 <Skeleton className="h-4 w-16" />
                 <Skeleton className="h-5 w-12 rounded-full" />
               </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}

export default function ClientAppPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pay');
  
  // Tour State
  const [tourVisible, setTourVisible] = useState(true);
  const clientTourSteps: TourStep[] = [
    {
      targetId: "client-search-trigger",
      title: "Search products",
      body: "Type keywords or browse curated categories from local Swedish artisans.",
      buttonText: "Search",
      placement: "bottom"
    },
    {
      targetId: "recent-places-list",
      title: "Open a product",
      body: "See high-resolution details, verified customer reviews, and fast delivery options.",
      buttonText: "Next",
      placement: "top"
    },
    {
      targetId: "receipts-tab",
      title: "Track orders",
      body: "All your active purchases, digital receipts, and tracking history are stored here.",
      buttonText: "Got it",
      placement: "top"
    }
  ];

  // Pay State
  const [payView, setPayView] = useState<PayView>('dashboard');
  const [sessionCode, setSessionCode] = useState("");
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [expiryTime, setExpiryTime] = useState(300);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Receipts State
  const [receiptsView, setReceiptsView] = useState<ReceiptsView>('list');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);
  const [receiptFilter, setReceiptFilter] = useState<'all' | 'paid' | 'failed'>('all');
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(null);

  // Settings State
  const [settingsView, setSettingsView] = useState<SettingsView>('main');
  const [permissions, setPermissions] = useState<Record<PermissionType, PermissionState>>({
    camera: 'notDetermined',
    biometrics: 'notDetermined',
    notifications: 'granted', 
    photos: 'notDetermined'
  });
  const [activePrePrompt, setActivePrePrompt] = useState<PermissionType | null>(null);
  
  // Support State
  const [supportView, setSupportView] = useState<SupportView>('home');
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
     if (payView === 'order-status') {
       if (Notification.permission === 'default') {
         Notification.requestPermission();
       }
       if (!orderStatus) setOrderStatus('received');
       
       const t1 = setTimeout(() => setOrderStatus('preparing'), 3000);
       const t2 = setTimeout(() => {
         setOrderStatus('ready');
         if (Notification.permission === 'granted') {
           new Notification("Order Ready!", {
             body: "Your order at Bella's Coffee is ready for pickup.",
             icon: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=128&h=128&fit=crop"
           });
         }
       }, 8000);
       
       return () => { clearTimeout(t1); clearTimeout(t2); };
     }
  }, [payView]);

  useEffect(() => {
    let timer: number;
    if (session && (payView === 'checkout' || payView === 'review' || payView === 'step-up')) {
      timer = window.setInterval(() => {
        setExpiryTime(prev => {
          if (prev <= 1) {
            setPayView('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session, payView]);

  // Audio Helper
  const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  // Handlers - Pay
  const handleScanClick = () => {
    if (permissions.camera === 'denied') {
      alert("Camera access is denied. Please enable it in Settings or use manual entry.");
      setPayView('scan');
      return;
    }
    if (permissions.camera === 'notDetermined') {
      setActivePrePrompt('camera');
      return;
    }
    setPayView('scan');
    setTimeout(() => setShowScanner(true), 800);
  };

  const handleCodeSubmit = () => {
    if (sessionCode.length >= 3) {
      if (navigator.vibrate) navigator.vibrate(50);
      playSuccessSound();
      setTimeout(() => {
        setSession({ ...MOCK_SESSION, expiryTime: 300 });
        setExpiryTime(300);
        setPayView('review');
      }, 500);
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (navigator.vibrate) navigator.vibrate(100);
      playSuccessSound();
      setSession({ ...MOCK_SESSION, expiryTime: 300 });
      setExpiryTime(300);
      setPayView('review');
    }, 1500);
  };

  const handlePay = () => {
    const requiresStepUp = Math.random() > 0.7;
    if (requiresStepUp) setPayView('step-up');
    else startPayment();
  };

  const startPayment = () => {
    setPayView('paying');
    setTimeout(() => {
      const outcome = Math.random();
      if (outcome > 0.2) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        playSuccessSound();
        setPayView('success');
      } else if (outcome > 0.1) {
        if (navigator.vibrate) navigator.vibrate(200);
        setPayView('failed');
      } else {
        setPayView('expired');
      }
    }, 2000);
  };

  // Handlers - Permissions
  const handlePermissionToggle = (type: PermissionType) => {
    const currentState = permissions[type];
    if (currentState === 'granted') {
      setPermissions(prev => ({ ...prev, [type]: 'notDetermined' }));
    } else if (currentState === 'notDetermined') {
      setActivePrePrompt(type);
    } else if (currentState === 'denied') {
      setActivePrePrompt(type);
    }
  };

  const handlePrePromptAllow = () => {
    if (activePrePrompt) {
       setTimeout(() => {
         setPermissions(prev => ({ ...prev, [activePrePrompt]: 'granted' }));
         if (activePrePrompt === 'camera' && payView === 'dashboard') {
            setPayView('scan');
            setTimeout(() => setShowScanner(true), 800);
         }
         setActivePrePrompt(null);
       }, 500);
    }
  };

  const handleReorder = (receipt: ReceiptItem) => {
    setSession({
      ...MOCK_SESSION,
      merchantName: receipt.merchantName,
      amount: receipt.amount,
      currency: receipt.currency,
      items: receipt.items,
      expiryTime: 300
    });
    setExpiryTime(300);
    setPayView('review');
    setActiveTab('pay');
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const navigateTo = (tab: Tab) => {
    setActiveTab(tab);
  };

  // --- Render Functions ---

  const renderPayTab = () => {
    // 0. Loading State
    if (isLoading) return <DashboardSkeleton />;

    // 1. Client Dashboard
    if (payView === 'dashboard') {
      return (
        <div className="flex flex-col h-full bg-[#F7F5EF] pb-20">
          <header className="bg-[#F7F5EF] border-b border-primary/10 sticky top-0 z-40">
            <AwningBand />
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">Q</div>
                 <span className="font-bold text-lg tracking-tight text-foreground">Client</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" alt="Profile" className="w-full h-full object-cover" />
                 </div>
               </div>
            </div>
          </header>

          {orderStatus && (
            <div
              className="bg-primary text-white py-2 px-4 text-center text-xs font-medium cursor-pointer animate-in slide-in-from-top duration-300 shrink-0"
              onClick={() => setPayView('order-status')}
            >
              Active Order: <span className="font-bold uppercase">{orderStatus}</span> — Tap to view
            </div>
          )}

          <main className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-white rounded-3xl shadow-sm">
               <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="User" className="w-full h-full object-cover" />
               </div>
               <div>
                 <h2 className="font-semibold text-lg">Jane Doe</h2>
                 <p className="text-xs text-muted-foreground">jane.doe@example.com</p>
               </div>
            </div>

            <Button id="client-search-trigger" size="lg" className="w-full h-16 text-lg rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white" onClick={handleScanClick}>
              <Camera className="w-6 h-6 mr-3" />
              Scan & Pay
            </Button>

            {/* Recent Places */}
            <div id="recent-places-list">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Recent Places</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {MOCK_RECENT_PLACES.map((place) => (
                  <button 
                    key={place.id}
                    className="flex flex-col items-center space-y-2 min-w-[72px]"
                    onClick={() => {
                      setSession({ ...MOCK_SESSION, merchantName: place.name });
                      setPayView('review');
                    }}
                  >
                    <div className="w-16 h-16 rounded-full p-0.5 border-2 border-primary/20 hover:border-primary transition-colors">
                      <img src={place.image} alt={place.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-xs font-medium text-center truncate w-full">{place.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="flex flex-col h-20 items-center justify-center gap-2 bg-white rounded-3xl border-0 shadow-sm" onClick={() => navigateTo('receipts')}>
                <Receipt className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-normal">Receipts</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-20 items-center justify-center gap-2 bg-white rounded-3xl border-0 shadow-sm" onClick={() => navigateTo('tickets')}>
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-normal">Support</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-20 items-center justify-center gap-2 bg-white rounded-3xl border-0 shadow-sm" onClick={() => navigateTo('account')}>
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-normal">Settings</span>
              </Button>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
                 <Button variant="link" size="sm" className="text-xs p-0 h-auto" onClick={() => navigateTo('receipts')}>View All</Button>
               </div>
               
               {MOCK_RECEIPTS.slice(0, 2).map((receipt) => (
                 <div key={receipt.id} className="bg-white rounded-3xl p-4 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center relative">
                       <Receipt className="w-5 h-5 text-gray-400" />
                       {receipt.offlineAvailable && (
                         <div className="absolute -bottom-1 -right-1 bg-green-100 rounded-full p-0.5 border border-white" title="Saved Offline">
                            <CloudOff className="w-2.5 h-2.5 text-green-700" />
                         </div>
                       )}
                     </div>
                     <div>
                       <p className="font-medium text-sm">{receipt.merchantName}</p>
                       <p className="text-xs text-muted-foreground">{receipt.date.toLocaleDateString()}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-mono font-medium">{receipt.currency} {receipt.amount}</p>
                     <StatusChip status={receipt.status} />
                   </div>
                 </div>
               ))}
            </div>
          </main>
        </div>
      );
    }
    
    // Pass-through for full-screen pay views
    return (
      <div className="h-full bg-background pb-0">
        {renderPayFlow()}
      </div>
    );
  };

  const renderPayFlow = () => {
    // 2. Camera Scan Screen
    if (payView === 'scan') {
      if (permissions.camera === 'denied') {
        return (
          <div className="fixed inset-0 z-50 bg-background text-foreground flex flex-col relative overflow-hidden">
             <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 left-4 z-20 text-foreground hover:bg-black/5"
                onClick={() => setPayView('dashboard')}
              >
                <XCircle className="w-8 h-8" />
              </Button>
              <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                   <Camera className="w-10 h-10 text-primary" />
                 </div>
                 <h2 className="text-2xl font-bold text-center text-foreground">Camera Access Denied</h2>
                 <p className="text-muted-foreground text-center max-w-xs">
                   To scan QR codes, you need to allow camera access in your device settings.
                 </p>
                 <div className="w-full max-w-xs space-y-3">
                   <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setPayView('code-entry')}>Enter Code Manually</Button>
                   <Button variant="outline" className="w-full border-input hover:bg-accent" onClick={() => alert("Open Settings")}>Open Settings</Button>
                 </div>
              </div>
          </div>
        );
      }

      return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col relative overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 left-4 z-20 text-white hover:bg-white/10"
            onClick={() => setPayView('dashboard')}
          >
            <XCircle className="w-8 h-8" />
          </Button>
          
          <div className="flex-1 flex flex-col items-center justify-center relative bg-neutral-900">
             {!showScanner ? (
               <div className="flex flex-col items-center animate-pulse text-white/50">
                 <Camera className="w-12 h-12 mb-4" />
                 <p className="text-sm font-medium">Accessing Camera...</p>
               </div>
             ) : (
               <>
                 <div className="absolute inset-0 bg-neutral-900" onClick={simulateScan}>
                    <div className="w-full h-full bg-gradient-to-b from-transparent to-black/20" />
                 </div>
                 
                 <div className="relative z-10 w-64 h-64 border-2 border-white/30 rounded-3xl overflow-hidden pointer-events-none">
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                   <div className="w-full h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.8)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                 </div>
                 
                 <p className="relative z-10 mt-8 text-sm font-medium bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full">
                   Point camera at QR code
                 </p>
                 <button className="absolute bottom-0 left-0 right-0 top-0 opacity-0" onClick={simulateScan}>Simulate Scan</button>
               </>
             )}
          </div>
          
          <div className="p-8 pb-12 bg-background rounded-t-3xl -mt-6 relative z-20 flex justify-center shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
             <Button 
               size="lg"
               className="w-full max-w-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" 
               onClick={() => setPayView('code-entry')}
             >
               Enter Code Manually
             </Button>
          </div>
        </div>
      );
    }

    // 3. Manual Entry
    if (payView === 'code-entry') {
      return (
        <div className="min-h-screen bg-background flex flex-col z-50 relative">
          <CheckoutHeader title="Enter Code" onBackClick={() => setPayView('dashboard')} className="border-b" />
          <main className="flex-1 p-6 max-w-md mx-auto w-full pt-12">
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold">Enter Session Code</h1>
                <p className="text-muted-foreground text-sm">Found below the QR code at the merchant.</p>
              </div>
              <Input 
                autoFocus
                placeholder="000" 
                className="text-center text-5xl h-24 font-bold font-mono tracking-[0.5em] bg-transparent border-none focus:ring-0 placeholder:text-gray-200"
                maxLength={3}
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
              />
              <Button size="lg" className="w-full h-14 text-lg mt-8" disabled={sessionCode.length < 3} onClick={handleCodeSubmit}>
                Continue
              </Button>
            </div>
          </main>
        </div>
      );
    }

    // 4, 5, 6, 7. Checkout Flow
    if (['checkout', 'review', 'step-up', 'paying'].includes(payView)) {
      return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-y-auto">
          {payView === 'step-up' ? (
             <CheckoutHeader title="Security Check" onBackClick={() => setPayView('review')} className="border-b" />
          ) : payView === 'paying' ? null : (
             <CheckoutHeader title="Checkout" onCloseClick={() => setPayView('dashboard')} className="bg-white border-b sticky top-0 z-10" />
          )}

          {payView === 'paying' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
               <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-100" />
                  <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent absolute top-0 left-0 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-primary/20" />
                  </div>
               </div>
               <h2 className="text-xl font-bold mb-2">Processing Payment</h2>
               <p className="text-muted-foreground mb-12">Please wait, do not close this window.</p>
            </div>
          ) : payView === 'step-up' ? (
            <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6 pt-8">
              <div className="text-center mb-6">
                 <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                 <h2 className="text-xl font-bold">Confirm it's you</h2>
                 <p className="text-muted-foreground text-sm mt-2">Please verify your card details.</p>
               </div>
               <div className="space-y-4">
                 <div className="space-y-2"><label className="text-xs font-semibold uppercase text-muted-foreground">CVV</label><Input className="text-center text-xl" /></div>
                 <div className="space-y-2"><label className="text-xs font-semibold uppercase text-muted-foreground">Zip</label><Input className="text-center text-xl" /></div>
               </div>
               <Button size="lg" className="w-full h-12 mt-4" onClick={startPayment}>Confirm & Pay</Button>
            </main>
          ) : (
            <main className="flex-1 p-4 pb-32 max-w-md mx-auto w-full space-y-4">
              <div className="flex flex-col items-center py-6 animate-in slide-in-from-top-4 duration-500">
                {expiryTime < 60 && <div className="mb-4"><ExpiryTimer seconds={expiryTime} /></div>}
                
                <div className="w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center mb-3">
                  <span className="font-bold text-xl text-primary">B</span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h1 className="font-bold text-lg">{session?.merchantName}</h1>
                  {session?.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50" />}
                </div>
                <Badge variant="secondary" className="font-normal text-xs bg-gray-200/50 hover:bg-gray-200/50 text-gray-600 mb-2">Food & Drink • Verified Merchant</Badge>
                
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                   <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                   <span className="font-bold text-sm">4.3</span>
                   <span className="text-xs text-muted-foreground">(2.1k reviews)</span>
                </div>
              </div>
              
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <div className="p-4 bg-white space-y-4">
                   {payView === 'review' ? (
                     <div className="space-y-3 animate-in fade-in duration-300">
                       {session?.items.map((item, i) => (
                         <div key={i} className="flex justify-between text-sm">
                           <div className="flex gap-2"><span className="text-muted-foreground">{item.qty}x</span><span>{item.name}</span></div>
                           <span className="font-mono">{session?.currency} {(parseFloat(item.price) * item.qty).toFixed(2)}</span>
                         </div>
                       ))}
                       <div className="h-px bg-border my-2" />
                       <div className="flex justify-between text-xs text-muted-foreground"><span>VAT (Included)</span><span className="font-mono">{session?.currency} {session?.vat}</span></div>
                     </div>
                   ) : (
                     <div className="flex justify-between items-center animate-in fade-in duration-300" onClick={() => setPayView('review')}>
                       <div className="flex flex-col"><span className="font-medium text-foreground">Order Summary</span><span className="text-xs text-muted-foreground">{session?.items.reduce((acc, i) => acc + i.qty, 0)} items</span></div>
                       <ChevronRight className="w-4 h-4 text-muted-foreground" />
                     </div>
                   )}
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                   <span className="font-semibold text-lg">Total</span>
                   <span className="font-commerce text-2xl font-bold">{session?.currency} {session?.amount}</span>
                </div>
              </Card>

              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Payment</span>
                <span>•</span>
                <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Encrypted</span>
              </div>
              
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-area-bottom">
                <div className="max-w-md mx-auto w-full">
                  <Button size="lg" className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20" onClick={payView === 'checkout' ? () => setPayView('review') : handlePay}>
                    {payView === 'checkout' ? `Review Payment` : `Pay ${session?.currency} ${session?.amount}`}
                  </Button>
                </div>
              </div>
            </main>
          )}
        </div>
      );
    }

    // 8, 9, 10. Outcomes
    if (['success', 'failed', 'expired', 'already-paid', 'order-status'].includes(payView)) {
      if (payView === 'order-status') {
         return <OrderTracker status={orderStatus || 'received'} onClose={() => setPayView('dashboard')} />;
      }
      
      const config = {
        success: {
          icon: CheckCircle2,
          color: "text-primary",
          bg: "bg-primary/10",
          title: "Payment Successful",
          desc: "Your payment has been processed securely.",
          action: "Done",
          onClick: () => {
             setPayView('dashboard');
             setSession(null);
          } 
        },
        failed: {
          icon: AlertTriangle,
          color: "text-destructive",
          bg: "bg-destructive/10",
          title: "Payment Failed",
          desc: "Your card was declined. Please try again.",
          action: "Try Again",
          onClick: () => setPayView('review')
        },
        expired: {
          icon: Clock,
          color: "text-orange-500",
          bg: "bg-orange-50",
          title: "Session Expired",
          desc: "This payment session has timed out.",
          action: "Start Over",
          onClick: () => setPayView('dashboard')
        },
        'already-paid': {
          icon: CheckCircle2,
          color: "text-primary",
          bg: "bg-primary/10",
          title: "Already Paid",
          desc: "This session has already been paid.",
          action: "View Receipt",
          onClick: () => { setActiveTab('receipts'); setPayView('dashboard'); }
        }
      }[payView as 'success' | 'failed' | 'expired' | 'already-paid'];

      return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300 overflow-hidden">
           <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/5 blur-3xl rounded-full pointer-events-none" />
           <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-orange-50/50 blur-3xl rounded-full pointer-events-none" />

           <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm border border-white/20 shadow-sm", config.bg)}>
             <config.icon className={cn("w-12 h-12", config.color)} />
           </div>
           <h2 className="text-2xl font-bold mb-2 text-foreground relative z-10">{config.title}</h2>
           <p className="text-muted-foreground mb-8 max-w-xs mx-auto relative z-10">{config.desc}</p>
           
           {payView === 'success' && session?.code && (
              <div className="w-full mb-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden text-left relative z-10">
                 <div className="p-5 border-b border-gray-100/50 flex justify-between items-center bg-white/40">
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Session Code</span>
                      <span className="font-commerce text-4xl font-medium tracking-tight text-foreground">{session.code}</span>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Merchant</span>
                      <div className="flex items-center gap-1.5 justify-end">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                           <CheckCircle2 className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{session.merchantName}</span>
                      </div>
                   </div>
                 </div>
                 
                 <div className="p-5 bg-white/20">
                   <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block mb-3">Order Summary</span>
                   <div className="space-y-2">
                     {session.items.map((item, i) => (
                       <div key={i} className="flex justify-between text-sm">
                         <div className="flex gap-2">
                           <span className="text-muted-foreground font-medium">{item.qty}x</span>
                           <span className="text-foreground font-medium">{item.name}</span>
                         </div>
                         <span className="font-mono text-muted-foreground">{session.currency} {item.price}</span>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-4 pt-3 border-t border-gray-200/50 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Total Paid</span>
                      <span className="font-commerce font-bold text-lg">{session.currency} {session.amount}</span>
                   </div>
                 </div>
              </div>
           )}

           {payView === 'success' && (
             <div className="mb-6 relative z-10 w-full max-w-xs">
               <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/40 shadow-sm text-center transition-all">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Rate your experience</p>
                 <div className="flex justify-center gap-3">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button
                       key={star}
                       className="focus:outline-none transition-transform active:scale-90"
                       onClick={() => {
                         if (navigator.vibrate) navigator.vibrate(50);
                         setRating(star);
                       }}
                     >
                       <Star 
                         className={cn(
                           "w-8 h-8 transition-all duration-300", 
                           rating >= star ? "fill-[#006241] text-[#006241] scale-110" : "text-gray-300 hover:text-gray-400"
                         )} 
                         strokeWidth={rating >= star ? 0 : 1.5}
                       />
                     </button>
                   ))}
                 </div>
                 {rating > 0 && (
                   <p className="text-xs text-[#006241] font-medium mt-3 animate-in fade-in slide-in-from-bottom-2">
                     Thank you for your feedback!
                   </p>
                 )}
               </div>
             </div>
           )}
           
           <Button size="lg" className="w-full max-w-xs relative z-10 shadow-lg shadow-primary/20" onClick={config.onClick}>
             {config.action}
           </Button>
        </div>
      );
    }

    return null;
  };

  const renderReceiptsTab = () => {
    // Receipt Detail View
    if (receiptsView === 'detail' && selectedReceipt) {
      return (
        <div className="flex flex-col h-full bg-background z-50 fixed inset-0">
          <CheckoutHeader title="Receipt" onBackClick={() => setReceiptsView('list')} className="border-b" />
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
             <Card className="max-w-md mx-auto bg-white shadow-sm rounded-3xl border-0 overflow-hidden">
                <div className="p-6 text-center border-b border-gray-100 border-dashed">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                     <span className="font-bold text-gray-600">B</span>
                   </div>
                   <h2 className="font-bold text-lg mb-1">{selectedReceipt.merchantName}</h2>
                   <p className="text-xs text-muted-foreground">{selectedReceipt.date.toLocaleString()}</p>
                   <div className="mt-4 mb-2">
                     <span className="text-3xl font-commerce font-bold">{selectedReceipt.currency} {selectedReceipt.total}</span>
                   </div>
                   <StatusChip status={selectedReceipt.status} />
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    {selectedReceipt.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">{item.qty}x</span>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-mono">{selectedReceipt.currency} {item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono">{selectedReceipt.currency} {selectedReceipt.subtotal}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>VAT (20%)</span><span className="font-mono">{selectedReceipt.currency} {selectedReceipt.vat}</span></div>
                    <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span className="font-commerce">{selectedReceipt.currency} {selectedReceipt.total}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-100 text-xs text-muted-foreground space-y-2">
                   <p>Confirmation: <span className="font-mono font-medium text-foreground">XJ-921-22</span></p>
                   <p className="pt-2">Charged in {selectedReceipt.currency}. VAT included.</p>
                </div>
             </Card>

             <div className="max-w-md mx-auto mt-6 space-y-3">
               <Button className="w-full rounded-full" size="lg"><Share2 className="w-4 h-4 mr-2" /> Share Receipt Link</Button>
               <Button variant="outline" className="w-full rounded-full" size="lg"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
             </div>
          </main>
        </div>
      );
    }

    // Receipt List View
    const filteredReceipts = MOCK_RECEIPTS.filter(
      r => receiptFilter === 'all' || r.status === receiptFilter
    );

    return (
      <div className="flex flex-col h-full bg-background pb-20">
         <CheckoutHeader title="Receipts" className="border-b" />
         
         {/* Filters */}
         <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-100 bg-white">
           {(['all', 'paid', 'failed'] as const).map(f => (
             <button 
               key={f}
               onClick={() => setReceiptFilter(f)}
               className={cn(
                 "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize",
                 receiptFilter === f 
                   ? "bg-primary text-primary-foreground border-primary" 
                   : "bg-background text-muted-foreground border-gray-200 hover:bg-gray-50"
               )}
             >
               {f}
             </button>
           ))}
         </div>

         {/* List */}
         <div className="flex-1 overflow-y-auto p-4 space-y-3">
           {filteredReceipts.length === 0 ? (
             <EmptyState
               title={receiptFilter === 'all' ? 'No receipts yet' : `No ${receiptFilter} receipts`}
               description={
                 receiptFilter === 'all'
                   ? "Your payment receipts will appear here after your first purchase."
                   : `You don't have any ${receiptFilter} receipts right now.`
               }
               action={receiptFilter !== 'all' ? { label: "Clear filter", onClick: () => setReceiptFilter('all') } : undefined}
               className="py-16"
             />
           ) : (
             filteredReceipts.map(receipt => (
               <div key={receipt.id} className="bg-white rounded-3xl overflow-hidden shadow-sm transition-all">
                 <div
                   onClick={() => setExpandedReceiptId(expandedReceiptId === receipt.id ? null : receipt.id)}
                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50"
                 >
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 relative">
                       <Receipt className="w-5 h-5 text-gray-400" />
                       {receipt.offlineAvailable && (
                         <div className="absolute -bottom-1 -right-1 bg-green-100 rounded-full p-0.5 border border-white" title="Saved Offline">
                           <CloudOff className="w-2.5 h-2.5 text-green-700" />
                         </div>
                       )}
                     </div>
                     <div>
                       <h3 className="font-medium text-sm">{receipt.merchantName}</h3>
                       <p className="text-xs text-muted-foreground">{receipt.date.toLocaleDateString()}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="text-right">
                       <p className="font-commerce font-medium">{receipt.currency} {receipt.amount}</p>
                       <StatusChip status={receipt.status} />
                     </div>
                     {expandedReceiptId === receipt.id
                       ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                       : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                   </div>
                 </div>

                 {/* Expanded Content */}
                 {expandedReceiptId === receipt.id && (
                   <div className="bg-gray-50 p-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                     <div className="space-y-2 mb-4">
                       {receipt.items.map((item, i) => (
                         <div key={i} className="flex justify-between text-sm">
                           <span className="text-muted-foreground">{item.qty}x {item.name}</span>
                           <span className="font-mono">{receipt.currency} {item.price}</span>
                         </div>
                       ))}
                     </div>
                     <div className="flex justify-between font-bold text-sm border-t border-gray-200 pt-2 mb-4">
                       <span>Total</span>
                       <span className="font-commerce">{receipt.currency} {receipt.total}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                       <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setSelectedReceipt(receipt); setReceiptsView('detail'); }}>
                         Full Details
                       </Button>
                       <Button size="sm" variant="outline" className="rounded-full">
                         <Share2 className="w-3 h-3 mr-2" /> Share
                       </Button>
                     </div>
                   </div>
                 )}
               </div>
             ))
           )}
         </div>
      </div>
    );
  };

  const renderTicketsTab = () => {
    if (supportView === 'contact-form') {
      return (
        <div className="flex flex-col h-full bg-[#F7F5EF] pb-20">
          <CheckoutHeader title="Contact Support" onBackClick={() => setSupportView('home')} className="bg-white border-b" />
          <main className="p-6 space-y-6">
             <IOSListGroup>
               <div className="p-2 space-y-2">
                 <label className="text-xs font-semibold px-2 uppercase text-gray-400">Subject</label>
                 <Input className="border-none shadow-none bg-transparent focus-visible:ring-0 px-2" placeholder="e.g. Payment Issue" />
               </div>
               <div className="h-px bg-gray-100" />
               <div className="p-2 space-y-2">
                 <label className="text-xs font-semibold px-2 uppercase text-gray-400">Message</label>
                 <textarea className="flex w-full rounded-md border-none shadow-none bg-transparent px-2 py-2 text-sm focus:outline-none min-h-[150px] resize-none" placeholder="Describe your issue..." />
               </div>
             </IOSListGroup>
             <Button size="lg" className="w-full rounded-full bg-[#006241]" onClick={() => setSupportView('home')}>Send Message</Button>
          </main>
        </div>
      );
    }

    if (supportView === 'ticket-detail' && selectedTicket) {
      return (
        <div className="flex flex-col h-full bg-[#F7F5EF] pb-20">
          <CheckoutHeader title="Ticket #892" onBackClick={() => setSupportView('home')} className="bg-white border-b" />
          <main className="flex-1 overflow-y-auto p-4 space-y-4">
             <div className="bg-white p-4 rounded-3xl shadow-sm mb-4">
               <h3 className="font-semibold text-slate-900">{selectedTicket.subject}</h3>
               <div className="flex gap-2 mt-2 items-center">
                 <StatusChip status={selectedTicket.status} />
                 <span className="text-xs text-gray-400">Updated {selectedTicket.lastUpdate.toLocaleTimeString()}</span>
               </div>
             </div>
             
             {selectedTicket.messages.map((msg, i) => (
               <div key={i} className={cn("flex flex-col max-w-[85%] rounded-2xl p-3 text-[15px] shadow-sm", msg.sender === 'user' ? "self-end bg-[#006241] text-white ml-auto rounded-tr-sm" : "bg-white text-slate-900 rounded-tl-sm")}>
                 <p>{msg.text}</p>
                 <span className={cn("text-[10px] mt-1 opacity-70", msg.sender === 'user' ? "text-green-100" : "text-gray-400")}>{msg.time.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
               </div>
             ))}

             <div className="pt-4 mt-auto">
               <div className="flex gap-2 bg-white p-2 rounded-full border border-gray-200 shadow-sm">
                 <Input placeholder="Reply..." className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent" />
                 <Button size="icon" className="rounded-full bg-[#006241] w-9 h-9"><ArrowRight className="w-4 h-4" /></Button>
               </div>
             </div>
          </main>
        </div>
      );
    }

    // Support Home
    return (
      <div className="flex flex-col h-full bg-[#F7F5EF] pb-24">
         <header className="bg-[#F7F5EF] border-b border-primary/10 sticky top-0 z-40">
            <AwningBand />
            <div className="px-4 h-14 flex items-center">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Support</h1>
            </div>
         </header>
         <main className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="bg-[#006241] text-white rounded-3xl p-6 shadow-md shadow-green-900/10">
               <h2 className="text-xl font-bold mb-2">How can we help?</h2>
               <p className="text-green-100 mb-6 text-sm">Our team is available 24/7 to assist you.</p>
               <Button size="lg" className="w-full rounded-full bg-white text-[#006241] hover:bg-gray-100 border-none" onClick={() => setSupportView('contact-form')}>
                 <Mail className="w-4 h-4 mr-2" /> Contact Support
               </Button>
            </div>
            
            <IOSListGroup title="Your Tickets">
              {MOCK_TICKETS.map((ticket, i) => (
                <div key={ticket.id} onClick={() => { setSelectedTicket(ticket); setSupportView('ticket-detail'); }} className={cn("p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50", i !== MOCK_TICKETS.length - 1 && "border-b border-gray-100")}>
                  <div>
                    <p className="font-medium text-[15px] text-slate-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Last update: {ticket.lastUpdate.toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <StatusChip status={ticket.status} />
                     <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </IOSListGroup>

            <IOSListGroup title="Resources">
              <IOSListRow icon={HelpCircle} label="FAQs" onClick={() => navigateTo('account')} />
              <IOSListRow icon={ShieldCheck} label="Privacy Policy" onClick={() => {navigateTo('account'); setSettingsView('legal-privacy')}} />
              <IOSListRow icon={FileText} label="Terms of Service" onClick={() => {navigateTo('account'); setSettingsView('legal-terms')}} />
            </IOSListGroup>
         </main>
      </div>
    );
  };

  const renderAccountTab = () => {
    // Legal & Privacy Viewers
    if (['legal-terms', 'legal-privacy'].includes(settingsView)) {
      const isPrivacy = settingsView === 'legal-privacy';
      return (
        <div className="flex flex-col h-full bg-[#F7F5EF] z-50 fixed inset-0">
          <CheckoutHeader title={isPrivacy ? "Privacy Policy" : "Terms of Service"} onBackClick={() => setSettingsView('main')} className="bg-white border-b" />
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            {isPrivacy ? <Shield className="w-16 h-16 mb-4 opacity-20" /> : <FileText className="w-16 h-16 mb-4 opacity-20" />}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Offline Mode</h2>
            <p className="text-sm max-w-xs mb-6 text-gray-500">Cannot load the legal document viewer while offline. Please check your internet connection.</p>
            <Button variant="outline" onClick={() => setSettingsView('main')}>Go Back</Button>
          </div>
        </div>
      );
    }

    if (settingsView === 'legal-consent') {
      return (
        <div className="flex flex-col h-full bg-[#F7F5EF] z-50 fixed inset-0">
          <CheckoutHeader title="Consent History" onBackClick={() => setSettingsView('main')} className="bg-white border-b" />
          <main className="flex-1 overflow-y-auto pt-6">
            <div className="px-4">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                 {CONSENT_HISTORY.map((item, i) => (
                   <div key={i} className="p-4 border-b last:border-0 flex justify-between items-center">
                     <div>
                       <p className="font-medium text-[15px] text-slate-900">Terms of Service {item.version}</p>
                       <p className="text-xs text-gray-500">{item.date}</p>
                     </div>
                     <Badge variant="outline" className="bg-green-50 text-[#006241] border-green-200 font-normal">{item.action}</Badge>
                   </div>
                 ))}
              </div>
            </div>
          </main>
        </div>
      );
    }

    if (settingsView === 'delete-confirm') {
      return (
        <div className="flex flex-col h-full bg-[#F7F5EF] z-50 fixed inset-0 p-6 items-center justify-center text-center">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50">
             <AlertTriangle className="w-10 h-10 text-red-500" />
           </div>
           <h2 className="text-2xl font-bold text-slate-900 mb-2">Delete Account?</h2>
           <p className="text-gray-500 mb-8 max-w-xs mx-auto">This action cannot be undone. All your receipts and points will be permanently removed.</p>
           
           <div className="w-full max-w-xs space-y-3">
             <Button variant="destructive" className="w-full h-12 text-base font-semibold" onClick={() => setSettingsView('delete-success')}>
               Yes, Delete Everything
             </Button>
             <Button variant="ghost" className="w-full text-slate-600" onClick={() => setSettingsView('main')}>
               Cancel
             </Button>
           </div>
        </div>
      );
    }

    if (settingsView === 'delete-success') {
      return (
        <div className="flex flex-col h-full bg-white z-50 fixed inset-0 p-6 items-center justify-center text-center animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
             <CheckCircle2 className="w-10 h-10 text-green-600" />
           </div>
           <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Deleted</h2>
           <p className="text-gray-500 mb-8">We're sorry to see you go.</p>
           <Button className="w-full max-w-xs bg-[#006241]" onClick={() => window.location.reload()}>Close App</Button>
        </div>
      );
    }

    // Main Settings View (iOS Style)
    return (
      <div className="flex flex-col h-full bg-[#F7F5EF] pb-24">
        <header className="bg-[#F7F5EF] border-b border-primary/10 sticky top-0 z-40">
          <AwningBand />
          <div className="px-4 h-14 flex items-center">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Account</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
           {/* Profile Header */}
           <div className="flex items-center gap-4 px-4 py-6 mb-2">
             <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop" className="object-cover w-full h-full" alt="Profile" />
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Camera className="w-3 h-3 text-blue-500" />
                </button>
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-900">Jane Doe</h2>
               <p className="text-gray-500 text-sm">jane.doe@example.com</p>
               <Button variant="link" className="h-auto p-0 text-[#006241] text-sm mt-1">Edit Profile</Button>
             </div>
           </div>

           <IOSListGroup title="Preferences">
              <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center text-white"><Bell className="w-4 h-4" /></div>
                   <span className="text-[15px] font-medium text-slate-900">Notifications</span>
                </div>
                <Switch 
                  checked={permissions.notifications === 'granted'} 
                  onCheckedChange={() => handlePermissionToggle('notifications')}
                />
              </div>
              <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center text-white"><ShieldCheck className="w-4 h-4" /></div>
                   <span className="text-[15px] font-medium text-slate-900">Face ID</span>
                </div>
                <Switch 
                   checked={permissions.biometrics === 'granted'} 
                   onCheckedChange={() => handlePermissionToggle('biometrics')}
                />
              </div>
              <IOSListRow 
                 icon={Globe} 
                 label="Language" 
                 value="English (UK)" 
                 onClick={() => {}}
                 hasChevron={true}
              />
           </IOSListGroup>

           <IOSListGroup title="Support">
             <IOSListRow icon={HelpCircle} label="Help Center" onClick={() => navigateTo('tickets')} hasChevron={true} />
             <IOSListRow icon={MessageSquare} label="Contact Us" onClick={() => {navigateTo('tickets'); setSupportView('contact-form')}} hasChevron={true} />
           </IOSListGroup>

           <IOSListGroup title="Legal">
             <IOSListRow icon={FileText} label="Terms of Service" onClick={() => setSettingsView('legal-terms')} hasChevron={true} />
             <IOSListRow icon={Shield} label="Privacy Policy" onClick={() => setSettingsView('legal-privacy')} hasChevron={true} />
             <IOSListRow icon={CheckCircle2} label="Consent History" onClick={() => setSettingsView('legal-consent')} hasChevron={true} value="v2.1" />
           </IOSListGroup>

           <div className="mx-4 mb-8">
             <Button 
               variant="outline" 
               className="w-full bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100 h-12 text-[15px] font-medium shadow-sm"
               onClick={() => setSettingsView('delete-confirm')}
             >
               Delete Account
             </Button>
             <div className="mt-6 text-center">
               <p className="text-xs text-gray-400">Version 2.4.0 (Build 892)</p>
               <p className="text-[10px] text-gray-300 mt-1">© 2024 QrStore Inc.</p>
             </div>
           </div>
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 relative font-sans text-slate-900">
      <GuidedTour 
        steps={clientTourSteps} 
        isVisible={tourVisible} 
        onComplete={() => setTourVisible(false)} 
      />
      {/* Pre-Prompt Bottom Sheet */}
      <PrePromptSheet 
        type={activePrePrompt} 
        isOpen={!!activePrePrompt} 
        onClose={() => setActivePrePrompt(null)} 
        onAllow={handlePrePromptAllow} 
      />

      {/* Tab Content */}
      <div className="h-screen w-full">
        {activeTab === 'pay' && renderPayTab()}
        {activeTab === 'receipts' && renderReceiptsTab()}
        {activeTab === 'tickets' && renderTicketsTab()}
        {activeTab === 'account' && renderAccountTab()}
      </div>

      {/* Bottom Nav */}
      {(
        (activeTab === 'pay' && payView === 'dashboard') ||
        (activeTab === 'receipts' && receiptsView === 'list') ||
        (activeTab === 'tickets' && supportView === 'home') ||
        (activeTab === 'account' && settingsView === 'main')
      ) && (
         <BottomNav activeTab={activeTab} onTabChange={navigateTo} />
      )}
    </div>
  );
}
