import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ChevronLeft, Play, Loader2, Sparkles, AlertCircle, CheckCircle2, Moon, Sun, Terminal, Zap } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { Button } from '../../../components/ui/Button';
import { Logo } from '../../../components/ui/Logo';

const LANGUAGE_BOILERPLATES = {
  javascript: `// Write your Node.js code here
console.log("Hello, SurCoder!");`,

  python: `# Write your Python 3 code here
print("Hello, SurCoder!")`,

  cpp: `// Write your C++ code here
#include <iostream>

int main() {
    std::cout << "Hello, SurCoder!" << std::endl;
    return 0;
}`,

  java: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, SurCoder!");
    }
}`
};

export const CodingPlaygroundPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark'); // vs-dark or light
  const [code, setCode] = useState(LANGUAGE_BOILERPLATES.javascript);
  const [stdin, setStdin] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(LANGUAGE_BOILERPLATES[newLang] || '');
  };

  const handleRun = async () => {
    setRunning(true);
    setResult(null);

    try {
      const { data } = await apiClient.post('/coding/playground/run', {
        language,
        sourceCode: code,
        stdin,
      });
      setResult(data.data);
    } catch (err) {
      console.error(err);
      setResult({
        status: 'runtime_error',
        stderr: err.response?.data?.message || 'Execution request failed',
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="page-shell min-h-[calc(100vh-120px)] flex flex-col gap-4 py-2 px-1 text-[#0f172a] select-none">
      {/* Header Panel */}
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
              <Logo size={22} />
              <h1 className="text-base font-extrabold tracking-tight text-slate-800">Playground</h1>
              <span className="flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wide">
                <Sparkles className="h-2.5 w-2.5 text-indigo-500" /> Practice Arena
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Compile code snippets instantly with any language</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Editor Theme Switcher */}
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
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Language:</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-9.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-indigo-600"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python (3.11)</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="java">Java (OpenJDK)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Dual Pane Layout */}
      <div className="grid gap-4 lg:grid-cols-2 flex-1">
        {/* Left Pane: Input Stdin & Terminal Output */}
        <section className="flex flex-col gap-4">
          {/* Standard Input Panel */}
          <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-sm flex flex-col h-[200px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Standard Input (stdin)</label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide execution inputs here if your code reads from stdin..."
              className="flex-1 w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono outline-none resize-none focus:border-indigo-600 transition font-semibold"
            />
          </div>

          {/* Standard Output (Terminal Pane) */}
          <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-sm flex flex-col flex-1 min-h-[300px]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                Console Output
              </label>
              {result && (
                <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-slate-400">
                  <span>Time: {result.runtimeMs}ms</span>
                  <span>Memory: {Math.round(result.memoryKb / 1024 * 10) / 10}MB</span>
                </div>
              )}
            </div>

            <div className="flex-1 rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-auto whitespace-pre-wrap select-text relative border border-slate-900 font-semibold">
              {running ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 gap-3 text-slate-400">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Executing in sandbox...</span>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    {result.status === 'accepted' ? (
                      <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> SUCCESS
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-bold text-rose-400 border border-rose-500/20">
                        <AlertCircle className="h-3 w-3" /> {result.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Stdout Output */}
                  {result.stdout && (
                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                      <span className="text-slate-500 text-[9px] font-bold block mb-1">Stdout:</span>
                      <pre className="text-slate-100 whitespace-pre-wrap">{result.stdout}</pre>
                    </div>
                  )}

                  {/* Stderr Output */}
                  {result.stderr && (
                    <div className="bg-rose-950/10 p-3 rounded-lg border border-rose-950/20">
                      <span className="text-rose-400/80 text-[9px] font-bold block mb-1">Error/Stderr:</span>
                      <pre className="text-rose-300 whitespace-pre-wrap">{result.stderr}</pre>
                    </div>
                  )}

                  {!result.stdout && !result.stderr && (
                    <span className="text-slate-500 italic font-medium">Code executed with no outputs.</span>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center">
                    <Play className="h-5 w-5 text-slate-600" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Click Run Code to see output logs.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Pane: Monaco Editor */}
        <section className="border border-slate-200 bg-white rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm">
          <div className="flex-1 min-h-[450px]">
            <Editor
              height="100%"
              theme={theme}
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                cursorBlinking: 'smooth',
                lineHeight: 22,
                fontFamily: "'Fira Code', Consolas, Monaco, monospace",
                padding: { top: 16 },
              }}
            />
          </div>

          <footer className="flex items-center justify-between bg-slate-50/80 px-5 py-4 border-t border-slate-200">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              Practice Sandbox compiler
            </span>
            <button
              onClick={handleRun}
              disabled={running}
              className="h-10 px-6 rounded-xl btn-premium-gradient text-xs font-bold flex items-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/10"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Code
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
};
