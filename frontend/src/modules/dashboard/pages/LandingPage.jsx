import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Code2, Shield, BarChart3, Users, 
  Terminal, Sparkles, CheckCircle2, Star, HelpCircle, 
  Trophy, Play, Clock3, Award, ArrowUpRight, Check, Zap
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { Logo } from '../../../components/ui/Logo';
import gsap from 'gsap';

export const LandingPage = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [activeShowcase, setActiveShowcase] = useState('coding');
  
  const heroRef = useRef(null);
  const showcaseRef = useRef(null);

  useEffect(() => {
    if (accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    // GSAP animations for hero section
    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power4.out'
      });

      gsap.from('.hero-badge-reveal', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfe] text-[#0f172a] overflow-x-hidden font-sans selection:bg-blue-500/20 antialiased">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[5%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[130px] animate-pulse-glow" />
        <div className="absolute top-[-5%] right-[5%] w-[700px] h-[700px] rounded-full bg-blue-400/10 blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[50%] left-[30%] w-[350px] h-[350px] rounded-full bg-cyan-400/5 blur-[100px]" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-200/50 bg-white/70 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <Logo size={34} />
          <div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">SurCodex</span>
            <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-bold leading-none">Learning & Assessment</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-semibold">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#showcase" className="hover:text-blue-600 transition">Showcase</a>
          <a href="#testimonials" className="hover:text-blue-600 transition">Testimonials</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="text-sm font-bold text-slate-600 hover:text-blue-600 transition px-4 py-2"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="h-10 px-5 rounded-lg btn-premium-gradient font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/15"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 flex flex-col items-center text-center">
        <div className="hero-reveal inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-100 bg-blue-50/60 text-blue-700 text-xs font-bold mb-8">
          <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Next-Generation Technical Skill Verification</span>
        </div>
        
        <h1 className="hero-reveal text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.12] text-slate-900">
          Transform Assessment <br className="hidden md:inline" />
          into an <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">Educational Journey</span>
        </h1>
        
        <p className="hero-reveal text-slate-500 text-base md:text-lg max-w-2xl mt-6 leading-relaxed font-medium">
          Stunning Monaco playgrounds, live sandbox compilations, telemetry insights, and recruiter diagnostics merged into a single premium learning workspace.
        </p>

        <div className="hero-reveal flex flex-col sm:flex-row gap-4 mt-10 w-full justify-center max-w-md">
          <button 
            onClick={() => navigate('/register')} 
            className="h-12 px-8 rounded-lg btn-premium-gradient font-bold text-sm shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            Create Free Account
            <ArrowRight className="h-4 w-4" />
          </button>
          <a 
            href="#showcase" 
            className="flex items-center justify-center gap-2 px-6 h-12 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-sm font-bold text-slate-600 shadow-sm"
          >
            Explore Interactive Demo
          </a>
        </div>

        {/* Floating elements inside a visual mockup container */}
        <div className="relative w-full max-w-5xl mt-20 mx-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/80">
          {/* Main platform preview screen mockup */}
          <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-left p-6 font-mono text-xs text-slate-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex gap-1.5 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500 text-[10px] ml-4">fibonacci_challenge.py</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">Passed</span>
                <span className="text-slate-600 text-[10px]">Python 3.11</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 font-mono">
              <div className="space-y-1 text-slate-400">
                <p><span className="text-blue-400">def</span> <span className="text-blue-400">fibonacci</span>(n):</p>
                <p className="pl-4">if n &lt;= 0: return []</p>
                <p className="pl-4">elif n == 1: return [0]</p>
                <p className="pl-4">sequence = [0, 1]</p>
                <p className="pl-4">while len(sequence) &lt; n:</p>
                <p className="pl-8">sequence.append(sequence[-1] + sequence[-2])</p>
                <p className="pl-4"><span className="text-blue-400">return</span> sequence</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 space-y-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Compiler Standings</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-400">Test Case 1: Base series</span>
                    <span className="text-emerald-400 font-bold">100% OK (0.2ms)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-400">Test Case 2: Boundary check</span>
                    <span className="text-emerald-400 font-bold">100% OK (0.1ms)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Achievement Badge 1 */}
          <div className="hero-badge-reveal absolute -left-8 top-12 bg-white rounded-xl border border-slate-200 p-3 shadow-xl flex items-center gap-3 animate-float-1 max-w-[200px] text-left">
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Trophy className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Top Standings</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">Ranked in top 2%</p>
            </div>
          </div>

          {/* Floating Achievement Badge 2 */}
          <div className="hero-badge-reveal absolute -right-8 bottom-12 bg-white rounded-xl border border-slate-200 p-3 shadow-xl flex items-center gap-3 animate-float-2 max-w-[200px] text-left">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Active Streak</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">14 Day Learning Streak</p>
            </div>
          </div>
        </div>

        {/* Float visual counters */}
        <div className="hero-reveal grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 w-full max-w-4xl border-t border-slate-200/60 pt-12">
          <div>
            <p className="text-3xl font-extrabold text-blue-600">99.9%</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">Sandbox Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-600">25k+</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">Tasks Completed</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-violet-600">&lt; 0.8s</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">Compilation Latency</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-600">100%</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">Security Compliance</p>
          </div>
        </div>
      </section>

      {/* Trusted By Brands */}
      <section className="border-y border-slate-200/50 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs tracking-wider uppercase font-bold">
          <span>Inspiring modern teams at:</span>
          <div className="flex flex-wrap gap-8 md:gap-12 opacity-85 text-slate-500 font-semibold text-sm">
            <span className="hover:text-blue-600 transition">STRIPE</span>
            <span className="hover:text-blue-600 transition">VERCEL</span>
            <span className="hover:text-blue-600 transition">LINEAR</span>
            <span className="hover:text-blue-600 transition">FRAMER</span>
            <span className="hover:text-blue-600 transition">RAYCAST</span>
          </div>
        </div>
      </section>

      {/* Capabilities / Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28 space-y-20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Features
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Comprehensive Skill Architectures</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm font-medium">Everything you need to design coding sandboxes, take benchmarking tests, and track growth progress.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl space-y-5 border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/40 transition duration-350 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Monaco Code Editor</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Write, compile, and run code with syntax highlighting, indentation helpers, and multiple language support built inside a rich editor arena.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl space-y-5 border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/40 transition duration-350 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Anti-Cheat Analytics</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Sophisticated client-side sensors monitor visibility states, window blur events, and copy-paste signals, providing recruiters with reliable results.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl space-y-5 border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/40 transition duration-350 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="h-11 w-11 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-105 transition">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Executive Diagnostics</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Deep cohort metrics, average score dynamics, execution timings, and verification standing summaries accessible from the recruiter control center.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Showcases */}
      <section id="showcase" ref={showcaseRef} className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Interactive Showcase
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Explore the Workspace</h2>
          <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto">Toggle between the interactive sandbox modes to preview actual student tasks, timed assessments, and dashboard logs.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-slate-200 max-w-lg mx-auto">
          {['coding', 'quiz', 'recruiter'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveShowcase(tab)}
              className={`flex-1 py-4 text-xs font-bold uppercase border-b-2 transition ${
                activeShowcase === tab 
                  ? 'border-blue-600 text-blue-600 font-extrabold' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'coding' ? 'Coding Workspace' : tab === 'quiz' ? 'Quiz Workspace' : 'Recruiter Analytics'}
            </button>
          ))}
        </div>

        {/* Preview Container */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xl shadow-slate-100 max-w-4xl mx-auto relative overflow-hidden min-h-[400px]">
          {activeShowcase === 'coding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-400 text-[11px] ml-4 font-mono font-medium">reverse_string.js</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] text-slate-600 font-mono font-bold">JavaScript</span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-600 font-mono font-bold">Success</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-5 font-mono text-xs text-slate-700 min-h-[220px] border border-slate-100">
                  <p className="text-slate-400">// Compile and reverse string arrays</p>
                  <p className="text-blue-600"><span className="font-bold">function</span> reverseArray(list) &#123;</p>
                  <p className="text-slate-700 pl-4">let left = 0, right = list.length - 1;</p>
                  <p className="text-slate-700 pl-4">while (left &lt; right) &#123;</p>
                  <p className="text-slate-700 pl-8">[list[left], list[right]] = [list[right], list[left]];</p>
                  <p className="text-slate-700 pl-8">left++; right--;</p>
                  <p className="text-slate-700 pl-4">&#125;</p>
                  <p className="text-blue-600 pl-4">return list;</p>
                  <p className="text-blue-600">&#125;</p>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Test Suite Overview</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      <span className="text-slate-600 font-semibold">Test Case 1: Simple inputs</span>
                      <span className="text-emerald-600 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">PASSED</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      <span className="text-slate-600 font-semibold">Test Case 2: Special structures</span>
                      <span className="text-emerald-600 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">PASSED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeShowcase === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Concept: Complexity</span>
                <span className="text-xs text-rose-500 font-mono font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Timer: 18:45</span>
              </div>
              <div className="space-y-5 max-w-2xl mx-auto py-4">
                <p className="text-base font-bold text-slate-800">What is the worst-case space complexity of a balance binary search tree insertion?</p>
                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 text-blue-700 text-xs flex justify-between items-center cursor-pointer">
                    <span className="font-semibold">A. O(log N) space complexity</span>
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition font-semibold">
                    <span>B. O(N) space complexity</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition font-semibold">
                    <span>C. O(1) space complexity</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeShowcase === 'recruiter' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-400 font-bold">Candidate Evaluation Log</span>
                <span className="text-[10px] text-blue-600 font-bold uppercase bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">Cohort: Senior Javascript Engineers</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-slate-200/80 rounded-xl p-4 space-y-3.5 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Elena Rostova</p>
                      <p className="text-[10px] text-slate-400 font-semibold">elena.rostova@dev.net</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600">98% Correct</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '98%' }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                    <span>Timings: 14 mins</span>
                    <span>Anomalies: 0 flags</span>
                  </div>
                </div>
                <div className="border border-slate-200/80 rounded-xl p-4 space-y-3.5 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Marcus Chen</p>
                      <p className="text-[10px] text-slate-400 font-semibold">marcus.chen@tech.io</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600">85% Correct</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '85%' }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                    <span>Timings: 22 mins</span>
                    <span>Anomalies: 1 warning</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Testimonials
          </div>
          <h2 className="text-3xl font-extrabold text-center tracking-tight">Vetted by Engineering Leaders</h2>
          <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto">Read how companies use SurCodex to save countless vetting hours.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition">
            <div className="flex gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4.5 w-4.5 fill-current" />)}
            </div>
            <p className="text-xs text-slate-500 italic font-semibold leading-relaxed">
              "SurCodex cut down our candidate vetting timeline from weeks to less than 48 hours. The sandbox execution is incredibly fast and dependable."
            </p>
            <div className="flex gap-3 items-center border-t border-slate-100 pt-4 mt-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">D</div>
              <div>
                <p className="text-xs font-bold text-slate-800">Director of Engineering</p>
                <p className="text-[10px] text-slate-400 font-semibold">Platform Teams</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition">
            <div className="flex gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4.5 w-4.5 fill-current" />)}
            </div>
            <p className="text-xs text-slate-500 italic font-semibold leading-relaxed">
              "The automated telemetry logs give us complete transparency. We can confidently review developer behaviors without proctoring overhead."
            </p>
            <div className="flex gap-3 items-center border-t border-slate-100 pt-4 mt-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">V</div>
              <div>
                <p className="text-xs font-bold text-slate-800">VP of Talent</p>
                <p className="text-[10px] text-slate-400 font-semibold">Fintech Scaleup</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition">
            <div className="flex gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4.5 w-4.5 fill-current" />)}
            </div>
            <p className="text-xs text-slate-500 italic font-semibold leading-relaxed">
              "Candidates love the clean IDE workspace. It feels like compiling inside VS Code. The platform branding is premium and inspiring."
            </p>
            <div className="flex gap-3 items-center border-t border-slate-100 pt-4 mt-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">L</div>
              <div>
                <p className="text-xs font-bold text-slate-800">HR Lead</p>
                <p className="text-[10px] text-slate-400 font-semibold">AI Automation SaaS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            FAQ
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm font-medium">Clear answers to common questions about sandboxes and telemetries.</p>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2 shadow-sm">
            <p className="text-sm font-bold flex items-center gap-2.5 text-blue-600">
              <HelpCircle className="h-4.5 w-4.5 shrink-0" />
              How does the code compilation process work?
            </p>
            <p className="text-xs text-slate-500 pl-7 leading-relaxed font-semibold">
              SurCodex utilizes an isolated sandbox compilation backend (Judge0) that executes submissions inside container environments. It feeds inputs, logs stderr/stdout, and tracks execution timing.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2 shadow-sm">
            <p className="text-sm font-bold flex items-center gap-2.5 text-blue-600">
              <HelpCircle className="h-4.5 w-4.5 shrink-0" />
              Can I customize coding challenges or quizzes?
            </p>
            <p className="text-xs text-slate-500 pl-7 leading-relaxed font-semibold">
              Yes. Instructors and recruiters can construct problems in the Quiz Studio or Coding Arena, configure compiler run constraints, test case matrices, and custom guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-slate-500 text-sm font-medium">Select a plan aligned with your hiring pipeline requirements.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 space-y-6 flex flex-col justify-between hover:shadow-lg transition">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Developer Starter</p>
              <p className="text-4xl font-extrabold text-slate-800">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <p className="text-xs text-slate-500 font-medium">Ideal for candidate testing and running simple trial quiz assessments.</p>
              <hr className="border-slate-100" />
              <ul className="text-xs text-slate-600 space-y-3 font-semibold">
                <li className="flex items-center gap-2">✓ 1 Active Quiz Task</li>
                <li className="flex items-center gap-2">✓ 5 Evaluated Code Runs</li>
                <li className="flex items-center gap-2">✓ Basic Anti-cheat logging</li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')} 
              className="w-full h-11 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Get Started Free
            </button>
          </div>

          {/* Plan 2 - Growth Pro */}
          <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 relative space-y-6 flex flex-col justify-between shadow-2xl shadow-blue-100">
            <div className="absolute top-[-12px] right-6 bg-blue-600 text-white text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">Popular</div>
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Growth Pro</p>
              <p className="text-4xl font-extrabold text-slate-800">$49 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <p className="text-xs text-slate-500 font-medium">Perfect for scaling up pipelines and running multiple test queues.</p>
              <hr className="border-blue-100" />
              <ul className="text-xs text-slate-600 space-y-3 font-semibold">
                <li className="flex items-center gap-2 text-blue-600">✓ Unlimited Quiz Tasks</li>
                <li className="flex items-center gap-2">✓ 500 Code compiler submissions</li>
                <li className="flex items-center gap-2">✓ Multi-language Judge0 sandboxes</li>
                <li className="flex items-center gap-2">✓ Interactive Leaderboards & stands</li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')} 
              className="w-full h-11 rounded-lg btn-premium-gradient font-bold text-xs transition shadow-md shadow-blue-600/15"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Plan 3 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 space-y-6 flex flex-col justify-between hover:shadow-lg transition">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Scale Enterprise</p>
              <p className="text-4xl font-extrabold text-slate-800">$149 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <p className="text-xs text-slate-500 font-medium">For large engineering cohorts requesting strict SLA guarantees.</p>
              <hr className="border-slate-100" />
              <ul className="text-xs text-slate-600 space-y-3 font-semibold">
                <li className="flex items-center gap-2">✓ Dedicated compiler sandboxes</li>
                <li className="flex items-center gap-2">✓ Export verified PDF aggregates</li>
                <li className="flex items-center gap-2">✓ Priority 24/7 dedicated support</li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')} 
              className="w-full h-11 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-16 text-center text-slate-400 text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <div className="flex justify-center mb-2">
            <Logo size={28} />
          </div>
          <p className="text-slate-500">SurCodex assessment platform &copy; {new Date().getFullYear()}. All rights reserved.</p>
          <p className="max-w-md mx-auto leading-relaxed text-[11px] text-slate-400">
            Providing high-integrity compiler sandbox testing environments and analytics for modern technical organizations.
          </p>
        </div>
      </footer>
    </div>
  );
};
