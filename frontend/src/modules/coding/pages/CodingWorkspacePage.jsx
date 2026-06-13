import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { Code2, Play, Send, ChevronLeft, Loader2, CheckCircle2, XCircle, Info, RefreshCw } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { Button } from '../../../components/ui/Button';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';
import gsap from 'gsap';

const LANGUAGE_BOILERPLATES = {
  javascript: `// Write your Node.js solution here
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();

function solve(input) {
  // Write your logic here
  return input;
}

console.log(solve(input));`,

  python: `# Write your Python 3 solution here
import sys

def solve(input_data):
    # Write your logic here
    return input_data.strip()

if __name__ == "__main__":
    input_data = sys.stdin.read()
    print(solve(input_data))`,

  cpp: `// Write your C++ solution here
#include <iostream>
#include <string>
#include <sstream>

using namespace std;

int main() {
    string line;
    while (getline(cin, line)) {
        cout << line << endl;
    }
    return 0;
}`,

  java: `// Write your Java solution here
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            System.out.println(line);
        }
    }
}`,
};

export const CodingWorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load problem details
  const { data: problem, isLoading, error, refetch } = useQuery({
    queryKey: ['coding-problem', id],
    queryFn: async () => (await apiClient.get(`/coding/problems/${id}`)).data.data,
  });

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // description, output, history
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [history, setHistory] = useState([]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (problem) {
      const defaultLang = problem.supportedLanguages?.[0] || 'javascript';
      setLanguage(defaultLang);
      setCode(LANGUAGE_BOILERPLATES[defaultLang] || '');
    }
  }, [problem]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [isLoading]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(LANGUAGE_BOILERPLATES[newLang] || '');
  };

  const handleExecute = async (isSubmission = false) => {
    setRunning(true);
    setRunResult(null);
    setActiveTab('output');

    try {
      // Create submission
      const { data } = await apiClient.post(`/coding/problems/${id}/submissions`, {
        language,
        sourceCode: code,
      });

      const submissionId = data.data.submission.id;

      // Poll submission result until evaluated
      let completed = false;
      let resultData = null;
      let attempts = 0;

      while (!completed && attempts < 15) {
        attempts++;
        await new Promise((r) => setTimeout(r, 2000));

        const res = await apiClient.get(`/coding/submissions/${submissionId}`);
        resultData = res.data.data;

        if (resultData.status !== 'queued' && resultData.status !== 'running') {
          completed = true;
        }
      }

      setRunResult(resultData);
      // Update history list
      setHistory((prev) => [resultData, ...prev]);
    } catch (err) {
      console.error(err);
      setRunResult({
        status: 'runtime_error',
        error: err.response?.data?.message || 'Execution request failed',
      });
    } finally {
      setRunning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-shell space-y-6 py-6 px-4 text-white">
        <SkeletonBlock className="h-10 w-1/4" />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonBlock className="h-[500px]" />
          <SkeletonBlock className="h-[500px]" />
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="page-shell py-8 px-4 text-white">
        <InlineAlert>Problem library could not be loaded. Please ensure this challenge exists.</InlineAlert>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="page-shell min-h-[calc(100vh-100px)] flex flex-col gap-4 py-4 px-4 text-white select-none">
      {/* Workspace Header */}
      <header className="flex items-center justify-between glass-panel rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/coding')}
            className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{problem.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                problem.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-300' :
                problem.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                'bg-rose-500/20 text-rose-300'
              }`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="block text-xs text-slate-400">Language:</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="h-9 rounded-lg border border-white/10 bg-slate-900 px-3 text-xs text-white outline-none focus:border-cyan-300"
          >
            {problem.supportedLanguages?.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Workspace Dual Pane Panels */}
      <div className="grid gap-4 lg:grid-cols-2 flex-1">
        {/* Left Pane - Descriptions / Details */}
        <section className="glass-panel rounded-xl flex flex-col justify-between overflow-hidden" data-reveal>
          <div className="flex border-b border-white/10 bg-slate-900/40">
            {['description', 'output', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-xs font-semibold capitalize border-b-2 transition ${
                  activeTab === tab
                    ? 'border-cyan-400 text-cyan-200 bg-white/[0.02]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[550px]">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">Problem Statement</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mt-2 whitespace-pre-wrap">{problem.prompt}</p>
                </div>

                {problem.constraints?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300">Constraints</h3>
                    <ul className="list-disc list-inside text-xs text-slate-400 mt-2 space-y-1">
                      {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-slate-300">Sample Test Cases</h3>
                  <div className="grid gap-3 mt-3">
                    {problem.testCases?.map((tc, idx) => (
                      <div key={tc._id || idx} className="rounded-lg bg-slate-950/60 border border-white/5 p-4 text-xs font-mono">
                        <span className="block text-[10px] text-cyan-300 uppercase font-semibold mb-2">Case {idx + 1}</span>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div>
                            <span className="text-slate-500 block">Input:</span>
                            <pre className="text-slate-300 whitespace-pre-wrap">{tc.input}</pre>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Expected Output:</span>
                            <pre className="text-slate-300 whitespace-pre-wrap">{tc.expectedOutput}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'output' && (
              <div className="space-y-4">
                {running ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <Loader2 className="h-10 w-10 text-cyan-300 animate-spin" />
                    <span className="text-xs text-slate-400">Compiling and running against test cases...</span>
                  </div>
                ) : runResult ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      {runResult.status === 'accepted' ? (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-xs font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          Accepted
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 text-xs font-semibold">
                          <XCircle className="h-4 w-4" />
                          {runResult.status?.replace('_', ' ').toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs text-slate-400">Score: {runResult.score}%</span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-300">Test Cases Details</h3>
                      {runResult.executionResults?.length ? (
                        <div className="space-y-3">
                          {runResult.executionResults.map((res, idx) => (
                            <div key={res._id || idx} className="rounded-lg bg-slate-950/60 border border-white/5 p-4 text-xs font-mono space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-cyan-300 uppercase font-semibold">Case {idx + 1}</span>
                                <span className={`text-[10px] uppercase font-semibold ${res.status === 'accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>{res.status}</span>
                              </div>
                              {res.stdout && (
                                <div>
                                  <span className="text-slate-500 block text-[10px]">Stdout:</span>
                                  <pre className="text-slate-300 whitespace-pre-wrap">{res.stdout}</pre>
                                </div>
                              )}
                              {res.stderr && (
                                <div>
                                  <span className="text-rose-400 block text-[10px]">Error/Stderr:</span>
                                  <pre className="text-rose-300 whitespace-pre-wrap">{res.stderr}</pre>
                                </div>
                              )}
                              <div className="flex justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2 mt-2">
                                <span>Runtime: {res.runtimeMs}ms</span>
                                <span>Memory: {Math.round(res.memoryKb / 1024 * 10) / 10}MB</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">No output details available.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-center space-y-2">
                    <Info className="h-8 w-8 text-slate-600" />
                    <span className="text-xs">Execute code or submit a solution to view output logs here.</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {history.length ? (
                  history.map((sub, idx) => (
                    <div key={sub._id || idx} className="glass-panel rounded-lg p-4 flex justify-between items-center text-xs">
                      <div>
                        <span className="block font-semibold capitalize text-slate-200">Submission #{history.length - idx}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">{sub.language?.toUpperCase()} • {new Date(sub.createdAt || Date.now()).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold font-mono text-cyan-300">{sub.score}% Score</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          sub.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-center space-y-2">
                    <RefreshCw className="h-8 w-8 text-slate-600 animate-pulse" />
                    <span className="text-xs">No submission history found for this session.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Right Pane - Monaco Code Editor & Actions */}
        <section className="glass-panel rounded-xl flex flex-col justify-between overflow-hidden" data-reveal>
          <div className="flex-1 min-h-[350px]">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                cursorBlinking: 'smooth',
                lineHeight: 22,
                fontFamily: "'Fira Code', Consolas, Monaco, monospace",
                padding: { top: 12 },
              }}
            />
          </div>

          <footer className="flex items-center justify-between bg-slate-950 px-5 py-4 border-t border-white/10">
            <span className="text-xs text-slate-500 font-mono">Boilerplate code active</span>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExecute(false)}
                disabled={running}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 text-cyan-300" />}
                Run Code
              </Button>
              <Button
                onClick={() => handleExecute(true)}
                disabled={running}
                className="flex items-center gap-2 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Solution
              </Button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};
