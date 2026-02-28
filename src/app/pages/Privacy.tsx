import React from "react";
import { motion } from "motion/react";

export default function PrivacyPage() {
  const lastUpdated = "February 25, 2026";

  const policies = [
    {
      title: "Data We Collect",
      content: "We collect minimal information necessary to process payments. For sellers, this includes business details and contact info. For customers, we only collect what's required by our payment processors to authorize the transaction."
    },
    {
      title: "How We Use Your Data",
      content: "Your data is used exclusively to facilitate transactions, prevent fraud, and improve our platform. We never sell your personal information to third parties."
    },
    {
      title: "Payment Security",
      content: "We do not store full credit card numbers on our servers. All sensitive payment data is handled by PCI-DSS compliant partners like Stripe and Adyen."
    },
    {
      title: "Your Rights",
      content: "Under GDPR and CCPA, you have the right to access, correct, or delete your personal data. You can request a data export at any time from your dashboard."
    },
    {
      title: "Cookies",
      content: "We use essential cookies to maintain your session and security. We do not use tracking cookies for advertising purposes."
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
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#006241] mb-4 block">Privacy</span>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-gray-900 mb-4 leading-none">
            Privacy <span className="text-[#006241]">Policy</span>
          </h1>
          <p className="text-gray-500 font-medium mb-16">Last updated: {lastUpdated}</p>

          <div className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-xl shadow-gray-200/50 border border-white">
            <div className="prose prose-emerald max-w-none">
              {policies.map((policy, idx) => (
                <div key={idx} className="mb-12 last:mb-0">
                  <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 mb-4">{policy.title}</h2>
                  <p className="text-gray-600 font-medium leading-relaxed text-lg">{policy.content}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 pt-16 border-t border-gray-100">
              <p className="text-sm text-gray-400 italic">
                Concerned about your privacy? Reach out to privacy@qrstore.app
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
