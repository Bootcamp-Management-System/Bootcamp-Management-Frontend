import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Calendar, FileText, GraduationCap, BookOpen, ArrowUpCircle, Filter, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '../components/ui/button';
import { userService } from '../../../../services/userService';
import { divisionService } from '../../../../services/divisionService';
import { recruitmentService } from '../../../../services/recruitmentService';

export function Dashboard() {
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDivisions: 0,
    applications: 0
  });
  const [divisionBreakdown, setDivisionBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, divisionsRes, appsRes] = await Promise.all([
        userService.getUsers(),
        divisionService.getDivisions(),
        recruitmentService.getApplications()
      ]);

      const students = usersRes.data?.filter((u: any) => u.role === 'student' || u.is_Member) || [];
      const divs = divisionsRes.data || [];
      
      setStats({
        totalStudents: students.length,
        totalDivisions: divs.length,
        applications: appsRes.data?.length || 0
      });

      // Calculate breakdown by division
      const breakdown = divs.map((d: any) => {
        const studentCount = students.filter((s: any) => {
          const sDivId = s.division?._id || s.division;
          const mDivIds = s.memberships?.map((m: any) => m.division?._id || m.division) || [];
          return sDivId === d._id || mDivIds.includes(d._id);
        }).length;
        
        return {
          name: d.name,
          students: studentCount,
          applications: appsRes.data?.filter((a: any) => (a.division?._id || a.division) === d._id).length || 0
        };
      });

      setDivisionBreakdown(breakdown);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(35, 134, 54);
    doc.text('CSEC BMS Analytics Report', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Count']],
      body: [
        ['Total Students', stats.totalStudents],
        ['Total Divisions', stats.totalDivisions],
        ['Pending Applications', stats.applications],
      ],
      theme: 'striped',
      headStyles: { fillColor: [35, 134, 54] },
    });
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Division', 'Students', 'Applications']],
      body: divisionBreakdown.map(d => [d.name, d.students, d.applications]),
      theme: 'grid',
      headStyles: { fillColor: [9, 105, 218] },
    });
    
    doc.save(`BMS-Summary-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const metrics = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-[#ddf4ff]', textColor: 'text-[#0969da]' },
    { label: 'Total Divisions', value: stats.totalDivisions, icon: BookOpen, color: 'bg-[#f4ecff]', textColor: 'text-[#8250df]' },
    { label: 'Applications', value: stats.applications, icon: FileText, color: 'bg-[#fff8c5]', textColor: 'text-[#9a6700]' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-portal-text">Dashboard Overview</h1>
          <p className="text-sm text-portal-text-muted mt-1">Real-time data from CSEC BMS database</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={generatePDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((stat, i) => (
          <div key={i} className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={cn("p-3 rounded-xl", stat.color, stat.textColor)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-portal-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1 relative z-10">{stat.label}</h3>
            <div className="text-4xl font-black text-portal-text relative z-10">
              {loading ? (
                <div className="w-16 h-8 bg-portal-text/10 animate-pulse rounded-md" />
              ) : stat.value}
            </div>
            
            {/* Background Decorative Icon */}
            <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-portal-text/5 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-portal-card border border-portal-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-black text-portal-text mb-6 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-portal-accent" />
            Division Enrollment
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={divisionBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--portal-border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--portal-text-muted)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontWeight: 800 }}
              />
              <YAxis 
                stroke="var(--portal-text-muted)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontWeight: 800 }}
              />
              <Tooltip 
                cursor={{ fill: 'var(--portal-accent)', opacity: 0.05 }}
                contentStyle={{ 
                  backgroundColor: 'var(--portal-card)', 
                  borderColor: 'var(--portal-border)', 
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  border: '1px solid var(--portal-border)'
                }}
                itemStyle={{ color: 'var(--portal-text)', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: 'var(--portal-text-muted)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', marginBottom: '4px' }}
              />
              <Bar 
                dataKey="students" 
                fill="var(--portal-accent)" 
                radius={[6, 6, 0, 0]} 
                name="Verified Members" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-portal-card border border-portal-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-black text-portal-text mb-6 uppercase tracking-widest flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-portal-accent" />
            Resource Distribution
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={divisionBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="students"
                  nameKey="name"
                >
                  {divisionBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#2ab1c2', '#8b5cf6', '#ef4444', '#10b981'][index % 4]} 
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--portal-card)', 
                    borderColor: 'var(--portal-border)', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    border: '1px solid var(--portal-border)'
                  }}
                  itemStyle={{ color: 'var(--portal-text)', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest">Total</p>
              <p className="text-3xl font-black text-portal-text">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}