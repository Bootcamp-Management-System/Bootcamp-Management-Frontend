import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Calendar, FileText, GraduationCap, BookOpen, ArrowUpCircle, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '../components/ui/button';
import { userService } from '../../../../services/userService';
import { divisionService } from '../../../../services/divisionService';
import sessionService from '../../../../services/sessionService';
import { recruitmentService } from '../../../../services/recruitmentService';

export function Dashboard() {
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeSessions: 0,
    totalDivisions: 0,
    applications: 0
  });
  const [divisionBreakdown, setDivisionBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, divisionsRes, sessionsRes, appsRes] = await Promise.all([
        userService.getUsers(),
        divisionService.getDivisions(),
        sessionService.getSessions(), // Note: this might fail if no bootcampId is provided, check backend
        recruitmentService.getApplications()
      ]);

      const students = usersRes.data?.filter(u => u.role === 'student' || u.is_Member) || [];
      const divs = divisionsRes.data || [];
      
      setStats({
        totalStudents: students.length,
        activeSessions: sessionsRes.data?.length || 0,
        totalDivisions: divs.length,
        applications: appsRes.data?.length || 0
      });

      // Calculate breakdown by division
      const breakdown = divs.map(d => {
        const studentCount = students.filter(s => {
          const sDivId = s.division?._id || s.division;
          const mDivIds = s.memberships?.map(m => m.division?._id || m.division) || [];
          return sDivId === d._id || mDivIds.includes(d._id);
        }).length;
        
        return {
          name: d.name,
          students: studentCount,
          sessions: sessionsRes.data?.filter(s => (s.division?._id || s.division) === d._id).length || 0,
          applications: appsRes.data?.filter(a => (a.division?._id || a.division) === d._id).length || 0
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
        ['Active Sessions', stats.activeSessions],
        ['Total Divisions', stats.totalDivisions],
        ['Pending Applications', stats.applications],
      ],
      theme: 'striped',
      headStyles: { fillColor: [35, 134, 54] },
    });
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Division', 'Students', 'Sessions', 'Applications']],
      body: divisionBreakdown.map(d => [d.name, d.students, d.sessions, d.applications]),
      theme: 'grid',
      headStyles: { fillColor: [9, 105, 218] },
    });
    
    doc.save(`BMS-Summary-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const metrics = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-[#ddf4ff]', textColor: 'text-[#0969da]' },
    { label: 'Active Sessions', value: stats.activeSessions, icon: Calendar, color: 'bg-[#dafbe1]', textColor: 'text-[#1a7f37]' },
    { label: 'Total Divisions', value: stats.totalDivisions, icon: BookOpen, color: 'bg-[#f4ecff]', textColor: 'text-[#8250df]' },
    { label: 'Applications', value: stats.applications, icon: FileText, color: 'bg-[#fff8c5]', textColor: 'text-[#9a6700]' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">Dashboard Overview</h1>
          <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">Real-time data from CSEC BMS database</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={generatePDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2.5 rounded-lg", stat.color, stat.textColor)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-[#57606a] dark:text-[#8b949e] text-sm font-medium mb-1">{stat.label}</h3>
            <div className="text-3xl font-bold text-[#24292f] dark:text-[#c9d1d9]">
              {loading ? '...' : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#24292f] dark:text-[#c9d1d9]">Division Enrollment Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={divisionBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="name" stroke="#8b949e" />
              <YAxis stroke="#8b949e" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '8px' }}
                labelStyle={{ color: '#c9d1d9' }}
              />
              <Legend />
              <Bar dataKey="students" fill="#0969da" name="Verified Members" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#24292f] dark:text-[#c9d1d9]">Resource Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={divisionBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="students"
                  nameKey="name"
                >
                  {divisionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#238636', '#0969da', '#cf222e', '#8250df'][index % 4]} />
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
    </div>
  );
}