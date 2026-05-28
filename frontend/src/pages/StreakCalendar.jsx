import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Calendar, Flame, Trophy, Award, Star, BookOpen, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StreakCalendar() {
  const [stats, setStats] = useState({
    sessions: 0,
    streak: 0,
    maxStreak: 0,
    gems: 0
  });

  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    // Read from localStorage initially for fast render
    const sessions = parseInt(localStorage.getItem('totalSessions') || '0');
    const gems = parseInt(localStorage.getItem('gems') || '0');
    const streak = parseInt(localStorage.getItem('prepGenie_streak') || '0');
    const maxStreak = parseInt(localStorage.getItem('prepGenie_maxStreak') || streak.toString());
    
    setStats({ sessions, streak, maxStreak, gems });

    const storedActivity = JSON.parse(localStorage.getItem('prepGenie_activity') || '{}');
    setGridData(generateGrid(storedActivity));

    // Fetch from Supabase
    import('../lib/supabase').then(async ({ supabase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch stats
        const { data: statsData } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single();
        if (statsData) {
          setStats({
            sessions: statsData.total_sessions || 0,
            streak: statsData.current_streak || 0,
            maxStreak: statsData.max_streak || 0,
            gems: statsData.gems || 0
          });
        }
        
        // Fetch activity logs
        const { data: logsData } = await supabase.from('activity_logs').select('*').eq('user_id', user.id);
        if (logsData) {
          const activityMap = {};
          logsData.forEach(log => {
            activityMap[log.date_str] = log.activity_count;
          });
          setGridData(generateGrid(activityMap));
          localStorage.setItem('prepGenie_activity', JSON.stringify(activityMap));
        }
      }
    });
  }, []);

  const generateGrid = (activityMap) => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (364 - i));
      const dateStr = d.toISOString().split('T')[0];
      const level = activityMap[dateStr] || 0;
      data.push({ date: dateStr, level: Math.min(level, 4) });
    }
    return data;
  };

  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const storedActivity = JSON.parse(localStorage.getItem('prepGenie_activity') || '{}');
    const today = new Date();
    const data = [];
    
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      
      let monthSessions = 0;
      Object.keys(storedActivity).forEach(dateStr => {
        const dateObj = new Date(dateStr);
        if (dateObj.getMonth() === d.getMonth() && dateObj.getFullYear() === year) {
          monthSessions += storedActivity[dateStr];
        }
      });
      data.push({ name: monthName, sessions: monthSessions });
    }
    return data;
  };

  const chartData = generateChartData();

  const getColor = (level) => {
    if (level === 1) return 'rgba(168, 85, 247, 0.3)';
    if (level >= 2 && level <= 3) return 'rgba(168, 85, 247, 0.6)';
    if (level >= 4 && level <= 5) return 'rgba(236, 72, 153, 0.8)';
    if (level > 5) return 'rgba(236, 72, 153, 1)';
    return 'rgba(255,255,255,0.05)';
  };

  const badges = [
    { id: 1, name: 'First Step', desc: 'Complete 1 session', icon: <Star />, unlocked: stats.sessions >= 1 },
    { id: 2, name: 'On Fire', desc: 'Reach a 7-day streak', icon: <Flame />, unlocked: stats.streak >= 7 },
    { id: 3, name: 'Diamond', desc: 'Reach a 30-day streak', icon: <Award />, unlocked: stats.streak >= 30 },
    { id: 4, name: 'Legend', desc: 'Complete 100 sessions', icon: <Trophy />, unlocked: stats.sessions >= 100 },
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: '100vh', maxWidth: '1000px', margin: '0 auto', padding: '100px 20px 50px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)' }}>
            <Calendar color="#06b6d4" size={40} />
          </div>
          <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Interview Streak Calendar</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Consistency is key to cracking top tech interviews. Track your daily preparation and unlock achievements.
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Flame color="#f97316" size={30} style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{stats.streak}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Streak</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Trophy color="#eab308" size={30} style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{stats.maxStreak}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Longest Streak</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <BookOpen color="#3b82f6" size={30} style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{stats.sessions}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Sessions</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Star color="#10b981" size={30} style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{stats.gems}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Gems</div>
          </div>
        </div>

        {/* GitHub Style Graph */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>Consistency Graph</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(52, 1fr)', gridTemplateRows: 'repeat(7, 1fr)', gap: '4px', overflowX: 'auto', paddingBottom: '10px' }}>
            {gridData.map((day, idx) => (
              <div 
                key={idx}
                title={`${day.date}: Level ${day.level}`}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: getColor(day.level),
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                className="hover-scale"
              />
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Less</span>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(168, 85, 247, 0.3)' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(168, 85, 247, 0.6)' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(236, 72, 153, 0.8)' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(236, 72, 153, 1)' }}></div>
            <span>More</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Monthly Chart */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem' }}>Monthly Sessions</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="sessions" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Badges */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem' }}>Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {badges.map(b => (
                <div 
                  key={b.id} 
                  style={{ 
                    padding: '1rem', 
                    background: b.unlocked ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))' : 'rgba(255,255,255,0.02)', 
                    border: b.unlocked ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    opacity: b.unlocked ? 1 : 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '10px',
                    position: 'relative'
                  }}
                >
                  {!b.unlocked && <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '10px', right: '10px' }} />}
                  <div style={{ color: b.unlocked ? '#06b6d4' : 'var(--text-muted)', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                    {b.icon}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>{b.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .hover-scale:hover { transform: scale(1.5); box-shadow: 0 0 10px rgba(255,255,255,0.5); z-index: 10; }
      `}</style>
    </div>
  );
}
