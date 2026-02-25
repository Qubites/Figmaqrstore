import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="w-full bg-[#006241] py-24 relative overflow-hidden">
      {/* Decorative Blur Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00a36c]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-12 lg:p-20 rounded-3xl text-white shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-semibold text-sm mb-8 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Join the revolution
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
            Stop waiting. <br/> Start selling.
          </h2>
          
          <p className="text-xl text-[#F7F5EF]/90 mb-10 max-w-2xl mx-auto">
            Setup your first product in 20 seconds. No risk, cancel anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#006241] px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Get started for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
            >
              Log in instead
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
