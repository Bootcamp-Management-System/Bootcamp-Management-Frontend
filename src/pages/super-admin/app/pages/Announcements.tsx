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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">Announcements</h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">Broadcast important messages to users, instructors, admins, or specific divisions.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewAnnouncement({ title: '', content: '', audience: 'All Users', division: '' });
            setCreateDialogOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Audience Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {[
          { value: 'All', label: 'All Announcements', count: announcements.length },
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
              "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
              selectedAudience === tab.value
                ? "bg-[#ddf4ff] text-[#0969da] dark:bg-[#2f81f7]/20 dark:text-[#58a6ff] border-[#0969da] dark:border-[#2f81f7]"
                : "bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d] hover:border-[#8b949e]"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div 
            key={announcement._id || announcement.id}
            className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-lg bg-[#ddf4ff] dark:bg-[#2f81f7]/20 text-[#0969da] dark:text-[#58a6ff]">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-[#57606a] dark:text-[#8b949e] mb-3">
                    {announcement.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium border",
                      getAudienceColor(announcement.audience)
                    )}>
                      {getAudienceIcon(announcement.audience)}
                      {announcement.audience}
                      {announcement.division && `: ${announcement.division}`}
                    </span>
                    <span className="text-[#57606a] dark:text-[#8b949e]">
                      By {announcement.author?.name || 'Admin'}
                    </span>
                    <span className="text-[#57606a] dark:text-[#8b949e]">•</span>
                    <span className="text-[#57606a] dark:text-[#8b949e]">
                      {new Date(announcement.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditModal(announcement)}
                  className="p-2 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#ddf4ff] dark:hover:bg-[#2f81f7]/20 rounded-md transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(announcement._id)}
                  className="p-2 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#f85149]/20 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl p-12 text-center">
            <Megaphone className="w-12 h-12 mx-auto text-[#57606a] dark:text-[#8b949e] mb-4 opacity-50" />
            <p className="text-[#24292f] dark:text-[#c9d1d9] font-medium">No announcements found</p>
            <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">Create your first announcement to get started.</p>
          </div>
        )}
      </div>

      {/* Create Announcement Dialog */}
      {createDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCreateDialogOpen(false)}
          />
          <div className="relative w-full max-w-xl rounded-xl border border-[#30363d] bg-white dark:bg-[#161b22] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
                <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-1">
                  Broadcast an important message to your selected audience.
                </p>
              </div>
              <button
                onClick={() => setCreateDialogOpen(false)}
                className="text-sm font-bold text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#57606a] dark:text-[#8b949e] mb-1">Announcement Title</label>
                <input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7]"
                  placeholder="e.g., Important Update"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#57606a] dark:text-[#8b949e] mb-1">Message</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full min-h-24 rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7]"
                  placeholder="Write your announcement message here..."
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57606a] dark:text-[#8b949e] mb-1">Target Audience</label>
                <div className="relative">
                  <select
                    value={newAnnouncement.audience}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, audience: e.target.value })}
                    className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] appearance-none cursor-pointer"
                  >
                    {audienceOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#57606a] dark:text-[#8b949e]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {newAnnouncement.audience === 'Division' && (
                <div>
                  <label className="block text-xs font-semibold text-[#57606a] dark:text-[#8b949e] mb-1">Select Division</label>
                  <div className="relative">
                    <select
                      value={newAnnouncement.division}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, division: e.target.value })}
                      className="w-full rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] px-3 py-2 text-sm text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Choose a division</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Development">Development</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="CPD">CPD</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#57606a] dark:text-[#8b949e]">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setCreateDialogOpen(false);
                    setEditingId(null);
                  }}
                  className="px-3 py-2 rounded-md border border-[#d0d7de] dark:border-[#30363d] text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  className="px-3 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {editingId ? 'Save Changes' : 'Send Announcement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}