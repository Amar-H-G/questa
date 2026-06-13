import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/forms/TextField';
import { apiClient } from '../../../services/api/client';

export const CreateQuizPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    passingScore: 60,
  });

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
      questions: [
        {
          prompt: 'Which statement best describes SurCodex?',
          type: 'mcq',
          points: 1,
          options: [
            { label: 'A technical assessment platform', isCorrect: true },
            { label: 'A static landing page', isCorrect: false },
          ],
        },
      ],
    });
  };

  return (
    <div className="page-shell max-w-3xl">
      <div className="glass-panel rounded-lg p-6">
        <p className="text-sm text-cyan-200">Quiz studio</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create assessment</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Description</span>
            <textarea
              className="min-h-28 w-full rounded-lg border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none focus:border-cyan-300"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Duration minutes" type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} />
            <TextField label="Passing score" type="number" value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: e.target.value })} />
          </div>
          {mutation.error ? <p className="text-sm text-rose-300">{mutation.error.response?.data?.message || 'Unable to create quiz'}</p> : null}
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Creating...' : 'Create quiz'}</Button>
        </form>
      </div>
    </div>
  );
};
