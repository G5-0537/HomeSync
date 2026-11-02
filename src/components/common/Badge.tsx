import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sage' | 'lavender' | 'charcoal' | 'brokerage' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  icon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  size = 'md',
  icon = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
  };

  const variantStyles = {
    sage: 'bg-sage-100 text-sage-800 border border-sage-200/80',
    lavender: 'bg-lavender-100 text-lavender-700 border border-lavender-200/80',
    charcoal: 'bg-charcoal-100 text-charcoal-800 border border-charcoal-200/80',
    brokerage: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold tracking-wider',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {variant === 'brokerage' && <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />}
      {icon && variant !== 'brokerage' && <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />}
      {children}
    </span>
  );
};
