import React from "react";
import { motion } from "motion/react";
import { Mail, MessageSquare, MapPin, Send, Globe, Shield, Zap, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-12 pb-24">
      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#006241] mb-4 block">Our Story</span>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Invisible payments for a <span className="text-[#006241]">borderless</span> world.
            </h1>
            <p className="text-xl text-gray-600 font-medium leading-relaxed mb-12">
              Born in Stockholm, QrStore was built to remove the "heavy iron" from retail. We believe payments should be as invisible as the air, yet as reliable as a Swiss watch. By eliminating card readers and proprietary hardware, we empower sellers to start their journey in seconds, not weeks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-[#006241]" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest">Secure</h3>
              <p className="text-xs text-gray-500 font-medium">Bank-level encryption with zero stored card data.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-[#006241]" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest">Instant</h3>
              <p className="text-xs text-gray-500 font-medium">From first scan to payout in less than 20 seconds.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-[#006241]" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest">Sleek</h3>
              <p className="text-xs text-gray-500 font-medium">Designed with a minimalist Scandinavian soul.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[4rem] p-8 lg:p-20 shadow-2xl shadow-gray-200/50 border border-white flex flex-col lg:flex-row gap-20">
          
          <div className="lg:w-1/3 space-y-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-4">Connect with us</h2>
              <p className="text-gray-500 font-medium">Whether you're a boutique owner or an enterprise developer, we're ready to scale with you.</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#006241]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px] mb-1">General Inquiries</h4>
                  <p className="text-sm font-bold text-gray-600">hello@qrstore.app</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#006241]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px] mb-1">Headquarters</h4>
                  <p className="text-sm font-bold text-gray-600">Östermalmsgatan 87<br/>114 59 Stockholm, Sweden</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#006241]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px] mb-1">Developer Support</h4>
                  <p className="text-sm font-bold text-gray-600">dev@qrstore.app</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Support Team" className="w-full h-full object-cover" />
                      </div>
                    ))}
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Our team is online</p>
               </div>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-[#F7F5EF] rounded-[3rem] p-8 lg:p-12 border border-gray-100 shadow-inner">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Full Name</label>
                  <Input placeholder="Enter your name" className="bg-white border-transparent h-16 rounded-2xl px-6 focus:border-[#006241] transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                  <Input type="email" placeholder="email@example.com" className="bg-white border-transparent h-16 rounded-2xl px-6 focus:border-[#006241] transition-all font-bold" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Subject</label>
                  <Input placeholder="How can we help?" className="bg-white border-transparent h-16 rounded-2xl px-6 focus:border-[#006241] transition-all font-bold" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Tell us about your project..."
                    className="w-full bg-white border-transparent rounded-[2rem] p-6 focus:border-[#006241] transition-all font-bold outline-none text-sm resize-none shadow-sm"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button className="w-full h-18 rounded-2xl bg-[#006241] text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-[#004e34] shadow-2xl shadow-[#006241]/30 group">
                    Send Message
                    <Send className="w-5 h-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
