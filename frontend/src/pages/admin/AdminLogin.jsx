import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { FiLock, FiUser, FiEye, FiEyeOff, FiArrowLeft, FiShield } from 'react-icons/fi';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(credentials);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid administrator credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      {/* CONTINUOUSLY ROTATING BACKGROUND LOGOS */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-16 left-12 w-32 h-32 opacity-20 pointer-events-none hidden md:block"
      >
        <img
          src="/assets/aps-logo.svg"
          alt="APS Crest"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/school-logo-transparent.png';
          }}
        />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-16 right-12 w-44 h-44 opacity-15 pointer-events-none hidden md:block"
      >
        <img
          src="/assets/aps-logo.svg"
          alt="APS Crest"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/school-logo-transparent.png';
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-accent/40 pointer-events-none"
          style={{
            top: `${(i * 19) % 100}%`,
            left: `${(i * 23) % 100}%`
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10"
      >
        {/* CENTER ROTATING LOGO */}
        <div className="relative mb-4 flex justify-center">
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24"
          >
            <img
              src="/assets/aps-logo.svg"
              alt="APS Crest"
              className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.7)]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/school-logo-transparent.png';
              }}
            />
          </motion.div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-accent mb-1">
            <FiShield /> Authorized Access Only
          </div>
          <h2 className="text-3xl font-heading font-bold text-white">
            Admin Portal
          </h2>
          <p className="text-sm text-gold/90 font-serif mt-1">
            Army Public School Khadakwasla
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg" />
            <motion.input
              whileFocus={{
                scale: 1.01,
                boxShadow: '0 0 25px rgba(212,175,55,0.4)',
                borderColor: '#D4AF37'
              }}
              type="text"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none text-sm font-medium transition-all"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg" />
            <motion.input
              whileFocus={{
                scale: 1.01,
                boxShadow: '0 0 25px rgba(212,175,55,0.4)',
                borderColor: '#D4AF37'
              }}
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full pl-12 pr-12 py-3.5 bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none text-sm font-medium transition-all"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Login Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,153,51,0.5)' }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#D4AF37] text-primary font-bold text-base rounded-xl transition-all shadow-xl disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              'Authenticate & Sign In'
            )}
          </motion.button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-3 rounded-xl bg-black/30 border border-white/10 text-center">
          <p className="text-xs text-white/70">
            Use the administrator account configured by your deployment.
          </p>
        </div>

        {/* Return to website */}
        <div className="mt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors uppercase tracking-wider"
          >
            <FiArrowLeft /> Back to Public Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
