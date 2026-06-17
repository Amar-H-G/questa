import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Plus, Trash2, ChevronLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/forms/TextField';
import { apiClient } from '../../../services/api/client';
import { useAuthStore } from '../../../store/authStore';

const blankTestCase = (isHidden = false) => ({
  input: '',
  expectedOutput: '',
  isHidden,
  weight: 1,
  explanation: '',
});

export const CreateCodingProblemPage = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const role = user?.role || 'student';
  const isTeacher = role === 'teacher' || role === 'admin';

  if (!isTeacher) {
    return <Navigate to="/coding" replace />;
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    prompt: '',
    constraints: '',
    inputFormat: '',
    outputFormat: '',
    difficulty: 'medium',
    tags: '',
    timeLimit: 2000,
    memoryLimit: 51200,
    supportedLanguages: ['javascript', 'python'],
  });

  const [testCases, setTestCases] = useState([
    blankTestCase(false), // 1 sample
    blankTestCase(true),  // 1 hidden
  ]);

  // Load problem if editing
  const { data: problem, isLoading } = useQuery({
    queryKey: ['coding-problem', id],
    queryFn: async () => (await apiClient.get(`/coding/problems/${id}`)).data.data,
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (isEdit && problem) {
      setForm({
        title: problem.title || '',
        description: problem.description || '',
        prompt: problem.prompt || '',
        constraints: problem.constraints ? problem.constraints.join('\n') : '',
        inputFormat: problem.inputFormat || '',
        outputFormat: problem.outputFormat || '',
        difficulty: problem.difficulty || 'medium',
        tags: problem.tags ? problem.tags.join(', ') : '',
        timeLimit: problem.timeLimit ?? 2000,
        memoryLimit: problem.memoryLimit ?? 51200,
        supportedLanguages: problem.supportedLanguages || ['javascript', 'python'],
      });
      if (problem.testCases && problem.testCases.length > 0) {
        setTestCases(problem.testCases);
      }
    }
  }, [isEdit, problem]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEdit) {
        return (await apiClient.put(`/coding/problems/${id}`, payload)).data.data;
      } else {
        return (await apiClient.post('/coding/problems', payload)).data.data;
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Coding challenge updated successfully' : 'Coding challenge created successfully');
      queryClient.invalidateQueries({ queryKey: ['coding-problems'] });
      queryClient.invalidateQueries({ queryKey: ['coding-problem', id] });
      navigate('/coding');
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save coding challenge');
    },
  });

  const toggleLanguage = (lang) => {
    setForm((prev) => {
      const current = prev.supportedLanguages;
      const next = current.includes(lang)
        ? current.filter((l) => l !== lang)
        : [...current, lang];
      return { ...prev, supportedLanguages: next };
    });
  };

  const handleAddTestCase = (isHidden = false) => {
    setTestCases((prev) => [...prev, blankTestCase(isHidden)]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateTestCase = (index, patch) => {
    setTestCases((prev) =>
      prev.map((tc, idx) => (idx === index ? { ...tc, ...patch } : tc))
    );
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (form.prompt.trim().length < 20) {
      toast.error('Problem statement must be at least 20 characters');
      return;
    }

    if (form.supportedLanguages.length === 0) {
      toast.error('At least one supported language must be selected');
      return;
    }

    // Validation for test cases
    const samples = testCases.filter((tc) => !tc.isHidden);
    const hiddens = testCases.filter((tc) => tc.isHidden);

    if (samples.length === 0) {
      toast.error('Minimum 1 sample testcase is required');
      return;
    }

    if (hiddens.length === 0) {
      toast.error('Minimum 1 hidden testcase is required');
      return;
    }

    // Check that all testcases have input and output
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      if (!tc.input.trim() || !tc.expectedOutput.trim()) {
        toast.error(`Testcase ${i + 1} must contain both Input and Expected Output`);
        return;
      }
    }

    const payload = {
      title: form.title,
      description: form.description,
      prompt: form.prompt,
      constraints: form.constraints
        .split('\n')
        .map((c) => c.trim())
        .filter((c) => c.length > 0),
      inputFormat: form.inputFormat,
      outputFormat: form.outputFormat,
      difficulty: form.difficulty,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      timeLimit: Number(form.timeLimit),
      memoryLimit: Number(form.memoryLimit),
      supportedLanguages: form.supportedLanguages,
      testCases: testCases.map((tc) => ({
        input: tc.input.trim(),
        expectedOutput: tc.expectedOutput.trim(),
        isHidden: tc.isHidden,
        weight: Number(tc.weight || 1),
        explanation: tc.explanation ? tc.explanation.trim() : '',
      })),
    };

    mutation.mutate(payload);
  };

  if (isEdit && isLoading) {
    return (
      <div className="page-shell max-w-4xl mx-auto py-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded w-1/4 mx-auto"></div>
          <div className="h-64 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell max-w-4xl mx-auto text-[#0f172a] select-text">
      <div className="border border-slate-200 bg-white rounded-2xl p-8 shadow-sm">
        {/* Back Link */}
        <div className="flex items-center gap-3.5 mb-6">
          <button
            type="button"
            onClick={() => navigate('/coding')}
            className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition border border-slate-200 shadow-sm"
            title="Go Back"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Coding Studio</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 leading-none mt-0.5">
              {isEdit ? 'Edit Coding Challenge' : 'Create Coding Challenge'}
            </h1>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* General Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField
                label="Problem Title"
                placeholder="e.g. Find First Unique Character"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Short Description</span>
                <textarea
                  className="min-h-16 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A quick summary showing in problem cards list."
                />
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Problem Statement (Prompt) *</span>
                <textarea
                  className="min-h-36 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 font-mono"
                  value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  placeholder="Describe the problem, input specifications, and expected outputs."
                  required
                />
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Constraints (One per line)</span>
                <textarea
                  className="min-h-24 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 font-mono"
                  value={form.constraints}
                  onChange={(e) => setForm({ ...form, constraints: e.target.value })}
                  placeholder="e.g. 1 <= nums.length <= 10^5"
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Input Format</span>
                <textarea
                  className="min-h-20 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600"
                  value={form.inputFormat}
                  onChange={(e) => setForm({ ...form, inputFormat: e.target.value })}
                  placeholder="e.g. An integer array nums followed by target."
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Output Format</span>
                <textarea
                  className="min-h-20 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600"
                  value={form.outputFormat}
                  onChange={(e) => setForm({ ...form, outputFormat: e.target.value })}
                  placeholder="e.g. Index of target or -1 if not found."
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Difficulty</span>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none focus:border-blue-600"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
            <div>
              <TextField
                label="Tags (Comma separated)"
                placeholder="array, search, hash-table"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
            <div>
              <TextField
                label="Time Limit (milliseconds)"
                type="number"
                value={form.timeLimit}
                onChange={(e) => setForm({ ...form, timeLimit: e.target.value })}
                required
              />
            </div>
            <div>
              <TextField
                label="Memory Limit (KB)"
                type="number"
                value={form.memoryLimit}
                onChange={(e) => setForm({ ...form, memoryLimit: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Languages Selector */}
          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-700 font-sans">Supported Languages</span>
            <div className="flex flex-wrap gap-3 mt-2">
              {['javascript', 'python', 'cpp', 'java', 'c'].map((lang) => {
                const active = form.supportedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold border transition ${
                      active
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Cases Panel */}
          <div className="space-y-4 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Test Cases</h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTestCase(false)}
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Sample Case
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTestCase(true)}
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Hidden Case
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-5 space-y-4 shadow-sm relative ${
                    tc.isHidden
                      ? 'border-indigo-100 bg-indigo-50/20'
                      : 'border-slate-200 bg-slate-50/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${tc.isHidden ? 'bg-indigo-600' : 'bg-blue-500'}`}></span>
                      {tc.isHidden ? `Hidden Testcase #${idx + 1}` : `Sample Testcase #${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(idx)}
                      disabled={testCases.length <= 2}
                      className="text-slate-400 hover:text-rose-600 transition disabled:opacity-30"
                      title="Delete Test Case"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <span className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">Input</span>
                      <textarea
                        className="min-h-16 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-blue-600 font-mono font-semibold"
                        value={tc.input}
                        onChange={(e) => handleUpdateTestCase(idx, { input: e.target.value })}
                        placeholder="Raw standard input string"
                      />
                    </div>
                    <div>
                      <span className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">Expected Output</span>
                      <textarea
                        className="min-h-16 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-blue-600 font-mono font-semibold"
                        value={tc.expectedOutput}
                        onChange={(e) => handleUpdateTestCase(idx, { expectedOutput: e.target.value })}
                        placeholder="Raw expected standard output"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <TextField
                        label="Weight / Score points"
                        type="number"
                        value={tc.weight}
                        onChange={(e) => handleUpdateTestCase(idx, { weight: Number(e.target.value) })}
                      />
                    </div>
                    {!tc.isHidden && (
                      <div>
                        <span className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">Explanation (Visible to Students)</span>
                        <input
                          type="text"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-850 outline-none focus:border-blue-600 font-semibold"
                          value={tc.explanation || ''}
                          onChange={(e) => handleUpdateTestCase(idx, { explanation: e.target.value })}
                          placeholder="Why is this the output?"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 border-t border-slate-100 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/coding')}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-premium-gradient"
              disabled={mutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update Challenge' : 'Create Challenge'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
