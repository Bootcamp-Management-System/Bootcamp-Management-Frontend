import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Mail, ShieldAlert, GraduationCap, ArrowUpCircle, UserPlus, BookOpen, BarChart3, MoreVertical, Users as MembersIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export const mockUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Student', divisions: ['Data Science', 'Development'], year: '2024', status: 'Active' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'Student', divisions: ['Cybersecurity'], year: '2025', status: 'Active' },
  { id: 3, name: 'Samuel Bekele', email: 'samuel.development@example.com', role: 'Admin', divisions: ['Development'], year: 'All', status: 'Active' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Instructor', divisions: ['Data Science'], year: '2024', status: 'Active' },
  { id: 5, name: 'Eve Adams', email: 'eve@example.com', role: 'Student', divisions: ['Development', 'CPD'], year: '2026', status: 'Graduated' },
  { id: 6, name: 'Frank White', email: 'frank@example.com', role: 'Student', divisions: ['Cybersecurity'], year: '2025', status: 'Suspended' },
  { id: 7, name: 'Grace Hopper', email: 'grace@example.com', role: 'Instructor', divisions: ['CPD', 'Data Science'], year: '2024', status: 'Active' },
  { id: 8, name: 'Ruth Tesfaye', email: 'ruth.cpd@example.com', role: 'Admin', divisions: ['CPD'], year: 'All', status: 'Active' },
  { id: 9, name: 'Michael Nuru', email: 'michael.cyber@example.com', role: 'Admin', divisions: ['Cybersecurity'], year: 'All', status: 'Active' },
  { id: 10, name: 'Selam Ayele', email: 'selam.datascience@example.com', role: 'Admin', divisions: ['Data Science'], year: 'All', status: 'Active' },
  { id: 11, name: 'Meron Desta', email: 'meron.member@example.com', role: 'Member', divisions: ['Development'], year: 'All', status: 'Active', isInstructor: false, isAdmin: false },
  { id: 12, name: 'Abel Tarekegn', email: 'abel.member@example.com', role: 'Member', divisions: ['Cybersecurity'], year: 'All', status: 'Active', isInstructor: false, isAdmin: false },
  { id: 13, name: 'Liya Solomon', email: 'liya.member@example.com', role: 'Member', divisions: ['Data Science'], year: 'All', status: 'Active', isInstructor: false, isAdmin: false },
  { id: 14, name: 'Hana Bekele', email: 'hana.member@example.com', role: 'Member', divisions: ['CPD'], year: 'All', status: 'Suspended', isInstructor: false, isAdmin: false },
];

const USERS_STORAGE_KEY = 'super_admin_users';

const statusData = [
  { name: 'Active', value: 850, color: '#238636' },
  { name: 'Graduated', value: 420, color: '#0969da' },
  { name: 'Suspended', value: 14, color: '#cf222e' },
];

const divisionOptions = ['All Divisions', 'CPD', 'Data Science', 'Cybersecurity', 'Development'];
const statusOptions = ['All Statuses', 'Active', 'Suspended', 'Graduated'];

const belongsToTab = (user, tab) => {
  if (tab === 'Member') return user.role === 'Member';
  if (tab === 'Student') return user.role === 'Student';
  if (tab === 'Instructor') return user.role === 'Instructor' || user.isInstructor || user.isAdmin;
  if (tab === 'Admin') return user.role === 'Admin' || user.isAdmin;
  return false;
};

