import React, { useState, useEffect, useRef } from "react";
import { SellerHeader } from "../components/qrstore/headers";
import { PriceInput } from "../components/qrstore/price-input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  Plus, QrCode, History, User, LogOut, CheckCircle2, 
  Copy, XCircle, Share, Clock, ChevronRight, AlertCircle,
  ExternalLink, Ban, ShoppingBasket, Minus, Trash2, Settings,
  Camera, Bell, FileText, Shield, Smartphone, Lock, AlertTriangle, 
  Image as ImageIcon, Star, MessageSquare, Volume2, Coffee,
  Ticket, Printer, ChevronLeft, LayoutGrid, Croissant, GlassWater,
  Download, Mail, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../components/ui/utils";
import { GuidedTour, TourStep } from "../components/GuidedTour";

// Bank Logo Component for Terminal
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
  };

  return (
    <div className={cn("bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm", sizeClasses[size])}>
      <ImageWithFallback 
        src={logos[type] || logos.nordea} 
        alt={type} 
        className="w-full h-full object-cover grayscale"
      />
    </div>
  );
};

// Rating Type
interface Rating {
  id: string;
  user: string;
  rating: number;
  comment?: string;
  date: Date;
  amount: string;
}

const MOCK_RATINGS: Rating[] = [
  { id: "r1", user: "Jane Doe", rating: 5, comment: "Best Flat White in town! Fast payment too.", date: new Date(Date.now() - 3600000 * 2), amount: "4.50" },
  { id: "r2", user: "John Smith", rating: 4, comment: "Cool aesthetic, love the receipt animation.", date: new Date(Date.now() - 3600000 * 24), amount: "12.80" },
  { id: "r3", user: "Guest User", rating: 5, date: new Date(Date.now() - 3600000 * 48), amount: "8.20" },
  { id: "r4", user: "Alice Wonderland", rating: 3, comment: "A bit loud, but coffee was great.", date: new Date(Date.now() - 3600000 * 72), amount: "5.50" },
];

// Types
type SessionStatus = 'created' | 'opened' | 'paying' | 'paid' | 'expired' | 'cancelled';
type ViewState = 'main' | 'qr' | 'success' | 'expired' | 'detail' | 'settings' | 'settings-policy' | 'settings-privacy' | 'sign-out-confirm' | 'signed-out';
type PermissionState = 'granted' | 'denied' | 'restricted' | 'notDetermined';
type PermissionType = 'camera' | 'biometrics' | 'notifications';

interface Session {
  id: string;
  amount: string;
  currency: string;
  status: SessionStatus;
  code: string;
  timestamp: Date;
  timeline: { status: SessionStatus; time: Date }[];
  items?: string;
}

interface BasketItem {
  id: string;
  name: string;
  price: string;
  qty: number;
  image?: string;
}

const CATEGORIES = [
  { id: "all", name: "All", icon: LayoutGrid },
  { id: "coffee", name: "Coffee", icon: Coffee },
  { id: "pastry", name: "Pastry", icon: Croissant },
  { id: "drinks", name: "Drinks", icon: GlassWater },
];

const QUICK_ITEMS = [
  { id: "item_1", name: "Oat Milk Flat White", price: "4.50", category: "coffee", image: "https://images.unsplash.com/photo-1621658536568-0e7bef759f14?q=80&w=1080" },
  { id: "item_2", name: "Pain au Chocolat", price: "3.20", category: "pastry", image: "https://images.unsplash.com/photo-1589007797526-ed40d157365d?q=80&w=1080" },
  { id: "item_3", name: "Avocado Sourdough", price: "9.50", category: "pastry", image: "https://images.unsplash.com/photo-1662375716007-3d61760d6977?q=80&w=1080" },
  { id: "item_4", name: "Iced Matcha Latte", price: "5.20", category: "drinks", image: "https://images.unsplash.com/photo-1765162007672-54ccd9b0e54b?q=80&w=1080" },
  { id: "item_5", name: "Double Espresso", price: "2.80", category: "coffee", image: "https://images.unsplash.com/photo-1610920051820-cb947e1c75da?q=80&w=1080" },
  { id: "item_6", name: "Blueberry Muffin", price: "3.50", category: "pastry", image: "https://images.unsplash.com/photo-1767634480773-37e4b962fa1d?q=80&w=1080" }
];

