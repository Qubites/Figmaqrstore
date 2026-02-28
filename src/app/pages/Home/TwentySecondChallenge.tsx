import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, RefreshCw, Zap, CheckCircle2, Store, ShoppingBag, QrCode, Smartphone, CreditCard, Camera, Play, Receipt, Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../components/ui/utils";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

type Step = "idle" | "store" | "product" | "receipt";

// Preload images to avoid flickering
const IMAGES = {
  bg: "https://images.unsplash.com/photo-1695679872218-69f7d966de48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2FuZGluYXZpYW4lMjBjb2ZmZWUlMjBzaG9wJTIwY291bnRlciUyMGJsdXJyZWR8ZW58MXx8fHwxNzcxODc1NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  phone: "https://images.unsplash.com/photo-1692378532175-b0500ef76be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xkaW5nJTIwaXBob25lJTIwc2Nhbm5pbmclMjBxciUyMGNvZGUlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3MTg3NTUyNXww&ixlib=rb-4.1.0&q=80&w=1080",
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcxODc1NTMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
};

export function TwentySecondChallenge() {
  const [step, setStep] = useState<Step>("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [storeName, setStoreName] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [email, setEmail] = useState("");
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "store" || step === "product") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  useEffect(() => {
    if (step !== "idle" && step !== "receipt" && startTime) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setElapsed((Date.now() - startTime) / 1000);
      }, 50);
    } 

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [step, startTime]);

  // Stop timer when receipt is shown
  useEffect(() => {
    if (step === "receipt" && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [step]);

  const handleRestart = () => {
    setStep("idle");
    setStartTime(null);
    setElapsed(0);
    setStoreName("");
    setProductName("");
    setProductPrice("");
    setEmail("");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleStart = () => {
    const now = Date.now();
    setStartTime(now);
    setElapsed(0);
    setStep("store");
  };

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeName.trim()) setStep("product");
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName.trim() && productPrice.trim()) setStep("receipt");
  };

  const handleActivateShop = (e: React.FormEvent) => {
      e.preventDefault();
      navigate(`/signup?email=${encodeURIComponent(email)}&store=${encodeURIComponent(storeName)}`);
  };

  const progress = Math.min((elapsed / 20) * 100, 100);

  return (
    <div className="relative w-full max-w-md mx-auto h-[640px] [perspective:1000px] group">
      
      <motion.div
        className="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col ring-8 ring-white/20"
        initial={{ rotateY: -5, rotateX: 2 }}
        animate={{ rotateY: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
           <ImageWithFallback 
              src={IMAGES.bg}
              alt="Background" 
              className={cn(
                  "w-full h-full object-cover transition-all duration-700",
                  step !== "idle" ? "opacity-10 blur-md" : "opacity-20 blur-sm scale-110"
              )}
           />
           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-80" />
        </div>

        {/* Header */}
        <div className="relative z-20 flex items-center justify-between p-6 h-20">
            <Badge variant="outline" className={cn(
                "bg-white/90 backdrop-blur-md border-white/20 text-gray-900 rounded-full px-4 py-1.5 font-bold shadow-sm transition-all",
                step !== "idle" && "bg-black text-white border-transparent"
            )}>
                <Zap className={cn("w-3.5 h-3.5 mr-1.5", step !== "idle" ? "fill-yellow-400 text-yellow-400" : "fill-gray-400")} />
                {step === "idle" ? "20s Challenge" : "Speed Run"}
            </Badge>

            {step !== "idle" && (
                <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg">
                     <svg className="w-full h-full transform -rotate-90 p-1">
                        <circle cx="20" cy="20" r="16" stroke="#f3f4f6" strokeWidth="3" fill="transparent" />
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke={elapsed > 20 ? "#ef4444" : "#006241"}
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 16}
                            strokeDashoffset={2 * Math.PI * 16 - (progress / 100) * (2 * Math.PI * 16)}
                            strokeLinecap="round"
                            className="transition-all duration-100 ease-linear"
                        />
                     </svg>
                     <span className={cn(
                        "absolute text-xs font-mono font-bold",
                        elapsed > 20 ? "text-red-500" : "text-[#006241]"
                     )}>
                        {elapsed.toFixed(0)}
                     </span>
                </div>
            )}
        </div>

        {/* Content Area */}
        <div className={cn(
            "flex-1 relative z-10 px-6 pb-6 flex flex-col items-center",
            step === "idle" ? "justify-center" : "justify-start pt-4"
        )}>
            <AnimatePresence mode="wait">
                
                {/* IDLE */}
                {step === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6 w-full"
                    >
                        <div 
                            className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer group mb-2 ring-1 ring-gray-900/5 hover:scale-[1.02] transition-transform duration-300"
                            onClick={handleStart}
                        >
                            <ImageWithFallback 
                                src="https://images.unsplash.com/photo-1595140642396-d9ab28a8687f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGJhcmlzdGElMjBob2xkaW5nJTIwc21hcnRwaG9uZSUyMHBheW1lbnQlMjBzY2FuZGluYXZpYW4lMjBjYWZlfGVufDF8fHx8MTc3MTg3NjA3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Challenge Preview"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                                     <Play className="w-6 h-6 text-white fill-current ml-1" />
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/10">
                                <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span>Live Demo</span>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-left">
                                <p className="text-white text-sm font-bold">Speed Run Challenge</p>
                                <p className="text-white/80 text-xs">Can you set up a store in 20s?</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Accept payments instantly.</h3>
                            <p className="text-gray-600 max-w-[280px] mx-auto text-sm mt-2 font-medium leading-relaxed">
                                Take the 20-second challenge and see how fast you can start selling.
                            </p>
                        </div>

                        <Button 
                            size="lg" 
                            onClick={handleStart}
                            className="w-full h-14 rounded-2xl text-lg font-bold bg-[#006241] hover:bg-[#005035] shadow-xl shadow-[#006241]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Check Eligibility Now
                        </Button>
                    </motion.div>
                )}

                {/* STEPS 1 & 2 MERGED (FORM ON TOP OF PRINTER) */}
                {(step === "store" || step === "product") && (
                    <motion.div
                        key="merged-steps"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full flex flex-col items-center"
                    >
                         {/* Printer Header / Screen */}
                         <div className="w-full bg-gray-50 rounded-[2rem] p-8 border border-gray-200 shadow-xl relative z-40 mb-2">
                             <div className="text-center mb-6">
                                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                     <Store className="w-6 h-6 text-[#006241]" />
                                 </div>
                                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                     Store Registration
                                 </h3>
                             </div>

                             <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Shop Name</label>
                                    <Input
                                        ref={inputRef}
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        className="h-12 rounded-xl text-lg border-gray-100 bg-white focus:border-[#006241] focus:ring-[#006241] shadow-inner"
                                        placeholder="e.g. Nordic Roast"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">First Product</label>
                                    <Input
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        className="h-12 rounded-xl text-lg border-gray-100 bg-white focus:border-[#006241] focus:ring-[#006241] shadow-inner"
                                        placeholder="e.g. Filter Coffee"
                                    />
                                </div>
                                <div className="space-y-1 relative">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Price</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg">€</div>
                                        <Input
                                            type="number"
                                            value={productPrice}
                                            onChange={(e) => setProductPrice(e.target.value)}
                                            className="h-12 rounded-xl text-lg border-gray-200 bg-white focus:border-[#006241] focus:ring-[#006241] shadow-inner pl-8"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 rounded-2xl bg-black text-white hover:bg-gray-800 font-bold shadow-xl mt-2 transition-all active:scale-95" disabled={!storeName || !productName || !productPrice}>
                                    Initialize & Print <Receipt className="w-4 h-4 ml-2" />
                                </Button>
                             </form>
                         </div>

                         {/* Printer Slot (Always visible during steps) */}
                         <div className="w-[94%] h-10 bg-gray-950 rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] relative z-50 ring-4 ring-white flex items-center justify-center overflow-hidden -mt-6">
                            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
                            <div className="w-[90%] h-1 bg-white/5 rounded-full absolute top-1/2 -translate-y-1/2" />
                         </div>
                    </motion.div>
                )}

                {/* STEP 3: RECEIPT (PRINTED FROM SLOT) */}
                {step === "receipt" && (
                    <motion.div
                        key="receipt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center pt-8"
                    >
                         {/* Minimal Printer Top */}
                         <div className="w-[94%] h-12 bg-gray-950 rounded-full shadow-[inset_0_2px_15px_rgba(0,0,0,0.9)] relative z-50 ring-4 ring-white flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
                            <div className="w-full h-[2px] bg-white/5 absolute top-1/2 -translate-y-1/2" />
                         </div>

                         {/* Animated Receipt Paper */}
                         <div className="relative w-[88%] mx-auto -mt-6 z-30 overflow-hidden mb-2">
                            <motion.div
                                initial={{ y: "-100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full bg-white shadow-2xl relative px-5 py-6"
                                style={{
                                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 97.5% 98.5%, 95% 100%, 92.5% 98.5%, 90% 100%, 87.5% 98.5%, 85% 100%, 82.5% 98.5%, 80% 100%, 77.5% 98.5%, 75% 100%, 72.5% 98.5%, 70% 100%, 67.5% 98.5%, 65% 100%, 62.5% 98.5%, 60% 100%, 57.5% 98.5%, 55% 100%, 52.5% 98.5%, 50% 100%, 47.5% 98.5%, 45% 100%, 42.5% 98.5%, 40% 100%, 37.5% 98.5%, 35% 100%, 32.5% 98.5%, 30% 100%, 27.5% 98.5%, 25% 100%, 22.5% 98.5%, 20% 100%, 17.5% 98.5%, 15% 100%, 12.5% 98.5%, 10% 100%, 7.5% 98.5%, 5% 100%, 2.5% 98.5%, 0% 100%)"
                                }}
                            >
                                {/* Receipt Header */}
                                <div className="flex flex-col items-center border-b border-gray-100 pb-3 mb-3 pt-2">
                                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center mb-2 border border-gray-100">
                                        <Store className="w-4 h-4 text-[#006241]" />
                                    </div>
                                    <h3 className="font-bold text-base text-gray-900 mb-0.5">{storeName}</h3>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                                        {new Date().toLocaleDateString('en-GB')} • {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                {/* Receipt Items */}
                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="font-bold text-gray-900">1x {productName}</span>
                                        <span className="font-mono font-bold text-gray-900">€{parseFloat(productPrice).toFixed(2)}</span>
                                    </div>
                                    <div className="h-px border-b border-dashed border-gray-100" />
                                    <div className="flex justify-between items-center pt-0.5">
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Grand Total</span>
                                        <span className="text-xl font-bold text-[#006241] tracking-tighter">€{parseFloat(productPrice).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Payment Status Badge */}
                                <div className="bg-emerald-50 rounded-lg p-2.5 flex items-center justify-between border border-emerald-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[7px] font-bold text-emerald-800 uppercase tracking-widest leading-none">Status</p>
                                            <p className="text-[10px] font-bold text-emerald-900">Paid Instantly</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest leading-none">Method</p>
                                        <p className="text-[9px] font-bold text-gray-600 flex items-center justify-end gap-1">
                                            <CreditCard className="w-2 h-2" /> •••• 4242
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                         </div>

                        {/* Conversion Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                            className="w-full text-center space-y-3 px-2"
                        >
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                                    Your shop is ready.
                                </h2>
                                <p className="text-[11px] text-gray-500 font-medium">
                                    Login with email to have a look inside. <span className="text-[#006241] font-bold">ITS FREE!</span>
                                </p>
                            </div>
                            
                            <form onSubmit={handleActivateShop} className="space-y-2.5">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Mail className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-[#006241] transition-colors" />
                                    </div>
                                    <Input
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-10 rounded-xl pl-10 text-center border-gray-100 bg-white shadow-sm focus:border-[#006241] focus:ring-[#006241] text-sm"
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 rounded-xl bg-[#006241] hover:bg-[#005035] font-bold shadow-lg shadow-[#006241]/10 text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    Enter Your Store Now
                                </Button>
                                <button 
                                    type="button" 
                                    onClick={handleRestart}
                                    className="text-[9px] font-bold text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors"
                                >
                                    Start Over
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Decorative Background Elements */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#006241]/20 rounded-full blur-[80px] -z-10 animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-100/50 rounded-full blur-[60px] -z-10" />
    </div>
  );
}
