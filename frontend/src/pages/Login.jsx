import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Loader2, KeyRound, Mail } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      {/* Decorative floating blurred gradient shapes */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/20">
            <Wallet size={28} />
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white">Welcome Back</h2>
          <p className="mt-1.5 text-sm font-medium text-slate-400">Log in to track your expenses dynamically</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-center text-sm font-semibold text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-800 rounded-xl outline-none bg-slate-950 text-white focus:border-brand-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                <KeyRound size={16} />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-800 rounded-xl outline-none bg-slate-950 text-white focus:border-brand-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Submission Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/10 hover:bg-brand-500 disabled:bg-brand-800 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm font-medium text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-400 hover:text-brand-300">
            Create free account
          </Link>
        </p>

        {/* Demo Credentials Alert */}
        <div className="mt-6 rounded-xl bg-slate-850 p-4 border border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-1">Demo Access Credentials</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            You can type any email (e.g. <span className="font-mono text-slate-200">demo@demo.com</span>) and a 6-character password to explore the app instantly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