// Components

function StatusChip({ status }: { status: SessionStatus }) {
  const styles = {
    created: "bg-gray-100 text-gray-700 border-gray-200",
    opened: "bg-blue-50 text-blue-700 border-blue-200",
    paying: "bg-orange-50 text-orange-700 border-orange-200 animate-pulse",
    paid: "bg-[#006241]/10 text-[#006241] border-[#006241]/20",
    expired: "bg-gray-100 text-gray-500 border-gray-200",
    cancelled: "bg-red-50 text-red-700 border-red-200"
  };

  const labels = {
    created: "READY TO SCAN",
    opened: "SCANNED",
    paying: "PAYING...",
    paid: "PAID",
    expired: "EXPIRED",
    cancelled: "CANCELLED"
  };

  return (
    <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-widest", styles[status])}>
      {labels[status]}
    </div>
  );
}

function TimelineRow({ timeline }: { timeline: { status: SessionStatus; time: Date }[] }) {
  if (!timeline || timeline.length === 0) return null;
  
  const latest = timeline[timeline.length - 1];
  
  return (
    <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mt-2">
      <Clock className="w-3 h-3" />
      <span>{latest.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      <span>•</span>
      <span className="font-bold">{latest.status}</span>
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
    <div className="p-4 flex items-center justify-between bg-white first:rounded-t-3xl last:rounded-b-3xl border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className={cn("w-5 h-5", state === 'granted' ? "text-[#006241]" : "text-gray-400")} />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{title}</span>
          <span className={cn("text-[10px]", 
            state === 'granted' ? "text-[#006241] font-medium" : 
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
          <Button variant="outline" size="sm" className="h-7 text-xs px-3 rounded-full" onClick={() => alert("Opened iOS Settings")}>
            Open
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
      desc: "Allow camera access to scan customer QR codes. Essential for rapid checkout.",
    },
    biometrics: {
      icon: Lock,
      title: "Face ID Protection",
      desc: "Use biometrics to lock the terminal when you step away from the counter.",
    },
    notifications: {
      icon: Bell,
      title: "Payout Alerts",
      desc: "Get notified when funds are deposited into your store's bank account.",
    }
  }[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white w-full max-w-md rounded-t-[2.5rem] p-8 pb-10 shadow-2xl"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" onClick={onClose} />
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-[#006241]/5 rounded-full flex items-center justify-center">
            <content.icon className="w-10 h-10 text-[#006241]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">{content.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{content.desc}</p>
          </div>
        </div>
        <div className="mt-10 space-y-4">
          <Button size="lg" className="w-full h-14 rounded-full bg-[#006241] hover:bg-[#00754A] text-white shadow-lg shadow-[#006241]/20" onClick={onAllow}>Continue</Button>
          <Button variant="ghost" className="w-full h-12 rounded-full text-muted-foreground hover:bg-neutral-100" onClick={onClose}>Maybe Later</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SellerAppPage() {
  // Tour State
  const [tourVisible, setTourVisible] = useState(true);
  const sellerTourSteps: TourStep[] = [
    {
      targetId: "new-sale-btn",
      title: "Create your first product",
      body: "Add photos, price, and inventory. Your first listing is just seconds away.",
      buttonText: "Next",
      placement: "top"
    },
    {
      targetId: "payout-settings",
      title: "Get paid",
      body: "Add your payout details to receive earnings directly to your bank account.",
      buttonText: "Next",
      placement: "bottom"
    },
    {
      targetId: "history-tab",
      title: "Fulfill orders here",
      body: "Track status and manage delivery in real-time from this menu.",
      buttonText: "Got it",
      placement: "top"
    }
  ];

  // State
  const [activeTab, setActiveTab] = useState("new-sale");
  const [saleMode, setSaleMode] = useState("quick-items"); 
  const [amount, setAmount] = useState("");
  const [productName, setProductName] = useState("");
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
  // Settings State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [permissions, setPermissions] = useState<Record<PermissionType, PermissionState>>({
    camera: 'granted',
    biometrics: 'notDetermined',
    notifications: 'granted'
  });
  const [activePrePrompt, setActivePrePrompt] = useState<PermissionType | null>(null);

  const [history, setHistory] = useState<Session[]>([
    {
      id: "sess_123",
      amount: "14.20",
      currency: "EUR",
      status: "paid",
      code: "892",
      timestamp: new Date(Date.now() - 3600000),
      timeline: [{ status: 'paid', time: new Date(Date.now() - 3600000) }],
      items: "2x Oat Milk Flat White, 1x Blueberry Muffin"
    },
    {
      id: "sess_124",
      amount: "4.50",
      currency: "EUR",
      status: "cancelled",
      code: "415",
      timestamp: new Date(Date.now() - 7200000),
      timeline: [{ status: 'cancelled', time: new Date(Date.now() - 7200000) }],
      items: "Iced Matcha Latte"
    },
    {
      id: "sess_125",
      amount: "9.50",
      currency: "EUR",
      status: "paid",
      code: "228",
      timestamp: new Date(Date.now() - 14400000),
      timeline: [{ status: 'paid', time: new Date(Date.now() - 14400000) }],
      items: "Avocado Sourdough"
    }
  ]);

  // Basket logic
  const basketTotal = basket.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0).toFixed(2);
  const basketCount = basket.reduce((sum, item) => sum + item.qty, 0);

  const addToBasket = (item: typeof QUICK_ITEMS[0]) => {
    setBasket(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateBasketQty = (id: string, delta: number) => {
    setBasket(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const clearBasket = () => setBasket([]);

  // Actions
  const handleCreateSale = () => {
    let finalAmount = "0.00";
    let itemsDescription = "Custom Amount";

    if (saleMode === 'quick-amount') {
      finalAmount = amount;
      itemsDescription = productName || "Custom Sale";
    } else {
      finalAmount = basketTotal;
      itemsDescription = basket.map(i => `${i.qty}x ${i.name}`).join(", ");
    }

    if (parseFloat(finalAmount) <= 0) return;

    const newSession: Session = {
      id: `sess_${Date.now()}`,
      amount: finalAmount,
      currency: "EUR",
      status: 'created',
      code: Math.floor(100 + Math.random() * 900).toString(), // 3-digit code
      timestamp: new Date(),
      timeline: [{ status: 'created', time: new Date() }],
      items: itemsDescription
    };
    
    setCurrentSession(newSession);
    setCurrentView('qr');
    simulateSessionFlow(newSession);
  };

  const simulateSessionFlow = (session: Session) => {
    setTimeout(() => {
      updateSessionStatus(session.id, 'opened');
      setTimeout(() => {
        updateSessionStatus(session.id, 'paying');
        setTimeout(() => {
          updateSessionStatus(session.id, 'paid');
        }, 3000);
      }, 2000);
    }, 2000);
  };

  const updateSessionStatus = (id: string, status: SessionStatus) => {
    setCurrentSession(prev => {
      if (prev && prev.id === id) {
        return {
          ...prev,
          status,
          timeline: [...prev.timeline, { status, time: new Date() }]
        };
      }
      return prev;
    });
  };

  // Audio Helper
  const playMerchantSuccessSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Realistic "Cash Register" Sound (Ka-ching!)
      const playPart = (freq: number, startTime: number, duration: number, volume: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Part 1: The 'Ka' (Quick high-frequency chirp)
      playPart(2000, now, 0.05, 0.1);
      // Part 2: The 'Ching' (Resonant metallic bell)
      playPart(880, now + 0.05, 0.6, 0.15);
      playPart(1320, now + 0.07, 0.4, 0.08); // Harmonic
      
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  useEffect(() => {
    if (currentSession?.status === 'paid' && currentView === 'qr') {
       playMerchantSuccessSound();
       setCurrentView('success');
       setHistory(prev => [currentSession!, ...prev]);
       setAmount("");
       setBasket([]);
    }
  }, [currentSession?.status, currentView]);

  const handleAcknowledge = () => {
    setCurrentSession(null);
    setCurrentView('main');
    setActiveTab('new-sale');
  };

  const handleCancelSession = () => {
    if (currentSession) {
      const updated = { ...currentSession, status: 'cancelled' as SessionStatus };
      setCurrentSession(updated);
      setHistory(prev => [updated, ...prev]);
      setCurrentView('expired');
    }
  };

  const handleViewDetail = (session: Session) => {
    setSelectedSession(session);
    setCurrentView('detail');
  };

  // Filtered Items
  const filteredItems = selectedCategory === "all" 
    ? QUICK_ITEMS 
    : QUICK_ITEMS.filter(i => i.category === selectedCategory);

  // --- Views ---

  // Settings ... (omitted for brevity but kept in final write)

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col relative">
        <AnimatePresence>
          {activePrePrompt && (
            <PrePromptSheet 
              type={activePrePrompt} 
              isOpen={!!activePrePrompt} 
              onClose={() => setActivePrePrompt(null)} 
              onAllow={handlePrePromptAllow} 
            />
          )}
        </AnimatePresence>

        <header className="px-4 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('main')} className="mr-2">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-8 max-w-md mx-auto w-full">
          {/* Device Security */}
          <section className="space-y-3">
            <h3 className="font-bold px-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Settlement</h3>
            <div className="bg-white rounded-3xl border-none ring-1 ring-black/5 overflow-hidden shadow-sm p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <BankLogo type="nordea" size="md" />
                 <div className="flex flex-col">
                   <span className="text-sm font-medium">Nordea Bank</span>
                   <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Active Settlement</span>
                 </div>
               </div>
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold px-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Security</h3>
            <div className="bg-white rounded-3xl border-none ring-1 ring-black/5 overflow-hidden shadow-sm">
               <PermissionRow 
                 icon={Lock} 
                 title="App Lock (Face ID)" 
                 state={permissions.biometrics} 
                 onToggle={() => handlePermissionToggle('biometrics')} 
               />
            </div>
          </section>

          {/* Audio & Alerts */}
          <section className="space-y-3">
            <h3 className="font-bold px-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Preferences</h3>
            <div className="bg-white rounded-3xl border-none ring-1 ring-black/5 overflow-hidden shadow-sm">
               <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className={cn("w-5 h-5", soundEnabled ? "text-[#006241]" : "text-gray-400")} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Payment Sounds</span>
                      <span className="text-[10px] text-muted-foreground">Audio feedback on success</span>
                    </div>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
               </div>
               <PermissionRow 
                 icon={Bell} 
                 title="Push Notifications" 
                 state={permissions.notifications} 
                 onToggle={() => handlePermissionToggle('notifications')} 
               />
            </div>
          </section>

          {/* System */}
          <section className="space-y-3">
            <h3 className="font-bold px-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">System</h3>
            <div className="bg-white rounded-3xl border-none ring-1 ring-black/5 overflow-hidden shadow-sm divide-y divide-gray-50">
               <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setCurrentView('settings-policy')}>
                 <div className="flex items-center gap-3">
                   <FileText className="w-5 h-5 text-gray-400" />
                   <span className="text-sm font-medium">Merchant Policy</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-gray-400" />
               </div>
               <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 text-red-600" onClick={() => setCurrentView('sign-out-confirm')}>
                 <div className="flex items-center gap-3">
                   <LogOut className="w-5 h-5" />
                   <span className="text-sm font-medium">Sign Out Device</span>
                 </div>
               </div>
            </div>
          </section>
          
          <div className="text-center text-[10px] text-muted-foreground pt-4 pb-10 uppercase tracking-widest font-bold">
            QrStore Terminal v2.5.0
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'sign-out-confirm') {
     return (
        <div className="flex flex-col h-full bg-[#F7F5EF] z-[100] fixed inset-0 p-8 items-center justify-center text-center">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
             <LogOut className="w-10 h-10 text-red-500" />
           </div>
           <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Deactivate Terminal?</h2>
           <p className="text-muted-foreground mb-12 max-w-xs leading-relaxed">
             This will sign out this iPad from Bella's Coffee. You'll need an Admin PIN to reconnect.
           </p>
           <div className="w-full space-y-4 max-w-xs">
             <Button variant="destructive" size="lg" className="w-full h-14 rounded-full" onClick={() => setCurrentView('signed-out')}>Confirm Sign Out</Button>
             <Button variant="ghost" className="w-full h-12 rounded-full" onClick={() => setCurrentView('settings')}>Cancel</Button>
           </div>
        </div>
     );
  }

  if (currentView === 'signed-out') {
     return (
        <div className="flex flex-col h-full bg-gray-950 text-white z-[100] fixed inset-0 p-10 items-center justify-center text-center">
           <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10">
              <Smartphone className="w-12 h-12 text-gray-400" />
           </div>
           <h1 className="text-3xl font-bold mb-4 tracking-tight">Terminal Offline</h1>
           <p className="text-gray-400 mb-16 leading-relaxed">
             This device is no longer linked to a merchant account.
           </p>
           <Button className="w-full h-14 rounded-full bg-white text-black hover:bg-gray-200" onClick={() => window.location.reload()}>
             Restart Setup
           </Button>
        </div>
     );
  }

  // QR View ...
  if (currentView === 'qr' && currentSession) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col">
        <SellerHeader 
          title="Terminal 01" 
          className="bg-transparent"
          onSettingsClick={() => setCurrentView('settings')}
        />
        
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-10">
          <div className="text-center space-y-3">
             <StatusChip status={currentSession.status} />
             <TimelineRow timeline={currentSession.timeline} />
          </div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 bg-white shadow-2xl rounded-[2.5rem] border border-gray-100 relative group"
          >
            <div className="w-64 h-64 bg-white border-[12px] border-gray-950 rounded-3xl flex items-center justify-center relative overflow-hidden">
               <QrCode className="w-44 h-44 text-gray-900" />
               
               <AnimatePresence>
                 {currentSession.status === 'paying' && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center"
                   >
                     <div className="flex flex-col items-center">
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                         className="w-12 h-12 border-4 border-[#006241] border-t-transparent rounded-full mb-4"
                       />
                       <span className="font-bold text-[#006241] tracking-widest text-[10px] uppercase">Processing</span>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
          </motion.div>

          <div className="text-center space-y-1">
            <div className="text-5xl font-bold tracking-tight text-gray-900">
              {currentSession.currency} {currentSession.amount}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-bold">Total to collect</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Verification Code</p>
            <div className="text-4xl font-mono tracking-[0.5em] text-[#006241] font-bold">
              {currentSession.code}
            </div>
          </div>

          <div className="w-full max-w-xs space-y-4 pt-6">
             <Button variant="outline" className="w-full h-12 rounded-full bg-white shadow-sm hover:bg-gray-50 border-gray-200" onClick={() => alert("Payment link copied to clipboard")}>
               <Copy className="w-4 h-4 mr-2" />
               Copy Link
             </Button>
             <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={handleCancelSession}>
               Abort Session
             </Button>
          </div>
        </main>
      </div>
    );
  }

  // Success View (Updated with Ratings and Invoice)
  if (currentView === 'success' && currentSession) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-start pt-8 p-6 relative overflow-hidden scroll-smooth">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#006241]/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        
        <main className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center pb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#006241] flex items-center justify-center mb-4 shadow-xl shadow-[#006241]/20">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Success</h1>
          </motion.div>

          {/* Wall-Fitted Receipt Printer Slot */}
          <div className="w-full flex flex-col items-center mb-6">
             <div className="w-full h-8 bg-gray-900 rounded-full shadow-inner relative z-30 ring-4 ring-[#F7F5EF] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-800" />
             </div>

             <div className="relative w-[85%] -mt-4 z-20 px-2 overflow-hidden">
                <motion.div
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] border-x border-b border-gray-100 rounded-b-sm relative pb-6"
                >
                   <div className="p-6 pt-8">
                      <div className="flex flex-col items-center text-center mb-6">
                        <Coffee className="w-6 h-6 text-[#006241] mb-2" />
                        <h2 className="font-bold text-sm tracking-tight uppercase">BELLA'S COFFEE</h2>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-gray-50 pb-3">
                           <div className="flex flex-col">
                              <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Code</span>
                              <span className="text-xl font-mono text-[#006241] font-bold">{currentSession.code}</span>
                           </div>
                           <div className="text-right">
                              <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Total</span>
                              <p className="text-sm font-bold">{currentSession.currency} {currentSession.amount}</p>
                           </div>
                        </div>

                        <div className="space-y-1">
                           <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Items</span>
                           <p className="text-[10px] text-gray-600 line-clamp-1">{currentSession.items}</p>
                        </div>
                      </div>
                   </div>

                   <div className="absolute -bottom-1.5 left-0 w-full h-3 bg-transparent pointer-events-none" 
                        style={{
                          background: 'linear-gradient(45deg, transparent 75%, white 75%), linear-gradient(-45deg, transparent 75%, white 75%)',
                          backgroundSize: '12px 12px',
                          backgroundPosition: '0 0, 0 6px'
                        }}
                   />
                </motion.div>
             </div>
          </div>

          {/* Quick Actions & Info - NEW SECTION */}
          <div className="w-full max-w-xs space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800 fill-mode-backwards">
            
            {/* Rating Section */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm flex flex-col items-center">
               <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Rate Merchant</span>
               <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} className="hover:scale-110 transition-transform active:scale-95">
                      <Star className="w-6 h-6 text-gray-200 hover:text-amber-400 fill-current transition-colors" />
                    </button>
                  ))}
               </div>
            </div>

            {/* Utility Buttons */}
            <div className="grid grid-cols-3 gap-3">
               <button className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                  <Download className="w-4 h-4 text-[#006241] mb-1.5" />
                  <span className="text-[9px] font-bold uppercase tracking-tight">Invoice</span>
               </button>
               <button className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                  <Mail className="w-4 h-4 text-[#006241] mb-1.5" />
                  <span className="text-[9px] font-bold uppercase tracking-tight">Email</span>
               </button>
               <button className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                  <Share className="w-4 h-4 text-[#006241] mb-1.5" />
                  <span className="text-[9px] font-bold uppercase tracking-tight">Share</span>
               </button>
            </div>

            {/* Main Action */}
            <div className="pt-2">
              <Button size="lg" className="w-full h-14 rounded-2xl bg-[#006241] hover:bg-[#00754A] shadow-2xl shadow-[#006241]/20 text-lg font-bold" onClick={handleAcknowledge}>
                New Sale
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Rest of the component (Main Register View) ...

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col">
      <GuidedTour 
        steps={sellerTourSteps} 
        isVisible={tourVisible} 
        onComplete={() => setTourVisible(false)} 
      />
      <SellerHeader 
        title="Bella's Coffee" 
        className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100"
        onSettingsClick={() => setCurrentView('settings')}
      />

      <main className="flex-1 p-4 max-w-md mx-auto w-full pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 p-1 rounded-2xl border border-gray-100 shadow-sm h-14">
            <TabsTrigger value="new-sale" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Sale
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <History className="w-4 h-4 mr-2" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="ratings" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Star className="w-4 h-4 mr-2" />
              Stars
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-sale" className="space-y-6 focus-visible:outline-none">
            <Tabs value={saleMode} onValueChange={setSaleMode} className="w-full">
              <div className="flex items-center justify-center mb-6">
                <TabsList className="bg-gray-100/50 p-1 rounded-full h-10">
                  <TabsTrigger value="quick-items" className="rounded-full px-6 text-xs font-bold uppercase tracking-wider">Items</TabsTrigger>
                  <TabsTrigger value="quick-amount" className="rounded-full px-6 text-xs font-bold uppercase tracking-wider">Amount</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="quick-items" className="space-y-6 focus-visible:outline-none">
                <div className="grid grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      className="flex flex-col items-start p-0 bg-white border border-gray-100 rounded-[2rem] hover:border-[#006241]/30 transition-all text-left shadow-sm active:scale-[0.98] group relative overflow-hidden"
                      onClick={() => addToBasket(item)}
                    >
                      <div className="w-full h-32 relative overflow-hidden">
                        <ImageWithFallback 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-3 left-3">
                           <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-[8px] uppercase tracking-widest h-5">{item.category}</Badge>
                        </div>
                      </div>
                      <div className="p-4 pt-3 flex flex-col w-full">
                        <span className="font-bold text-gray-900 leading-tight mb-1 line-clamp-1 group-hover:text-[#006241]">{item.name}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#006241] font-bold">€ {item.price}</span>
                          <div className="bg-gray-50 p-1 rounded-lg">
                             <Plus className="w-3 h-3 text-gray-400 group-hover:text-[#006241]" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Categories Footer Menu */}
                <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-[#F7F5EF] via-[#F7F5EF] to-transparent z-40">
                  <div className="max-w-md mx-auto">
                    <div className="bg-white/80 backdrop-blur-lg border border-gray-100 rounded-[2rem] p-1 shadow-2xl flex items-center justify-between gap-1 h-16">
                       {CATEGORIES.map((cat) => {
                         const Icon = cat.icon;
                         const active = selectedCategory === cat.id;
                         return (
                           <button
                             key={cat.id}
                             onClick={() => setSelectedCategory(cat.id)}
                             className={cn(
                               "flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[1.75rem] transition-all",
                               active ? "bg-[#006241] text-white shadow-lg shadow-[#006241]/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                             )}
                           >
                             <Icon className={cn("w-4 h-4", active ? "text-white" : "")} />
                             <span className="text-[8px] font-bold uppercase tracking-widest">{cat.name}</span>
                           </button>
                         )
                       })}
                    </div>
                  </div>
                </div>

                {basketCount > 0 && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[calc(448px-32px)] z-50"
                  >
                    <Button 
                      id="new-sale-btn"
                      className="w-full h-16 rounded-3xl bg-[#006241] hover:bg-[#00754A] shadow-2xl shadow-[#006241]/30 flex items-center justify-between px-8 transition-transform active:scale-95 border-4 border-[#F7F5EF]"
                      onClick={handleCreateSale}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold">
                          {basketCount}
                        </div>
                        <span className="font-bold tracking-tight">Checkout</span>
                      </div>
                      <span className="font-mono text-xl">€ {basketTotal}</span>
                    </Button>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="quick-amount" className="space-y-6 focus-visible:outline-none">
                <Card className="p-8 rounded-[2rem] border border-gray-100 shadow-sm bg-white">
                  <PriceInput
                    value={amount}
                    onChange={setAmount}
                    label="CHARGE AMOUNT"
                    placeholder="0.00"
                  />
                  
                  <div className="mt-8 space-y-4">
                     <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Description</label>
                     <input 
                       type="text" 
                       value={productName}
                       onChange={(e) => setProductName(e.target.value)}
                       placeholder="e.g. Catering Deposit"
                       className="flex h-14 w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm focus:bg-white focus:border-[#006241] focus:ring-1 focus:ring-[#006241] transition-all outline-none"
                     />
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-14 rounded-2xl mt-10 bg-[#006241] hover:bg-[#00754A]"
                    disabled={!amount || parseFloat(amount) <= 0}
                    onClick={handleCreateSale}
                  >
                    <QrCode className="w-5 h-5 mr-3" />
                    Create QR Code
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 focus-visible:outline-none">
             {history.map((session) => (
               <div 
                 key={session.id}
                 onClick={() => handleViewDetail(session)}
                 className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between active:bg-gray-50 cursor-pointer shadow-sm"
               >
                 <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border",
                      session.status === 'paid' ? "bg-[#006241]/5 border-[#006241]/10 text-[#006241]" : "bg-red-50 border-red-100 text-red-500"
                    )}>
                       {session.status === 'paid' ? <Ticket className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-lg text-gray-900">€ {session.amount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <span>{session.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span>•</span>
                        <span className="font-mono text-[#006241]">ID {session.code}</span>
                      </div>
                    </div>
                 </div>
                 <ChevronRight className="w-5 h-5 text-gray-300" />
               </div>
             ))}
          </TabsContent>

          <TabsContent value="ratings" className="space-y-6 focus-visible:outline-none">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center">
               <span className="text-6xl font-bold tracking-tighter text-gray-900">4.8</span>
               <div className="flex gap-1 mt-2 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={cn("w-5 h-5 fill-[#006241] text-[#006241]", s === 5 && "opacity-20")} />
                  ))}
               </div>
               <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Based on 124 checkouts</span>
            </div>

            <div className="space-y-4">
              {MOCK_RATINGS.map((review) => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-[#006241]/5 flex items-center justify-center text-xs font-bold text-[#006241]">
                            {review.user.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">{review.user}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Customer</p>
                         </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({length: 5}).map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                        ))}
                      </div>
                   </div>
                   {review.comment && (
                     <p className="text-sm text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                   )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
