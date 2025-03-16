
import React from 'react';
import { cn } from '@/lib/utils';

interface ChipBadgeProps {
  children: React.ReactNode;
  type?: 'default' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

const ChipBadge = ({ 
  children, 
  type = 'default',
  className
}: ChipBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
        type === 'default' && 'bg-primary/10 text-primary',
        type === 'success' && 'bg-finance-income/10 text-finance-income',
        type === 'error' && 'bg-finance-expense/10 text-finance-expense',
        type === 'warning' && 'bg-yellow-100 text-yellow-800',
        type === 'neutral' && 'bg-finance-neutral/10 text-finance-neutral',
        className
      )}
    >
      {children}
    </span>
  );
};

export default ChipBadge;
