import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import {
  UserPlus, 
  Edit2, 
  Trash2, 
  Mail, 
  Layers,
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
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-portal-text flex items-center gap-3">
            Member Directory
            <span className="text-[10px] bg-portal-accent/10 text-portal-accent px-2 py-0.5 rounded-full uppercase tracking-tighter border border-portal-accent/20">Live Data</span>
          </h2>
          <p className="text-portal-text-muted">Manage user roles, division assignments, and access control.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedMember(null);
            setIsModalOpen(true);
          }}
          className="bg-portal-accent text-portal-bg px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-95"
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
            <button type="submit" disabled={isSubmitting} className="bg-portal-accent text-portal-bg px-10 py-3 rounded-xl font-bold shadow-lg shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
              {selectedMember ? 'Update Student' : 'Create Student'}
            </button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
};
