import React from "react";
import { motion } from "motion/react";

export default function TermsPage() {
  const lastUpdated = "February 25, 2026";

  const sections = [
    {
      title: "1. Agreement to Terms",
      content: "By accessing or using QrStore, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services."
    },
    {
      title: "2. Description of Service",
      content: "QrStore provides a cloud-based payment facilitation platform that uses QR codes to initiate transactions. We are not a bank, but we partner with regulated payment processors to ensure your funds are handled securely."
    },
    {
      title: "3. Merchant Responsibilities",
      content: "As a seller using QrStore, you are responsible for providing accurate business information, complying with local tax regulations, and delivering the goods or services promised to your customers."
    },
    {
      title: "4. Fees and Payments",
      content: "QrStore charges a transaction-based fee as outlined in our Pricing section. These fees are automatically deducted from your payouts. We reserve the right to change our fees with 30 days' notice."
    },
    {
      title: "5. Prohibited Activities",
      content: "You may not use QrStore for any illegal transactions, including but not limited to the sale of regulated substances without a license, fraudulent activities, or money laundering."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#006241] mb-4 block">Legal</span>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-gray-900 mb-4 leading-none">
            Terms of <span className="text-[#006241]">Service</span>
          </h1>
          <p className="text-gray-500 font-medium mb-16">Last updated: {lastUpdated}</p>

          <div className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-xl shadow-gray-200/50 border border-white">
            <div className="prose prose-emerald max-w-none">
              {sections.map((section, idx) => (
                <div key={idx} className="mb-12 last:mb-0">
                  <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 mb-4">{section.title}</h2>
                  <p className="text-gray-600 font-medium leading-relaxed text-lg">{section.content}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 pt-16 border-t border-gray-100">
              <p className="text-sm text-gray-400 italic">
                Questions about our terms? Contact our legal team at legal@qrstore.app
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
