export const InlineAlert = ({ title = 'Something went wrong', children }) => (
  <div className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
    <p className="font-semibold">{title}</p>
    {children ? <p className="mt-1 text-rose-100/80">{children}</p> : null}
  </div>
);
