import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../../components/ui/Logo';
import { Mail, CheckCircle2, ArrowLeft, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient, getErrorMessage } from '../../../services/api/client';
import { AuthSidebar } from '../components/AuthSidebar';
import gsap from 'gsap';

export const ForgotPassPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/auth/password-reset', { email });
      toast.success('Password reset link sent successfully!');
      setSuccess(true);
    } catch (err) {
      const msg = getErrorMessage(err);
      const firstMsg = msg.split('\n')[0];
      toast.error(firstMsg || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main ref={containerRef} className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[#f8fafc] text-[#0f172a] overflow-hidden">
      {/* Left educational sidebar */}
      <AuthSidebar subtitle="Need access restoration? Fill in your profile email below to receive a secure login key token." />

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
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Email Sent!</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  If an account exists for <strong>{email}</strong>, you will receive a reset link shortly.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full h-11 rounded-lg btn-premium-gradient font-bold text-sm shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                  Back to Sign In
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2 reveal-item">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Reset password</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Enter your email address and we'll dispatch a secure recovery token to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="reveal-item">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-sm text-slate-800 outline-none premium-input"
                    />
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="reveal-item pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-lg btn-premium-gradient font-bold text-sm shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="reveal-item text-center pt-4 border-t border-slate-100">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
