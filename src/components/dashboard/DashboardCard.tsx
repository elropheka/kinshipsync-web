import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ children, className }) => (
  <div className={cn('bg-white rounded-2xl shadow-sm border border-[#D6C8AF]/25', className)}>
    {children}
  </div>
);

export const dashboardInputClass =
  'rounded-xl border-[#D6C8AF]/50 bg-white focus-visible:ring-secondary/30';

export const dashboardSectionTitleClass = 'font-display text-xl text-[#5D2413]';
