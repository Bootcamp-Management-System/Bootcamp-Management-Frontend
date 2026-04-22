import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  Users, 
  BookOpen, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock,
  ClipboardList,
  UserCheck,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ALL_MEMBERS, ALL_SESSIONS, ALL_TASKS } from '../../lib/mockData';

const growthData = [
  { name: 'Mon', users: 400 },
  { name: 'Tue', users: 300 },
  { name: 'Wed', users: 600 },
  { name: 'Thu', users: 800 },
  { name: 'Fri', users: 500 },
  { name: 'Sat', users: 900 },
  { name: 'Sun', users: 1100 },
];

const divisionDistribution = [
  { name: 'Dev', value: 45, color: '#60a5fa' },
  { name: 'Cyber', value: 30, color: '#f87171' },
  { name: 'Data', value: 15, color: '#c084fc' },
  { name: 'CP', value: 10, color: '#fb923c' },
];

export const AdminDashboard = () => {
  const { user, selectedDivision } = useAuth();
  
  const currentDivision = user?.role === 'super_admin' ? selectedDivision : (user?.division || 'Development');

  // Division-Scoped Logic
  const divisionMembers = ALL_MEMBERS.filter(m => currentDivision === 'All' || m.division === currentDivision);
  const divisionInstructors = ALL_MEMBERS.filter(m => (currentDivision === 'All' || m.division === currentDivision) && m.role === 'instructor');
  const divisionSessions = ALL_SESSIONS.filter(s => currentDivision === 'All' || s.division === currentDivision);
  const divisionTasks = ALL_TASKS.filter(t => currentDivision === 'All' || t.division === currentDivision);

  const stats = [
    { label: currentDivision === 'All' ? "Total Members" : "Division Members", value: divisionMembers.length, change: "+2", icon: Users, color: "text-blue-400" },
    { label: currentDivision === 'All' ? "Total Instructors" : "Instructors", value: divisionInstructors.length, change: "+0", icon: UserCheck, color: "text-green-400" },
    { label: currentDivision === 'All' ? "Total Sessions" : "Sessions", value: divisionSessions.length, change: "+1", icon: BookOpen, color: "text-purple-400" },
    { label: currentDivision === 'All' ? "Total Tasks" : "Active Tasks", value: divisionTasks.length, change: "+3", icon: ClipboardList, color: "text-orange-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header>
        <h2 className="text-3xl font-bold mb-2 text-portal-text">
          {currentDivision === 'All' ? 'Global System Metrics' : `${currentDivision} Metrics`}
        </h2>
        <p className="text-portal-text-muted italic">Monitoring {currentDivision === 'All' ? 'all divisions' : `the ${currentDivision} node`} in real-time.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-portal-card border border-portal-border p-6 rounded-3xl shadow-xl group hover:border-portal-accent/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-portal-text-muted text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
            <div className="text-3xl font-bold text-portal-text tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-portal-text flex items-center gap-3">
              <Activity className="w-6 h-6 text-portal-accent" />
              Registration Growth
            </h3>
            <select className="bg-portal-input border border-portal-border rounded-xl px-4 py-2 text-xs font-bold text-portal-text outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2e3b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#06111a', border: '1px solid #1a2e3b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#2dd4bf" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Division Split */}
        <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-portal-text mb-8 flex items-center gap-3">
            <Shield className="w-6 h-6 text-portal-accent" />
            Division Split
          </h3>
          <div className="h-[240px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divisionDistribution}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#06111a', border: '1px solid #1a2e3b', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                  {divisionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {divisionDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-portal-text-muted">{item.name} Division</span>
                </div>
                <span className="text-sm font-bold text-portal-text">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-portal-text flex items-center gap-3">
            <Clock className="w-6 h-6 text-portal-accent" />
            Division Activity
          </h3>
          <button className="text-xs font-bold text-portal-accent uppercase tracking-widest hover:text-portal-text transition-colors">View All Logs</button>
        </div>
        <div className="space-y-4">
          {divisionSessions.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-portal-input border border-portal-border/50 hover:border-portal-accent/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-portal-accent/10 flex items-center justify-center font-bold text-xs text-portal-accent">
                  {session.instructor.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-portal-text">
                    <span className="text-portal-accent">{session.instructor}</span> created session "{session.title}"
                  </p>
                  <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-wider mt-0.5">Instructor • {session.date}</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-portal-text-muted" />
            </div>
          ))}
          {divisionMembers.slice(0, 2).map((member, i) => (
            <div key={`member-${i}`} className="flex items-center justify-between p-4 rounded-2xl bg-portal-input border border-portal-border/50 hover:border-portal-accent/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center font-bold text-xs text-blue-400">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-portal-text">
                    <span className="text-portal-accent">{member.name}</span> reached 80% attendance milestone
                  </p>
                  <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-wider mt-0.5">Member • Today</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-portal-text-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
