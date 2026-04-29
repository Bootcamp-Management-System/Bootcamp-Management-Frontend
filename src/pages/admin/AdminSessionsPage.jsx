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

import { useAuth } from '../../context/AuthContext';
import sessionService from '../../services/sessionService';
import { bootcampService } from '../../services/bootcampService';

export const AdminSessionsPage = () => {
  const { user: admin, selectedDivision } = useAuth();
  const currentDivisionName = admin?.division?.name || admin?.divisionName || 'Division';
  const currentDivision = admin?.role === 'super_admin' ? selectedDivision : (admin?.division?._id || admin?.division);

  const [sessions, setSessions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availableInstructors, setAvailableInstructors] = React.useState([]);
  const [availableBootcamps, setAvailableBootcamps] = React.useState([]);
  const [formData, setFormData] = useState({
    title: '',
    bootcamp: '',
    instructor: '',
    location: '',
    date: '',
    time: ''
  });

  React.useEffect(() => {
    const fetchAvailableInstructors = async () => {
      try {
        const res = await sessionService.getAvailableInstructors(currentDivision);
        setAvailableInstructors(res.data || []);
      } catch (error) {
        console.error("Failed to fetch available instructors:", error);
        setAvailableInstructors([]);
      }
    };

    const fetchBootcamps = async () => {
      try {
        const res = await bootcampService.getBootcamps({ division: currentDivision });
        setAvailableBootcamps(res.data || []);
      } catch (error) {
        console.error("Failed to fetch bootcamps:", error);
      }
    };

    if (currentDivision) {
      fetchAvailableInstructors();
      fetchBootcamps();
    }
  }, [currentDivision]);

  React.useEffect(() => {
    if (selectedSession) {
      setFormData({
        title: selectedSession.title || '',
        bootcamp: selectedSession.bootcamp?._id || selectedSession.bootcamp || '',
        instructor: selectedSession.instructor?._id || selectedSession.instructor || '',
        location: selectedSession.location || '',
        date: selectedSession.startTime ? new Date(selectedSession.startTime).toISOString().split('T')[0] : '',
        time: selectedSession.startTime ? new Date(selectedSession.startTime).toTimeString().slice(0, 5) : ''
      });
    } else {
      setFormData({
        title: '',
        bootcamp: '',
        instructor: '',
        location: '',
        date: '',
        time: ''
      });
    }
  }, [selectedSession, isModalOpen]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await sessionService.getSessions({ division: currentDivision });
      setSessions(res.data || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startTime = new Date(`${formData.date}T${formData.time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Assume 1 hour duration

      const sessionData = {
        title: formData.title,
        bootcamp: formData.bootcamp,
        division: currentDivision,
        instructor: formData.instructor || undefined,
        location: formData.location,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      if (selectedSession) {
        await sessionService.updateSession(selectedSession._id, sessionData);
      } else {
        await sessionService.createSession(sessionData);
      }

      setIsModalOpen(false);
      fetchSessions();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  React.useEffect(() => {
    if (currentDivision) {
      fetchSessions();
    }
  }, [currentDivision]);

  const columns = [
    {
      header: 'Session',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-portal-text mb-0.5">{row.title}</span>
          <div className="flex items-center gap-2 text-[10px] text-portal-text-muted">
            <User className="w-2.5 h-2.5" /> {row.instructor?.name || 'Unassigned'}
          </div>
        </div>
      )
    },
    {
      header: 'Timing',
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-portal-text">
            <Calendar className="w-3 h-3 text-portal-accent" />
            {new Date(row.startTime).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-portal-text-muted mt-1">
            <Clock className="w-3 h-3" />
            {new Date(row.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
    {
      header: 'Division',
      render: (row) => {
        const divName = row.division?.name || row.division;
        return (
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${divName === 'Development' ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' :
              divName === 'Cyber Security' ? 'bg-red-400/10 border-red-400/20 text-red-400' :
                divName === 'Data Science' ? 'bg-purple-400/10 border-purple-400/20 text-purple-400' :
                  'bg-orange-400/10 border-orange-400/20 text-orange-400'
            }`}>
            {divName}
          </span>
        );
      }
    },
    {
      header: 'State',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
          <span className={`text-[10px] font-bold uppercase tracking-widest ${row.status === 'Live' ? 'text-red-400' : 'text-portal-text-muted'
            }`}>
            {row.status || 'Scheduled'}
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
      onClick: async (s) => {
        try {
          await sessionService.deleteSession(s._id);
          fetchSessions();
        } catch (err) {
          console.error("Failed to delete", err);
        }
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-portal-text">{currentDivisionName} Division Admin</h2>
          <p className="text-portal-text-muted">Broadcast and schedule learning sessions for the {currentDivisionName} division.</p>
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
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Session Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Masterclass: Node Systems"
                className="w-full bg-portal-input border border-portal-border rounded-2xl px-5 py-4 text-portal-text outline-none focus:border-portal-accent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Target Bootcamp</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-accent z-10" />
                <select
                  className="w-full bg-portal-input border border-portal-border rounded-xl pl-12 pr-4 py-3 text-portal-text outline-none focus:border-portal-accent appearance-none"
                  value={formData.bootcamp}
                  onChange={(e) => setFormData({ ...formData, bootcamp: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Bootcamp</option>
                  {availableBootcamps.map(bc => (
                    <option key={bc._id} value={bc._id}>{bc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Instructor Node</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-accent z-10" />
                  <select
                    className="w-full bg-portal-input border border-portal-border rounded-xl pl-12 pr-4 py-3 text-portal-text outline-none focus:border-portal-accent appearance-none"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  >
                    <option value="" disabled>Select Instructor</option>
                    {availableInstructors.map(instructor => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.name} ({instructor.email}) - {instructor.campusId || 'No ID'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-accent" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Room 101, Online"
                    className="w-full bg-portal-input border border-portal-border rounded-xl pl-12 pr-4 py-3 text-portal-text outline-none focus:border-portal-accent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Execution Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-portal-text-muted uppercase tracking-widest">Start Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 font-bold text-portal-text-muted hover:text-portal-text transition-colors">Abort</button>
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
