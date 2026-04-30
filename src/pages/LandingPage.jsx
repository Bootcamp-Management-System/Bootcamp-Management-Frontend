import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import csecLogo from '../assets/csec-logo.jpg';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Globe, Users, Star, CheckCircle2, Rocket, ShieldCheck, Zap, ChevronRight, BarChart3 } from 'lucide-react';
import { bootcampService } from '../services/bootcampService';
import { useAuth } from '../context/AuthContext';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

const Styles = () => (
  <style>{`
    @keyframes spin-slow { to { transform: rotate(360deg); } }
    @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg);}50%{transform:translate(20px,-30px) rotate(180deg);} }
    @keyframes float2 { 0%,100%{transform:translate(0,0) rotate(45deg);}50%{transform:translate(-25px,20px) rotate(225deg);} }
    @keyframes float3 { 0%,100%{transform:translate(0,0) rotate(0deg);}50%{transform:translate(15px,25px) rotate(120deg);} }
    @keyframes float4 { 0%,100%{transform:translate(0,0);}50%{transform:translate(-20px,-20px);} }
    @keyframes ticker { from{transform:translateX(0);}to{transform:translateX(-50%);} }
    @keyframes shimmer { 0%,100%{opacity:.3;}50%{opacity:.7;} }
    .geo-wrap{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
    .geo{position:absolute;border:1px solid rgba(42,177,194,0.15);border-radius:4px;}
    .g1{width:120px;height:120px;top:12%;left:8%;animation:float1 12s ease-in-out infinite;}
    .g2{width:80px;height:80px;top:20%;right:12%;animation:float2 15s ease-in-out infinite;}
    .g3{width:160px;height:160px;top:55%;left:5%;border-radius:50%;animation:float3 10s ease-in-out infinite;}
    .g4{width:60px;height:60px;bottom:20%;right:8%;animation:float4 8s ease-in-out infinite;}
    .g5{width:100px;height:100px;top:70%;left:40%;border-radius:50%;animation:float1 14s ease-in-out infinite reverse;}
    .g6{width:50px;height:50px;top:35%;left:20%;animation:float2 11s ease-in-out infinite;}
    .g7{width:140px;height:140px;bottom:10%;right:25%;animation:float3 13s ease-in-out infinite reverse;}
    .spotlight{position:absolute;inset:0;background:conic-gradient(from 0deg at 50% 45%,transparent 0deg,rgba(42,177,194,0.06) 40deg,transparent 80deg);animation:spin-slow 20s linear infinite;pointer-events:none;}
    .glow-center{position:absolute;top:38%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(42,177,194,0.10) 0%,transparent 65%);pointer-events:none;animation:shimmer 5s ease-in-out infinite;}
    .ticker-track{animation:ticker 30s linear infinite;display:flex;white-space:nowrap;}
  `}</style>
);

const getHomePath = r => {
  const n = r==='super-admin'||r==='super admin'?'super_admin':r==='student'?'member':r;
  if(n==='super_admin') return '/super-admin/dashboard';
  if(n==='admin') return '/admin';
  if(n==='instructor') return '/instructor';
  return '/dashboard';
};

const TICKS = ['React','Node.js','Python','Cyber Security','Data Science','Algorithms','Machine Learning','Full‑Stack','ICPC','Cloud','DevOps','AI'];

