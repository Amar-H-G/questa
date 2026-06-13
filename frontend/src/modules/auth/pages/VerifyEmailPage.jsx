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
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 text-[#0f172a]">
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-100/80"
      >
        <div className="flex justify-center mb-6">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
            S
          </div>
        </div>

        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Verifying your email</h2>
            <p className="text-sm text-slate-500 font-medium">Please wait while we confirm your verification token...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Account Verified!</h2>
            <p className="text-sm text-slate-500 font-medium">{message}</p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 transition text-sm"
              >
                Sign In to SurCodex
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-14 w-14 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Verification Failed</h2>
            <p className="text-sm text-rose-600 font-medium">{message}</p>
            <div className="pt-4 space-y-2">
              <Link
                to="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
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
