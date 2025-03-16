
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedWrapper = ({ 
  children, 
  delay = 0,
  className 
}: AnimatedWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div 
      className={cn(
        'opacity-0',
        isVisible ? 'animate-fade-in' : '',
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedWrapper;
