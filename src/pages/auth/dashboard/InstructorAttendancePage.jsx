import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search,
  RefreshCw,
  ChevronRight,
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import sessionService from '../../../services/sessionService';
import enrollmentService from '../../../services/enrollmentService';
import attendanceService from '../../../services/attendanceService';
import { motion, AnimatePresence } from 'framer-motion';

export const InstructorAttendancePage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const divisionId = user?.division?._id || user?.division;

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sessionService.getSessions({ division: divisionId });
      const allSessions = res.data || [];
      // Filter for sessions where this user is the instructor
      const mySessions = allSessions.filter(s => 
        (s.instructor?._id || s.instructor) === (user?.id || user?._id)
      ).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      setSessions(mySessions);
    } catch (err) {
      setError('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  }, [divisionId, user]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    setLoading(true);
    setError('');
    try {
      // 1. Fetch students enrolled in the bootcamp
      const enrollmentRes = await enrollmentService.getBootcampEnrollments(session.bootcamp?._id || session.bootcamp);
      const studentList = enrollmentRes.data || [];
      setStudents(studentList);

      // 2. Fetch existing attendance for this session
      const attendanceRes = await attendanceService.getAttendance({ sessionId: session._id });
      const records = {};
      (attendanceRes.data || []).forEach(record => {
        records[record.student?._id || record.student] = record.status;
      });
      setAttendanceRecords(records);
    } catch (err) {
      setError('Failed to load student list or attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    setMarking(true);
    try {
      await attendanceService.markAttendance({
        studentId,
        sessionId: selectedSession._id,
        status,
        note: `Marked manually by instructor ${user.name}`
      });
      setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: students.length,
    present: Object.values(attendanceRecords).filter(s => s === 'Present').length,
    absent: Object.values(attendanceRecords).filter(s => s === 'Absent').length,
    late: Object.values(attendanceRecords).filter(s => s === 'Late').length,
  };

  if (!selectedSession) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h2 className="text-3xl font-extrabold text-portal-text mb-2">Attendance Control</h2>
          <p className="text-portal-text-muted">Select a session you instruct to manage student attendance.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-portal-accent" /></div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400 text-center">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="bg-portal-card border border-portal-border rounded-3xl p-20 text-center shadow-xl">
            <Calendar className="w-16 h-16 text-portal-text-muted mx-auto mb-6 opacity-20" />
            <h3 className="text-xl font-bold text-portal-text">No Sessions Found</h3>
            <p className="text-portal-text-muted mt-2">You are not assigned as an instructor to any upcoming or past sessions in this division.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
              <motion.div
                whileHover={{ y: -5 }}
                key={session._id}
                onClick={() => handleSelectSession(session)}
                className="bg-portal-card border border-portal-border rounded-2xl p-6 cursor-pointer hover:border-portal-accent transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-portal-accent/10 text-portal-accent group-hover:bg-portal-accent group-hover:text-white transition-colors">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-portal-text-muted group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-portal-text text-lg mb-2 truncate">{session.title}</h3>
                <div className="space-y-2 text-sm text-portal-text-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(session.startTime).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedSession(null)}
            className="p-3 rounded-xl bg-portal-card border border-portal-border text-portal-text-muted hover:text-portal-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-portal-text">{selectedSession.title}</h2>
            <p className="text-portal-text-muted text-sm">Attendance List • {new Date(selectedSession.startTime).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-portal-card border border-portal-border rounded-xl px-4 py-2 flex items-center gap-4 text-sm font-bold">
            <div className="text-green-400">{stats.present} Present</div>
            <div className="text-red-400">{stats.absent} Absent</div>
            <div className="text-yellow-400">{stats.late} Late</div>
          </div>
          <button 
            onClick={() => handleSelectSession(selectedSession)}
            className="p-3 rounded-xl bg-portal-card border border-portal-border text-portal-text-muted hover:text-portal-text transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-portal-text-muted" />
        <input 
          type="text"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-portal-card border border-portal-border rounded-2xl pl-12 pr-4 py-4 text-portal-text outline-none focus:border-portal-accent transition-all"
        />
      </div>

      {loading && students.length === 0 ? (
        <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-portal-accent" /></div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-portal-card border border-portal-border rounded-3xl">
          <Users className="w-12 h-12 text-portal-text-muted mx-auto mb-4 opacity-20" />
          <p className="text-portal-text-muted">No students found matching your search.</p>
        </div>
      ) : (
        <div className="bg-portal-card border border-portal-border rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-portal-bg border-b border-portal-border">
                <th className="px-6 py-4 text-xs font-bold text-portal-text-muted uppercase tracking-widest">Student Info</th>
                <th className="px-6 py-4 text-xs font-bold text-portal-text-muted uppercase tracking-widest text-center">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-portal-border">
              {filteredStudents.map((enrollment) => {
                const s = enrollment.student;
                const status = attendanceRecords[s._id];
                return (
                  <tr key={s._id} className="hover:bg-portal-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-portal-accent/20 flex items-center justify-center text-portal-accent font-bold">
                          {s.name?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-portal-text">{s.name}</div>
                          <div className="text-xs text-portal-text-muted">{s.email}</div>
                          {s.campusId && <div className="text-[10px] font-mono text-portal-accent uppercase mt-0.5">{s.campusId}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          disabled={marking}
                          onClick={() => markAttendance(s._id, 'Present')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            status === 'Present' 
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                              : 'bg-portal-bg text-portal-text-muted hover:text-green-400 border border-portal-border'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Present
                        </button>
                        <button
                          disabled={marking}
                          onClick={() => markAttendance(s._id, 'Late')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            status === 'Late' 
                              ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' 
                              : 'bg-portal-bg text-portal-text-muted hover:text-yellow-400 border border-portal-border'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          Late
                        </button>
                        <button
                          disabled={marking}
                          onClick={() => markAttendance(s._id, 'Absent')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            status === 'Absent' 
                              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                              : 'bg-portal-bg text-portal-text-muted hover:text-red-400 border border-portal-border'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
