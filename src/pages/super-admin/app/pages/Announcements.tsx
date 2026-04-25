import React, { useState } from 'react';
import { Megaphone, Plus, Users, GraduationCap, Layers, ShieldCheck, Send, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const mockAnnouncements = [
  { 
    id: 1, 
    title: 'Welcome to Spring 2026 Bootcamp', 
    content: 'We are excited to kick off the Spring 2026 bootcamp session. Please review the updated schedule and resources.', 
    audience: 'All Users',
    author: 'Super Admin',
    date: '2026-04-15',
    division: null
  },
  { 
    id: 2, 
    title: 'New React Workshop Series', 
    content: 'A new advanced React workshop series will begin next week. Check the sessions tab for details.', 
    audience: 'All Instructors',
    author: 'Admin Team',
    date: '2026-04-14',
    division: null
  },
  { 
    id: 3, 
    title: 'Data Science Division Update', 
    content: 'New resources have been added to the Data Science portal. Please review and provide feedback.', 
    audience: 'Division',
    author: 'Sarah Smith',
    date: '2026-04-13',
    division: 'Data Science'
  },
  { 
    id: 4, 
    title: 'Admin Meeting - Q2 Planning', 
    content: 'All admins are invited to the Q2 planning meeting scheduled for April 25th at 2 PM.', 
    audience: 'All Admins',
    author: 'Super Admin',
    date: '2026-04-12',
    division: null
  },
];

const audienceOptions = [
  { value: 'All Users', label: 'All Users', icon: Users, color: 'bg-[#ddf4ff] text-[#0969da]' },
  { value: 'All Instructors', label: 'All Instructors', icon: GraduationCap, color: 'bg-[#f4ecff] text-[#8250df]' },
  { value: 'All Admins', label: 'All Admins', icon: ShieldCheck, color: 'bg-[#ffebe9] text-[#cf222e]' },
  { value: 'Division', label: 'Specific Division', icon: Layers, color: 'bg-[#dafbe1] text-[#1a7f37]' },
];

export function Announcements() {
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    audience: 'All Users',
    division: ''
  });

  const filteredAnnouncements = mockAnnouncements.filter(a => 
    selectedAudience === 'All' ? true : a.audience === selectedAudience
  );

  const handleCreateAnnouncement = () => {
    toast.success('Announcement created and sent successfully');
    setCreateDialogOpen(false);
    setNewAnnouncement({
      title: '',
      content: '',
      audience: 'All Users',
      division: ''
    });
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
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Audience Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {[
          { value: 'All', label: 'All Announcements', count: mockAnnouncements.length },
          { value: 'All Users', label: 'All Users', count: mockAnnouncements.filter(a => a.audience === 'All Users').length },
          { value: 'All Instructors', label: 'Instructors', count: mockAnnouncements.filter(a => a.audience === 'All Instructors').length },
          { value: 'All Admins', label: 'Admins', count: mockAnnouncements.filter(a => a.audience === 'All Admins').length },
          { value: 'Division', label: 'Division Specific', count: mockAnnouncements.filter(a => a.audience === 'Division').length },
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
            key={announcement.id}
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
                      By {announcement.author}
                    </span>
                    <span className="text-[#57606a] dark:text-[#8b949e]">•</span>
                    <span className="text-[#57606a] dark:text-[#8b949e]">
                      {announcement.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#ddf4ff] dark:hover:bg-[#2f81f7]/20 rounded-md transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#f85149]/20 rounded-md transition-colors">
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
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>
              Broadcast an important message to your selected audience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Announcement Title</Label>
              <Input 
                id="title" 
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="e.g., Important Update" 
              />
            </div>
            
            <div>
              <Label htmlFor="content">Message</Label>
              <Textarea 
                id="content" 
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Write your announcement message here..." 
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={newAnnouncement.audience} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, audience: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {newAnnouncement.audience === 'Division' && (
              <div>
                <Label htmlFor="division">Select Division</Label>
                <Select value={newAnnouncement.division} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, division: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="CPD">CPD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement} className="gap-2">
              <Send className="w-4 h-4" />
              Send Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}