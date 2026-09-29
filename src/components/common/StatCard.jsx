import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, trend, color = 'emerald' }) => {
  const colorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800',
    red: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800',
    blue: 'bg-sky-500/10 text-sky-600 border-sky-200 dark:border-sky-800',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800'
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${colorStyles[color] || colorStyles.emerald}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {trend}
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-xs text-slate-500 font-medium">{subtext}</p>}
    </div>
  );
};
