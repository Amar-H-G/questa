import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BarChart3, Bell, Code2, Gauge, LogOut, Medal, 
  Plus, UserRound, Check, MessageSquare, ChevronDown, 
  BookOpen, Sparkles, Award
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { apiClient } from '../../services/api/client';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../../components/ui/Logo';

const baseNavigation = [
  { to: '/dashboard', label: 'Command Hub', icon: Gauge },
  { to: '/quizzes', label: 'Quizzes', icon: BookOpen },
  { to: '/coding', label: 'Coding Arena', icon: Code2 },
  { to: '/analytics', label: 'Insights Console', icon: BarChart3 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Medal },
  { to: '/profile', label: 'Profile Settings', icon: UserRound },
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
    ? [...filteredNavigation, { to: '/admin/users', label: 'Users Console', icon: UserRound }]
    : filteredNavigation;

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await apiClient.get('/notifications?limit=5')).data.data,
    refetchInterval: 10000,
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
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased flex flex-col">
      {/* Sidebar for Desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:flex flex-col justify-between z-30">
        <div className="space-y-8">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <Logo size={36} />
              <div>
                <p className="text-sm font-extrabold tracking-tight text-slate-800">SurCodex</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assessment Ops</p>
              </div>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/80 transition shadow-sm"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 ? (
                  <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                ) : null}
              </button>

              {/* Notification drop panel */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-float-2">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent Notifications</h4>
                    {unread > 0 && <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{unread} unread</span>}
                  </div>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className={`group relative flex gap-3 p-3 rounded-xl border transition ${
                            !item.readAt
                              ? 'bg-blue-50/20 border-blue-100'
                              : 'bg-transparent border-transparent opacity-60'
                          }`}
                        >
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <p className="text-xs font-bold text-slate-800 leading-snug truncate">{item.title}</p>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.body}</p>
                            <span className="text-[9px] text-slate-400 mt-1.5 block font-medium">
                              {new Date(item.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          {!item.readAt && (
                            <button
                              onClick={() => markReadMutation.mutate(item.id)}
                              className="absolute right-2 top-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition grid place-items-center rounded bg-slate-100 text-emerald-600 hover:bg-slate-200 border border-slate-200"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-slate-400 font-semibold">All caught up! No notifications.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3.5 rounded-xl px-4 text-xs tracking-wide transition relative group ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600 font-bold border border-blue-100/50'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-bold'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile footer info */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-4">
          <div className="flex items-center gap-3">
            {user?.profile?.avatar && user.profile.avatar.length > 10 ? (
              <img src={user.profile.avatar} alt="Profile" className="h-9 w-9 rounded-xl object-cover border border-slate-200 shadow-md shadow-blue-600/10" />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-blue-600/10">
                {user?.name ? user.name[0].toUpperCase() : 'O'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-none">{user?.name || 'Operator'}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600 border border-blue-100 mt-1 capitalize leading-none">
                <Sparkles className="h-2 w-2" />
                {user?.role || 'student'}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 text-xs text-slate-500 hover:text-rose-600 font-bold transition border border-slate-200 shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Header and navigation for mobile */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-4 py-3.5 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between">
          <Logo size={28} showText={true} textClass="text-slate-800 text-sm font-extrabold" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
            >
              <Bell className="h-4 w-4" />
              {unread ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
            </button>
            <button onClick={logout} className="rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 p-2">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {showDropdown && (
          <div className="absolute right-4 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 z-50 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notifications</h4>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border text-[11px] ${
                      !item.readAt ? 'bg-blue-50/20 border-blue-100' : 'bg-transparent border-transparent opacity-60'
                    }`}
                  >
                    <p className="font-bold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{item.body}</p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[8px] text-slate-400 font-medium">{new Date(item.createdAt).toLocaleTimeString()}</span>
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
                <div className="text-center py-4 text-xs text-slate-400 font-semibold">No notifications.</div>
              )}
            </div>
          </div>
        )}

        <nav className="mt-3.5 flex gap-2 overflow-x-auto pb-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `inline-flex h-9 shrink-0 items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition border ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border-blue-100' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                }`
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main content wrapper */}
      <main className="px-4 py-6 lg:ml-72 lg:px-8 lg:py-8 flex-1 flex flex-col justify-start">
        <Outlet />
      </main>
    </div>
  );
};
