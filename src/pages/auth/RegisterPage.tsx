import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Home, Mail, Lock, User, Building2, Users, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('tenant');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      error('Please complete all required fields');
      return;
    }
    setIsLoading(true);
    const { success: ok, verificationSent } = await register(name, email, password, selectedRole);
    setIsLoading(false);
    if (ok) {
      if (verificationSent) {
        success('Account created! A verification link was sent to your email.');
      } else {
        success('Account created! Welcome to HomeSync.');
      }
      if (selectedRole === 'landlord') {
        navigate('/landlord');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const ok = await loginWithGoogle(selectedRole);
      setIsGoogleLoading(false);
      if (ok) {
        success('Registered and signed in with Google!');
        navigate(selectedRole === 'landlord' ? '/landlord' : '/dashboard');
      }
    } catch (e: any) {
      setIsGoogleLoading(false);
      error(e.message || 'Google Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sage-600 flex items-center justify-center text-white shadow-subtle">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">HomeSync</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-charcoal-900 dark:text-white">Create your HomeSync account</h1>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-300">Zero brokerage rentals & AI-driven co-living management</p>
        </div>

        <Card className="p-6 space-y-4 dark:bg-charcoal-800 dark:border-charcoal-700">
          {/* Role selector */}
          <div>
            <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-200 block mb-1.5">I am registering as:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('tenant')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  selectedRole === 'tenant'
                    ? 'border-sage-600 bg-sage-50 dark:bg-sage-950/40 text-sage-900 dark:text-sage-200 shadow-xs'
                    : 'border-charcoal-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-50'
                }`}
              >
                <Users className="w-4 h-4 text-sage-600" />
                <div>
                  <p className="text-xs font-bold">Tenant</p>
                  <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400">Rent & Share Living</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('landlord')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  selectedRole === 'landlord'
                    ? 'border-lavender-600 bg-lavender-50 dark:bg-lavender-950/40 text-lavender-900 dark:text-lavender-200 shadow-xs'
                    : 'border-charcoal-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-lavender-600" />
                <div>
                  <p className="text-xs font-bold">Landlord</p>
                  <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400">List Direct & Manage</p>
                </div>
              </button>
            </div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
              or register with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-200 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aanya Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-ivory-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl pl-9 pr-3 py-2 text-sm text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                />
              </div>
            </div>

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
              <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-200 block mb-1">Password</label>
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

            <div className="p-3 rounded-xl bg-sage-50 dark:bg-sage-950/40 border border-sage-200 dark:border-sage-800 text-[11px] text-sage-800 dark:text-sage-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0 mt-0.5" />
              <span>
                A secure verification link will be sent to your email to verify identity and enable digital lease signing.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-subtle"
              isLoading={isLoading}
            >
              Get Started with HomeSync
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-charcoal-500 dark:text-charcoal-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-sage-700 dark:text-sage-400 hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
