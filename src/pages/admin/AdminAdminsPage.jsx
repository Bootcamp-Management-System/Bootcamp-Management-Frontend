import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { 
  Shield, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Mail, 
  Layers,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import { divisionService } from '../../services/divisionService';
import { userService } from '../../services/userService';

export const AdminAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const buildDisplayUser = (user) => {
    const email = user?.email || '';
    const nameSource = user?.name || email.split('@')[0] || 'Admin';
    const cleanName = nameSource.replace(/[._-]+/g, ' ').trim();
    const prettyName = cleanName ? `${cleanName.charAt(0).toUpperCase()}${cleanName.slice(1)}` : 'Admin';
    const divisionName = user?.division?.name || user?.division || 'Unassigned';

    return {
      id: user?._id || user?.id || email,
      name: prettyName,
      email,
      role: user?.role,
      division: divisionName,
      status: user?.verified ? 'Active' : 'Pending',
      idNo: user?.campusId || user?.idNo || (user?._id ? user._id.slice(-6).toUpperCase() : 'N/A'),
    };
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    setLoadError('');
    try {
      const response = await userService.getUsers();
      const userData = response?.data || response?.data?.data || [];
      const normalized = Array.isArray(userData) ? userData : [];
      setUsers(normalized);
      setAdmins(normalized.filter((user) => user?.role === 'admin').map(buildDisplayUser));
    } catch (error) {
      setUsers([]);
      setAdmins([]);
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

  const resolveDivisionId = (divisionValue) => {
    if (!divisionValue) return null;
    const matchById = divisions.find((division) => division._id === divisionValue || division.id === divisionValue);
    if (matchById) return matchById._id || matchById.id;
    const matchByName = divisions.find((division) => division.name === divisionValue);
    return matchByName ? matchByName._id || matchByName.id : null;
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    setCreatedCredentials(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const selectedDivisionValue = form.get('division');

    if (!email) {
      setFormError('Email is required.');
      setIsSubmitting(false);
      return;
    }

    const divisionId = resolveDivisionId(selectedDivisionValue);

    try {
      const response = await userService.createUser({
        email,
        role: 'admin',
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

  const columns = [
    { 
      header: 'Administrator', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-portal-accent/10 flex items-center justify-center font-bold text-portal-accent border border-portal-accent/20">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-portal-text">{row.name}</div>
            <div className="text-[10px] text-portal-text-muted flex items-center gap-1 font-mono uppercase tracking-widest">
              {row.idNo}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Email', 
      render: (row) => (
        <div className="text-xs text-portal-text-muted flex items-center gap-2">
          <Mail className="w-3 h-3 text-portal-accent" /> {row.email}
        </div>
      )
    },
    { 
      header: 'Assigned Division', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-portal-accent animate-pulse" />
          <span className="text-xs font-bold text-portal-text uppercase tracking-tight">{row.division}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
          row.status === 'Active' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  const actions = [
    { 
      label: 'Edit Permissions', 
      icon: Edit2, 
      onClick: (admin) => {
        setSelectedAdmin(admin);
        setIsModalOpen(true);
      }
    },
    { 
      label: 'Deactivate', 
      icon: XCircle, 
      className: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
      onClick: (admin) => {
        if(confirm(`Are you sure you want to deactivate ${admin.name}?`)) {
          setAdmins(admins.map(a => a.id === admin.id ? { ...a, status: 'Inactive' } : a));
        }
      }
    },
    { 
      label: 'Remove Access', 
      icon: Trash2, 
      className: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
      onClick: (admin) => {
        if(confirm(`Completely remove administrative access for ${admin.name}?`)) {
          setAdmins(admins.filter(a => a.id !== admin.id));
        }
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-portal-accent text-[10px] font-black uppercase tracking-[0.3em] mb-2">
            <Shield className="w-3 h-3" /> Root Access Management
          </div>
          <h2 className="text-3xl font-bold mb-2 text-portal-text">Division Administrators</h2>
          <p className="text-portal-text-muted italic">Provisioning and managing access keys for division leads.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedAdmin(null);
            setIsModalOpen(true);
          }}
          className="bg-portal-accent text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-portal-accent/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <UserPlus className="w-5 h-5" />
          Provision Admin
        </button>
      </header>

      {isLoadingUsers ? (
        <div className="text-xs text-portal-text-muted">Loading administrators...</div>
      ) : null}
      {loadError ? (
        <div className="text-xs text-red-400">{loadError}</div>
      ) : null}

      <DataTable 
        columns={columns} 
        data={admins} 
        actions={actions}
        searchPlaceholder="Filter division administrators..."
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedAdmin ? 'Reconfigure Admin Protocol' : 'Provision New System Admin'}
      >
        <form className="space-y-8" onSubmit={handleCreateAdmin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest pl-1">Identification</label>
              <input type="text" placeholder="Full legal name" defaultValue={selectedAdmin?.name} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest pl-1">Digital Identity (Email)</label>
              <input name="email" type="email" placeholder="admin@domain.com" defaultValue={selectedAdmin?.email} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors text-sm" />
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest pl-1 flex items-center gap-2">
               <Layers className="w-4 h-4 text-portal-accent" /> Node Assignment
             </label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-portal-text-muted">Target Division</label>
                 <select name="division" className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none text-sm" defaultValue={selectedAdmin?.division || (divisions[0]?._id || divisions[0]?.id || '')}>
                   {divisions.map((division) => (
                     <option key={division._id || division.id} value={division._id || division.id}>
                       {division.name}
                     </option>
                   ))}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-portal-text-muted">Security Clearance</label>
                 <div className="w-full bg-portal-input/30 border border-portal-border rounded-xl px-4 py-3 text-portal-accent font-black uppercase text-[10px] tracking-widest cursor-not-allowed italic">
                   Level 2 - Division Limited
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-portal-accent/5 border border-portal-accent/20 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-4">
               <ShieldCheck className="w-5 h-5 text-portal-accent" />
               <h4 className="text-xs font-bold text-portal-text uppercase tracking-widest">Protocol Acknowledgement</h4>
             </div>
             <p className="text-[11px] text-portal-text-muted leading-relaxed">
               By provisioning this administrator, you grant them absolute control over members, instructors, and assets within their assigned division. This action is logged in the central auditing core.
             </p>
          </div>

          {createdCredentials?.tempPassword ? (
            <div className="bg-portal-accent/10 border border-portal-accent/30 rounded-2xl p-4 text-xs text-portal-text-muted">
              Temporary password for <span className="font-bold text-portal-text">{createdCredentials.email}</span>: <span className="font-mono text-portal-accent">{createdCredentials.tempPassword}</span>
            </div>
          ) : null}

          {formError ? (
            <div className="text-xs font-bold text-red-400">
              {formError}
            </div>
          ) : null}

          <div className="flex justify-end gap-4 pt-4 border-t border-portal-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-sm font-bold text-portal-text-muted hover:text-portal-text transition-colors uppercase tracking-widest">Abort</button>
            <button type="submit" disabled={isSubmitting} className="bg-portal-accent text-white px-12 py-3 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-portal-accent/20 flex items-center gap-3 disabled:opacity-60">
              <CheckCircle2 className="w-4 h-4" /> {selectedAdmin ? 'Update Core' : 'Execute Provision'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
