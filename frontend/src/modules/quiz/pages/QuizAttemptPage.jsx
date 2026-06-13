import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AlertTriangle, Clock, ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert, Maximize2 } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { Button } from '../../../components/ui/Button';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import gsap from 'gsap';

export const QuizAttemptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: [selectedOptionId] }
  const [timeLeft, setTimeLeft] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [antiCheatLogs, setAntiCheatLogs] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch quiz and questions
  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz-attempt', id],
    queryFn: async () => (await apiClient.get(`/quizzes/${id}`)).data.data,
  });

  const quiz = data?.quiz;
  const questions = data?.questions || [];

  // Submit attempt mutation
  const submitMutation = useMutation({
    mutationFn: async (payload) => (await apiClient.post(`/quizzes/${id}/attempts`, payload)).data.data,
    onSuccess: (data) => {
      setIsSubmitted(true);
      setSubmittedData(data);
      localStorage.removeItem(`surcodex-quiz-attempt-${id}`);
    },
  });

  // Restore saved progress
  useEffect(() => {
    if (quiz && questions.length) {
      const saved = localStorage.getItem(`surcodex-quiz-attempt-${id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed.answers || {});
          if (parsed.timeLeft !== undefined) {
            setTimeLeft(parsed.timeLeft);
          } else {
            setTimeLeft(quiz.durationMinutes * 60);
          }
          if (parsed.warningCount !== undefined) {
            setWarningCount(parsed.warningCount);
          }
          if (parsed.antiCheatLogs !== undefined) {
            setAntiCheatLogs(parsed.antiCheatLogs);
          }
        } catch (e) {
          console.error('Failed to parse saved progress:', e);
        }
      } else {
        setTimeLeft(quiz.durationMinutes * 60);
      }
    }
  }, [quiz, questions]);

  // Auto-save progress to localStorage
  useEffect(() => {
    if (quiz && timeLeft !== null && !isSubmitted) {
      localStorage.setItem(
        `surcodex-quiz-attempt-${id}`,
        JSON.stringify({ answers, timeLeft, warningCount, antiCheatLogs })
      );
    }
  }, [answers, timeLeft, warningCount, antiCheatLogs, quiz, id, isSubmitted]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;

    if (timeLeft <= 0) {
      triggerAutoSubmit('Time has expired.');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Focus-loss / Cheat warnings detection
  useEffect(() => {
    if (isSubmitted || !quiz) return;

    const handleFocusLoss = () => {
      const logTime = new Date().toISOString();
      setAntiCheatLogs((prev) => {
        const nextLogs = [...prev, logTime];
        setWarningCount((wPrev) => {
          const nextCount = wPrev + 1;
          if (nextCount >= 3) {
            triggerAutoSubmit('Multiple security violations (focus loss / tab switching).', nextCount, nextLogs);
          }
          return nextCount;
        });
        return nextLogs;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleFocusLoss();
      }
    };

    window.addEventListener('blur', handleFocusLoss);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
      setIsFullscreen(isFull);
      if (!isFull && !isSubmitted) {
        const logTime = new Date().toISOString();
        setAntiCheatLogs((prev) => {
          const nextLogs = [...prev, logTime];
          setWarningCount((wPrev) => {
            const nextCount = wPrev + 1;
            if (nextCount >= 3) {
              triggerAutoSubmit('Multiple security violations (exiting full-screen mode).', nextCount, nextLogs);
            }
            return nextCount;
          });
          return nextLogs;
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isSubmitted, quiz, antiCheatLogs]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (isSubmitted || !questions.length) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
      } else if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(e.key)) {
        const optionIndex = Number(e.key) - 1;
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion && currentQuestion.options[optionIndex]) {
          toggleOption(currentQuestion.id, currentQuestion.options[optionIndex].id, currentQuestion.type);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, questions, answers, isSubmitted]);

  // GSAP reveal animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [currentQuestionIndex, isSubmitted]);

  // Actions
  const toggleOption = (questionId, optionId, type) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (type === 'multi_select') {
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...current, optionId] };
        }
      } else {
        // mcq or true_false
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const clearAnswers = (questionId) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const handleFinalSubmit = () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedOptions]) => ({
        question: questionId,
        selectedOptions,
      })),
      warningsCount: warningCount,
      antiCheatLogs,
    };
    submitMutation.mutate(payload);
  };

  const triggerAutoSubmit = (reason, forcedCount, forcedLogs) => {
    if (isSubmitted) return;
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedOptions]) => ({
        question: questionId,
        selectedOptions,
      })),
      warningsCount: forcedCount !== undefined ? forcedCount : warningCount,
      antiCheatLogs: forcedLogs !== undefined ? forcedLogs : antiCheatLogs,
    };
    submitMutation.mutate(payload);
    alert(`Assessment Auto-Submitted: ${reason}`);
  };

  if (isLoading) {
    return (
      <div className="page-shell space-y-6 py-8 px-4 text-[#0f172a]">
        <SkeletonBlock className="h-12 w-1/3" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <SkeletonBlock className="h-[400px]" />
          <SkeletonBlock className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="page-shell py-8 px-4 text-[#0f172a]">
        <InlineAlert>Failed to load the quiz workspace. Make sure this assessment is published and available.</InlineAlert>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).filter((k) => answers[k] && answers[k].length).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Time format mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Timer Color Class
  const getTimerColorClass = () => {
    if (timeLeft < 60) return 'text-rose-600 border-rose-200 animate-pulse';
    if (timeLeft < 300) return 'text-amber-600 border-amber-200';
    return 'text-blue-600 border-slate-200';
  };

  if (isSubmitted && submittedData) {
    return (
      <div className="page-shell max-w-2xl py-12 px-4 text-[#0f172a] text-center space-y-8">
        <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/80 space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Assessment Completed!</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-medium">
            Your attempt for <strong>{quiz.title}</strong> has been received and graded successfully.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div>
              <span className="block text-xs font-semibold text-slate-400">Your Score</span>
              <strong className="text-2xl font-bold text-blue-600">{submittedData.score} pts</strong>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">Percentage</span>
              <strong className="text-2xl font-bold text-blue-600">{submittedData.percentage}%</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={() => navigate('/quizzes')} variant="secondary" className="border border-slate-200 hover:bg-slate-50">
              Back to Library
            </Button>
            <Button onClick={() => navigate('/leaderboard')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/10">
              View Leaderboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="page-shell min-h-[calc(100vh-120px)] flex flex-col gap-6 px-4 py-6 text-[#0f172a] select-none">
      {/* Timer, Warnings, progress and fullscreen instructions */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
        <div>
          <span className="text-xs text-blue-600 font-bold tracking-wider uppercase">Active timed assessment</span>
          <h1 className="text-xl font-bold tracking-tight mt-0.5 text-slate-800">{quiz.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {warningCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-600 font-bold">
              <ShieldAlert className="h-4 w-4" />
              <span>Warnings: {warningCount}/3</span>
            </div>
          )}

          {!isFullscreen && (
            <Button onClick={enterFullscreen} variant="secondary" className="h-9 px-3 text-xs flex items-center gap-2 border border-slate-200 hover:bg-slate-50">
              <Maximize2 className="h-3.5 w-3.5" />
              Fullscreen
            </Button>
          )}

          <div className={`flex items-center gap-2 rounded-lg border bg-white px-4 py-1.5 font-mono text-sm font-bold shadow-sm ${getTimerColorClass()}`}>
            <Clock className="h-4 w-4" />
            <span>{timeLeft !== null ? formatTime(timeLeft) : '--:--'}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] flex-1">
        {/* Active question panel */}
        <main className="flex flex-col justify-between border border-slate-200 bg-white rounded-xl p-6 shadow-sm" data-reveal>
          {currentQuestion ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <span className="text-xs text-slate-400 font-bold uppercase">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{currentQuestion.points} {currentQuestion.points === 1 ? 'Point' : 'Points'}</span>
              </div>

              <h2 className="text-lg font-bold leading-relaxed text-slate-800">{currentQuestion.prompt}</h2>

              <div className="grid gap-3 pt-2">
                {currentQuestion.options.map((option, idx) => {
                  const isChecked = (answers[currentQuestion.id] || []).includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition cursor-pointer select-none ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/50 text-[#0f172a] shadow-sm shadow-blue-50'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type={currentQuestion.type === 'multi_select' ? 'checkbox' : 'radio'}
                          name={`q-${currentQuestion.id}`}
                          checked={isChecked}
                          onChange={() => toggleOption(currentQuestion.id, option.id, currentQuestion.type)}
                          className="h-4 w-4 accent-blue-600"
                        />
                      </div>
                      <div className="text-sm font-semibold">
                        <span className="font-mono text-blue-600 font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {option.label}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Loading question...</div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>

            <Button
              variant="secondary"
              onClick={() => clearAnswers(currentQuestion.id)}
              disabled={!(answers[currentQuestion?.id] || []).length}
              className="text-xs border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold"
            >
              Clear Choice
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={() => setShowSubmitModal(true)} className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-md shadow-emerald-600/10">
                Finish Attempt
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/10"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </main>

        {/* Sidebar Question grid progress */}
        <aside className="border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between shadow-sm" data-reveal>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-700">Attempt Progress</h3>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1 font-semibold">
                  <span>{answeredCount} of {questions.length} answered</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Questions list</h3>
              <div className="grid grid-cols-5 gap-2.5">
                {questions.map((q, idx) => {
                  const hasAnswer = (answers[q.id] || []).length > 0;
                  const isActive = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-lg text-sm font-mono font-bold transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                          : hasAnswer
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 space-y-3">
            <div className="text-xs text-slate-500 leading-relaxed space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200 font-semibold">
              <span className="block font-bold text-blue-600">Anti-Cheat Mode:</span>
              <p>• Navigating away or losing page focus triggers warnings.</p>
              <p>• 3 warnings will result in auto-submission.</p>
              <p>• Arrow keys navigate. 1-8 keys select option.</p>
            </div>
            <Button onClick={() => setShowSubmitModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/10">
              Submit Assessment
            </Button>
          </div>
        </aside>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 border border-slate-200 shadow-2xl space-y-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-slate-800">Submit Assessment?</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions. You will not be able to change your answers after submission.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowSubmitModal(false)} variant="secondary" className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold">
                Go Back
              </Button>
              <Button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmit();
                }}
                disabled={submitMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/10"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Yes, Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
