import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  IdCard, 
  Terminal, 
  Activity, 
  Calendar,
  Lock,
  Edit3,
  Save,
  CheckCircle2,
  XCircle,
  Shield,
  Layers,
  ArrowRight,
  Monitor,
  Cpu,
  Globe,
  Briefcase
} from 'lucide-react';
import { DivisionSelector } from '../components/Profile/DivisionContext';
import { useDivision } from '../context/DivisionContext';

const divisionContent = {
  'Development': {
    title: 'Software Engineering Stack',
    desc: 'Building modern web and mobile applications using React, Node.js, and Cloud architectures.',
    items: ['Full-stack Excellence', 'Mobile Dev Node', 'DevOps Principles'],
    color: 'text-blue-400'
  },
  'Cyber Security': {
    title: 'Offensive & Defensive Ops',
    desc: 'Mastering vulnerability research, network auditing, and secure system design.',
    items: ['CTF Training', 'Red Teaming', 'Threat Analysis'],
    color: 'text-red-400'
  },
  'Data Science': {
    title: 'AI & Analytical Engines',
    desc: 'Unlocking insights through statistical modeling, machine learning, and big data processing.',
    items: ['Machine Learning', 'Big Data Ethics', 'NLP Frontiers'],
    color: 'text-purple-400'
  },
  'CP (Competitive Programming)': {
    title: 'Algorithmic Problem Solving',
    desc: 'Optimizing solutions for complex computational challenges and competitive arenas.',
    items: ['Graph Theory', 'Dynamic Programming', 'Complexity Ops'],
    color: 'text-orange-400'
  }
};

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { activeDivision } = useDivision();
  
  // Ensure we have divisions to show
  const divisions = user?.role === 'member' 
    ? (user?.divisions?.length > 0 ? user.divisions : ["Development", "Cyber Security", "Data Science", "CP (Competitive Programming)"])
    : (user?.divisions || ["CORE Team"]);

  const activeContent = divisionContent[activeDivision] || divisionContent['Development'];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      showNotification('Profile updated successfully!', 'success');
    } catch (err) {
      showNotification('Failed to update profile.', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Passwords do not match.', 'error');
      return;
    }
    // Simulate password change
    showNotification('Password changed successfully!', 'success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <header className="mb-10">
        <h2 className="text-3xl font-bold mb-2 text-portal-text">My Profile</h2>
        <p className="text-portal-text-muted">Manage your personal information and portal settings.</p>
      </header>

      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            notification.type === 'success' 
              ? 'bg-portal-accent/20 border-portal-accent text-portal-accent' 
              : 'bg-red-500/20 border-red-500 text-red-500'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-bold">{notification.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Stats */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-portal-accent/30 flex items-center justify-center bg-portal-input overflow-hidden mb-2">
                <User className="w-16 h-16 text-portal-accent/50" />
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-portal-accent text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-portal-text">{user.name}</h3>
            <p className="text-sm text-portal-accent font-medium mb-4">
              {user.role === 'member' ? 'Student' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <div className="w-full h-px bg-portal-border my-6" />
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-portal-input/50 p-4 rounded-2xl border border-portal-border">
                <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-portal-accent" />
                  Attendance
                </p>
                <div className="text-xl font-bold text-portal-text">{user.attendance}</div>
              </div>
              <div className="bg-portal-input/50 p-4 rounded-2xl border border-portal-border">
                <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  Status
                </p>
                <div className="text-sm font-bold text-green-400">{user.status}</div>
              </div>
            </div>
          </div>

          <div className="bg-portal-card border border-portal-border rounded-3xl p-8">
            <h4 className="text-sm font-bold text-portal-text mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Terminal className="w-4 h-4 text-portal-accent" />
              Portal Access
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-portal-text-muted font-medium">Student ID</span>
                <span className="text-portal-text font-mono bg-portal-input px-2 py-1 rounded-lg border border-portal-border">{user.idNo}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-portal-text-muted font-medium">Division</span>
                <span className="text-portal-accent font-bold">{activeDivision}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-portal-text-muted font-medium">Student Since</span>
                <span className="text-portal-text font-medium">Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Security */}
        <div className="lg:col-span-2 space-y-8">
          {/* Verified Identity (Non-Editable) */}
          <div className="bg-portal-card/50 border border-portal-border rounded-3xl p-8 opacity-90">
            <h4 className="text-xl font-bold text-portal-text mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-portal-accent" />
              Verified Identity
              <span className="text-[10px] bg-portal-accent/10 text-portal-accent px-2 py-1 rounded-md uppercase tracking-wider ml-auto">Protected</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Full Name</p>
                <div className="bg-portal-input/30 border border-portal-border/50 rounded-xl px-4 py-3 text-portal-text font-medium cursor-default">
                  {user.name}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Email Address</p>
                <div className="bg-portal-input/30 border border-portal-border/50 rounded-xl px-4 py-3 text-portal-text font-medium cursor-default">
                  {user.email}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Student ID No</p>
                <div className="bg-portal-input/30 border border-portal-border/50 rounded-xl px-4 py-3 text-portal-text font-mono cursor-default">
                  {user.idNo}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-portal-text-muted uppercase tracking-widest pl-1">Student Status</p>
                <div className="bg-portal-input/30 border border-portal-border/50 rounded-xl px-4 py-3 text-green-400 font-bold cursor-default flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {user.status}
                </div>
              </div>
            </div>
            <p className="mt-6 text-[11px] text-portal-text-muted italic flex items-center gap-2">
              <Lock className="w-3 h-3" /> Identity records are managed by CSEC ASTU Administration and cannot be modified.
            </p>
          </div>

          {/* Division Switcher */}
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
            <h4 className="text-xl font-bold text-portal-text mb-8 flex items-center gap-3">
              <Layers className="w-6 h-6 text-portal-accent" />
              My Division
            </h4>
            
            <DivisionSelector 
              assignedDivisions={divisions} 
              onSwitch={(div) => showNotification(`Switched to ${div} Division`, 'success')}
            />

            {/* Division Content Bonus */}
            <motion.div 
              key={activeDivision}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-10 p-8 bg-portal-input/40 border border-portal-border/50 rounded-3xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h5 className={`text-xl font-bold ${activeContent.color}`}>{activeContent.title}</h5>
                  <p className="text-sm text-portal-text-muted max-w-lg leading-relaxed">
                    {activeContent.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeContent.items.map(item => (
                    <span key={item} className="text-[10px] bg-white/5 border border-white/10 text-portal-text px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 text-xs font-bold text-portal-accent cursor-pointer group">
                Enter Division Workspace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          </div>

          {/* Profile Settings (Editable) */}
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold text-portal-text flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-portal-accent" />
                Profile Settings
              </h4>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  isEditing ? 'text-red-400 hover:text-red-300' : 'text-portal-accent hover:text-white'
                }`}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Bio'}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-portal-text-muted flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Personal Biography
                </label>
                <textarea 
                  rows="4"
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className={`w-full bg-portal-input border rounded-2xl px-4 py-3 text-portal-text outline-none transition-all resize-none ${
                    isEditing ? 'border-portal-accent ring-2 ring-portal-accent/20' : 'border-portal-border opacity-70'
                  }`}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <button 
                    type="submit"
                    className="bg-portal-accent text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-[0.98]"
                  >
                    <Save className="w-4 h-4" />
                    Save Bio Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Security */}
          <div className="bg-portal-card border border-portal-border rounded-3xl p-8">
            <h4 className="text-xl font-bold text-portal-text mb-8 flex items-center gap-3">
              <Lock className="w-6 h-6 text-portal-accent" />
              Security Settings
            </h4>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-portal-text-muted">Current Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text focus:border-portal-accent outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-portal-text-muted">New Password</label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text focus:border-portal-accent outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-portal-text-muted">Confirm New Password</label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-portal-input border border-portal-border rounded-xl px-4 py-3 text-portal-text focus:border-portal-accent outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  className="bg-white/10 text-portal-text px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
