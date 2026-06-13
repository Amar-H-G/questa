import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/forms/TextField';
import { apiClient } from '../../../services/api/client';

const blankQuestion = () => ({
  prompt: '',
  type: 'mcq',
  points: 1,
  options: [
    { label: '', isCorrect: true },
    { label: '', isCorrect: false },
  ],
});

export const CreateQuizPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    passingScore: 60,
  });
  const [questions, setQuestions] = useState([blankQuestion()]);

  const mutation = useMutation({
    mutationFn: async (payload) => (await apiClient.post('/quizzes', payload)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      navigate('/quizzes');
    },
  });

  const submit = (event) => {
    event.preventDefault();
    mutation.mutate({
      ...form,
      durationMinutes: Number(form.durationMinutes),
      passingScore: Number(form.passingScore),
      questions: questions.map((question) => ({
        ...question,
        points: Number(question.points),
        options: question.options.filter((option) => option.label.trim()),
      })),
    });
  };

  const updateQuestion = (index, patch) => {
    setQuestions((current) => current.map((question, itemIndex) => (itemIndex === index ? { ...question, ...patch } : question)));
  };

  const updateOption = (questionIndex, optionIndex, patch) => {
    setQuestions((current) =>
      current.map((question, itemIndex) =>
        itemIndex === questionIndex
          ? {
              ...question,
              options: question.options.map((option, index) => (index === optionIndex ? { ...option, ...patch } : option)),
            }
          : question
      )
    );
  };

  return (
    <div className="page-shell max-w-3xl text-[#0f172a]">
      <div className="border border-slate-200 bg-white rounded-2xl p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Quiz studio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Create assessment</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
            <textarea
              className="min-h-28 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide a detailed description of the assessment scope and expectations."
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Duration minutes" type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} />
            <TextField label="Passing score" type="number" value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: e.target.value })} />
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Questions</h2>
              <Button type="button" variant="secondary" className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold" onClick={() => setQuestions([...questions, blankQuestion()])}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_140px_90px_auto]">
                  <TextField
                    label={`Question ${questionIndex + 1}`}
                    value={question.prompt}
                    onChange={(e) => updateQuestion(questionIndex, { prompt: e.target.value })}
                  />
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Type</span>
                    <select
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-750 outline-none transition focus:border-blue-600"
                      value={question.type}
                      onChange={(e) => updateQuestion(questionIndex, { type: e.target.value })}
                    >
                      <option value="mcq">MCQ</option>
                      <option value="multi_select">Multi select</option>
                      <option value="true_false">True/false</option>
                    </select>
                  </label>
                  <TextField
                    label="Points"
                    type="number"
                    value={question.points}
                    onChange={(e) => updateQuestion(questionIndex, { points: e.target.value })}
                  />
                  <button
                    type="button"
                    aria-label="Remove question"
                    className="mt-7 grid h-11 w-11 place-items-center rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition"
                    onClick={() => setQuestions(questions.filter((_, index) => index !== questionIndex))}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50/50 transition">
                      <input
                        type={question.type === 'multi_select' ? 'checkbox' : 'radio'}
                        name={`correct-${questionIndex}`}
                        checked={option.isCorrect}
                        className="accent-blue-600 h-4 w-4"
                        onChange={(e) => {
                          if (question.type === 'multi_select') {
                            updateOption(questionIndex, optionIndex, { isCorrect: e.target.checked });
                          } else {
                            updateQuestion(questionIndex, {
                              options: question.options.map((item, index) => ({ ...item, isCorrect: index === optionIndex })),
                            });
                          }
                        }}
                      />
                      <input
                        className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option.label}
                        onChange={(e) => updateOption(questionIndex, optionIndex, { label: e.target.value })}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {mutation.error ? <p className="text-sm text-rose-600 font-bold">{mutation.error.response?.data?.message || 'Unable to create quiz'}</p> : null}
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/10 mt-4" disabled={mutation.isPending}>{mutation.isPending ? 'Creating...' : 'Create quiz'}</Button>
        </form>
      </div>
    </div>
  );
};
