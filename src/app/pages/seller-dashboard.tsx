import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, ShoppingBag, Receipt, Wallet, 
  MessageSquare, Settings, Plus, ArrowUpRight, 
  CheckCircle2, Circle, Search, ChevronRight,
  Headphones, FileText, Bell, Sparkles
} from "lucide-react";
import { Link } from "react-router";
import { cn } from "../components/ui/utils";
import { GuidedTour, TourStep } from "../components/GuidedTour";

export default function SellerDashboard() {
  const [tourVisible, setTourVisible] = useState(true);

  const steps: TourStep[] = [
    {
      targetId: "payout-btn",
      title: "Get paid",
      body: "Add your payout details to receive earnings directly to your bank account.",
      buttonText: "Add details",
      placement: "bottom"
    },
    {
      targetId: "create-product-btn",
      title: "Create your first product",
      body: "Add photos, price, and inventory. Your first listing is just seconds away.",
      buttonText: "Next",
      placement: "left"
    },
    {
      targetId: "publish-step",
      title: "Go live",
      body: "Publish when you're ready to accept orders from customers around the world.",
      buttonText: "Got it",
      placement: "top"
    },
    {
      targetId: "sidebar-orders",
      title: "Fulfill orders here",
      body: "Track status and manage delivery in real-time from this menu.",
      buttonText: "Finish Tour",
      placement: "right"
    }
  ];

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", active: true },
    { icon: <ShoppingBag size={20} />, label: "Products" },
    { icon: <Receipt size={20} />, label: "Orders", id: "sidebar-orders" },
    { icon: <Wallet size={20} />, label: "Payouts" },
    { icon: <MessageSquare size={20} />, label: "Messages" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  const stats = [
    { label: "Today's Sales", value: "$1,284.00", trend: "+12.5%", color: "text-[#006241]" },
    { label: "Orders to Fulfill", value: "8", trend: "Normal", color: "text-gray-900" },
    { label: "Available Balance", value: "$4,120.50", sub: "Payout: Mar 1st", color: "text-gray-900" },
  ];

  const checklist = [
    { label: "Add payout details", done: false, id: "payout-btn" },
    { label: "Create first product", done: false, id: "create-product-btn" },
    { label: "Set shipping options", done: true },
    { label: "Publish store", done: false, id: "publish-step" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex">
      <GuidedTour 
        steps={steps} 
        isVisible={tourVisible} 
        onComplete={() => setTourVisible(false)} 
      />

      {/* Manual Tour Restart Button */}
      <button 
        onClick={() => setTourVisible(true)}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full bg-white shadow-2xl border border-gray-100 flex items-center justify-center text-[#006241] hover:scale-110 transition-all group"
        title="Restart Tour"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden lg:flex flex-col gap-8 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#006241] flex items-center justify-center">
            <span className="text-white font-bold">Q</span>
          </div>
          <span className="font-black text-lg tracking-tight">Seller Hub</span>
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              id={item.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
                item.active 
                  ? "bg-[#006241]/5 text-[#006241]" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
           <Bell className="w-5 h-5 text-gray-400 mb-3" />
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">New Order</p>
           <p className="text-[10px] font-bold text-gray-400">2 minutes ago</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-12 max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Welcome back, Stockholm Roast</h1>
            <p className="text-gray-500 font-medium">Your store is currently in draft mode.</p>
          </div>
          <div className="flex gap-3">
            <button className="h-14 px-6 rounded-2xl border border-gray-200 bg-white text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
              Preview Store
            </button>
            <button 
              id="create-product-btn-main" 
              className="h-14 px-6 rounded-2xl bg-[#006241] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#004e34] shadow-xl shadow-[#006241]/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Product
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <span className={cn("text-3xl font-black tracking-tighter", stat.color)}>{stat.value}</span>
                {stat.trend && <span className="text-[10px] font-bold text-[#006241] bg-[#006241]/5 px-2 py-1 rounded-lg">{stat.trend}</span>}
                {stat.sub && <span className="text-[10px] font-bold text-gray-400">{stat.sub}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-8 lg:p-12 border border-white shadow-sm">
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 mb-8">Next Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklist.map((item) => (
                  <button
                    key={item.label}
                    id={item.id}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-[2rem] border transition-all text-left group",
                      item.done 
                        ? "bg-gray-50 border-transparent grayscale" 
                        : "bg-[#F7F5EF] border-transparent hover:scale-[1.02]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {item.done ? <CheckCircle2 className="text-[#006241]" /> : <Circle className="text-gray-300" />}
                      <span className="font-bold text-sm text-gray-900">{item.label}</span>
                    </div>
                    {!item.done && <ArrowUpRight className="w-4 h-4 text-[#006241] opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[3rem] p-8 lg:p-12 border border-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">Recent Orders</h2>
                <button className="text-[10px] font-black uppercase tracking-widest text-[#006241]">View All</button>
              </div>
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-400 font-bold text-sm">No orders yet</p>
                <p className="text-xs text-gray-300 mt-1 uppercase tracking-widest">Share your store to start selling</p>
              </div>
            </section>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <section className="bg-[#006241] rounded-[3rem] p-8 text-white relative overflow-hidden">
               <h3 className="text-xl font-black mb-4 relative z-10">Need help?</h3>
               <p className="text-white/70 text-sm font-medium mb-8 relative z-10">Our Scandinavian support team is available 24/7 for you.</p>
               <div className="space-y-3 relative z-10">
                 <button className="w-full bg-white text-[#006241] h-14 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
                   <Headphones className="w-4 h-4" />
                   Contact Support
                 </button>
                 <button className="w-full bg-white/10 text-white h-14 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
                   <FileText className="w-4 h-4" />
                   View Policies
                 </button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            </section>
            
            <section className="bg-white rounded-[3rem] p-8 border border-white shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Quick Tools</h3>
               <div className="grid grid-cols-2 gap-3">
                  {['QR Codes', 'Inventory', 'Tax Rates', 'Staff'].map(tool => (
                    <button key={tool} className="p-4 rounded-2xl bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-[#006241]/5 hover:text-[#006241] transition-all">
                      {tool}
                    </button>
                  ))}
               </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
