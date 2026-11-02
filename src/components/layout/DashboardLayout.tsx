import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Receipt, 
  CheckSquare, 
  PackageOpen, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  ClipboardCheck, 
  Wrench, 
  Users, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { household } = useHousehold();
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/expenses', label: 'Shared Expenses', icon: Receipt },
    { to: '/dashboard/chores', label: 'Chores & Fairness', icon: CheckSquare },
    { to: '/dashboard/inventory', label: 'Pantry & Inventory', icon: PackageOpen },
    { to: '/dashboard/rent', label: 'Rent Payments', icon: CreditCard },
    { to: '/dashboard/agreement', label: 'Rental Agreement', icon: FileText },
    { to: '/dashboard/deposit', label: 'Security Deposit', icon: ShieldCheck },
    { to: '/dashboard/inspection', label: 'Condition Inspection', icon: ClipboardCheck },
    { to: '/dashboard/maintenance', label: 'Maintenance', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 dark:bg-charcoal-900 flex flex-col md:flex-row transition-colors">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-charcoal-800 border-r border-charcoal-200/80 dark:border-charcoal-700 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex flex-col justify-between transition-colors">
        <div className="p-4 space-y-6">
          {/* Household Info Card */}
          <div className="p-3.5 rounded-2xl bg-ivory-50 dark:bg-charcoal-900/60 border border-charcoal-100 dark:border-charcoal-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-wider text-sage-700 dark:text-sage-400 uppercase">Active Household</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white truncate">
              {household?.propertyName || 'Chandigarh 3BHK Residence'}
            </h3>
            <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 truncate mt-0.5">
              {household?.propertyAddress || 'Sector 35-C, Chandigarh'}
            </p>

            {/* Roommates mini avatars */}
            <div className="mt-3 pt-3 border-t border-charcoal-200/50 dark:border-charcoal-700 flex items-center justify-between">
              <div className="flex -space-x-1.5 overflow-hidden">
                {household?.members.map(m => (
                  <img
                    key={m.uid}
                    src={m.avatar}
                    alt={m.name}
                    title={m.name}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-charcoal-800 object-cover"
                  />
                ))}
              </div>
              <span className="text-[11px] text-charcoal-600 dark:text-charcoal-300 font-medium">
                {household?.members.length} Roommates
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sage-600 text-white shadow-subtle'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white hover:bg-ivory-50 dark:hover:bg-charcoal-700/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-charcoal-100 dark:border-charcoal-700 bg-ivory-50/50 dark:bg-charcoal-900/30">
          <Link
            to="/explore"
            className="flex items-center justify-between text-xs text-charcoal-600 dark:text-charcoal-300 hover:text-sage-700 dark:hover:text-sage-400 font-medium"
          >
            <span>Browse Other Homes</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
