import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Slider } from "../../components/ui/slider";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Calculator, 
  TrendingDown, 
  ArrowRight, 
  DollarSign, 
  Percent, 
  Store 
} from "lucide-react";
import { cn } from "../../components/ui/utils";

// Standard rates for comparison (European context based on currency used elsewhere)
const RATES = {
  qrstore: { name: "QrStore", percentage: 0.5, fixed: 0.10, color: "#006241" },
  stripe: { name: "Stripe", percentage: 1.5, fixed: 0.25, color: "#635BFF" },
  sumup: { name: "SumUp", percentage: 1.69, fixed: 0.00, color: "#307DFF" },
  square: { name: "Square", percentage: 1.75, fixed: 0.00, color: "#000000" }
};

export function FeeCalculator() {
  // State for inputs
  const [monthlyRevenue, setMonthlyRevenue] = useState([15000]);
  const [avgTicket, setAvgTicket] = useState([12.50]);
  
  // Calculated values
  const [savings, setSavings] = useState(0);
  const [yearlySavings, setYearlySavings] = useState(0);
  
  // Calculate fees
  const calculateFees = (revenue: number, ticket: number) => {
    if (ticket <= 0) return { qrstore: 0, stripe: 0, sumup: 0, square: 0 };
    
    const transactions = revenue / ticket;
    
    return {
      qrstore: (revenue * (RATES.qrstore.percentage / 100)) + (transactions * RATES.qrstore.fixed),
      stripe: (revenue * (RATES.stripe.percentage / 100)) + (transactions * RATES.stripe.fixed),
      sumup: (revenue * (RATES.sumup.percentage / 100)) + (transactions * RATES.sumup.fixed),
      square: (revenue * (RATES.square.percentage / 100)) + (transactions * RATES.square.fixed),
    };
  };

  const fees = calculateFees(monthlyRevenue[0], avgTicket[0]);
  
  // Find highest competitor fee for comparison base
  const maxCompetitorFee = Math.max(fees.stripe, fees.sumup, fees.square);
  const currentSavings = maxCompetitorFee - fees.qrstore;

  useEffect(() => {
    setSavings(currentSavings);
    setYearlySavings(currentSavings * 12);
  }, [monthlyRevenue, avgTicket]);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[#F7F5EF] rounded-[3rem] -z-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#006241]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-orange-100/40 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="rounded-full px-4 py-1.5 border-[#006241]/20 bg-white/50 backdrop-blur-sm text-[#006241] font-medium tracking-wide">
            TRANSPARENT PRICING
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Calculate your <span className="text-[#006241]">profit margin</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            See exactly how much you save by switching to QrStore. We charge a simple 0.5% + €0.10 per transaction. No hidden fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Section */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border-gray-100 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#006241]/10 flex items-center justify-center text-[#006241]">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Input your numbers</h3>
                  <p className="text-sm text-gray-500">Adjust to match your business</p>
                </div>
              </div>

              <div className="space-y-10">
                {/* Revenue Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Monthly Revenue</label>
                    <div className="text-2xl font-bold text-gray-900 font-mono">
                      € {monthlyRevenue[0].toLocaleString()}
                    </div>
                  </div>
                  <Slider
                    defaultValue={[15000]}
                    max={100000}
                    step={1000}
                    value={monthlyRevenue}
                    onValueChange={setMonthlyRevenue}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>€ 0</span>
                    <span>€ 100k+</span>
                  </div>
                </div>

                {/* Ticket Size Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Avg. Ticket Size</label>
                    <div className="text-2xl font-bold text-gray-900 font-mono">
                      € {avgTicket[0].toFixed(2)}
                    </div>
                  </div>
                  <Slider
                    defaultValue={[12.50]}
                    max={100}
                    step={0.50}
                    value={avgTicket}
                    onValueChange={setAvgTicket}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>€ 1.00</span>
                    <span>€ 100.00</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Yearly Savings Highlight */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#006241] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-[#006241]/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <p className="text-white/80 font-medium mb-1 uppercase tracking-widest text-xs">Projected Yearly Savings</p>
                <div className="text-5xl font-bold tracking-tight mb-4">
                  € {yearlySavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <p className="text-sm text-white/70 leading-relaxed max-w-xs">
                  That's enough to buy <span className="font-bold text-white">{(yearlySavings / 3.5).toFixed(0)}</span> flat whites per year.
                </p>
              </div>
              <TrendingDown className="absolute bottom-6 right-8 w-24 h-24 text-white/5" />
            </motion.div>
          </div>

          {/* Visualization Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fees)
                .sort(([,a], [,b]) => a - b) // Sort by lowest fee
                .map(([key, fee], index) => {
                const isWinner = key === 'qrstore';
                // @ts-ignore
                const data = RATES[key];
                
                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={cn(
                      "p-6 rounded-[2rem] border relative overflow-hidden transition-all duration-300",
                      isWinner 
                        ? "bg-white border-[#006241] ring-1 ring-[#006241] shadow-xl z-10 md:col-span-2 md:flex md:items-center md:justify-between md:gap-8" 
                        : "bg-white/50 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {isWinner && (
                      <div className="absolute top-0 right-0 bg-[#006241] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                        Lowest Fees
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0",
                        isWinner ? "bg-[#006241]" : "bg-gray-200 text-gray-500"
                      )} style={{ backgroundColor: !isWinner ? undefined : data.color }}>
                        {isWinner ? <Store className="w-5 h-5" /> : data.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{data.name}</h4>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {data.percentage}% + €{data.fixed.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Monthly Fees</span>
                      <div className={cn(
                        "text-2xl font-bold font-mono",
                        isWinner ? "text-[#006241]" : "text-gray-600"
                      )}>
                        € {fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      {!isWinner && (
                         <span className="text-xs text-red-500 font-medium mt-1">
                           + € {(fee - fees.qrstore).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more
                         </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Card className="p-8 rounded-[2.5rem] bg-gray-900 text-white overflow-hidden relative border-none">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-gray-900 to-gray-900" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ready to keep your earnings?</h3>
                  <p className="text-gray-400 max-w-sm">Join 1,000+ independent sellers switching to fair, transparent pricing.</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                >
                  Start Saving Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
