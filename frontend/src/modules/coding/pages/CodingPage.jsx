import { Code2, Cpu, SquareTerminal } from 'lucide-react';

const languages = ['JavaScript', 'Python', 'C++', 'Java'];

export const CodingPage = () => (
  <div className="page-shell space-y-6">
    <div className="glass-panel rounded-lg p-6">
      <p className="text-sm text-cyan-200">Coding evaluations</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Judge-ready problem workspace</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
        Submissions are modeled independently from execution providers, so Judge0 can be attached without leaking provider logic into controllers.
      </p>
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      {['Queued execution', 'Hidden test cases', 'Language matrix'].map((title, index) => {
        const icons = [SquareTerminal, Cpu, Code2];
        const Icon = icons[index];
        return (
          <div key={title} className="glass-panel rounded-lg p-5">
            <Icon className="h-5 w-5 text-cyan-200" />
            <h2 className="mt-5 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{languages[index] || languages.join(', ')}</p>
          </div>
        );
      })}
    </div>
  </div>
);
