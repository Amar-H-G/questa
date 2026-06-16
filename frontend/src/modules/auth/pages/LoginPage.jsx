import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../../components/ui/Logo';
import { toast } from 'react-hot-toast';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { getErrorMessage } from '../../../services/api/client';
import { AuthSidebar } from '../components/AuthSidebar';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate entry elements cascadingly
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
      await login(form);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      const firstMsg = msg.split('\n')[0];
      toast.error(firstMsg || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main ref={containerRef} className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[#f8fafc] text-[#0f172a] overflow-hidden">
      {/* Left educational sidebar */}
      <AuthSidebar subtitle="Proven capability starts here. Take assignments, verify results, and monitor your score standings in the command panel." />

      {/* Right form center */}
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative">
        {/* Decorative subtle background rings */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-slate-50/70 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8">
          <div className="reveal-item flex items-center justify-between lg:justify-start gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
              <Logo size={40} />
              <div className="lg:hidden">
                <span className="text-lg font-bold tracking-tight text-slate-800">SurCodex</span>
              </div>
            </Link>
          </div>

          <div className="space-y-2 reveal-item">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Log in to access your dashboard, code sandboxes, and assessment queues.
            </p>
          </div>

          <form ref={formRef} onSubmit={submit} className="space-y-5">
            <div className="reveal-item">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2" htmlFor="email">
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
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-sm text-slate-800 outline-none premium-input"
                />
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="reveal-item">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="password">
                  Password
                </label>
                <Link className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline" to="/forgot-password">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-sm text-slate-800 outline-none premium-input"
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
            </div>

            <div className="reveal-item pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-lg btn-premium-gradient font-bold text-sm shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>

          <div className="reveal-item text-center pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              New to SurCodex?{' '}
              <Link className="text-blue-600 hover:text-blue-700 hover:underline font-bold" to="/register">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
