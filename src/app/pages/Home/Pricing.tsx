import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link } from "react-router";

export function Pricing() {
  const features = [
    "No monthly subscriptions",
    "No setup fees or hardware costs",
    "Accept all major cards, Apple Pay & Google Pay",
    "Instant payouts to local banks (UK first)",
    "Cancel or opt out in one click",
  ];

  return (
    <section id="pricing" className="w-full py-24 bg-[#006241]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="flex-1 text-center lg:text-left text-white">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
              Simple pricing, no surprises.
            </h2>
            <p className="text-xl text-[#F7F5EF]/80 mb-12 max-w-lg mx-auto lg:mx-0">
              Stop paying for expensive card readers and confusing merchant accounts. Pay only when you get paid.
            </p>
            
            <ul className="space-y-4 text-left inline-block lg:block">
              {features.map((feature, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-[#F7F5EF] font-medium text-lg"
                >
                  <div className="bg-[#F7F5EF]/20 p-1 rounded-full">
                    <Check className="w-5 h-5" />
                  </div>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div 
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="bg-[#F7F5EF] rounded-3xl p-10 lg:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-[#006241]" />
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Flat Rate</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-7xl font-extrabold text-[#006241]">3%</span>
                  <span className="text-xl text-gray-500 font-medium">/ txn</span>
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">*card fee applies</p>
              </div>

              <Link
                to="/signup"
                className="w-full flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all hover:scale-[1.02] shadow-xl mb-6"
              >
                Create free account
              </Link>
              
              <p className="text-center text-sm text-gray-500">
                Start accepting payments in 20 seconds.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
