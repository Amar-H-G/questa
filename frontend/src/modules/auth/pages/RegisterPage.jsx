import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../../components/ui/Logo';
import { toast } from 'react-hot-toast';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { getErrorMessage } from '../../../services/api/client';
import { AuthSidebar } from '../components/AuthSidebar';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-item', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      const firstMsg = msg.split('\n')[0];
      toast.error(firstMsg || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main ref={containerRef} className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[#f8fafc] text-[#0f172a] overflow-hidden">
      {/* Left educational sidebar */}
      <AuthSidebar subtitle="Join top-tier developers. Gain credentials, solve compiler sandboxes, take quiz benchmarks, and unlock career capabilities." />

      {/* Right form center */}
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative">
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-slate-50/70 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-7">
          <div className="reveal-item flex items-center justify-between lg:justify-start gap-3">
            <Logo size={40} />
            <div className="lg:hidden">
              <span className="text-lg font-bold tracking-tight text-slate-800">SurCodex</span>
            </div>
          </div>

          <div className="space-y-1.5 reveal-item">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create account</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Sign up today and prove your technical potential with real benchmarks.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="reveal-item">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="h-10.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-sm text-slate-800 outline-none premium-input"
                />
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="reveal-item">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="h-10.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-sm text-slate-800 outline-none premium-input"
                />
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="reveal-item">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-10.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-sm text-slate-800 outline-none premium-input"
                />
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 font-semibold leading-relaxed">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
              </p>
            </div>

            <div className="reveal-item">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="role">
                Select Platform Role
              </label>
              <select
                id="role"
                className="h-10.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-800 outline-none premium-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student (Take Assessments)</option>
                <option value="teacher">Teacher (Design Benchmarks)</option>
                <option value="recruiter">Recruiter (Inspect Talent)</option>
              </select>
            </div>

            <div className="reveal-item pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-lg btn-premium-gradient font-bold text-sm shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>

          <div className="reveal-item text-center pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              Already registered?{' '}
              <Link className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold" to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
