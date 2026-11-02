import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-ivory-100 border-t border-charcoal-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-charcoal-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sage-500 flex items-center justify-center text-ivory-50">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">HomeSync</span>
            </div>
            <p className="text-sm text-charcoal-300 leading-relaxed">
              Your space. Your people. Your peace.
            </p>
            <p className="text-xs text-charcoal-400">
              The AI-powered broker-free rental ecosystem and shared-living management platform.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                BROKERAGE FEE: ₹0 ALWAYS
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-charcoal-200 uppercase tracking-wider mb-4 font-display">Discover</h4>
            <ul className="space-y-2.5 text-sm text-charcoal-300">
              <li><Link to="/explore" className="hover:text-sage-400 transition-colors">Verified Rental Listings</Link></li>
              <li><Link to="/explore?city=Chandigarh" className="hover:text-sage-400 transition-colors">Chandigarh Homes</Link></li>
              <li><Link to="/explore?city=Bengaluru" className="hover:text-sage-400 transition-colors">Bengaluru Shared Living</Link></li>
              <li><Link to="/explore?city=Mohali" className="hover:text-sage-400 transition-colors">Mohali Penthouses</Link></li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="text-xs font-bold text-charcoal-200 uppercase tracking-wider mb-4 font-display">Shared Living</h4>
            <ul className="space-y-2.5 text-sm text-charcoal-300">
              <li><Link to="/dashboard/expenses" className="hover:text-sage-400 transition-colors">Smart Expense Splitter</Link></li>
              <li><Link to="/dashboard/chores" className="hover:text-sage-400 transition-colors">Fairness Chore Engine</Link></li>
              <li><Link to="/dashboard/inventory" className="hover:text-sage-400 transition-colors">Smart Replenishment</Link></li>
              <li><Link to="/dashboard/deposit" className="hover:text-sage-400 transition-colors">Escrow Deposit Wallet</Link></li>
              <li><Link to="/dashboard/agreement" className="hover:text-sage-400 transition-colors">Digital Lease Agreement</Link></li>
            </ul>
          </div>

          {/* Landlords & Trust */}
          <div>
            <h4 className="text-xs font-bold text-charcoal-200 uppercase tracking-wider mb-4 font-display">Landlords & AI</h4>
            <ul className="space-y-2.5 text-sm text-charcoal-300">
              <li><Link to="/landlord" className="hover:text-sage-400 transition-colors">Direct Listing Hub</Link></li>
              <li><Link to="/landlord/applications" className="hover:text-sage-400 transition-colors">Applicant Screening</Link></li>
              <li><Link to="/landlord/rent" className="hover:text-sage-400 transition-colors">Automated Rent Records</Link></li>
              <li><span className="text-sage-400 font-medium">HomeSync AI Consultant</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 gap-4">
          <p>© 2026 HomeSync Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-charcoal-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-charcoal-200 cursor-pointer">Terms of Tenancy</span>
            <span className="hover:text-charcoal-200 cursor-pointer">Security Deposit Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
