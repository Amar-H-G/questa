import React from 'react';

export const MetricCard = ({ label, value, trend, icon: Icon }) => (
  <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/20 transition-all duration-300" data-reveal>
    <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {Icon ? (
        <div className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/50 group-hover:scale-105 transition-transform">
          <Icon className="h-4.5 w-4.5" />
        </div>
      ) : null}
    </div>
    <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800">{value}</p>
    <p className="mt-2 text-xs text-indigo-600 font-bold flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {trend}
    </p>
  </div>
);
