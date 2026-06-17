import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';

export const QuizListPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'mine'

  // Fetch quizzes created by others (available to attempt)
  const { data: availableData, isLoading: isAvailableLoading, error: availableError } = useQuery({
    queryKey: ['quizzes', 'available'],
    queryFn: async () => (await apiClient.get('/quizzes')).data.data,
  });

  // Fetch quizzes created by the logged-in user
  const { data: myData, isLoading: isMyLoading, error: myError } = useQuery({
    queryKey: ['quizzes', 'mine'],
    queryFn: async () => (await apiClient.get('/quizzes?mine=true')).data.data,
  });

  const publishMutation = useMutation({
    mutationFn: async (id) => (await apiClient.post(`/quizzes/${id}/publish`)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'available'] });
    },
  });

  const isLoading = activeTab === 'available' ? isAvailableLoading : isMyLoading;
  const error = activeTab === 'available' ? availableError : myError;
  const quizzes = activeTab === 'available' ? (availableData?.items || []) : (myData?.items || []);

  return (
    <div className="page-shell space-y-6 text-[#0f172a]">
      {/* Header */}
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

      {/* Modern Tabs */}
      <div className="flex gap-2 border-b border-slate-200/80 pb-px">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 text-xs font-bold border-b-2 px-4 transition-all duration-200 uppercase tracking-wider ${
            activeTab === 'available'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
          }`}
        >
          Available Quizzes
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`pb-3 text-xs font-bold border-b-2 px-4 transition-all duration-200 uppercase tracking-wider ${
            activeTab === 'mine'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
          }`}
        >
          My Quizzes
        </button>
      </div>

      {/* Quizzes List */}
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
            <article key={quiz.id} className="glass-panel rounded-xl p-5 bg-white border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-slate-700">{quiz.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 font-medium">{quiz.description || 'No description provided.'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-600 font-semibold border border-slate-200/50">
                    {quiz.status}
                  </span>
                  
                  {/* Creator Actions under My Quizzes tab */}
                  {activeTab === 'mine' && quiz.status === 'draft' ? (
                    <button
                      className="h-8 px-3 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-lg transition-all duration-200"
                      onClick={() => publishMutation.mutate(quiz.id)}
                      disabled={publishMutation.isPending}
                    >
                      {publishMutation.isPending ? 'Publishing...' : 'Publish'}
                    </button>
                  ) : null}

                  {activeTab === 'mine' && quiz.status === 'published' ? (
                    <Link
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 px-3 text-xs font-bold text-blue-600 hover:bg-blue-100 transition duration-200"
                      to={`/quizzes/${quiz.id}/attempts`}
                    >
                      View Results
                    </Link>
                  ) : null}
                  
                  {/* Solve Actions under Available Quizzes tab */}
                  {activeTab === 'available' && quiz.status === 'published' ? (
                    quiz.hasAttempted ? (
                      <span className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 px-3 text-xs font-bold text-emerald-600">
                        Attempted
                      </span>
                    ) : (
                      <Link
                        className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/15 transition-all duration-200 hover:scale-[1.03]"
                        to={`/quizzes/${quiz.id}/attempt`}
                      >
                        Attempt
                      </Link>
                    )
                  ) : null}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-panel rounded-xl p-8 text-center border border-slate-200 bg-white">
            <p className="text-lg font-bold text-slate-700">
              {activeTab === 'available' ? 'No quizzes available' : 'No quizzes yet'}
            </p>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              {activeTab === 'available' 
                ? 'Check back later for new assessments to solve.' 
                : 'Create your first quiz using the button above.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
