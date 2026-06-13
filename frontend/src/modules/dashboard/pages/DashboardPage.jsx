import { Activity, BarChart3, Clock3, Code2, Trophy, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MetricCard } from '../../../components/ui/MetricCard';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import { apiClient } from '../../../services/api/client';

const modules = [
  { title: 'Quiz Studio', copy: 'Draft, publish, and evaluate timed assessments.', href: '/quizzes', icon: Clock3 },
  { title: 'Coding Arena', copy: 'Queue submissions against an isolated Judge0-ready layer.', href: '/coding', icon: Code2 },
  { title: 'Recruiter Lens', copy: 'Compare signals, cohorts, completion, and candidate quality.', href: '/analytics', icon: Users },
];

export const DashboardPage = () => {
  const scope = useGsapReveal();
  const { data } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => (await apiClient.get('/analytics/overview')).data.data,
  });
  const overview = data || { quizzes: 0, submissions: 0, averageScore: 0 };

  return (
    <div ref={scope} className="page-shell space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="glass-panel rounded-lg p-6 lg:p-8" data-reveal>
          <p className="text-sm font-medium text-cyan-200">Production assessment platform</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white lg:text-6xl">
            Assess technical depth without losing operational clarity.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            SurCodex combines quizzes, coding challenges, analytics, RBAC, and ranking workflows into one focused workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950" to="/quizzes/new">Create quiz</Link>
            <Link className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white" to="/analytics">View analytics</Link>
          </div>
        </div>
        <div className="glass-panel rounded-lg p-6" data-reveal>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Live quality score</p>
            <Activity className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="mt-6 text-6xl font-semibold">94</p>
          <div className="mt-6 space-y-3">
            {['Validation coverage', 'RBAC protection', 'Evaluation health'].map((item, index) => (
              <div key={item}>
                <div className="mb-2 flex justify-between text-xs text-slate-400">
                  <span>{item}</span>
                  <span>{88 + index * 4}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${88 + index * 4}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Assessments" value={overview.quizzes} trend="Drafts and published" icon={BarChart3} />
        <MetricCard label="Submissions" value={overview.submissions} trend="Judge queue ready" icon={Code2} />
        <MetricCard label="Average score" value={`${overview.averageScore}%`} trend="Evaluated attempts" icon={Trophy} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {modules.map((item) => (
          <Link key={item.title} to={item.href} className="glass-panel rounded-lg p-5 transition hover:-translate-y-1 hover:border-cyan-200/40" data-reveal>
            <item.icon className="h-5 w-5 text-cyan-200" />
            <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
          </Link>
        ))}
      </section>
    </div>
  );
};
