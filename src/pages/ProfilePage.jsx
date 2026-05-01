import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Terminal, 
  Activity, 
  Lock,
  KeyRound,
  Edit3,
  Save,
  CheckCircle2,
  XCircle,
  Shield,
  Layers,
  ArrowRight,
  Briefcase,
  Eye,
  EyeOff,
  ArrowLeft,
  Code,
  X
} from 'lucide-react';
import { DivisionSelector } from '../components/Profile/DivisionContext';
import { useDivision } from '../context/DivisionContext';
import attendanceService from '../services/attendanceService';
import AttendanceHeatmap from '../components/Profile/AttendanceHeatmap';

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
  const navigate = useNavigate();
  const { user, updateProfile, switchRole } = useAuth();
  const { activeDivision } = useDivision();
  
  // Ensure we have divisions to show
  const divisions = user?.role === 'member' 
    ? (user?.divisions?.length > 0 ? user.divisions : ["Development", "Cyber Security", "Data Science", "CP (Competitive Programming)"])
    : (user?.divisions || ["CORE Team"]);

  const activeContent = divisionContent[activeDivision] || divisionContent['Development'];
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    skills: user?.skills || [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'division', label: 'My Division', icon: Layers },
    { id: 'security', label: 'Security & Password', icon: KeyRound },
  ];

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

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !formData.skills.includes(val)) {
        setFormData({ ...formData, skills: [...formData.skills, val] });
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!isEditing) return;
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showNotification('Please fill in all password fields.', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showNotification('New password must be at least 8 characters.', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match.', 'error');
      return;
    }

    setIsChangingPassword(true);

    try {
      await authService.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showNotification('Password updated successfully.', 'success');
    } catch (err) {
      showNotification(err?.message || 'Failed to update password.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  React.useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoadingAttendance(true);
      try {
        const data = await attendanceService.getAttendance();
        setAttendanceHistory(data.data || []);
      } catch (err) {
        console.error('Failed to fetch attendance history');
      } finally {
        setIsLoadingAttendance(false);
      }
    };

    fetchAttendance();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-portal-input rounded-lg transition-colors text-portal-text-muted hover:text-portal-text"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-portal-text">My Profile</h1>
          <p className="text-portal-text-muted">Manage your personal information, division workspace, and account security.</p>
        </div>
      </div>

      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            notification.type === 'success' 
              ? 'bg-portal-accent/20 border-portal-accent text-portal-accent' 
              : 'bg-red-500/20 border-red-500 text-red-500'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-bold">{notification.message}</span>
        </motion.div>
      )}

      <div className="bg-portal-card border border-portal-border rounded-xl overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-4 min-h-[600px]">
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-portal-border p-4 flex flex-row md:flex-col gap-1 overflow-x-auto bg-portal-input/30">
            <div className="flex flex-row md:flex-col gap-1 flex-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors w-full text-left whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-portal-input border border-portal-border shadow-sm text-portal-text font-semibold"
                      : "text-portal-text-muted hover:bg-portal-input/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 p-6 sm:p-8 space-y-8">
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Profile Information Header */}
                <div>
                  <h2 className="text-lg font-semibold text-portal-text mb-4 border-b border-portal-border pb-2">Profile Information</h2>
                  
                  <div className="flex items-start gap-6 mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full border-4 border-portal-accent/30 flex items-center justify-center bg-portal-input overflow-hidden">
                        <User className="w-12 h-12 text-portal-accent/50" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-1.5 bg-portal-accent text-portal-bg rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex-1 mt-2">
                      <h3 className="text-xl font-bold text-portal-text">{user.name}</h3>
                      <p className="text-sm text-portal-accent font-medium mb-4">
                        {user.role === 'member' ? 'Student' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-portal-input/50 p-4 rounded-xl border border-portal-border">
                      <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-portal-accent" />
                        Overall Attendance
                      </p>
                      <div className="text-xl font-bold text-portal-text">{user.attendance}</div>
                    </div>
                    <div className="bg-portal-input/50 p-4 rounded-xl border border-portal-border">
                      <p className="text-[10px] text-portal-text-muted uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        System Status
                      </p>
                      <div className="text-sm font-bold text-green-400">{user.status}</div>
                    </div>
                  </div>

                  {/* Attendance Heatmap Section */}
                  <div className="mb-8">
                    <AttendanceHeatmap data={attendanceHistory} />
                  </div>
                </div>


                {/* Verified Identity */}
                <div>
                  <h2 className="text-lg font-semibold text-portal-text mb-4 border-b border-portal-border pb-2 flex justify-between items-center">
                    Verified Identity
                    <span className="text-[10px] bg-portal-accent/10 text-portal-accent px-2 py-1 rounded-md uppercase tracking-wider">Protected</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                {/* Profile Settings (Editable) */}
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-portal-border pb-2">
                    <h2 className="text-lg font-semibold text-portal-text">Profile Settings</h2>
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

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-portal-text-muted flex items-center gap-2">
                        <Code className="w-4 h-4" /> Technical Skills
                      </label>
                      <div className={`p-4 rounded-2xl border transition-all ${isEditing ? 'border-portal-accent ring-2 ring-portal-accent/20 bg-portal-input' : 'border-portal-border bg-portal-input opacity-70'}`}>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.skills.map(skill => (
                            <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-portal-accent/10 text-portal-accent border border-portal-accent/20">
                              {skill}
                              {isEditing && (
                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400 transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </span>
                          ))}
                          {formData.skills.length === 0 && !isEditing && (
                            <span className="text-xs text-portal-text-muted italic">No skills added yet.</span>
                          )}
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                              placeholder="Add a skill (e.g. React, Python) and press Enter"
                              className="flex-1 bg-portal-bg border border-portal-border rounded-xl px-4 py-2 text-sm text-portal-text outline-none focus:border-portal-accent transition-all"
                            />
                            <button
                              type="button"
                              onClick={handleAddSkill}
                              className="px-4 py-2 bg-portal-border text-portal-text hover:bg-portal-accent hover:text-white rounded-xl text-sm font-bold transition-all"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end pt-2">
                        <button 
                          type="submit"
                          className="bg-portal-accent text-portal-bg px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-[0.98]"
                        >
                          <Save className="w-4 h-4" />
                          Save Bio Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Dual-Role Switcher (For Instructors) */}
                {(user?.originalRole === 'instructor' || (user?.role === 'instructor' && !user?.originalRole)) && (
                  <div>
                    <h2 className="text-lg font-semibold text-portal-text mb-4 border-b border-portal-border pb-2">Dual-Role Workspace</h2>
                    <div className="bg-portal-input/30 border border-portal-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="text-md font-bold text-portal-text flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-portal-accent" />
                          Role Management
                        </h4>
                        <p className="text-sm text-portal-text-muted mt-1">
                          Switch between managing classes and participating in bootcamps.
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          switchRole();
                          showNotification(`Switched to ${user.role === 'instructor' ? 'Student' : 'Instructor'} View`, 'success');
                        }}
                        className="bg-portal-accent text-portal-bg px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all whitespace-nowrap w-full sm:w-auto justify-center"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Switch to {user.role === 'instructor' ? 'Student' : 'Instructor'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'division' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-lg font-semibold text-portal-text mb-4 border-b border-portal-border pb-2">My Division</h2>
                  <DivisionSelector 
                    assignedDivisions={divisions} 
                    onSwitch={(div) => showNotification(`Switched to ${div} Division`, 'success')}
                  />

                  <motion.div 
                    key={activeDivision}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-8 p-6 bg-portal-input/40 border border-portal-border/50 rounded-2xl"
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
                    <div className="mt-6 flex items-center gap-3 text-xs font-bold text-portal-accent cursor-pointer group">
                      Enter Division Workspace
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-portal-border pb-2">
                    <h2 className="text-lg font-semibold text-portal-text">Change Password</h2>
                    <span className="hidden sm:inline-flex text-[10px] bg-portal-accent/10 text-portal-accent px-3 py-1.5 rounded-full uppercase tracking-[0.22em] font-bold">
                      Secure Access
                    </span>
                  </div>
                  <p className="mb-6 text-sm text-portal-text-muted leading-relaxed max-w-2xl">
                    Enter your current password, then create and confirm your new password below.
                  </p>
                  
                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-portal-text-muted ml-1">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                            className="w-full bg-portal-input border border-portal-border rounded-xl py-3 pl-12 pr-12 text-portal-text text-sm focus:outline-none focus:border-portal-accent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-portal-text-muted hover:text-portal-text transition-colors"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-portal-text-muted ml-1">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Create a new password"
                            className="w-full bg-portal-input border border-portal-border rounded-xl py-3 pl-12 pr-12 text-portal-text text-sm focus:outline-none focus:border-portal-accent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-portal-text-muted hover:text-portal-text transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-portal-text-muted ml-1">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Confirm the new password"
                            className="w-full bg-portal-input border border-portal-border rounded-xl py-3 pl-12 pr-12 text-portal-text text-sm focus:outline-none focus:border-portal-accent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-portal-text-muted hover:text-portal-text transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="inline-flex items-center gap-2 bg-portal-accent text-portal-bg px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-portal-accent/20 hover:bg-portal-accent-hover transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <KeyRound className="w-4 h-4" />
                        {isChangingPassword ? 'Updating Password...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
