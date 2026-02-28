import React from "react";
import { motion } from "motion/react";
import { Search, Book, MessageCircle, LifeBuoy, ChevronRight } from "lucide-react";
import { Link } from "react-router";

export default function SupportPage() {
  const categories = [
    { title: "Getting Started", icon: <Book className="w-5 h-5" />, articles: "12 articles" },
    { title: "Payments & Payouts", icon: <LifeBuoy className="w-5 h-5" />, articles: "24 articles" },
    { title: "Terminal Setup", icon: <MessageCircle className="w-5 h-5" />, articles: "8 articles" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#006241] mb-4 block">Help Center</span>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-gray-900 mb-8 leading-none">
            How can we <span className="text-[#006241]">help?</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#006241] transition-colors" />
            <input 
              type="text" 
              placeholder="Search for articles, guides, and tutorials..."
              className="w-full h-16 rounded-2xl bg-white border-none shadow-xl shadow-gray-200/50 px-16 font-medium focus:ring-2 focus:ring-[#006241]/20 outline-none transition-all"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              className="bg-white p-8 rounded-[2.5rem] border border-white shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#006241]/5 flex items-center justify-center text-[#006241] mb-6 group-hover:bg-[#006241] group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">{cat.title}</h3>
              <p className="text-gray-400 text-xs font-medium">{cat.articles}</p>
            </button>
          ))}
        </div>

        <div className="bg-[#006241] rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl lg:text-3xl font-black mb-4">Still need assistance?</h2>
            <p className="text-white/70 font-medium mb-8 max-w-md mx-auto">Our support team in Stockholm is ready to help you with any custom requests.</p>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#006241] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors"
            >
              Contact Support
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
