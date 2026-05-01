import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, CalendarDays, ShieldAlert, BookOpen, GraduationCap, CheckCircle2, Clock, Trash2, KeyRound, Edit, Users as MembersIcon, ArrowUpCircle, Hash, Code } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { userService } from '../../../../services/userService';
import { divisionService } from '../../../../services/divisionService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
  skills?: string[];
  memberships?: Array<{
    division: {
      name: string;
      _id: string;
    };
    isInstructor: boolean;
    isMember: boolean;
  }>;
}

interface Division {
  _id: string;
  name: string;
}

export function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  // Promote State
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [promoteForm, setPromoteForm] = useState({ role: 'admin', divisionId: '', reason: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, divRes] = await Promise.all([
        userService.getUserById(id),
        divisionService.getDivisions()
      ]);
      setUser(userRes.data);
      setEditForm({ name: userRes.data.name || '', email: userRes.data.email || '' });
      setDivisions(divRes.data || []);
      if (divRes.data && divRes.data.length > 0) {
        setPromoteForm(prev => ({ ...prev, divisionId: divRes.data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('User not found');
      navigate('/super-admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    if (!window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await userService.deleteUser(user._id);
      toast.success(`${user.name} has been deleted successfully.`);
      navigate('/super-admin/users');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editForm.name || !editForm.email) {
      toast.error('Name and email are required');
      return;
    }
    
    if (!user) return;
    try {
      await userService.updateUser(user._id, editForm);
      toast.success('User updated successfully');
      setIsEditOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handlePromoteUser = async () => {
    if (!promoteForm.divisionId) {
      toast.error('Please select a division');
      return;
    }
    if (!promoteForm.reason) {
      toast.error('Please provide a reason for promotion');
      return;
    }

    if (!user) return;
    try {
      const response = await userService.promoteUser(user._id, {
        newRole: promoteForm.role,
        divisionId: promoteForm.divisionId,
        reason: promoteForm.reason
      });
      
      let successMsg = `${user.name} has been successfully promoted to ${promoteForm.role}.`;
      if (response && response.tempPassword) {
        successMsg += `\nTemporary Password: ${response.tempPassword}`;
      }
      
      toast.success(successMsg, { duration: 6000 });
      setIsPromoteOpen(false);
      setPromoteForm({ ...promoteForm, reason: '' });
      fetchData();
    } catch (error: any) {
      console.error('Error promoting user:', error);
      toast.error(error.response?.data?.message || 'Failed to promote user');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading user details...</div>;
  if (!user) return null;

  const userRole = user.role?.toLowerCase() || 'student';
  const displayRole = user.role === 'super-admin' ? 'Super Admin' : user.role;

  // User skills mapping
  const userSkills = user.skills && user.skills.length > 0 ? user.skills : [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-portal-border pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/super-admin/users')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-portal-card border border-portal-border hover:bg-portal-accent/10 hover:border-portal-accent/50 text-portal-text-muted hover:text-portal-accent transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-portal-accent to-purple-500 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-portal-bg">
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-black text-portal-text tracking-tight">{user.name || 'CSEC Member'}</h1>
                <span className={cn(
                  "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                  user.verified ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                )}>
                  {user.verified ? 'Verified' : 'Pending'}
                </span>
                <button 
                  onClick={() => setIsEditOpen(true)}
                  className="p-2 rounded-xl bg-portal-card border border-portal-border text-portal-text-muted hover:text-portal-accent transition-all"
                  title="Edit Profile"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-2 px-3 py-1 bg-portal-accent/10 text-portal-accent rounded-lg text-xs font-black uppercase tracking-widest">
                  {userRole === 'admin' && <ShieldAlert className="w-4 h-4" />}
                  {userRole === 'instructor' && <GraduationCap className="w-4 h-4" />}
                  {userRole === 'student' && <BookOpen className="w-4 h-4" />}
                  {displayRole}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Right Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setPromoteForm(prev => ({ ...prev, role: 'admin' }));
              setIsPromoteOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/10 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            Promote to Admin
          </button>
          <button 
            onClick={() => {
              setPromoteForm(prev => ({ ...prev, role: 'instructor' }));
              setIsPromoteOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-portal-accent/10 hover:bg-portal-accent text-portal-accent hover:text-white border border-portal-accent/20 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-portal-accent/10 transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            Promote to Instructor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Actions */}
        <div className="space-y-8">
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm relative overflow-hidden group">
            <h3 className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-6">Profile Intelligence</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-portal-bg border border-portal-border flex items-center justify-center text-portal-text-muted">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-portal-text font-mono tracking-tighter">{user._id.substring(user._id.length - 12).toUpperCase()}</p>
                  <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mt-1">System ID</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-portal-bg border border-portal-border flex items-center justify-center text-portal-text-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-portal-text">{user.email}</p>
                  <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mt-1">Primary Endpoint</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-portal-bg border border-portal-border flex items-center justify-center text-portal-text-muted">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-portal-text">{new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mt-1">Creation Date</p>
                </div>
              </div>
            </div>
            
            <Hash className="absolute -right-8 -bottom-8 w-32 h-32 text-portal-text/5 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-6">Technical Arsenal</h3>
            <div className="flex flex-wrap gap-2">
              {userSkills.length > 0 ? (
                userSkills.map((skill: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-portal-bg border border-portal-border text-portal-accent">
                    <Code className="w-3 h-3" />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs font-bold text-portal-text-muted uppercase tracking-widest italic">No classified skills found</p>
              )}
            </div>
          </div>

          <div className="bg-portal-card border border-red-500/20 rounded-3xl p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Termination Protocol
            </h3>
            <p className="text-xs font-medium text-portal-text-muted mb-6 leading-relaxed">Deleting this account will permanently erase all associated data, logs, and memberships from the central database.</p>
            <button 
              onClick={handleDeleteUser}
              className="w-full py-3 rounded-xl text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Execute Deletion
            </button>
          </div>
        </div>

        {/* Right Column: Divisions & Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-portal-text uppercase tracking-widest">Division Attachments</h3>
              <div className="w-10 h-10 rounded-xl bg-portal-accent/10 flex items-center justify-center text-portal-accent">
                <MembersIcon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {(user.memberships || []).map((membership: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border border-portal-border bg-portal-bg hover:border-portal-accent transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <h4 className="text-lg font-black text-portal-text group-hover:text-portal-accent transition-colors tracking-tight">{membership.division?.name || 'Division'}</h4>
                    {membership.isInstructor && (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-500 border border-purple-500/20">
                        Instructor
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-portal-border/50 relative z-10">
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest">{membership.isMember ? 'Verified Member' : 'Pending Verification'}</p>
                    <div className={cn("w-2 h-2 rounded-full", membership.isMember ? 'bg-emerald-500' : 'bg-orange-500')} />
                  </div>
                  
                  <MembersIcon className="absolute -right-4 -bottom-4 w-20 h-20 text-portal-text/5 -rotate-12 group-hover:scale-110 transition-transform" />
                </div>
              ))}
              {(!user.memberships || user.memberships.length === 0) && (
                <div className="sm:col-span-2 p-12 rounded-3xl border-2 border-dashed border-portal-border text-center">
                  <MembersIcon className="w-12 h-12 mx-auto text-portal-text/10 mb-4" />
                  <p className="text-sm font-black text-portal-text-muted uppercase tracking-widest">No Active Attachments</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Activity Log Placeholder */}
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-8">System Activity Logs</h3>
            <div className="space-y-6">
              {[
                { event: 'Security Profile Updated', date: '2 days ago', type: 'ADMIN' },
                { event: 'Joined Development Division', date: '5 days ago', type: 'SYSTEM' },
                { event: 'Initial Verification Completed', date: '1 week ago', type: 'SECURITY' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-portal-accent group-hover:scale-150 transition-transform" />
                    <div>
                      <p className="text-sm font-bold text-portal-text">{log.event}</p>
                      <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mt-1">{log.date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-portal-bg border border-portal-border text-[9px] font-black text-portal-text-muted uppercase tracking-tighter">{log.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update basic user information here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={editForm.name} 
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={editForm.email} 
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promote User Dialog */}
      <Dialog open={isPromoteOpen} onOpenChange={setIsPromoteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Promote to {promoteForm.role === 'admin' ? 'Division Admin' : 'Instructor'}</DialogTitle>
            <DialogDescription>
              Assign this user as an {promoteForm.role} for a specific division.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Role is pre-selected by the button clicked */}
            <div className="space-y-2">
              <Label>Target Division</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                value={promoteForm.divisionId}
                onChange={(e) => setPromoteForm(prev => ({ ...prev, divisionId: e.target.value }))}
              >
                {divisions.map(div => (
                  <option key={div._id} value={div._id}>{div.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Promotion</Label>
              <textarea 
                id="reason"
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                placeholder="Briefly describe why this user is being promoted..."
                value={promoteForm.reason}
                onChange={(e) => setPromoteForm(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoteOpen(false)}>Cancel</Button>
            <Button onClick={handlePromoteUser} className="bg-[#2ea043] hover:bg-[#2c974b] text-white">Confirm Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
