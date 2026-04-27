import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Code2, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bootcampService } from '../../services/bootcampService';
import { recruitmentService } from '../../services/recruitmentService';
import { useAuth } from '../../context/AuthContext';

export const StudentBootcampsPage = () => {
  const [bootcamps, setBootcamps] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState('All');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bootcampsData, appsData] = await Promise.all([
          bootcampService.getPublicBootcamps(),
          recruitmentService.getMyApplications()
        ]);
        setBootcamps(bootcampsData.data || []);
        setApplications(appsData.data || []);
      } catch (error) {
        console.error('Failed to fetch bootcamps:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getApplicationStatus = (bootcampId) => {
    const app = applications.find(a => a.bootcamp?._id === bootcampId || a.bootcamp === bootcampId);
    return app ? app.status : null;
  };

  const filteredBootcamps = bootcamps.filter(bootcamp => {
    const matchesSearch = bootcamp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bootcamp.division?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterDivision === 'All' || bootcamp.division?.name === filterDivision;
    return matchesSearch && matchesFilter;
  });

  const divisions = ['All', ...new Set(bootcamps.map(b => b.division?.name).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-portal-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="relative py-12 px-8 bg-portal-card border border-portal-border rounded-[40px] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-portal-accent/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-portal-accent/10 border border-portal-accent/20 rounded-full text-portal-accent text-[10px] font-bold uppercase tracking-widest mb-6">
            <Rocket className="w-4 h-4" />
            Discover Your Path
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-portal-text tracking-tight mb-4 leading-none">
            Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-accent to-blue-400">Bootcamps</span>
          </h1>
          <p className="text-portal-text-muted text-lg max-w-2xl leading-relaxed">
            Explore our elite training programs across all divisions. Select a bootcamp that aligns with your goals and start your journey today.
          </p>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted" />
          <input 
            type="text" 
            placeholder="Search bootcamps or divisions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-portal-card border border-portal-border rounded-2xl pl-12 pr-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-all shadow-lg"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          <Filter className="w-5 h-5 text-portal-text-muted hidden md:block" />
          {divisions.map(div => (
            <button
              key={div}
              onClick={() => setFilterDivision(div)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterDivision === div 
                ? 'bg-portal-accent text-portal-bg shadow-lg shadow-portal-accent/20' 
                : 'bg-portal-card border border-portal-border text-portal-text-muted hover:border-portal-accent/30'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Bootcamps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBootcamps.length > 0 ? (
          filteredBootcamps.map((bootcamp, i) => {
            const status = getApplicationStatus(bootcamp._id);
            const Icon = bootcamp.name.toLowerCase().includes('cyber') ? ShieldCheck : 
                         bootcamp.name.toLowerCase().includes('web') ? Globe : 
                         bootcamp.name.toLowerCase().includes('ai') ? Zap : Code2;

            return (
              <div 
                key={bootcamp._id}
                className="group relative bg-portal-card border border-portal-border rounded-[40px] p-8 shadow-xl transition-all duration-500 hover:y-[-8px] hover:border-portal-accent/30 overflow-hidden flex flex-col"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 bg-portal-accent/10 border border-portal-accent/20 rounded-2xl flex items-center justify-center group-hover:bg-portal-accent group-hover:scale-110 transition-all duration-500 shadow-inner">
                    <Icon className="w-7 h-7 text-portal-accent group-hover:text-portal-bg transition-colors duration-500" />
                  </div>
                  {status && (
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-portal-accent/10 text-portal-accent border-portal-accent/20'
                    }`}>
                      {status.replace('_', ' ')}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-portal-accent uppercase tracking-[0.2em]">
                      {bootcamp.division?.name || 'Division'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-portal-text mb-4 group-hover:text-portal-accent transition-colors">
                    {bootcamp.name}
                  </h3>
                  <p className="text-portal-text-muted text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-portal-text transition-colors">
                    {bootcamp.description || 'Master industry-standard practices and launch your professional career in technology.'}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-portal-border/50">
                  <div className="flex items-center justify-between text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {bootcamp.startDate ? new Date(bootcamp.startDate).toLocaleDateString() : 'TBD'}
                    </div>
                    <div>
                      {bootcamp.status || 'RECRUITING'}
                    </div>
                  </div>

                  {status ? (
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full py-4 bg-white/5 border border-white/10 text-portal-text rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                    >
                      View Status
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate(`/apply/${bootcamp._id}`)}
                      className="w-full py-4 bg-portal-accent text-portal-bg rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-portal-accent/20"
                    >
                      Enroll Now
                      <Zap className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-portal-accent/5 rounded-full blur-[50px] group-hover:bg-portal-accent/10 transition-all" />
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-portal-card border border-portal-border border-dashed rounded-[40px]">
            <AlertCircle className="w-16 h-16 text-portal-text-muted mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-bold text-portal-text">No bootcamps matching your criteria.</h3>
            <p className="text-portal-text-muted mt-2">Try adjusting your search or filter to see more programs.</p>
          </div>
        )}
      </div>
    </div>
  );
};
