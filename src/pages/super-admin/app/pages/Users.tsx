import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Mail, ShieldAlert, GraduationCap, ArrowUpCircle, ArrowDownCircle, UserPlus, BookOpen, BarChart3, MoreVertical, Users as MembersIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { userService } from '../../../../services/userService';
import { divisionService } from '../../../../services/divisionService';


export function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const [users, setUsers] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Member');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Promotion Dialog State
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [promotionTarget, setPromotionTarget] = useState<any>(null);
  const [promoteToRole, setPromoteToRole] = useState('admin');
  const [targetDivisionId, setTargetDivisionId] = useState('');

  // Demotion Dialog State
  const [isDemoteOpen, setIsDemoteOpen] = useState(false);
  const [demotionTarget, setDemotionTarget] = useState<any>(null);
  const [demoteToRole, setDemoteToRole] = useState('instructor');

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    divisions: [] as string[],
    year: '2026',
    department: '',
    campusId: '',
    phone: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, divisionsRes] = await Promise.all([
        userService.getUsers(),
        divisionService.getDivisions()
      ]);
      setUsers(usersRes.data || []);
      setDivisions(divisionsRes.data || []);
      setError(null);
      
      if (divisionsRes.data?.length > 0) {
        setTargetDivisionId(divisionsRes.data[0]._id);
        setNewMember(prev => ({ ...prev, divisions: [divisionsRes.data[0]._id] }));
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Failed to load users or divisions. Please verify your connection or session.');
      toast.error('Failed to load users or divisions');
    } finally {
      setLoading(false);
    }
  };

  const belongsToTab = (user: any, tab: string) => {
    const role = user.role?.toLowerCase();
    if (tab === 'Member') return role === 'student' || user.is_Member;
    if (tab === 'Student') return role === 'student';
    if (tab === 'Instructor') return role === 'instructor';
    if (tab === 'Admin') return role === 'admin';
    return false;
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

  const statusData = [
    { name: 'Verified', value: users.filter(u => u.verified).length, color: '#238636' },
    { name: 'Pending', value: users.filter(u => !u.verified).length, color: '#0969da' },
  ];

  const filteredUsers = users.filter(u => {
    const roleMatch = belongsToTab(u, activeTab);
    
    // Check division match
    let divMatch = true;
    if (selectedDivision !== 'All Divisions') {
      const userDivIds = u.memberships?.map((m: any) => m.division?._id || m.division) || [];
      if (u.division?._id) userDivIds.push(u.division._id);
      divMatch = userDivIds.includes(selectedDivision);
    }

    const statusMatch = selectedStatus === 'All Statuses' || u.status === selectedStatus;
    const yearMatch = selectedYear === 'All' || u.year === selectedYear || u.year === 'All';
    const searchMatch = !searchQuery || (
      (u.name?.toLowerCase()?.includes(searchQuery.toLowerCase())) || 
      (u.email?.toLowerCase()?.includes(searchQuery.toLowerCase()))
    );

    return roleMatch && divMatch && statusMatch && yearMatch && searchMatch;
  });

  const handlePromoteAction = (event: React.MouseEvent, user: any, role: string | null = null) => {
    event.stopPropagation();
    setPromotionTarget(user);
    if (role) {
      setPromoteToRole(role);
    } else {
      // Fallback logic
      if (user.role === 'instructor') {
        setPromoteToRole('admin');
      } else {
        setPromoteToRole('instructor');
      }
    }
    setIsPromoteOpen(true);
  };

  const confirmPromotion = async () => {
    if (!promotionTarget) return;
    
    try {
      const payload = {
        newRole: promoteToRole,
        divisionId: targetDivisionId,
        reason: `Promoted via Super Admin Dashboard`
      };
      
      const result = await userService.promoteUser(promotionTarget._id, payload);
      toast.success(result.message || `User promoted to ${promoteToRole} successfully!`);
      
      if (result.tempPassword) {
        toast.info(`Temporary Password: ${result.tempPassword}`, { duration: 10000 });
      }
      
      setIsPromoteOpen(false);
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Promotion failed');
    }
  };

  const handleDemoteAction = (event: React.MouseEvent, user: any, role: string | null = null) => {
    event.stopPropagation();
    setDemotionTarget(user);
    if (role) {
      setDemoteToRole(role);
    } else {
      // Default demotion logic
      if (user.role === 'admin') {
        setDemoteToRole('instructor');
      } else if (user.role === 'instructor') {
        setDemoteToRole('student');
      }
    }
    setIsDemoteOpen(true);
  };

  const confirmDemotion = async () => {
    if (!demotionTarget) return;

    try {
      const payload = {
        newRole: demoteToRole,
        reason: `Demoted via Super Admin Dashboard`
      };

      const result = await userService.demoteUser(demotionTarget._id, payload);
      toast.success(result.message || `User demoted to ${demoteToRole} successfully!`);

      setIsDemoteOpen(false);
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Demotion failed');
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      toast.error('Please fill name and email before saving.');
      return;
    }

    try {
      await userService.createUser({
        name: newMember.name,
        email: newMember.email,
        divisions: newMember.divisions,
        role: 'student',
        is_Member: true
      });
      
      toast.success(`${newMember.name} has been added as a member.`);
      setIsAddMemberOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-portal-text tracking-tight">Users Directory</h1>
          <p className="text-portal-text-muted mt-1">Orchestrate system-wide access, roles, and memberships.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-portal-accent hover:bg-portal-accent-hover text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-portal-accent/20"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Top Statistic Cards acting as Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { role: 'Member', label: 'CSEC Members', count: roleCounts.Member, icon: MembersIcon, accent: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
          { role: 'Student', label: 'Total Students', count: roleCounts.Student, icon: BookOpen, accent: 'border-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
          { role: 'Instructor', label: 'Total Instructors', count: roleCounts.Instructor, icon: GraduationCap, accent: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-500' },
          { role: 'Admin', label: 'Division Admins', count: roleCounts.Admin, icon: ShieldAlert, accent: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-500' }
        ].map((stat) => (
          <div 
            key={stat.role}
            onClick={() => setActiveTab(stat.role)}
            className={cn(
              "bg-portal-card border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group",
              activeTab === stat.role ? `border-2 ${stat.accent}` : "border-portal-border hover:border-portal-accent/50"
            )}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-4xl font-black text-portal-text">{stat.count}</h3>
              </div>
              <div className={cn("p-3 rounded-xl", stat.bg, stat.text)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            {/* Background Decorative Icon */}
            <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-portal-text/5 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main List Section */}
        <div className="lg:col-span-3 bg-portal-card border border-portal-border rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
          {/* List Header & Filters */}
          <div className="p-4 border-b border-portal-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-portal-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="relative w-full sm:w-80 group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
              <input 
                type="text" 
                placeholder={activeTab === 'Member' ? 'Search members...' : `Search ${activeTab.toLowerCase()}s...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 text-sm bg-portal-input border border-portal-border rounded-xl focus:outline-none focus:border-portal-accent text-portal-text transition-all"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-3 py-2 bg-portal-input border border-portal-border rounded-xl">
                <Filter className="w-4 h-4 text-portal-text-muted" />
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="bg-transparent text-xs font-black text-portal-text-muted uppercase tracking-widest focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="All Divisions">All Divisions</option>
                  {divisions.map((div) => (
                    <option key={div._id} value={div._id}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-portal-border">
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-widest">Identiy</th>
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-widest">Division</th>
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-widest">Role</th>
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-portal-text-muted uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-portal-border/50">
                {loading ? (
                   <tr><td colSpan={5} className="px-8 py-20 text-center"><div className="w-8 h-8 border-2 border-portal-accent border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                ) : filteredUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-portal-bg transition-colors cursor-pointer group"
                    onClick={() => navigate(`/super-admin/users/${user._id}`)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center font-black text-portal-accent shadow-sm group-hover:scale-110 transition-transform">
                          {user.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-portal-text group-hover:text-portal-accent transition-colors">{user.name}</span>
                          <span className="text-xs text-portal-text-muted">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-bold text-portal-text-muted uppercase tracking-wider">
                         {user.division?.name || user.memberships?.[0]?.division?.name || 'Unassigned'}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="capitalize text-[10px] font-black px-3 py-1 rounded-full bg-portal-bg border border-portal-border text-portal-text-muted group-hover:text-portal-text transition-colors">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        user.verified ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      )}>
                        {user.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.role === 'student' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={(event) => handlePromoteAction(event, user, 'admin')}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Promote to Admin"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(event) => handlePromoteAction(event, user, 'instructor')}
                              className="p-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all shadow-sm"
                              title="Promote to Instructor"
                            >
                              <GraduationCap className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {user.role === 'admin' && (
                          <button 
                            onClick={(event) => handleDemoteAction(event, user, 'instructor')}
                            className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                            title="Demote to Instructor"
                          >
                            <ArrowDownCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-portal-text-muted hover:text-portal-text rounded-lg hover:bg-portal-bg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-portal-text uppercase tracking-widest flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-portal-accent" />
              Verification Status
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
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--portal-card)', 
                      borderColor: 'var(--portal-border)', 
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'var(--portal-text)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-portal-text">{users.length}</span>
                <span className="text-[10px] text-portal-text-muted uppercase tracking-widest font-black">Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Dialog */}
      <Dialog open={isPromoteOpen} onOpenChange={setIsPromoteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Promote User</DialogTitle>
            <DialogDescription>
              Elevate {promotionTarget?.name} to a new role in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select New Role</Label>
              <select 
                value={promoteToRole} 
                onChange={(e) => setPromoteToRole(e.target.value)}
                className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm"
              >
                <option value="instructor">Instructor</option>
                <option value="admin">Division Admin</option>
              </select>
            </div>
            
            { (promoteToRole === 'admin' || promoteToRole === 'instructor') && (
              <div className="space-y-2">
                <Label>Assign to Division</Label>
                <select 
                  value={targetDivisionId} 
                  onChange={(e) => setTargetDivisionId(e.target.value)}
                  className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select a division...</option>
                  {divisions.map(div => (
                    <option key={div._id} value={div._id}>{div.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoteOpen(false)}>Cancel</Button>
            <Button onClick={confirmPromotion} className="bg-portal-accent text-portal-bg">Confirm Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Demotion Dialog */}
      <Dialog open={isDemoteOpen} onOpenChange={setIsDemoteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Demote User</DialogTitle>
            <DialogDescription>
              Reduce {demotionTarget?.name}'s role in the system. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select New Role</Label>
              <select
                value={demoteToRole}
                onChange={(e) => setDemoteToRole(e.target.value)}
                className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm"
              >
                {demotionTarget?.role === 'admin' && <option value="instructor">Instructor</option>}
                {demotionTarget?.role === 'instructor' && <option value="student">Student</option>}
                {demotionTarget?.role === 'admin' && <option value="student">Student (Direct)</option>}
              </select>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> Demoting this user will remove their elevated privileges.
                {demotionTarget?.role === 'admin' && demoteToRole === 'instructor' && ' They will retain instructor privileges in their assigned division.'}
                {demotionTarget?.role === 'instructor' && ' They will lose all instructor privileges and become a regular student.'}
                {demotionTarget?.role === 'admin' && demoteToRole === 'student' && ' They will lose all admin and instructor privileges.'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDemoteOpen(false)}>Cancel</Button>
            <Button onClick={confirmDemotion} className="bg-red-600 hover:bg-red-700 text-white">Confirm Demotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add CSEC Member</DialogTitle>
            <DialogDescription>
              Create a new CSEC ASTU member profile.
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
            <div className="space-y-3 sm:col-span-2">
              <Label className="text-[#24292f] dark:text-[#c9d1d9]">Assign to Divisions</Label>
              <div className="max-h-48 overflow-y-auto border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] rounded-md divide-y divide-[#d0d7de] dark:divide-[#30363d] shadow-sm custom-scrollbar">
                {divisions.map((division) => (
                  <label 
                    key={division._id} 
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f6f8fa] dark:hover:bg-[#161b22] cursor-pointer transition-colors group"
                  >
                    <input 
                      type="checkbox"
                      checked={newMember.divisions.includes(division._id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNewMember(prev => ({
                          ...prev,
                          divisions: checked 
                            ? [...prev.divisions, division._id]
                            : prev.divisions.filter(id => id !== division._id)
                        }));
                      }}
                      className="w-4 h-4 rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da] focus:ring-[#0969da] bg-transparent"
                    />
                    <span className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff]">
                      {division.name}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-[10px] text-[#57606a] dark:text-[#8b949e] italic">
                Selected: {newMember.divisions.length} division(s)
              </p>
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
