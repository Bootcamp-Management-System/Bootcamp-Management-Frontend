import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Play, Trophy, Code, BookOpen, Star } from 'lucide-react';

const tasks = [
  { 
    id: 1, 
    title: 'HTML/CSS Mastery', 
    description: 'Master Flexbox, Grid, and responsive design systems.', 
    type: 'lesson', 
    status: 'done',
    icon: BookOpen
  },
  { 
    id: 2, 
    title: 'JS Fundamentals', 
    description: 'Deep dive into Arrays, Objects, and ES6+ features.', 
    type: 'lesson', 
    status: 'done',
    icon: Code
  },
  { 
    id: 3, 
    title: 'DOM Manipulation', 
    description: 'Interactive elements and event-driven architecture.', 
    type: 'quiz', 
    status: 'ongoing',
    icon: Trophy
  },
  { 
    id: 4, 
    title: 'Async JavaScript', 
    description: 'Promises, Async/Await, and API integrations.', 
    type: 'lesson', 
    status: 'new',
    icon: Star
  },
  { 
    id: 5, 
    title: 'React Basics', 
    description: 'Components, Props, and State management.', 
    type: 'lesson', 
    status: 'new',
    icon: Play
  },
  { 
    id: 6, 
    title: 'Final Project', 
    description: 'Build a production-ready application.', 
    type: 'project', 
    status: 'new',
    icon: Trophy
  }
];

export const MemberTaskPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen">
      <header className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-white mb-4 tracking-tight"
        >
          Your Cyber Path
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-portal-text-muted text-lg max-w-lg mx-auto"
        >
          Master each node to unlock advanced security certifications and developer badges.
        </motion.p>
      </header>

      <div className="relative">
        {/* The Central Path Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-portal-border -translate-x-1/2 z-0">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full bg-portal-accent/30 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
          />
        </div>

        {/* Path Nodes */}
        <div className="space-y-32 relative z-10">
          {tasks.map((task, index) => {
            const isLeft = index % 2 === 0;
            const isDone = task.status === 'done';
            const isOngoing = task.status === 'ongoing';
            const isNew = task.status === 'new';

            return (
              <div key={task.id} className="relative flex items-center justify-center">
                {/* Node Button */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: index * 0.1 
                  }}
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer
                    transition-all duration-500 transform hover:scale-110 z-20 group relative
                    ${isDone ? 'bg-portal-accent shadow-[0_0_25px_rgba(45,212,191,0.5)]' : ''}
                    ${isOngoing ? 'bg-slate-800 border-2 border-portal-accent/50 text-portal-accent animate-pulse shadow-[0_0_15px_rgba(45,212,191,0.2)]' : ''}
                    ${isNew ? 'bg-portal-card border-2 border-portal-border text-portal-text-muted' : ''}
                  `}
                  style={isDone ? { 
                    borderRadius: '45% 55% 50% 50% / 55% 45% 55% 45%',
                  } : {}}
                >
                  {isDone && (
                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-inner">
                      <Check className="w-5 h-5 text-white stroke-[4]" />
                    </div>
                  )}
                  {isOngoing && <Play className="w-8 h-8 fill-current" />}
                  {isNew && <Lock className="w-8 h-8 opacity-40" />}
                </motion.div>

                {/* Content Card */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: isLeft ? -100 : 100 }}
                  viewport={{ once: true }}
                  className={`
                    absolute top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 
                    w-[320px] bg-portal-card border border-portal-border p-6 rounded-3xl 
                    shadow-2xl hover:border-portal-accent/40 transition-colors
                    ${isLeft ? 'right-[50%] mr-12 text-right items-end' : 'left-[50%] ml-12 text-left items-start'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`
                      text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full
                      ${task.type === 'quiz' ? 'bg-orange-500/20 text-orange-400' : ''}
                      ${task.type === 'lesson' ? 'bg-portal-accent/20 text-portal-accent' : ''}
                      ${task.type === 'project' ? 'bg-purple-500/20 text-purple-400' : ''}
                    `}>
                      {task.type}
                    </span>
                    <span className={`
                      text-[9px] font-bold uppercase tracking-tight
                      ${isDone ? 'text-green-400' : ''}
                      ${isOngoing ? 'text-portal-accent' : ''}
                      ${isNew ? 'text-portal-text-muted' : ''}
                    `}>
                      • {task.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-portal-accent transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-sm text-portal-text-muted font-medium leading-relaxed">
                    {task.description}
                  </p>
                  
                  {isOngoing && (
                    <button className="mt-4 bg-portal-accent text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all">
                      Continue Lesson
                    </button>
                  )}
                  {isNew && (
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-portal-text-muted font-bold uppercase tracking-widest">
                      <Lock className="w-3 h-3" /> Locked
                    </div>
                  )}
                </motion.div>

                {/* Mobile View Label */}
                <div className="absolute -bottom-10 md:hidden text-center whitespace-nowrap">
                  <h4 className="text-sm font-bold text-white">{task.title}</h4>
                  <p className="text-[10px] text-portal-text-muted uppercase tracking-widest">{task.type}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Bottom Space */}
        <div className="h-20" />
      </div>
    </div>
  );
};
