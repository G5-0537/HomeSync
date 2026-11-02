import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Home, 
  Users, 
  CreditCard, 
  Wrench, 
  ShieldCheck
} from 'lucide-react';

export const LandlordLayout: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/landlord', label: 'Overview', icon: Building2, end: true },
    { to: '/landlord/properties', label: 'My Listings', icon: Home },
    { to: '/landlord/applications', label: 'Rental Applications', icon: Users },
    { to: '/landlord/rent', label: 'Rent Collection', icon: CreditCard },
    { to: '/landlord/maintenance', label: 'Maintenance Requests', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 dark:bg-charcoal-900 flex flex-col md:flex-row transition-colors">
      {/* Landlord Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-charcoal-800 border-r border-charcoal-200/80 dark:border-charcoal-700 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex flex-col justify-between transition-colors">
        <div className="p-4 space-y-6">
          {/* Landlord Profile Card */}
          <div className="p-4 rounded-2xl bg-lavender-50 dark:bg-lavender-950/30 border border-lavender-200/70 dark:border-lavender-900/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-lavender-800 dark:text-lavender-300 uppercase bg-white/80 dark:bg-charcoal-800 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-lavender-600 dark:text-lavender-400" />
                Verified Landlord
              </span>
            </div>
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">
              {user?.name || 'Vikram Singh'}
            </h3>
            <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-0.5">
              Portfolio: 4 Properties Listed
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-lavender-600 text-white shadow-subtle'
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

        <div className="p-4 border-t border-charcoal-100 dark:border-charcoal-700 bg-ivory-50/50 dark:bg-charcoal-900/30">
          <Link
            to="/dashboard"
            className="flex items-center justify-between text-xs text-charcoal-600 dark:text-charcoal-300 hover:text-sage-700 dark:hover:text-sage-400 font-medium"
          >
            <span>Switch to Tenant View</span>
            <span className="text-[10px] bg-charcoal-100 dark:bg-charcoal-700 dark:text-charcoal-300 px-1.5 py-0.5 rounded">Preview</span>
          </Link>
        </div>
      </aside>

      {/* Main Landlord Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
