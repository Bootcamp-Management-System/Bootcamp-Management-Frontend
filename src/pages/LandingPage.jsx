import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shield,
  MessageSquare
} from 'lucide-react';
import { bootcampService } from '../services/bootcampService';

export const LandingPage = () => {
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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

  return (
    <div className="min-h-screen bg-portal-bg text-portal-text overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-portal-bg/80 backdrop-blur-xl border-b border-portal-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-portal-accent rounded-xl flex items-center justify-center shadow-lg shadow-portal-accent/20">
              <Rocket className="w-6 h-6 text-portal-bg" />
            </div>
            <span className="text-xl font-bold tracking-tight">CSEC ASTU</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-portal-text-muted hover:text-portal-accent transition-colors">Login</Link>
            <Link to="/signup" className="px-6 py-2.5 bg-portal-accent text-portal-bg rounded-xl font-bold text-sm hover:scale-105 transition-all">Join Academy</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 relative">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-portal-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-portal-accent/10 border border-portal-accent/20 rounded-full text-portal-accent text-xs font-bold uppercase tracking-widest mb-8">
            <Zap className="w-4 h-4" />
            Now Recruiting for 2026
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
            Build the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-accent to-blue-400">Technology</span>
          </h1>
          <p className="text-xl text-portal-text-muted mb-12 leading-relaxed max-w-2xl mx-auto">
            Join the most elite technology community in ASTU. Master industry-standard stacks, 
            contribute to real-world projects, and launch your career.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a href="#bootcamps" className="w-full md:w-auto px-10 py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold text-lg shadow-xl shadow-portal-accent/20 hover:scale-105 transition-all">
              Explore Bootcamps
            </a>
            <Link to="/signup" className="w-full md:w-auto px-10 py-4 bg-white/5 border border-portal-border rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              Create Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-portal-border bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Active Students', value: '500+', icon: Users },
            { label: 'Graduates', value: '1.2k+', icon: CheckCircle2 },
            { label: 'Global Partners', value: '15+', icon: Globe },
            { label: 'Average Rating', value: '4.9/5', icon: Star },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-portal-accent mx-auto mb-4 opacity-40" />
              <div className="text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-portal-text-muted uppercase tracking-[0.3em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Available Bootcamps Grid */}
      <section id="bootcamps" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-portal-text">Available Bootcamps</h2>
            <p className="text-portal-text-muted text-xl max-w-2xl mx-auto">Select your path and start your elite training journey today.</p>
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
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -12 }}
                    className="group relative bg-portal-card border border-portal-border rounded-[40px] p-10 shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-portal-accent group-hover:scale-110 transition-all duration-500">
                      <Icon className="w-8 h-8 text-portal-accent group-hover:text-portal-bg transition-colors duration-500" />
                    </div>
                    <h3 className="text-3xl font-bold mb-6 group-hover:text-portal-accent transition-colors">{bootcamp.name}</h3>
                    <div className="space-y-6">
                      <p className="text-portal-text-muted leading-relaxed transition-all duration-500 group-hover:text-portal-text">
                        {bootcamp.description || 'Master industry-standard practices and launch your professional career in technology.'}
                      </p>
                      <div className="pt-8 border-t border-portal-border/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <Link 
                          to="/login"
                          className="w-full py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          Enroll Now
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-portal-accent/5 rounded-full blur-[60px] group-hover:bg-portal-accent/10 transition-all" />
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-32 text-center bg-portal-card border border-portal-border rounded-[40px] border-dashed">
                <CheckCircle2 className="w-12 h-12 text-portal-text-muted mx-auto mb-6 opacity-20" />
                <h3 className="text-2xl font-bold">No active bootcamps found.</h3>
              </div>
            )}
          </div>

          {bootcamps.length > 3 && (
            <div className="mt-24 flex justify-center">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="group flex items-center gap-3 text-portal-accent font-bold text-sm uppercase tracking-[0.3em] hover:gap-6 transition-all"
              >
                {showAll ? 'Show Less' : 'View All Programs'}
                <ArrowRight className={`w-6 h-6 transition-transform duration-500 ${showAll ? '-rotate-90' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why CSEC ASTU Section */}
      <section className="py-48 px-6 relative bg-white/[0.01] border-y border-portal-border/50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8">
                Why CSEC <br />
                <span className="text-portal-accent">ASTU</span> Intelligence?
              </h2>
              <div className="w-20 h-1.5 bg-portal-accent rounded-full" />
              <p className="mt-8 text-portal-text-muted text-lg leading-relaxed">
                We don't just teach code; we build the next generation of technology leaders through specialized focus areas.
              </p>
            </motion.div>
          </div>

          <div className="lg:w-2/3 space-y-16">
            {[
              { title: 'Cybersecurity', desc: 'Expert advice on network security, ethical hacking, and digital forensics. Learn to protect and defend in the digital age.', icon: ShieldCheck, tag: 'Defend' },
              { title: 'Development & AI', desc: 'Guidance on software engineering, data science, and AI lab activities. Build intelligent systems that change the world.', icon: Zap, tag: 'Build' },
              { title: 'Competetative Programming', desc: 'Resources for competitive programming and algorithm optimization. Sharpen your logic and solve complex problems.', icon: Code2, tag: 'Solve' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col md:flex-row gap-8 items-start pb-16 border-b border-portal-border last:border-0"
              >
                <div className="w-16 h-16 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-portal-accent transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-portal-accent group-hover:text-portal-bg transition-colors" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-3xl font-bold">{feature.title}</h3>
                    <span className="px-3 py-1 bg-portal-accent/10 text-portal-accent text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-portal-text-muted text-xl leading-relaxed max-w-2xl">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-portal-border text-center space-y-8">
        <div className="flex justify-center gap-8">
          <Code2 className="w-6 h-6 text-portal-text-muted hover:text-portal-accent cursor-pointer transition-all hover:scale-110" title="GitHub" />
          <Globe className="w-6 h-6 text-portal-text-muted hover:text-portal-accent cursor-pointer transition-all hover:scale-110" title="Twitter" />
          <Users className="w-6 h-6 text-portal-text-muted hover:text-portal-accent cursor-pointer transition-all hover:scale-110" title="LinkedIn" />
          <Send className="w-6 h-6 text-portal-text-muted hover:text-portal-accent cursor-pointer transition-all hover:scale-110" title="Telegram" />
        </div>
        <p className="text-portal-text-muted text-sm tracking-widest uppercase">© 2026 CSEC ASTU • All Rights Reserved</p>
      </footer>
    </div>
  );
};
