import { useQuery } from '@tanstack/react-query';
import { Medal } from 'lucide-react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import { apiClient } from '../../../services/api/client';

export const LeaderboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', 'global'],
    queryFn: async () => (await apiClient.get('/leaderboard?scope=global')).data.data,
  });
  const rows = data?.items || [];

  return (
    <div className="page-shell space-y-6 text-[#0f172a]">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Performance tracking</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Leaderboard</h1>
      </div>
      {error ? <InlineAlert>Leaderboard data could not be loaded.</InlineAlert> : null}
      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((item) => <SkeletonBlock key={item} className="h-16" />)}
        </div>
      ) : rows.length ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-55 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Candidate</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Signal</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-4 text-blue-600 font-bold font-mono">#{row.rank}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">{row.user?.name || 'Anonymous'}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{row.metadata?.signal || row.scope}</td>
                  <td className="px-4 py-4 font-bold text-slate-700 font-mono">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Medal} title="No rankings yet" copy="Evaluated attempts and submissions will populate rankings once leaderboard jobs run." />
      )}
    </div>
  );
};
