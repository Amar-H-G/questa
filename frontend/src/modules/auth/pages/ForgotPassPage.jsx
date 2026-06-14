import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../../components/ui/Logo';
import { Mail, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient, getErrorMessage } from '../../../services/api/client';
import gsap from 'gsap';

export const ForgotPassPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
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
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 text-[#0f172a]">
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/80"
      >
        <div className="flex justify-center mb-6">
          <Logo size={48} />
        </div>

        {success ? (
          <div className="space-y-4 text-center animate-fade-in">
            <div className="flex justify-center">
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Email Sent!</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              If an account is associated with <strong>{email}</strong>, you will receive an email containing a link to reset your password.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 transition text-sm"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                Enter your email address and we'll send you a password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
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
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-600 transition"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 disabled:opacity-50 transition text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0f172a] transition"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
