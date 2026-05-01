import React, { useState } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  Mail, 
  ShieldCheck,
  Award,
  BookOpen,
  Eye,
  Clock,
  Layers,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { divisionService } from '../../services/divisionService';
import { userService } from '../../services/userService';

export const AdminInstructorsPage = () => {
  const { user: admin } = useAuth();
  const [divisions, setDivisions] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const adminDivisionId = admin?.division?._id || admin?.division || '';
  const adminDivisionName =
    divisions.find((division) => division._id === adminDivisionId || division.id === adminDivisionId)?.name ||
    (typeof admin?.division === 'object' ? admin.division.name : null) ||
    'All';
  const currentDivision = adminDivisionName;
  
  const [instructors, setInstructors] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSelectMemberModalOpen, setIsSelectMemberModalOpen] = useState(false);
  const [isCandidateInfoModalOpen, setIsCandidateInfoModalOpen] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [promoteToRole, setPromoteToRole] = useState('instructor');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [infoInstructor, setInfoInstructor] = useState(null);
  const [promoteMember, setPromoteMember] = useState(null);
  const [isPromoting, setIsPromoting] = useState(false);
  const [promoteError, setPromoteError] = useState('');
  const [promoteSuccess, setPromoteSuccess] = useState(null);

  const buildDisplayUser = React.useCallback((user) => {
    const email = user?.email || '';
    const nameSource = user?.name || email.split('@')[0] || 'User';
    const cleanName = nameSource.replace(/[._-]+/g, ' ').trim();
    const prettyName = cleanName ? `${cleanName.charAt(0).toUpperCase()}${cleanName.slice(1)}` : 'User';
    let divisionName = user?.division?.name || user?.division || 'Unassigned';
    const divisionObj = divisions.find(d => d._id === divisionName || d.id === divisionName);
    if (divisionObj) {
      divisionName = divisionObj.name;
    }

    const divisionId = user?.division?._id || user?.division || '';
    
    const assignedNames = Array.isArray(user?.assignedDivisions)
      ? user.assignedDivisions.map((div) => {
          const idOrName = div?.name || div;
          const divObj = divisions.find(d => d._id === idOrName || d.id === idOrName);
          return divObj ? divObj.name : idOrName;
        }).filter(Boolean)
      : [];

    const instructorMembershipNames = Array.isArray(user?.memberships)
      ? user.memberships
          .filter((membership) => membership?.isInstructor)
          .map((membership) => {
            const idOrName = membership?.division?.name || membership?.division;
            const divObj = divisions.find(d => d._id === idOrName || d.id === idOrName);
            return divObj ? divObj.name : idOrName;
          })
          .filter(Boolean)
      : [];

    const allInstructorDivisions = Array.from(new Set([
      ...assignedNames,
      ...instructorMembershipNames,
      divisionName !== 'Unassigned' ? divisionName : null,
    ].filter(Boolean)));

    return {
      id: user?._id || user?.id || email,
      name: prettyName,
      email,
      role: user?.role,
      division: divisionName,
      divisionId,
      assignedDivisions: allInstructorDivisions,
      status: user?.verified ? 'Active' : 'Pending',
      idNo: user?.campusId || user?.idNo || (user?._id ? user._id.slice(-6).toUpperCase() : 'N/A'),
    };
  }, [divisions]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    setLoadError('');
    try {
      const response = await userService.getUsers();
      const userData = response?.data || response?.data?.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      setUsers([]);
      setLoadError(error?.response?.data?.message || error?.message || 'Failed to load users.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    const loadDivisions = async () => {
      try {
        const response = await divisionService.getDivisions();
        const divisionData = response?.data || response?.data?.data || [];
        setDivisions(Array.isArray(divisionData) ? divisionData : []);
      } catch {
        setDivisions([]);
      }
    };

    loadDivisions();
    loadUsers();
  }, []);

  React.useEffect(() => {
    const filteredInstructors = users
      .filter((user) => user?.role === 'instructor')
      .map(buildDisplayUser)
      .filter((user) => (
        currentDivision === 'All' ||
        user.division === currentDivision ||
        user.assignedDivisions?.includes(currentDivision)
      ));
    setInstructors(filteredInstructors);

    let filteredMembers = users
      .filter((user) => user?.role === 'student')
      .map(buildDisplayUser)
      .filter((user) => 
        currentDivision === 'All' || 
        user.division === currentDivision || 
        (user.assignedDivisions && user.assignedDivisions.includes(currentDivision))
      );
    
    setMembers(filteredMembers);
  }, [buildDisplayUser, currentDivision, users]);

  const resolveDivisionId = (divisionValue) => {
    if (!divisionValue) return null;
    const matchById = divisions.find((division) => division._id === divisionValue || division.id === divisionValue);
    if (matchById) return matchById._id || matchById.id;
    const matchByName = divisions.find((division) => division.name === divisionValue);
    return matchByName ? matchByName._id || matchByName.id : null;
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    setCreatedCredentials(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();

    if (!email) {
      setFormError('Email is required.');
      setIsSubmitting(false);
      return;
    }

    const divisionId = adminDivisionId;

    try {
      const response = await userService.createUser({
        email,
        role: 'instructor',
        division: divisionId || undefined,
      });

      setCreatedCredentials({ email, tempPassword: response?.tempPassword || '' });
      await loadUsers();
    } catch (error) {
      setFormError(error?.response?.data?.message || error?.message || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromoteUser = async (event) => {
    event.preventDefault();
    setPromoteError('');
    setIsPromoting(true);
    setPromoteSuccess(null);

    const form = new FormData(event.currentTarget);
    const reason = String(form.get('reason') || '').trim();
    const selectedDivisionValue = form.get('division');

    const divisionId = adminDivisionId;

    if (!promoteMember?.id) {
      setPromoteError('No member selected.');
      setIsPromoting(false);
      return;
    }

    try {
      const response = await userService.promoteUser(promoteMember.id, {
        newRole: promoteToRole,
        divisionId: promoteToRole === 'admin' ? selectedDivisionValue : divisionId,
        reason,
      });

      setPromoteSuccess({ tempPassword: response?.tempPassword || '' });
      await loadUsers();
      
      if (!response?.tempPassword) {
        setTimeout(() => {
          setIsPromoteModalOpen(false);
          setIsSelectMemberModalOpen(false);
          setPromoteMember(null);
        }, 1500);
      }
    } catch (error) {
      setPromoteError(error?.response?.data?.message || error?.message || 'Failed to promote member.');
    } finally {
      setIsPromoting(false);
    }
  };

  const handleDivisionChange = async (instructor, divisionValue) => {
    const divisionId = resolveDivisionId(divisionValue);
    if (!divisionId) return;

    try {
      await userService.updateUser(instructor.id, { division: divisionId });
      await loadUsers();
    } catch (error) {
      setLoadError(error?.response?.data?.message || error?.message || 'Failed to update division.');
    }
  };

  const columns = [
    { 
      header: 'Instructor', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center font-bold text-purple-400 border border-purple-400/20">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-portal-text">{row.name}</div>
            <div className="text-[10px] text-portal-text-muted flex items-center gap-1">
              <Mail className="w-2 h-2" /> {row.email}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Specialization', 
      render: () => (
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-portal-accent" />
          <span className="text-xs text-portal-text/80 font-medium">Senior Lead</span>
        </div>
      )
    },
    { 
      header: 'Sessions', 
      render: () => <span className="text-sm font-bold text-portal-accent">12</span>
    },
    { 
      header: 'Assigned Divisions', 
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.assignedDivisions?.length ? row.assignedDivisions.map((div, i) => (
            <span key={i} className="text-[9px] font-bold bg-white/5 text-portal-text/70 px-2 py-0.5 rounded-full border border-white/5">
              {div}
            </span>
          )) : (
            <span className="text-[9px] text-portal-text-muted">Unassigned</span>
          )}
        </div>
      )
    },
    { 
      header: 'Primary Division', 
      render: (row) => (
        <select
          value={row.divisionId || ''}
          onChange={(event) => handleDivisionChange(row, event.target.value)}
          className="bg-portal-input border border-portal-border rounded-lg px-2 py-1 text-[10px] font-bold text-portal-text uppercase tracking-widest"
        >
          <option value="">Unassigned</option>
          {divisions.map((division) => (
            <option key={division._id || division.id} value={division._id || division.id}>
              {division.name}
            </option>
          ))}
        </select>
      )
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
          {row.status}
        </span>
      )
    }
  ];

  const actions = [
    { 
      label: 'View Dossier', 
      icon: Eye, 
      onClick: (inst) => {
        setInfoInstructor(inst);
        setIsInfoModalOpen(true);
      }
    },
    { label: 'Edit', icon: Edit2, onClick: (inst) => { setSelectedInstructor(inst); setIsModalOpen(true); } },
    { 
      label: 'Remove', 
      icon: Trash2, 
      className: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
      onClick: (inst) => setInstructors(instructors.filter(i => i.id !== inst.id))
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-portal-text">{currentDivision === 'All' ? 'Global Instructor Cohort' : `${currentDivision} Instructors`}</h2>
          <p className="text-portal-text-muted">Domain experts managing the {currentDivision === 'All' ? 'system-wide' : `${currentDivision}`} curriculum.</p>
        </div>
        <button 
          onClick={() => { setIsSelectMemberModalOpen(true); }}
          className="bg-portal-accent text-portal-bg px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Assign Instructor
        </button>
      </header>

      {isLoadingUsers ? (
        <div className="text-xs text-portal-text-muted">Loading instructors...</div>
      ) : null}
      {loadError ? (
        <div className="text-xs text-red-400">{loadError}</div>
      ) : null}

      <DataTable 
        columns={columns} 
        data={instructors} 
        actions={actions}
        searchPlaceholder="Filter instructors by name..."
      />

      {/* Instructor Info Modal */}
      <AdminModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)}
        title="Dossier: Domain Expert Information"
      >
        {infoInstructor && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-portal-border">
              <div className="w-20 h-20 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center font-black text-3xl text-purple-400">
                {infoInstructor.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-portal-text">{infoInstructor.name}</h3>
                <p className="text-sm font-mono text-portal-accent italic">Certified Professional</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-green-400/10 text-green-400">
                    {infoInstructor.status || 'Active'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-purple-400/10 text-purple-400">
                    Expert Level
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Digital Channel</label>
                  <p className="text-sm text-portal-text flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-portal-accent" /> {infoInstructor.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Assigned Sector</label>
                  <p className="text-sm text-portal-text flex items-center gap-2 font-medium">
                    <Layers className="w-4 h-4 text-portal-accent" /> {adminDivisionName}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Instruction Metrics</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-portal-border rounded-full overflow-hidden">
                       <div className="h-full bg-purple-400" style={{ width: '85%' }} />
                    </div>
                    <span className="text-sm font-black text-portal-text">85% Rating</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Cohort Size</label>
                  <p className="text-sm text-portal-text flex items-center gap-2 font-medium">
                    <Award className="w-4 h-4 text-portal-accent" /> 42 Students Directed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-portal-input/20 border border-portal-border rounded-2xl p-6 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-portal-text uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-portal-accent" />
                Specialist Contribution Timeline
              </h4>
              <div className="space-y-3 font-mono text-[10px] text-portal-text-muted">
                 <div className="flex justify-between border-b border-portal-border/30 pb-2">
                    <span>Broadcasted 'Neural Logic' session</span>
                    <span className="text-portal-text/40">Today, 09:00</span>
                 </div>
                 <div className="flex justify-between border-b border-portal-border/30 pb-2">
                    <span>Validated 12 project submissions</span>
                    <span className="text-portal-text/40">Oct 20, 2026</span>
                 </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setIsInfoModalOpen(false)}
                className="bg-portal-accent text-portal-bg px-8 py-3 rounded-xl font-bold hover:bg-portal-accent-hover transition-colors shadow-lg shadow-portal-accent/20"
              >
                Deactivate View
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedInstructor ? 'Edit Specialist Details' : 'Register New Expert'}
      >
        <form className="space-y-6" onSubmit={handleCreateUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Full Name</label>
              <input type="text" defaultValue={selectedInstructor?.name} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Expert Email</label>
              <input name="email" type="email" defaultValue={selectedInstructor?.email} className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors" />
            </div>
          </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Primary Skillsets (Comma separated)</label>
              <input type="text" placeholder="e.g. Offensive Security, Malware Analysis" className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Operational Role</label>
                <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none" defaultValue="instructor" disabled>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">System Status</label>
                <select className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none" defaultValue={selectedInstructor?.status || 'Active'}>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Target Division</label>
              <div className="bg-portal-input/30 border border-portal-border rounded-xl px-4 py-3 text-portal-text-muted cursor-not-allowed uppercase text-[10px] font-bold tracking-widest">
                {adminDivisionName}
              </div>
            </div>

          <div className="bg-portal-input/20 border border-portal-border rounded-2xl p-6">
             <div className="flex items-center gap-3 text-portal-text-muted">
                <ShieldCheck className="w-5 h-5 text-portal-accent" />
                <p className="text-xs">Instructors registered here will be constrained to the <strong>{currentDivision === 'All' ? 'selected primary' : currentDivision}</strong> division scope.</p>
             </div>
          </div>

          {createdCredentials?.tempPassword ? (
            <div className="bg-portal-accent/10 border border-portal-accent/30 rounded-xl px-4 py-3 text-xs text-portal-text-muted">
              Temporary password for <span className="font-bold text-portal-text">{createdCredentials.email}</span>: <span className="font-mono text-portal-accent">{createdCredentials.tempPassword}</span>
            </div>
          ) : null}

          {formError ? (
            <div className="text-xs font-bold text-red-400">
              {formError}
            </div>
          ) : null}

          <div className="flex justify-end pt-6 gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted hover:text-portal-text transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-portal-accent text-portal-bg px-10 py-3 rounded-xl font-bold shadow-lg shadow-portal-accent/20 disabled:opacity-60">
              {selectedInstructor ? 'Update Specialist' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Select Member to Promote Modal */}
      <AdminModal 
        isOpen={isSelectMemberModalOpen} 
        onClose={() => setIsSelectMemberModalOpen(false)}
        title="Select Member to Promote"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {members.length === 0 ? (
            <div className="text-center text-portal-text-muted py-8 text-sm font-medium bg-portal-input/10 rounded-2xl border border-portal-border/50">
              No eligible members found in this division.
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="bg-portal-input/20 border border-portal-border rounded-xl p-4 flex items-center justify-between hover:bg-portal-input/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-portal-accent/10 flex items-center justify-center font-bold text-portal-accent border border-portal-accent/20 shadow-inner">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-portal-text">{member.name}</div>
                    <div className="text-[11px] text-portal-text-muted mt-0.5">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setCandidateInfo(member);
                      setIsCandidateInfoModalOpen(true);
                    }}
                    className="p-2 hover:bg-portal-accent/10 rounded-xl text-portal-text-muted hover:text-portal-accent transition-all duration-200"
                    title="View Profile"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      setPromoteMember(member);
                      setPromoteSuccess(null);
                      setPromoteError('');
                      setIsPromoteModalOpen(true);
                      setIsSelectMemberModalOpen(false);
                    }}
                    className="px-5 py-2.5 bg-portal-accent/10 text-portal-accent hover:bg-portal-accent hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
                  >
                    Promote
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end pt-6 border-t border-portal-border mt-4">
          <button onClick={() => setIsSelectMemberModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted hover:text-portal-text transition-colors">Close</button>
        </div>
      </AdminModal>

      {/* Candidate Info Modal */}
      <AdminModal 
        isOpen={isCandidateInfoModalOpen} 
        onClose={() => setIsCandidateInfoModalOpen(false)}
        title="Candidate Profile Dossier"
      >
        {candidateInfo && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-portal-border">
              <div className="w-20 h-20 rounded-2xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center font-black text-3xl text-portal-accent shadow-inner">
                {candidateInfo.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-portal-text">{candidateInfo.name}</h3>
                <p className="text-sm font-mono text-portal-accent">{candidateInfo.idNo}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-green-400/10 text-green-400">
                    {candidateInfo.status || 'Active'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-portal-accent/10 text-portal-accent">
                    Eligible for Promotion
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Digital Channel</label>
                  <p className="text-sm text-portal-text flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-portal-accent" /> {candidateInfo.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Active Division</label>
                  <p className="text-sm text-portal-text flex items-center gap-2 font-medium">
                    <Layers className="w-4 h-4 text-portal-accent" /> {candidateInfo.division}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1">
                  <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Experience Topics</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(candidateInfo.experienceTopics || ['React', 'Node.js', 'System Architecture']).map((topic, i) => (
                      <span key={i} className="text-xs font-bold text-portal-text bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-4 border-t border-portal-border flex-wrap">
              {(admin?.role === 'super-admin' || admin?.role === 'super_admin') && (
                <button 
                  onClick={() => {
                    setPromoteToRole('admin');
                    setPromoteMember(candidateInfo);
                    setPromoteSuccess(null);
                    setPromoteError('');
                    setIsCandidateInfoModalOpen(false);
                    setIsSelectMemberModalOpen(false);
                    setIsPromoteModalOpen(true);
                  }}
                  className="bg-red-500/10 text-red-400 px-8 py-3 rounded-xl font-bold hover:bg-red-500/20 transition-all duration-300 shadow-sm flex items-center gap-2 border border-red-500/20"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Promote to Admin
                </button>
              )}
              <button 
                onClick={() => {
                  setPromoteToRole('instructor');
                  setPromoteMember(candidateInfo);
                  setPromoteSuccess(null);
                  setPromoteError('');
                  setIsCandidateInfoModalOpen(false);
                  setIsSelectMemberModalOpen(false);
                  setIsPromoteModalOpen(true);
                }}
                className="bg-portal-accent/10 text-portal-accent px-8 py-3 rounded-xl font-bold hover:bg-portal-accent hover:text-white transition-all duration-300 shadow-sm flex items-center gap-2"
              >
                <ArrowUpRight className="w-5 h-5" />
                Promote to Instructor
              </button>
              <button 
                onClick={() => setIsCandidateInfoModalOpen(false)}
                className="bg-portal-input hover:bg-portal-input/80 text-portal-text px-8 py-3 rounded-xl font-bold transition-colors border border-portal-border/50"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Promote Member Modal */}
      <AdminModal 
        isOpen={isPromoteModalOpen} 
        onClose={() => setIsPromoteModalOpen(false)}
        title={promoteToRole === 'admin' ? 'Promote to Division Admin' : 'Promote to Instructor'}
      >
        <form className="space-y-6" onSubmit={handlePromoteUser}>
          <div className="space-y-4">
            <p className="text-sm text-portal-text-muted bg-portal-input/20 p-4 rounded-xl border border-portal-border/50">
              You are about to promote <span className="font-bold text-portal-text">{promoteMember?.name}</span> to an instructor role.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Target Division</label>
              {(admin?.role === 'super-admin' || admin?.role === 'super_admin') ? (
                <select 
                  name="division"
                  className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors appearance-none"
                  defaultValue={adminDivisionId}
                >
                  {divisions.map(div => (
                    <option key={div._id} value={div._id}>{div.name}</option>
                  ))}
                </select>
              ) : (
                <div className="bg-portal-input/30 border border-portal-border rounded-xl px-4 py-3 text-portal-text-muted cursor-not-allowed uppercase text-[10px] font-bold tracking-widest">
                  {adminDivisionName}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-portal-text-muted uppercase tracking-widest pl-1">Reason for Promotion</label>
              <input name="reason" type="text" placeholder="e.g. Demonstrated excellence in division" className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent transition-colors" required />
            </div>
          </div>

          {promoteSuccess ? (
            <div className="bg-green-400/10 border border-green-400/30 rounded-xl px-4 py-4 text-sm text-green-400 flex flex-col gap-3 shadow-inner">
              <span className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Promotion successful!
              </span>
              {promoteSuccess.tempPassword && (
                <div className="bg-black/20 p-3 rounded-lg border border-green-400/20">
                  <span className="text-xs text-portal-text-muted block mb-1">Temporary password:</span>
                  <span className="font-mono font-bold text-portal-text text-lg tracking-wider">{promoteSuccess.tempPassword}</span>
                </div>
              )}
            </div>
          ) : null}

          {promoteError ? (
            <div className="text-xs font-bold text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {promoteError}
            </div>
          ) : null}

          <div className="flex justify-end pt-6 gap-4 border-t border-portal-border">
            <button type="button" onClick={() => setIsPromoteModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted hover:text-portal-text transition-colors">Cancel</button>
            <button type="submit" disabled={isPromoting || promoteSuccess} className="bg-portal-accent text-portal-bg px-10 py-3 rounded-xl font-bold shadow-lg shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              Confirm Promotion
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
