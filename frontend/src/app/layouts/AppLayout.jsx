import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart3, Bell, Code2, Gauge, LogOut, Medal, Plus, UserRound, Check, MessageSquare } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { apiClient } from '../../services/api/client';
import { useAuthStore } from '../../store/authStore';

const baseNavigation = [
  { to: '/dashboard', label: 'Command', icon: Gauge },
  { to: '/quizzes', label: 'Quizzes', icon: Plus },
  { to: '/coding', label: 'Coding', icon: Code2 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/leaderboard', label: 'Ranks', icon: Medal },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export const AppLayout = () => {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navigation = user?.role === 'admin'
    ? [...baseNavigation, { to: '/admin/users', label: 'Users', icon: UserRound }]
    : baseNavigation;

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await apiClient.get('/notifications?limit=5')).data.data,
    refetchInterval: 10000, // Refresh notifications every 10s
  });

  const unread = notifications?.meta?.unread || 0;
  const items = notifications?.items || [];

  const markReadMutation = useMutation({
    mutationFn: async (id) => (await apiClient.patch(`/notifications/${id}/read`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.24),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(244,114,182,0.18),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_46%,#111827_100%)]" />
      
      {/* Sidebar for Desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-white/[0.035] px-4 py-5 backdrop-blur-2xl lg:block">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
              S
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">SurCodex</p>
              <p className="text-xs text-slate-400">Assessment operations</p>
            </div>
          </div>

          {/* Notification dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/15 transition"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
                </span>
              ) : null}
            </button>

            {/* Premium dropdown panel */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl z-50">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Notifications</h4>
                  {unread > 0 && <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">{unread} unread</span>}
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className={`group relative flex gap-3 p-2.5 rounded-lg border transition ${
                          !item.readAt
                            ? 'bg-white/[0.04] border-white/10'
                            : 'bg-transparent border-transparent opacity-60'
                        }`}
                      >
                        <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-cyan-500/10 text-cyan-400">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <p className="text-xs font-semibold text-white leading-tight truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.body}</p>
                          <span className="text-[9px] text-slate-500 mt-1.5 block">
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {!item.readAt && (
                          <button
                            onClick={() => markReadMutation.mutate(item.id)}
                            className="absolute right-2 top-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition grid place-items-center rounded bg-white/10 text-emerald-400 hover:bg-white/15"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">No notifications yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
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

      {/* Header and Nav for Mobile */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">SurCodex</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative grid h-9 w-9 place-items-center rounded-lg bg-white/10"
            >
              <Bell className="h-4 w-4" />
              {unread ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-300" /> : null}
            </button>
            <button onClick={logout} className="rounded-lg bg-white/10 p-2">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {showDropdown && (
          <div className="absolute right-4 mt-2 w-72 rounded-xl border border-white/10 bg-slate-900 p-4 z-50 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
              <h4 className="text-xs font-semibold text-slate-400">Notifications</h4>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-xs ${
                      !item.readAt ? 'bg-white/[0.04] border-white/10' : 'bg-transparent border-transparent opacity-60'
                    }`}
                  >
                    <p className="font-semibold text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.body}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[8px] text-slate-500">{new Date(item.createdAt).toLocaleTimeString()}</span>
                      {!item.readAt && (
                        <button
                          onClick={() => markReadMutation.mutate(item.id)}
                          className="text-[9px] text-cyan-300 hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-500">No notifications.</div>
              )}
            </div>
          </div>
        )}

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

      {/* Main viewport */}
      <main className="px-4 py-6 lg:ml-72 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
};
