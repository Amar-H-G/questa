import React from 'react';
import { Logo } from '../../../components/ui/Logo';
import { Code2, Award, Zap, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';

export const AuthSidebar = ({ subtitle }) => {
  return (
    <div className="relative hidden w-full lg:flex flex-col justify-between bg-gradient-to-br from-[#0c1020] via-[#111827] to-[#1e1b4b] p-12 text-white overflow-hidden select-none">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Radial Gradient Ambient Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Top logo */}
      <div className="relative z-10 flex items-center gap-3">
        <Logo size={36} className="text-white" showText={false} />
        <div>
          <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">SurCodex</span>
          <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Education Platform</span>
        </div>
      </div>

      {/* Hero Visual Middle */}
      <div className="relative z-10 my-auto py-10 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
            <Zap className="h-3 w-3" />
            Empowering Technical Excellence
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
            Verify skills with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              intelligent learning paths
            </span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
            {subtitle || 'Unlock interactive coding environments, sandbox execution analytics, and real-time telemetry checkpoints.'}
          </p>
        </div>

        {/* Floating Code Panel Mockup */}
        <div className="relative rounded-xl border border-slate-700/60 bg-[#070b19]/90 p-5 shadow-2xl shadow-slate-900/60 backdrop-blur-md animate-float-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-500 font-mono ml-3">learning_matrix.js</span>
            </div>
            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">JS Engine</span>
          </div>

          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p className="text-slate-500"><span className="text-indigo-400">const</span> evaluateSkill = (developer) =&gt; &#123;</p>
            <p className="pl-4"><span className="text-indigo-400">const</span> streak = developer.learningStreak;</p>
            <p className="pl-4 text-emerald-400"><span className="text-indigo-400">if</span> (streak &gt; 10) return "Mastery Level";</p>
            <p className="pl-4 text-slate-500">return "Unlocking potential...";</p>
            <p className="text-slate-500">&#125;;</p>
          </div>

          {/* Floater Element: Mini Achievement Card */}
          <div className="absolute -right-6 -bottom-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center gap-3 animate-float-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold leading-none">Milestone Reached</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">100% Compiler Test Passed</p>
            </div>
          </div>
        </div>

        {/* Educational Cues */}
        <div className="grid grid-cols-2 gap-4 max-w-md pt-4">
          <div className="flex gap-2.5 items-start">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">Interactive Compiler</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Write and compile code inside custom sandboxes.</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-start">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">Telemetry Integrity</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Transparent behavior checkpoints for certified results.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer system details */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>Powered by Judge0 sandbox compiler</span>
        <span>Version 2.4.0</span>
      </div>
    </div>
  );
};
