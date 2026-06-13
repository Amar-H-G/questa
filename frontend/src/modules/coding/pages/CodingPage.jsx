import { Code2, Cpu, SquareTerminal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../../components/ui/EmptyState';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import { apiClient } from '../../../services/api/client';

const languages = ['JavaScript', 'Python', 'C++', 'Java'];

export const CodingPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coding-problems'],
    queryFn: async () => (await apiClient.get('/coding/problems')).data.data,
  });
  const problems = data?.items || [];

  return (
    <div className="page-shell space-y-6 text-[#0f172a]">
      <div className="border border-slate-200 bg-white rounded-xl p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Coding evaluations</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Judge-ready problem workspace</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 font-medium">
          Submissions are modeled independently from execution providers, so Judge0 can be attached without leaking provider logic into controllers.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {['Queued execution', 'Hidden test cases', 'Language matrix'].map((title, index) => {
          const icons = [SquareTerminal, Cpu, Code2];
          const Icon = icons[index];
          return (
            <div key={title} className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-700">{title}</h2>
              <p className="mt-2 text-sm text-slate-500 font-semibold">{languages[index] || languages.join(', ')}</p>
            </div>
          );
        })}
      </div>

      {error ? <InlineAlert>Problem library could not be loaded.</InlineAlert> : null}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-24" />)}
        </div>
      ) : problems.length ? (
        <div className="grid gap-4">
          {problems.map((problem) => (
            <article key={problem.id} className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-750">{problem.title}</h2>
                  <p className={`mt-1 text-xs font-bold uppercase tracking-wider ${
                    problem.difficulty === 'easy' ? 'text-emerald-600' :
                    problem.difficulty === 'medium' ? 'text-amber-600' :
                    'text-rose-600'
                  }`}>{problem.difficulty}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {problem.supportedLanguages?.map((language) => (
                      <span key={language} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 font-semibold border border-slate-200/50">
                        {language}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/coding/${problem.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/10 transition"
                  >
                    Solve Challenge
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState icon={Code2} title="No published problems" copy="Published coding problems will appear here once teachers add them." />
      )}
    </div>
  );
};
