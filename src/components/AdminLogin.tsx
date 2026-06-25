import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, LogIn, Chrome, AlertCircle } from 'lucide-react';
import { signInWithPopup, User } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLoginSuccess(result.user);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for sign-in. Contact admin.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-brand-primary/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] bg-cyan-600/6 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative"
      >
        {/* Glassmorphism Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* Top gradient accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />

          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <motion.a
              href="/"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary inline-block mb-6"
            >
              Boomzy
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-2"
            >
              <Shield className="w-5 h-5 text-brand-primary" />
              <h1 className="text-2xl font-black font-display text-white">Admin Portal</h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-sm"
            >
              Sign in with your authorized Google account
            </motion.p>
          </div>

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <span className="text-rose-400 text-xs font-semibold">{error}</span>
            </motion.div>
          )}

          {/* Google Sign-In Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-13 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                <span>Sign in with Google</span>
              </>
            )}
          </motion.button>

          {/* Development Bypass Button */}
          {import.meta.env.DEV && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              onClick={() => {
                const mockUser: User = {
                  uid: 'mock-admin-uid',
                  email: 'admin@boomzy.agency',
                  displayName: 'Mock Administrator',
                  emailVerified: true,
                  photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  getIdToken: async () => 'mock-admin-token',
                } as any;
                onLoginSuccess(mockUser);
              }}
              className="w-full h-11 mt-3 rounded-xl border border-slate-700/60 hover:border-slate-500 bg-slate-800/40 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Bypass Auth (Development Mock)</span>
            </motion.button>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secured Access</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Info text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-[11px] text-slate-500 leading-relaxed"
          >
            Only authorized team members can access the admin dashboard. 
            Contact your administrator if you need access.
          </motion.p>
        </div>

        {/* Back to site link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <a
            href="/"
            className="text-slate-500 hover:text-brand-primary text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 rotate-180" />
            <span>Back to Boomzy.agency</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
