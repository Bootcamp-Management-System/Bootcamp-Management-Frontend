import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Layers,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { ALL_GROUPS } from '../../lib/mockData';
import { useAuth } from '../../context/AuthContext';

export const AdminGroupsPage = () => {
  const { user: admin, selectedDivision } = useAuth();
  const adminDivision = admin?.division || 'Data Science';
  const currentDivision = admin?.role === 'super_admin' ? selectedDivision : adminDivision;
  
  const [groups, setGroups] = React.useState(ALL_GROUPS.filter(g => currentDivision === 'All' || g.division === currentDivision));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  React.useEffect(() => {
    setGroups(ALL_GROUPS.filter(g => currentDivision === 'All' || g.division === currentDivision));
  }, [currentDivision]);

  const columns = [
    { 
      header: 'Group Name', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center font-bold text-orange-400 border border-orange-400/20">
            {row.name.charAt(0)}
          </div>
          <span className="text-sm font-bold text-white">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'Active Members', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-portal-border border-2 border-portal-card" />
            ))}
          </div>
          <span className="text-xs text-portal-text-muted font-medium">+{row.membersCount} specialists</span>
        </div>
      )
    },
    { 
      header: 'Division Scope', 
      render: (row) => <span className="text-[10px] font-bold text-portal-accent uppercase tracking-tighter">{row.division}</span>
    }
  ];

  const actions = [
    { label: 'Edit', icon: Edit2, onClick: (g) => { setSelectedGroup(g); setIsModalOpen(true); } },
    { label: 'Delete', icon: Trash2, className: 'text-red-400', onClick: (g) => setGroups(groups.filter(i => i.id !== g.id)) }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">{currentDivision === 'All' ? 'Global Focus Groups' : `${currentDivision} Focus Groups`}</h2>
          <p className="text-portal-text-muted">Sub-divisions and research clusters within {currentDivision === 'All' ? 'the organization' : currentDivision}.</p>
        </div>
        <button 
          onClick={() => { setSelectedGroup(null); setIsModalOpen(true); }}
          className="bg-portal-accent text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-portal-accent/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Neural Group
        </button>
      </header>

      <DataTable 
        columns={columns} 
        data={groups} 
        actions={actions}
        searchPlaceholder="Locate research groups..."
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedGroup ? 'Calibrate Research Cluster' : 'Initialize Research Cluster'}
      >
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Cluster Identifier</label>
            <input type="text" defaultValue={selectedGroup?.name} placeholder="e.g. Transformers Research Unit" className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-white outline-none focus:border-portal-accent" />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Assign Core Members</label>
            <div className="bg-portal-input/40 border border-portal-border rounded-2xl p-6 flex flex-col items-center justify-center border-dashed gap-3">
                <UserPlus className="w-8 h-8 text-portal-text-muted" />
                <p className="text-xs text-portal-text-muted font-medium italic text-center">Only specialists from the <strong>{currentDivision === 'All' ? 'selected' : currentDivision}</strong> division are eligible for this cluster.</p>
                <button type="button" className="text-portal-accent text-[10px] font-bold uppercase tracking-widest hover:underline mt-2">Initialize Scanner</button>
            </div>
          </div>

          <div className="flex justify-end pt-6 gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted">Abort</button>
            <button type="submit" className="bg-portal-accent text-white px-10 py-3 rounded-xl font-bold transition-all hover:scale-[1.02]">
              {selectedGroup ? 'Sync Cluster' : 'Deploy Cluster'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
