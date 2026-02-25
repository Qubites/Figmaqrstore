import { motion } from "motion/react";
import { QrCode, Smartphone, Check, CreditCard } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Seller shows QR",
      description: "Log in and create your first product. A unique QR code instantly appears on your screen.",
      icon: <QrCode className="w-8 h-8 text-[#006241]" />,
      delay: 0,
    },
    {
      title: "Customer pays",
      description: "Customers scan with any phone camera and pay securely using Apple Pay, Google Pay, or card.",
      icon: <Smartphone className="w-8 h-8 text-[#006241]" />,
      delay: 0.2,
    },
    {
      title: "Seller sees Paid",
      description: "Instant confirmation appears on your screen. The funds are routed to your local bank.",
      icon: <Check className="w-8 h-8 text-[#006241]" />,
      delay: 0.4,
    }
  ];

  return (
    <section id="how-it-works" className="w-full bg-white py-24 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Get paid in 3 simple steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We removed the friction. No clunky card readers, no pairing devices, no downloading apps. Just scan and pay.
          </p>
        </div>

        {/* Animated Sequence "Video" Block */}
        <div className="max-w-4xl mx-auto mb-20 bg-[#F7F5EF] rounded-[2rem] p-6 lg:p-12 shadow-inner border border-gray-100 overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative z-10">
            
            {/* Step 1: Seller Device */}
            <motion.div 
              className="w-48 h-80 bg-white rounded-[2rem] border-[6px] border-gray-900 shadow-xl relative overflow-hidden flex flex-col"
              animate={{ 
                scale: [1, 1.05, 1, 1],
                opacity: [1, 1, 0.5, 1] 
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="bg-[#006241] h-12 w-full flex items-end justify-center pb-2">
                <span className="text-white text-xs font-semibold">Seller Screen</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="text-2xl font-bold mb-4">$12.00</div>
                <div className="w-24 h-24 bg-gray-100 rounded-lg p-2 border border-gray-200 flex items-center justify-center relative">
                  <QrCode className="w-16 h-16 text-gray-800 opacity-80" />
                  {/* Scan overlay animation */}
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-1 bg-[#006241] blur-[2px]"
                    animate={{ y: [0, 96, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Connecting Arrow */}
            <motion.div 
              className="hidden md:flex items-center text-[#006241]"
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <div className="w-16 h-1 bg-[#006241]/30 rounded-full relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 border-t-4 border-r-4 border-[#006241]/30 rotate-45" />
              </div>
            </motion.div>

            {/* Step 2: Customer Device */}
            <motion.div 
              className="w-48 h-80 bg-gray-900 rounded-[2rem] border-[6px] border-gray-800 shadow-xl relative overflow-hidden flex flex-col justify-end p-4"
              animate={{ 
                scale: [0.95, 1, 1.05, 0.95],
                opacity: [0.5, 1, 1, 0.5] 
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
            >
              <div className="absolute top-6 w-full text-center text-white/50 text-xs font-medium">Customer Screen</div>
              <motion.div 
                className="bg-white rounded-2xl p-4 w-full text-center flex flex-col items-center gap-2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: [50, 0, 0, 50], opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
              >
                <div className="text-xl font-bold text-gray-900">$12.00</div>
                <div className="w-full bg-black text-white rounded-full py-2 flex items-center justify-center gap-1 text-sm font-semibold">
                  <span className="text-lg leading-none"></span> Pay
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Steps Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#006241]/10 via-[#006241]/40 to-[#006241]/10 -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: step.delay }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 bg-[#F7F5EF] rounded-full border-4 border-white shadow-xl flex items-center justify-center mb-6 relative overflow-hidden transition-transform group-hover:scale-110 duration-300">
                <div className="absolute inset-0 bg-[#006241]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed px-4">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
