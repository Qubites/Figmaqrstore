import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, ShoppingBag, MessageSquare, User, 
  MapPin, Clock, Star, ArrowRight, ChevronRight,
  Filter, Heart, LayoutGrid, List, Sparkles
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { GuidedTour, TourStep } from "../components/GuidedTour";

export default function ClientDashboard() {
  const [tourVisible, setTourVisible] = useState(true);

  const steps: TourStep[] = [
    {
      targetId: "client-search",
      title: "Search products",
      body: "Type keywords or browse curated categories from local Swedish artisans.",
      buttonText: "Search",
      placement: "bottom"
    },
    {
      targetId: "product-card-1",
      title: "Open a product",
      body: "See high-resolution details, verified customer reviews, and fast delivery options.",
      buttonText: "Next",
      placement: "top"
    },
    {
      targetId: "nav-orders",
      title: "Track orders",
      body: "All your active purchases, digital receipts, and tracking history are stored here.",
      buttonText: "Got it",
      placement: "bottom"
    },
    {
      targetId: "nav-messages",
      title: "Message sellers",
      body: "Ask questions about craftsmanship or delivery directly to the source.",
      buttonText: "Finish",
      placement: "bottom"
    }
  ];

  const categories = ["All", "Digital", "Local Coffee", "Art & Decor", "Furniture", "Vintage"];
  
  const products = [
    { id: 1, title: "Artisan Coffee Beans", price: "$24.00", rating: 4.9, location: "Stockholm", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=60" },
    { id: 2, title: "Minimalist Oak Chair", price: "$340.00", rating: 4.8, location: "Malmö", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60" },
    { id: 3, title: "Digital Planner 2026", price: "$12.00", rating: 5.0, location: "Online", img: "https://images.unsplash.com/photo-1586075010633-2a420b2bc61e?w=800&auto=format&fit=crop&q=60" },
    { id: 4, title: "Ceramic Vase Set", price: "$85.00", rating: 4.7, location: "Gothenburg", img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&auto=format&fit=crop&q=60" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-24">
      <GuidedTour 
        steps={steps} 
        isVisible={tourVisible} 
        onComplete={() => setTourVisible(false)} 
      />

      <button 
        onClick={() => setTourVisible(true)}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full bg-white shadow-2xl border border-gray-100 flex items-center justify-center text-[#006241] hover:scale-110 transition-all group"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Top Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-8 flex-1">
             <div className="w-8 h-8 rounded-xl bg-[#006241] flex items-center justify-center shrink-0">
               <span className="text-white font-bold">Q</span>
             </div>
             
             <div className="relative flex-1 max-w-xl" id="client-search">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search Stockholm artisans..."
                 className="w-full h-11 bg-gray-50 border-transparent rounded-xl pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#006241]/20 transition-all"
               />
             </div>
          </div>

          <nav className="flex items-center gap-2">
            <button id="nav-orders" className="p-3 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all relative group">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#006241] rounded-full border-2 border-white scale-0 group-hover:scale-100 transition-transform" />
            </button>
            <button id="nav-messages" className="p-3 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-1 rounded-full border-2 border-transparent hover:border-[#006241]/20 transition-all ml-2">
              <div className="w-8 h-8 rounded-full bg-[#006241]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#006241]" />
              </div>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-8">
            Find what you need <span className="text-[#006241]">today.</span>
          </h1>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <button 
                key={cat} 
                className={cn(
                  "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  idx === 0 ? "bg-[#006241] text-white shadow-lg shadow-[#006241]/20" : "bg-white text-gray-500 hover:bg-gray-100"
                )}
              >
                {cat}
              </button>
            ))}
            <button className="p-3 rounded-full bg-white text-gray-500 hover:bg-gray-100 ml-2">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Product Grid */}
          <div className="lg:col-span-3">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Curated for you</h2>
               <div className="flex gap-2">
                 <button className="p-2 rounded-lg bg-white shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
                 <button className="p-2 rounded-lg text-gray-400"><List className="w-4 h-4" /></button>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {products.map((p, idx) => (
                 <motion.div 
                   key={p.id}
                   id={idx === 0 ? "product-card-1" : undefined}
                   whileHover={{ y: -8 }}
                   className="bg-white rounded-[3rem] p-4 border border-white shadow-sm group cursor-pointer"
                 >
                   <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 relative">
                     <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-900 hover:bg-white hover:text-red-500 transition-all">
                       <Heart className="w-4 h-4" />
                     </button>
                   </div>
                   <div className="px-4 pb-4">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-black text-lg text-gray-900 leading-tight">{p.title}</h3>
                       <span className="font-black text-lg text-[#006241]">{p.price}</span>
                     </div>
                     <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
                       <div className="flex items-center gap-1">
                         <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                         <span>{p.rating}</span>
                       </div>
                       <div className="flex items-center gap-1">
                         <MapPin className="w-3 h-3" />
                         <span>{p.location}</span>
                       </div>
                     </div>
                     <button className="w-full h-14 rounded-2xl bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-900 flex items-center justify-center gap-2 group-hover:bg-[#006241] group-hover:text-white transition-all">
                       View Product
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>

          {/* Activity Rail */}
          <div className="space-y-8">
             <section className="bg-white rounded-[3rem] p-8 border border-white shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Active Order</h3>
                <div className="text-center py-12">
                   <div className="w-16 h-16 rounded-[2rem] bg-[#006241]/5 flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-6 h-6 text-[#006241]" />
                   </div>
                   <p className="text-sm font-bold text-gray-900 mb-2">No active orders</p>
                   <p className="text-xs text-gray-400 font-medium">Items you purchase will appear here for tracking.</p>
                </div>
             </section>

             <section className="bg-white rounded-[3rem] p-8 border border-white shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Recently Viewed</h3>
                <div className="space-y-4">
                   {[1,2].map(i => (
                     <div key={i} className="flex gap-4 items-center group cursor-pointer">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                           <img src={products[i+1].img} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-900 group-hover:text-[#006241] transition-colors">{products[i+1].title}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{products[i+1].price}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </section>

             <section className="bg-[#F7F5EF] rounded-[3rem] p-8 border border-gray-100 text-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2">Support & Help</h3>
                <p className="text-[10px] font-bold text-gray-500 mb-6">Need assistance with a purchase?</p>
                <div className="space-y-2">
                  <button className="w-full h-12 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-colors">FAQ</button>
                  <button className="w-full h-12 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-colors">Live Chat</button>
                </div>
             </section>
          </div>
        </div>
      </main>
    </div>
  );
}
