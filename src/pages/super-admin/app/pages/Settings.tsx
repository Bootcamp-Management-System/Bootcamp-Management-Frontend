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

  const handleLogout = () => {
    auth.logout?.();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-portal-card border border-portal-border hover:bg-portal-accent/10 hover:border-portal-accent/50 text-portal-text-muted hover:text-portal-accent transition-all shadow-sm"
          title="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-portal-text tracking-tight uppercase">Control Center</h1>
          <p className="text-portal-text-muted mt-1 uppercase tracking-widest text-[10px] font-black">System Identity & Security Protocol</p>
        </div>
      </div>

      <div className="bg-portal-card border border-portal-border rounded-3xl overflow-hidden shadow-xl relative group">
        <div className="grid md:grid-cols-4 min-h-[600px]">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-portal-border p-6 flex flex-row md:flex-col gap-2 overflow-x-auto bg-portal-card/50 backdrop-blur-md">
            <div className="flex flex-row md:flex-col gap-2 flex-1">
              <p className="hidden md:block text-[10px] font-black text-portal-text-muted uppercase tracking-[0.2em] mb-4 ml-2">Navigation</p>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all w-full text-left whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-portal-accent text-white shadow-lg shadow-portal-accent/20 translate-x-2"
                      : "text-portal-text-muted hover:text-portal-text hover:bg-portal-accent/5"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center md:items-stretch md:mt-auto pt-0 md:pt-6 ml-4 md:ml-0 md:border-t border-portal-border/50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all w-full text-left whitespace-nowrap text-red-500 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                Terminate Session
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 p-8 sm:p-12 space-y-10 bg-portal-card/30">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-10">
                  <div className="relative">
                    <h2 className="text-xl font-black text-portal-text uppercase tracking-widest mb-2">Primary Identity</h2>
                    <div className="h-1 w-12 bg-portal-accent rounded-full" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-3xl bg-portal-bg/50 border border-portal-border">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-portal-accent to-purple-500 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-portal-card group-hover:scale-105 transition-transform">
                        SA
                      </div>
                      <button className="absolute -right-2 -bottom-2 p-2 bg-portal-card border border-portal-border rounded-xl text-portal-accent shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h3 className="text-lg font-black text-portal-text uppercase tracking-tight">System Avatar</h3>
                      <p className="text-xs font-bold text-portal-text-muted uppercase tracking-widest mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                        <button className="px-6 py-2 bg-portal-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-portal-accent/20">Update Photo</button>
                        <button className="px-6 py-2 bg-portal-card border border-portal-border text-portal-text-muted text-[10px] font-black uppercase tracking-widest rounded-xl">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Operational Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all font-bold"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Communication Endpoint</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Mobile Uplink</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Assigned Privilege</label>
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="w-full bg-portal-bg/50 border border-portal-border rounded-xl px-4 py-3 text-sm text-portal-text-muted font-black uppercase tracking-tighter cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex justify-end">
                  <button onClick={handleSaveProfile} className="flex items-center gap-3 px-8 py-3 bg-portal-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-portal-accent/20 hover:scale-105 transition-all">
                    <Save className="w-4 h-4" />
                    Commit Changes
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-10">
                  <div className="relative">
                    <h2 className="text-xl font-black text-portal-text uppercase tracking-widest mb-2">Security Override</h2>
                    <div className="h-1 w-12 bg-red-500 rounded-full" />
                  </div>
                  
                  <div className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Current Password Key</label>
                      <div className="relative group">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 pr-12 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-portal-text-muted hover:text-portal-accent transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">New Access Token</label>
                        <div className="relative group">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 pr-12 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-portal-text-muted hover:text-portal-accent transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest ml-1">Confirm Secret</label>
                        <div className="relative group">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 pr-12 text-sm text-portal-text focus:outline-none focus:border-portal-accent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-portal-text-muted hover:text-portal-accent transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-portal-text-muted uppercase tracking-widest opacity-60">Complexity requirement: Minimum 8 characters + AlphaNumeric</p>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-portal-border/50">
                    <h3 className="text-xs font-black text-portal-text uppercase tracking-widest">Enhanced Security Protocol</h3>
                    
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-portal-bg/50 border border-portal-border group hover:border-portal-accent/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-portal-accent/10 flex items-center justify-center text-portal-accent">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-portal-text tracking-tight">Two-Factor Authentication (MFA)</p>
                          <p className="text-[10px] font-black text-portal-text-muted uppercase mt-1">Biometric or App-based verification</p>
                        </div>
                      </div>
                      <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-portal-border checked:bg-portal-accent transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:left-6 shadow-inner" />
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex justify-end">
                  <button onClick={handleChangePassword} className="flex items-center gap-3 px-8 py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-red-500/20 hover:scale-105 transition-all">
                    <KeyRound className="w-4 h-4" />
                    Reset Access Keys
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}