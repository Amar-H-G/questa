import { BarChart3, Code2, Gauge, LogOut, Medal, Plus, UserRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navigation = [
  { to: '/', label: 'Command', icon: Gauge },
  { to: '/quizzes', label: 'Quizzes', icon: Plus },
  { to: '/coding', label: 'Coding', icon: Code2 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/leaderboard', label: 'Ranks', icon: Medal },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export const AppLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.24),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(244,114,182,0.18),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_46%,#111827_100%)]" />
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-white/[0.035] px-4 py-5 backdrop-blur-2xl lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            S
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">SurCodex</p>
            <p className="text-xs text-slate-400">Assessment operations</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-lg shadow-cyan-950/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-white/10 bg-slate-950/60 p-4">
          <p className="text-sm font-medium">{user?.name || 'Operator'}</p>
          <p className="mt-1 text-xs capitalize text-slate-400">{user?.role || 'student'}</p>
          <button
            onClick={logout}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-white/10 text-sm text-slate-200 transition hover:bg-white/15"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">SurCodex</span>
          <button onClick={logout} className="rounded-lg bg-white/10 p-2">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs ${
                  isActive ? 'bg-white text-slate-950' : 'bg-white/10 text-slate-300'
                }`
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="px-4 py-6 lg:ml-72 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
};
