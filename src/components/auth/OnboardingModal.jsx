import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Target, 
  Rocket, 
  Zap, 
  ChevronRight,
  BrainCircuit,
  MessageSquareQuote
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OnboardingModal = () => {
  const { user, completeOnboarding } = useAuth();
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Only show for students on their first login
  if (!user || !user.firstLogin || (user.role !== 'student' && user.role !== 'member')) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivation.trim()) return;

    setIsSubmitting(true);
    try {
      await completeOnboarding({ motivation: motivation.trim() });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-portal-bg/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-2xl w-full bg-[#0B1120] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-portal-accent/10"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-portal-accent/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative p-10 md:p-14">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="inline-flex p-4 bg-portal-accent/10 rounded-3xl border border-portal-accent/20 mb-4 shadow-inner">
                  <Rocket className="w-10 h-10 text-portal-accent" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    Welcome to the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-accent to-purple-400">
                      BMS Ecosystem
                    </span>
                  </h2>
                  <p className="text-portal-text-muted text-lg max-w-md mx-auto leading-relaxed">
                    We're thrilled to have you here. Let's personalize your journey to ensure you get the most out of our specialized bootcamps.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { icon: Zap, label: 'Fast Track' },
                    { icon: Target, label: 'Focused' },
                    { icon: BrainCircuit, label: 'Expert Led' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <item.icon className="w-5 h-5 text-portal-accent/70" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-portal-text-muted">{item.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  className="w-full bg-portal-accent text-portal-bg py-5 rounded-2xl font-bold text-lg shadow-xl shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-portal-accent/10 rounded-xl">
                    <MessageSquareQuote className="w-6 h-6 text-portal-accent" />
                  </div>
                  <span className="text-xs font-bold text-portal-accent uppercase tracking-[0.3em]">Personal Profile</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">One quick question...</h3>
                  <p className="text-portal-text-muted leading-relaxed text-lg">
                    What is your primary motivation for joining this bootcamp? Knowing this helps us tailor our support and resources for you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="relative">
                    <textarea
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="e.g. I want to transition into full-stack development and build real-world applications..."
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-lg min-h-[180px] focus:outline-none focus:border-portal-accent/50 focus:bg-white/10 transition-all placeholder:text-portal-text-muted/30 resize-none shadow-inner"
                      required
                      autoFocus
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-portal-text-muted/40 uppercase tracking-widest">
                      {motivation.length} characters
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !motivation.trim()}
                    className="w-full bg-portal-accent text-portal-bg py-5 rounded-2xl font-bold text-lg shadow-xl shadow-portal-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-portal-bg/30 border-t-portal-bg rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Complete Profile
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <motion.div 
              className="h-full bg-portal-accent"
              initial={{ width: '0%' }}
              animate={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
