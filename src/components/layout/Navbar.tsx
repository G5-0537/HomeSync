import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../common/Badge';
import { 
  Home, 
  Search, 
  LayoutDashboard, 
  Bell, 
  LogOut, 
  User, 
  Menu, 
  X,
  Building2,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { notifications } = useHousehold();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-40 bg-ivory-50/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-charcoal-200/70 dark:border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-sage-600 flex items-center justify-center text-ivory-50 shadow-subtle group-hover:bg-sage-700 transition-colors">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl text-charcoal-900 dark:text-white tracking-tight">HomeSync</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 text-emerald-800 px-1.5 py-0.5 rounded tracking-wide border border-emerald-300 dark:border-emerald-800">
                  ₹0 Brokerage
                </span>
              </div>
              <p className="text-[10px] text-charcoal-400 dark:text-charcoal-400 font-medium hidden sm:block">Your space. Your people. Your peace.</p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/explore"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/explore') || location.pathname.startsWith('/properties')
                  ? 'text-sage-700 dark:text-sage-400 font-semibold'
                  : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Homes
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/dashboard')
                      ? 'text-sage-700 dark:text-sage-400 font-semibold'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Tenant Dashboard
                </Link>

                <Link
                  to="/landlord"
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/landlord')
                      ? 'text-lavender-700 dark:text-lavender-400 font-semibold'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Landlord Hub
                </Link>
              </>
            )}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white hover:bg-charcoal-100/70 dark:hover:bg-charcoal-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-charcoal-600" />
              )}
            </button>

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white hover:bg-charcoal-100/70 dark:hover:bg-charcoal-800 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-sage-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-charcoal-800 rounded-2xl border border-charcoal-200/80 dark:border-charcoal-700 shadow-float py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-charcoal-100 dark:border-charcoal-700 flex items-center justify-between">
                      <h4 className="font-display font-semibold text-xs text-charcoal-900 dark:text-white uppercase tracking-wider">Household Notifications</h4>
                      <span className="text-[11px] text-sage-700 dark:text-sage-400 font-medium">{unreadCount} new</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-charcoal-50 dark:divide-charcoal-700">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-charcoal-400 text-center">No notifications right now.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-3 text-xs hover:bg-ivory-50 dark:hover:bg-charcoal-700/60 transition-colors ${!n.read ? 'bg-sage-50/40 dark:bg-sage-950/20' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-charcoal-800 dark:text-charcoal-100">{n.title}</span>
                              <span className="text-[10px] text-charcoal-400">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-charcoal-600 dark:text-charcoal-300 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 text-center border-t border-charcoal-100 dark:border-charcoal-700">
                      <button 
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs text-sage-600 dark:text-sage-400 hover:text-sage-800 font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => navigate(role === 'landlord' ? '/landlord' : '/dashboard')}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-charcoal-200/80 dark:border-charcoal-700 bg-white/80 dark:bg-charcoal-800/80 hover:bg-white dark:hover:bg-charcoal-800 cursor-pointer transition-all shadow-2xs"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-sage-300"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-charcoal-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400 capitalize">{user.roles[0]?.replace('_', ' ')}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-800 dark:hover:text-white hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="text-sm font-medium bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-xl shadow-subtle transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-charcoal-200/60 dark:border-charcoal-800 bg-ivory-50 dark:bg-charcoal-900 px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-charcoal-800 dark:text-charcoal-200 hover:bg-charcoal-100 dark:hover:bg-charcoal-800"
          >
            Find Properties
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-charcoal-800 dark:text-charcoal-200 hover:bg-charcoal-100 dark:hover:bg-charcoal-800"
              >
                Tenant Dashboard
              </Link>
              <Link
                to="/landlord"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-charcoal-800 dark:text-charcoal-200 hover:bg-charcoal-100 dark:hover:bg-charcoal-800"
              >
                Landlord Hub
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
