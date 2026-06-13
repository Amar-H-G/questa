import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, BarChart3, Code2, Users, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { MetricCard } from '../../../components/ui/MetricCard';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import { apiClient } from '../../../services/api/client';
import { Button } from '../../../components/ui/Button';

export const AnalyticsPage = () => {
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [cheatedOnly, setCheatedOnly] = useState('');
  const [minScore, setMinScore] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => (await apiClient.get('/analytics/overview')).data.data,
  });

  const { data: quizzesData } = useQuery({
    queryKey: ['quizzes-list-analytics'],
    queryFn: async () => (await apiClient.get('/quizzes')).data.data,
  });

  const quizzes = quizzesData || [];
  const overview = data || { users: 0, quizzes: 0, attempts: 0, submissions: 0 };

  const handleExport = (type) => {
    const params = new URLSearchParams();
    if (selectedQuiz) params.append('quizId', selectedQuiz);
    if (cheatedOnly) params.append('cheated', cheatedOnly);
    if (minScore) params.append('scoreMin', minScore);

    const token = localStorage.getItem('token');
    const endpoint = type === 'pdf' ? '/analytics/export-pdf' : '/analytics/export';
    const downloadUrl = `${apiClient.defaults.baseURL}${endpoint}?${params.toString()}&token=${token}`;
    
    // Open in new window or download directly
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="page-shell space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-200">Recruiter insights</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Performance analytics</h1>
        </div>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Completion Trend Graph */}
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

        {/* Analytical Exports Console */}
        <section className="glass-panel rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Download className="h-5 w-5 text-cyan-300" />
            Report Export Center
          </h2>
          <p className="text-xs text-slate-400">Generate formatted spreadsheets or signature PDF reports containing assessment outcomes, candidate marks, and integrity indicators.</p>
          
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Filter by Quiz</label>
                <select
                  value={selectedQuiz}
                  onChange={(e) => setSelectedQuiz(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 text-xs rounded p-2 text-slate-300 outline-none focus:border-cyan-400"
                >
                  <option value="">All Quizzes</option>
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Cheated Telemetry Status</label>
                <select
                  value={cheatedOnly}
                  onChange={(e) => setCheatedOnly(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 text-xs rounded p-2 text-slate-300 outline-none focus:border-cyan-400"
                >
                  <option value="">All Candidates</option>
                  <option value="true">Cheating Flagged</option>
                  <option value="false">Clear Records</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Minimum score threshold (%)</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 text-xs rounded p-2 text-slate-300 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <Button
                onClick={() => handleExport('csv')}
                className="flex items-center justify-center gap-2 text-xs h-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export CSV Spreadsheet
              </Button>
              <Button
                onClick={() => handleExport('pdf')}
                className="flex items-center justify-center gap-2 text-xs h-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20"
              >
                <FileText className="h-4 w-4" />
                Export PDF Standings
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
