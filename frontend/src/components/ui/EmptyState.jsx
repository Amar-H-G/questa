export const EmptyState = ({ icon: Icon, title, copy, action }) => (
  <div className="glass-panel rounded-xl p-8 text-center">
    {Icon ? (
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
    ) : null}
    <p className="mt-4 text-lg font-bold text-slate-800">{title}</p>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 font-medium">{copy}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
