import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, RefreshCw, Zap, CheckCircle2, Store, ShoppingBag, QrCode, Smartphone, CreditCard, Camera, Play } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../components/ui/utils";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

type Step = "idle" | "store" | "product" | "generating" | "test_payment" | "complete";

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
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "store" || step === "product") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  useEffect(() => {
    if (step === "store" && !startTime) {
      setStartTime(Date.now());
      timerRef.current = window.setInterval(() => {
        setElapsed((Date.now() - (startTime || Date.now())) / 1000);
      }, 100);
    } else if (step === "generating") {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => setStep("test_payment"), 2000);
    }

    return () => {
      if (timerRef.current && (step === "complete" || step === "idle")) {
        clearInterval(timerRef.current);
      }
    };
  }, [step, startTime]);

  const handleRestart = () => {
    setStep("idle");
    setStartTime(null);
    setElapsed(0);
    setStoreName("");
    setProductName("");
    setProductPrice("");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleStart = () => {
    setStep("store");
    setStartTime(Date.now());
    timerRef.current = window.setInterval(() => {
        setElapsed((Date.now() - (Date.now())) / 1000);
    }, 100);
  };

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeName.trim()) setStep("product");
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName.trim() && productPrice.trim()) setStep("generating");
  };

  const handleSimulatePayment = () => {
      setStep("complete");
  };

  const handleClaimShop = () => {
      navigate(`/signup?store=${encodeURIComponent(storeName)}&product=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}`);
  };

  const progress = Math.min((elapsed / 20) * 100, 100);
  const circleCircumference = 2 * Math.PI * 18;
  const strokeDashoffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className="relative w-full max-w-md mx-auto h-[640px] perspective-1000 group">
      
      <motion.div
        className="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col ring-8 ring-white/20"
        initial={{ rotateY: -5, rotateX: 2 }}
        animate={{ rotateY: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
           <ImageWithFallback 
              src={step === "test_payment" ? IMAGES.phone : IMAGES.bg}
              alt="Background" 
              className={cn(
                  "w-full h-full object-cover transition-all duration-700",
                  step === "test_payment" ? "opacity-100 scale-100" : "opacity-20 blur-sm scale-110",
                  step === "complete" && "opacity-10 blur-md"
              )}
           />
           <div className={cn(
               "absolute inset-0 bg-white/80 backdrop-blur-sm transition-opacity duration-500",
               step === "test_payment" ? "opacity-30" : "opacity-80"
           )} />
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
        <div className="flex-1 relative z-10 px-6 pb-6 flex flex-col items-center justify-center">
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

                {/* STEP 1: STORE */}
                {step === "store" && (
                    <motion.div
                        key="store"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full space-y-6"
                    >
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/50">
                             <ImageWithFallback 
                                src={IMAGES.cafe}
                                alt="Store Preview"
                                className="w-full h-full object-cover"
                             />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                 <Store className="w-10 h-10 text-white opacity-80" />
                             </div>
                             <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md">
                                Your Store
                             </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-900 ml-1">Name your business</label>
                                <div className="relative group">
                                    <Input
                                        ref={inputRef}
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        className="pl-4 h-14 rounded-2xl text-lg border-transparent shadow-lg ring-1 ring-gray-100 focus:border-[#006241] focus:ring-[#006241] bg-white transition-all"
                                        placeholder="e.g. Downtown Coffee"
                                    />
                                </div>
                            </div>
                            <Button type="submit" onClick={(e) => handleStoreSubmit(e)} className="w-full h-14 rounded-2xl bg-black text-white hover:bg-gray-800 font-bold shadow-lg" disabled={!storeName}>
                                Next <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: PRODUCT */}
                {step === "product" && (
                    <motion.div
                        key="product"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full space-y-6"
                    >
                         <div className="flex gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0 border-2 border-dashed border-gray-300">
                                <Camera className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1 space-y-2 py-1">
                                <h3 className="font-bold text-gray-900 leading-tight">What are you selling?</h3>
                                <p className="text-xs text-gray-500">Add your first item to {storeName}.</p>
                            </div>
                         </div>

                        <form onSubmit={handleProductSubmit} className="space-y-4">
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Product Name</label>
                                <Input
                                    ref={inputRef}
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="pl-4 h-14 rounded-2xl text-lg border-transparent shadow-lg ring-1 ring-gray-100 focus:border-[#006241] focus:ring-[#006241] bg-white transition-all"
                                    placeholder="e.g. Latte"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">€</span>
                                    <Input
                                        type="number"
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        className="pl-10 h-14 rounded-2xl text-lg border-transparent shadow-lg ring-1 ring-gray-100 focus:border-[#006241] focus:ring-[#006241] bg-white transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-14 rounded-2xl bg-black text-white hover:bg-gray-800 font-bold shadow-lg mt-2" disabled={!productName || !productPrice}>
                                Launch Store <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </motion.div>
                )}

                {/* GENERATING */}
                {step === "generating" && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center space-y-8 text-center w-full h-full"
                    >
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 bg-white rounded-full shadow-2xl flex items-center justify-center">
                                <ImageWithFallback src={IMAGES.cafe} className="w-full h-full rounded-full object-cover opacity-50" />
                            </div>
                            <div className="absolute inset-0 border-4 border-[#006241] rounded-full border-t-transparent animate-spin z-10"></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <Store className="w-10 h-10 text-[#006241]" />
                            </div>
                        </div>
                        <div className="space-y-2 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm">
                            <p className="font-bold text-gray-900 text-lg">Building {storeName}...</p>
                            <div className="flex flex-col gap-1 text-xs text-gray-500 font-medium">
                                <span className="flex items-center gap-1 justify-center"><CheckCircle2 className="w-3 h-3 text-green-500" /> Generating QR Code</span>
                                <span className="flex items-center gap-1 justify-center opacity-50"><CheckCircle2 className="w-3 h-3" /> Configuring Payment Link</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TEST PAYMENT (QR CODE) */}
                {step === "test_payment" && (
                    <motion.div
                        key="test_payment"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full text-center h-full flex flex-col justify-end pb-8"
                    >
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 space-y-4">
                             <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span className="font-bold text-gray-900 text-sm">{storeName}</span>
                                <span className="font-bold text-gray-900">€{productPrice}</span>
                             </div>
                             
                             <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-inner">
                                <QrCode className="w-full aspect-square text-gray-900" />
                             </div>

                             <button 
                                onClick={handleSimulatePayment}
                                className="w-full py-3 bg-[#006241] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#005035] transition-colors flex items-center justify-center gap-2 animate-pulse"
                            >
                                <Smartphone className="w-4 h-4" /> Tap to Pay
                             </button>
                        </div>
                        
                        <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold mx-auto mb-4">
                            Simulated Customer View
                        </div>
                    </motion.div>
                )}

                {/* COMPLETE (SUCCESS) */}
                {step === "complete" && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-2xl shadow-green-500/30">
                             <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>

                        <div className="space-y-1">
                             <h3 className="text-3xl font-bold text-gray-900">€ {parseFloat(productPrice).toFixed(2)}</h3>
                             <p className="text-gray-500 font-medium">Payment successful</p>
                        </div>

                        {/* Receipt Card */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xl max-w-[280px] mx-auto text-sm rotate-1 transform transition-transform hover:rotate-0">
                            <div className="flex justify-between text-gray-500 mb-2">
                                <span>Item</span>
                                <span>Price</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 border-b border-gray-100 pb-3 mb-3">
                                <span>{productName}</span>
                                <span>€{parseFloat(productPrice).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <CreditCard className="w-3 h-3" /> Visa •• 4242
                                </div>
                                <span className="bg-green-100 text-[#006241] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Paid</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Button 
                                onClick={handleClaimShop}
                                className="w-full h-14 rounded-2xl bg-[#006241] hover:bg-[#005035] font-bold text-lg shadow-xl shadow-[#006241]/20"
                            >
                                Claim Real Money
                            </Button>
                            <button 
                                onClick={handleRestart}
                                className="text-xs text-gray-400 hover:text-gray-600 font-medium flex items-center justify-center gap-2 w-full"
                            >
                                <RefreshCw className="w-3 h-3" /> Start over
                            </button>
                        </div>
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
