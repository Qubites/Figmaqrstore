import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { TwentySecondChallenge } from "./TwentySecondChallenge";

export function Hero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Content */}
        <motion.div 
          className="flex-1 text-center lg:text-left z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#006241]/10 text-[#006241] font-semibold text-sm mb-6 shadow-sm border border-[#006241]/20">
            <Zap className="w-4 h-4 fill-[#006241]" />
            Setup in under 20 seconds
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
            Start accepting <br className="hidden lg:block"/> card payments <span className="text-[#006241]">right now.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
            The world's fastest way to get paid. Log in, create your first product, and take payments anywhere. No hardware needed.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-6">
            <Link
              to="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#006241] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#004e34] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#006241]/20"
            >
              Get started for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500 font-medium sm:ml-4">
              Flat 3% • Cancel anytime
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 font-medium mb-10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-[#006241]" />
              No subscriptions
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-[#006241]" />
              No startup fees
            </div>
          </div>

          <motion.div 
            className="flex items-center justify-center lg:justify-start gap-4 pt-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1606773061828-1f0010561bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIweW91bmclMjB3b21hbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzcxODY2NDU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
                "https://images.unsplash.com/photo-1628619487942-01c58eed5c33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIweW91bmclMjBtYW4lMjBnbGFzc2VzfGVufDF8fHx8MTc3MTg3MjExNXww&ixlib=rb-4.1.0&q=80&w=1080",
                "https://images.unsplash.com/photo-1602838052440-33506c34ba51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwbWlkZGxlJTIwYWdlZCUyMHdvbWFufGVufDF8fHx8MTc3MTg3MjExNXww&ixlib=rb-4.1.0&q=80&w=1080",
                "https://images.unsplash.com/photo-1653071163478-177aa4035184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwbWFuJTIwd2l0aCUyMGJlYXJkfGVufDF8fHx8MTc3MTg3MjExNXww&ixlib=rb-4.1.0&q=80&w=1080"
              ].map((src, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm bg-gray-100">
                  <ImageWithFallback 
                    src={src} 
                    alt={`User avatar ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                +2k
              </div>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-yellow-500 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 font-medium">
                Joined by <span className="font-bold text-gray-900">240+ sellers</span> this week
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Visual (Interactive Challenge) */}
        <motion.div 
          className="flex-1 w-full max-w-md lg:max-w-none mx-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TwentySecondChallenge />
        </motion.div>
      </div>
    </section>
  );
}
