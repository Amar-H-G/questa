import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ChevronLeft, Play, Loader2, Sparkles, AlertCircle, CheckCircle2, Moon, Sun } from 'lucide-react';
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
    <div className="page-shell min-h-[calc(100vh-100px)] flex flex-col gap-4 py-4 px-4 text-[#0f172a] select-none">
      {/* Header Panel */}
      <header className="flex items-center justify-between border border-slate-200 bg-white rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/coding')}
            className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Logo size={22} />
              <h1 className="text-lg font-bold tracking-tight text-slate-800">SurCodex Playground</h1>
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600 border border-blue-100 uppercase tracking-wide">
                <Sparkles className="h-2.5 w-2.5" /> Practice Mode
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Test code snippets freely with any language mode</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Editor Theme Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setTheme('vs-dark')}
              className={`p-1.5 rounded-md transition ${theme === 'vs-dark' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="VS Dark Theme"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition ${theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Light Theme"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Language:</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 outline-none focus:border-blue-600"
            >
              <option value="javascript">JAVASCRIPT (Node.js)</option>
              <option value="python">PYTHON (3.11)</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="java">JAVA (OpenJDK)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Dual Pane Layout */}
      <div className="grid gap-4 lg:grid-cols-2 flex-1">
        {/* Left Pane: Input Stdin & Terminal Output */}
        <section className="flex flex-col gap-4">
          {/* Standard Input Panel */}
          <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm flex flex-col h-[200px]">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Standard Input (stdin)</label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide standard input here if your code reads from stdin..."
              className="flex-1 w-full p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-mono outline-none resize-none focus:border-blue-600 transition"
            />
          </div>

          {/* Standard Output (Terminal Pane) */}
          <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm flex flex-col flex-1 min-h-[300px]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Console Output</label>
              {result && (
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                  <span>Time: {result.runtimeMs}ms</span>
                  <span>Memory: {Math.round(result.memoryKb / 1024 * 10) / 10}MB</span>
                </div>
              )}
            </div>

            <div className="flex-1 rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-auto whitespace-pre-wrap select-text relative">
              {running ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 gap-3 text-slate-400">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <span className="text-xs font-medium">Executing code in playground container...</span>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    {result.status === 'accepted' ? (
                      <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> SUCCESS
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                        <AlertCircle className="h-3 w-3" /> {result.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Stdout Output */}
                  {result.stdout && (
                    <div>
                      <span className="text-slate-500 text-[10px] block mb-1">Standard Output:</span>
                      <pre className="text-slate-100 whitespace-pre-wrap">{result.stdout}</pre>
                    </div>
                  )}

                  {/* Stderr Output */}
                  {result.stderr && (
                    <div>
                      <span className="text-rose-400/80 text-[10px] block mb-1">Error/Stderr Details:</span>
                      <pre className="text-rose-300 whitespace-pre-wrap">{result.stderr}</pre>
                    </div>
                  )}

                  {!result.stdout && !result.stderr && (
                    <span className="text-slate-500 italic">Code executed successfully with no stdout/stderr output.</span>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center gap-2">
                  <Play className="h-6 w-6 text-slate-600" />
                  <span className="text-xs font-medium">Click "Run Code" to execute code and view output here.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Pane: Monaco Editor */}
        <section className="border border-slate-200 bg-white rounded-xl flex flex-col justify-between overflow-hidden shadow-sm">
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
                padding: { top: 12 },
              }}
            />
          </div>

          <footer className="flex items-center justify-between bg-slate-50 px-5 py-4 border-t border-slate-200">
            <span className="text-xs text-slate-400 font-mono font-semibold">Ready to compile</span>
            <Button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/10"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Code
            </Button>
          </footer>
        </section>
      </div>
    </div>
  );
};
