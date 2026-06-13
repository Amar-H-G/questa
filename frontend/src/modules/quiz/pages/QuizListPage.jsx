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
    <div className="page-shell space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-cyan-200">Quiz operations</p>
          <h1 className="text-3xl font-semibold tracking-tight">Assessment library</h1>
        </div>
        <Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950" to="/quizzes/new">
          <Plus className="h-4 w-4" />
          New quiz
        </Link>
      </div>

      <div className="grid gap-4">
        {error ? (
          <div className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            Quiz library could not be loaded.
          </div>
        ) : null}
        {isLoading ? (
          <div className="glass-panel h-28 animate-pulse rounded-lg" />
        ) : quizzes.length ? (
          quizzes.map((quiz) => (
            <article key={quiz.id} className="glass-panel rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10">
                  <FileText className="h-5 w-5 text-cyan-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">{quiz.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{quiz.description || 'No description provided.'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-slate-300">{quiz.status}</span>
                  {quiz.status === 'draft' ? (
                    <Button
                      className="h-8 px-3 text-xs"
                      onClick={() => publishMutation.mutate(quiz.id)}
                      disabled={publishMutation.isPending}
                    >
                      Publish
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-panel rounded-lg p-8 text-center">
            <p className="text-lg font-semibold">No quizzes yet</p>
            <p className="mt-2 text-sm text-slate-400">Create the first assessment for your workspace.</p>
          </div>
        )}
      </div>
    </div>
  );
};
