import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Home, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your email');
      return;
    }
    setIsLoading(true);
    const ok = await login(email, password);
    setIsLoading(false);
    if (ok) {
      success('Welcome back to HomeSync!');
      if (email.toLowerCase().includes('landlord') || email.toLowerCase().includes('vikram')) {
        navigate('/landlord');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const ok = await loginWithGoogle('tenant');
      setIsGoogleLoading(false);
      if (ok) {
        success('Signed in with Google successfully!');
        navigate('/dashboard');
      }
    } catch (e: any) {
      setIsGoogleLoading(false);
      error(e.message || 'Google Sign-In failed');
    }
  };

  const handleQuickDemoLogin = (userKey: 'aanya' | 'vikram') => {
    switchDemoUser(userKey);
    success(`Logged in as ${userKey === 'aanya' ? 'Aanya Sharma (Primary Tenant)' : 'Vikram Singh (Landlord)'}`);
    if (userKey === 'vikram') {
      navigate('/landlord');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sage-600 flex items-center justify-center text-white shadow-subtle">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">HomeSync</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-charcoal-900 dark:text-white">Sign in to your account</h1>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-300">Access your broker-free rentals and household hub</p>
        </div>

        {/* 1-Click Demo Profiles */}
        <div className="bg-sage-50/70 dark:bg-charcoal-800/80 p-4 rounded-2xl border border-sage-200 dark:border-charcoal-700 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sage-900 dark:text-sage-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
              1-Click Demo Logins
            </span>
            <Badge variant="sage" size="sm">HACKATHON PRESETS</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('aanya')}
              className="p-2.5 rounded-xl bg-white dark:bg-charcoal-700 hover:bg-sage-100/60 dark:hover:bg-charcoal-600 border border-sage-300 dark:border-charcoal-600 text-left transition-all shadow-2xs group"
            >
              <p className="text-xs font-bold text-charcoal-900 dark:text-white group-hover:text-sage-800 dark:group-hover:text-sage-300">Aanya Sharma</p>
              <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400">Tenant (Chandigarh 3BHK)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('vikram')}
              className="p-2.5 rounded-xl bg-white dark:bg-charcoal-700 hover:bg-lavender-50 dark:hover:bg-charcoal-600 border border-lavender-300 dark:border-charcoal-600 text-left transition-all shadow-2xs group"
            >
              <p className="text-xs font-bold text-charcoal-900 dark:text-white group-hover:text-lavender-800 dark:group-hover:text-lavender-300">Vikram Singh</p>
              <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400">Landlord & Owner</p>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <Card className="p-6 space-y-4 dark:bg-charcoal-800 dark:border-charcoal-700">
          {/* Continue with Google button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-charcoal-700 hover:bg-charcoal-50 dark:hover:bg-charcoal-600 border border-charcoal-200 dark:border-charcoal-600 rounded-xl text-xs sm:text-sm font-semibold text-charcoal-800 dark:text-white shadow-2xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-charcoal-200 dark:border-charcoal-700 w-full" />
            <span className="bg-white dark:bg-charcoal-800 px-3 text-[11px] uppercase tracking-wider text-charcoal-400 dark:text-charcoal-400 absolute">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-200 block mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-ivory-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-200">Password</label>
                <Link to="/auth/forgot-password" className="text-xs text-sage-600 dark:text-sage-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-ivory-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-subtle"
              isLoading={isLoading}
            >
              Sign In with Email
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-charcoal-500 dark:text-charcoal-400">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-semibold text-sage-700 dark:text-sage-400 hover:underline">
              Create an Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
