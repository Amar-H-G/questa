import React from 'react';

export const MetricCard = ({ label, value, trend, icon: Icon }) => (
  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50/20 transition-all duration-300">
    <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
    <div className="flex items-center justify-between relative z-10">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {Icon ? (
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50 group-hover:scale-105 transition-transform">
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
    </div>
    <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800 relative z-10">{value}</p>
    <p className="mt-2 text-xs text-blue-600 font-bold flex items-center gap-1.5 relative z-10">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {trend}
    </p>
  </div>
);
