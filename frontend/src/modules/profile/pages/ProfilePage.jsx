import { useAuthStore } from '../../../store/authStore';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="page-shell max-w-3xl">
      <section className="glass-panel rounded-lg p-6">
        <p className="text-sm text-cyan-200">Account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{user?.name}</h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-white/5 p-4">
            <dt className="text-xs text-slate-500">Email</dt>
            <dd className="mt-1 text-sm">{user?.email}</dd>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <dt className="text-xs text-slate-500">Role</dt>
            <dd className="mt-1 text-sm capitalize">{user?.role}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};
