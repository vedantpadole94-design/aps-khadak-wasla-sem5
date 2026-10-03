import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

const roles = [
  {
    id: 'student',
    label: 'Student',
    description: 'Access your learning portal',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    description: 'Manage your academic workspace',
  },
];

const Login = () => {
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedRole = roles.find((item) => item.id === role);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-bg-light flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-primary/10 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-accent/30" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/10" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-accent">
              <FiArrowLeft /> Back to website
            </Link>
            <div className="mt-16 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-white text-xl font-bold text-primary">
              APS
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Army Public School</p>
            <h1 className="mt-4 max-w-sm font-heading text-5xl leading-tight text-white">
              Learn. Lead. Serve.
            </h1>
            <p className="mt-6 max-w-sm leading-relaxed text-white/70">
              A secure space for the APS Khadakwasla community to stay connected and make a difference.
            </p>
          </div>

          <div className="relative flex items-center gap-3 text-sm text-white/60">
            <FiShield className="text-accent" />
            Secure access for students and faculty
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent">
              <FiArrowLeft /> Back
            </Link>
            <span className="font-heading font-bold text-primary">APS Khadakwasla</span>
          </div>

          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Welcome back</p>
            <h2 className="mt-3 font-heading text-4xl text-primary">Sign in to your portal</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-dark/60">
              Choose your account type and enter your school credentials.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl bg-bg-light p-1.5" role="tablist" aria-label="Account type">
              {roles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={role === item.id}
                  onClick={() => {
                    setRole(item.id);
                    setIsSubmitted(false);
                  }}
                  className={`rounded-xl px-3 py-3 text-left transition-all ${
                    role === item.id ? 'bg-primary text-white shadow-lg' : 'text-primary hover:bg-white'
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className={`mt-1 block text-xs ${role === item.id ? 'text-white/60' : 'text-text-dark/50'}`}>
                    {item.description}
                  </span>
                </button>
              ))}
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-primary">
                  School email
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={role === 'student' ? 'name@apskhadakwasla.in' : 'faculty@apskhadakwasla.in'}
                    className="w-full rounded-xl border border-primary/10 bg-bg-light py-3.5 pl-11 pr-4 text-sm text-primary outline-none transition placeholder:text-primary/35 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-primary">Password</label>
                  <button type="button" className="text-xs font-semibold text-secondary hover:text-accent">Forgot password?</button>
                </div>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-primary/10 bg-bg-light py-3.5 pl-11 pr-12 text-sm text-primary outline-none transition placeholder:text-primary/35 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 transition hover:text-accent"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-text-dark/60">
                <input type="checkbox" className="h-4 w-4 accent-accent" />
                Keep me signed in
              </label>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary"
              >
                Sign in as {selectedRole.label}
              </motion.button>

              {isSubmitted && (
                <p className="rounded-xl bg-secondary/10 px-4 py-3 text-center text-sm text-secondary" role="status">
                  Login form ready for {selectedRole.label.toLowerCase()} authentication.
                </p>
              )}
            </form>

            <p className="mt-8 text-center text-xs leading-relaxed text-text-dark/50">
              Need help accessing your account? Contact the school administration office.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
