import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  Mail, 
  ShieldCheck,
  Award,
  BookOpen,
  Eye,
  Clock,
  Layers,
  Activity
} from 'lucide-react';
import { ALL_MEMBERS } from '../../lib/mockData';
import { useAuth } from '../../context/AuthContext';

export const AdminInstructorsPage = () => {
  const { user: admin } = useAuth();
  const adminDivision = admin?.division || 'Data Science';
  
  const initialInstructors = ALL_MEMBERS.filter(m => m.division === adminDivision && m.role === 'instructor');
  const [instructors, setInstructors] = useState(initialInstructors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [infoInstructor, setInfoInstructor] = useState(null);

  const columns = [
    { 
      header: 'Instructor', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center font-bold text-purple-400 border border-purple-400/20">
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
      header: 'Specialization', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-portal-accent" />
          <span className="text-xs text-white/80 font-medium">Senior Lead</span>
        </div>
      )
    },
    { 
      header: 'Sessions', 
      render: () => <span className="text-sm font-bold text-portal-accent">12</span>
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
          {row.status}
        </span>
      )
    }
  ];

  const actions = [
    { 
      label: 'View Dossier', 
      icon: Eye, 
      onClick: (inst) => {
        setInfoInstructor(inst);
        setIsInfoModalOpen(true);
      }
    },
    { label: 'Edit', icon: Edit2, onClick: (inst) => { setSelectedInstructor(inst); setIsModalOpen(true); } },
    { 
      label: 'Remove', 
      icon: Trash2, 
      className: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
      onClick: (inst) => setInstructors(instructors.filter(i => i.id !== inst.id))
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Instructor Cohort</h2>
          <p className="text-portal-text-muted">Domain experts managing the {adminDivision} curriculum.</p>
        </div>
        <button 
          onClick={() => { setSelectedInstructor(null); setIsModalOpen(true); }}
          className="bg-portal-accent text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Register Instructor
        </button>
      </header>

      <DataTable 
        columns={columns} 
        data={instructors} 
        actions={actions}
        searchPlaceholder="Filter instructors by name..."
      />

      {/* Instructor Info Modal */}
      <AdminModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)}
        title="Dossier: Domain Expert Information"
      >
        {infoInstructor && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-portal-border">
              <div className="w-20 h-20 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center font-black text-3xl text-purple-400">
                {infoInstructor.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">{infoInstructor.name}</h3>
                <p className="text-sm font-mono text-portal-accent italic">Certified Professional</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-green-400/10 text-green-400">
                    {infoInstructor.status || 'Active'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-purple-400/10 text-purple-400">
                    Expert Level
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Digital Channel</label>
                  <p className="text-sm text-white flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-portal-accent" /> {infoInstructor.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Assigned Sector</label>
                  <p className="text-sm text-white flex items-center gap-2 font-medium">
                    <Layers className="w-4 h-4 text-portal-accent" /> {adminDivision}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Instruction Metrics</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-portal-border rounded-full overflow-hidden">
                       <div className="h-full bg-purple-400" style={{ width: '85%' }} />
                    </div>
                    <span className="text-sm font-black text-white">85% Rating</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Cohort Size</label>
                  <p className="text-sm text-white flex items-center gap-2 font-medium">
                    <Award className="w-4 h-4 text-portal-accent" /> 42 Students Directed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-portal-input/20 border border-portal-border rounded-2xl p-6 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-portal-accent" />
                Specialist Contribution Timeline
              </h4>
              <div className="space-y-3 font-mono text-[10px] text-portal-text-muted">
                 <div className="flex justify-between border-b border-portal-border/30 pb-2">
                    <span>Broadcasted 'Neural Logic' session</span>
                    <span className="text-white/40">Today, 09:00</span>
                 </div>
                 <div className="flex justify-between border-b border-portal-border/30 pb-2">
                    <span>Validated 12 project submissions</span>
                    <span className="text-white/40">Oct 20, 2026</span>
                 </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setIsInfoModalOpen(false)}
                className="bg-portal-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-portal-accent-hover transition-colors shadow-lg shadow-portal-accent/20"
              >
                Deactivate View
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedInstructor ? 'Edit Specialist Details' : 'Register New Expert'}
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Full Name</label>
              <input type="text" defaultValue={selectedInstructor?.name} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Expert Email</label>
              <input type="email" defaultValue={selectedInstructor?.email} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors" />
            </div>
          </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Primary Skillsets (Comma separated)</label>
              <input type="text" placeholder="e.g. Offensive Security, Malware Analysis" className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Operational Role</label>
                <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors appearance-none" defaultValue="instructor">
                  <option value="member">Member</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">System Status</label>
                <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent transition-colors appearance-none" defaultValue={selectedInstructor?.status || 'Active'}>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </div>
            </div>

          <div className="bg-portal-input/20 border border-portal-border rounded-2xl p-6">
             <div className="flex items-center gap-3 text-portal-text-muted">
                <ShieldCheck className="w-5 h-5 text-portal-accent" />
                <p className="text-xs">Instructors registered here will be automatically constrained to the <strong>{adminDivision}</strong> division access scope.</p>
             </div>
          </div>

          <div className="flex justify-end pt-6 gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="bg-portal-accent text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-portal-accent/20">
              {selectedInstructor ? 'Update Specialist' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
