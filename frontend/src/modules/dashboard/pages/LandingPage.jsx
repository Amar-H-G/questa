import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Shield, BarChart3, Users, Terminal, Sparkles, CheckCircle2, Star, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { Logo } from '../../../components/ui/Logo';

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
    <div className="min-h-screen bg-white text-[#0f172a] overflow-x-hidden font-sans selection:bg-blue-500/20 antialiased">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[5%] w-[450px] h-[450px] rounded-full bg-blue-50/60 blur-[100px]" />
        <div className="absolute top-[-5%] right-[5%] w-[550px] h-[550px] rounded-full bg-indigo-50/80 blur-[130px]" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0">
        <Logo size={32} showText={true} />
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#showcase" className="hover:text-blue-600 transition">Showcase</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition px-4 py-2">Log In</button>
          <Button onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 text-xs px-4 h-9">
            Get Started
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 bg-blue-50/50 text-blue-700 text-xs font-semibold mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Gen Coding Assessments
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.15] text-[#0f172a]">
          Evaluate Candidates with <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Developer Intelligence
          </span>
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mt-6 leading-relaxed">
          Stunning programming tasks, sandbox evaluations, telemetry monitoring, and recruiter analytical tools packaged inside a premium platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 h-12 text-sm shadow-lg shadow-blue-600/10">
            Start Free Assessment
          </Button>
          <a href="#showcase" className="flex items-center justify-center gap-2 px-6 h-12 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-sm font-semibold text-slate-600">
            View Live Sandbox
          </a>
        </div>

        {/* Float visual counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full max-w-4xl border-t border-slate-100 pt-12">
          <div>
            <p className="text-3xl font-extrabold text-blue-600">99.8%</p>
            <p className="text-xs text-slate-400 mt-1">Sandbox Execution Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-indigo-600">12k+</p>
            <p className="text-xs text-slate-400 mt-1">Evaluations Submissions</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-violet-600">&lt; 1.2s</p>
            <p className="text-xs text-slate-400 mt-1">Average Polling Latency</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-600">100%</p>
            <p className="text-xs text-slate-400 mt-1">Telemetry Integrity Checks</p>
          </div>
        </div>
      </section>

      {/* Trusted By Brand Logos */}
      <section className="border-y border-slate-100 bg-[#f8fafc] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs tracking-wider uppercase font-bold">
          <span>Trusted by modern scaleups:</span>
          <div className="flex flex-wrap gap-8 md:gap-12 opacity-80 text-slate-500 font-semibold">
            <span className="hover:text-[#0f172a] transition">stripe</span>
            <span className="hover:text-[#0f172a] transition">vercel</span>
            <span className="hover:text-[#0f172a] transition">linear</span>
            <span className="hover:text-[#0f172a] transition">framer</span>
            <span className="hover:text-[#0f172a] transition">raycast</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Comprehensive Capabilities</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm font-medium">Everything recruiters and engineering managers need to evaluate programming skills, run quizzes, and trace candidate activity.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl space-y-4 border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/50 transition duration-300 group">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a]">Monaco Code Arena</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">A full-featured IDE setup with multi-language compiler integrations, test case runners, execution trackers, and historic states restoration.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl space-y-4 border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/50 transition duration-300 group">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a]">Anti-Cheat Telemetry</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Monitors visibility swaps, fullscreen changes, and copy-paste events. Logs anomalies to the backend to generate integrity indexes.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl space-y-4 border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/50 transition duration-300 group">
            <div className="h-10 w-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-105 transition">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a]">Recruiter Analytics</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Aggregated graphs, trend trackers, PDF standings reports export, and candidate detail metrics all under a sleek dashboard center.</p>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview Showcases */}
      <section id="showcase" className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Interactive Previews</h2>
          <p className="text-slate-500 text-sm font-medium">Explore interactive mock workspaces and view candidate-side setups.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center border-b border-slate-200 max-w-md mx-auto">
          {['coding', 'quiz', 'recruiter'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveShowcase(tab)}
              className={`flex-1 py-3.5 text-xs font-bold capitalize border-b-2 transition ${
                activeShowcase === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab} Mode
            </button>
          ))}
        </div>

        {/* Showcase Area */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md shadow-slate-100 max-w-5xl mx-auto relative overflow-hidden min-h-[400px]">
          {activeShowcase === 'coding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="text-slate-400 text-[11px] ml-4 font-mono font-medium">workspace.py</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] text-slate-600 font-mono font-medium">Python 3.10</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-600 font-mono font-bold">Active</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 font-mono text-xs text-slate-700 min-h-[200px] border border-slate-100">
                  <p className="text-slate-400">1  # Write your solution here</p>
                  <p className="text-blue-600">2  def solve_challenge(inputs):</p>
                  <p className="text-slate-700">3      res = []</p>
                  <p className="text-indigo-600">4      for item in inputs:</p>
                  <p className="text-indigo-600">5          res.append(item * 2)</p>
                  <p className="text-blue-600">6      return res</p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Suite Standings</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Test Case 1: Base values</span>
                      <span className="text-emerald-600 font-bold font-mono">PASSED (0.4ms)</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Test Case 2: Boundary values</span>
                      <span className="text-emerald-600 font-bold font-mono">PASSED (0.2ms)</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Test Case 3: Empty inputs</span>
                      <span className="text-emerald-600 font-bold font-mono">PASSED (0.1ms)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeShowcase === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-400 font-bold">Question 4 of 12</span>
                <span className="text-xs text-rose-500 font-mono font-bold">Remaining time: 24:12</span>
              </div>
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-sm font-bold text-slate-800">Which of the following database paradigms guarantees strict ACID transactions across distributed shards?</p>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/30 text-blue-700 text-xs flex justify-between items-center cursor-pointer">
                    <span className="font-semibold">A. Spanner-based consensus architectures</span>
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition font-medium">
                    <span>B. Document-store eventual consistency configurations</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition font-medium">
                    <span>C. In-memory key-value eviction stores</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeShowcase === 'recruiter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-400 font-bold">Candidate Standings Summary</span>
                <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">Cohort: Engineering Managers</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition text-xs">
                  <div>
                    <p className="font-bold text-slate-700">Sarah Jenkins</p>
                    <p className="text-[10px] text-slate-400 font-medium">sarah@gmail.com</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-bold">96% score</p>
                    <p className="text-[10px] text-slate-400 font-medium">0 Warnings flags</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition text-xs">
                  <div>
                    <p className="font-bold text-slate-700">Alex Rivera</p>
                    <p className="text-[10px] text-slate-400 font-medium">alex@rivera.io</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-bold">88% score</p>
                    <p className="text-[10px] text-slate-400 font-medium">1 Warning flag</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-12">
        <h2 className="text-3xl font-extrabold text-center tracking-tight">What Engineering Teams Say</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-[#f8fafc] p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-500 italic font-medium">"SurCodex cut down our candidate vetting timeline from weeks to less than 48 hours. The sandbox execution is rock solid."</p>
            <div>
              <p className="text-xs font-bold text-[#0f172a]">Director of Platform Engineering</p>
              <p className="text-[10px] text-slate-400 font-medium">Vercel Partner Team</p>
            </div>
          </div>
          <div className="bg-[#f8fafc] p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-500 italic font-medium">"The automated anti-cheat telemetry validation gave us the confidence to hire remotely without scheduling tedious proctoring sessions."</p>
            <div>
              <p className="text-xs font-bold text-[#0f172a]">VP of Engineering</p>
              <p className="text-[10px] text-slate-400 font-medium">Fintech Platform</p>
            </div>
          </div>
          <div className="bg-[#f8fafc] p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-500 italic font-medium">"Aesthetically stunning. Our candidates praised the assessment experience. It feels like building code inside VS Code."</p>
            <div>
              <p className="text-xs font-bold text-[#0f172a]">HR Lead</p>
              <p className="text-[10px] text-slate-400 font-medium">Automations SaaS</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <h2 className="text-3xl font-extrabold text-center tracking-tight">Frequently Answered Queries</h2>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <p className="text-xs font-bold flex items-center gap-2 text-blue-600">
              <HelpCircle className="h-4 w-4" />
              How is anti-cheat telemetry collected?
            </p>
            <p className="text-xs text-slate-500 pl-6 leading-relaxed font-medium">It monitors browser visibility changes and focus state changes in the candidate's browser window. Anomalies trigger automated warning counters.</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <p className="text-xs font-bold flex items-center gap-2 text-blue-600">
              <HelpCircle className="h-4 w-4" />
              Can I export candidate performance files?
            </p>
            <p className="text-xs text-slate-500 pl-6 leading-relaxed font-medium">Yes. Recruiters can generate spreadsheet CSV records and premium formatted PDF reports directly from the export analytics console card.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Simple, Scalable Pricing</h2>
          <p className="text-slate-500 text-sm font-medium">Choose the plan matching your candidate pipelines and test schedules.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-400">Developer</p>
              <p className="text-3xl font-extrabold">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <p className="text-xs text-slate-500 font-medium">Perfect for sandbox testing and running small quizzes.</p>
              <hr className="border-slate-100" />
              <ul className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-center gap-2">✓ 1 Active Quiz Task</li>
                <li className="flex items-center gap-2">✓ 5 Evaluated Code Submissions</li>
                <li className="flex items-center gap-2">✓ Basic Anti-cheat logging</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full h-10 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition mt-6">Get Started Free</button>
          </div>

          {/* Plan 2 - Pro (Glow Accent) */}
          <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 relative space-y-6 flex flex-col justify-between shadow-xl shadow-blue-50/85">
            <div className="absolute top-[-12px] right-4 bg-blue-600 text-white text-[9px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase">Popular</div>
            <div className="space-y-4">
              <p className="text-sm font-bold text-blue-600">Growth Pro</p>
              <p className="text-3xl font-extrabold">$49 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <p className="text-xs text-slate-500 font-medium">Scale assessment queues for growing software startups.</p>
              <hr className="border-blue-100" />
              <ul className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-center gap-2 text-blue-600">✓ Unlimited Quiz Tasks</li>
                <li className="flex items-center gap-2">✓ 500 Code Sandbox Submissions</li>
                <li className="flex items-center gap-2">✓ Dynamic Leaderboards</li>
                <li className="flex items-center gap-2">✓ Advanced telemetry warnings</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition mt-6">Upgrade to Pro</button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-400">Scale Enterprise</p>
              <p className="text-3xl font-extrabold">$149 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <p className="text-xs text-slate-500 font-medium">For enterprises handling extensive technical vetting.</p>
              <hr className="border-slate-100" />
              <ul className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-center gap-2">✓ Self-hosted Judge0 integration</li>
                <li className="flex items-center gap-2">✓ Verified PDF Standings Reports</li>
                <li className="flex items-center gap-2">✓ Strict SLA support guarantees</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full h-10 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition mt-6">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-[#f8fafc] py-16 text-center text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <p className="font-bold text-slate-500">SurCodex assessments platform &copy; {new Date().getFullYear()}. All rights reserved.</p>
          <p className="max-w-md mx-auto leading-relaxed">Built by engineers, for engineers. Production certified technical validation environment.</p>
        </div>
      </footer>
    </div>
  );
};
