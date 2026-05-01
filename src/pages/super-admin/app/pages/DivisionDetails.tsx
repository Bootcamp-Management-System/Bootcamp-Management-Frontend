import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, BarChart3, Settings, TrendingUp, CheckCircle2, ShieldAlert, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { divisionService } from '../../../../services/divisionService';

const attendanceData = [
  { week: 'W1', present: 95 },
  { week: 'W2', present: 92 },
  { week: 'W3', present: 88 },
  { week: 'W4', present: 94 },
  { week: 'W5', present: 90 },
  { week: 'W6', present: 85 },
];

export function DivisionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [division, setDivision] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDivision = async () => {
      try {
        setLoading(true);
        const res = await divisionService.getDivisions(); // We will filter locally or add getDivisionById if needed
        const found = res.data?.find((d: any) => d._id === id);
        setDivision(found);
      } catch (error) {
        console.error('Failed to fetch division:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDivision();
  }, [id]);

  const handleDeleteDivision = async () => {
    setIsDeleting(true);
    try {
      await divisionService.deleteDivision(id);
      navigate('/super-admin/divisions');
    } catch (error) {
      console.error('Failed to delete division:', error);
      alert('Failed to delete division. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading division intelligence...</div>;
  if (!division) return <div className="p-20 text-center">Division not found in archives.</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-portal-border pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/super-admin/divisions')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-portal-card border border-portal-border hover:bg-portal-accent/10 hover:border-portal-accent/50 text-portal-text-muted hover:text-portal-accent transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-portal-text tracking-tight">{division.name}</h1>
              <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {division.status}
              </span>
            </div>
            <p className="text-sm font-black text-portal-text-muted uppercase tracking-widest mt-2">
              Batch {division.year || '2026'} • Head Admin: <span className="text-portal-accent">{division.headAdmin?.name || 'Unassigned'}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete Division
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-portal-accent hover:bg-portal-accent-hover text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-portal-accent/20 transition-all">
            <Settings className="w-4 h-4" />
            Manage Division
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-portal-border overflow-x-auto no-scrollbar">
        {['overview', 'students', 'instructors'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap border-b-4 transition-all",
              activeTab === tab 
                ? "border-portal-accent text-portal-accent" 
                : "border-transparent text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/5"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Enrolled', value: division.students, max: division.capacity, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Avg Attendance', value: '91%', diff: '-2%', icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { label: 'At-Risk Students', value: '3', diff: 'Critical', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
                { label: 'Growth Velocity', value: '+12%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
              ].map((stat, i) => (
                <div key={i} className="bg-portal-card border border-portal-border rounded-2xl p-6 shadow-sm group hover:border-portal-accent/50 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest">{stat.label}</span>
                    <div className={cn("p-2 rounded-xl", stat.bg, stat.color)}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-portal-text">{stat.value}</span>
                    {stat.max && <span className="text-xs font-bold text-portal-text-muted">/ {stat.max}</span>}
                    {stat.diff && <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ml-auto", stat.color, stat.bg)}>{stat.diff}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Detail sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left col: Charts */}
              <div className="lg:col-span-2 bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-portal-text uppercase tracking-[0.2em] flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-portal-accent" />
                    Weekly Attendance Intelligence
                  </h3>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--portal-accent)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--portal-accent)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--portal-border)" opacity={0.5} />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'var(--portal-text-muted)', fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} domain={[60, 100]} tick={{ fill: 'var(--portal-text-muted)', fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--portal-card)', 
                          borderColor: 'var(--portal-border)', 
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: 'var(--portal-text)'
                        }}
                      />
                      <Area type="monotone" dataKey="present" name="Present %" stroke="var(--portal-accent)" strokeWidth={4} fillOpacity={1} fill="url(#colorAtt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right col: Head Admin Info & Recent Activity */}
              <div className="space-y-8">
                <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                  <h3 className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-6">Division Leadership</h3>
                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-portal-bg border border-portal-border relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-portal-accent to-purple-500 flex items-center justify-center text-white text-xl font-black shadow-lg">
                      {(division.headAdmin?.name || 'U').charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-portal-text leading-tight">{division.headAdmin?.name || 'Unassigned'}</h4>
                      <p className="text-[10px] font-black text-portal-accent uppercase tracking-widest mt-1">Division Head Admin</p>
                    </div>
                  </div>
                  <ShieldAlert className="absolute -right-8 -bottom-8 w-32 h-32 text-portal-text/5 -rotate-12 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm">
                  <h3 className="text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-6">Operations Log</h3>
                  <div className="space-y-6">
                    {[
                      { title: 'Attendance Matrix Submitted', time: '1 day ago', icon: CheckCircle2, color: 'text-emerald-500' },
                      { title: 'Student Promotion Processed', time: '2 days ago', icon: Users, color: 'text-blue-500' },
                      { title: 'Curriculum Update Synced', time: '4 days ago', icon: Calendar, color: 'text-purple-500' }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className={cn("mt-0.5 transition-transform group-hover:scale-125", act.color)}>
                          <act.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-portal-text tracking-tight">{act.title}</p>
                          <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mt-1">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'overview' && (
          <div className="bg-portal-card border-2 border-dashed border-portal-border rounded-3xl p-20 text-center">
            <div className="w-16 h-16 bg-portal-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-portal-accent">
               {activeTab === 'students' ? <Users className="w-8 h-8" /> : <GraduationCap className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-black text-portal-text uppercase tracking-widest mb-2">
              {activeTab} module
            </h3>
            <p className="text-sm font-medium text-portal-text-muted max-w-sm mx-auto">
              Connecting to live data stream... The full orchestration panel for {activeTab} will synchronize shortly.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-md bg-portal-card border border-red-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h2 className="text-xl font-black text-portal-text tracking-tight uppercase">Termination Protocol</h2>
                <p className="text-sm font-medium text-portal-text-muted mt-2 leading-relaxed">
                  Confirm absolute deletion of the <span className="text-red-500 font-black">"{division.name}"</span> division? This bypasses all safety checks and erases all associated artifacts.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-portal-border text-[10px] font-black uppercase tracking-widest text-portal-text-muted hover:bg-portal-bg transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteDivision}
                className="flex-[1.5] py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all"
              >
                {isDeleting ? 'Erasing...' : 'Confirm Destruction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
