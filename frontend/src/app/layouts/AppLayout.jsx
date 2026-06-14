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

  const filteredNavigation = baseNavigation.filter((item) => {
    if (item.to === '/analytics') {
      return ['admin', 'teacher', 'recruiter'].includes(user?.role);
    }
    return true;
  });

  const navigation = user?.role === 'admin'
    ? [...filteredNavigation, { to: '/admin/users', label: 'Users', icon: UserRound }]
    : filteredNavigation;

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
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased">
      {/* Sidebar for Desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
              S
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide text-slate-800">SurCodex</p>
              <p className="text-xs text-slate-400 font-semibold">Assessment operations</p>
            </div>
          </div>

          {/* Notification dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100 transition"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
              ) : null}
            </button>

            {/* Premium dropdown panel */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-100 z-50">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Notifications</h4>
                  {unread > 0 && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{unread} unread</span>}
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className={`group relative flex gap-3 p-2.5 rounded-lg border transition ${
                          !item.readAt
                            ? 'bg-slate-50/50 border-slate-100'
                            : 'bg-transparent border-transparent opacity-60'
                        }`}
                      >
                        <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-blue-50 text-blue-600">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <p className="text-xs font-semibold text-slate-800 leading-tight truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.body}</p>
                          <span className="text-[9px] text-slate-400 mt-1.5 block">
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {!item.readAt && (
                          <button
                            onClick={() => markReadMutation.mutate(item.id)}
                            className="absolute right-2 top-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition grid place-items-center rounded bg-slate-100 text-emerald-600 hover:bg-slate-200"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">No notifications yet.</div>
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
                    ? 'bg-blue-50/80 text-blue-600 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-semibold'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <p className="text-sm font-bold text-slate-700">{user?.name || 'Operator'}</p>
          <p className="mt-1 text-xs capitalize text-slate-400 font-semibold">{user?.role || 'student'}</p>
          <button
            onClick={logout}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-sm text-slate-600 font-bold transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Header and Nav for Mobile */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">SurCodex</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
            >
              <Bell className="h-4 w-4" />
              {unread ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" /> : null}
            </button>
            <button onClick={logout} className="rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100 p-2">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {showDropdown && (
          <div className="absolute right-4 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 z-50 shadow-xl shadow-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-bold text-slate-400">Notifications</h4>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-xs ${
                      !item.readAt ? 'bg-slate-50/50 border-slate-100' : 'bg-transparent border-transparent opacity-60'
                    }`}
                  >
                    <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.body}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[8px] text-slate-400">{new Date(item.createdAt).toLocaleTimeString()}</span>
                      {!item.readAt && (
                        <button
                          onClick={() => markReadMutation.mutate(item.id)}
                          className="text-[9px] text-blue-600 hover:underline font-bold"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">No notifications.</div>
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
                  isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 font-bold border border-slate-100'
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
