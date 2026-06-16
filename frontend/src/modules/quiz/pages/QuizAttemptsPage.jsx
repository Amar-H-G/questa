import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, User, Calendar, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText, Clock, Trophy } from 'lucide-react';
import { apiClient } from '../../../services/api/client';

export const QuizAttemptsPage = () => {
  const { id: quizId } = useParams();
  const [expandedAttempt, setExpandedAttempt] = useState(null);

  // Fetch the quiz details & questions (contains options with isCorrect)
  const { data: quizData, isLoading: isQuizLoading, error: quizError } = useQuery({
    queryKey: ['quiz-details', quizId],
    queryFn: async () => (await apiClient.get(`/quizzes/${quizId}`)).data.data,
  });

  // Fetch all attempts for this quiz
  const { data: attempts, isLoading: isAttemptsLoading, error: attemptsError } = useQuery({
    queryKey: ['quiz-attempts', quizId],
    queryFn: async () => (await apiClient.get(`/quizzes/${quizId}/attempts`)).data.data,
  });

  const isLoading = isQuizLoading || isAttemptsLoading;
  const error = quizError || attemptsError;

  if (isLoading) {
    return (
      <div className="page-shell space-y-6 text-[#0f172a] animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-24 bg-white border border-slate-200 rounded-xl" />
        <div className="h-64 bg-white border border-slate-200 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell space-y-6 text-[#0f172a]">
        <Link to="/quizzes" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 font-bold transition">
          <ChevronLeft className="h-4 w-4" /> Back to library
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-bold text-rose-600">
          Could not load attempts for this quiz. Please verify you are the owner of this quiz.
        </div>
      </div>
    );
  }

  const { quiz, questions = [] } = quizData;

  // Build maps for quick lookup of questions and options
  const questionMap = new Map(questions.map((q) => [q.id || q._id, q]));

  const toggleExpandAttempt = (attemptId) => {
    setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
  };

  return (
    <div className="page-shell space-y-6 text-[#0f172a]">
      {/* Header & Back Link */}
      <div className="space-y-4">
        <Link to="/quizzes" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 font-bold transition">
          <ChevronLeft className="h-4 w-4" /> Back to library
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Quiz Metrics</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">{quiz.title}</h1>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">{quiz.description || 'No description provided.'}</p>
          </div>
          <div className="flex items-center gap-6 shrink-0 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-slate-800">{attempts?.length || 0}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Attempts</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-slate-800">
                {attempts?.length
                  ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.length)
                  : 0}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg. Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attempts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-700">Candidate Submissions</h2>

        {!attempts || attempts.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center border border-slate-200 bg-white">
            <p className="text-lg font-bold text-slate-700">No attempts yet</p>
            <p className="mt-2 text-sm text-slate-500 font-medium">No candidates have completed this assessment yet.</p>
          </div>
        ) : (
          attempts.map((attempt) => {
            const isExpanded = expandedAttempt === attempt._id;
            const formattedDate = new Date(attempt.submittedAt || attempt.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={attempt._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition duration-200 hover:border-slate-300">
                {/* Attempt Row */}
                <div 
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => toggleExpandAttempt(attempt._id)}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 text-base">{attempt.user?.name || 'Anonymous'}</span>
                      {attempt.cheated && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 border border-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                          <AlertTriangle className="h-3 w-3" /> Flagged
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 shrink-0" /> {attempt.user?.email || 'N/A'}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 shrink-0" /> {formattedDate}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 shrink-0" /> Warnings: {attempt.warningsCount || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="text-lg font-extrabold text-slate-800">{attempt.score} pts</span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold">{attempt.percentage}% correct</span>
                    </div>

                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition border border-slate-200"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Submission Details</h3>
                    
                    <div className="space-y-4">
                      {attempt.answers.map((answer, index) => {
                        const question = questionMap.get(answer.question);
                        if (!question) return null;

                        return (
                          <div key={index} className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-start gap-2.5">
                              <span className="text-xs font-bold text-slate-400 mt-0.5">Q{index + 1}.</span>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-extrabold text-slate-700 text-sm leading-relaxed">{question.text}</h4>
                              </div>
                              <span className="shrink-0 mt-0.5">
                                {answer.isCorrect ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-rose-500" />
                                )}
                              </span>
                            </div>

                            {/* Render Options */}
                            <div className="grid gap-2 pl-6 pt-1">
                              {question.options.map((opt) => {
                                const isSelected = answer.selectedOptions.includes(opt.id || opt._id);
                                const isCorrectOpt = opt.isCorrect;
                                
                                let optionStyle = "border-slate-200 bg-white text-slate-600";
                                let optionBadge = null;

                                if (isSelected && isCorrectOpt) {
                                  optionStyle = "border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold";
                                  optionBadge = <span className="text-[10px] text-emerald-600 font-bold ml-auto shrink-0">Selected (Correct)</span>;
                                } else if (isSelected && !isCorrectOpt) {
                                  optionStyle = "border-rose-200 bg-rose-50 text-rose-800 font-semibold";
                                  optionBadge = <span className="text-[10px] text-rose-600 font-bold ml-auto shrink-0">Selected (Incorrect)</span>;
                                } else if (!isSelected && isCorrectOpt) {
                                  optionStyle = "border-emerald-100 bg-emerald-50/30 text-emerald-700 font-medium";
                                  optionBadge = <span className="text-[10px] text-emerald-500 font-bold ml-auto shrink-0">Correct Choice</span>;
                                }

                                return (
                                  <div
                                    key={opt.id || opt._id}
                                    className={`flex items-center gap-2 border rounded-lg p-2.5 text-xs transition duration-150 ${optionStyle}`}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                                    <span className="min-w-0 flex-1 break-words leading-normal">{opt.text}</span>
                                    {optionBadge}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
