import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../../components/ui/Logo';
import { KeyRound, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient, getErrorMessage } from '../../../services/api/client';
import gsap from 'gsap';

export const ResetPassPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

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
            <h2 className="text-2xl font-bold tracking-tight">Password Reset!</h2>
            <p className="text-sm text-slate-500 font-medium">
              Your password has been reset successfully. You can now log in using your new password.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 transition text-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Set new password</h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                Choose a strong password containing at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    disabled={!token}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-600 transition"
                  />
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    disabled={!token}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-600 transition"
                  />
                  <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 disabled:opacity-50 transition text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
