import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';
import { bootcampService } from '../services/bootcampService';

export const LandingPage = () => {
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <section className="pt-40 pb-20 px-6 relative">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-portal-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-portal-accent/10 border border-portal-accent/20 rounded-full text-portal-accent text-xs font-bold uppercase tracking-widest mb-8">
            <Zap className="w-4 h-4" />
            Now Recruiting for 2026
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 tracking-tight">
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
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-portal-border bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Students', value: '500+', icon: Users },
            { label: 'Graduates', value: '1.2k+', icon: CheckCircle2 },
            { label: 'Global Partners', value: '15+', icon: Globe },
            { label: 'Average Rating', value: '4.9/5', icon: Star },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-8 h-8 text-portal-accent mx-auto mb-4 opacity-50" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bootcamps Grid */}
      <section id="bootcamps" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4">Open Enrollments</h2>
              <p className="text-portal-text-muted">Choose your path and start your application today.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-portal-accent font-bold text-sm uppercase tracking-widest">
              View All <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-[400px] bg-portal-card border border-portal-border rounded-[32px] animate-pulse" />
              ))
            ) : bootcamps.length > 0 ? (
              bootcamps.map(bootcamp => (
                <div key={bootcamp._id} className="group bg-portal-card border border-portal-border rounded-[32px] p-8 shadow-xl hover:border-portal-accent/30 transition-all flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-portal-accent/10 rounded-2xl text-portal-accent">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {bootcamp.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-portal-accent transition-colors">{bootcamp.name}</h3>
                  <p className="text-portal-text-muted text-sm leading-relaxed mb-8 flex-1">
                    {bootcamp.description || 'Master the latest technologies and build real-world applications in this intensive program.'}
                  </p>
                  <div className="space-y-4 pt-6 border-t border-portal-border/50">
                    <div className="flex items-center justify-between text-xs font-bold text-portal-text-muted uppercase tracking-widest">
                      <span>Duration</span>
                      <span className="text-portal-text">12 Weeks</span>
                    </div>
                    <Link 
                      to={`/apply/${bootcamp._id}`} 
                      className="w-full py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-portal-accent/90 transition-all"
                    >
                      Apply Now
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-portal-card border border-portal-border rounded-[32px]">
                <ShieldCheck className="w-16 h-16 text-portal-text-muted mx-auto mb-6 opacity-20" />
                <h3 className="text-xl font-bold">No active enrollments</h3>
                <p className="text-portal-text-muted mt-2">Check back later for new bootcamp announcements.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-portal-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-portal-text-muted text-sm">© 2026 CSEC ASTU Bootcamp Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
