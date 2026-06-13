import { useAuthStore } from '../../../store/authStore';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="page-shell max-w-3xl text-[#0f172a]">
      <section className="border border-slate-200 bg-white rounded-2xl p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Account</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">{user?.name}</h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</dt>
            <dd className="mt-1 text-sm font-bold text-slate-800">{user?.email}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</dt>
            <dd className="mt-1 text-sm font-bold text-slate-800 capitalize">{user?.role}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};
