import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings2, 
  ChevronRight, 
  Search,
  Filter,
  Layers,
  ClipboardCheck,
  Zap
} from 'lucide-react';
import { bootcampService } from '../../services/bootcampService';
import { TemplateBuilder } from '../../components/admin/TemplateBuilder';
import { PipelineManager } from '../../components/admin/PipelineManager';

export const AdminRecruitmentPage = () => {
  const [bootcamps, setBootcamps] = useState([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [view, setView] = useState('template'); // 'template' or 'applications'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const fetchBootcamps = async () => {
    try {
      setLoading(true);
      const data = await bootcampService.getBootcamps();
      setBootcamps(data.data || []);
      if (data.data && data.data.length > 0) {
        setSelectedBootcamp(data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch bootcamps:', error);
    } finally {
      setLoading(false);
    }
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Bootcamp Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-portal-card border border-portal-border rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-bold text-portal-text-muted uppercase tracking-widest mb-6">Select Bootcamp</h3>
            <div className="space-y-2">
              {bootcamps.map(bootcamp => (
                <button
                  key={bootcamp._id}
                  onClick={() => setSelectedBootcamp(bootcamp)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    selectedBootcamp?._id === bootcamp._id 
                      ? 'bg-portal-accent/10 border-portal-accent text-portal-text' 
                      : 'bg-portal-bg border-portal-border text-portal-text-muted hover:border-portal-accent/30 hover:text-portal-text'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold truncate">{bootcamp.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">{bootcamp.division?.name || 'Division'}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedBootcamp?._id === bootcamp._id ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                </button>
              ))}
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
    </div>
  );
};
