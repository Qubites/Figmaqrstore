import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { CheckoutHeader } from "../components/qrstore/headers";
import { TrustLayer } from "../components/qrstore/trust-badges";
import { RiskBadge } from "../components/qrstore/status-chips";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  CheckCircle2, CreditCard, ChevronLeft, Wallet, Loader2, 
  Coffee, Ticket, Star, ShieldCheck, Download, Mail, Share
} from "lucide-react";
import { useSoundEffects } from "../hooks/use-sound-effects";
import { SuccessAnimation } from "../components/ui/success-animation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../components/ui/utils";

// Mock order data
const MOCK_ORDER = {
  id: "demo-order-123",
  merchant: {
    name: "Bella's Coffee",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
    verified: true,
    salesCount: 245,
    city: "Amsterdam",
  },
  items: [
    { name: "Oat Milk Flat White", quantity: 2, price: "4.50" },
    { name: "Blueberry Muffin", quantity: 1, price: "3.50" },
  ],
  subtotal: "12.50",
  vat: "1.70",
  total: "14.20",
  currency: "EUR",
  risk: "safe" as const,
};

export default function ClientCheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "google_pay">("apple_pay");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { playSuccess, playClick } = useSoundEffects();

  const handlePay = () => {
    playClick();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      playSuccess();
    }, 1800);
  };

  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen bg-background flex flex-col items-center justify-start pt-8 p-6 overflow-y-auto"
      >
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center relative z-20 w-full max-w-sm pb-10"
        >
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
             <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-foreground">Paid</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-8">Verified Code: <span className="text-primary font-mono text-sm">892</span></p>

          {/* Compact Client Receipt */}
          <div className="w-full relative mb-8">
             <div className="w-full h-8 bg-gray-900 rounded-full shadow-inner relative z-30 ring-4 ring-background flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-800" />
             </div>

             <div className="relative w-[90%] mx-auto -mt-4 z-20 overflow-hidden">
                <motion.div
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-card shadow-2xl border-none rounded-b-3xl relative px-6 py-8"
                >
                   <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-4">
                      <div>
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Merchant</h2>
                        <p className="text-sm font-bold text-foreground leading-none">{MOCK_ORDER.merchant.name}</p>
                      </div>
                      <div className="text-right">
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Amount</h2>
                        <p className="text-sm font-bold text-foreground leading-none">{MOCK_ORDER.currency} {MOCK_ORDER.total}</p>
                      </div>
                   </div>

                   <div className="space-y-2 mb-6">
                      {MOCK_ORDER.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs font-medium text-muted-foreground">
                           <span>{item.quantity}x {item.name}</span>
                           <span className="font-mono font-semibold">€ {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                   </div>

                   <div className="flex flex-col items-center pt-4 border-t border-dashed border-border">
                      <div className="flex items-center gap-1.5 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Encrypted Payment</span>
                      </div>
                      <p className="text-[8px] text-muted-foreground font-mono">ID: QR-8922-CC</p>
                   </div>


                   {/* Zigzag Bottom Edge */}
                   <div className="absolute -bottom-1.5 left-0 w-full h-3 bg-transparent pointer-events-none" 
                        style={{
                          background: 'linear-gradient(45deg, transparent 75%, white 75%), linear-gradient(-45deg, transparent 75%, white 75%)',
                          backgroundSize: '10px 10px',
                          backgroundPosition: '0 0, 0 5px'
                        }}
                   />
                </motion.div>
             </div>
          </div>

          {/* Quick Actions & Rating - NEW SECTION */}
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-backwards">
            
            {/* Merchant Rating */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-sm flex flex-col items-center">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Rate {MOCK_ORDER.merchant.name}</span>
               <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} className="hover:scale-110 transition-transform active:scale-95 p-1">
                      <Star className="w-7 h-7 text-gray-200 hover:text-amber-400 fill-current transition-colors" />
                    </button>
                  ))}
               </div>
            </div>

            {/* Receipt Actions */}
            <div className="grid grid-cols-3 gap-3">
               <button className="flex flex-col items-center justify-center py-4 px-2 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all group">
                  <Download className="w-5 h-5 text-[#006241] mb-2 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Invoice</span>
               </button>
               <button className="flex flex-col items-center justify-center py-4 px-2 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all group">
                  <Mail className="w-5 h-5 text-[#006241] mb-2 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Email</span>
               </button>
               <button className="flex flex-col items-center justify-center py-4 px-2 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all group">
                  <Share className="w-5 h-5 text-[#006241] mb-2 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Share</span>
               </button>
            </div>

            <div className="pt-2">
              <Link to="/" className="block">
                <Button size="lg" className="w-full h-14 rounded-2xl bg-[#006241] hover:bg-[#00754A] shadow-2xl shadow-[#006241]/20 text-lg font-bold">
                  Done
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-36">
      <CheckoutHeader 
        onBackClick={() => navigate(-1)}
        title="Checkout"
        className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100"
      />

      <main className="container mx-auto px-6 py-8 max-w-md space-y-10">
        
        {/* Merchant Trust Section */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Coffee className="w-24 h-24" />
          </div>
          <TrustLayer
            merchantName={MOCK_ORDER.merchant.name}
            merchantLogo={MOCK_ORDER.merchant.logo}
            verified={MOCK_ORDER.merchant.verified}
            salesCount={MOCK_ORDER.merchant.salesCount}
            className="p-0 border-none bg-transparent"
          />
        </div>

        {/* Order Items */}
        <section className="space-y-6">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] px-2">Order Summary</h2>
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
            {MOCK_ORDER.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-900 border border-gray-100">
                    {item.quantity}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.name}</span>
                </div>
                <span className="font-mono text-sm font-bold text-[#006241]">
                  € {(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            
            <div className="h-[1px] w-full bg-gray-50 my-2" />
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-2xl font-bold tracking-tight text-gray-900">{MOCK_ORDER.currency} {MOCK_ORDER.total}</span>
            </div>
          </div>
        </section>

        {/* Payment Selection */}
        <section className="space-y-6">
           <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] px-2">Secure Payment</h2>
           
           <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setPaymentMethod("apple_pay")}
                className={cn(
                  "flex items-center justify-between p-5 rounded-3xl border transition-all active:scale-[0.98]",
                  paymentMethod === "apple_pay" 
                    ? "border-[#006241] bg-white ring-4 ring-[#006241]/5 shadow-sm" 
                    : "border-gray-100 bg-white/50 hover:bg-white hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-950 text-white flex items-center justify-center shadow-lg">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-900">Apple Pay</span>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  paymentMethod === "apple_pay" ? "bg-[#006241] border-[#006241]" : "border-gray-200"
                )}>
                  {paymentMethod === "apple_pay" && <CheckCircle2 className="w-3.3 h-3.3 text-white" />}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex items-center justify-between p-5 rounded-3xl border transition-all active:scale-[0.98]",
                  paymentMethod === "card" 
                    ? "border-[#006241] bg-white ring-4 ring-[#006241]/5 shadow-sm" 
                    : "border-gray-100 bg-white/50 hover:bg-white hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-900">Credit Card</span>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  paymentMethod === "card" ? "bg-[#006241] border-[#006241]" : "border-gray-200"
                )}>
                  {paymentMethod === "card" && <CheckCircle2 className="w-3.3 h-3.3 text-white" />}
                </div>
              </button>
           </div>
        </section>

        {/* Card Form */}
        <AnimatePresence>
          {paymentMethod === "card" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 pt-2 overflow-hidden"
            >
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="card-number" className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Card Number</Label>
                  <Input id="card-number" placeholder="•••• •••• •••• ••••" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-lg font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc" className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">CVC</Label>
                    <Input id="cvc" placeholder="•••" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-mono" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Floating Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-50">
        <div className="container mx-auto max-w-md">
          <Button 
            size="lg" 
            className="w-full h-16 rounded-full text-lg font-bold shadow-2xl shadow-primary/30 transition-all active:scale-[0.97] bg-primary hover:bg-primary/90 text-primary-foreground relative" 
            onClick={handlePay}
            disabled={isProcessing}
          >
             {isProcessing ? (
               <Loader2 className="w-6 h-6 animate-spin" />
             ) : (
               <div className="flex items-center justify-between w-full px-4">
                 <span>Authorize</span>
                 <span className="font-mono text-xl opacity-90">€ {MOCK_ORDER.total}</span>
               </div>
             )}
          </Button>
          <div className="flex justify-center items-center gap-2 mt-4">
             <RiskBadge risk={MOCK_ORDER.risk} className="scale-75" />
             <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Secure Verification Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
