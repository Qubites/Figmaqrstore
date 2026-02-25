import { motion } from "motion/react";
import { Zap, Activity, DollarSign, Users, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function DashboardPreview() {
  return (
    <section className="w-full bg-[#006241] py-24 sm:py-32 relative overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-green-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-100 font-semibold text-sm mb-6 border border-white/20 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 fill-emerald-100" />
            Performance Optimised
          </motion.div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            A dashboard that works at your speed.
          </h2>
          <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
            Manage products, track real-time payments, and issue instant refunds from a beautifully engineered interface built for speed.
          </p>
        </div>

        {/* Dashboard Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Mac window styling */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-t-[2rem] shadow-2xl overflow-hidden p-2 pb-0">
            <div className="flex items-center gap-2 px-4 py-3 bg-black/20 rounded-t-2xl mb-2 backdrop-blur-md">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <div className="flex-1 flex justify-center ml-[-2rem]">
                <div className="px-4 py-1 rounded-md bg-black/30 text-emerald-100/50 text-xs font-mono flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  admin.qrstore.app
                </div>
              </div>
            </div>

            {/* Inner Dashboard View */}
            <div className="bg-[#F9FAFB] rounded-t-[1.5rem] p-6 lg:p-8 relative min-h-[400px]">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold text-gray-900">Store Overview</h3>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-white rounded-md border border-gray-200 text-sm font-medium text-gray-600 shadow-sm flex items-center gap-2">
                    Today
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    SJ
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 cursor-default">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">$2,450.00</p>
                    <span className="text-xs text-emerald-600 font-medium">+14% vs yesterday</span>
                  </div>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 cursor-default">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">142</p>
                    <span className="text-xs text-emerald-600 font-medium">+5% vs yesterday</span>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 cursor-default">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Customers</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                    <span className="text-xs text-red-500 font-medium">-2% vs yesterday</span>
                  </div>
                </motion.div>
              </div>

              {/* Chart/List Area Mockup */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden group">
                 {/* Real unsplash image to look like a chart/ui component we swapped in */}
                 <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBpbnRlcmZhY2UlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzcxODYyNzYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Analytics Dashboard interface"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply filter blur-[1px] group-hover:blur-none group-hover:opacity-100 transition-all duration-700"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center">
                    <motion.div 
                      className="bg-emerald-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-emerald-900/20 flex items-center gap-2 border border-emerald-400/30"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Activity className="w-5 h-5 animate-pulse" />
                      Live Feed Active
                    </motion.div>
                 </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
