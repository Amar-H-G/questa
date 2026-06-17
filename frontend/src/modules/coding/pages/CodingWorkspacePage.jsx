import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { 
  Code2, Play, Send, ChevronLeft, Loader2, 
  CheckCircle2, XCircle, Info, RefreshCw, Terminal, 
  BookOpen, History, Award, Zap, AlertCircle, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
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

  c: `// Write your C solution here
#include <stdio.h>
#include <string.h>

int main() {
    char buffer[4096];
    while (fgets(buffer, sizeof(buffer), stdin)) {
        printf("%s", buffer);
    }
    return 0;
}`
};

export const CodingWorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Load problem details
  const { data: problem, isLoading: isLoadingProblem, error: problemError } = useQuery({
    queryKey: ['coding-problem', id],
    queryFn: async () => (await apiClient.get(`/coding/problems/${id}`)).data.data,
  });

  // Load student's attempt to check if locked
  const { data: attempt, isLoading: isLoadingAttempt } = useQuery({
    queryKey: ['coding-attempt', id],
    queryFn: async () => (await apiClient.get(`/coding/problems/${id}/attempt`)).data.data,
  });

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // description, output, history
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [theme, setTheme] = useState('vs-dark'); // vs-dark or light

  const containerRef = useRef(null);
  const isLocked = !!attempt;

  // Initialize editor on problem load, or restore locked solution
  useEffect(() => {
    if (attempt && attempt.submission) {
      setCode(attempt.submission.sourceCode || '');
      setLanguage(attempt.submission.language || 'javascript');
      setRunResult(attempt.submission);
      setActiveTab('output');
    } else if (problem) {
      const defaultLang = problem.supportedLanguages?.[0] || 'javascript';
      setLanguage(defaultLang);
      setCode(LANGUAGE_BOILERPLATES[defaultLang] || '');
    }
  }, [problem, attempt]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [isLoadingProblem]);

  const handleLanguageChange = (newLang) => {
    if (isLocked) return;
    setLanguage(newLang);
    setCode(LANGUAGE_BOILERPLATES[newLang] || '');
  };

  // Run Code (Playground execution - only visible sample test cases)
  const handleRunCode = async () => {
    if (isLocked || running) return;

    setRunning(true);
    setRunResult(null);
    setActiveTab('output');

    try {
      // Backend returns only visible sample test cases in problem.testCases for students
      const sampleCases = problem.testCases || [];
      if (sampleCases.length === 0) {
        throw new Error('No sample test cases configured for this problem.');
      }

      const results = [];
      let overallPassed = true;

      for (let i = 0; i < sampleCases.length; i++) {
        const tc = sampleCases[i];
        
        const { data } = await apiClient.post('/coding/playground/run', {
          language,
          sourceCode: code,
          stdin: tc.input,
        });

        const res = data.data;
        const stdoutClean = (res.stdout || '').trim();
        const expectedClean = (tc.expectedOutput || '').trim();
        const passed = res.status === 'accepted' && stdoutClean === expectedClean;

        if (!passed) {
          overallPassed = false;
        }

        results.push({
          testCase: tc._id || i,
          status: passed ? 'accepted' : (res.status === 'accepted' ? 'wrong_answer' : res.status),
          stdout: res.stdout,
          stderr: res.stderr,
          runtimeMs: res.runtimeMs,
          memoryKb: res.memoryKb,
        });
      }

      const passedCount = results.filter(r => r.status === 'accepted').length;
      setRunResult({
        isPlaygroundRun: true,
        status: overallPassed ? 'accepted' : 'wrong_answer',
        score: Math.round((passedCount / sampleCases.length) * 100),
        executionResults: results,
      });

      toast.success('Sandbox execution completed.');
    } catch (err) {
      console.error(err);
      setRunResult({
        status: 'runtime_error',
        error: err.response?.data?.message || err.message || 'Execution request failed',
      });
    } finally {
      setRunning(false);
    }
  };

  // Submit Solution (Creates database submission & lock attempt)
  const handleSubmitSolution = async () => {
    if (isLocked || running) return;

    if (window.confirm('Are you sure you want to submit? You can only submit once per challenge.')) {
      setRunning(true);
      setRunResult(null);
      setActiveTab('output');

      try {
        const { data } = await apiClient.post(`/coding/problems/${id}/submissions`, {
          language,
          sourceCode: code,
        });

        const submissionId = data.data.submission.id;

        // Poll submission result until evaluated
        let completed = false;
        let resultData = null;
        let attemptsCount = 0;

        while (!completed && attemptsCount < 15) {
          attemptsCount++;
          await new Promise((r) => setTimeout(r, 2000));

          const res = await apiClient.get(`/coding/submissions/${submissionId}`);
          resultData = res.data.data;

          if (resultData.status !== 'queued' && resultData.status !== 'running') {
            completed = true;
          }
        }

        setRunResult(resultData);
        setHistory((prev) => [resultData, ...prev]);
        
        // Refresh attempts query to lock user out from resubmitting
        queryClient.invalidateQueries({ queryKey: ['coding-attempt', id] });
        toast.success('Your solution has been submitted successfully.');
      } catch (err) {
        console.error(err);
        setRunResult({
          status: 'runtime_error',
          error: err.response?.data?.message || 'Submission request failed',
        });
      } finally {
        setRunning(false);
      }
    }
  };

  if (isLoadingProblem || isLoadingAttempt) {
    return (
      <div className="page-shell space-y-6 py-6 px-4 text-[#0f172a]">
        <div className="flex gap-4">
          <SkeletonBlock className="h-10 w-24" />
          <SkeletonBlock className="h-10 w-1/3" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonBlock className="h-[500px]" />
          <SkeletonBlock className="h-[500px]" />
        </div>
      </div>
    );
  }

  if (problemError || !problem) {
    return (
      <div className="page-shell py-8 px-4 text-[#0f172a]">
        <InlineAlert>Problem library could not be loaded. Please ensure this challenge exists.</InlineAlert>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="page-shell min-h-[calc(100vh-120px)] flex flex-col gap-4 py-2 px-1 text-[#0f172a] select-text">
      {/* Locked Challenge Alert Banner */}
      {isLocked && (
        <div className="flex items-center gap-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-3.5 shadow-sm">
          <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 animate-pulse" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Challenge Locked</p>
            <p className="text-xs font-semibold text-amber-600 mt-0.5">
              You have already attempted and submitted this challenge. Resubmissions are restricted by the system.
            </p>
          </div>
        </div>
      )}

      {/* Workspace Header */}
      <header className="flex items-center justify-between border border-slate-200/80 bg-white rounded-2xl px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/coding')}
            className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition border border-slate-200 shadow-sm"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-extrabold tracking-tight text-slate-800">{problem.title}</h1>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                problem.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                problem.difficulty === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Solve in browser with sandbox testing</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setTheme('vs-dark')}
              className={`text-[9px] font-bold px-2 py-1 rounded transition ${theme === 'vs-dark' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Dark IDE
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`text-[9px] font-bold px-2 py-1 rounded transition ${theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Light IDE
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compiler:</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isLocked}
              className="h-9.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-600 disabled:opacity-60"
            >
              {problem.supportedLanguages?.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Dual Pane Layout */}
      <div className="grid gap-4 lg:grid-cols-2 flex-1">
        {/* Left Panel: Description, Output, History */}
        <section className="border border-slate-200 bg-white rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm" data-reveal>
          <div className="flex border-b border-slate-200 bg-slate-50/50 p-1 gap-1">
            {[
              { id: 'description', label: 'Problem Description', icon: BookOpen },
              { id: 'output', label: 'Console Output', icon: Terminal },
              { id: 'history', label: 'Session History', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 border border-slate-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[560px]">
            {activeTab === 'description' && (
              <div className="space-y-6 font-sans">
                {problem.description && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2 font-medium">{problem.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Task Prompt</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2 whitespace-pre-wrap font-semibold">{problem.prompt}</p>
                </div>

                {problem.inputFormat && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Specification</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2 font-semibold">{problem.inputFormat}</p>
                  </div>
                )}

                {problem.outputFormat && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Output Specification</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2 font-semibold">{problem.outputFormat}</p>
                  </div>
                )}

                {problem.constraints?.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constraints</h3>
                    <ul className="list-disc list-inside text-xs text-slate-500 mt-2 space-y-1.5 font-semibold">
                      {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 font-mono">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Sample Test Cases</h3>
                  <div className="grid gap-3.5 mt-3">
                    {problem.testCases?.map((tc, idx) => (
                      <div key={tc._id || idx} className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-xs">
                        <span className="block text-[9px] text-blue-600 uppercase font-bold mb-2">Case {idx + 1}</span>
                        <div className="grid gap-3 sm:grid-cols-2 font-semibold">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Input:</span>
                            <pre className="text-slate-700 whitespace-pre-wrap mt-0.5">{tc.input}</pre>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Expected:</span>
                            <pre className="text-slate-700 whitespace-pre-wrap mt-0.5">{tc.expectedOutput}</pre>
                          </div>
                        </div>
                        {tc.explanation && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200/60 font-sans text-slate-500">
                            <span className="text-slate-400 block text-[9px] font-bold uppercase">Explanation:</span>
                            <span className="text-[11px] font-medium leading-relaxed">{tc.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'output' && (
              <div className="space-y-4">
                {running ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Executing sandbox compilers...</span>
                  </div>
                ) : runResult ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3.5">
                      {runResult.status === 'accepted' ? (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100 text-xs font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                          {runResult.isPlaygroundRun ? 'Dry Run Passed' : 'Accepted'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-100 text-xs font-bold">
                          <XCircle className="h-4 w-4" />
                          {runResult.status?.replace('_', ' ').toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs text-slate-500 font-bold">
                        Overall Score: <span className="text-blue-600 font-extrabold">{runResult.score}%</span>
                      </span>
                    </div>

                    <div className="space-y-3.5 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {runResult.isPlaygroundRun ? 'Dry Run Outcomes (Visible cases only)' : 'Evaluation Results'}
                      </h3>
                      {runResult.executionResults?.length ? (
                        <div className="space-y-3 font-mono">
                          {runResult.executionResults.map((res, idx) => {
                            // Determine if this testcase is sample or hidden
                            // If isPlaygroundRun is true, it only ran against samples.
                            // If it is a submission run, match res.testCase against problem.testCases (which contains only samples for students).
                            const matchedSample = problem.testCases?.find(tc => tc._id === res.testCase || tc.id === res.testCase);
                            const isHidden = !runResult.isPlaygroundRun && !matchedSample;

                            return (
                              <div key={res._id || idx} className={`rounded-xl border p-4 text-xs space-y-3 ${
                                isHidden ? 'border-indigo-100 bg-indigo-50/10' : 'border-slate-200 bg-slate-50'
                              }`}>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] text-blue-600 uppercase font-bold">
                                    {isHidden ? `Hidden Case #${idx + 1}` : `Sample Case #${idx + 1}`}
                                  </span>
                                  <span className={`text-[10px] uppercase font-bold ${res.status === 'accepted' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {res.status?.toUpperCase()}
                                  </span>
                                </div>

                                {/* Render details only if it is not hidden */}
                                {!isHidden ? (
                                  <>
                                    {res.stdout && (
                                      <div className="bg-white p-2.5 rounded border border-slate-200/60 font-semibold">
                                        <span className="text-slate-400 block text-[9px] font-bold">Stdout:</span>
                                        <pre className="text-slate-700 whitespace-pre-wrap mt-0.5">{res.stdout}</pre>
                                      </div>
                                    )}
                                    {res.stderr && (
                                      <div className="bg-rose-50/20 p-2.5 rounded border border-rose-100 font-semibold">
                                        <span className="text-rose-500 block text-[9px] font-bold">Stderr Details:</span>
                                        <pre className="text-rose-600 whitespace-pre-wrap mt-0.5">{res.stderr}</pre>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="bg-indigo-50/20 p-2.5 rounded border border-indigo-100/50 text-[10px] font-medium text-slate-500">
                                    Details for hidden evaluation criteria are protected for security compliance.
                                  </div>
                                )}

                                <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200/60 pt-2 font-bold uppercase tracking-wider">
                                  <span>Runtime: {res.runtimeMs ?? 0}ms</span>
                                  <span>Memory: {Math.round((res.memoryKb || 0) / 1024 * 10) / 10}MB</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-semibold">No detailed logs cached.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-300">
                      <Terminal className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Execute code compiler to view outputs.</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {history.length ? (
                  history.map((sub, idx) => (
                    <button
                      key={sub._id || idx}
                      onClick={() => setSelectedHistory(sub)}
                      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-xl block group"
                    >
                      <div className="rounded-xl p-4 flex justify-between items-center text-xs hover:border-blue-300 transition-all border border-slate-200 bg-white shadow-sm">
                        <div className="space-y-1">
                          <span className="block font-bold text-slate-700">Submission #{history.length - idx}</span>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sub.language} • {new Date(sub.createdAt || Date.now()).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-blue-600 font-mono">{sub.score}%</span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold border ${
                            sub.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-300">
                      <History className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">No submissions found this session.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Monaco IDE & Compiler control */}
        <section className="border border-slate-200 bg-white rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm" data-reveal>
          <div className="flex-1 min-h-[400px]">
            <Editor
              height="100%"
              theme={theme}
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                readOnly: isLocked,
                minimap: { enabled: false },
                cursorBlinking: 'smooth',
                lineHeight: 22,
                fontFamily: "'Fira Code', Consolas, Monaco, monospace",
                padding: { top: 16 },
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'hidden',
                  handleMouseWheel: true,
                }
              }}
            />
          </div>

          <footer className="flex items-center justify-between bg-slate-50/80 px-5 py-4 border-t border-slate-200">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
              Active Compiler Sandbox
            </span>
            <div className="flex gap-2.5">
              <button
                onClick={handleRunCode}
                disabled={running || isLocked}
                className="h-10 px-5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 transition shadow-sm"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : <Play className="h-4 w-4 text-slate-500" />}
                Run Code
              </button>
              <button
                onClick={handleSubmitSolution}
                disabled={running || isLocked}
                className="h-10 px-5 rounded-xl btn-premium-gradient text-xs font-bold flex items-center gap-2 disabled:opacity-50 shadow-md shadow-blue-600/10"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Solution
              </button>
            </div>
          </footer>
        </section>
      </div>

      {/* History details Overlay popup modal */}
      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 md:p-8 space-y-6 flex flex-col justify-between max-h-[85vh]">
            <div className="space-y-4 overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">Submission Logs</h3>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{selectedHistory.language} • {new Date(selectedHistory.createdAt || Date.now()).toLocaleString()}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-bold border ${
                  selectedHistory.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {selectedHistory.status}
                </span>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Source Code:</span>
                <pre className="font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-xs overflow-auto max-h-[300px] whitespace-pre select-text font-semibold">
                  {selectedHistory.sourceCode || selectedHistory.code || '// No code cached'}
                </pre>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedHistory(null)} 
                className="flex-1 h-10.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (isLocked) {
                    toast.error('Editor is locked. You cannot restore code after submission.');
                    return;
                  }
                  setCode(selectedHistory.sourceCode || selectedHistory.code || '');
                  if (selectedHistory.language) {
                    setLanguage(selectedHistory.language);
                  }
                  setSelectedHistory(null);
                }}
                disabled={isLocked}
                className="flex-1 h-10.5 rounded-xl btn-premium-gradient text-xs font-bold shadow-md shadow-blue-600/10 disabled:opacity-40"
              >
                Restore to Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
