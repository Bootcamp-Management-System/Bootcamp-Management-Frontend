import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  User,
  Layers,
  ArrowRight
} from 'lucide-react';

import { ALL_SESSIONS } from '../../lib/mockData';
import { useAuth } from '../../context/AuthContext';

export const AdminSessionsPage = () => {
  const { user: admin, selectedDivision } = useAuth();
  const adminDivision = admin?.division || 'Data Science';
  const currentDivision = admin?.role === 'super_admin' ? selectedDivision : adminDivision;

  const [sessions, setSessions] = React.useState(ALL_SESSIONS.filter(s => currentDivision === 'All' || s.division === currentDivision));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  React.useEffect(() => {
    setSessions(ALL_SESSIONS.filter(s => currentDivision === 'All' || s.division === currentDivision));
  }, [currentDivision]);

  const columns = [
    { 
      header: 'Session', 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white mb-0.5">{row.title}</span>
          <div className="flex items-center gap-2 text-[10px] text-portal-text-muted">
            <User className="w-2.5 h-2.5" /> {row.instructor}
          </div>
        </div>
      )
    },
    { 
      header: 'Timing', 
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-white">
            <Calendar className="w-3 h-3 text-portal-accent" />
            {row.date}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-portal-text-muted mt-1">
            <Clock className="w-3 h-3" />
            {row.time}
          </div>
        </div>
      )
    },
    { 
      header: 'Division', 
      render: (row) => (
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
          row.division === 'Development' ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' :
          row.division === 'Cyber Security' ? 'bg-red-400/10 border-red-400/20 text-red-400' :
          row.division === 'Data Science' ? 'bg-purple-400/10 border-purple-400/20 text-purple-400' :
          'bg-orange-400/10 border-orange-400/20 text-orange-400'
        }`}>
          {row.division}
        </span>
      )
    },
    { 
      header: 'State', 
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
          <span className={`text-[10px] font-bold uppercase tracking-widest ${
            row.status === 'Live' ? 'text-red-400' : 'text-portal-text-muted'
          }`}>
            {row.status}
          </span>
        </div>
      )
    }
  ];

  const actions = [
    { label: 'Edit', icon: Edit2, onClick: (s) => { setSelectedSession(s); setIsModalOpen(true); } },
    { 
      label: 'Delete', 
      icon: Trash2, 
      className: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
      onClick: (s) => setSessions(sessions.filter(i => i.id !== s.id))
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Curriculum Management</h2>
          <p className="text-portal-text-muted">Broadcast and schedule learning sessions for various divisions.</p>
        </div>
        <button 
          onClick={() => { setSelectedSession(null); setIsModalOpen(true); }}
          className="bg-portal-accent text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-portal-accent/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Schedule Session
        </button>
      </header>

      <DataTable 
        columns={columns} 
        data={sessions} 
        actions={actions}
        searchPlaceholder="Filter sessions by name or instructor..."
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedSession ? 'Edit Resource Node' : 'Broadcast New Session'}
      >
        <form className="space-y-8">
          <div className="space-y-4">
             <div className="space-y-2">
              <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Session Title</label>
              <input type="text" defaultValue={selectedSession?.title} placeholder="e.g. Masterclass: Node Systems" className="w-full bg-portal-input border border-portal-border rounded-2xl px-5 py-4 text-white outline-none focus:border-portal-accent transition-all" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Instructor Node</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-accent" />
                  <input type="text" defaultValue={selectedSession?.instructor} placeholder="Search staff..." className="w-full bg-portal-input border border-portal-border rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-portal-accent" />
                </div>
              </div>
               <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Active Division</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-accent z-10" />
                  {admin?.role === 'super_admin' ? (
                    <select className="w-full bg-portal-input border border-portal-border rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-portal-accent appearance-none" defaultValue={selectedSession?.division || 'Development'}>
                      <option>Development</option>
                      <option>Cyber Security</option>
                      <option>Data Science</option>
                      <option>CP (Competitive Programming)</option>
                    </select>
                  ) : (
                    <div className="w-full bg-portal-input/30 border border-portal-border rounded-xl pl-12 pr-4 py-3 text-portal-text-muted cursor-not-allowed">
                      {adminDivision}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Execution Date</label>
                <input type="date" defaultValue={selectedSession?.date} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Start Time</label>
                <input type="time" defaultValue={selectedSession?.time} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 font-bold text-portal-text-muted hover:text-white transition-colors">Abort</button>
            <button type="submit" className="bg-portal-accent text-white px-12 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all flex items-center gap-3 group">
              {selectedSession ? 'Commit Changes' : 'Broadcast Node'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
