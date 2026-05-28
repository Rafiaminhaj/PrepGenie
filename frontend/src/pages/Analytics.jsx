import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Target, TrendingUp, Award, Zap, Activity, BrainCircuit, Code, Lightbulb } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Analytics() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    import('../lib/supabase').then(async ({ supabase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('user_stats').select('gems, current_streak, total_sessions').eq('user_id', user.id).single();
        if (data) {
          setScore(data.gems || 0);
          setStreak(data.current_streak || 0);
          setSessions(data.total_sessions || 0);
        } else {
          setScore(parseInt(localStorage.getItem('gems') || '0', 10));
          setStreak(parseInt(localStorage.getItem('prepGenie_streak') || '0', 10));
          setSessions(parseInt(localStorage.getItem('totalSessions') || '0', 10));
        }
      }
    });
  }, []);

  const weeklyData = [
    { name: 'Mon', score: 120, problems: 2 },
    { name: 'Tue', score: 200, problems: 4 },
    { name: 'Wed', score: 150, problems: 3 },
    { name: 'Thu', score: 380, problems: 8 },
    { name: 'Fri', score: 290, problems: 5 },
    { name: 'Sat', score: 450, problems: 10 },
    { name: 'Sun', score: 400, problems: 7 },
  ];

  const skillData = [
    { subject: 'Data Structures', A: 85, fullMark: 100 },
    { subject: 'Algorithms', A: 65, fullMark: 100 },
    { subject: 'System Design', A: 40, fullMark: 100 },
    { subject: 'Behavioral', A: 90, fullMark: 100 },
    { subject: 'Core Java', A: 75, fullMark: 100 },
  ];

  const stats = [
    { title: 'Total XP Score', value: score.toString(), icon: <Target size={28} color="#a855f7" />, trend: 'Top 15% globally', color: '#a855f7' },
    { title: 'Current Streak', value: `${streak} Days`, icon: <Zap size={28} color="#f59e0b" />, trend: 'Keep the fire burning!', color: '#f59e0b' },
    { title: 'Mock Interviews', value: sessions.toString(), icon: <Activity size={28} color="#10b981" />, trend: 'Steady progress', color: '#10b981' },
    { title: 'Problem Solving', value: '86%', icon: <TrendingUp size={28} color="#3b82f6" />, trend: '+5% this week', color: '#3b82f6' }
  ];

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '0.5rem' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0, fontSize: '0.9rem' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <Navbar />
      
      {/* Background Glows */}
      <div style={{ position: 'fixed', top: '10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800', letterSpacing: '-1px' }}>Your Learning Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>Track your XP, identify weak spots, and visualize your growth trajectory.</p>

        {/* Highlight Stats Grid */}
        <div className="cascade-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-panel premium-3d hover-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '24px', border: `1px solid rgba(255,255,255,0.05)`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: `radial-gradient(circle, ${stat.color}33 0%, transparent 70%)`, width: '100px', height: '100px', borderRadius: '50%' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '1.1rem' }}>{stat.title}</span>
                <div style={{ background: `${stat.color}22`, padding: '12px', borderRadius: '16px', border: `1px solid ${stat.color}44`, boxShadow: `0 0 20px ${stat.color}22` }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: '0.95rem', color: stat.color, fontWeight: '500' }}>{stat.trend}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Main Line Chart (Activity) */}
          <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.2s', padding: '2.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '5px' }}>
                  <TrendingUp color="#3b82f6" /> XP Gain (Last 7 Days)
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your daily score accumulation over the week.</p>
              </div>
              <select className="input-field" style={{ width: 'auto', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.3)' }}>
                <option style={{ background: '#1a1a24' }}>Last 7 Days</option>
                <option style={{ background: '#1a1a24' }}>Last 30 Days</option>
              </select>
            </div>
            
            <div style={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Radar Chart */}
          <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.3s', padding: '2.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '5px' }}>
                <BrainCircuit color="#a855f7" /> Skill Radar
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Identify your weakest areas.</p>
            </div>
            
            <div style={{ flex: 1, width: '100%', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Radar name="Proficiency" dataKey="A" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.5} />
                  <RechartsTooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* AI Recommendations */}
        <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.4s', padding: '2.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.05) 0%, rgba(20,20,30,0.8) 100%)', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.6rem', marginBottom: '2rem', color: '#facc15' }}>
            <Lightbulb color="#facc15" /> Genie's Strategic Advice
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '16px', height: 'fit-content' }}>
                <Target color="#ef4444" size={24} />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Focus on System Design</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Your System Design score is currently at 40%. Start spending 30 minutes daily on the <strong>Visual Concepts</strong> tool to understand architecture better.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '16px', height: 'fit-content' }}>
                <Code color="#10b981" size={24} />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Mastering Dynamic Programming</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>You successfully solved 3 DP problems this week! Try implementing a bottom-up tabulation approach in the <strong>Coding Playground</strong> next.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
