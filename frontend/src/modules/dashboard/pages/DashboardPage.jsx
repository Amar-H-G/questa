import { Activity, BarChart3, Clock3, Code2, Trophy, Users, ShieldAlert, Award } from 'lucide-react';
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
          { title: 'Quiz Workspace', copy: 'Take timed assessments with automated progress monitoring.', href: '/quizzes', icon: Clock3 },
          { title: 'Coding Arena', copy: 'Compile and solve challenges with our Judge0 execution engine.', href: '/coding', icon: Code2 },
          { title: 'Global standings', copy: 'Check your ranking position relative to other candidates.', href: '/leaderboard', icon: Award },
        ];
      case 'teacher':
        return [
          { title: 'Quiz Studio', copy: 'Draft, publish, and evaluate timed assessments.', href: '/quizzes', icon: Clock3 },
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
          { title: 'Quiz Operations', copy: 'Monitor and review assessments status.', href: '/quizzes', icon: Clock3 },
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
          subtitle: 'Candidate Assessment Hub',
          title: 'Prove your technical capabilities.',
          description: 'Access allocated assessments, compile solutions using Monaco Editor, and check your rank standings.',
          cta1: 'Solve Coding Challenges',
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
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="glass-panel rounded-xl p-6 lg:p-8" data-reveal>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{hero.subtitle}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-800 lg:text-5xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500 font-medium">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/10 transition" to={hero.cta1Href}>
              {hero.cta1}
            </Link>
            <Link className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200/80 border border-slate-100 transition" to={hero.cta2Href}>
              {hero.cta2}
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 flex flex-col justify-between" data-reveal>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Health status</p>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-4 text-5xl font-bold text-slate-800">98%</p>
          </div>
          <div className="space-y-3 mt-6">
            {['Compiler Uptime', 'RBAC security check', 'SMTP Mail Service'].map((item, index) => (
              <div key={item}>
                <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                  <span>{item}</span>
                  <span>{95 + index * 2}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${95 + index * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="grid gap-4 md:grid-cols-3">
        {role === 'student' ? (
          <>
            <MetricCard label="Quizzes Completed" value={stats.quizzesAttempted ?? 0} trend="Your quiz attempts" icon={Clock3} />
            <MetricCard label="Problems Solved" value={stats.problemsSolved ?? 0} trend="Accepted coding solutions" icon={Code2} />
            <MetricCard label="Average Quiz Score" value={`${stats.averageQuizScore ?? 0}%`} trend="Across all attempts" icon={Trophy} />
          </>
        ) : (
          <>
            <MetricCard label="Quizzes Created" value={stats.quizzesCreated ?? 0} trend="Designed by you" icon={Clock3} />
            <MetricCard label="Problems Created" value={stats.problemsCreated ?? 0} trend="Challenges authored by you" icon={Code2} />
            <MetricCard label="Candidates Assessed" value={stats.totalCandidatesAssessed ?? 0} trend="Attempts on your quizzes" icon={Users} />
          </>
        )}
      </section>

      {/* Action Modules Section */}
      <section className="grid gap-4 lg:grid-cols-3">
        {modules.map((item) => (
          <Link key={item.title} to={item.href} className="glass-panel rounded-xl p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md hover:shadow-blue-50/50" data-reveal>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <item.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-700">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 font-medium">{item.copy}</p>
          </Link>
        ))}
      </section>
    </div>
  );
};
