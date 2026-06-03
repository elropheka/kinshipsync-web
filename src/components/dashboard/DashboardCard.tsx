import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ children, className }) => (
  <div className={cn('bg-card rounded-2xl shadow-sm border border-border/40', className)}>
    {children}
  </div>
);

export const dashboardInputClass =
  'rounded-xl border-border bg-card text-foreground focus-visible:ring-secondary/30';

export const dashboardSectionTitleClass = 'font-display text-xl text-foreground';
