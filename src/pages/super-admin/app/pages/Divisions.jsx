import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, Plus, Building2, Users, CalendarDays, TrendingUp, MoreVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '../../lib/utils';
import { divisionService } from '../../../../services/divisionService';
import { userService } from '../../../../services/userService';


export function Divisions() {
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Analytics Data
  const analyticsData = divisions.map(d => ({
    name: d.name,
    students: d.students || 0,
    target: d.capacity || 100
  }));

  // Simple dynamic growth data (shows current month only if no history)
  const growthData = [
    { month: new Date().toLocaleString('default', { month: 'short' }), enrollments: divisions.reduce((acc, d) => acc + (d.students || 0), 0) }
  ];
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [actionError, setActionError] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const filteredDivisions = divisions.filter(d => {
    const name = String(d?.name || '').toLowerCase();
    const adminName = String(d?.headAdmin?.name || '').toLowerCase();
    const matchesYear = selectedYear === 'All' ? true : String(d.year || '2024') === selectedYear;
    const matchesCategory = (() => {
      const cat = selectedCategory.toLowerCase();
      if (cat === 'all' || cat === 'global') return true;
      if (cat === 'datascience') return name.includes('data science') || name.includes('datascience');
      if (cat === 'cyber') return name.includes('cyber');
      if (cat === 'cpr' || cat === 'cpd') return name.includes('cp') || name.includes('cpr');
      return name.includes(cat);
    })();
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">Divisions</h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">Manage bootcamp divisions, head admins, and monitor overall performance.</p>
        </div>
        <button
          onClick={() => {
            setActionError('');
            setCreateName('');
            setCreateDescription('');
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Division
        </button>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              if (isWorking) return;
              setIsCreateOpen(false);
            }}
          />
          <div className="relative w-full max-w-xl rounded-xl border border-[#30363d] bg-white dark:bg-[#161b22] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  Create Division
                </h2>
                <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">
                  Create a new division for organizing bootcamps and members.
                </p>
              </div>
              <button
                disabled={isWorking}
                onClick={() => {
                  setIsCreateOpen(false);
                }}
                className="text-sm font-bold text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]"
              >
                ✕
              </button>
            </div>

            {actionError && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                {actionError}
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#57606a] dark:text-[#8b949e] mb-1">Division name</label>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7]"
                  placeholder="e.g. Development"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#57606a] dark:text-[#8b949e] mb-1">Description (optional)</label>
                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  className="w-full min-h-24 rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7]"
                  placeholder="Short description..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  disabled={isWorking}
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-2 rounded-md border border-[#d0d7de] dark:border-[#30363d] text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]"
                >
                  Cancel
                </button>
                <button
                  disabled={isWorking || !createName.trim()}
                  onClick={handleCreateDivision}
                  className="px-3 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] disabled:opacity-60 text-white text-sm font-semibold"
                >
                  {isWorking ? 'Creating...' : 'Create Division'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#161b22] p-4 rounded-xl border border-[#d0d7de] dark:border-[#30363d] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#57606a] dark:text-[#8b949e]" />
          <input 
            type="text" 
            placeholder="Search divisions or admins..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] appearance-none transition-all cursor-pointer"
          >
            <option value="All">All Years</option>
            <option value="2024">2024 Cohort</option>
            <option value="2025">2025 Cohort</option>
            <option value="2026">2026 Cohort</option>
          </select>
          <Filter className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md text-sm py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] appearance-none transition-all cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="global">Global</option>
            <option value="development">Development</option>
            <option value="cyber">Cyber</option>
            <option value="datascience">DataScience</option>
            <option value="cpr">CPR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-portal-text-muted">
            Analyzing division architectures...
          </div>
        ) : filteredDivisions.map((division) => (
          <div 
            key={division._id || division.id} 
            onClick={() => navigate(`/super-admin/divisions/${division._id || division.id}`)}
            className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#0969da] dark:hover:border-[#58a6ff] transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ddf4ff] dark:bg-[#051d4d] flex items-center justify-center text-[#0969da] dark:text-[#2f81f7] group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[#24292f] dark:text-[#c9d1d9] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">{division.name}</h3>
                  <span className="text-xs font-medium text-[#57606a] dark:text-[#8b949e]">Batch {division.year}</span>
                </div>
              </div>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                division.status === 'Active' ? "bg-[#dafbe1] text-[#1a7f37] dark:bg-[#238636]/20 dark:text-[#3fb950] border-[#1a7f37]/20 dark:border-[#2ea043]/30" : "bg-[#fff8c5] text-[#9a6700] dark:bg-[#d29922]/20 dark:text-[#e3b341] border-[#d4a72c]/20 dark:border-[#d29922]/30"
              )}>
                {division.status}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-[#57606a] dark:text-[#8b949e] mb-1">Head Admin</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#f6f8fa] dark:bg-[#30363d] border border-[#d0d7de] dark:border-[#21262d] flex items-center justify-center text-xs font-bold text-[#24292f] dark:text-[#c9d1d9]">
                    {(division.headAdmin?.name || 'U').charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-[#24292f] dark:text-[#c9d1d9]">{division.headAdmin?.name || 'Unassigned'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#d0d7de] dark:border-[#30363d]">
                <div>
                  <div className="flex items-center gap-1.5 text-[#57606a] dark:text-[#8b949e] mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs">Students</span>
                  </div>
                  <p className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9]">{division.students || 0} <span className="text-[#57606a] dark:text-[#8b949e] font-normal text-xs">/ {division.capacity || 100}</span></p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[#57606a] dark:text-[#8b949e] mb-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span className="text-xs">Sessions</span>
                  </div>
                  <p className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9]">{division.sessions || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-[#d0d7de] dark:border-[#30363d] w-full">
              <div className="w-full bg-[#eaeef2] dark:bg-[#21262d] rounded-full h-1.5 mb-1 overflow-hidden">
                <div className="bg-[#1a7f37] dark:bg-[#238636] h-1.5 rounded-full transition-all" style={{ width: `${((division.students || 0) / (division.capacity || 100)) * 100}%` }}></div>
              </div>
              <p className="text-[10px] text-right text-[#57606a] dark:text-[#8b949e]">{Math.round(((division.students || 0) / (division.capacity || 100)) * 100)}% capacity</p>
            </div>
          </div>
        ))}
        {filteredDivisions.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-[#161b22] border border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-xl">
            <Building2 className="w-8 h-8 mx-auto text-[#57606a] dark:text-[#8b949e] mb-3 opacity-50" />
            <h3 className="text-base font-medium text-[#24292f] dark:text-[#c9d1d9]">No divisions found</h3>
            <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1 mb-4">Try adjusting your filters or search query.</p>
            <button
              onClick={() => {
                setActionError('');
                setCreateName('');
                setCreateDescription('');
                setCreatedDivisionId(null);
                setSelectedMemberId('');
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors shadow-sm mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create Your First Division
            </button>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="pt-6 border-t border-[#d0d7de] dark:border-[#30363d]">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#24292f] dark:text-[#c9d1d9] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0969da] dark:text-[#2f81f7]" />
            Overall Division Analytics
          </h2>
          <p className="text-sm text-[#57606a] dark:text-[#8b949e]">System-wide metrics across all active bootcamps.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Bar Chart */}
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9]">Current Enrollment vs Target</h3>
              <button className="text-[#57606a] hover:text-[#24292f] dark:text-[#8b949e] dark:hover:text-[#c9d1d9]"><MoreVertical className="w-4 h-4" /></button>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d0d7de" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#57606a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#57606a', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(208, 215, 222, 0.2)' }}
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#c9d1d9' }}
                  />
                  <Bar dataKey="students" name="Enrolled" fill="#0969da" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="target" name="Capacity Target" fill="#d0d7de" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Area Chart */}
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9]">Total System Enrollment Growth</h3>
              <select className="text-xs bg-transparent border-none text-[#57606a] dark:text-[#8b949e] focus:ring-0 cursor-pointer outline-none">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#238636" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#238636" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d0d7de" opacity={0.5} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#57606a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#57606a', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="enrollments" name="Total Students" stroke="#238636" strokeWidth={3} fillOpacity={1} fill="url(#colorEnrollments)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