export function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : mockUsers;
  });
  const [activeTab, setActiveTab] = useState('Member');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    divisions: 'Development',
    year: '2026',
    department: '',
    campusId: '',
    phone: '',
    status: 'Active',
  });

  const syncUsers = (nextUsers) => {
    setUsers(nextUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const roleCounts = users.reduce(
    (counts, user) => {
      if (belongsToTab(user, 'Member')) counts.Member += 1;
      if (belongsToTab(user, 'Student')) counts.Student += 1;
      if (belongsToTab(user, 'Instructor')) counts.Instructor += 1;
      if (belongsToTab(user, 'Admin')) counts.Admin += 1;
      return counts;
    },
    { Member: 0, Student: 0, Instructor: 0, Admin: 0 }
  );

  const filteredUsers = users.filter(u => 
    belongsToTab(u, activeTab) &&
    (selectedDivision === 'All Divisions' || u.divisions.includes(selectedDivision)) &&
    (selectedStatus === 'All Statuses' || u.status === selectedStatus) &&
    (selectedYear === 'All' || u.year === selectedYear || u.year === 'All') &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePromoteInstructor = (event, user) => {
    event.stopPropagation();
    const nextUsers = users.map((currentUser) =>
        currentUser.id === user.id ? { ...currentUser, isAdmin: true, year: 'All' } : currentUser
    );
    syncUsers(nextUsers);
    toast.success(`${user.name} now has Admin access for ${user.divisions[0]} and remains listed as Instructor.`);
  };

  const handlePromoteMember = (event, user) => {
    event.stopPropagation();
    const nextUsers = users.map((currentUser) =>
        currentUser.id === user.id ? { ...currentUser, isInstructor: true } : currentUser
    );
    syncUsers(nextUsers);
    toast.success(`${user.name} now has Instructor access for ${user.divisions[0]} and remains listed as Member.`);
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.department) {
      toast.error('Please fill name, email, and department before saving.');
      return;
    }

    const createdMember = {
      id: Date.now(),
      name: newMember.name,
      email: newMember.email,
      role: 'Member',
      divisions: [newMember.divisions],
      year: newMember.year,
      department: newMember.department,
      campusId: newMember.campusId || `CSEC/ASTU/${Date.now().toString().slice(-4)}`,
      phone: newMember.phone || '+251 900 000 000',
      status: newMember.status,
      isInstructor: false,
      isAdmin: false,
    };

    const nextUsers = [createdMember, ...users];
    syncUsers(nextUsers);
    setIsAddMemberOpen(false);
    setNewMember({
      name: '',
      email: '',
      divisions: 'Development',
      year: '2026',
      department: '',
      campusId: '',
      phone: '',
      status: 'Active',
    });
    setActiveTab('Member');
    toast.success(`${createdMember.name} has been added as a CSEC member.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">Users Directory</h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">Manage CSEC members, bootcamp students, instructors, and division admins across the system.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] rounded-md text-sm font-medium transition-colors shadow-sm">
            <Mail className="w-4 h-4" />
            Invite Admin
          </button>
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add CSEC Member
          </button>
        </div>
      </div>

      {/* Top Statistic Cards acting as Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { role: 'Member', label: 'CSEC Members', count: roleCounts.Member, icon: MembersIcon, color: 'border-[#0a7ea4] dark:border-[#56d4ff]', bg: 'bg-[#ddf4ff] dark:bg-[#042f3a]', text: 'text-[#0a7ea4] dark:text-[#56d4ff]' },
          { role: 'Student', label: 'Total Students', count: roleCounts.Student, icon: BookOpen, color: 'border-[#0969da] dark:border-[#58a6ff]', bg: 'bg-[#ddf4ff] dark:bg-[#051d4d]', text: 'text-[#0969da] dark:text-[#58a6ff]' },
          { role: 'Instructor', label: 'Total Instructors', count: roleCounts.Instructor, icon: GraduationCap, color: 'border-[#8250df] dark:border-[#d2a8ff]', bg: 'bg-[#f4ecff] dark:bg-[#3c1e70]', text: 'text-[#8250df] dark:text-[#d2a8ff]' },
          { role: 'Admin', label: 'Division Admins', count: roleCounts.Admin, icon: ShieldAlert, color: 'border-[#cf222e] dark:border-[#ff7b72]', bg: 'bg-[#ffebe9] dark:bg-[#490202]', text: 'text-[#cf222e] dark:text-[#ff7b72]' }
        ].map((stat) => (
          <div 
            key={stat.role}
            onClick={() => setActiveTab(stat.role)}
            className={cn(
              "bg-white dark:bg-[#161b22] border rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden",
              activeTab === stat.role ? `border-2 ${stat.color}` : "border-[#d0d7de] dark:border-[#30363d] hover:border-[#8b949e]"
            )}
          >
            {activeTab === stat.role && (
              <div className={cn("absolute top-0 left-0 w-1 h-full", stat.bg)}></div>
            )}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#57606a] dark:text-[#8b949e] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{stat.count}</h3>
              </div>
              <div className={cn("p-2.5 rounded-lg", stat.bg, stat.text)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            {activeTab === stat.role && (
              <div className="mt-4 flex items-center text-xs font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Viewing {stat.role.toLowerCase()}s <ArrowUpCircle className="w-3.5 h-3.5 ml-1.5 opacity-50 rotate-45" />
              </div>
            )}
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
                placeholder={activeTab === 'Member' ? 'Search members...' : `Search ${activeTab.toLowerCase()}s...`}
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
                {divisionOptions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] appearance-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
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
                  <th className="px-6 py-3 font-medium">{activeTab === 'Member' ? 'CSEC Division' : 'Assigned Divisions'}</th>
                  <th className="px-6 py-3 font-medium">Year</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d0d7de] dark:divide-[#30363d]">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors cursor-pointer"
                    onClick={(e) => {
                      // Prevent navigation if clicking actions
                      if ((e.target as HTMLElement).closest('.actions-cell')) return;
                      navigate(`/super-admin/users/${user.id}`);
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
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {user.divisions.map(div => (
                          <span key={div} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f6f8fa] dark:bg-[#30363d] text-[#57606a] dark:text-[#c9d1d9] border border-[#d0d7de] dark:border-[#4b5563]">
                            {div}
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
                        {user.role === 'Member' && !user.isInstructor && (
                          <button 
                            onClick={(event) => handlePromoteMember(event, user)}
                            className="flex items-center gap-1 text-[#0969da] dark:text-[#58a6ff] hover:text-[#0550ae] hover:bg-[#ddf4ff] dark:hover:bg-[#051d4d] p-1.5 rounded transition-colors text-xs font-medium" 
                            title="Promote to Instructor"
                          >
                            <ArrowUpCircle className="w-4 h-4" /> Promote to Instructor
                          </button>
                        )}
                        {(user.role === 'Instructor' || user.isInstructor) && !user.isAdmin && (
                          <button 
                            onClick={(event) => handlePromoteInstructor(event, user)}
                            className="flex items-center gap-1 text-[#1a7f37] dark:text-[#3fb950] hover:text-[#2ea043] hover:bg-[#dafbe1] dark:hover:bg-[#238636]/20 p-1.5 rounded transition-colors text-xs font-medium" 
                            title="Promote to Admin"
                          >
                            <ArrowUpCircle className="w-4 h-4" /> Promote to Admin
                          </button>
                        )}
                        <button className="p-1.5 text-[#57606a] hover:text-[#24292f] dark:text-[#8b949e] dark:hover:text-[#c9d1d9] rounded hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Users className="w-8 h-8 mx-auto text-[#57606a] dark:text-[#8b949e] mb-3 opacity-50" />
                      <p className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">No {activeTab.toLowerCase()}s found</p>
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
              System Status Overview
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
                <span className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">1,284</span>
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
          
          <div className="bg-gradient-to-br from-[#0969da] to-[#8250df] rounded-xl p-5 shadow-sm text-white">
            <h3 className="font-semibold text-lg mb-2">Need to export data?</h3>
            <p className="text-sm text-white/80 mb-4">You can download the full user directory as a CSV file for external reporting.</p>
            <button className="w-full py-2 bg-white text-[#0969da] rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors shadow-sm">
              Export Directory
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add CSEC Member</DialogTitle>
            <DialogDescription>
              Create a new CSEC ASTU member profile before they are enrolled into any bootcamp.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="member-name">Full Name</Label>
              <Input id="member-name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Abebe Kebede" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Email</Label>
              <Input id="member-email" type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} placeholder="member@astu.edu.et" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-division">Division</Label>
              <select id="member-division" value={newMember.divisions} onChange={(e) => setNewMember({ ...newMember, divisions: e.target.value })} className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9]">
                {divisionOptions.filter((division) => division !== 'All Divisions').map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-year">Year</Label>
              <select id="member-year" value={newMember.year} onChange={(e) => setNewMember({ ...newMember, year: e.target.value })} className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9]">
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-department">Department</Label>
              <Input id="member-department" value={newMember.department} onChange={(e) => setNewMember({ ...newMember, department: e.target.value })} placeholder="Software Engineering" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-campus-id">Campus ID</Label>
              <Input id="member-campus-id" value={newMember.campusId} onChange={(e) => setNewMember({ ...newMember, campusId: e.target.value })} placeholder="CSEC/ASTU/1024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-phone">Phone</Label>
              <Input id="member-phone" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} placeholder="+251 911 000 000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-status">Status</Label>
              <select id="member-status" value={newMember.status} onChange={(e) => setNewMember({ ...newMember, status: e.target.value })} className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9]">
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Save Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
