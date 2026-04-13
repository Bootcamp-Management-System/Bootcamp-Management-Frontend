import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      navigate(role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      if (email.includes('first')) {
        navigate('/otp');
      } else {
        const role = email.includes('admin') ? 'admin' : email.includes('instructor') ? 'instructor' : 'member';
        navigate(role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-sage-200"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sage-500/20">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-sage-900">Welcome Back</h1>
          <p className="text-sage-500 mt-2">Sign in to your BMS account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sage-500 uppercase mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-sage-50 border border-sage-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-sage-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-xs font-bold text-sage-500 uppercase">Password</label>
              <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-sage-600 hover:text-sage-800 uppercase tracking-tighter">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-sage-50 border border-sage-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-sage-500 transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-sage-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-sage-500/20 hover:bg-sage-600 transition-all active:scale-[0.98] mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 bg-sage-50 rounded-2xl p-4 border border-sage-100">
          <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-3 text-center">Quick Access (Demo Roles)</p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => { setEmail('admin@bms.com'); setPassword('password'); }}
              className="py-2 px-1 bg-white border border-sage-200 rounded-lg text-[10px] font-bold text-sage-600 hover:bg-sage-500 hover:text-white hover:border-sage-500 transition-all"
            >
              Admin
            </button>
            <button 
              onClick={() => { setEmail('instructor@bms.com'); setPassword('password'); }}
              className="py-2 px-1 bg-white border border-sage-200 rounded-lg text-[10px] font-bold text-sage-600 hover:bg-sage-500 hover:text-white hover:border-sage-500 transition-all"
            >
              Instructor
            </button>
            <button 
              onClick={() => { setEmail('member@bms.com'); setPassword('password'); }}
              className="py-2 px-1 bg-white border border-sage-200 rounded-lg text-[10px] font-bold text-sage-600 hover:bg-sage-500 hover:text-white hover:border-sage-500 transition-all"
            >
              Member
            </button>
          </div>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sage-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-sage-400 font-medium">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => googleLogin()}
            className="flex items-center justify-center gap-2 py-3 border border-sage-200 rounded-xl text-sm font-medium hover:bg-sage-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 border border-sage-200 rounded-xl text-sm font-medium hover:bg-sage-50 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.583 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.042.137 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.814 1.102.814 2.222 0 1.606-.015 2.9-.015 3.293 0 .322.216.698.825.58C20.565 21.795 24 17.297 24 12 24 5.37 18.63 0 12 0z" />
            </svg>
            GitHub
          </button>
        </div>
      </motion.div>
    </div>
  );
};
