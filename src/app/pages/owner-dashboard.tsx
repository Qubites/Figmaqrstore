import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  BarChart3, Users, Receipt, Wallet, 
  AlertTriangle, ShieldCheck, FileText, Settings,
  ArrowUpRight, ArrowDownRight, Filter, Search,
  CheckCircle2, AlertCircle, XCircle, MoreVertical,
  ChevronRight, Sparkles
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { GuidedTour, TourStep } from "../components/GuidedTour";

export default function OwnerDashboard() {
  const [tourVisible, setTourVisible] = useState(true);

  const steps: TourStep[] = [
    {
      targetId: "owner-alerts",
      title: "Start with alerts",
      body: "Handle high-risk flags, payment disputes, and system failures immediately from this unified feed.",
      buttonText: "View alerts",
      placement: "bottom"
    },
    {
      targetId: "owner-filters",
      title: "Filter the queue",
      body: "Prioritize high-value transactions or flagged activities to optimize your operational workflow.",
      buttonText: "Next",
      placement: "bottom"
    },
    {
      targetId: "side-disputes",
      title: "Resolve disputes here",
      body: "Centralized hub to review evidence from both sellers and clients to reach a fair resolution.",
      buttonText: "Got it",
      placement: "right"
    },
    {
      targetId: "side-risk",
      title: "Risk controls",
      body: "Configure automated rules and machine learning filters to safeguard the platform's integrity.",
      buttonText: "Finish",
      placement: "right"
    }
  ];

  const sidebarItems = [
    { icon: <BarChart3 size={20} />, label: "Overview", active: true },
    { icon: <Users size={20} />, label: "Sellers" },
    { icon: <Receipt size={20} />, label: "Orders" },
    { icon: <Wallet size={20} />, label: "Payouts" },
    { icon: <AlertCircle size={20} />, label: "Disputes", id: "side-disputes" },
    { icon: <ShieldCheck size={20} />, label: "Risk", id: "side-risk" },
    { icon: <FileText size={20} />, label: "Content" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  const kpis = [
    { label: "GMV Today", value: "$42,912.40", trend: "+8.2%", color: "text-[#006241]" },
    { label: "Orders Today", value: "1,204", trend: "+4.1%", color: "text-gray-900" },
    { label: "Disputes Open", value: "12", trend: "Severe", color: "text-red-500", highlight: true },
    { label: "Payouts Pending", value: "$182,400", trend: "Normal", color: "text-gray-900" },
  ];

  const alerts = [
    { id: 1, type: "risk", msg: "High risk activity detected from IP: 192.168.1.1", severity: "high" },
    { id: 2, type: "payout", msg: "Payout failure for 'Stockholm Coffee Co.'", severity: "med" },
    { id: 3, type: "dispute", msg: "New evidence uploaded for Dispute #842", severity: "low" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex">
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

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden lg:flex flex-col gap-8 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#006241] flex items-center justify-center">
            <span className="text-white font-bold">Q</span>
          </div>
          <span className="font-black text-lg tracking-tight">Admin Console</span>
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

        <div className="mt-auto bg-red-50 rounded-[2rem] p-6 border border-red-100">
           <AlertTriangle className="w-5 h-5 text-red-500 mb-3" />
           <p className="text-[10px] font-black uppercase tracking-widest text-red-900 mb-1">System Health</p>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-bold text-red-700">API Latency High</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-12 max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Platform Overview</h1>
            <p className="text-gray-500 font-medium">Monitoring activity across 4,209 active stores.</p>
          </div>
          <div className="flex gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#006241] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search sellers or orders..." 
                  className="h-14 bg-white border border-gray-100 rounded-2xl pl-11 pr-6 text-sm font-bold focus:ring-2 focus:ring-[#006241]/20 transition-all outline-none"
                />
             </div>
          </div>
        </header>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpis.map((kpi) => (
            <div key={kpi.label} className={cn(
              "p-8 rounded-[2.5rem] border shadow-sm",
              kpi.highlight ? "bg-red-50 border-red-100" : "bg-white border-white"
            )}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{kpi.label}</p>
              <div className="flex items-baseline justify-between">
                <span className={cn("text-2xl font-black tracking-tighter", kpi.color)}>{kpi.value}</span>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-1 rounded-lg",
                  kpi.highlight ? "bg-red-500 text-white" : "bg-gray-50 text-gray-400"
                )}>{kpi.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alerts List */}
          <div className="lg:col-span-1 space-y-6">
            <section id="owner-alerts" className="bg-white rounded-[3rem] p-8 border border-white shadow-sm h-full">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">System Alerts</h2>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                       {alert.severity === 'high' ? <XCircle className="w-4 h-4 text-red-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                       <span className={cn(
                         "text-[8px] font-black uppercase tracking-widest",
                         alert.severity === 'high' ? "text-red-500" : "text-amber-500"
                       )}>{alert.type}</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-900 leading-relaxed mb-3">{alert.msg}</p>
                    <button className="text-[9px] font-black uppercase tracking-widest text-[#006241] opacity-0 group-hover:opacity-100 transition-opacity">Take Action</button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Operations Queue */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[3rem] p-8 lg:p-12 border border-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">Operations Queue</h2>
                <div className="flex gap-2" id="owner-filters">
                   <button className="h-10 px-4 rounded-xl bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:bg-[#006241]/5 hover:text-[#006241] transition-all flex items-center gap-2">
                      <Filter className="w-3 h-3" />
                      Filter
                   </button>
                   {['All', 'High Value', 'Flagged'].map(f => (
                     <button key={f} className={cn(
                       "h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                       f === 'All' ? "bg-[#006241] text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                     )}>{f}</button>
                   ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Merchant</th>
                      <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                      <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1,2,3,4].map(i => (
                      <tr key={i} className="border-b border-gray-50 last:border-none group">
                        <td className="py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-gray-900">Merchant #{100+i}</p>
                                <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Joined 2h ago</p>
                              </div>
                           </div>
                        </td>
                        <td className="py-6 font-bold text-sm">$4,290.00</td>
                        <td className="py-6">
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">
                             Pending Review
                           </span>
                        </td>
                        <td className="py-6 text-right">
                           <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
           <section className="bg-white rounded-[3rem] p-8 border border-white shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Seller Health Index</h3>
              <div className="h-64 flex items-end gap-2 px-4">
                 {[40, 60, 45, 90, 75, 85, 100].map((h, i) => (
                   <div key={i} className="flex-1 bg-[#F7F5EF] rounded-t-xl relative group">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="absolute bottom-0 inset-x-0 bg-[#006241]/10 rounded-t-xl group-hover:bg-[#006241] transition-all"
                      />
                   </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 px-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                 <span>Mon</span>
                 <span>Tue</span>
                 <span>Wed</span>
                 <span>Thu</span>
                 <span>Fri</span>
                 <span>Sat</span>
                 <span>Sun</span>
              </div>
           </section>

           <section className="bg-white rounded-[3rem] p-8 border border-white shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Recent Audit Log</h3>
              <div className="space-y-6">
                 {[
                   { user: 'Admin Sven', action: 'Approved payout to Stockholm Roast', time: '12m ago' },
                   { user: 'System', action: 'Flagged merchant #829 for risk review', time: '45m ago' },
                   { user: 'Admin Elsa', action: 'Closed dispute #129 in favor of seller', time: '1h ago' },
                 ].map((log, i) => (
                   <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#006241] mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{log.action}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{log.user} • {log.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </main>
    </div>
  );
}
