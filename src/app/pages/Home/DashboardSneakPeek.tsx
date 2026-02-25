import { motion } from "motion/react";
import { ArrowUpRight, BarChart3, CreditCard, DollarSign, Users, ChevronRight, Activity } from "lucide-react";

const recentTransactions = [
  { id: 1, name: "Sarah J.", item: "Artisan Coffee", amount: "$4.50", time: "2 min ago", initial: "S", color: "bg-blue-100 text-blue-700" },
  { id: 2, name: "Michael T.", item: "Pastry & Tea", amount: "$12.00", time: "15 min ago", initial: "M", color: "bg-green-100 text-green-700" },
  { id: 3, name: "Emma W.", item: "Whole Bean Bag", amount: "$18.50", time: "1 hr ago", initial: "E", color: "bg-orange-100 text-orange-700" },
];

export function DashboardSneakPeek() {
  return (
    <section className="py-24 w-full bg-[#006241] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white font-medium text-sm mb-6 border border-white/20 backdrop-blur-md">
              <Activity className="w-4 h-4" />
              Powerful Backoffice
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Manage your entire business from your pocket.
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Don't let the simplicity fool you. Beneath the 20-second setup is a lightning-fast, full-featured dashboard. Track live sales, manage inventory, issue refunds, and export accounting data—all perfectly optimized for mobile.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: BarChart3, title: "Real-time analytics" },
                { icon: Users, title: "Customer insights" },
                { icon: DollarSign, title: "One-tap refunds" },
                { icon: CreditCard, title: "Payout tracking" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{feature.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Glassmorphic Phone/Tablet Frame */}
            <div className="bg-[#F7F5EF] rounded-[2.5rem] p-4 shadow-2xl ring-1 ring-white/20">
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner h-[600px] flex flex-col relative border border-gray-100">
                
                {/* Mockup Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Today's Sales</h3>
                    <p className="text-xs text-gray-500 font-medium">Updated just now</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#006241] text-white flex items-center justify-center text-xs font-bold">
                      QS
                    </div>
                  </div>
                </div>

                {/* Mockup Body (Scrollable area) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                  
                  {/* Hero Stat */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">Gross Volume</p>
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                        <ArrowUpRight className="w-3 h-3" />
                        14.5%
                      </div>
                    </div>
                    <p className="text-4xl font-bold tracking-tight text-gray-900">$4,294.00</p>
                  </div>

                  {/* Animated Chart */}
                  <div className="h-32 w-full flex items-end gap-2 pt-4">
                    {[40, 70, 45, 90, 65, 85, 120].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer relative">
                        {/* Tooltip on hover simulation */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded transition-opacity whitespace-nowrap z-20">
                          ${height * 12}
                        </div>
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.3 + (i * 0.1), type: "spring" }}
                          className={`w-full rounded-t-sm transition-colors duration-300 ${i === 6 ? 'bg-[#006241]' : 'bg-[#006241]/20 group-hover:bg-[#006241]/40'}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors py-3 rounded-2xl border border-gray-100 text-sm font-semibold text-gray-700">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      Payout
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-[#006241] hover:bg-[#004e34] transition-colors py-3 rounded-2xl text-sm font-semibold text-white shadow-sm shadow-[#006241]/20">
                      Create Sale
                    </button>
                  </div>

                  {/* Recent Transactions */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">Recent Transactions</h4>
                      <button className="text-xs font-semibold text-[#006241] hover:text-[#004e34]">View all</button>
                    </div>
                    
                    <div className="space-y-3">
                      {recentTransactions.map((tx, i) => (
                        <motion.div 
                          key={tx.id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.6 + (i * 0.1) }}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${tx.color}`}>
                              {tx.initial}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-[#006241] transition-colors">{tx.name}</p>
                              <p className="text-xs font-medium text-gray-500">{tx.item}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{tx.amount}</p>
                            <p className="text-xs font-medium text-gray-500">{tx.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            {/* Floating indicator */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, type: "spring" }}
              className="absolute -right-6 top-1/3 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Live Status</p>
                <p className="text-sm font-bold text-gray-900">All systems go</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}