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
  const [selectedHistory, setSelectedHistory] = useState(null);

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
      <div className="page-shell space-y-6 py-6 px-4 text-[#0f172a]">
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
      <div className="page-shell py-8 px-4 text-[#0f172a]">
        <InlineAlert>Problem library could not be loaded. Please ensure this challenge exists.</InlineAlert>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="page-shell min-h-[calc(100vh-100px)] flex flex-col gap-4 py-4 px-4 text-[#0f172a] select-none">
      {/* Workspace Header */}
      <header className="flex items-center justify-between border border-slate-200 bg-white rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/coding')}
            className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">{problem.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                problem.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600' :
                problem.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="block text-xs font-semibold text-slate-500">Language:</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 outline-none focus:border-blue-600"
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
        <section className="border border-slate-200 bg-white rounded-xl flex flex-col justify-between overflow-hidden shadow-sm" data-reveal>
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            {['description', 'output', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-xs font-bold capitalize border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
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
                  <h3 className="text-sm font-bold text-slate-700">Problem Statement</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2 whitespace-pre-wrap">{problem.prompt}</p>
                </div>

                {problem.constraints?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">Constraints</h3>
                    <ul className="list-disc list-inside text-xs text-slate-500 mt-2 space-y-1">
                      {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-slate-700">Sample Test Cases</h3>
                  <div className="grid gap-3 mt-3">
                    {problem.testCases?.map((tc, idx) => (
                      <div key={tc._id || idx} className="rounded-lg bg-slate-50 border border-slate-200/80 p-4 text-xs font-mono">
                        <span className="block text-[10px] text-blue-600 uppercase font-bold mb-2">Case {idx + 1}</span>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div>
                            <span className="text-slate-400 block font-semibold">Input:</span>
                            <pre className="text-slate-700 whitespace-pre-wrap">{tc.input}</pre>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold">Expected Output:</span>
                            <pre className="text-slate-700 whitespace-pre-wrap">{tc.expectedOutput}</pre>
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
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <span className="text-xs text-slate-500 font-medium">Compiling and running against test cases...</span>
                  </div>
                ) : runResult ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      {runResult.status === 'accepted' ? (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-xs font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          Accepted
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 text-xs font-semibold">
                          <XCircle className="h-4 w-4" />
                          {runResult.status?.replace('_', ' ').toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs text-slate-500 font-semibold">Score: {runResult.score}%</span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-700">Test Cases Details</h3>
                      {runResult.executionResults?.length ? (
                        <div className="space-y-3">
                          {runResult.executionResults.map((res, idx) => (
                            <div key={res._id || idx} className="rounded-lg bg-slate-50 border border-slate-200/80 p-4 text-xs font-mono space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-blue-600 uppercase font-bold">Case {idx + 1}</span>
                                <span className={`text-[10px] uppercase font-bold ${res.status === 'accepted' ? 'text-emerald-600' : 'text-rose-600'}`}>{res.status}</span>
                              </div>
                              {res.stdout && (
                                <div>
                                  <span className="text-slate-400 block text-[10px] font-semibold">Stdout:</span>
                                  <pre className="text-slate-700 whitespace-pre-wrap">{res.stdout}</pre>
                                </div>
                              )}
                              {res.stderr && (
                                <div>
                                  <span className="text-rose-500 block text-[10px] font-semibold">Error/Stderr:</span>
                                  <pre className="text-rose-600 whitespace-pre-wrap">{res.stderr}</pre>
                                </div>
                              )}
                              <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200/60 pt-2 mt-2 font-semibold">
                                <span>Runtime: {res.runtimeMs}ms</span>
                                <span>Memory: {Math.round(res.memoryKb / 1024 * 10) / 10}MB</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-semibold">No output details available.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center space-y-2">
                    <Info className="h-8 w-8 text-slate-300" />
                    <span className="text-xs font-medium">Execute code or submit a solution to view output logs here.</span>
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
                      className="w-full text-left focus:outline-none focus:ring-1 focus:ring-blue-600 rounded-lg block"
                    >
                      <div className="rounded-lg p-4 flex justify-between items-center text-xs hover:bg-slate-50 transition border border-slate-200 bg-white shadow-sm shadow-slate-100/30">
                        <div>
                          <span className="block font-bold text-slate-700">Submission #{history.length - idx}</span>
                          <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">{sub.language?.toUpperCase()} • {new Date(sub.createdAt || Date.now()).toLocaleDateString()} {new Date(sub.createdAt || Date.now()).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold font-mono text-blue-600">{sub.score}% Score</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            sub.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center space-y-2">
                    <RefreshCw className="h-8 w-8 text-slate-300" />
                    <span className="text-xs font-medium">No submission history found for this session.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Right Pane - Monaco Code Editor & Actions */}
        <section className="border border-slate-200 bg-white rounded-xl flex flex-col justify-between overflow-hidden shadow-sm" data-reveal>
          <div className="flex-1 min-h-[350px]">
            <Editor
              height="100%"
              theme="light"
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

          <footer className="flex items-center justify-between bg-slate-50 px-5 py-4 border-t border-slate-200">
            <span className="text-xs text-slate-400 font-mono font-semibold">Boilerplate code active</span>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExecute(false)}
                disabled={running}
                variant="secondary"
                className="flex items-center gap-2 border border-slate-200 hover:bg-slate-100"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin text-slate-600" /> : <Play className="h-4 w-4 text-slate-600" />}
                Run Code
              </Button>
              <Button
                onClick={() => handleExecute(true)}
                disabled={running}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/10"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Solution
              </Button>
            </div>
          </footer>
        </section>
      </div>

      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl p-8 space-y-6 flex flex-col justify-between max-h-[90vh] border border-slate-200 bg-white shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Submission Details</h3>
                  <p className="text-xs text-slate-400 mt-1 capitalize font-semibold">{selectedHistory.language} • {new Date(selectedHistory.createdAt || Date.now()).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  selectedHistory.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {selectedHistory.status}
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-500 mb-2">Submitted Source Code:</span>
                <pre className="font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-xs overflow-auto max-h-[300px] whitespace-pre select-text">
                  {selectedHistory.sourceCode || selectedHistory.code || '// No source code cached'}
                </pre>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
              <Button onClick={() => setSelectedHistory(null)} variant="secondary" className="flex-1 border border-slate-200 hover:bg-slate-50">
                Close
              </Button>
              <Button
                onClick={() => {
                  setCode(selectedHistory.sourceCode || selectedHistory.code || '');
                  if (selectedHistory.language) {
                    setLanguage(selectedHistory.language);
                  }
                  setSelectedHistory(null);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/10"
              >
                Restore Code to Editor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
