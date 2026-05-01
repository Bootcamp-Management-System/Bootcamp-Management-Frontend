import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  BookOpen,
  ArrowUpRight,
  ClipboardList,
  UserCheck,
} from 'lucide-react';
import { userService } from '../../services/userService';
import { bootcampService } from '../../services/bootcampService';
import { groupService } from '../../services/groupService';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [counts, setCounts] = React.useState({
    members: 0,
    instructors: 0,
    bootcamps: 0,
    groups: 0
  });

  const currentDivisionId = user?.division;
  const currentDivisionName = user?.division?.name || user?.divisionName || 'Division';

  React.useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [usersRes, bootcampsRes, groupsRes] = await Promise.all([
          userService.getUsers(),
          bootcampService.getBootcamps(currentDivisionId),
          groupService.getGroups(currentDivisionId)
        ]);

        const allUsers = usersRes.data || [];
        // Filter users by the Admin's division for accurate metrics
        const divisionUsers = allUsers.filter(u => {
          const uDivId = u.division?._id || u.division;
          const adminDivId = currentDivisionId?._id || currentDivisionId;
          return uDivId === adminDivId;
        });

        setCounts({
          members: divisionUsers.filter(u => u.role === 'student').length,
          instructors: divisionUsers.filter(u => u.role === 'instructor').length,
          bootcamps: bootcampsRes.data?.length || 0,
          groups: groupsRes.data?.length || 0
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentDivisionId]);


  const stats = [
    { label: "Specialists", value: counts.members, change: "+2", icon: Users, color: "text-blue-400" },
    { label: "Mentors", value: counts.instructors, change: "+0", icon: UserCheck, color: "text-green-400" },
    { label: "Operations", value: counts.bootcamps, change: "+1", icon: BookOpen, color: "text-purple-400" },
    { label: "Clusters", value: counts.groups, change: "+3", icon: ClipboardList, color: "text-orange-400" },
  ];


  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="px-3 py-1 bg-portal-accent/10 border border-portal-accent/20 rounded-full text-[10px] font-bold text-portal-accent uppercase tracking-widest">
            Division Protocol
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-portal-text">
          {currentDivisionName} Command
        </h2>
        <p className="text-portal-text-muted italic">Real-time status report for the {currentDivisionName} division.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-portal-card border border-portal-border p-6 rounded-3xl shadow-xl group hover:border-portal-accent/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-portal-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
            <div className="text-3xl font-bold text-portal-text tracking-tight">
              {loading ? '...' : stat.value}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
