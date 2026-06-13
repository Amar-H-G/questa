import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Shield, BarChart3, Users, Zap, Terminal, Sparkles, CheckCircle2, Star, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';

export const LandingPage = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [activeShowcase, setActiveShowcase] = useState('coding');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5 bg-[#07090e]/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-cyan-400 animate-pulse" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SurCodex</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-cyan-300 transition">Features</a>
          <a href="#showcase" className="hover:text-cyan-300 transition">Showcase</a>
          <a href="#pricing" className="hover:text-cyan-300 transition">Pricing</a>
          <a href="#faq" className="hover:text-cyan-300 transition">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium hover:text-cyan-300 transition px-4 py-2">Log In</button>
          <Button onClick={() => navigate('/register')} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 text-xs px-4 h-9">
            Get Started
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-semibold mb-6 animate-bounce">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Gen Coding Assessments
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Evaluate Candidates with <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Developer Intelligence
          </span>
        </h1>
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mt-6 leading-relaxed">
          Stunning programming tasks, sandbox evaluations, telemetry monitoring, and recruiter analytical tools packaged inside a premium platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button onClick={() => navigate('/register')} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-8 h-12 text-sm shadow-xl shadow-cyan-500/10">
            Start Free Assessment
          </Button>
          <a href="#showcase" className="flex items-center justify-center gap-2 px-6 h-12 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition text-sm">
            View Live Sandbox
          </a>
        </div>

        {/* Float visual counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-4xl border-t border-white/5 pt-12">
          <div>
            <p className="text-3xl font-bold text-cyan-400">99.8%</p>
            <p className="text-xs text-slate-500 mt-1">Sandbox Execution Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-400">12k+</p>
            <p className="text-xs text-slate-500 mt-1">Evaluations Submissions</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-400">&lt; 1.2s</p>
            <p className="text-xs text-slate-500 mt-1">Average Polling Latency</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">100%</p>
            <p className="text-xs text-slate-500 mt-1">Telemetry Integrity Checks</p>
          </div>
        </div>
      </section>

      {/* Trusted By Brand Logos */}
      <section className="border-y border-white/5 bg-white/[0.01] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs tracking-wider uppercase font-semibold">
          <span>Trusted by modern scaleups:</span>
          <div className="flex flex-wrap gap-8 md:gap-12 opacity-60">
            <span className="hover:text-white transition">stripe</span>
            <span className="hover:text-white transition">vercel</span>
            <span className="hover:text-white transition">linear</span>
            <span className="hover:text-white transition">framer</span>
            <span className="hover:text-white transition">raycast</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">Comprehensive Capabilities</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">Everything recruiters and engineering managers need to evaluate programming skills, run quizzes, and trace candidate activity.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl space-y-4 border border-white/5 hover:border-cyan-500/20 transition duration-300 group">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Monaco Code Arena</h3>
            <p className="text-xs text-slate-400 leading-relaxed">A full-featured IDE setup with multi-language compiler integrations, test case runners, execution trackers, and historic states restoration.</p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl space-y-4 border border-white/5 hover:border-blue-500/20 transition duration-300 group">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Anti-Cheat Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Monitors visibility swaps, fullscreen changes, and copy-paste events. Logs anomalies to the backend to generate integrity indexes.</p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl space-y-4 border border-white/5 hover:border-indigo-500/20 transition duration-300 group">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Recruiter Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Aggregated graphs, trend trackers, PDF standings reports export, and candidate detail metrics all under a sleek dashboard center.</p>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview Showcases */}
      <section id="showcase" className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold">Interactive Previews</h2>
          <p className="text-slate-400 text-sm">Explore interactive mock workspaces and view candidate-side setups.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center border-b border-white/10 max-w-md mx-auto">
          {['coding', 'quiz', 'recruiter'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveShowcase(tab)}
              className={`flex-1 py-3 text-xs font-semibold capitalize border-b-2 transition ${
                activeShowcase === tab ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab} Mode
            </button>
          ))}
        </div>

        {/* Showcase Area */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 max-w-5xl mx-auto bg-slate-950/40 relative overflow-hidden min-h-[400px]">
          {activeShowcase === 'coding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-500 text-[11px] ml-4 font-mono">workspace.py</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/15 text-[10px] text-slate-300 font-mono">Python 3.10</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">Active</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0b0f17] rounded-lg p-4 font-mono text-xs text-slate-300 min-h-[200px] border border-white/5">
                  <p className="text-slate-600">1  # Write your solution here</p>
                  <p className="text-cyan-400">2  def solve_challenge(inputs):</p>
                  <p className="text-slate-300">3      res = []</p>
                  <p className="text-indigo-400">4      for item in inputs:</p>
                  <p className="text-emerald-400">5          res.append(item * 2)</p>
                  <p className="text-cyan-400">6      return res</p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Test Suite Standings</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-[#0b0f17] p-2.5 rounded border border-white/5 text-xs">
                      <span className="text-slate-400">Test Case 1: Base values</span>
                      <span className="text-emerald-400 font-semibold font-mono">PASSED (0.4ms)</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0b0f17] p-2.5 rounded border border-white/5 text-xs">
                      <span className="text-slate-400">Test Case 2: Boundary values</span>
                      <span className="text-emerald-400 font-semibold font-mono">PASSED (0.2ms)</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0b0f17] p-2.5 rounded border border-white/5 text-xs">
                      <span className="text-slate-400">Test Case 3: Empty inputs</span>
                      <span className="text-emerald-400 font-semibold font-mono">PASSED (0.1ms)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeShowcase === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs text-slate-400 font-semibold">Question 4 of 12</span>
                <span className="text-xs text-rose-400 font-mono font-semibold">Remaining time: 24:12</span>
              </div>
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-sm font-semibold">Which of the following database paradigms guarantees strict ACID transactions across distributed shards?</p>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-950/10 text-cyan-300 text-xs flex justify-between items-center cursor-pointer">
                    <span>A. Spanner-based consensus architectures</span>
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-slate-900/40 text-slate-400 text-xs cursor-pointer hover:border-white/10 transition">
                    <span>B. Document-store eventual consistency configurations</span>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-slate-900/40 text-slate-400 text-xs cursor-pointer hover:border-white/10 transition">
                    <span>C. In-memory key-value eviction stores</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeShowcase === 'recruiter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs text-slate-400 font-semibold">Candidate Standings Summary</span>
                <span className="text-[11px] text-cyan-300 font-semibold tracking-wider uppercase bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-500/20">Cohort: Engineering Managers</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-white/5 hover:border-white/10 transition text-xs">
                  <div>
                    <p className="font-semibold">Sarah Jenkins</p>
                    <p className="text-[10px] text-slate-500">sarah@gmail.com</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-semibold">96% score</p>
                    <p className="text-[10px] text-slate-500">0 Warnings flags</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-white/5 hover:border-white/10 transition text-xs">
                  <div>
                    <p className="font-semibold">Alex Rivera</p>
                    <p className="text-[10px] text-slate-500">alex@rivera.io</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-semibold">88% score</p>
                    <p className="text-[10px] text-slate-500">1 Warning flag</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <h2 className="text-3xl font-bold text-center">What Engineering Teams Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-400 italic">"SurCodex cut down our candidate vetting timeline from weeks to less than 48 hours. The sandbox execution is rock solid."</p>
            <div>
              <p className="text-xs font-semibold">Director of Platform Engineering</p>
              <p className="text-[10px] text-slate-500">Vercel Partner Team</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-400 italic">"The automated anti-cheat telemetry validation gave us the confidence to hire remotely without scheduling tedious proctoring sessions."</p>
            <div>
              <p className="text-xs font-semibold">VP of Engineering</p>
              <p className="text-[10px] text-slate-500">Fintech Platform</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-400 italic">"Aesthetically stunning. Our candidates praised the assessment experience. It feels like building code inside VS Code."</p>
            <div>
              <p className="text-xs font-semibold">HR Lead</p>
              <p className="text-[10px] text-slate-500">Automations SaaS</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <h2 className="text-3xl font-bold text-center">Frequently Answered Queries</h2>
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
            <p className="text-xs font-semibold flex items-center gap-2 text-cyan-300">
              <HelpCircle className="h-4 w-4" />
              How is anti-cheat telemetry collected?
            </p>
            <p className="text-xs text-slate-400 pl-6 leading-relaxed">It monitors browser visibility changes and focus state changes in the candidate's browser window. Anomalies trigger automated warning counters.</p>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
            <p className="text-xs font-semibold flex items-center gap-2 text-cyan-300">
              <HelpCircle className="h-4 w-4" />
              Can I export candidate performance files?
            </p>
            <p className="text-xs text-slate-400 pl-6 leading-relaxed">Yes. Recruiters can generate spreadsheet CSV records and premium formatted PDF reports directly from the export analytics console card.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold">Simple, Scalable Pricing</h2>
          <p className="text-slate-400 text-sm">Choose the plan matching your candidate pipelines and test schedules.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-400">Developer</p>
              <p className="text-3xl font-bold">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
              <p className="text-xs text-slate-400">Perfect for sandbox testing and running small quizzes.</p>
              <hr className="border-white/5" />
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">✓ 1 Active Quiz Task</li>
                <li className="flex items-center gap-2">✓ 5 Evaluated Code Submissions</li>
                <li className="flex items-center gap-2">✓ Basic Anti-cheat logging</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full h-10 rounded-lg border border-white/10 text-xs font-semibold hover:bg-white/5 transition mt-6">Get Started Free</button>
          </div>

          {/* Plan 2 - Pro (Glow Accent) */}
          <div className="glass-panel p-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/5 relative space-y-6 flex flex-col justify-between shadow-2xl shadow-cyan-500/5">
            <div className="absolute top-[-12px] right-4 bg-cyan-500 text-slate-950 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">Popular</div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-cyan-300">Growth Pro</p>
              <p className="text-3xl font-bold">$49 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
              <p className="text-xs text-cyan-200">Scale assessment queues for growing software startups.</p>
              <hr className="border-cyan-500/10" />
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2 text-cyan-300">✓ Unlimited Quiz Tasks</li>
                <li className="flex items-center gap-2">✓ 500 Code Sandbox Submissions</li>
                <li className="flex items-center gap-2">✓ Dynamic Leaderboards</li>
                <li className="flex items-center gap-2">✓ Advanced telemetry warnings</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full h-10 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition mt-6">Upgrade to Pro</button>
          </div>

          {/* Plan 3 */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-400">Scale Enterprise</p>
              <p className="text-3xl font-bold">$149 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
              <p className="text-xs text-slate-400">For enterprises handling extensive technical vetting.</p>
              <hr className="border-white/5" />
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">✓ Self-hosted Judge0 integration</li>
                <li className="flex items-center gap-2">✓ Verified PDF Standings Reports</li>
                <li className="flex items-center gap-2">✓ Strict SLA support guarantees</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full h-10 rounded-lg border border-white/10 text-xs font-semibold hover:bg-white/5 transition mt-6">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#04060a] py-12 text-center text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <p className="font-semibold text-slate-400">SurCodex assessments platform &copy; {new Date().getFullYear()}. All rights reserved.</p>
          <p className="max-w-md mx-auto leading-relaxed">Built by engineers, for engineers. Production certified technical validation environment.</p>
        </div>
      </footer>
    </div>
  );
};
