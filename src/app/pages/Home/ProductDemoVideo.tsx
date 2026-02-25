import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Smartphone, CheckCircle2, QrCode, Coffee, Loader2, Volume2, Maximize2 } from "lucide-react";
import { cn } from "../../components/ui/utils";

// --- Types ---

type VideoState = "thumbnail" | "playing" | "ended";

interface VideoScene {
  id: string;
  duration: number; // in seconds
  overlayText?: string;
  ScreenComponent: React.FC;
}

// --- Mock Screens for the "Video" ---

const ScreenBaristaInput = () => (
  <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/5 to-transparent z-10" />
    
    {/* Status Bar */}
    <div className="h-12 flex justify-between items-center px-6 pt-2">
      <span className="text-xs font-bold text-gray-900">9:41</span>
      <div className="flex gap-1">
        <div className="w-4 h-2.5 bg-gray-900 rounded-sm" />
      </div>
    </div>

    {/* App Header */}
    <div className="px-6 py-2 flex justify-between items-center">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#006241] rounded-full" />
        </div>
        <span className="font-bold text-gray-900">New Sale</span>
        <div className="w-8 h-8" />
    </div>

    {/* Main Input Area */}
    <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center mb-8">
            <p className="text-gray-400 font-medium mb-1">Enter amount</p>
            <div className="text-6xl font-bold text-gray-900 tracking-tight flex items-start justify-center">
                <span className="text-3xl mt-2 text-gray-300 mr-1">$</span>
                4.50
            </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-[280px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="h-16 flex items-center justify-center text-2xl font-bold text-gray-900 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
                    {num}
                </div>
            ))}
            <div className="h-16 flex items-center justify-center text-2xl font-bold text-gray-900">.</div>
            <div className="h-16 flex items-center justify-center text-2xl font-bold text-gray-900">0</div>
            <div className="h-16 flex items-center justify-center text-gray-900">
                 <CheckCircle2 className="w-8 h-8 text-gray-300" />
            </div>
        </div>
    </div>

    {/* Action Button */}
    <div className="p-6">
        <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="w-full h-14 bg-[#006241] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-[#006241]/20"
        >
            Charge $4.50
        </motion.div>
    </div>
  </div>
);

const ScreenQRCode = () => (
  <div className="w-full h-full bg-[#006241] flex flex-col relative text-white">
     {/* Status Bar */}
    <div className="h-12 flex justify-between items-center px-6 pt-2 opacity-50">
      <span className="text-xs font-bold">9:41</span>
      <div className="flex gap-1">
        <div className="w-4 h-2.5 bg-white rounded-sm" />
      </div>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Coffee className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl">Nordic Roast</h3>
            <p className="text-white/70 text-sm">Scan to pay $4.50</p>
        </motion.div>

        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="bg-white p-6 rounded-[2rem] shadow-2xl"
        >
            <QrCode className="w-48 h-48 text-gray-900" />
        </motion.div>

        <p className="mt-8 text-sm font-medium text-white/50 animate-pulse">Waiting for customer scan...</p>
    </div>
  </div>
);

const ScreenSuccess = () => (
  <div className="w-full h-full bg-white flex flex-col relative items-center justify-center">
    <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8"
    >
        <CheckCircle2 className="w-16 h-16 text-[#006241]" />
    </motion.div>
    
    <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-gray-900 mb-2"
    >
        Paid!
    </motion.h3>
    
    <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 font-medium"
    >
        $4.50 received
    </motion.p>

    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-12 inset-x-8"
    >
        <div className="w-full h-14 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center font-bold text-lg">
            New Sale
        </div>
    </motion.div>
  </div>
);

// --- Component ---

const scenes: VideoScene[] = [
  { id: "input", duration: 2, overlayText: "Barista enters amount", ScreenComponent: ScreenBaristaInput },
  { id: "qr", duration: 3, overlayText: "Customer scans QR code", ScreenComponent: ScreenQRCode },
  { id: "success", duration: 2, overlayText: "Instant confirmation", ScreenComponent: ScreenSuccess },
];

