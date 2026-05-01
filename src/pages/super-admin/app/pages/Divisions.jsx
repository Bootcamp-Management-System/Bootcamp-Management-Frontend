import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Search, Plus, Building2, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { divisionService } from '../../../../services/divisionService';
import { userService } from '../../../../services/userService';


export function Divisions() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const [divisions, setDivisions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(true);

  const uniqueCategories = useMemo(() => {
    const names = new Set(divisions.map(d => d.name).filter(Boolean));
    return Array.from(names).sort();
  }, [divisions]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [actionError, setActionError] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const filteredDivisions = divisions.filter(d => {
    const name = String(d?.name || '').toLowerCase();
    const adminName = String(d?.headAdmin?.name || '').toLowerCase();
    const matchesYear = selectedYear === 'All' ? true : String(d.year || '2024') === selectedYear;
    const matchesCategory = selectedCategory === 'All' ? true : String(d.name) === selectedCategory;
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || adminName.includes(searchQuery.toLowerCase());
    return matchesYear && matchesCategory && matchesSearch;
  });

  const fetchDivisions = async () => {
    try {
      setIsLoading(true);
      const res = await divisionService.getDivisions();
      setDivisions(res?.data || []);
    } catch (e) {
      setActionError(e?.message || 'Failed to load divisions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const handleCreateDivision = async () => {
    setActionError('');
    setIsWorking(true);
    try {
      await divisionService.createDivision({
        name: createName.trim(),
        description: createDescription.trim(),
      });
      setIsCreateOpen(false);
      setCreateName('');
      setCreateDescription('');
      fetchDivisions(); // Refresh list
    } catch (e) {
      setActionError(e?.response?.data?.message || e?.message || 'Failed to create division.');
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-portal-text">Divisions Hub</h1>
          <p className="text-portal-text-muted mt-1">Orchestrate and monitor system-wide educational divisions.</p>
        </div>
        <button
          onClick={() => {
            setActionError('');
            setCreateName('');
            setCreateDescription('');
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-portal-accent hover:bg-portal-accent-hover text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-portal-accent/20"
        >
          <Plus className="w-4 h-4" />
          Create Division
        </button>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => {
              if (isWorking) return;
              setIsCreateOpen(false);
            }}
          />
          <div className="relative w-full max-w-xl rounded-3xl border border-portal-border bg-portal-card p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-portal-text tracking-tight">
                  New Division
                </h2>
                <p className="text-xs font-bold text-portal-text-muted uppercase tracking-widest mt-1">
                  Architecting new training branches
                </p>
              </div>
              <button
                disabled={isWorking}
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-portal-bg border border-portal-border text-portal-text-muted hover:text-portal-text transition-colors"
              >
                ✕
              </button>
            </div>

            {actionError && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500">
                {actionError}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-2">Division Identity</label>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full rounded-xl border border-portal-border bg-portal-input px-4 py-3 text-sm text-portal-text focus:outline-none focus:ring-2 focus:ring-portal-accent transition-all"
                  placeholder="e.g. Development, Cyber Security"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-2">Architectural Notes</label>
                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  className="w-full min-h-24 rounded-xl border border-portal-border bg-portal-input px-4 py-3 text-sm text-portal-text focus:outline-none focus:ring-2 focus:ring-portal-accent transition-all resize-none"
                  placeholder="What is the primary focus of this division?"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  disabled={isWorking}
                  onClick={() => setIsCreateOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-portal-border text-xs font-black uppercase tracking-widest text-portal-text-muted hover:text-portal-text hover:bg-portal-bg transition-all"
                >
                  Abort
                </button>
                <button
                  disabled={isWorking || !createName.trim()}
                  onClick={handleCreateDivision}
                  className="px-6 py-2.5 rounded-xl bg-portal-accent hover:bg-portal-accent-hover disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-portal-accent/20"
                >
                  {isWorking ? 'Deploying...' : 'Initialize Division'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-portal-card/50 backdrop-blur-sm p-4 rounded-2xl border border-portal-border sticky top-0 z-10">
        <div className="relative w-full sm:w-80 group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-portal-text-muted group-focus-within:text-portal-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search divisions or admins..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 text-sm bg-portal-input border border-portal-border rounded-xl focus:outline-none focus:border-portal-accent text-portal-text transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-portal-input border border-portal-border rounded-xl">
            <Filter className="w-4 h-4 text-portal-text-muted" />
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-xs font-black text-portal-text-muted uppercase tracking-widest focus:outline-none cursor-pointer appearance-none"
            >
              <option value="All">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-portal-input border border-portal-border rounded-xl">
            <Building2 className="w-4 h-4 text-portal-text-muted" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-black text-portal-text-muted uppercase tracking-widest focus:outline-none cursor-pointer appearance-none"
            >
              <option value="All">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Division Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-portal-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-portal-text-muted uppercase tracking-widest animate-pulse">Syncing Division Architectures...</p>
          </div>
        ) : filteredDivisions.map((division) => (
          <div 
            key={division._id || division.id} 
            onClick={() => navigate(`/super-admin/divisions/${division._id || division.id}`)}
            className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-portal-accent transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center text-portal-accent group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-portal-text group-hover:text-portal-accent transition-colors tracking-tight">{division.name}</h3>
                  <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mt-0.5">Cohort {division.year || '2026'}</p>
                </div>
              </div>
              <span className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                division.status === 'Active' 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : "bg-orange-500/10 text-orange-500 border-orange-500/20"
              )}>
                {division.status || 'Active'}
              </span>
            </div>

            <div className="flex-1 space-y-5 relative z-10">
              <div>
                <p className="text-[9px] font-black text-portal-text-muted uppercase tracking-widest mb-2">Head Admin</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-portal-bg border border-portal-border flex items-center justify-center text-xs font-bold text-portal-text">
                    {(division.headAdmin?.name || 'U').charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-portal-text">{division.headAdmin?.name || 'Unassigned'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-5 border-t border-portal-border/50">
                <div>
                  <div className="flex items-center gap-2 text-portal-text-muted mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Enrolled</span>
                  </div>
                  <p className="text-base font-black text-portal-text">
                    {division.students || 0} 
                    <span className="text-portal-text-muted font-bold text-[10px] ml-1 uppercase">/ {division.capacity || 100}</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Progress Visualization */}
            <div className="mt-6 pt-4 border-t border-portal-border/50 w-full">
              <div className="w-full bg-portal-bg rounded-full h-1.5 mb-2 overflow-hidden">
                <div 
                  className="bg-portal-accent h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, ((division.students || 0) / (division.capacity || 100)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-black text-portal-text-muted uppercase tracking-widest">Capacity Level</p>
                <p className="text-[10px] font-black text-portal-accent">
                  {Math.round(((division.students || 0) / (division.capacity || 100)) * 100)}%
                </p>
              </div>
            </div>

            {/* Decorative background accent */}
            <Building2 className="absolute -right-8 -bottom-8 w-32 h-32 text-portal-text/5 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        ))}
        
        {!isLoading && filteredDivisions.length === 0 && (
          <div className="col-span-full py-20 text-center bg-portal-card border-2 border-dashed border-portal-border rounded-3xl">
            <Building2 className="w-16 h-16 mx-auto text-portal-text/10 mb-4" />
            <h3 className="text-xl font-bold text-portal-text tracking-tight">No Divisions Found</h3>
            <p className="text-sm text-portal-text-muted mt-2 mb-6 max-w-xs mx-auto">Try adjusting your filters or create a new branch for the system.</p>
            <button
              onClick={() => {
                setActionError('');
                setCreateName('');
                setCreateDescription('');
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-portal-bg hover:bg-portal-card border border-portal-border text-portal-text font-black text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Initialize First Division
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
