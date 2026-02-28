import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, CreditCard, Coffee, ShieldCheck, Download, Mail, Share, 
  Wallet, Loader2, ArrowRight, Star, QrCode 
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { cn } from "../../components/ui/utils";

// Mock order data matching the demo page
const DEMO_ORDER = {
  id: "demo-order-123",
  merchant: {
    name: "Bella's Coffee",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
    verified: true,
  },
  items: [
    { name: "Oat Milk Flat White", quantity: 2, price: "4.50" },
    { name: "Blueberry Muffin", quantity: 1, price: "5.20" },
  ],
  total: "14.20",
  currency: "EUR",
};

export function HowItWorks() {
  const [demoState, setDemoState] = useState<"checkout" | "processing" | "success">("checkout");

  const handleDemoPay = () => {
    setDemoState("processing");
    setTimeout(() => {
      setDemoState("success");
    }, 1500);
  };

  const resetDemo = () => {
    setDemoState("checkout");
  };

  return (
    <section id="how-it-works" className="w-full bg-[#F7F5EF] py-24 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Get paid in 3 simple steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            We removed the friction. No clunky card readers, no pairing devices, no downloading apps. Just scan and pay.
          </p>
        </div>

        {/* The Duplicated Checkout Demo Section */}
        <div className="max-w-md mx-auto relative">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-gray-950 aspect-[9/19] flex flex-col relative z-10">
            <AnimatePresence mode="wait">
              {demoState === "checkout" || demoState === "processing" ? (
                <motion.div 
                  key="checkout-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col bg-[#F7F5EF]"
                >
                  {/* Header */}
                  <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Checkout</span>
                    <div className="w-8 h-8" />
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Merchant Trust */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                        <img src={DEMO_ORDER.merchant.logo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-gray-900">{DEMO_ORDER.merchant.name}</p>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#006241] fill-[#006241]/10" />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Merchant</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Order Summary</h3>
                      {DEMO_ORDER.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-bold">
                          <span className="text-gray-500">{item.quantity}x {item.name}</span>
                          <span className="text-gray-900">€{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="h-px bg-gray-50 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-400">Total</span>
                        <span className="text-2xl font-black text-gray-900">€{DEMO_ORDER.total}</span>
                      </div>
                    </div>

                    {/* Payment Selection */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl border-2 border-[#006241] bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-xl text-white flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-sm">Apple Pay</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#006241] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-gray-200 bg-white/50 flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl text-gray-400 flex items-center justify-center">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-sm">Credit Card</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Button Area */}
                  <div className="p-6 bg-gradient-to-t from-[#F7F5EF] to-transparent relative">
                    {/* Prompt Box */}
                    <AnimatePresence>
                      {demoState === "checkout" && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 z-50 whitespace-nowrap"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#006241] animate-ping" />
                          <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Try to press the button</span>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button 
                      className="w-full h-14 rounded-2xl bg-[#006241] hover:bg-[#005035] font-bold text-white shadow-xl shadow-[#006241]/20 relative active:scale-95 transition-transform"
                      onClick={handleDemoPay}
                      disabled={demoState === "processing"}
                    >
                      {demoState === "processing" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <div className="flex items-center justify-between w-full px-2">
                          <span>Pay Now</span>
                          <span className="font-mono">€{DEMO_ORDER.total}</span>
                        </div>
                      )}
                    </Button>

                    <div className="flex justify-center items-center gap-1.5 mt-4 opacity-40">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#006241]" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-900">Secure Verification Active</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="success-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col bg-white items-center pt-8 px-6"
                >
                  <div className="w-16 h-16 bg-[#006241] rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-[#006241]/20 relative z-30">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-black mb-1 text-gray-900 relative z-30">Paid</h1>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-4 relative z-30">Verified Code: <span className="text-[#006241]">892</span></p>

                  {/* High-Fidelity Ripped Receipt Animation */}
                  <div className="w-full relative mb-6">
                    {/* Receipt Slot */}
                    <div className="w-full h-6 bg-gray-900 rounded-full shadow-inner relative z-30 ring-4 ring-white flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-800" />
                    </div>

                    <div className="relative w-[92%] mx-auto -mt-3 z-20 overflow-hidden">
                      <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full bg-gray-50 shadow-2xl border-none rounded-b-xl relative px-5 py-6"
                      >
                        <div className="flex justify-between items-start mb-4 border-b border-gray-200/50 pb-3">
                          <div>
                            <h2 className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#006241] mb-0.5">Merchant</h2>
                            <p className="text-[10px] font-bold text-gray-900 leading-none">{DEMO_ORDER.merchant.name}</p>
                          </div>
                          <div className="text-right">
                            <h2 className="text-[7px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-0.5">Amount</h2>
                            <p className="text-[10px] font-bold text-gray-900 leading-none">€ {DEMO_ORDER.total}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 mb-4">
                          {DEMO_ORDER.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-[8px] font-medium text-gray-500">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-mono font-bold text-gray-700">€ {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col items-center pt-3 border-t border-dashed border-gray-300">
                          <div className="flex items-center gap-1 mb-1">
                            <ShieldCheck className="w-2.5 h-2.5 text-[#006241]" />
                            <span className="text-[6px] font-bold uppercase tracking-widest text-[#006241]">Encrypted Payment</span>
                          </div>
                          <p className="text-[6px] text-gray-400 font-mono">ID: QR-8922-CC</p>
                        </div>

                        {/* Zigzag Bottom Edge */}
                        <div className="absolute -bottom-1 left-0 w-full h-2 bg-transparent pointer-events-none" 
                             style={{
                               background: 'linear-gradient(45deg, transparent 75%, #F9FAFB 75%), linear-gradient(-45deg, transparent 75%, #F9FAFB 75%)',
                               backgroundSize: '8px 8px',
                               backgroundPosition: '0 0, 0 4px'
                             }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Actions (Delayed fade in) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="w-full space-y-6"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-square bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center p-2 hover:bg-white transition-colors cursor-pointer group">
                        <Download className="w-4 h-4 text-[#006241] mb-1 group-hover:-translate-y-0.5 transition-transform" />
                        <span className="text-[7px] font-bold uppercase">Invoice</span>
                      </div>
                      <div className="aspect-square bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center p-2 hover:bg-white transition-colors cursor-pointer group">
                        <Mail className="w-4 h-4 text-[#006241] mb-1 group-hover:-translate-y-0.5 transition-transform" />
                        <span className="text-[7px] font-bold uppercase">Email</span>
                      </div>
                      <div className="aspect-square bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center p-2 hover:bg-white transition-colors cursor-pointer group">
                        <Share className="w-4 h-4 text-[#006241] mb-1 group-hover:-translate-y-0.5 transition-transform" />
                        <span className="text-[7px] font-bold uppercase">Share</span>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full h-12 rounded-xl bg-[#006241] text-white font-bold text-base shadow-xl shadow-[#006241]/20"
                      onClick={resetDemo}
                    >
                      Done
                    </Button>
                  </motion.div>
                </motion.div>

              )}
            </AnimatePresence>
          </div>

          {/* Decorative Background for the frame */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[120%] bg-[#006241]/5 rounded-full blur-[120px] -z-10" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-100/50 rounded-full blur-[80px] -z-10 animate-pulse" />
        </div>
      </div>
    </section>
  );
}


