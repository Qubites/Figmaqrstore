import { motion } from "motion/react";
import { ShieldCheck, Landmark } from "lucide-react";

export function Trust() {
  const paymentMethods = [
    { name: "Visa", icon: <span className="font-bold italic text-blue-800 text-2xl">VISA</span> },
    { name: "Mastercard", icon: (
      <div className="flex -space-x-3 items-center opacity-90">
        <div className="w-8 h-8 rounded-full bg-red-500 mix-blend-multiply"></div>
        <div className="w-8 h-8 rounded-full bg-yellow-400 mix-blend-multiply"></div>
      </div>
    )},
    { name: "Amex", icon: <div className="bg-blue-600 text-white font-bold px-2 py-1 rounded text-sm tracking-widest">AMEX</div> },
    { name: "Apple Pay", icon: <span className="font-semibold text-xl flex items-center gap-1"><span className="text-2xl"></span> Pay</span> },
    { name: "Google Pay", icon: <span className="font-semibold text-gray-600 text-xl flex items-center gap-1"><span className="text-xl font-bold text-gray-800">G</span> Pay</span> },
    { name: "PayPal", icon: <span className="font-bold text-blue-900 text-xl italic">PayPal</span> },
  ];

  const banks = [
    { name: "Barclays", color: "text-blue-500" },
    { name: "HSBC", color: "text-red-600" },
    { name: "Monzo", color: "text-coral-500", custom: <span className="text-[#14233C] font-bold text-xl"><span className="text-[#FF4A5A]">M</span>onzo</span> },
    { name: "Revolut", color: "text-black", custom: <span className="font-bold text-xl tracking-tight">Revolut</span> },
    { name: "Lloyds Bank", color: "text-green-700", custom: <span className="text-[#006A4D] font-bold text-lg">LLOYDS BANK</span> }
  ];

  return (
    <section className="w-full bg-white py-24 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Accept every payment method.
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
          Never lose a sale. Customers can pay with exactly what they want, right from their phone.
        </p>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-24">
          {paymentMethods.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#F7F5EF] h-20 w-40 rounded-2xl flex items-center justify-center shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow"
            >
              {logo.icon} <span className="sr-only">{logo.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left bg-[#F7F5EF] rounded-3xl p-10 lg:p-16">
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-[#006241]">
                  <Landmark className="w-7 h-7" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Fast Bank Payouts</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get your funds deposited straight to your local UK bank account seamlessly. Next-day options available.
                </p>
              </div>
            </div>
            {/* Bank Logos Row */}
            <div className="mt-4 pl-[80px]">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Supported Destinations</p>
              <div className="flex flex-wrap gap-6 items-center">
                {banks.map((bank, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  >
                    {bank.custom || <span className={`font-bold text-xl ${bank.color}`}>{bank.name}</span>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-[#006241]">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bank-grade Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Transactions are fully encrypted and securely processed. We don't store raw card numbers, ensuring complete compliance and peace of mind. End-to-end tokenization means zero PCI burden for you.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
