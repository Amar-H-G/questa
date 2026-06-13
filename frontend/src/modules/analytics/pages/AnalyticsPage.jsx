import { useQuery } from '@tanstack/react-query';
import { Activity, BarChart3, Code2, Users } from 'lucide-react';
import { MetricCard } from '../../../components/ui/MetricCard';
import { apiClient } from '../../../services/api/client';

export const AnalyticsPage = () => {
  const { data } = useQuery({
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
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Users" value={overview.users} trend="Across all roles" icon={Users} />
        <MetricCard label="Quizzes" value={overview.quizzes} trend="Drafts and published" icon={BarChart3} />
        <MetricCard label="Attempts" value={overview.attempts} trend="Evaluated automatically" icon={Activity} />
        <MetricCard label="Submissions" value={overview.submissions} trend="Judge queue ready" icon={Code2} />
      </section>
      <section className="glass-panel rounded-lg p-6">
        <h2 className="text-lg font-semibold">Completion trend</h2>
        <div className="mt-6 flex h-56 items-end gap-3">
          {[42, 66, 58, 78, 73, 88, 91].map((height, index) => (
            <div key={height + index} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-cyan-300/80" style={{ height: `${height}%` }} />
              <span className="text-xs text-slate-500">D{index + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
