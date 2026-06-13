export const TextField = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm text-slate-300">{label}</span>
    <input
      className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
      {...props}
    />
  </label>
);
