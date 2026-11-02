import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DEMO_PROPERTIES } from '../services/seedData';
import { PropertyCard } from '../components/marketplace/PropertyCard';
import { 
  Home, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Bot, 
  Receipt, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  FileText, 
  Wallet, 
  HeartHandshake,
  Check
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const featuredProperties = DEMO_PROPERTIES.slice(0, 3);

  return (
    <div className="space-y-24">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Zero Brokerage Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>100% BROKER-FREE • ₹0 BROKERAGE GUARANTEE</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-charcoal-900 dark:text-white tracking-tight leading-[1.12]">
            Your space. <br />
            <span className="text-sage-700 dark:text-sage-400">Your people.</span> Your peace.
          </h1>

          <p className="text-base sm:text-lg text-charcoal-600 dark:text-charcoal-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Discover verified homes with zero broker commissions, finalize transparent digital agreements, and effortlessly run your shared household with an intelligent AI personal consultant.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/explore">
              <Button size="lg" variant="primary" icon={<Search className="w-5 h-5" />}>
                Explore Verified Rentals
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" icon={<Home className="w-5 h-5 text-sage-600 dark:text-sage-400" />}>
                Launch Tenant Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-charcoal-200/60 dark:border-charcoal-800 text-center">
            <div>
              <p className="font-display font-bold text-2xl text-charcoal-900 dark:text-white">₹0</p>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">Brokerage Fee</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-charcoal-900 dark:text-white">100%</p>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">Direct Owners</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-charcoal-900 dark:text-white">7-Day</p>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">Deposit Settlement</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-charcoal-900 dark:text-white">24/7</p>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">AI Consultant</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Properties Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="sage" size="sm" className="mb-2">CURATED HOMES</Badge>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
              Verified Direct Listings
            </h2>
            <p className="text-sm text-charcoal-600 dark:text-charcoal-400 mt-1">
              Connect directly with verified property owners without intermediaries.
            </p>
          </div>
          <Link to="/explore" className="text-sm font-semibold text-sage-700 dark:text-sage-400 hover:text-sage-800 dark:hover:text-sage-300 flex items-center gap-1">
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 3. How HomeSync Works — End-to-End Tenancy Journey */}
      <section className="bg-white dark:bg-charcoal-900/60 py-16 border-y border-charcoal-200/60 dark:border-charcoal-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="lavender" size="sm" className="mb-2">FRICTIONLESS WORKFLOW</Badge>
            <h2 className="font-display font-bold text-3xl text-charcoal-900 dark:text-white">
              From Discovery to Harmonious Shared Living
            </h2>
            <p className="text-sm text-charcoal-600 dark:text-charcoal-400 mt-2">
              A continuous, unified digital journey with no manual paperwork or brokerage friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-ivory-50 dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 relative">
              <span className="text-xs font-bold text-sage-600 dark:text-sage-400 tracking-wider">STEP 01</span>
              <div className="w-10 h-10 rounded-xl bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 flex items-center justify-center my-4 font-bold font-display">
                01
              </div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">Zero Broker Discovery</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 leading-relaxed">
                Explore hand-verified properties. See transparent move-in budgets, schedule visits, and contact landlords directly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-ivory-50 dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 relative">
              <span className="text-xs font-bold text-sage-600 dark:text-sage-400 tracking-wider">STEP 02</span>
              <div className="w-10 h-10 rounded-xl bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 flex items-center justify-center my-4 font-bold font-display">
                02
              </div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">Digital Lease Signing</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 leading-relaxed">
                Review automated tenancy agreements, verify covenants, execute digital signatures, and download verified PDF copies.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-ivory-50 dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 relative">
              <span className="text-xs font-bold text-sage-600 dark:text-sage-400 tracking-wider">STEP 03</span>
              <div className="w-10 h-10 rounded-xl bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 flex items-center justify-center my-4 font-bold font-display">
                03
              </div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">Auto Dashboard Activation</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 leading-relaxed">
                Upon agreement activation, HomeSync automatically provisions a dedicated household hub for all roommates.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-ivory-50 dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 relative">
              <span className="text-xs font-bold text-sage-600 dark:text-sage-400 tracking-wider">STEP 04</span>
              <div className="w-10 h-10 rounded-xl bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 flex items-center justify-center my-4 font-bold font-display">
                04
              </div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">AI Shared Living Hub</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-2 leading-relaxed">
                Effortlessly split bills, minimize settlements, balance chore fairness, track supplies, and manage escrow deposits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The HomeSync AI Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-charcoal-900 text-white p-8 sm:p-12 border border-charcoal-800 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-500/20 text-sage-300 border border-sage-500/30 text-xs font-bold">
                <Bot className="w-4 h-4 text-sage-400" />
                SIGNATURE AI ASSISTANT
              </span>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Your Personal Rental & Household Consultant
              </h2>

              <p className="text-sm sm:text-base text-charcoal-300 leading-relaxed">
                HomeSync AI connects directly to authenticated household records. It can calculate optimal debt settlements, assign fair chores based on past workloads, monitor low pantry supplies, and answer lease questions through plain natural language.
              </p>

              <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-charcoal-200">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sage-400" />
                  <span>"Add ₹1200 for groceries and divide it equally"</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sage-400" />
                  <span>"Who owes me money and how can we settle with fewest payments?"</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sage-400" />
                  <span>"Assign kitchen cleaning to the roommate who did the least this week"</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sage-400" />
                  <span>"Explain notice period terms in our rental agreement"</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/dashboard">
                  <Button variant="primary" size="lg" icon={<Sparkles className="w-4 h-4" />}>
                    Try HomeSync AI in Demo Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Chat Mockup */}
            <div className="bg-charcoal-800/80 rounded-2xl border border-charcoal-700 p-5 space-y-4 shadow-float">
              <div className="flex items-center justify-between pb-3 border-b border-charcoal-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sage-600 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">HomeSync AI</p>
                    <p className="text-[10px] text-sage-400">Live Tool-Calling Enabled</p>
                  </div>
                </div>
                <span className="text-[10px] bg-charcoal-700 text-charcoal-300 px-2 py-0.5 rounded-full">
                  Chandigarh 3BHK
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-charcoal-700 text-charcoal-100 ml-auto max-w-[85%]">
                  Who owes me money for rent and bills?
                </div>
                <div className="p-3.5 rounded-xl bg-sage-950/80 border border-sage-800/60 text-ivory-100 max-w-[90%] leading-relaxed">
                  <p className="font-semibold text-sage-300 mb-1">💰 Current Settlement Breakdown:</p>
                  <p>• Riya owes you <strong>₹5,100</strong></p>
                  <p>• Arjun owes you <strong>₹4,400</strong></p>
                  <p>• Mehak owes you <strong>₹4,900</strong></p>
                  <p className="mt-2 text-charcoal-300 text-[11px]">
                    💡 <em>Optimal path calculated: 3 direct transactions will settle all 4 roommates completely.</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits Comparison (Tenants vs Landlords) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="sage" size="sm" className="mb-2">BUILT FOR BOTH PARTIES</Badge>
          <h2 className="font-display font-bold text-3xl text-charcoal-900">
            A Better Deal for Everyone
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Tenants */}
          <Card className="p-8 space-y-5 border-sage-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-sage-700" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-charcoal-900">For Tenants & Roommates</h3>
                <p className="text-xs text-charcoal-500">Save money, live peacefully, avoid awkwardness</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-charcoal-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Save 1-2 Months Rent:</strong> 100% zero brokerage fee guarantee.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Smart Settlement Engine:</strong> Minimizes transfers so bills get settled in one click.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Workload Fairness:</strong> Algorithmic chore points and rotation ensure no single roommate is overwhelmed.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Simulated Deposit Escrow:</strong> Clear move-in vs move-out photos protect your security deposit.</span>
              </li>
            </ul>
          </Card>

          {/* For Landlords */}
          <Card className="p-8 space-y-5 border-lavender-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lavender-100 text-lavender-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-lavender-700" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-charcoal-900">For Property Owners</h3>
                <p className="text-xs text-charcoal-500">Screen high-quality tenants, automate lease lifecycle</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-charcoal-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-lavender-600 shrink-0 mt-0.5" />
                <span><strong>Direct Tenant Reach:</strong> Post listings once, receive verified professional applicants directly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-lavender-600 shrink-0 mt-0.5" />
                <span><strong>Instant Agreement Generation:</strong> Auto-create legal clauses, rent schedules, and notice conditions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-lavender-600 shrink-0 mt-0.5" />
                <span><strong>Streamlined Maintenance:</strong> Categorized photo tickets prevent disputes and coordinate quick repairs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-lavender-600 shrink-0 mt-0.5" />
                <span><strong>Automated Rent Reminders:</strong> Real-time payment ledger and digital receipt generation.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-sage-600 text-white p-8 sm:p-12 text-center space-y-6 shadow-premium relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Ready to Upgrade Your Shared Living Experience?
            </h2>
            <p className="text-sm sm:text-base text-sage-100 leading-relaxed">
              Join thousands of tenants and landlords experiencing modern, broker-free rental harmony. Explore homes or jump straight into the demo environment.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/explore">
                <Button size="lg" className="bg-white text-sage-800 hover:bg-ivory-50 shadow-md">
                  Find Your Next Home
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" className="bg-sage-800 text-white hover:bg-sage-900 border border-sage-700">
                  Open Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
