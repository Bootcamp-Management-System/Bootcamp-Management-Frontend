import React from 'react';
import { motion } from "framer-motion"; 
import { 
  Code, 
  ShieldAlert, 
  Database, 
  Binary,
  CheckCircle2
} from 'lucide-react';
import { useDivision } from '../../context/DivisionContext';

const divisionInfo = {
  'Development': { icon: Code, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  'Cyber Security': { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  'Data Science': { icon: Database, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  'CP (Competitive Programming)': { icon: Binary, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' }
};

export const DivisionSelector = ({ assignedDivisions, onSwitch }) => {
  const { activeDivision, switchDivision } = useDivision();

  const handleSwitch = (division) => {
    switchDivision(division);
    if (onSwitch) onSwitch(division);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-portal-text-muted uppercase tracking-widest flex items-center gap-2">
          Select Active Division
        </h4>
        <span className="text-[10px] text-portal-accent font-bold uppercase tracking-tighter bg-portal-accent/5 px-2 py-1 rounded-md">
          {assignedDivisions.length} Assigned
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {assignedDivisions.map((division) => {
          const info = divisionInfo[division] || { icon: Code, color: 'text-portal-accent', bg: 'bg-portal-accent/10', border: 'border-portal-accent/20' };
          const isActive = activeDivision === division;
          const Icon = info.icon;

          return (
            <motion.button
              key={division}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSwitch(division)}
              className={`
                relative p-4 rounded-2xl border transition-all text-left group
                ${isActive 
                  ? `${info.bg} ${info.border} ring-2 ring-white/5 shadow-lg` 
                  : 'bg-portal-input/40 border-portal-border hover:border-portal-border/80'
                }
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-white/10' : 'bg-portal-card border border-portal-border'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : info.color}`} />
                </div>
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-full p-0.5"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${info.color.replace('text-', 'text-')}`} />
                  </motion.div>
                )}
              </div>
              
              <div>
                <h5 className={`font-bold text-sm leading-none mb-1 ${isActive ? 'text-white' : 'text-portal-text-muted transition-colors group-hover:text-white'}`}>
                  {division}
                </h5>
                <p className="text-[10px] text-portal-text-muted/60 font-medium uppercase tracking-tighter">
                  {isActive ? 'Current View' : 'Switch To'}
                </p>
              </div>

              {isActive && (
                <motion.div 
                  layoutId="active-division-border"
                  className={`absolute inset-0 border-2 rounded-2xl pointer-events-none transition-colors ${info.border.replace('border-', 'border-')}`}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
