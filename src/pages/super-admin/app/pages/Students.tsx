import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpCircle, UserPlus, BookOpen, BarChart3, MoreVertical, GraduationCap, Users as UsersIcon, UserCheck } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

export function Students() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [divisionsList, setDivisionsList] = useState(['All Divisions']);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [promoteToRole, setPromoteToRole] = useState('Instructor');

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, divsRes] = await Promise.all([
        userService.getUsers(),
        divisionService.getDivisions()
      ]);
      setUsers(usersRes.data || []);
      if (divsRes.data) {
        setDivisionsList(['All Divisions', ...divsRes.data.map((d: any) => d.name)]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const students = users.filter(u => u.role === 'student' || u.role === 'instructor');

  const filteredStudents = students.filter(u => {
    // Filter by tab
    let tabMatch = true;
    const isStudent = u.role === 'student';
    if (activeTab === 'All Students') tabMatch = isStudent;
    else if (activeTab === 'Active') tabMatch = u.verified && isStudent;
    else if (activeTab === 'Graduated') tabMatch = u.status === 'Graduated' && isStudent;
    else if (activeTab === 'Suspended') tabMatch = u.status === 'Suspended' && isStudent;
    else if (activeTab === 'Instructors') tabMatch = u.role === 'instructor';

    // Filter by division
    const uDivs = u.memberships?.map((m: any) => m.division?.name || m.division) || [];
    const divisionMatch = selectedDivision === 'All Divisions' || uDivs.includes(selectedDivision) || u.division?.name === selectedDivision;

    // Filter by year
    const yearMatch = selectedYear === 'All' || u.year === selectedYear;

    // Filter by search
    const searchMatch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && divisionMatch && yearMatch && searchMatch;
  });

  const roleCounts = {
    Total: students.filter(u => u.role === 'student').length,
    Active: students.filter(u => u.role === 'student' && u.verified).length,
    Graduated: students.filter(u => u.role === 'student' && u.status === 'Graduated').length,
    Suspended: students.filter(u => u.role === 'student' && u.status === 'Suspended').length,
    Instructors: students.filter(u => u.role === 'instructor').length
  };

  const statusData = [
    { name: 'Active', value: roleCounts.Active, color: '#238636' },
    { name: 'Graduated', value: roleCounts.Graduated, color: '#0969da' },
    { name: 'Suspended', value: roleCounts.Suspended, color: '#cf222e' },
  ];

  const handlePromoteClick = (student: any) => {
    setSelectedStudent(student);
    setPromoteToRole('Instructor');
    setPromoteDialogOpen(true);
  };

  const handlePromoteConfirm = () => {
    if (selectedStudent) {
      toast.success(`${selectedStudent.name} has been promoted to ${promoteToRole}`);
      setPromoteDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9] flex items-center gap-2">
            Students Management
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Live Data</span>
          </h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">Manage all students and instructors across the system.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors shadow-sm">
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { id: 'All Students', label: 'All Students', count: roleCounts.Total, icon: BookOpen, color: 'border-[#0969da]', bg: 'bg-[#ddf4ff]', text: 'text-[#0969da]' },
          { id: 'Active', label: 'Active', count: roleCounts.Active, icon: UserCheck, color: 'border-[#1a7f37]', bg: 'bg-[#dafbe1]', text: 'text-[#1a7f37]' },
          { id: 'Graduated', label: 'Graduated', count: roleCounts.Graduated, icon: GraduationCap, color: 'border-[#8250df]', bg: 'bg-[#f4ecff]', text: 'text-[#8250df]' },
          { id: 'Suspended', label: 'Suspended', count: roleCounts.Suspended, icon: UsersIcon, color: 'border-[#cf222e]', bg: 'bg-[#ffebe9]', text: 'text-[#cf222e]' },
          { id: 'Instructors', label: 'Instructors', count: roleCounts.Instructors, icon: GraduationCap, color: 'border-[#d29922]', bg: 'bg-[#fff8c5]', text: 'text-[#9a6700]' }
        ].map((stat) => (
          <div 
            key={stat.id}
            onClick={() => setActiveTab(stat.id)}
            className={cn(
              "bg-white dark:bg-[#161b22] border rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden",
              activeTab === stat.id ? `border-2 ${stat.color}` : "border-[#d0d7de] dark:border-[#30363d] hover:border-[#8b949e]"
            )}
          >
            {activeTab === stat.id && (
              <div className={cn("absolute top-0 left-0 w-1 h-full", stat.bg)}></div>
            )}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-[#57606a] dark:text-[#8b949e] mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{stat.count}</h3>
              </div>
              <div className={cn("p-2 rounded-lg", stat.bg, stat.text)}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main List Section */}
        <div className="lg:col-span-3 bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
          {/* List Header & Filters */}
          <div className="p-4 border-b border-[#d0d7de] dark:border-[#30363d] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#f6f8fa] dark:bg-[#0d1117]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#57606a] dark:text-[#8b949e]" />
              <input 
                type="text" 
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
              <select 
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] appearance-none"
              >
                {divisionsList.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] appearance-none"
              >
                <option value="All">All Years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-b border-[#d0d7de] dark:border-[#30363d] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium">Name & Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Enrolled Divisions</th>
                  <th className="px-6 py-3 font-medium">Year</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d0d7de] dark:divide-[#30363d]">
                {filteredStudents.map((user) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('.actions-cell')) return;
                      navigate(`/super-admin/users/${user._id}`);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f6f8fa] dark:bg-[#30363d] border border-[#d0d7de] dark:border-[#21262d] flex items-center justify-center font-bold text-[#24292f] dark:text-[#c9d1d9] shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0969da] dark:text-[#58a6ff] group-hover:underline">{user.name}</span>
                          <span className="text-xs text-[#57606a] dark:text-[#8b949e]">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                        user.role === 'Instructor' 
                          ? "bg-[#f4ecff] text-[#8250df] border-[#8250df]/20" 
                          : "bg-[#ddf4ff] text-[#0969da] border-[#0969da]/20"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {(u.memberships || []).map((m: any) => (
                          <span key={m.division?._id || m.division} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f6f8fa] dark:bg-[#30363d] text-[#57606a] dark:text-[#c9d1d9] border border-[#d0d7de] dark:border-[#4b5563]">
                            {m.division?.name || 'Unassigned'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#57606a] dark:text-[#8b949e] font-medium">{user.year}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                        user.status === 'Active' ? "bg-[#dafbe1] text-[#1a7f37] dark:bg-[#238636]/20 dark:text-[#3fb950] border-[#1a7f37]/20 dark:border-[#2ea043]/30" : 
                        user.status === 'Suspended' ? "bg-[#ffebe9] text-[#cf222e] dark:bg-[#f85149]/20 dark:text-[#ff7b72] border-[#cf222e]/20 dark:border-[#f85149]/30" :
                        "bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff] border-[#0969da]/20 dark:border-[#2f81f7]/30"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right actions-cell">
                      <div className="flex items-center justify-end gap-3">
                        {/* Only Super Admin can promote graduated students to instructor */}
                        {user.role === 'Student' && user.status === 'Graduated' && (
                          <button 
                            onClick={() => handlePromoteClick(user)}
                            className="flex items-center gap-1 text-[#1a7f37] dark:text-[#3fb950] hover:text-[#2ea043] hover:bg-[#dafbe1] dark:hover:bg-[#238636]/20 p-1.5 rounded transition-colors text-xs font-medium" 
                            title="Promote to Instructor or Admin"
                          >
                            <ArrowUpCircle className="w-4 h-4" /> Promote
                          </button>
                        )}
                        {/* Instructors can be promoted to admin */}
                        {user.role === 'Instructor' && (
                          <button 
                            onClick={() => handlePromoteClick(user)}
                            className="flex items-center gap-1 text-[#8250df] dark:text-[#d2a8ff] hover:text-[#6639ba] hover:bg-[#f4ecff] dark:hover:bg-[#3c1e70]/20 p-1.5 rounded transition-colors text-xs font-medium" 
                            title="Promote to Admin"
                          >
                            <ArrowUpCircle className="w-4 h-4" /> Promote
                          </button>
                        )}
                        <button className="p-1.5 text-[#57606a] hover:text-[#24292f] dark:text-[#8b949e] dark:hover:text-[#c9d1d9] rounded hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <UsersIcon className="w-8 h-8 mx-auto text-[#57606a] dark:text-[#8b949e] mb-3 opacity-50" />
                      <p className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">No students found</p>
                      <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9] flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              Status Overview
            </h3>
            <div className="h-48 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#c9d1d9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{roleCounts.Total}</span>
                <span className="text-[10px] text-[#57606a] dark:text-[#8b949e] uppercase tracking-wider font-semibold">Total</span>
              </div>
            </div>
            
            <div className="space-y-2 mt-4 pt-4 border-t border-[#d0d7de] dark:border-[#30363d]">
              {statusData.map(stat => (
                <div key={stat.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }}></div>
                    <span className="text-[#57606a] dark:text-[#8b949e] font-medium">{stat.name}</span>
                  </div>
                  <span className="font-semibold text-[#24292f] dark:text-[#c9d1d9]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Promote Dialog */}
      <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              {selectedStudent?.role === 'Student' 
                ? 'Promote this graduated student to Instructor or Admin. This action will grant them elevated permissions.'
                : 'Promote this instructor to Admin. This action will grant them admin permissions.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9] mb-2 block">
              Select Role
            </label>
            <Select value={promoteToRole} onValueChange={setPromoteToRole}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedStudent?.role === 'Student' && (
                  <>
                    <SelectItem value="Instructor">Instructor</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </>
                )}
                {selectedStudent?.role === 'Instructor' && (
                  <SelectItem value="Admin">Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePromoteConfirm}>
              Confirm Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
