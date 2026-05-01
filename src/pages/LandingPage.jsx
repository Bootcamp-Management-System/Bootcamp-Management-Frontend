import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { bootcampService } from '../services/bootcampService';
import { useAuth } from '../context/AuthContext';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import csecLogo from '../assets/csec-logo.jpg';
import {
  ArrowRight,
  Code2,
  Globe,
  Users,
  Star,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Zap,
  ChevronRight,
  Send,
  BarChart3,
  MessageSquare
} from 'lucide-react';

const getHomePath = (role) => {
  const normalizedRole =
    role === 'super-admin' || role === 'super admin'
      ? 'super_admin'
      : role === 'student'
        ? 'member'
        : role;

  if (normalizedRole === 'super_admin') return '/super-admin/dashboard';
  if (normalizedRole === 'admin') return '/admin';
  if (normalizedRole === 'instructor') return '/instructor';
  return '/dashboard';
};

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-portal-bg">
    {/* Liquid Aurora Base */}
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] opacity-40"
    >
      <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-portal-accent/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px]" />
    </motion.div>

    {/* Floating Glass Shards (Parallax) */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -40, 0],
          rotate: [0, 15, 0],
          x: [0, 20, 0]
        }}
        transition={{
          duration: Math.random() * 10 + 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 2
        }}
        className="absolute bg-white/[0.03] border border-white/10 backdrop-blur-[2px] rounded-2xl shadow-2xl"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 150 + 50}px`,
          height: `${Math.random() * 150 + 50}px`,
        }}
      />
    ))}

    {/* Moving Scanline */}
    <motion.div
      animate={{ top: ['-10%', '110%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-portal-accent/30 to-transparent z-10"
    />

    <div 
      className="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
    <div className="absolute inset-0 bg-radial-gradient from-transparent to-portal-bg/90" style={{ background: 'radial-gradient(circle at center, transparent 0%, var(--portal-bg) 100%)' }} />
  </div>
);

export const LandingPage = () => {
  const { t } = useTranslation();
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const data = await bootcampService.getPublicBootcamps();
        setBootcamps(data.data || []);
      } catch (error) {
        console.error('Failed to fetch public bootcamps:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  const displayedBootcamps = showAll ? bootcamps : bootcamps.slice(0, 3);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-portal-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-portal-accent"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return (
    <div className="min-h-screen bg-portal-bg text-portal-text overflow-x-hidden selection:bg-portal-accent selection:text-white">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-portal-bg/80 backdrop-blur-xl border-b border-portal-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-portal-accent/20 overflow-hidden ring-1 ring-white/10"
            >
              <img src={csecLogo} alt="Logo" className="w-full h-full object-cover" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight">CSEC ASTU</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Link
              to="/login"
              className="text-sm font-bold text-portal-text-muted hover:text-portal-accent transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link to="/signup" className="px-6 py-2.5 bg-portal-accent text-portal-bg rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-portal-accent/20">
              {t('nav.join')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-portal-accent/10 border border-portal-accent/20 rounded-full text-portal-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <Zap className="w-4 h-4 fill-portal-accent" />
            {t('hero.badge')}
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase italic">
            {t('hero.title_part1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-portal-accent via-blue-400 to-indigo-500">
              {t('hero.title_part2')}
            </span> <br />
            {t('hero.title_accent')}
          </h1>

          <p className="text-lg md:text-xl text-portal-text-muted mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.a
              href="#bootcamps"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto px-10 py-5 bg-portal-accent text-portal-bg rounded-2xl font-black text-lg shadow-2xl shadow-portal-accent/30 flex items-center justify-center gap-3"
            >
              {t('hero.cta_explore')}
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
              <Link to="/signup" className="w-full md:w-auto px-10 py-5 bg-white/5 border border-portal-border rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center">
                {t('hero.cta_signup')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-portal-border/50 bg-white/[0.01] relative z-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: t('stats.students'), value: '500+', icon: Users },
            { label: t('stats.graduates'), value: '1.2k+', icon: CheckCircle2 },
            { label: t('stats.partners'), value: '15+', icon: Globe },
            { label: t('stats.rating'), value: '4.9/5', icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-12 h-12 bg-portal-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-portal-accent/10 transition-all duration-500">
                <stat.icon className="w-6 h-6 text-portal-accent transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="text-4xl md:text-5xl font-black mb-2 tracking-tighter italic">{stat.value}</div>
              <div className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Available Bootcamps Grid */}
      <section id="bootcamps" className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic"
            >
              {t('bootcamps.title')}
            </motion.h2>
            <p className="text-portal-text-muted text-xl max-w-2xl mx-auto font-medium">{t('bootcamps.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-[450px] bg-portal-card border border-portal-border rounded-[40px] animate-pulse" />
              ))
            ) : bootcamps.length > 0 ? (
              displayedBootcamps.map((bootcamp, i) => {
                const Icon = bootcamp.name.toLowerCase().includes('cyber') ? ShieldCheck :
                  bootcamp.name.toLowerCase().includes('web') ? Globe :
                    bootcamp.name.toLowerCase().includes('ai') ? Zap : Code2;

                return (
                  <motion.div
                    key={bootcamp._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    whileHover={{ y: -20, scale: 1.02 }}
                    className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl transition-all duration-500 overflow-hidden hover:border-portal-accent/50"
                  >
                    {/* Glass Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Neon Floating Icon Container */}
                    <div className="relative w-20 h-20 mb-10 group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-portal-accent/30 rounded-2xl blur-xl group-hover:blur-3xl transition-all duration-500" />
                      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-portal-accent group-hover:-rotate-12 transition-all duration-500 shadow-xl">
                        <Icon className="w-10 h-10 text-portal-accent group-hover:text-portal-bg transition-colors duration-500" />
                      </div>
                    </div>

                    <h3 className="text-3xl font-black mb-4 group-hover:text-portal-accent transition-colors duration-300 tracking-tight">{bootcamp.name}</h3>
                    <div className="space-y-8 relative z-10">
                      <p className="text-portal-text-muted text-lg leading-relaxed transition-all duration-500 group-hover:text-portal-text font-medium">
                        {bootcamp.description || 'Master industry-standard practices and launch your professional career in technology.'}
                      </p>

                      <div className="pt-8 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-all duration-500">
                        <Link
                          to={`/apply/${bootcamp._id}`}
                          className="w-full py-5 bg-portal-accent text-portal-bg rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-portal-accent/40 active:scale-[0.98] transition-all group/btn"
                        >
                          <span>{t('bootcamps.enroll_now')}</span>
                          <ArrowRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-2" />
                        </Link>
                      </div>
                    </div>

                    {/* Corner Glow */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-portal-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-32 text-center bg-portal-card border border-portal-border rounded-[40px] border-dashed">
                <CheckCircle2 className="w-12 h-12 text-portal-text-muted mx-auto mb-6 opacity-20" />
                <h3 className="text-2xl font-bold">{t('bootcamps.no_bootcamps')}</h3>
              </div>
            )}
          </div>

          {bootcamps.length > 3 && (
            <div className="mt-24 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="group flex items-center gap-4 text-portal-accent font-black text-xs uppercase tracking-[0.4em] hover:gap-8 transition-all"
              >
                {showAll ? t('bootcamps.show_less') : t('bootcamps.view_all')}
                <ArrowRight className={`w-6 h-6 transition-transform duration-500 ${showAll ? '-rotate-90' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why CSEC ASTU Section */}
      <section className="py-48 px-6 relative z-10 bg-white/[0.01] border-y border-portal-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
                {t('why.title')} <br />
                <span className="text-portal-accent">{t('why.accent')}</span> <br />
                {t('why.subtitle')}
              </h2>
              <div className="w-24 h-2 bg-portal-accent rounded-full mb-8 shadow-lg shadow-portal-accent/40" />
              <p className="text-portal-text-muted text-xl leading-relaxed font-medium">
                {t('why.desc')}
              </p>
            </motion.div>
          </div>

          <div className="lg:w-2/3 space-y-16">
            {[
              { title: t('why.dev_title'), desc: t('why.dev_desc'), icon: Rocket, tag: 'Build' },
              { title: t('why.cpd_title'), desc: t('why.cpd_desc'), icon: Code2, tag: 'Solve' },
              { title: t('why.cyber_title'), desc: t('why.cyber_desc'), icon: ShieldCheck, tag: 'Defend' },
              { title: t('why.data_title'), desc: t('why.data_desc'), icon: BarChart3, tag: 'Analyze' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col md:flex-row gap-10 items-start pb-16 border-b border-portal-border last:border-0"
              >
                <div className="w-20 h-20 shrink-0 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center group-hover:bg-portal-accent group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl group-hover:shadow-portal-accent/20">
                  <feature.icon className="w-10 h-10 text-portal-accent group-hover:text-portal-bg transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter">{feature.title}</h3>
                    <span className="px-4 py-1.5 bg-portal-accent/10 text-portal-accent text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-portal-accent/20">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-portal-text-muted text-xl leading-relaxed font-medium transition-colors group-hover:text-portal-text">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-portal-border text-center space-y-12 relative z-10 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-6">
            <a href="https://forms.gle/WzxkpHAF3iKy9eCT9" target="_blank" rel="noopener noreferrer" title="Feedback">
              <motion.div whileHover={{ y: -5, scale: 1.1 }} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-portal-accent/50 transition-all shadow-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-portal-accent" />
              </motion.div>
            </a>
            <a href="https://ift.tt/2PEWePp" target="_blank" rel="noopener noreferrer" title="Facebook">
              <motion.div whileHover={{ y: -5, scale: 1.1 }} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all shadow-xl flex items-center justify-center">
                <svg className="w-6 h-6 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.div>
            </a>
            <a href="https://www.linkedin.com/company/csec-astu" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <motion.div whileHover={{ y: -5, scale: 1.1 }} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-600/50 transition-all shadow-xl flex items-center justify-center">
                <svg className="w-6 h-6 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </motion.div>
            </a>
            <a href="https://t.me/CSEC_ASTU" target="_blank" rel="noopener noreferrer" title="Telegram">
              <motion.div whileHover={{ y: -5, scale: 1.1 }} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all shadow-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-[#0088cc]" />
              </motion.div>
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-portal-text-muted text-xs font-medium tracking-widest uppercase opacity-80">
            © 2026 CSEC ASTU • INTELLIGENCE REIMAGINED
          </p>
          <div className="w-12 h-1 bg-portal-accent/20 mx-auto rounded-full" />
        </div>
      </footer>
    </div>
  );
};
