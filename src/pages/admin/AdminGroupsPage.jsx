import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  UserPlus,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { groupService } from '../../services/groupService';
import { bootcampService } from '../../services/bootcampService';
import { userService } from '../../services/userService';

export const AdminGroupsPage = () => {
  const { user: admin, selectedDivision } = useAuth();
  const currentDivisionId = admin?.role === 'super_admin' ? selectedDivision : admin?.division;
  
  const [groups, setGroups] = useState([]);
  const [bootcamps, setBootcamps] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bootcamp: '',
    instructor: '',
    description: '',
    members: []
  });

  useEffect(() => {
    fetchData();
  }, [currentDivisionId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, bootcampsRes, usersRes] = await Promise.all([
        groupService.getGroups(currentDivisionId),
        bootcampService.getBootcamps(currentDivisionId),
        userService.getUsers() // We'll filter these locally for now
      ]);
      
      setGroups(groupsRes.data);
      setBootcamps(bootcampsRes.data);
      
      // Filter instructors and students by division scope
      const allUsers = usersRes.data || [];
      setInstructors(allUsers.filter(u => u.role === 'instructor'));
      setStudents(allUsers.filter(u => u.role === 'student'));
    } catch (error) {
      console.error('Failed to fetch groups data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedGroup) {
        await groupService.updateGroup(selectedGroup._id, formData);
      } else {
        await groupService.createGroup({ ...formData, division: currentDivisionId });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const columns = [
    { 
      header: 'Group Name', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-portal-accent/10 flex items-center justify-center font-bold text-portal-accent border border-portal-accent/20">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-portal-text">{row.name}</div>
            <div className="text-[10px] text-portal-text-muted uppercase tracking-wider">{row.bootcamp?.name}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Lead Instructor', 
      render: (row) => (
        <div className="flex items-center gap-2 text-sm text-portal-text">
          <GraduationCap className="w-4 h-4 text-portal-accent" />
          {row.instructor?.name || 'Unassigned'}
        </div>
      )
    },
    { 
      header: 'Members', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-portal-text-muted" />
          <span className="text-sm text-portal-text">{row.members?.length || 0} Specialists</span>
        </div>
      )
    }
  ];

  const actions = [
    { label: 'Edit', icon: Edit2, onClick: (g) => { 
      setSelectedGroup(g); 
      setFormData({
        name: g.name,
        bootcamp: g.bootcamp?._id,
        instructor: g.instructor?._id,
        description: g.description,
        members: g.members?.map(m => m._id) || []
      });
      setIsModalOpen(true); 
    }},
    { label: 'Delete', icon: Trash2, className: 'text-red-400', onClick: async (g) => {
      if(window.confirm('Delete this group?')) {
        await groupService.deleteGroup(g._id);
        fetchData();
      }
    }}
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-portal-text">Focus Groups</h2>
          <p className="text-portal-text-muted">Organize specialists into mentored research and development clusters.</p>
        </div>
        <button 
          onClick={() => { 
            setSelectedGroup(null); 
            setFormData({ name: '', bootcamp: '', instructor: '', description: '', members: [] });
            setIsModalOpen(true); 
          }}
          className="bg-portal-accent text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-portal-accent/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Group
        </button>
      </header>

      <DataTable 
        columns={columns} 
        data={groups} 
        actions={actions}
        loading={loading}
        searchPlaceholder="Locate groups..."
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedGroup ? 'Edit Group' : 'Initialize New Group'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest pl-1">Group Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Neural Networks A" 
                className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent" 
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest pl-1">Target Bootcamp</label>
              <select 
                value={formData.bootcamp}
                onChange={(e) => setFormData({...formData, bootcamp: e.target.value})}
                className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent"
                required
              >
                <option value="">Select Bootcamp</option>
                {bootcamps.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest pl-1">Lead Instructor</label>
            <select 
              value={formData.instructor}
              onChange={(e) => setFormData({...formData, instructor: e.target.value})}
              className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text outline-none focus:border-portal-accent"
            >
              <option value="">Assign Mentor (Optional)</option>
              {instructors.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest pl-1">Members Assignment</label>
            <div className="bg-portal-input/40 border border-portal-border rounded-2xl p-4 max-h-40 overflow-y-auto custom-scrollbar">
               {students.length > 0 ? students.map(student => (
                 <label key={student._id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.members.includes(student._id)}
                      onChange={(e) => {
                        const newMembers = e.target.checked 
                          ? [...formData.members, student._id]
                          : formData.members.filter(id => id !== student._id);
                        setFormData({...formData, members: newMembers});
                      }}
                      className="accent-portal-accent"
                    />
                    <span className="text-sm text-portal-text">{student.name}</span>
                 </label>
               )) : (
                 <p className="text-xs text-portal-text-muted italic text-center py-4">No specialists available in this division.</p>
               )}
            </div>
          </div>

          <div className="flex justify-end pt-6 gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-portal-text-muted">Cancel</button>
            <button type="submit" className="bg-portal-accent text-white px-10 py-3 rounded-xl font-bold transition-all hover:scale-[1.02]">
              {selectedGroup ? 'Update Group' : 'Create Group'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
