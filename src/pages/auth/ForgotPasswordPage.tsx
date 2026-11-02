import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Home, Mail, ArrowLeft, CheckCircle2, RotateCw } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setIsLoading(false);
      setSubmitted(true);
      setResendCooldown(60);
      success('Password reset link sent! Check your inbox.');

      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      error(err.message || 'Could not send reset email');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sage-600 flex items-center justify-center text-white shadow-subtle">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">HomeSync</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-charcoal-900 dark:text-white">Reset your password</h1>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-300">
            Enter your account email to receive a secure Firebase verification & password reset link
          </p>
        </div>

        <Card className="p-6 dark:bg-charcoal-800 dark:border-charcoal-700">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-sage-600 dark:text-sage-400" />
              </div>
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white">Check your email</h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-300 max-w-xs mx-auto leading-relaxed">
                We sent a secure password reset link to <strong>{email}</strong>. Click the link in the message to choose a new password.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleSubmit}
                  className="text-xs text-sage-700 dark:text-sage-400 font-semibold hover:underline flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend reset link'}
                </button>

                <Link to="/auth/login" className="inline-block pt-2">
                  <Button variant="outline" size="sm" className="w-full">Return to Sign In</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-200 block mb-1">Email Address</label>
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

              <div className="p-3 bg-sage-50 dark:bg-sage-950/40 rounded-xl border border-sage-200 dark:border-sage-800 text-[11px] text-sage-800 dark:text-sage-300">
                🔒 Firebase Authentication sends an encrypted email verification link directly to your inbox.
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full font-bold"
                isLoading={isLoading}
              >
                Send Password Reset Link
              </Button>

              <div className="pt-2 text-center">
                <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-800 dark:hover:text-white">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
