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
  Briefcase
} from 'lucide-react';

import { ALL_MEMBERS } from '../../lib/mockData';
import { useAuth } from '../../context/AuthContext';

export const AdminMembersPage = () => {
  const { user: admin, selectedDivision } = useAuth();
  const adminDivision = admin?.division || 'Data Science';
  const currentDivision = admin?.role === 'super_admin' ? selectedDivision : adminDivision;
  
  const [members, setMembers] = React.useState(ALL_MEMBERS.filter(m => currentDivision === 'All' || m.division === currentDivision));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [infoMember, setInfoMember] = useState(null);

  React.useEffect(() => {
    setMembers(ALL_MEMBERS.filter(m => currentDivision === 'All' || m.division === currentDivision));
  }, [currentDivision]);

  const columns = [
    { 
      header: 'Member', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-portal-accent/10 flex items-center justify-center font-bold text-portal-accent border border-portal-accent/20">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{row.name}</div>
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
      header: 'Divisions', 
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.divisions.map((div, i) => (
            <span key={i} className="text-[9px] font-bold bg-white/5 text-white/70 px-2 py-0.5 rounded-full border border-white/5">
              {div}
            </span>
          ))}
        </div>
      )
    },
    { 
      header: 'Attendance', 
      render: (row) => (
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-white">{row.attendance}</span>
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
          <h2 className="text-3xl font-bold mb-2 text-white">Member Directory</h2>
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
                <h3 className="text-2xl font-bold text-white">{infoMember.name}</h3>
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
                  <p className="text-sm text-white flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-portal-accent" /> {infoMember.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Active Division</label>
                  <p className="text-sm text-white flex items-center gap-2 font-medium">
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
                    <span className="text-sm font-black text-white">{infoMember.attendance || '0%'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Specialist Tier</label>
                  <p className="text-sm text-white flex items-center gap-2 font-medium capitalize">
                    <ShieldCheck className="w-4 h-4 text-portal-accent" /> Alpha Team
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-portal-input/20 border border-portal-border rounded-2xl p-6 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-portal-accent" />
                Recent Operational Logs
              </h4>
              <div className="space-y-3">
                 <div className="text-[11px] text-portal-text-muted flex justify-between border-b border-portal-border/30 pb-2">
                    <span>Synchronized division data</span>
                    <span className="text-white/40">2 hours ago</span>
                 </div>
                 <div className="text-[11px] text-portal-text-muted flex justify-between border-b border-portal-border/30 pb-2">
                    <span>Submitted weekly pentest report</span>
                    <span className="text-white/40">Yesterday</span>
                 </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setIsInfoModalOpen(false)}
                className="bg-portal-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-portal-accent-hover transition-colors shadow-lg shadow-portal-accent/20"
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
        title={selectedMember ? 'Edit Member Assignment' : 'Add New Member'}
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Full Name</label>
              <input type="text" defaultValue={selectedMember?.name} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Email Address</label>
              <input type="email" defaultValue={selectedMember?.email} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Student ID No</label>
              <input type="text" defaultValue={selectedMember?.idNo} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Current Status</label>
              <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors appearance-none">
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
                <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors appearance-none" defaultValue={selectedMember?.role || 'member'}>
                  <option value="member">Member</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted">Target Division</label>
                {admin?.role === 'super_admin' ? (
                  <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors appearance-none" defaultValue={selectedMember?.division || 'Development'}>
                    <option>Development</option>
                    <option>Cyber Security</option>
                    <option>Data Science</option>
                    <option>CP (Competitive Programming)</option>
                  </select>
                ) : (
                  <div className="bg-portal-input/30 border border-portal-border rounded-xl px-4 py-3 text-portal-text-muted cursor-not-allowed uppercase text-[10px] font-bold tracking-widest">
                    {adminDivision}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="bg-portal-accent text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              {selectedMember ? 'Update Member' : 'Create Member'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
