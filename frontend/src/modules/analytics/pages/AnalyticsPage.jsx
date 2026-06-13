import { useQuery } from '@tanstack/react-query';
import { Activity, BarChart3, Code2, Users } from 'lucide-react';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { MetricCard } from '../../../components/ui/MetricCard';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import { apiClient } from '../../../services/api/client';

export const AnalyticsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => (await apiClient.get('/analytics/overview')).data.data,
  });

  const overview = data || { users: 0, quizzes: 0, attempts: 0, submissions: 0 };

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="text-sm text-cyan-200">Recruiter insights</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Performance analytics</h1>
      </div>
      {error ? <InlineAlert>Analytics are unavailable for your current role or API state.</InlineAlert> : null}
      {isLoading ? (
        <section className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <SkeletonBlock key={item} className="h-32" />)}
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Users" value={overview.users} trend="Across all roles" icon={Users} />
          <MetricCard label="Quizzes" value={overview.quizzes} trend="Drafts and published" icon={BarChart3} />
          <MetricCard label="Attempts" value={overview.attempts} trend={`${overview.completionRate}% completion`} icon={Activity} />
          <MetricCard label="Submissions" value={overview.submissions} trend={`${overview.acceptanceRate}% accepted`} icon={Code2} />
        </section>
      )}
      <section className="glass-panel rounded-lg p-6">
        <h2 className="text-lg font-semibold">Completion trend</h2>
        <div className="mt-6 flex h-56 items-end gap-3">
          {(overview.trend?.length ? overview.trend : [{ label: 'No data', averageScore: 0 }]).map((point) => (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-cyan-300/80" style={{ height: `${Math.max(point.averageScore, 4)}%` }} />
              <span className="text-xs text-slate-500">{point.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
