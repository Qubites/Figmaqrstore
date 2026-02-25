import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex gap-4 items-center mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#006241] flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <span className="font-semibold text-xl tracking-tight text-gray-900">QrStore</span>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-500 font-medium mb-8">
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#use-cases" className="hover:text-gray-900 transition-colors">Use Cases</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
        </nav>
        
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} QrStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
