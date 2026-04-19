import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  BarChart3,
  Video
} from 'lucide-react';

const mockSessions = [
  { 
    id: 1, 
    title: 'Modern Frontend Architecture', 
    day: 'Day 1', 
    description: 'Deep dive into micro-frontends and scalable React patterns used in production environments.', 
    instructor: 'Abebe Kebede', 
    date: '2026-04-19' // Today
  },
  { 
    id: 2, 
    title: 'Advanced State Management', 
    day: 'Day 2', 
    description: 'Mastering Redux Toolkit, Zustand, and React Context for complex application states.', 
    instructor: 'Sara Ahmed', 
    date: '2026-04-20' 
  },
  { 
    id: 3, 
    title: 'Testing & Quality Assurance', 
    day: 'Day 3', 
    description: 'Implementing robust unit, integration, and E2E tests using Vitest and Playwright.', 
    instructor: 'John Doe', 
    date: '2026-04-21' 
  },
  { 
    id: 4, 
    title: 'Node.js & Backend Design', 
    day: 'Day 4', 
    description: 'Building performant REST APIs and GraphQL servers with Express and NestJS.', 
    instructor: 'Abebe Kebede', 
    date: '2026-04-22' 
  },
  { 
    id: 5, 
    title: 'DevOps for Frontenders', 
    day: 'Day 5', 
    description: 'Understanding CI/CD pipelines, Docker, and cloud deployments for modern web apps.', 
    instructor: 'Marta Hailu', 
    date: '2026-04-23' 
  },
  { 
    id: 6, 
    title: 'Performance Optimization', 
    day: 'Day 6', 
    description: 'Analyzing bundle sizes, rendering cycles, and core web vitals for lightning fast experiences.', 
    instructor: 'Sara Ahmed', 
    date: '2026-04-24' 
  }
];

export const MemberSessionPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const todayStr = '2026-04-19';

  const filteredSessions = useMemo(() => {
    return mockSessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           session.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDay = dayFilter === 'All' || session.day === dayFilter;
      return matchesSearch && matchesDay;
    });
  }, [searchQuery, dayFilter]);

  const displayedSessions = showAll ? filteredSessions : filteredSessions.slice(0, 3);
  
  const todaySessions = mockSessions.filter(s => s.date === todayStr);
  const totalSessions = mockSessions.length;

  const days = ['All', ...Array.from(new Set(mockSessions.map(s => s.day)))].sort();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header>
        <h2 className="text-3xl font-bold mb-2 text-white">My Learning Sessions</h2>
        <p className="text-portal-text-muted">Explore your bootcamp journey, node by node.</p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Video className="w-24 h-24 text-portal-accent" />
          </div>
          <div className="relative z-10">
            <div className="p-3 rounded-2xl bg-portal-accent/10 text-portal-accent w-fit mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-portal-text-muted text-sm font-bold uppercase tracking-widest mb-1">Daily Sessions</h3>
            <div className="text-4xl font-extrabold text-white mb-2">{todaySessions.length}</div>
            <p className="text-xs text-portal-text-muted">Live and scheduled for today</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-24 h-24 text-blue-400" />
          </div>
          <div className="relative z-10">
            <div className="p-3 rounded-2xl bg-blue-400/10 text-blue-400 w-fit mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-portal-text-muted text-sm font-bold uppercase tracking-widest mb-1">Total Curriculum</h3>
            <div className="text-4xl font-extrabold text-white mb-2">{totalSessions}</div>
            <p className="text-xs text-portal-text-muted">Total masterclasses in the program</p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
          <input 
            type="text" 
            placeholder="Search sessions or instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-portal-input border border-portal-border placeholder:text-portal-text-muted text-white pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:border-portal-accent/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-portal-text-muted shrink-0" />
          {days.map(day => (
            <button
              key={day}
              onClick={() => setDayFilter(day)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${dayFilter === day 
                  ? 'bg-portal-accent border-portal-accent text-white shadow-lg shadow-portal-accent/20' 
                  : 'bg-portal-card border-portal-border text-portal-text-muted hover:text-white hover:border-portal-border/80'}
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Main Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Video className="w-6 h-6 text-portal-accent" />
            {showAll ? 'All Sessions' : 'Upcoming Sessions'}
          </h3>
          {filteredSessions.length > 3 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-black text-portal-accent hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group"
            >
              {showAll ? 'View Less' : 'See More'} 
              <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${showAll ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedSessions.length > 0 ? (
              displayedSessions.map((session, i) => {
                const isToday = session.date === todayStr;
                return (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`
                      relative overflow-hidden p-6 rounded-3xl border transition-all h-full flex flex-col
                      ${isToday 
                        ? 'bg-portal-card border-portal-accent/50 shadow-[0_0_20px_rgba(45,212,191,0.15)] ring-1 ring-portal-accent/30' 
                        : 'bg-portal-card border-portal-border hover:border-portal-accent/40 shadow-xl'
                      }
                    `}
                  >
                    {isToday && (
                      <div className="absolute top-0 right-0 bg-portal-accent px-4 py-1.5 rounded-bl-2xl">
                        <span className="text-[10px] font-black uppercase text-white tracking-widest">Happening Today</span>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-6 pt-2">
                       <div className={`p-3 rounded-2xl ${isToday ? 'bg-portal-accent/20 text-portal-accent' : 'bg-portal-input text-portal-accent'}`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-portal-accent/10 text-portal-accent uppercase tracking-widest border border-portal-accent/20">
                        {session.day}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-portal-accent transition-colors">
                        {session.title}
                      </h4>
                      <p className="text-sm text-portal-text-muted leading-relaxed font-medium line-clamp-3 mb-6">
                        {session.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-portal-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-portal-input border border-portal-border flex items-center justify-center">
                          <User className="w-4 h-4 text-portal-accent" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-portal-text-muted uppercase tracking-widest">Instructor</p>
                          <p className="text-xs font-bold text-white">{session.instructor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-portal-text-muted uppercase tracking-widest">Date</p>
                        <p className="text-xs font-bold text-portal-accent">{session.date}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-portal-input rounded-3xl flex items-center justify-center mx-auto mb-6 border border-portal-border/50">
                  <Search className="w-10 h-10 text-portal-text-muted" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">No sessions found</h4>
                <p className="text-portal-text-muted text-sm">Try adjusting your filters or search keywords.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
