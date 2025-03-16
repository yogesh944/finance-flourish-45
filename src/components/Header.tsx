
import React from 'react';
import { cn } from '@/lib/utils';
import { LineChart, PiggyBank } from 'lucide-react';
import AnimatedWrapper from './AnimatedWrapper';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <AnimatedWrapper className={cn('mb-8', className)}>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <div className="rounded-full p-2 bg-primary/10">
            <PiggyBank className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">FinanceFlow</h1>
            <p className="text-sm text-muted-foreground">Personal Finance Visualizer</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <LineChart className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Analytics</span>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default Header;
