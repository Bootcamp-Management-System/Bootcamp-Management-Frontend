import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Users, GraduationCap, Layers, ShieldCheck, Send, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { announcementService } from '../../../../services/announcementService';

const audienceOptions = [
  { value: 'All Users', label: 'All Users', icon: Users, color: 'bg-[#ddf4ff] text-[#0969da]' },
  { value: 'All Students', label: 'All Students', icon: GraduationCap, color: 'bg-[#fff8c5] text-[#9a6700]' },
  { value: 'All Instructors', label: 'All Instructors', icon: GraduationCap, color: 'bg-[#f4ecff] text-[#8250df]' },
  { value: 'All Admins', label: 'All Admins', icon: ShieldCheck, color: 'bg-[#ffebe9] text-[#cf222e]' },
  { value: 'Division', label: 'Specific Division', icon: Layers, color: 'bg-[#dafbe1] text-[#1a7f37]' },
];

export function Announcements() {
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    audience: 'All Users',
    division: ''
  });

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const res = await announcementService.getAnnouncements();
      setAnnouncements(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter(a => 
    selectedAudience === 'All' ? true : a.audience === selectedAudience
  );

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      return toast.error("Title and content are required");
    }
    try {
      if (editingId) {
        await announcementService.updateAnnouncement(editingId, newAnnouncement);
        toast.success('Announcement updated successfully');
      } else {
        await announcementService.createAnnouncement(newAnnouncement);
        toast.success('Announcement created and sent successfully');
      }
      setCreateDialogOpen(false);
      setEditingId(null);
      setNewAnnouncement({
        title: '',
        content: '',
        audience: 'All Users',
        division: ''
      });
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.error || (editingId ? 'Failed to update announcement' : 'Failed to create announcement'));
    }
  };

  const openEditModal = (announcement: any) => {
    setEditingId(announcement._id);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      audience: announcement.audience,
      division: announcement.division || ''
    });
    setCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await announcementService.deleteAnnouncement(id);
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (error: any) {
      toast.error('Failed to delete announcement');
    }
  };

  const getAudienceIcon = (audience: string) => {
    const option = audienceOptions.find(o => o.value === audience);
    if (!option) return <Users className="w-4 h-4" />;
    const Icon = option.icon;
    return <Icon className="w-4 h-4" />;
  };

  const getAudienceColor = (audience: string) => {
    const option = audienceOptions.find(o => o.value === audience);
    return option?.color || 'bg-[#f6f8fa] text-[#57606a]';
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-portal-text tracking-tight uppercase">Broadcast Hub</h1>
          <p className="text-portal-text-muted mt-1 uppercase tracking-widest text-[10px] font-black">Centralized Communication Dispatcher</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewAnnouncement({ title: '', content: '', audience: 'All Users', division: '' });
            setCreateDialogOpen(true);
          }}
          className="flex items-center gap-3 px-6 py-3 bg-portal-accent hover:bg-portal-accent-hover text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-portal-accent/20"
        >
          <Plus className="w-5 h-5" />
          Dispatch Broadcast
        </button>
      </div>

      {/* Audience Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {[
          { value: 'All', label: 'Global Logs', count: announcements.length },
          { value: 'All Users', label: 'All Users', count: announcements.filter(a => a.audience === 'All Users').length },
          { value: 'All Students', label: 'Students', count: announcements.filter(a => a.audience === 'All Students').length },
          { value: 'All Instructors', label: 'Instructors', count: announcements.filter(a => a.audience === 'All Instructors').length },
          { value: 'All Admins', label: 'Admins', count: announcements.filter(a => a.audience === 'All Admins').length },
          { value: 'Division', label: 'Division Specific', count: announcements.filter(a => a.audience === 'Division').length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedAudience(tab.value)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
              selectedAudience === tab.value
                ? "bg-portal-accent text-white border-portal-accent shadow-lg shadow-portal-accent/20"
                : "bg-portal-card text-portal-text-muted border-portal-border hover:border-portal-accent hover:text-portal-text"
            )}
          >
            {tab.label} <span className="opacity-50 ml-2">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAnnouncements.map((announcement) => (
          <div 
            key={announcement._id || announcement.id}
            className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-start gap-6 flex-1">
                <div className="p-4 rounded-2xl bg-portal-accent/10 text-portal-accent border border-portal-accent/20 group-hover:scale-110 transition-transform">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-black text-portal-text tracking-tight uppercase">
                      {announcement.title}
                    </h3>
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
                      getAudienceColor(announcement.audience)
                    )}>
                      {announcement.audience}
                      {announcement.division && `: ${announcement.division}`}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-portal-text-muted mb-6 leading-relaxed max-w-3xl">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-6 text-[10px] font-black text-portal-text-muted uppercase tracking-widest opacity-60">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-portal-accent" />
                      By {announcement.author?.name || 'Admin Authority'}
                    </span>
                    <span>•</span>
                    <span>{new Date(announcement.createdAt || Date.now()).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(announcement)}
                  className="p-3 text-portal-accent hover:bg-portal-accent/10 rounded-xl transition-all"
                  title="Edit Broadcast"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(announcement._id)}
                  className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Delete Broadcast"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <Megaphone className="absolute -right-8 -bottom-8 w-40 h-40 text-portal-text/5 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="bg-portal-card border-2 border-dashed border-portal-border rounded-3xl p-24 text-center">
            <Megaphone className="w-16 h-16 mx-auto text-portal-text/10 mb-6" />
            <p className="text-xl font-black text-portal-text uppercase tracking-widest">Silence on the Wire</p>
            <p className="text-sm font-medium text-portal-text-muted mt-2">No broadcasts found matching your current filter criteria.</p>
          </div>
        )}
      </div>

      {/* Create Announcement Dialog */}
      {createDialogOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setCreateDialogOpen(false)}
          />
          <div className="relative w-full max-w-xl rounded-3xl border border-portal-border bg-portal-card p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-start justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-black text-portal-text tracking-tight uppercase">
                  {editingId ? 'Modify Broadcast' : 'Initialize Broadcast'}
                </h2>
                <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest mt-2">
                  Emergency override and global notification system.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Transmission Title</label>
                <input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full bg-portal-input border border-portal-border rounded-2xl px-5 py-3 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all font-bold"
                  placeholder="Subject of broadcast..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Payload Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full min-h-[160px] bg-portal-input border border-portal-border rounded-2xl px-5 py-4 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all font-medium leading-relaxed"
                  placeholder="Detailed broadcast message payload..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Target Audience</label>
                  <div className="relative">
                    <select
                      value={newAnnouncement.audience}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, audience: e.target.value })}
                      className="w-full bg-portal-input border border-portal-border rounded-2xl px-5 py-3 text-sm text-portal-text font-black uppercase tracking-widest appearance-none cursor-pointer focus:outline-none focus:border-portal-accent transition-all"
                    >
                      {audienceOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {newAnnouncement.audience === 'Division' && (
                  <div className="space-y-2 animate-in slide-in-from-right-4 duration-300">
                    <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Division Filter</label>
                    <select
                      value={newAnnouncement.division}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, division: e.target.value })}
                      className="w-full bg-portal-input border border-portal-border rounded-2xl px-5 py-3 text-sm text-portal-text font-black uppercase tracking-widest appearance-none cursor-pointer focus:outline-none focus:border-portal-accent transition-all"
                    >
                      <option value="" disabled>Select Segment</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Development">Development</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="CPD">CPD</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={() => {
                    setCreateDialogOpen(false);
                    setEditingId(null);
                  }}
                  className="px-8 py-3 rounded-2xl border border-portal-border text-[10px] font-black uppercase tracking-widest text-portal-text-muted hover:bg-portal-bg transition-all"
                >
                  Abort
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  className="px-8 py-3 rounded-2xl bg-portal-accent hover:bg-portal-accent-hover text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-portal-accent/20 transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  {editingId ? 'Update Signal' : 'Send Broadcast'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}