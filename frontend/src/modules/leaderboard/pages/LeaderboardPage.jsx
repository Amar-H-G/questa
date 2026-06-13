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
    <div className="page-shell space-y-6">
      <div>
        <p className="text-sm text-cyan-200">Performance tracking</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Leaderboard</h1>
      </div>
      {error ? <InlineAlert>Leaderboard data could not be loaded.</InlineAlert> : null}
      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((item) => <SkeletonBlock key={item} className="h-16" />)}
        </div>
      ) : rows.length ? (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full border-collapse bg-white/[0.04] text-left text-sm">
            <thead className="bg-white/[0.06] text-slate-400">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-4 py-4 text-cyan-200">#{row.rank}</td>
                  <td className="px-4 py-4 font-medium">{row.user?.name || 'Anonymous'}</td>
                  <td className="px-4 py-4 text-slate-400">{row.metadata?.signal || row.scope}</td>
                  <td className="px-4 py-4">{row.score}</td>
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
