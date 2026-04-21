import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Users, 
  PieChart as PieChartIcon,
  Activity,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';

const attendanceData = [
  { week: 'W1', rate: 85 },
  { week: 'W2', rate: 88 },
  { week: 'W3', rate: 92 },
  { week: 'W4', rate: 90 },
  { week: 'W5', rate: 95 },
  { week: 'W6', rate: 94 },
];

const completionData = [
  { name: 'Core', value: 75, color: '#2dd4bf' },
  { name: 'Elective', value: 45, color: '#60a5fa' },
  { name: 'Project', value: 90, color: '#f87171' },
];

export const AdminReportsPage = () => {
  const { user: admin } = useAuth();
  const adminDivision = admin?.division || 'Data Science';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Division Intelligence</h2>
          <p className="text-portal-text-muted">Data-driven insights for the {adminDivision} track.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-portal-border px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
          <Download className="w-4 h-4 text-portal-accent" />
          Export Dataset
        </button>
      </header>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Progression */}
        <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Activity className="w-6 h-6 text-portal-accent" />
                Attendance Vector
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                +4.2%
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#1a2e3b" vertical={false} />
                   <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#06111a', border: '1px solid #1a2e3b', borderRadius: '12px' }}
                   />
                   <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#2dd4bf" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: '#2dd4bf', strokeWidth: 2, stroke: '#06111a' }}
                      activeDot={{ r: 8 }}
                   />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Milestone Completion */}
        <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
           <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
             <BarChart3 className="w-6 h-6 text-portal-accent" />
             Content Velocity
           </h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#1a2e3b" vertical={false} />
                   <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#06111a', border: '1px solid #1a2e3b', borderRadius: '12px' }}
                   />
                   <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-portal-card/50 border border-portal-border rounded-2xl p-6">
             <span className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Active Retention</span>
             <div className="text-2xl font-black text-white mt-2">94.8%</div>
             <div className="flex items-center gap-1 text-[10px] text-green-400 mt-1">
                <ArrowUpRight className="w-3 h-3" /> High Performance
             </div>
          </div>
          <div className="bg-portal-card/50 border border-portal-border rounded-2xl p-6">
             <span className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Resource Saturation</span>
             <div className="text-2xl font-black text-white mt-2">62%</div>
             <div className="flex items-center gap-1 text-[10px] text-yellow-400 mt-1">
                <Activity className="w-3 h-3" /> Optimization Opportunity
             </div>
          </div>
          <div className="bg-portal-card/50 border border-portal-border rounded-2xl p-6">
             <span className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Dropout Vector</span>
             <div className="text-2xl font-black text-white mt-2">1.2%</div>
             <div className="flex items-center gap-1 text-[10px] text-green-400 mt-1">
                <ArrowDownRight className="w-3 h-3" /> System Stability
             </div>
          </div>
      </div>
    </div>
  );
};
