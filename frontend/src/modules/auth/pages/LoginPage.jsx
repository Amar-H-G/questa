import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/forms/TextField';
import { useAuthStore } from '../../../store/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300 text-slate-950">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-400">Sign in to the assessment command center.</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div className="flex justify-end">
            <Link className="text-xs text-cyan-200 hover:underline" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-400">
          New to SurCodex? <Link className="text-cyan-200" to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};