export const LandingPage = () => {
  const [bootcamps,setBootcamps]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showAll,setShowAll]=useState(false);
  const {isAuthenticated,user,isLoading}=useAuth();

  useEffect(()=>{
    bootcampService.getPublicBootcamps().then(d=>setBootcamps(d.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  if(isLoading) return <div className="h-screen w-screen flex items-center justify-center bg-portal-bg"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-portal-accent"/></div>;
  if(isAuthenticated&&user) return <Navigate to={getHomePath(user.role)} replace/>;

  const displayed=showAll?bootcamps:bootcamps.slice(0,3);

  return (
    <div className="min-h-screen bg-portal-bg text-portal-text overflow-x-hidden">
      <Styles/>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-portal-bg/75 backdrop-blur-2xl border-b border-portal-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden ring-1 ring-portal-accent/30 shadow-lg shadow-portal-accent/10">
              <img src={csecLogo} alt="CSEC ASTU" className="w-full h-full object-cover"/>
            </div>
            <span className="text-xl font-extrabold tracking-tight">CSEC ASTU</span>
          </div>
          <div className="flex items-center gap-6">
            <ThemeSwitcher />
            <Link to="/login" className="text-sm font-semibold text-portal-text-muted hover:text-portal-accent transition-colors">Login</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-portal-accent text-portal-bg rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-portal-accent/25">Join Academy</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Animated BG */}
        <div className="absolute inset-0">
          <div className="spotlight"/>
          <div className="glow-center"/>
          <div className="geo-wrap">
            {[1,2,3,4,5,6,7].map(n=><div key={n} className={`geo g${n}`}/>)}
          </div>
          {/* dot grid */}
          <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle,rgba(42,177,194,0.12) 1px,transparent 1px)',backgroundSize:'40px 40px',maskImage:'radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 80%)'}}/>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-portal-accent/10 border border-portal-accent/25 rounded-full text-portal-accent text-[11px] font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-portal-accent animate-pulse"/>Now Recruiting · Cohort 2026
            </span>
          </motion.div>

          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.2,duration:.8}}
            className="text-7xl md:text-[96px] font-extrabold leading-[1] tracking-tighter mb-6">
            Build the<br/>
            Future of<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-accent via-cyan-300 to-blue-400">Technology.</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.38,duration:.7}}
            className="text-lg text-portal-text-muted max-w-xl mx-auto leading-relaxed mb-10">
            Join the most elite tech community at ASTU. Master industry-standard stacks,
            contribute to real-world projects, and launch your career.
          </motion.p>

          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.52}}
            className="flex flex-wrap items-center justify-center gap-4">
            <a href="#bootcamps" className="px-9 py-4 bg-portal-accent text-portal-bg rounded-2xl font-extrabold text-base shadow-2xl shadow-portal-accent/30 hover:scale-105 hover:shadow-portal-accent/50 transition-all">
              Explore Bootcamps
            </a>
            <Link to="/signup" className="px-9 py-4 bg-white/[0.05] border border-portal-border rounded-2xl font-bold text-base hover:bg-white/10 hover:border-portal-accent/30 transition-all backdrop-blur">
              Create Account →
            </Link>
          </motion.div>

          {/* stats */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}}
            className="flex items-center justify-center gap-12 mt-16 pt-10 border-t border-portal-border/40">
            {[['500+','Active Students'],['1.2k+','Graduates'],['15+','Partners'],['4.9★','Rating']].map(([v,l])=>(
              <div key={l} className="text-center">
                <div className="text-3xl font-extrabold text-portal-text">{v}</div>
                <div className="text-[10px] text-portal-text-muted uppercase tracking-widest mt-1">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* scroll line */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div animate={{y:[0,8,0]}} transition={{duration:1.4,repeat:Infinity}} className="w-px h-10 bg-gradient-to-b from-portal-accent to-transparent"/>
        </motion.div>
      </section>

      {/* Ticker */}
      <div className="py-5 border-y border-portal-border bg-white/[0.015] overflow-hidden">
        <div className="flex">
          <div className="ticker-track gap-10 flex pr-10">
            {[...TICKS,...TICKS].map((s,i)=>(
              <span key={i} className="inline-flex items-center gap-2 text-[11px] font-bold text-portal-text-muted uppercase tracking-widest">
                <span className="w-1 h-1 rounded-full bg-portal-accent opacity-60"/>{s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bootcamps */}
      <section id="bootcamps" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3">Available Bootcamps</h2>
            <p className="text-portal-text-muted text-lg">Select your path and start your elite training journey.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loading?[1,2,3].map(i=><div key={i} className="h-72 bg-portal-card border border-portal-border rounded-3xl animate-pulse"/>)
            :bootcamps.length>0?displayed.map((bc,i)=>{
              const Icon=bc.name.toLowerCase().includes('cyber')?ShieldCheck:bc.name.toLowerCase().includes('web')?Globe:bc.name.toLowerCase().includes('ai')?Zap:Code2;
              return(
                <motion.div key={bc._id} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} whileHover={{y:-6}}
                  className="group relative bg-portal-card border border-portal-border rounded-3xl p-8 overflow-hidden transition-all duration-400 hover:border-portal-accent/30">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-portal-accent/0 to-transparent group-hover:via-portal-accent/40 transition-all duration-500"/>
                  <div className="w-12 h-12 bg-portal-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-portal-accent group-hover:scale-110 transition-all duration-400">
                    <Icon className="w-6 h-6 text-portal-accent group-hover:text-portal-bg transition-colors duration-400"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-portal-accent transition-colors">{bc.name}</h3>
                  <p className="text-portal-text-muted text-sm leading-relaxed mb-6">
                    {bc.description||'Master industry-standard practices and launch your professional career.'}
                  </p>
                  <Link to={`/apply/${bc._id}`} className="inline-flex items-center gap-2 text-sm font-bold text-portal-accent hover:gap-4 transition-all">
                    Enroll Now<ArrowRight className="w-4 h-4"/>
                  </Link>
                </motion.div>
              );
            }):(
              <div className="col-span-full py-20 text-center bg-portal-card border border-dashed border-portal-border rounded-3xl">
                <h3 className="text-xl font-bold text-portal-text-muted">No active bootcamps found.</h3>
              </div>
            )}
          </div>

          {bootcamps.length>3&&(
            <div className="mt-12 flex justify-center">
              <button onClick={()=>setShowAll(!showAll)} className="flex items-center gap-3 text-portal-accent font-bold text-sm uppercase tracking-widest hover:gap-5 transition-all">
                {showAll?'Show Less':'View All Programs'}<ArrowRight className={`w-4 h-4 transition-transform ${showAll?'-rotate-90':''}`}/>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why CSEC */}
      <section className="py-32 px-6 border-y border-portal-border/40 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Why <span className="text-portal-accent">CSEC ASTU</span>?</h2>
            <p className="text-portal-text-muted text-lg max-w-lg mx-auto">Specialized training across four elite focus areas, built for the next generation of leaders.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {icon:Rocket,tag:'Build',title:'Development',desc:'Full-stack, mobile & software architecture with industry-grade tools.'},
              {icon:Code2,tag:'Solve',title:'Competitive Programming',desc:'Algorithmic thinking for ICPC and global competitions.'},
              {icon:ShieldCheck,tag:'Defend',title:'Cyber Security',desc:'Offensive security, digital forensics and network defense.'},
              {icon:BarChart3,tag:'Analyze',title:'Data Science',desc:'Machine learning and AI models that uncover real insights.'},
            ].map((f,i)=>(
              <motion.div key={f.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}} whileHover={{y:-5}}
                className="group p-7 bg-portal-card border border-portal-border rounded-3xl hover:border-portal-accent/30 transition-all duration-400">
                <div className="w-11 h-11 rounded-xl bg-portal-accent/10 flex items-center justify-center mb-5 group-hover:bg-portal-accent transition-all duration-400">
                  <f.icon className="w-5 h-5 text-portal-accent group-hover:text-portal-bg transition-colors"/>
                </div>
                <p className="text-[10px] font-black text-portal-accent uppercase tracking-widest mb-2">{f.tag}</p>
                <h3 className="font-bold text-base mb-3">{f.title}</h3>
                <p className="text-portal-text-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{width:700,height:400,background:'radial-gradient(ellipse,rgba(42,177,194,0.09) 0%,transparent 70%)',filter:'blur(40px)'}}/>
        </div>
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-5">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-accent to-blue-400">level up</span>?
          </h2>
          <p className="text-portal-text-muted text-lg mb-10">Join hundreds of students already building the future at CSEC ASTU.</p>
          <Link to="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-portal-accent text-portal-bg rounded-2xl font-extrabold text-lg shadow-2xl shadow-portal-accent/30 hover:scale-105 transition-all">
            Get Started Free<ArrowRight className="w-5 h-5"/>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-14 border-t border-portal-border px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-portal-accent/20">
              <img src={csecLogo} alt="CSEC ASTU" className="w-full h-full object-cover"/>
            </div>
            <span className="font-bold">CSEC ASTU</span>
          </div>
          <p className="text-portal-text-muted text-xs tracking-widest uppercase">© 2026 CSEC ASTU · All Rights Reserved</p>
          <div className="flex items-center gap-6">
            {/* Feedback */}
            <a href="https://forms.gle/WzxkpHAF3iKy9eCT9" target="_blank" rel="noopener noreferrer"
              title="Send Feedback"
              className="flex items-center gap-1.5 text-portal-text-muted hover:text-portal-accent transition-all hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"/>
              </svg>
              <span className="text-xs font-semibold hidden sm:block">Feedback</span>
            </a>
            {/* Facebook */}
            <a href="https://ift.tt/2PEWePp" target="_blank" rel="noopener noreferrer"
              title="Facebook"
              className="text-portal-text-muted hover:text-portal-accent transition-all hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0022 12z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/csec-astu" target="_blank" rel="noopener noreferrer"
              title="LinkedIn"
              className="text-portal-text-muted hover:text-portal-accent transition-all hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
              </svg>
            </a>
            {/* Telegram */}
            <a href="https://t.me/CSEC_ASTU" target="_blank" rel="noopener noreferrer"
              title="Telegram"
              className="text-portal-text-muted hover:text-portal-accent transition-all hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
