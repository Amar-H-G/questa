import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../../components/ui/Logo';
import { KeyRound, CheckCircle2, Loader2, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient, getErrorMessage } from '../../../services/api/client';
import { AuthSidebar } from '../components/AuthSidebar';
import gsap from 'gsap';

export const ResetPassPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    if (!token) {
      toast.error('Password reset token is missing. Please request a new reset link.');
    }

    return () => ctx.revert();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/auth/reset-password', { token, password });
      toast.success('Password has been reset successfully!');
      setSuccess(true);
    } catch (err) {
      const msg = getErrorMessage(err);
      const firstMsg = msg.split('\n')[0];
      toast.error(firstMsg || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main ref={containerRef} className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[#f8fafc] text-[#0f172a] overflow-hidden">
      {/* Left educational sidebar */}
      <AuthSidebar subtitle="Choose a strong recovery key code. Ensure your credential keys contain mixed character metrics for high safety check indices." />

      {/* Right form center */}
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative">
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-slate-50/70 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8">
          <div className="reveal-item flex items-center justify-between lg:justify-start gap-3">
            <Logo size={40} />
            <div className="lg:hidden">
              <span className="text-lg font-bold tracking-tight text-slate-800">SurCodex</span>
            </div>
          </div>

          {success ? (
            <div className="space-y-6 text-center reveal-item">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-pulse">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Password Reset!</h2>
                <p className="text-sm text-slate-500 font-medium">
                  Your password has been successfully configured. You can now login with your new credentials.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full h-11 rounded-lg btn-premium-gradient font-bold text-sm shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2 reveal-item">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Set new password</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Choose a robust password to secure your coding tasks profile database records.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="reveal-item">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      disabled={!token}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="reveal-item">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      disabled={!token}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-sm text-slate-800 outline-none premium-input"
                    />
                    <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="reveal-item pt-2">
                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full h-11 rounded-lg btn-premium-gradient font-bold text-sm shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
