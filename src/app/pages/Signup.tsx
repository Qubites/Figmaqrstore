import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export function Signup() {
  return (
    <div className="min-h-screen bg-[#006241] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium z-50">
        <ArrowLeft className="w-5 h-5" />
        Back home
      </Link>

      <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Side: Value Prop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-white lg:text-left text-center hidden lg:block"
        >
          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-lg mb-10">
            <span className="text-[#006241] font-bold text-3xl">Q</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
            Start getting paid in 20 seconds.
          </h1>
          <ul className="space-y-6">
            <li className="flex items-center gap-4 text-xl text-white/90 font-medium">
              <CheckCircle2 className="w-7 h-7 text-green-300" />
              Flat 3% per transaction
            </li>
            <li className="flex items-center gap-4 text-xl text-white/90 font-medium">
              <CheckCircle2 className="w-7 h-7 text-green-300" />
              No monthly subscriptions
            </li>
            <li className="flex items-center gap-4 text-xl text-white/90 font-medium">
              <CheckCircle2 className="w-7 h-7 text-green-300" />
              No hardware needed
            </li>
            <li className="flex items-center gap-4 text-xl text-white/90 font-medium">
              <CheckCircle2 className="w-7 h-7 text-green-300" />
              Cancel anytime
            </li>
          </ul>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 w-full max-w-md"
        >
          <div className="bg-white rounded-[2rem] p-10 shadow-2xl relative">
            {/* Ribbon */}
            <div className="absolute top-0 right-10 transform -translate-y-1/2">
              <div className="bg-green-100 text-[#006241] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                100% Free Setup
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500 text-sm">Join thousands of sellers today.</p>
            </div>

            <form className="space-y-5" action="#" method="POST">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business / Event Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006241] focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                  placeholder="e.g. Acme Coffee"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006241] focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006241] focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg shadow-[#006241]/20 text-sm font-bold text-white bg-[#006241] hover:bg-[#004e34] hover:shadow-xl transition-all active:scale-[0.98] mt-4"
              >
                Start selling instantly
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link to="/login" className="font-semibold text-[#006241] hover:text-[#004e34] transition-colors">
                Log in
              </Link>
            </div>
            
            <p className="mt-6 text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
