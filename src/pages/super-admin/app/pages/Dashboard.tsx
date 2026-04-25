import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Calendar, FileText, GraduationCap, BookOpen, ArrowUpCircle, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '../components/ui/button';

const divisionData = [
  { name: 'Data Science', students: 420, sessions: 24, applications: 45 },
  { name: 'Development', students: 380, sessions: 28, applications: 38 },
  { name: 'Cybersecurity', students: 290, sessions: 18, applications: 32 },
  { name: 'CPD', students: 194, sessions: 15, applications: 28 },
];

const monthlyTrend = [
  { month: 'Oct', students: 1150, sessions: 72, attendance: 92 },
  { month: 'Nov', students: 1200, sessions: 78, attendance: 89 },
  { month: 'Dec', students: 1210, sessions: 68, attendance: 85 },
  { month: 'Jan', students: 1240, sessions: 82, attendance: 91 },
  { month: 'Feb', students: 1260, sessions: 85, attendance: 93 },
  { month: 'Mar', students: 1270, sessions: 88, attendance: 94 },
  { month: 'Apr', students: 1284, sessions: 90, attendance: 95 },
];

const statusData = [
  { name: 'Active', value: 850, color: '#238636' },
  { name: 'Graduated', value: 420, color: '#0969da' },
  { name: 'Suspended', value: 14, color: '#cf222e' },
];

const recentActivity = [
  { action: 'New student enrolled', user: 'Sarah Jenkins', division: 'Data Science', time: '5 mins ago', type: 'student' },
  { action: 'Session created', user: 'Mike Johnson', division: 'Cybersecurity', time: '15 mins ago', type: 'session' },
  { action: 'Application approved', user: 'Admin Team', division: 'Development', time: '1 hour ago', type: 'application' },
  { action: 'Student promoted to Instructor', user: 'Emma Wilson', division: 'CPD', time: '2 hours ago', type: 'promotion' },
  { action: 'New resource uploaded', user: 'John Doe', division: 'Data Science', time: '3 hours ago', type: 'resource' },
];

export function Dashboard() {
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedYear, setSelectedYear] = useState('2026');

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(35, 134, 54);
    doc.text('Bootcamp Management System', 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Analytics Report', 14, 28);
    
    // Date and filters
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);
    doc.text(`Division: ${selectedDivision} | Year: ${selectedYear}`, 14, 41);
    
    // Summary statistics
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary Statistics', 14, 52);
    
    autoTable(doc, {
      startY: 56,
      head: [['Metric', 'Value', 'Change']],
      body: [
        ['Total Students', '1,284', '+12%'],
        ['Active Sessions', '90', '+4%'],
        ['Total Divisions', '4', '0%'],
        ['Pending Applications', '143', '-2%'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [35, 134, 54] },
    });
    
    // Division breakdown
    const finalY = (doc as any).lastAutoTable.finalY || 56;
    doc.text('Division Breakdown', 14, finalY + 12);
    
    autoTable(doc, {
      startY: finalY + 16,
      head: [['Division', 'Students', 'Sessions', 'Applications']],
      body: divisionData.map(d => [d.name, d.students, d.sessions, d.applications]),
      theme: 'grid',
      headStyles: { fillColor: [9, 105, 218] },
    });
    
    doc.save(`BMS-Analytics-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">Dashboard Overview</h1>
          <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">Comprehensive analytics and statistics for all divisions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
            <select 
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9]"
            >
              <option value="All Divisions">All Divisions</option>
              <option value="Data Science">Data Science</option>
              <option value="Development">Development</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="CPD">CPD</option>
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9]"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          <Button onClick={generatePDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Generate PDF
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '1,284', change: '+12%', icon: Users, color: 'bg-[#ddf4ff]', textColor: 'text-[#0969da]', trend: 'up' },
          { label: 'Active Sessions', value: '90', change: '+4%', icon: Calendar, color: 'bg-[#dafbe1]', textColor: 'text-[#1a7f37]', trend: 'up' },
          { label: 'Total Divisions', value: '4', change: '0%', icon: BookOpen, color: 'bg-[#f4ecff]', textColor: 'text-[#8250df]', trend: 'stable' },
          { label: 'Applications', value: '143', change: '-2%', icon: FileText, color: 'bg-[#fff8c5]', textColor: 'text-[#9a6700]', trend: 'down' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2.5 rounded-lg", stat.color, stat.textColor)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-sm font-medium px-2 py-0.5 rounded",
                stat.trend === 'up' ? 'text-[#1a7f37] bg-[#dafbe1]' : 
                stat.trend === 'down' ? 'text-[#cf222e] bg-[#ffebe9]' : 
                'text-[#57606a] bg-[#f6f8fa]'
              )}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-[#57606a] dark:text-[#8b949e] text-sm font-medium mb-1">{stat.label}</h3>
            <div className="text-3xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Division Performance */}
        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#24292f] dark:text-[#c9d1d9]">Division Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={divisionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="name" stroke="#8b949e" style={{ fontSize: '12px' }} />
              <YAxis stroke="#8b949e" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '8px' }}
                labelStyle={{ color: '#c9d1d9' }}
              />
              <Legend />
              <Bar dataKey="students" fill="#0969da" name="Students" />
              <Bar dataKey="sessions" fill="#238636" name="Sessions" />
              <Bar dataKey="applications" fill="#8250df" name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Status Distribution */}
        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#24292f] dark:text-[#c9d1d9]">Student Status Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#24292f] dark:text-[#c9d1d9]">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="month" stroke="#8b949e" style={{ fontSize: '12px' }} />
              <YAxis stroke="#8b949e" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '8px' }}
                labelStyle={{ color: '#c9d1d9' }}
              />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#0969da" strokeWidth={2} name="Students" />
              <Line type="monotone" dataKey="sessions" stroke="#238636" strokeWidth={2} name="Sessions" />
              <Line type="monotone" dataKey="attendance" stroke="#8250df" strokeWidth={2} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#24292f] dark:text-[#c9d1d9]">Recent Activity</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#d0d7de] dark:border-[#30363d] last:border-0 last:pb-0">
                <div className={cn(
                  "w-2 h-2 mt-2 rounded-full",
                  activity.type === 'student' ? 'bg-[#0969da]' :
                  activity.type === 'session' ? 'bg-[#238636]' :
                  activity.type === 'application' ? 'bg-[#8250df]' :
                  activity.type === 'promotion' ? 'bg-[#d29922]' :
                  'bg-[#57606a]'
                )}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#24292f] dark:text-[#c9d1d9] font-medium">{activity.action}</p>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
                    {activity.user} • {activity.division}
                  </p>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Division Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {divisionData.map((division) => (
          <div key={division.name} className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{division.name}</h4>
              <GraduationCap className="w-5 h-5 text-[#0969da] dark:text-[#58a6ff]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#57606a] dark:text-[#8b949e]">Students</span>
                <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{division.students}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#57606a] dark:text-[#8b949e]">Sessions</span>
                <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{division.sessions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#57606a] dark:text-[#8b949e]">Applications</span>
                <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{division.applications}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}