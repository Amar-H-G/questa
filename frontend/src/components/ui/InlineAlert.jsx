export const InlineAlert = ({ title = 'Something went wrong', children }) => (
  <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
    <p className="font-semibold text-rose-900">{title}</p>
    {children ? <p className="mt-1 text-rose-700 font-medium">{children}</p> : null}
  </div>
);
