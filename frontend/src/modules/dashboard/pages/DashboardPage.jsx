import { Activity, BarChart3, Clock3, Code2, Trophy, Users, ShieldAlert, Award, Sparkles, BookOpen, Star, ChevronRight, Check, Medal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MetricCard } from '../../../components/ui/MetricCard';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import { apiClient } from '../../../services/api/client';
import { useAuthStore } from '../../../store/authStore';

export const DashboardPage = () => {
  const scope = useGsapReveal();
  const { user } = useAuthStore();
  const role = user?.role || 'student';
  const isStaff = ['admin', 'teacher', 'recruiter'].includes(role);

  const { data } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => (await apiClient.get('/analytics/overview')).data.data,
    enabled: isStaff,
  });

  const { data: myStatsData } = useQuery({
    queryKey: ['my-stats'],
    queryFn: async () => (await apiClient.get('/analytics/my-stats')).data.data,
  });

  const overview = data || { quizzes: 0, submissions: 0, averageScore: 0 };
  const stats = myStatsData || {};

  // Define modules dynamically by role
  const getModulesByRole = () => {
    switch (role) {
      case 'student':
        return [
          { title: 'Quiz Workspace', copy: 'Take timed concept assessments with security telemetry.', href: '/quizzes', icon: BookOpen },
          { title: 'Coding Arena', copy: 'Compile and solve challenges with our Judge0 execution engine.', href: '/coding', icon: Code2 },
          { title: 'Global standings', copy: 'Check your rank standings relative to other candidates.', href: '/leaderboard', icon: Medal },
        ];
      case 'teacher':
        return [
          { title: 'Quiz Studio', copy: 'Draft, publish, and evaluate timed assessments.', href: '/quizzes', icon: BookOpen },
          { title: 'Coding Studio', copy: 'Design coding problems and configure sandbox execution.', href: '/coding', icon: Code2 },
          { title: 'Cohort Insights', copy: 'Analyze scores, averages, and candidate performance.', href: '/analytics', icon: Users },
        ];
      case 'recruiter':
        return [
          { title: 'Recruiter Lens', copy: 'Compare signals, cohorts, completion, and candidate quality.', href: '/analytics', icon: Users },
          { title: 'Global Leaderboard', copy: 'Track verified talent rankings and top performers.', href: '/leaderboard', icon: Trophy },
          { title: 'Coding Library', copy: 'Inspect published coding problems.', href: '/coding', icon: Code2 },
        ];
      case 'admin':
      default:
        return [
          { title: 'Quiz Operations', copy: 'Monitor and review assessments status.', href: '/quizzes', icon: BookOpen },
          { title: 'Compiler Health', copy: 'Review Judge0 submissions queues and sandbox health.', href: '/coding', icon: ShieldAlert },
          { title: 'SaaS Analytics', copy: 'Platform-wide telemetry and performance aggregates.', href: '/analytics', icon: BarChart3 },
        ];
    }
  };

  const modules = getModulesByRole();

  // Custom copy by role
  const getRoleHeroText = () => {
    switch (role) {
      case 'student':
        return {
          subtitle: 'Student Learning Center',
          title: 'Prove your technical capabilities.',
          description: 'Access allocated assessments, compile solutions using Monaco Editor, and check your ranking positions.',
          cta1: 'Solve Challenges',
          cta1Href: '/coding',
          cta2: 'Attempt Quizzes',
          cta2Href: '/quizzes',
        };
      case 'teacher':
        return {
          subtitle: 'Author & Instructor Suite',
          title: 'Create benchmarks for developer assessment.',
          description: 'Design comprehensive technical assessments, evaluate code in real-time, and run advanced scoring aggregates.',
          cta1: 'Create Quiz',
          cta1Href: '/quizzes/new',
          cta2: 'View Cohorts',
          cta2Href: '/analytics',
        };
      case 'recruiter':
        return {
          subtitle: 'Talent Acquisition Console',
          title: 'Track talent potential, speed, and accuracy.',
          description: 'Evaluate candidates performance, analyze average quiz scores, and verify coding test cases coverage.',
          cta1: 'Analyze Cohorts',
          cta1Href: '/analytics',
          cta2: 'Leaderboards',
          cta2Href: '/leaderboard',
        };
      case 'admin':
      default:
        return {
          subtitle: 'Platform Controller Panel',
          title: 'Assess operations and sandbox execution status.',
          description: 'Manage users RBAC access, check Judge0 queuing servers health, and review operational telemetry.',
          cta1: 'System Telemetry',
          cta1Href: '/analytics',
          cta2: 'Assessments Studio',
          cta2Href: '/quizzes',
        };
    }
  };

  const hero = getRoleHeroText();

  return (
    <div ref={scope} className="page-shell space-y-8 text-[#0f172a]">
      {/* Upper Grid: Role-based Greeting & Telemetry */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="relative rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-950 via-[#1e1b4b] to-slate-900 p-6 lg:p-8 text-white overflow-hidden shadow-lg" data-reveal>
          {/* Subtle decoration inside the greeting panel */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 animate-pulse" />
              {hero.subtitle}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl leading-tight">
                {hero.title}
              </h1>
              <p className="max-w-2xl text-xs leading-relaxed text-slate-400 font-semibold">
                {hero.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link className="h-10 px-5 rounded-xl btn-premium-gradient text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15" to={hero.cta1Href}>
                {hero.cta1}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link className="h-10 px-5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 transition flex items-center justify-center" to={hero.cta2Href}>
                {hero.cta2}
              </Link>
            </div>
          </div>
        </div>

        {/* Telemetry Center Panel */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden" data-reveal>
          <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sandbox Telemetry</p>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-5xl font-extrabold text-slate-800 leading-none">99%</p>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">compiler health</span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {[
              { label: 'Sandbox Compiler Latency', value: '0.4s', percentage: 98 },
              { label: 'Security Handshake Index', value: '100%', percentage: 100 },
              { label: 'Notification Relay Queue', value: 'Active', percentage: 95 }
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-[10px] font-bold text-slate-500">
                  <span>{item.label}</span>
                  <span className="text-slate-700">{item.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="grid gap-5 md:grid-cols-3">
        {role === 'student' ? (
          <>
            <MetricCard label="Quizzes Completed" value={stats.quizzesAttempted ?? 0} trend="Proven capabilities" icon={Clock3} />
            <MetricCard label="Problems Solved" value={stats.problemsSolved ?? 0} trend="Accepted compiler runs" icon={Code2} />
            <MetricCard label="Average Quiz Score" value={`${stats.averageQuizScore ?? 0}%`} trend="Overall performance index" icon={Trophy} />
          </>
        ) : (
          <>
            <MetricCard label="Quizzes Created" value={stats.quizzesCreated ?? 0} trend="Benchmarks published" icon={Clock3} />
            <MetricCard label="Problems Created" value={stats.problemsCreated ?? 0} trend="Compiler challenges" icon={Code2} />
            <MetricCard label="Candidates Vetted" value={stats.totalCandidatesAssessed ?? 0} trend="Total cohort assessments" icon={Users} />
          </>
        )}
      </section>

      {/* Action Modules Section */}
      <section className="grid gap-5 lg:grid-cols-3">
        {modules.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/20 group relative overflow-hidden"
            data-reveal
          >
            <div className="absolute top-[-20%] right-[-10%] w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/50 group-hover:scale-105 transition-transform">
              <item.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-base font-extrabold text-slate-800 flex items-center gap-1.5">
              {item.title}
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 font-semibold">{item.copy}</p>
          </Link>
        ))}
      </section>

      {/* Interactive learning streak panel for students, cohort details for recruiters/teachers */}
      {role === 'student' && (
        <section className="glass-panel rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden" data-reveal>
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                Active Streak
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">Complete your daily compiler challenge</h3>
              <p className="text-xs text-slate-500 font-semibold">Take one daily coding problem or quiz to extend your skill matrix consistency metrics.</p>
            </div>
            <div className="flex gap-2.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center border text-xs font-bold ${idx < 4
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                    {idx < 4 ? <Check className="h-3.5 w-3.5" /> : day[0]}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
