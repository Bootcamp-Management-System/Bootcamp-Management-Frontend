import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { 
  Users, 
  UserPlus, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  IdCard,
  Layers,
  Eye,
  Calendar,
  Clock,
  Briefcase,
  ArrowUpRight
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { divisionService } from '../../services/divisionService';
import { userService } from '../../services/userService';

export const AdminMembersPage = () => {
  const { user: admin, selectedDivision } = useAuth();
  const [divisions, setDivisions] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const adminDivisionId = admin?.division?._id || admin?.division || '';
  const adminDivisionName =
    divisions.find((division) => division._id === adminDivisionId || division.id === adminDivisionId)?.name ||
    (typeof admin?.division === 'object' ? admin.division.name : null) ||
    'All';
  const currentDivision = adminDivisionName;
  
  const [members, setMembers] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [infoMember, setInfoMember] = useState(null);

  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [promoteToRole, setPromoteToRole] = useState('instructor');
  const [isPromoting, setIsPromoting] = useState(false);
  const [promoteError, setPromoteError] = useState('');
  const [promoteSuccess, setPromoteSuccess] = useState(null);

  const buildDisplayUser = (user) => {
    const email = user?.email || '';
    const nameSource = user?.name || email.split('@')[0] || 'User';
    const cleanName = nameSource.replace(/[._-]+/g, ' ').trim();
    const prettyName = cleanName ? `${cleanName.charAt(0).toUpperCase()}${cleanName.slice(1)}` : 'User';
    let divisionName = user?.division?.name || user?.division || 'Unassigned';
    const divisionObj = divisions.find(d => d._id === divisionName || d.id === divisionName);
    if (divisionObj) {
      divisionName = divisionObj.name;
    }

    const divisionId = user?.division?._id || user?.division || '';

    const assignedNames = Array.isArray(user?.assignedDivisions)
      ? user.assignedDivisions.map((div) => {
          const idOrName = div?.name || div;
          const divObj = divisions.find(d => d._id === idOrName || d.id === idOrName);
          return divObj ? divObj.name : idOrName;
        }).filter(Boolean)
      : [];

    return {
      id: user?._id || user?.id || email,
      name: prettyName,
      email,
      role: user?.role === 'student' ? 'member' : user?.role,
      division: divisionName,
      divisionId,
      divisions: divisionName ? [divisionName] : [],
      assignedDivisions: assignedNames,
      status: user?.verified ? 'Active' : 'Pending',
      attendance: 'N/A',
      idNo: user?.campusId || user?.idNo || (user?._id ? user._id.slice(-6).toUpperCase() : 'N/A'),
    };
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    setLoadError('');
    try {
      const response = await userService.getUsers();
      const userData = response?.data || response?.data?.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      setUsers([]);
      setLoadError(error?.response?.data?.message || error?.message || 'Failed to load users.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    const loadDivisions = async () => {
      try {
        const response = await divisionService.getDivisions();
        const divisionData = response?.data || response?.data?.data || [];
        setDivisions(Array.isArray(divisionData) ? divisionData : []);
      } catch {
        setDivisions([]);
      }
    };

    loadDivisions();
    loadUsers();
  }, []);

  React.useEffect(() => {
    const filtered = users
      .filter((user) => user?.role === 'student')
      .map(buildDisplayUser)
      .filter((user) => 
        currentDivision === 'All' || 
        user.division === currentDivision ||
        (user.assignedDivisions && user.assignedDivisions.includes(currentDivision))
      );
    setMembers(filtered);
  }, [currentDivision, users]);

  const resolveDivisionId = (divisionValue) => {
    if (!divisionValue) return null;
    const matchById = divisions.find((division) => division._id === divisionValue || division.id === divisionValue);
    if (matchById) return matchById._id || matchById.id;
    const matchByName = divisions.find((division) => division.name === divisionValue);
    return matchByName ? matchByName._id || matchByName.id : null;
  };

  const isSuperAdmin = admin?.role === 'super_admin' || admin?.role === 'super-admin';

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    setCreatedCredentials(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const role = String(form.get('role') || 'student').trim();
    const selectedDivisionValue = form.get('division');

    if (!email) {
      setFormError('Email is required.');
      setIsSubmitting(false);
      return;
    }

    const divisionId = adminDivisionId;

    try {
      const response = await userService.createUser({
        email,
        role,
        division: divisionId || undefined,
      });

      setCreatedCredentials({ email, tempPassword: response?.tempPassword || '' });
      await loadUsers();
    } catch (error) {
      setFormError(error?.response?.data?.message || error?.message || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromoteUser = async (event) => {
    event.preventDefault();
    setPromoteError('');
    setIsPromoting(true);
    setPromoteSuccess(null);

    const form = new FormData(event.currentTarget);
    const reason = String(form.get('reason') || '').trim();
    const selectedDivisionValue = form.get('division');

    const divisionId = adminDivisionId;

    if (!infoMember?.id) {
      setPromoteError('No member selected.');
      setIsPromoting(false);
      return;
    }

    try {
      const response = await userService.promoteUser(infoMember.id, {
        newRole: promoteToRole,
        divisionId: promoteToRole === 'admin' ? selectedDivisionValue : divisionId,
        reason,
      });

      setPromoteSuccess({ tempPassword: response?.tempPassword || '' });
      await loadUsers();
      
      // Close automatically only if there's no temp password to show
      if (!response?.tempPassword) {
        setTimeout(() => {
          setIsPromoteModalOpen(false);
          setIsInfoModalOpen(false);
        }, 1500);
      }
    } catch (error) {
      setPromoteError(error?.response?.data?.message || error?.message || 'Failed to promote member.');
    } finally {
      setIsPromoting(false);
    }
  };

  const handleDivisionChange = async (member, divisionValue) => {
    const divisionId = resolveDivisionId(divisionValue);
    if (!divisionId) return;

    try {
      await userService.updateUser(member.id, { division: divisionId });
      await loadUsers();
    } catch (error) {
      setLoadError(error?.response?.data?.message || error?.message || 'Failed to update division.');
    }
  };

  const columns = [
    { 
      header: 'Member', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-portal-accent/10 flex items-center justify-center font-bold text-portal-accent border border-portal-accent/20">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-portal-text">{row.name}</div>
            <div className="text-[10px] text-portal-text-muted flex items-center gap-1">
              <Mail className="w-2 h-2" /> {row.email}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'ID Number', 
      render: (row) => (
        <span className="text-xs font-mono text-portal-accent bg-portal-accent/5 px-2 py-1 rounded border border-portal-accent/20">
          {row.idNo}
        </span>
      )
    },
    { 
      header: 'Division', 
      render: (row) => (
        isSuperAdmin ? (
          <select
            value={row.divisionId || ''}
            onChange={(event) => handleDivisionChange(row, event.target.value)}
            className="bg-portal-input border border-portal-border rounded-lg px-2 py-1 text-[10px] font-bold text-portal-text uppercase tracking-widest"
          >
            <option value="">Unassigned</option>
            {divisions.map((division) => (
              <option key={division._id || division.id} value={division._id || division.id}>
                {division.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">
            {row.division}
          </span>
        )
      )
    },
    { 
      header: 'Attendance', 
      render: (row) => (
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-portal-text">{row.attendance}</span>
           <button className="text-[10px] text-portal-accent hover:underline">Manual Update</button>
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`text-[10px] font-bold uppercase tracking-widest ${
          row.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  const actions = [
    { 
      label: 'View Information', 
      icon: Eye, 
      onClick: (member) => {
        setInfoMember(member);
        setIsInfoModalOpen(true);
      }
    },
    { 
      label: 'Edit', 
      icon: Edit2, 
      onClick: (member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
      }
    },
    { 
      label: 'Delete', 
      icon: Trash2, 
      className: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
      onClick: (member) => {
        if(confirm(`Are you sure you want to delete ${member.name}?`)) {
          setMembers(members.filter(m => m.id !== member.id));
        }
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-portal-text">Member Directory</h2>
          <p className="text-portal-text-muted">Manage user roles, division assignments, and access control.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedMember(null);
            setIsModalOpen(true);
          }}
          className="bg-portal-accent text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add New Member
        </button>
      </header>

      {isLoadingUsers ? (
        <div className="text-xs text-portal-text-muted">Loading students...</div>
      ) : null}
      {loadError ? (
        <div className="text-xs text-red-400">{loadError}</div>
      ) : null}

      <DataTable 
        columns={columns} 
        data={members} 
        actions={actions}
        searchPlaceholder="Search members by name, email or ID..."
      />

      {/* Member Info Modal */}
      <AdminModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)}
        title="Dossier: Specialist Information"
      >
        {infoMember && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-portal-border">
              <div className="w-20 h-20 rounded-2xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center font-black text-3xl text-portal-accent">
                {infoMember.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-portal-text">{infoMember.name}</h3>
                <p className="text-sm font-mono text-portal-accent">{infoMember.idNo}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                    infoMember.status === 'Active' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {infoMember.status}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-portal-accent/10 text-portal-accent">
                    {infoMember.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Digital Address</label>
                  <p className="text-sm text-portal-text flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-portal-accent" /> {infoMember.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Active Division</label>
                  <p className="text-sm text-portal-text flex items-center gap-2 font-medium">
                    <Layers className="w-4 h-4 text-portal-accent" /> {infoMember.division}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Current Attendance</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-portal-border rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-portal-accent" 
                         style={{ width: infoMember.attendance || '0%' }}
                       />
                    </div>
                    <span className="text-sm font-black text-portal-text">{infoMember.attendance || '0%'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Specialist Tier</label>
                  <p className="text-sm text-portal-text flex items-center gap-2 font-medium capitalize">
                    <ShieldCheck className="w-4 h-4 text-portal-accent" /> Alpha Team
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-portal-input/20 border border-portal-border rounded-2xl p-6 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-portal-text uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-portal-accent" />
                Recent Operational Logs
              </h4>
              <div className="space-y-3">
                 <div className="text-[11px] text-portal-text-muted flex justify-between border-b border-portal-border/30 pb-2">
                    <span>Synchronized division data</span>
                    <span className="text-portal-text/40">2 hours ago</span>
                 </div>
                 <div className="text-[11px] text-portal-text-muted flex justify-between border-b border-portal-border/30 pb-2">
                    <span>Submitted weekly pentest report</span>
                    <span className="text-portal-text/40">Yesterday</span>
                 </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-3 flex-wrap">
              {(admin?.role === 'super-admin' || admin?.role === 'super_admin') && (
                <button 
                  onClick={() => {
                    setPromoteToRole('admin');
                    setPromoteSuccess(null);
                    setPromoteError('');
                    setIsPromoteModalOpen(true);
                  }}
                  className="bg-red-500/10 text-red-400 px-6 py-3 rounded-xl font-bold hover:bg-red-500/20 transition-colors border border-red-500/20 flex items-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Promote to Admin
                </button>
              )}
              <button 
                onClick={() => {
                  setPromoteToRole('instructor');
                  setPromoteSuccess(null);
                  setPromoteError('');
                  setIsPromoteModalOpen(true);
                }}
                className="bg-portal-accent/10 text-portal-accent px-6 py-3 rounded-xl font-bold hover:bg-portal-accent/20 transition-colors border border-portal-accent/20 flex items-center gap-2 text-sm"
              >
                <ArrowUpRight className="w-4 h-4" />
                Promote to Instructor
              </button>
              <button 
                onClick={() => setIsInfoModalOpen(false)}
                className="bg-portal-input text-portal-text-muted px-6 py-3 rounded-xl font-bold hover:bg-portal-border transition-colors border border-portal-border"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedMember ? 'Edit Member Assignment' : 'Add New Student'}
      >
        <form className="space-y-6" onSubmit={handleCreateUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Full Name</label>
              <input type="text" defaultValue={selectedMember?.name} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Email Address</label>
              <input name="email" type="email" defaultValue={selectedMember?.email} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Student ID No</label>
              <input type="text" defaultValue={selectedMember?.idNo} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Current Status</label>
              <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none">
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-portal-accent" />
              Role & Division
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted">User Role</label>
                <select name="role" className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none" defaultValue={selectedMember?.role === 'instructor' ? 'instructor' : 'student'}>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-portal-text-muted">Target Division</label>
                  <div className="bg-portal-input/30 border border-portal-border rounded-xl px-4 py-3 text-portal-text-muted cursor-not-allowed uppercase text-[10px] font-bold tracking-widest">
                    {adminDivisionName}
                  </div>
                </div></div>
            </div>
          </div>

          {createdCredentials?.tempPassword ? (
            <div className="bg-portal-accent/10 border border-portal-accent/30 rounded-xl px-4 py-3 text-xs text-portal-text-muted">
              Temporary password for <span className="font-bold text-portal-text">{createdCredentials.email}</span>: <span className="font-mono text-portal-accent">{createdCredentials.tempPassword}</span>
            </div>
          ) : null}

          {formError ? (
            <div className="text-xs font-bold text-red-400">
              {formError}
            </div>
          ) : null}

          <div className="flex justify-end pt-6 gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted hover:text-portal-text transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-portal-accent text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
              {selectedMember ? 'Update Student' : 'Create Student'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Promote Member Modal */}
      <AdminModal 
        isOpen={isPromoteModalOpen} 
        onClose={() => setIsPromoteModalOpen(false)}
        title={promoteToRole === 'admin' ? 'Promote to Division Admin' : 'Promote to Instructor'}
      >
        <form className="space-y-6" onSubmit={handlePromoteUser}>
          <div className="space-y-4">
            <p className="text-sm text-portal-text-muted">
              You are about to promote <span className="font-bold text-portal-text">{infoMember?.name}</span> to an instructor role.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Target Division</label>
              {(admin?.role === 'super-admin' || admin?.role === 'super_admin') ? (
                <select 
                  name="division"
                  className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none"
                  defaultValue={adminDivisionId}
                >
                  {divisions.map(div => (
                    <option key={div._id} value={div._id}>{div.name}</option>
                  ))}
                </select>
              ) : (
                <div className="bg-portal-input/30 border border-portal-border rounded-xl px-4 py-3 text-portal-text-muted cursor-not-allowed uppercase text-[10px] font-bold tracking-widest">
                  {adminDivisionName}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Reason for Promotion</label>
              <input name="reason" type="text" placeholder="e.g. Demonstrated excellence in division" className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors" required />
            </div>
          </div>

          {promoteSuccess ? (
            <div className="bg-green-400/10 border border-green-400/30 rounded-xl px-4 py-3 text-sm text-green-400 flex flex-col gap-2">
              <span className="font-bold">Promotion successful!</span>
              {promoteSuccess.tempPassword && (
                <span className="text-xs text-portal-text-muted">
                  Temporary password for instructor: <span className="font-mono font-bold text-portal-text">{promoteSuccess.tempPassword}</span>
                </span>
              )}
            </div>
          ) : null}

          {promoteError ? (
            <div className="text-xs font-bold text-red-400">
              {promoteError}
            </div>
          ) : null}

          <div className="flex justify-end pt-6 gap-4">
            <button type="button" onClick={() => setIsPromoteModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted hover:text-portal-text transition-colors">Cancel</button>
            <button type="submit" disabled={isPromoting || promoteSuccess} className="bg-portal-accent text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              Confirm Promotion
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
