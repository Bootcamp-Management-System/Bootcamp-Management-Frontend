import React, { useState } from 'react';
import csecLogo from '../../assets/csec-logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { 
  BadgeCheck, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  User, 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { z } from 'zod';

// Define the schema using Zod
const signupSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SignupPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bootcampId] = useState(() => new URLSearchParams(window.location.search).get('bootcampId'));
  const navigate = useNavigate();
  const { signup, isAuthenticated, user } = useAuth();
  const { theme } = useTheme();

  const getHomePath = (role) => (
    role === 'super_admin' ? '/super-admin/dashboard' : role === 'admin' ? '/admin' : role === 'instructor' ? '/instructor' : '/dashboard'
  );

  const dashboardPath = isAuthenticated && user ? getHomePath(user.role) : '/';

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const result = signupSchema.safeParse(values);
      const errors = {};
      
      if (!result.success && result.error && result.error.errors) {
        result.error.errors.forEach((err) => {
          if (err.path && err.path[0]) {
            errors[err.path[0]] = err.message;
          }
        });
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      setSuccess('');
      try {
        await signup({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          role: 'student'
        });
        setSuccess('Account created successfully! Redirecting to verification...');
        setTimeout(() => navigate('/otp', { 
          state: { 
            email: values.email.trim().toLowerCase(), 
            purpose: 'register',
            bootcampId: bootcampId
          } 
        }), 2000);
      } catch (err) {
        setError(err.message || 'Unable to create account.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-portal-accent/50 focus:bg-white/10 transition-all placeholder:text-portal-text-muted/40";
  const passwordInputClass = "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-portal-accent/50 focus:bg-white/10 transition-all placeholder:text-portal-text-muted/40";
  const labelClass = "block text-[10px] font-bold text-portal-accent uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="min-h-screen bg-portal-bg flex font-sans relative overflow-hidden transition-colors duration-500">
      <Link
        to={dashboardPath}
        className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-portal-border/70 bg-portal-card/80 px-4 py-2 text-sm font-medium text-portal-text shadow-sm transition-colors hover:border-portal-accent/50 hover:bg-portal-card hover:text-white sm:left-8 sm:top-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-portal-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Left Column: Visual Branding */}
      <div className="hidden lg:flex w-2/5 relative items-center justify-center p-12 border-r border-white/5">
        <div className="max-w-sm space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-portal-accent/20 ring-2 ring-portal-accent/20"
          >
            <img src={csecLogo} alt="CSEC ASTU" className="w-full h-full object-cover" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">Join the <br /> <span className="text-portal-accent">Next Gen</span>.</h1>
            <p className="text-portal-text-muted text-lg leading-relaxed">Create your specialized profile in seconds and start applying for the top bootcamps at ASTU.</p>
          </div>
          <div className="space-y-4 pt-8">
            {['Global Developer Network', 'Accelerated Learning', 'Secure Certification'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/60 font-medium">
                <CheckCircle2 className="w-5 h-5 text-portal-accent" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-6 md:p-12 lg:p-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
              <Sparkles className="w-5 h-5 text-portal-accent animate-pulse" />
              <span className="text-[10px] font-bold text-portal-accent uppercase tracking-[0.3em]">Quick Onboarding</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-portal-text-muted">Fill in your basic details to get started.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={labelClass}>Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
                <input
                  name="name"
                  type="text"
                  {...formik.getFieldProps('name')}
                  placeholder="John Doe"
                  className={inputClass}
                />
                {formik.touched.name && formik.errors.name && <p className="text-[10px] text-red-400 mt-1 ml-1">{formik.errors.name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
                <input
                  name="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  placeholder="name@example.com"
                  className={inputClass}
                />
                {formik.touched.email && formik.errors.email && <p className="text-[10px] text-red-400 mt-1 ml-1">{formik.errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    {...formik.getFieldProps('password')}
                    placeholder="••••••••"
                    className={passwordInputClass}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-portal-text-muted transition-colors hover:text-portal-accent focus:outline-none focus:ring-2 focus:ring-portal-accent/40"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && <p className="text-[10px] text-red-400 mt-1 ml-1">{formik.errors.password}</p>}
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Confirm</label>
                <div className="relative group">
                  <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...formik.getFieldProps('confirmPassword')}
                    placeholder="••••••••"
                    className={passwordInputClass}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                    title={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-portal-text-muted transition-colors hover:text-portal-accent focus:outline-none focus:ring-2 focus:ring-portal-accent/40"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-[10px] text-red-400 mt-1 ml-1">{formik.errors.confirmPassword}</p>}
              </div>
            </div>

            {error && <p className="text-red-400 text-xs font-medium text-center bg-red-400/10 py-3 rounded-xl border border-red-400/20">{error}</p>}
            {success && <p className="text-green-400 text-xs font-medium text-center bg-green-400/10 py-3 rounded-xl border border-green-400/20">{success}</p>}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-portal-accent text-portal-bg py-4 rounded-2xl font-bold text-sm shadow-xl shadow-portal-accent/10 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              {formik.isSubmitting ? 'Creating Profile...' : 'Complete Signup'}
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-portal-text-muted">
                Already have an account? {' '}
                <Link to="/login" className="text-portal-accent font-bold hover:underline underline-offset-4">
                  Log in here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
      {/* Theme Toggle Button */}
      <div className="absolute bottom-8 right-8">
        <ThemeSwitcher />
      </div>
    </div>
  );
};