export function ProductDemoVideo() {
  const [videoState, setVideoState] = useState<VideoState>("thumbnail");
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const handlePlay = () => {
    setVideoState("playing");
    setCurrentSceneIndex(0);
    setProgress(0);
    playSequence();
  };

  const playSequence = async () => {
    for (let i = 0; i < scenes.length; i++) {
      setCurrentSceneIndex(i);
      // Simulate progress bar
      const steps = 100;
      const stepTime = (scenes[i].duration * 1000) / steps;
      
      for (let p = 0; p <= steps; p++) {
        setProgress(p);
        await new Promise(r => setTimeout(r, stepTime));
      }
    }
    setVideoState("ended");
  };

  const currentScene = scenes[currentSceneIndex];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                See it in action.
            </h2>
            <p className="text-lg text-gray-600">
                Experience the speed of QrStore in a busy Copenhagen coffee shop. No terminals, no hardware—just phones.
            </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black group">
            
            {/* Video Player Content */}
            <AnimatePresence mode="wait">
                {videoState === "thumbnail" && (
                    <motion.div 
                        key="thumbnail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1699848011190-73a1d429cf5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBtaW5pbWFsaXN0JTIwY29mZmVlJTIwc2hvcCUyMGJhcmlzdGElMjBob2xkaW5nJTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NzE4NzUyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                            alt="Scandinavian Coffee Shop" 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                            <button 
                                onClick={handlePlay}
                                className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-white/30 cursor-pointer"
                            >
                                <Play className="w-10 h-10 text-white fill-current ml-1" />
                            </button>
                            <p className="mt-6 text-white font-medium text-lg">Watch Demo (15s)</p>
                        </div>
                        
                        {/* Overlay text for context */}
                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div>
                                <p className="text-white/60 uppercase text-xs font-bold tracking-widest mb-2">Scenario</p>
                                <h3 className="text-white text-2xl font-bold">Morning Rush in Stockholm</h3>
                            </div>
                            <div className="hidden sm:flex gap-2 text-white/80 text-sm">
                                <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">No Terminals</span>
                                <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">Instant Setup</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {(videoState === "playing" || videoState === "ended") && (
                    <motion.div 
                        key="player"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gray-900 flex"
                    >
                        {/* Left Side: The "Real World" Context (blurred background of the cafe) */}
                        <div className="w-1/2 h-full relative overflow-hidden hidden md:block">
                            <img 
                                src="https://images.unsplash.com/photo-1699848011190-73a1d429cf5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBtaW5pbWFsaXN0JTIwY29mZmVlJTIwc2hvcCUyMGJhcmlzdGElMjBob2xkaW5nJTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NzE4NzUyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                                className="w-full h-full object-cover opacity-40 blur-sm"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSceneIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10"
                                    >
                                        <h3 className="text-white text-2xl font-bold mb-2">
                                            {currentScene.overlayText}
                                        </h3>
                                        <p className="text-white/60">
                                            {currentSceneIndex === 0 && "Barista inputs the order total."}
                                            {currentSceneIndex === 1 && "Customer scans the code instantly."}
                                            {currentSceneIndex === 2 && "Payment confirmed. Coffee served."}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Side: The Phone UI Focus */}
                        <div className="flex-1 bg-gray-100 flex items-center justify-center relative p-8">
                             {/* Phone Frame */}
                            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl ring-4 ring-gray-900/5">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-30" />
                                <div className="bg-white w-full h-full rounded-[2.5rem] overflow-hidden relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={currentSceneIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-full h-full"
                                        >
                                            <currentScene.ScreenComponent />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Mobile Overlay Text (visible on small screens only) */}
                            <div className="md:hidden absolute bottom-8 left-0 right-0 text-center px-4">
                                <span className="inline-block bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                    {currentScene.overlayText}
                                </span>
                            </div>
                        </div>

                        {/* Video Controls / Progress */}
                        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end px-6 pb-4 md:hidden">
                             <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-white" 
                                    style={{ width: `${((currentSceneIndex * 100) + progress) / scenes.length}%` }}
                                />
                             </div>
                        </div>

                        {/* Replay Button */}
                        {videoState === "ended" && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="text-center">
                                    <button 
                                        onClick={handlePlay}
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform mb-4 mx-auto"
                                    >
                                        <Play className="w-4 h-4 fill-current" /> Watch Again
                                    </button>
                                    <p className="text-white/60 text-sm">No card terminals were used in this demo.</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Video Controls (Fake) */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        {videoState === "playing" ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white fill-current" />}
                     </div>
                     <div className="hidden sm:block">
                        <p className="text-white text-sm font-medium">Coffee Shop Demo</p>
                        <p className="text-white/50 text-xs">00:{currentSceneIndex * 5 < 10 ? `0${currentSceneIndex * 5}` : currentSceneIndex * 5} / 00:15</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-white/70" />
                    <Maximize2 className="w-5 h-5 text-white/70 ml-2" />
                 </div>
            </div>
        </div>
        
        {/* Caption */}
        <div className="text-center mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
            Video depicts actual product workflow. Transactions are processed securely via Apple Pay or Google Pay on the customer's device.
        </div>
      </div>
    </section>
  );
}
