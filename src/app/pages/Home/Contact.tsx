import { motion } from "motion/react";
import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export function Contact() {
  return (
    <section id="contact" className="w-full py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-gray-900 mb-6">
              Get in touch
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-md font-medium leading-relaxed">
              Have questions about local regulations, enterprise pricing, or custom hardware integrations? Our Scandinavian team is here to help.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#006241]/5 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#006241]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-1">Email us</h4>
                  <p className="text-gray-600 font-medium">hello@qrstore.app</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#006241]/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#006241]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-1">Headquarters</h4>
                  <p className="text-gray-600 font-medium">Östermalmsgatan 87, 114 59 Stockholm, Sweden</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#006241]/5 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#006241]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-1">Live Chat</h4>
                  <p className="text-gray-600 font-medium">Available Mon-Fri, 9:00 - 17:00 CET</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F7F5EF] rounded-[3rem] p-8 lg:p-12 border border-gray-100 shadow-inner">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">First Name</label>
                  <Input placeholder="Sven" className="bg-white border-transparent h-14 rounded-2xl px-6 focus:border-[#006241] transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Last Name</label>
                  <Input placeholder="Svensson" className="bg-white border-transparent h-14 rounded-2xl px-6 focus:border-[#006241] transition-all font-medium" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                <Input type="email" placeholder="sven@example.com" className="bg-white border-transparent h-14 rounded-2xl px-6 focus:border-[#006241] transition-all font-medium" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-white border-transparent rounded-[2rem] p-6 focus:border-[#006241] transition-all font-medium outline-none text-sm resize-none"
                />
              </div>

              <Button className="w-full h-16 rounded-2xl bg-[#006241] text-white font-black uppercase tracking-widest text-sm hover:bg-[#004e34] shadow-xl shadow-[#006241]/20 group">
                Send Message
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
