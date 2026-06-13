import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import gsap from 'gsap';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please request a new verification link.');
        return;
      }
      try {
        const { data } = await apiClient.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage(data.data.message || 'Your email has been verified successfully.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.15),transparent_45%)]" />
      <div
        ref={cardRef}
        className="glass-panel w-full max-w-md rounded-2xl p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-400 text-sm font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            S
          </div>
        </div>

        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-cyan-300 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Verifying your email</h2>
            <p className="text-sm text-slate-400">Please wait while we confirm your verification token...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-14 w-14 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Account Verified!</h2>
            <p className="text-sm text-slate-300">{message}</p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200 transition"
              >
                Sign In to SurCodex
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-14 w-14 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Verification Failed</h2>
            <p className="text-sm text-rose-200">{message}</p>
            <div className="pt-4 space-y-2">
              <Link
                to="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/15 transition"
              >
                Back to Registration
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
