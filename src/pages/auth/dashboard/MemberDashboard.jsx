import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDivision } from '../../../context/DivisionContext';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  MoreHorizontal,
  Circle,
  FileText,
  Activity,
  Users,
  ChevronLeft,
  ChevronRight,
  Timer,
  Terminal,
  Shield,
  Database,
  Cpu
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ChartTooltip 
} from 'recharts';

import { Link } from 'react-router-dom';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const { activeDivision } = useDivision();

  const divisionThemes = {
    'Development': { icon: Terminal, color: 'text-blue-400', label: 'Dev Node' },
    'Cyber Security': { icon: Shield, color: 'text-red-400', label: 'Sec Ops' },
    'Data Science': { icon: Database, color: 'text-purple-400', label: 'Data Engine' },
    'CP (Competitive Programming)': { icon: Cpu, color: 'text-orange-400', label: 'Algorithmic' }
  };

  const theme = divisionThemes[activeDivision] || divisionThemes['Development'];
  const ThemeIcon = theme.icon;

  const taskStats = [
    { name: 'Completed', value: 12, color: '#10b981' },
    { name: 'Pending', value: 5, color: '#f59e0b' },
    { name: 'New', value: 3, color: '#3b82f6' },
  ];

  const events = [
    { title: 'Advanced React Workshop', type: 'Workshop', date: 'Oct 24, 2026', time: '2:00 PM', attendees: 45 },
    { title: 'Weekly Division Sync', type: 'Meeting', date: 'Oct 26, 2026', time: '10:00 AM', attendees: 12 },
    { title: 'UI Design Principles', type: 'Seminar', date: 'Oct 28, 2026', time: '4:30 PM', attendees: 30 },
  ];

  const upcomingTasks = [
    { title: 'Implement Profile UI', deadline: 'Today', priority: 'High', status: 'In Progress' },
    { title: 'Code Review: Auth Module', deadline: 'Tomorrow', priority: 'Medium', status: 'Pending' },
    { title: 'Database Schema Design', deadline: 'Oct 25', priority: 'High', status: 'New' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name}!</h2>
          <p className="text-portal-text-muted">Stay updated with your bootcamp activities and tasks.</p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-portal-card border ${theme.color.replace('text-', 'border-')}/30 shadow-xl`}>
          <div className={`p-2 rounded-xl ${theme.color.replace('text-', 'bg-')}/10 ${theme.color}`}>
            <ThemeIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest leading-none mb-1">Active context</p>
            <p className={`text-sm font-bold ${theme.color}`}>{activeDivision}</p>
          </div>
        </div>
      </header>

      {/* Stats and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns Container */}
        <div className="lg:col-span-2 space-y-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar className="w-24 h-24 text-portal-accent" />
              </div>
              <div className="relative z-10">
                <div className="p-3 rounded-2xl bg-portal-accent/10 text-portal-accent w-fit mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-portal-text-muted text-sm font-bold uppercase tracking-widest mb-1">Upcoming Events</h3>
                <div className="text-4xl font-bold text-white mb-2">3</div>
                <p className="text-xs text-portal-text-muted">Next event in 4 hours</p>
              </div>
            </div>

            <div className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 className="w-24 h-24 text-green-400" />
              </div>
              <div className="relative z-10">
                <div className="p-3 rounded-2xl bg-green-400/10 text-green-400 w-fit mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-portal-text-muted text-sm font-bold uppercase tracking-widest mb-1">Completed Tasks</h3>
                <div className="text-4xl font-bold text-white mb-2">12</div>
                <p className="text-xs text-portal-text-muted">83% of total assigned tasks</p>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-portal-card border border-portal-border p-8 rounded-3xl shadow-xl hover:border-portal-accent/30 transition-all">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText className="w-6 h-6 text-portal-accent" />
                Upcoming Tasks
              </h3>
              <Link 
                to="/my-tasks"
                className="text-xs font-bold text-portal-accent flex items-center gap-1 hover:text-white transition-colors uppercase tracking-widest"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-portal-input border border-portal-border/50 hover:bg-portal-border transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-portal-accent'}`} />
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-portal-accent transition-colors">{task.title}</h4>
                      <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-wider mt-0.5">Deadline: {task.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-portal-text-muted border border-white/5">{task.status}</span>
                    <MoreHorizontal className="w-4 h-4 text-portal-text-muted group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Container */}
        <div className="space-y-8">
          {/* Task Analysis Chart */}
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl flex flex-col items-center">
            <h3 className="text-lg font-bold text-white mb-8 self-start flex items-center gap-3">
              <Activity className="w-5 h-5 text-portal-accent" />
              Task Analysis
            </h3>
            <div className="w-full h-[240px] relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {taskStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#06111a', border: '1px solid #1a2e3b', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-3xl font-extrabold text-white">20</div>
                <div className="text-[10px] text-portal-text-muted uppercase font-bold tracking-widest">Total</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              {taskStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 bg-portal-input p-3 rounded-2xl border border-portal-border/30">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                  <div>
                    <div className="text-[10px] text-portal-text-muted font-bold uppercase">{stat.name}</div>
                    <div className="text-sm font-bold text-white">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events and Attendance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events - taking 2/3 width */}
        <div className="lg:col-span-2 bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Calendar className="w-6 h-6 text-portal-accent" />
              Bootcamp Events
            </h3>
            <button className="text-sm font-bold text-portal-accent hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group">
              See More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.slice(0, 2).map((event, i) => (
              <div key={i} className="bg-portal-input border border-portal-border/50 p-6 rounded-2xl hover:border-portal-accent/30 transition-all group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-portal-accent/5 rounded-full blur-2xl group-hover:bg-portal-accent/10 transition-colors" />
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-portal-accent/10 text-portal-accent uppercase tracking-widest">
                    {event.type}
                  </span>
                  <span className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">
                    {event.attendees} Attending
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-portal-accent transition-colors">
                  {event.title}
                </h4>
                <div className="flex flex-col gap-1 text-xs text-portal-text-muted font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-portal-accent" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-portal-accent" />
                    {event.time}
                  </div>
                </div>
                <button className="w-full py-2 bg-white/5 text-white text-xs font-bold rounded-xl border border-white/5 hover:bg-portal-accent hover:border-portal-accent transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Join Event
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Tracker - taking 1/3 width */}
        <div className="bg-portal-card border border-portal-border rounded-3xl overflow-hidden shadow-xl flex flex-col">
          {/* Top Summary Banner */}
          <div className="bg-portal-accent p-6 relative overflow-hidden shrink-0">
            <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-20 transform">
              <Timer className="w-12 h-12 text-white" />
            </div>
            <div className="relative z-10 flex items-center justify-end gap-3 text-white text-right">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-80">Overall Attendance</span>
                <div className="flex items-baseline gap-1 leading-none mt-1">
                  <span className="text-4xl font-black tracking-tighter">21</span>
                  <span className="text-xs font-bold opacity-80">Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Month Selector */}
          <div className="p-4 border-b border-portal-border flex items-center justify-between bg-portal-card/30">
            <h3 className="text-[10px] font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-portal-accent" />
              History
            </h3>
            <div className="flex items-center gap-3 bg-portal-input px-2 py-1 rounded-xl border border-portal-border/50">
              <button className="text-portal-text-muted hover:text-white transition-colors">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-[9px] font-extrabold text-white min-w-[50px] text-center tracking-tight">NOV 2026</span>
              <button className="text-portal-text-muted hover:text-white transition-colors">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="grid grid-cols-7 gap-y-3 mb-auto">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, dayIdx) => (
                <div key={dayIdx} className="text-center text-[7px] font-black text-portal-text-muted tracking-widest leading-none">
                  {day}
                </div>
              ))}

              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                let dotColor = '';
                let textStyle = 'text-portal-text-muted hover:text-white';

                if ([3, 4, 5, 6, 7, 10, 11, 13, 14, 19, 20, 26, 27].includes(dayNum)) {
                  dotColor = 'bg-portal-accent shadow-[0_0_8px_rgba(45,212,191,0.5)]';
                  textStyle = 'text-white';
                } else if ([17, 18, 21, 23, 25].includes(dayNum)) {
                  dotColor = 'bg-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
                  textStyle = 'text-white';
                } else if ([12, 24].includes(dayNum)) {
                  dotColor = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
                  textStyle = 'text-white';
                }

                return (
                  <div key={i} className="flex flex-col items-center justify-center relative select-none h-6">
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold 
                      transition-all duration-300 relative z-10 cursor-pointer
                      ${textStyle}
                    `}>
                      {dotColor && (
                        <div className={`absolute inset-0 rounded-full ${dotColor} -z-10`} />
                      )}
                      {dayNum}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-around border-t border-portal-border/30 pt-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-portal-accent" />
                <span className="text-[6px] font-black text-portal-text-muted uppercase tracking-tighter">Present</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                <span className="text-[6px] font-black text-portal-text-muted uppercase tracking-tighter">Late</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[6px] font-black text-portal-text-muted uppercase tracking-tighter">Absent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
