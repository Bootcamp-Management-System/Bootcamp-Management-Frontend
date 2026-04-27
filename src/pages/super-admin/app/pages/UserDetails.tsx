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

export function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [divisions, setDivisions] = useState([]);
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
    if (!window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await userService.deleteUser(user._id);
      toast.success(`${user.name} has been deleted successfully.`);
      navigate('/super-admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editForm.name || !editForm.email) {
      toast.error('Name and email are required');
      return;
    }
    
    try {
      await userService.updateUser(user._id, editForm);
      toast.success('User updated successfully');
      setIsEditOpen(false);
      fetchData();
    } catch (error) {
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
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error(error.response?.data?.message || 'Failed to promote user');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading user details...</div>;
  if (!user) return null;

  const userRole = user.role?.toLowerCase() || 'student';
  const displayRole = user.role === 'super-admin' ? 'Super Admin' : user.role;

  // Mock skills since they aren't directly in the schema yet, but are useful for UI showcase
  const mockSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Problem Solving'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/super-admin/users')}
            className="p-2 rounded-lg bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] text-[#57606a] dark:text-[#8b949e] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0969da] to-[#8250df] flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-white dark:ring-[#161b22]">
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#24292f] dark:text-[#c9d1d9]">{user.name || 'CSEC Member'}</h1>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm",
                  user.verified ? "bg-[#dafbe1] text-[#1a7f37] dark:bg-[#238636]/20 dark:text-[#3fb950] border-[#1a7f37]/20 dark:border-[#2ea043]/30" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                )}>
                  {user.verified ? 'Verified' : 'Pending'}
                </span>
                <button 
                  onClick={() => setIsEditOpen(true)}
                  className="p-1 text-[#57606a] hover:text-[#0969da] dark:text-[#8b949e] dark:hover:text-[#58a6ff] transition-colors"
                  title="Edit Profile"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-sm font-medium text-[#57606a] dark:text-[#8b949e]">
                  {userRole === 'admin' && <ShieldAlert className="w-4 h-4 text-[#cf222e] dark:text-[#f85149]" />}
                  {userRole === 'instructor' && <GraduationCap className="w-4 h-4 text-[#8250df] dark:text-[#d2a8ff]" />}
                  {userRole === 'student' && <BookOpen className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />}
                  <span className="capitalize">{displayRole}</span>
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
            className="flex items-center gap-2 px-4 py-2 bg-[#cf222e] hover:bg-[#a40e26] text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Promote to Admin
          </button>
          <button 
            onClick={() => {
              setPromoteForm(prev => ({ ...prev, role: 'instructor' }));
              setIsPromoteOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#8250df] hover:bg-[#6e3dc7] text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            Promote to Instructor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 uppercase tracking-wider">Profile Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-[#57606a] dark:text-[#8b949e] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9] font-mono">{user._id.substring(user._id.length - 8).toUpperCase()}</p>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e]">Member ID</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#57606a] dark:text-[#8b949e] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">{user.email}</p>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e]">Primary Email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-[#57606a] dark:text-[#8b949e] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e]">System Entry Date</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 uppercase tracking-wider">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {mockSkills.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ddf4ff] text-[#0969da] dark:bg-[#042f3a] dark:text-[#58a6ff] border border-[#0969da]/20">
                  <Code className="w-3 h-3" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#cf222e] dark:text-[#ff7b72] mb-4 uppercase tracking-wider">Danger Zone</h3>
            <div className="space-y-2">
              <div className="pt-2">
                <button 
                  onClick={handleDeleteUser}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#490202] border border-[#cf222e]/30 transition-colors text-sm font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete User Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Divisions & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9]">Division Memberships</h3>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {(user.memberships || []).map((membership, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] flex flex-col h-full relative overflow-hidden group hover:border-[#0969da] dark:hover:border-[#58a6ff] transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0969da] dark:bg-[#58a6ff]"></div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-[#24292f] dark:text-[#c9d1d9] pl-2">{membership.division?.name || 'Division'}</h4>
                    {membership.isInstructor && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f4ecff] text-[#8250df] border border-[#8250df]/20">
                        Instructor
                      </span>
                    )}
                  </div>
                  <div className="mt-auto pt-3 border-t border-[#d0d7de] dark:border-[#30363d] text-sm text-[#57606a] dark:text-[#8b949e]">
                    <p>{membership.isMember ? 'Verified Member' : 'Pending Member'}</p>
                  </div>
                </div>
              ))}
              {(!user.memberships || user.memberships.length === 0) && (
                <div className="p-4 rounded-xl border border-dashed border-[#d0d7de] dark:border-[#30363d] text-center text-[#57606a] dark:text-[#8b949e]">
                  No division memberships found
                </div>
              )}
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
