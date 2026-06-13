export const MetricCard = ({ label, value, trend, icon: Icon }) => (
  <div className="glass-panel rounded-lg p-5" data-reveal>
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-400">{label}</p>
      {Icon ? <Icon className="h-4 w-4 text-cyan-200" /> : null}
    </div>
    <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
    <p className="mt-2 text-xs text-emerald-300">{trend}</p>
  </div>
);
