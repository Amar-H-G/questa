export const Button = ({ className = '', variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-cyan-300 text-slate-950 hover:bg-cyan-200',
    secondary: 'bg-white/10 text-white hover:bg-white/15',
    danger: 'bg-rose-400 text-slate-950 hover:bg-rose-300',
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
