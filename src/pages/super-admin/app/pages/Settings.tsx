import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { Save, Shield, KeyRound, Globe, User, Eye, EyeOff, ArrowLeft, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export function Settings() {
  const navigate = useNavigate();
  const auth = useAuth() as { logout?: () => void };
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'admin@bms.com',
    phone: '+1 (555) 123-4567',
    role: 'Super Administrator'
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security & Password', icon: KeyRound },
    { id: 'general', label: 'System Settings', icon: Globe },
  ];

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleLogout = () => {
    auth.logout?.();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-[#eaeef2] dark:hover:bg-[#21262d] rounded-lg transition-colors text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#c9d1d9]">Settings</h1>
          <p className="text-[#57606a] dark:text-[#8b949e]">Manage your profile, security, and system configuration.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-xl overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-4 min-h-[600px]">
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-[#d0d7de] dark:border-[#30363d] p-4 flex flex-row md:flex-col gap-1 overflow-x-auto bg-[#f6f8fa] dark:bg-[#0d1117]">
            <div className="flex flex-row md:flex-col gap-1 flex-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors w-full text-left whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-white dark:bg-[#21262d] font-semibold text-[#24292f] dark:text-[#c9d1d9] border border-[#d0d7de] dark:border-[#30363d] shadow-sm"
                      : "text-[#57606a] dark:text-[#8b949e] hover:bg-[#eaeef2] dark:hover:bg-[#21262d]"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center md:items-stretch md:mt-auto pt-0 md:pt-4 ml-4 md:ml-0 md:border-t border-[#d0d7de] dark:border-[#30363d]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors w-full text-left whitespace-nowrap text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="md:col-span-3 p-6 sm:p-8 space-y-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-2">Profile Information</h2>
                  
                  <div className="flex items-start gap-6 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-[#f06a6a] text-white text-2xl">SA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-[#57606a] dark:text-[#8b949e] mb-2">Profile Picture</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Upload New Photo</Button>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profile.role}
                        disabled
                        className="bg-[#f6f8fa] dark:bg-[#0d1117]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Profile
                  </Button>
                </div>
              </>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-2">Change Password</h2>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">Must be at least 8 characters long</p>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#c9d1d9]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-2">Security Options</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="2fa" className="w-4 h-4 rounded border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] accent-[#0969da] dark:accent-[#2f81f7] cursor-pointer" />
                      <label htmlFor="2fa" className="text-sm text-[#24292f] dark:text-[#c9d1d9] font-medium cursor-pointer">Enable Two-Factor Authentication</label>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="session-timeout" defaultChecked className="w-4 h-4 rounded border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] accent-[#0969da] dark:accent-[#2f81f7] cursor-pointer" />
                      <label htmlFor="session-timeout" className="text-sm text-[#24292f] dark:text-[#c9d1d9] font-medium cursor-pointer">Auto-logout after 30 minutes of inactivity</label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleChangePassword} className="gap-2">
                    <Shield className="w-4 h-4" />
                    Change Password
                  </Button>
                </div>
              </>
            )}

            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-2">Platform Settings</h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#24292f] dark:text-[#c9d1d9] mb-1">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="Bootcamp Management System"
                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] max-w-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#24292f] dark:text-[#c9d1d9] mb-1">Support Email</label>
                      <input
                        type="email"
                        defaultValue="support@bms.edu"
                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] max-w-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#24292f] dark:text-[#c9d1d9] mb-1">Default Division Capacity</label>
                      <input
                        type="number"
                        defaultValue="150"
                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] text-[#24292f] dark:text-[#c9d1d9] max-w-[150px]"
                      />
                      <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">Maximum students per division by default.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9] mb-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-2">Business Rules</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="overlap" className="w-4 h-4 rounded border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] accent-[#0969da] dark:accent-[#2f81f7] cursor-pointer" />
                      <label htmlFor="overlap" className="text-sm text-[#24292f] dark:text-[#c9d1d9] font-medium cursor-pointer">Allow instructor double-booking</label>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="late" defaultChecked className="w-4 h-4 rounded border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] accent-[#0969da] dark:accent-[#2f81f7] cursor-pointer" />
                      <label htmlFor="late" className="text-sm text-[#24292f] dark:text-[#c9d1d9] font-medium cursor-pointer">Mark attendance "Late" after 10 minutes automatically</label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="applications" defaultChecked className="w-4 h-4 rounded border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] accent-[#0969da] dark:accent-[#2f81f7] cursor-pointer" />
                      <label htmlFor="applications" className="text-sm text-[#24292f] dark:text-[#c9d1d9] font-medium cursor-pointer">Enable Waiting List loop for rejected applications</label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveSettings} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}