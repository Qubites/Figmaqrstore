import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Terminal, Code2, Cpu, Database, 
  Github, BookOpen, Key, Zap, 
  ChevronRight, Copy, Check, ExternalLink,
  ShieldAlert, Layers, Activity
} from "lucide-react";
import { cn } from "../components/ui/utils";

export default function DevDashboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const navItems = [
    { icon: <Terminal size={18} />, label: "API Keys", active: true },
    { icon: <Code2 size={18} />, label: "SDKs" },
    { icon: <Database size={18} />, label: "Webhooks" },
    { icon: <Layers size={18} />, label: "Environments" },
    { icon: <Activity size={18} />, label: "Logs" },
  ];

  const endpoints = [
    { method: 'GET', path: '/v1/merchants', desc: 'List all authorized merchants' },
    { method: 'POST', path: '/v1/payouts/create', desc: 'Initiate a programmatic payout' },
    { method: 'GET', path: '/v1/orders/:id', desc: 'Fetch detailed order status' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden lg:flex flex-col gap-8 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#006241] flex items-center justify-center">
            <span className="text-white font-bold">Q</span>
          </div>
          <span className="font-black text-lg tracking-tight">Developer Portal</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-left",
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
           <Github className="w-5 h-5 text-gray-900 mb-3" />
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">SDK Release</p>
           <p className="text-[10px] font-bold text-gray-400">v2.4.0 is now live</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-12 max-w-5xl">
        <header className="mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#006241] mb-4 block">Infrastructure</span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-4">
            Build with the <span className="text-[#006241]">QrStore API.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">Power your custom terminal integrations and marketplace experiences.</p>
        </header>

        <div className="space-y-12">
           {/* API Keys */}
           <section className="bg-white rounded-[3rem] p-8 lg:p-12 border border-white shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">Live API Keys</h2>
                 <button className="h-10 px-6 rounded-xl bg-[#006241] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#004e34] transition-colors">Generate New</button>
              </div>

              <div className="space-y-4">
                 <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between group">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Publishable Key</p>
                       <code className="text-xs font-mono font-bold text-[#006241]">pk_live_************************3f2e</code>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('pk_live_...', 'pk')}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-900"
                    >
                      {copied === 'pk' ? <Check className="w-4 h-4 text-[#006241]" /> : <Copy className="w-4 h-4" />}
                    </button>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between group">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Secret Key</p>
                       <code className="text-xs font-mono font-bold text-[#006241]">sk_live_************************9a4b</code>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('sk_live_...', 'sk')}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-900"
                    >
                      {copied === 'sk' ? <Check className="w-4 h-4 text-[#006241]" /> : <Copy className="w-4 h-4" />}
                    </button>
                 </div>
              </div>
           </section>

           {/* Quick References */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white rounded-[3rem] p-8 lg:p-12 border border-white shadow-sm">
                 <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 mb-8">Common Endpoints</h2>
                 <div className="space-y-4">
                    {endpoints.map((e, idx) => (
                      <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-none">
                         <span className={cn(
                           "px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest",
                           e.method === 'GET' ? 'bg-blue-50 text-blue-600' : 'bg-[#006241]/10 text-[#006241]'
                         )}>{e.method}</span>
                         <div>
                            <p className="text-xs font-mono font-bold text-gray-900">{e.path}</p>
                            <p className="text-[10px] font-medium text-gray-400 mt-1">{e.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="bg-[#006241] rounded-[3rem] p-8 lg:p-12 text-white relative overflow-hidden">
                 <div className="relative z-10">
                   <h2 className="text-xl font-black uppercase tracking-widest mb-6">Documentation</h2>
                   <p className="text-white/70 text-sm font-medium mb-8">Comprehensive guides for integration, error handling, and security best practices.</p>
                   <div className="space-y-3">
                      <button className="w-full h-14 bg-white text-[#006241] rounded-2xl flex items-center justify-between px-6 text-[10px] font-black uppercase tracking-widest group">
                         API Reference
                         <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button className="w-full h-14 bg-white/10 text-white rounded-2xl flex items-center justify-between px-6 text-[10px] font-black uppercase tracking-widest group">
                         Postman Collection
                         <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                 </div>
                 <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mb-24 blur-3xl" />
              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
