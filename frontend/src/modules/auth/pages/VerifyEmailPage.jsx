import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { AuthSidebar } from '../components/AuthSidebar';
import { Logo } from '../../../components/ui/Logo';
import gsap from 'gsap';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from('.reveal-item', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
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
    <main ref={containerRef} className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[#f8fafc] text-[#0f172a] overflow-hidden">
      {/* Left educational sidebar */}
      <AuthSidebar subtitle="Completing safety verification. We trace confirmation hashes to guarantee authentic candidate profiles across compiler pools." />

      {/* Right form center */}
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative">
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

          {status === 'verifying' && (
            <div className="space-y-6 text-center reveal-item">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 animate-spin">
                  <Loader2 className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Verifying Email...</h2>
                <p className="text-sm text-slate-500 font-medium">
                  We are validating your signature against database registers. One moment...
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 text-center reveal-item">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-pulse">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Email Verified!</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {message || 'Your credential record has been verified. You can now login.'}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full h-11 rounded-lg btn-premium-gradient font-bold text-sm shadow-md shadow-blue-600/10 flex items-center justify-center gap-2"
                >
                  Sign In to SurCodex
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6 text-center reveal-item">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 animate-bounce">
                  <XCircle className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Verification Failed</h2>
                <p className="text-sm text-rose-600 font-semibold leading-relaxed">{message}</p>
              </div>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="w-full h-11 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 font-bold text-sm text-slate-600 flex items-center justify-center gap-2 transition"
                >
                  Back to Registration
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
