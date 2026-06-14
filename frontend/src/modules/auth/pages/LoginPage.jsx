import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/forms/TextField';
import { useAuthStore } from '../../../store/authStore';
import { getErrorMessage } from '../../../services/api/client';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

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
    <main className="grid min-h-screen place-items-center bg-[#f8fafc] px-4 text-[#0f172a]">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/80">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500 font-medium">Sign in to the assessment command center.</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div className="flex justify-end">
            <Link className="text-xs text-blue-600 hover:underline font-semibold" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500 font-medium">
          New to SurCodex? <Link className="text-blue-600 hover:underline font-bold" to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};
