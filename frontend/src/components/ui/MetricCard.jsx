export const MetricCard = ({ label, value, trend, icon: Icon }) => (
  <div className="glass-panel rounded-xl p-5" data-reveal>
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {Icon ? (
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
    </div>
    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-800">{value}</p>
    <p className="mt-2 text-xs text-emerald-600 font-semibold">{trend}</p>
  </div>
);
