import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings2, 
  ChevronRight, 
  Search,
  Filter,
  Layers,
  Zap,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { bootcampService } from '../../services/bootcampService';
import { divisionService } from '../../services/divisionService';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { AdminModal } from '../../components/admin/AdminModal';
import { TemplateBuilder } from '../../components/admin/TemplateBuilder';
import { PipelineManager } from '../../components/admin/PipelineManager';

export const AdminRecruitmentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const [bootcamps, setBootcamps] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [view, setView] = useState('template'); // 'template' or 'applications'
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBootcamp, setEditBootcamp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const { user: admin } = useAuth();

  useEffect(() => {
    fetchBootcamps();
    fetchDivisions();
  }, [admin]);

  const fetchDivisions = async () => {
    try {
      const data = await divisionService.getDivisions();
      setDivisions(data.data || []);
    } catch (error) {
      console.error('Failed to fetch divisions:', error);
    }
  };

  const fetchBootcamps = async () => {
    try {
      setLoading(true);
      const data = await bootcampService.getBootcamps();
      const bootcampList = data.data || [];
      setBootcamps(bootcampList);
      if (bootcampList.length > 0) {
        const active = bootcampList.find((bootcamp) => bootcamp._id === selectedBootcamp?._id) || bootcampList[0];
        setSelectedBootcamp(active);
      } else {
        setSelectedBootcamp(null);
      }
    } catch (error) {
      console.error('Failed to fetch bootcamps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBootcamp = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const divisionId = formData.get('division') || admin?.division?._id || admin?.division || admin?.divisionId;

    if (!divisionId && (admin?.role === 'super_admin' || admin?.role === 'super-admin')) {
      alert('Please select a division for the bootcamp.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.get('name'),
      description: formData.get('description'),
      bootcampType: formData.get('bootcampType') || 'external',
      division: divisionId,
    };
    
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    if (startDate) payload.startDate = startDate;
    if (endDate) payload.endDate = endDate;

    try {
      if (editBootcamp) {
        await bootcampService.updateBootcamp(editBootcamp._id, payload);
        setEditBootcamp(null);
        setIsEditModalOpen(false);
      } else {
        await bootcampService.createBootcamp(payload);
        setIsCreateModalOpen(false);
      }
      fetchBootcamps();
    } catch (error) {
      console.error('Failed to save bootcamp:', error);
      alert(error.response?.data?.message || 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBootcamp = (event, bootcamp) => {
    event.stopPropagation();
    setEditBootcamp(bootcamp);
    setIsEditModalOpen(true);
  };

  const handleDeleteBootcamp = async (event, bootcampId) => {
    event.stopPropagation();
    if (!window.confirm('Delete this bootcamp and all its recruitment settings?')) return;

    try {
      await bootcampService.deleteBootcamp(bootcampId);
      if (selectedBootcamp?._id === bootcampId) {
        setSelectedBootcamp(null);
      }
      fetchBootcamps();
    } catch (error) {
      console.error('Failed to delete bootcamp:', error);
      alert(error.response?.data?.message || 'Deletion failed');
    }
  };

  const closeEditModal = () => {
    setEditBootcamp(null);
    setIsEditModalOpen(false);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  if (loading) return <div className="p-20 text-portal-text text-center">Synchronising with recruitment server...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-portal-text flex items-center gap-3">
            <Zap className="w-8 h-8 text-portal-accent" />
            Recruitment Hub
          </h2>
          <p className="text-portal-text-muted mt-1 italic">Manage your admission funnels and candidate pipelines.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-portal-accent text-portal-bg px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Bootcamp
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Bootcamp Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-portal-card border border-portal-border rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-bold text-portal-text-muted uppercase tracking-widest mb-6">Select Bootcamp</h3>
            <div className="space-y-2">
              {bootcamps
                .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(bootcamp => {
                const isActive = selectedBootcamp?._id === bootcamp._id;
                return (
                  <div
                    key={bootcamp._id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isActive ? 'bg-portal-accent/10 border-portal-accent text-portal-text' : 'bg-portal-bg border-portal-border'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedBootcamp(bootcamp)}
                      className={`w-full text-left p-4 flex items-center justify-between ${
                        isActive ? 'text-portal-text' : 'text-portal-text-muted hover:text-portal-text'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold truncate">{bootcamp.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">{bootcamp.division?.name || 'Division'}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                    </button>

                    <div className="border-t border-portal-border/70 bg-portal-bg px-3 py-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={(event) => handleEditBootcamp(event, bootcamp)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-portal-border hover:border-portal-accent hover:bg-portal-accent/10 transition-colors"
                        title="Edit Bootcamp"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => handleDeleteBootcamp(event, bootcamp._id)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-portal-border hover:border-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Bootcamp"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedBootcamp ? (
            <>
              {/* View Selector */}
              <div className="bg-portal-card border border-portal-border p-1.5 rounded-2xl flex items-center gap-2 w-fit shadow-lg">
                <button
                  onClick={() => setView('template')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    view === 'template' 
                      ? 'bg-portal-accent text-portal-bg' 
                      : 'text-portal-text-muted hover:text-portal-text'
                  }`}
                >
                  <Settings2 className="w-4 h-4" />
                  Application Template
                </button>
                <button
                  onClick={() => setView('applications')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    view === 'applications' 
                      ? 'bg-portal-accent text-portal-bg' 
                      : 'text-portal-text-muted hover:text-portal-text'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Active Pipelines
                </button>
              </div>

              {/* Dynamic View */}
              {view === 'template' ? (
                <TemplateBuilder bootcampId={selectedBootcamp._id} />
              ) : (
                <PipelineManager bootcampId={selectedBootcamp._id} />
              )}
            </>
          ) : (
            <div className="bg-portal-card border border-portal-border rounded-3xl p-20 text-center shadow-2xl">
              <Layers className="w-16 h-16 text-portal-text-muted mx-auto mb-6 opacity-20" />
              <h3 className="text-xl font-bold text-portal-text">No Bootcamp Selected</h3>
              <p className="text-portal-text-muted text-sm mt-2">Select a bootcamp from the sidebar to start designing your recruitment funnel.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Bootcamp Modal */}
      <AdminModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={editBootcamp ? closeEditModal : closeCreateModal}
        title={editBootcamp ? 'Edit Bootcamp' : 'Forge New Bootcamp'}
      >
        <form onSubmit={handleSaveBootcamp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Bootcamp Name</label>
            <input 
              name="name" 
              required 
              defaultValue={editBootcamp?.name || ''}
              placeholder="e.g. Offensive Security Phase 1"
              className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Bootcamp Access</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'external', title: 'External', body: 'Visible on public/application pages.' },
                { value: 'internal', title: 'Internal', body: 'Member-only. Hidden from landing and applications.' },
              ].map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="bootcampType"
                    value={option.value}
                    defaultChecked={(editBootcamp?.bootcampType || 'external') === option.value}
                    className="peer sr-only"
                  />
                  <span className="block h-full rounded-xl border border-portal-border bg-portal-input px-4 py-3 transition-colors peer-checked:border-portal-accent peer-checked:bg-portal-accent/10">
                    <span className="block text-sm font-black text-portal-text">{option.title}</span>
                    <span className="mt-1 block text-xs text-portal-text-muted leading-5">{option.body}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Description</label>
            <textarea 
              name="description" 
              rows={3}
              defaultValue={editBootcamp?.description || ''}
              placeholder="What will students learn?"
              className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors"
            />
          </div>

          {(admin?.role === 'super-admin' || admin?.role === 'super_admin') && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Target Division</label>
              <select 
                name="division" 
                required 
                defaultValue={editBootcamp?.division?._id || editBootcamp?.division || ''}
                className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none"
              >
                <option value="">Select Division</option>
                {divisions.map(div => (
                  <option key={div._id} value={div._id}>{div.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Start Date</label>
              <input 
                name="startDate" 
                type="date"
                defaultValue={editBootcamp?.startDate ? new Date(editBootcamp.startDate).toISOString().slice(0, 10) : ''}
                className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">End Date</label>
              <input 
                name="endDate" 
                type="date"
                defaultValue={editBootcamp?.endDate ? new Date(editBootcamp.endDate).toISOString().slice(0, 10) : ''}
                className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-4">
            <button 
              type="button" 
              onClick={editBootcamp ? closeEditModal : closeCreateModal}
              className="px-6 py-2.5 rounded-xl font-bold text-portal-text-muted hover:text-portal-text transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-portal-accent text-portal-bg px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (editBootcamp ? 'Saving...' : 'Creating...') : (editBootcamp ? 'Save Changes' : 'Create Bootcamp')}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
