import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, description, trend, trendType = 'neutral' }) => {
  const getTrendStyles = () => {
    switch (trendType) {
      case 'up':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30';
      case 'down':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
      default:
        return 'text-slate-500 bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900">
      {/* Decorative gradient overlay */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/5 blur-xl group-hover:bg-brand-500/10 transition-all duration-500" />
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${getTrendStyles()}`}>
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default DashboardCard;
