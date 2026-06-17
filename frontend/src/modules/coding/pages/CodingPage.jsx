import { Code2, SquareTerminal, CheckCircle2, XCircle, Clock3, Trophy, Info, Edit3, Trash2, Globe, EyeOff, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EmptyState } from '../../../components/ui/EmptyState';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import { apiClient } from '../../../services/api/client';
import { useAuthStore } from '../../../store/authStore';

export const CodingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const role = user?.role || 'student';
  const isTeacher = role === 'teacher' || role === 'admin';

  // Load problem lists
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['coding-problems'],
    queryFn: async () => (await apiClient.get('/coding/problems')).data.data,
  });
  const problems = data?.items || [];

  // Load student stats
  const { data: statsData } = useQuery({
    queryKey: ['my-stats'],
    queryFn: async () => (await apiClient.get('/analytics/my-stats')).data.data,
    enabled: !isTeacher,
  });
  const stats = statsData || {};

  // Mutation for Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => (await apiClient.delete(`/coding/problems/${id}`)).data,
    onSuccess: () => {
      toast.success('Coding challenge deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['coding-problems'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete problem');
    },
  });

  // Mutation for Publish
  const publishMutation = useMutation({
    mutationFn: async (id) => (await apiClient.post(`/coding/problems/${id}/publish`)).data,
    onSuccess: () => {
      toast.success('Coding challenge published successfully');
      queryClient.invalidateQueries({ queryKey: ['coding-problems'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to publish problem');
    },
  });

  // Mutation for Unpublish
  const unpublishMutation = useMutation({
    mutationFn: async (id) => (await apiClient.post(`/coding/problems/${id}/unpublish`)).data,
    onSuccess: () => {
      toast.success('Coding challenge reverted to draft');
      queryClient.invalidateQueries({ queryKey: ['coding-problems'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to unpublish problem');
    },
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the problem "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleTogglePublish = (id, currentStatus) => {
    if (currentStatus === 'published') {
      unpublishMutation.mutate(id);
    } else {
      publishMutation.mutate(id);
    }
  };

  return (
    <div className="page-shell space-y-6 text-[#0f172a] select-text">
      {/* Header section */}
      <div className="border border-slate-200 bg-white rounded-xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {isTeacher ? 'Coding Administration' : 'Coding Arena'}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
            {isTeacher ? 'Manage Coding Challenges' : 'Prove Your Algorithmic Capabilities'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 font-medium">
            {isTeacher
              ? 'Draft, configure, and monitor evaluations using sandbox execution frameworks.'
              : 'Compile and submit your solutions in Monaco editor with dynamic sandbox execution.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/coding/playground"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition whitespace-nowrap"
          >
            <SquareTerminal className="mr-2 h-4 w-4" /> Code Playground
          </Link>
          {isTeacher && (
            <Link
              to="/coding/new"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition whitespace-nowrap"
            >
              <Plus className="mr-1.5 h-4.5 w-4.5" /> Create Problem
            </Link>
          )}
        </div>
      </div>

      {/* Student Metrics */}
      {!isTeacher && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Solved</p>
              <p className="mt-1.5 text-2xl font-bold text-slate-800">{stats.problemsSolved ?? 0}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quizzes Completed</p>
              <p className="mt-1.5 text-2xl font-bold text-slate-800">{stats.quizzesAttempted ?? 0}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
          <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Score</p>
              <p className="mt-1.5 text-2xl font-bold text-slate-800">{stats.averageQuizScore ?? 0}%</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-500">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {/* Error or Loading */}
      {error ? <InlineAlert>Problem library could not be loaded.</InlineAlert> : null}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-24" />)}
        </div>
      ) : problems.length ? (
        <div className="grid gap-4">
          {problems.map((problem) => {
            const analytics = problem.analytics || {};
            return (
              <article key={problem.id} className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm hover:border-slate-300 transition-colors">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-slate-800 leading-snug">{problem.title}</h2>
                      
                      {/* Teacher publication state badge */}
                      {isTeacher && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          problem.status === 'published'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {problem.status === 'published' ? <Globe className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {problem.status?.toUpperCase()}
                        </span>
                      )}

                      {/* Student solved/failed/unattempted status badge */}
                      {!isTeacher && (
                        <>
                          {problem.userStatus === 'solved' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Solved
                            </span>
                          )}
                          {problem.userStatus === 'attempted' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                              <XCircle className="h-3.5 w-3.5" /> Failed
                            </span>
                          )}
                          {problem.userStatus === 'unattempted' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">
                              <Info className="h-3.5 w-3.5" /> Not Attempted
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                      <span className={`font-bold uppercase tracking-wider ${
                        problem.difficulty === 'easy' ? 'text-emerald-600' :
                        problem.difficulty === 'medium' ? 'text-amber-600' :
                        'text-rose-600'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <span>•</span>
                      <span>Time Limit: {problem.timeLimit ?? 2000}ms</span>
                      <span>•</span>
                      <span>Memory Limit: {Math.round((problem.memoryLimit ?? 51200) / 1024)}MB</span>
                      {problem.tags?.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex gap-1.5 flex-wrap">
                            {problem.tags.map((tag) => (
                              <span key={tag} className="text-[10px] bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded text-slate-500 font-mono">
                                #{tag}
                              </span>
                            ))}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Description excerpt */}
                    {problem.description && (
                      <p className="text-xs text-slate-400 font-medium max-w-3xl leading-relaxed">
                        {problem.description}
                      </p>
                    )}

                    {/* Teacher Analytics Block */}
                    {isTeacher && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 mt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                        <div>
                          <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Attempts</span>
                          <span className="text-slate-800 font-bold font-mono">{analytics.totalAttempts ?? 0}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Solved</span>
                          <span className="text-emerald-600 font-bold font-mono">{analytics.totalSolved ?? 0}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Failed</span>
                          <span className="text-rose-600 font-bold font-mono">{analytics.totalFailed ?? 0}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Pass Rate</span>
                          <span className="text-blue-600 font-bold font-mono">{analytics.passRate ?? 0}%</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Avg Score</span>
                          <span className="text-slate-700 font-bold font-mono">{analytics.averageScore ?? 0}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5 justify-end lg:flex-col lg:items-end">
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {problem.supportedLanguages?.map((language) => (
                        <span key={language} className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500 font-mono font-bold border border-slate-200">
                          {language.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {isTeacher ? (
                        <>
                          <button
                            onClick={() => handleTogglePublish(problem.id, problem.status)}
                            className={`h-9 px-3.5 rounded-lg text-xs font-bold transition border ${
                              problem.status === 'published'
                                ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                            }`}
                          >
                            {problem.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <Link
                            to={`/coding/${problem.id}/edit`}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition shadow-sm"
                            title="Edit Problem"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(problem.id, problem.title)}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-rose-200 bg-white text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 transition shadow-sm"
                            title="Delete Problem"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </>
                      ) : (
                        <Link
                          to={`/coding/${problem.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/10 transition"
                        >
                          Solve Challenge
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Code2} title="No published problems" copy="Published coding problems will appear here once teachers add them." />
      )}
    </div>
  );
};
