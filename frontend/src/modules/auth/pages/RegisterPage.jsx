import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/forms/TextField';
import { useAuthStore } from '../../../store/authStore';
import { getErrorMessage } from '../../../services/api/client';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      msg.split('\n').forEach((errorMsg) => {
        toast.error(errorMsg);
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafc] px-4 text-[#0f172a]">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/80">
        <h1 className="text-2xl font-bold tracking-tight">Create your SurCodex account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <p className="-mt-2 text-xs text-slate-500 font-medium">
            Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
          </p>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Role</span>
            <select
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-600"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500 font-medium">
          Already registered? <Link className="text-blue-600 hover:underline font-bold" to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};
