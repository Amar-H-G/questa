import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Activity, BarChart3, Code2, Users, Download, FileSpreadsheet, FileText, ShieldAlert } from 'lucide-react';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { MetricCard } from '../../../components/ui/MetricCard';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import { apiClient } from '../../../services/api/client';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';

export const AnalyticsPage = () => {
  const { user } = useAuthStore();
  const isAuthorized = ['admin', 'teacher', 'recruiter'].includes(user?.role);

  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [cheatedOnly, setCheatedOnly] = useState('');
  const [minScore, setMinScore] = useState('');

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-5 shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Restricted Access</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500 font-medium leading-relaxed">
          The performance analytics dashboard contains recruiter insights, test standings, and telemetry reports. It is restricted to administrators, teachers, and recruiters.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/10"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => (await apiClient.get('/analytics/overview')).data.data,
  });

  const { data: quizzesData } = useQuery({
    queryKey: ['quizzes-list-analytics'],
    queryFn: async () => (await apiClient.get('/quizzes')).data.data,
  });

  const quizzes = quizzesData?.items || [];
  const overview = data || { users: 0, quizzes: 0, attempts: 0, submissions: 0 };

  const handleExport = (type) => {
    const params = new URLSearchParams();
    if (selectedQuiz) params.append('quizId', selectedQuiz);
    if (cheatedOnly) params.append('cheated', cheatedOnly);
    if (minScore) params.append('scoreMin', minScore);

    const token = useAuthStore.getState().accessToken;
    const endpoint = type === 'pdf' ? '/analytics/export-pdf' : '/analytics/export';
    const downloadUrl = `${apiClient.defaults.baseURL}${endpoint}?${params.toString()}&token=${token}`;
    
    // Open in new window or download directly
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="page-shell space-y-6 text-[#0f172a]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Recruiter insights</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Performance analytics</h1>
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
        <section className="border border-slate-200 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-700">Completion trend</h2>
          <div className="mt-6 flex h-56 items-end gap-3">
            {(overview.trend?.length ? overview.trend : [{ label: 'No data', averageScore: 0 }]).map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex-1 flex items-end relative min-h-0">
                  <div className="w-full rounded-t-lg bg-blue-600/80" style={{ height: `${Math.max(point.averageScore, 4)}%` }} />
                </div>
                <span className="text-xs text-slate-500 font-semibold shrink-0">{point.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Analytical Exports Console */}
        <section className="border border-slate-200 bg-white rounded-xl p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Report Export Center
          </h2>
          <p className="text-xs text-slate-500 font-medium">Generate formatted spreadsheets or signature PDF reports containing assessment outcomes, candidate marks, and integrity indicators.</p>
          
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Filter by Quiz</label>
                <select
                  value={selectedQuiz}
                  onChange={(e) => setSelectedQuiz(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-600"
                >
                  <option value="">All Quizzes</option>
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Cheated Telemetry Status</label>
                <select
                  value={cheatedOnly}
                  onChange={(e) => setCheatedOnly(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-600"
                >
                  <option value="">All Candidates</option>
                  <option value="true">Cheating Flagged</option>
                  <option value="false">Clear Records</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Minimum score threshold (%)</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <Button
                onClick={() => handleExport('csv')}
                className="flex items-center justify-center gap-2 text-xs h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold w-full"
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0" />
                <span>Export CSV Spreadsheet</span>
              </Button>
              <Button
                onClick={() => handleExport('pdf')}
                className="flex items-center justify-center gap-2 text-xs h-11 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold w-full"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span>Export PDF Standings</span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
