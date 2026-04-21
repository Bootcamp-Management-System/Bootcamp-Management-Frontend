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

import { ALL_ADMINS } from '../../lib/mockData';
import { useAuth } from '../../context/AuthContext';

export const AdminAdminsPage = () => {
  const [admins, setAdmins] = useState(ALL_ADMINS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const columns = [
    { 
      header: 'Administrator', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-portal-accent/10 flex items-center justify-center font-bold text-portal-accent border border-portal-accent/20">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{row.name}</div>
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
          <span className="text-xs font-bold text-white uppercase tracking-tight">{row.division}</span>
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
          <h2 className="text-3xl font-bold mb-2 text-white">Division Administrators</h2>
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
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest pl-1">Identification</label>
              <input type="text" placeholder="Full legal name" defaultValue={selectedAdmin?.name} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest pl-1">Digital Identity (Email)</label>
              <input type="email" placeholder="admin@domain.com" defaultValue={selectedAdmin?.email} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors text-sm" />
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest pl-1 flex items-center gap-2">
               <Layers className="w-4 h-4 text-portal-accent" /> Node Assignment
             </label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-portal-text-muted">Target Division</label>
                 <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors appearance-none text-sm" defaultValue={selectedAdmin?.division || 'Development'}>
                   <option>Development</option>
                   <option>Cyber Security</option>
                   <option>Data Science</option>
                   <option>CP (Competitive Programming)</option>
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
               <h4 className="text-xs font-bold text-white uppercase tracking-widest">Protocol Acknowledgement</h4>
             </div>
             <p className="text-[11px] text-portal-text-muted leading-relaxed">
               By provisioning this administrator, you grant them absolute control over members, instructors, and assets within their assigned division. This action is logged in the central auditing core.
             </p>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-portal-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-sm font-bold text-portal-text-muted hover:text-white transition-colors uppercase tracking-widest">Abort</button>
            <button type="submit" className="bg-portal-accent text-white px-12 py-3 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-portal-accent/20 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4" /> {selectedAdmin ? 'Update Core' : 'Execute Provision'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
