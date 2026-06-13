export const TextField = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
    <input
      className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600"
      {...props}
    />
  </label>
);
