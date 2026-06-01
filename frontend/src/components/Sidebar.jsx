import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, BrainCircuit, MessageSquare, Mic2, Image as ImageIcon, BookText, LogOut, Settings, LineChart, BookOpen, Layers, GitBranch, Trophy, Target, Award, Hexagon, Flame, Clock, Star, Radio, Building, Code, Calendar, Users, Terminal, Map, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const [gems, setGems] = useState(() => parseInt(localStorage.getItem('prepGenie_score') || '0', 10));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('prepGenie_streak') || '0', 10));
  const [studyTime, setStudyTime] = useState(() => parseInt(localStorage.getItem('studyTime') || '0', 10));

  useEffect(() => {
    const handleStatsUpdate = () => {
      setGems(parseInt(localStorage.getItem('prepGenie_score') || '0', 10));
      setStreak(parseInt(localStorage.getItem('prepGenie_streak') || '0', 10));
      setStudyTime(parseInt(localStorage.getItem('studyTime') || '0', 10));
    };
    window.addEventListener('studyTimeUpdated', handleStatsUpdate);
    window.addEventListener('statsUpdated', handleStatsUpdate);
    return () => {
      window.removeEventListener('studyTimeUpdated', handleStatsUpdate);
      window.removeEventListener('statsUpdated', handleStatsUpdate);
    };
  }, []);

  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scroll when sidebar is open and fetch stats
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Fetch from Supabase
      const fetchStats = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase.from('user_stats').select('gems, current_streak, study_time').eq('user_id', user.id).single();
          if (data && !error) {
            setGems(data.gems || 0);
            setStreak(data.current_streak || 0);
            setStudyTime(data.study_time || 0);
            localStorage.setItem('prepGenie_score', data.gems || 0);
            localStorage.setItem('prepGenie_streak', data.current_streak || 0);
            localStorage.setItem('studyTime', data.study_time || 0);
          }
        }
      };
      fetchStats();
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Only show sidebar functionality if not on the Home or Auth pages
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <BrainCircuit size={20} /> },
    { name: 'DSA Roadmap', path: '/roadmap', icon: <Map size={20} color="#f43f5e" /> },
    { name: 'LiveSpeak AI', path: '/live-speak', icon: <Radio size={20} color="#8B5CF6" /> },
    { name: 'Resume Roaster 🔥', path: '/resume-roaster', icon: <Flame size={20} color="#ec4899" /> },
    { name: 'Company Prep', path: '/company-prep', icon: <Building size={20} color="#10b981" /> },
    { name: 'Job Tracker', path: '/job-tracker', icon: <Briefcase size={20} color="#f59e0b" /> },
    { name: 'Coding Playground', path: '/coding-playground', icon: <Terminal size={20} color="#3b82f6" /> },
    { name: 'Code Review', path: '/code-review', icon: <Code size={20} color="#a855f7" /> },
    { name: 'HR Interview', path: '/hr-interview', icon: <Users size={20} color="#f59e0b" /> },
    { name: 'Streak Calendar', path: '/streak', icon: <Calendar size={20} color="#06b6d4" /> },
    { name: 'Chat with Genie', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Mock Interview', path: '/interview', icon: <Mic2 size={20} /> },
    { name: 'Practice Quiz', path: '/quiz', icon: <BookOpen size={20} /> },
    { name: 'Visual Concepts', path: '/visual', icon: <ImageIcon size={20} /> },
    { name: 'Smart Notebook', path: '/notebook', icon: <BookText size={20} /> },
    { name: 'System Design', path: '/system-design', icon: <Layers size={20} /> },
    { name: 'Flashcards', path: '/flashcards', icon: <Award size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <LineChart size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
    { name: 'GitHub Persona', path: '/persona', icon: <GitBranch size={20} /> },
    { name: 'Algorithm Visualizer', path: '/algorithm-visualizer', icon: <GitBranch size={20} color="#38bdf8" /> },
  ];

  return (
    <>
      {/* Floating Unique Button instead of Hamburger */}
      <button 
        className="hamburger-btn"
        onClick={() => setIsOpen(true)}
        style={{ padding: '0.6rem' }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Hexagon size={28} color="var(--primary)" />
          <div style={{ position: 'absolute', animation: 'pulse 2s infinite' }}>
            <Sparkles size={14} color="#fff" />
          </div>
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`sidebar-drawer glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo" style={{ marginBottom: 0 }}>
            <Sparkles color="var(--primary)" size={24} />
            <span className="heading-gradient">PrepGenie</span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Stats Widget */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '1rem', 
          background: 'rgba(255,255,255,0.03)', 
          marginBottom: '1.5rem', 
          borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f97316', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '500', marginBottom: '4px' }}><Flame size={12}/> Streak</div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{streak}</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '500', marginBottom: '4px' }}><Clock size={12}/> Time</div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{formatTime(studyTime)}</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '500', marginBottom: '4px' }}><Star size={12}/> Score</div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{gems}</div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-links">
            {navLinks.map((link, idx) => (
              <Link 
                key={idx} 
                to={link.path} 
                className={`sidebar-link ${isActive(link.path)}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <Link to="/settings" className={`sidebar-link ${isActive('/settings')}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            <LogOut size={20} />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </>
  );
}
