import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../components/ui/Button';
import { apiClient } from '../../../services/api/client';

export const QuizListPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => (await apiClient.get('/quizzes?mine=true')).data.data,
  });
  const publishMutation = useMutation({
    mutationFn: async (id) => (await apiClient.post(`/quizzes/${id}/publish`)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quizzes'] }),
  });

  const quizzes = data?.items || [];

  return (
    <div className="page-shell space-y-6 text-[#0f172a]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Quiz operations</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Assessment library</h1>
        </div>
        <Link className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 text-sm font-bold shadow-md shadow-blue-600/15 hover:scale-[1.03] transition-all duration-300" to="/quizzes/new">
          <Plus className="h-4 w-4" />
          New quiz
        </Link>
      </div>

      <div className="grid gap-4">
        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-600">
            Quiz library could not be loaded.
          </div>
        ) : null}
        {isLoading ? (
          <div className="border border-slate-200 bg-white h-28 animate-pulse rounded-xl" />
        ) : quizzes.length ? (
          quizzes.map((quiz) => (
            <article key={quiz.id} className="glass-panel rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-slate-700">{quiz.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 font-medium">{quiz.description || 'No description provided.'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-600 font-semibold border border-slate-200/50">{quiz.status}</span>
                  {quiz.status === 'draft' ? (
                    <button
                      className="h-8 px-3 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-lg transition-all duration-200"
                      onClick={() => publishMutation.mutate(quiz.id)}
                      disabled={publishMutation.isPending}
                    >
                      Publish
                    </button>
                  ) : null}
                  {quiz.status === 'published' ? (
                    <Link
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/15 transition-all duration-200 hover:scale-[1.03]"
                      to={`/quizzes/${quiz.id}/attempt`}
                    >
                      Attempt
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-panel rounded-xl p-8 text-center">
            <p className="text-lg font-bold text-slate-700">No quizzes yet</p>
            <p className="mt-2 text-sm text-slate-500 font-medium">Create the first assessment for your workspace.</p>
          </div>
        )}
      </div>
    </div>
  );
};
