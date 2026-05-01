import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import {
  UserPlus, 
  Edit2, 
  Trash2, 
  Mail, 
  Layers,
  ArrowRight
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { divisionService } from '../../services/divisionService';
import { userService } from '../../services/userService';
import { useLocation } from 'react-router-dom';

export const AdminMembersPage = () => {
  const { user: admin, selectedDivision } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
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
  const [selectedMember, setSelectedMember] = useState(null);

  const buildDisplayUser = React.useCallback((user) => {
    const email = user?.email || '';
    const nameSource = user?.name || email.split('@')[0] || 'User';
    const cleanName = nameSource.replace(/[._-]+/g, ' ').trim();
    const prettyName = cleanName ? `${cleanName.charAt(0).toUpperCase()}${cleanName.slice(1)}` : 'User';

    let divisionName = 'Unassigned';
    let divisionId = '';

    if (user?.division?.name) {
      divisionName = user.division.name;
      divisionId = user.division._id || '';
    } else if (user?.division) {
      divisionName = user.division;
      divisionId = user.division;
    } else if (Array.isArray(user?.memberships) && user.memberships.length > 0) {
      const membership = user.memberships[0];
      divisionName = membership.division?.name || membership.division || divisionName;
      divisionId = membership.division?._id || membership.division || '';
    }

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
      idNo: user?.campusId || user?.idNo || (user?._id ? user._id.slice(-6).toUpperCase() : 'N/A'),
    };
  }, [divisions]);

  const loadUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    setLoadError('');
    try {
      let response;
      const divisionId = adminDivisionId || selectedDivision;

      if (admin?.role === 'admin' && divisionId) {
        response = await divisionService.getUsersByDivision(divisionId);
      } else if (admin?.role === 'super_admin' || admin?.role === 'super-admin') {
        response = await userService.getUsers();
      } else {
        response = await userService.getUsers();
      }

      const userData = response?.data || response?.data?.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      setUsers([]);
      setLoadError(error?.response?.data?.message || error?.message || 'Failed to load users.');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [admin?.role, adminDivisionId, selectedDivision]);

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
  }, [loadUsers]);

  React.useEffect(() => {
    const filtered = users
      .filter((u) => u.is_Member === true)
      .map(buildDisplayUser)
      .filter((user) => 
        currentDivision === 'All' || 
        user.division === currentDivision ||
        (user.assignedDivisions && user.assignedDivisions.includes(currentDivision))
      );
    setMembers(filtered);
  }, [buildDisplayUser, currentDivision, users]);

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
    }
  ];

  const actions = [
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
    <div className="max-w-7xl mx-auto space-y-10 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-black text-portal-text tracking-tight uppercase">Member Directory</h2>
            <span className="text-[10px] font-black bg-white/10 text-white px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 backdrop-blur-md">Live Data</span>
          </div>
          <p className="text-sm font-black text-portal-text-muted uppercase tracking-[0.2em]">Manage user roles, division assignments, and access control.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedMember(null);
            setIsModalOpen(true);
          }}
          className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Add New Member
        </button>
      </header>

      {isLoadingUsers ? (
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-portal-text-muted">
          <div className="w-4 h-4 border-2 border-portal-accent border-t-transparent rounded-full animate-spin" />
          Synchronizing records...
        </div>
      ) : null}

      {loadError ? (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-500">
          Load Protocol Failed: {loadError}
        </div>
      ) : null}

      <div className="bg-portal-card border border-portal-border rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <DataTable 
          columns={columns} 
          data={members} 
          actions={actions}
          searchPlaceholder="Search members by name, email or ID.."
          defaultQuery={initialSearch}
        />
        <Layers className="absolute -right-10 -bottom-10 w-64 h-64 text-portal-accent/[0.03] -rotate-12 pointer-events-none" />
      </div>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedMember ? 'Edit Member Assignment' : 'Add New Student'}
      >
        <form className="space-y-10 py-4" onSubmit={handleCreateUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Full Name</label>
              <input type="text" defaultValue={selectedMember?.name} className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Email Address</label>
              <input name="email" type="email" defaultValue={selectedMember?.email} className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Student ID No</label>
              <input type="text" defaultValue={selectedMember?.idNo} className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1">Current Status</label>
              <div className="relative group">
                <select className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all appearance-none cursor-pointer">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted rotate-90" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.3em] pl-1 flex items-center gap-3">
              <Layers className="w-4 h-4 text-portal-accent" />
              Orchestration Details
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                <label className="text-[9px] font-black text-portal-text-muted uppercase tracking-widest">System Role</label>
                <div className="relative group">
                  <select name="role" className="w-full bg-portal-bg border border-portal-border rounded-2xl px-6 py-4 text-sm font-bold text-portal-text outline-none focus:border-portal-accent focus:bg-portal-card transition-all appearance-none cursor-pointer" defaultValue={selectedMember?.role === 'instructor' ? 'instructor' : 'student'}>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                  <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted rotate-90" />
                </div>
              </div>
              <div className="space-y-3">
                  <label className="text-[9px] font-black text-portal-text-muted uppercase tracking-widest">Division Access</label>
                  <div className="bg-portal-bg/50 border border-portal-border rounded-2xl px-6 py-4 text-xs font-black text-portal-accent uppercase tracking-widest shadow-inner">
                    {adminDivisionName}
                  </div>
              </div>
            </div>
          </div>

          {createdCredentials?.tempPassword ? (
            <div className="bg-portal-accent/5 border border-portal-accent/20 rounded-2xl px-6 py-5">
              <p className="text-[9px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-2">Access Credentials</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-portal-text">{createdCredentials.email}</span>
                <span className="text-xs font-mono bg-portal-accent text-portal-bg px-4 py-1.5 rounded-lg font-black">{createdCredentials.tempPassword}</span>
              </div>
            </div>
          ) : null}

          {formError ? (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-500">
              Protocol Error: {formError}
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-10 border-t border-portal-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-portal-text-muted hover:text-portal-text transition-colors">Abort</button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-3"
            >
              {selectedMember ? 'Update Node' : 'Create Access Node'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
};
