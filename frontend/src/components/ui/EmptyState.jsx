export const EmptyState = ({ icon: Icon, title, copy, action }) => (
  <div className="glass-panel rounded-lg p-8 text-center">
    {Icon ? (
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-white/10">
        <Icon className="h-5 w-5 text-cyan-200" />
      </div>
    ) : null}
    <p className="mt-4 text-lg font-semibold">{title}</p>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{copy}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
