import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Trophy, Medal, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('Global'); // 'Global' or 'Friends'

  useEffect(() => {
    // Get current logged-in user email
    let userName = 'Guest User';
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed.email) setCurrentUserEmail(parsed.email);
        if (parsed.name) userName = parsed.name;
      } catch (e) {}
    }

    const fetchLeaderboard = async () => {
      try {
        // Fetch from Supabase (if it exists)
        let fetchedData = [];
        try {
          const fetchPromise = supabase.from('leaderboard').select('*').order('total_score', { ascending: false });
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000));
          const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (!error && data) {
             fetchedData = data;
          }
        } catch (e) {
          console.log("Supabase fetch timeout or error, falling back to dummy data");
        }

        const userScore = parseInt(localStorage.getItem('prepGenie_score') || '0', 10);

        // Dummy Data for visual wow
        let allUsers = [
          { username: 'Alex Chen', total_score: 3450, role: 'SDE II at Google' },
          { username: 'Sarah Jenkins', total_score: 2890, role: 'Frontend Engineer at Meta' },
          { username: 'Rahul Sharma', total_score: 2450, role: 'SDE at Amazon' },
          { username: 'Emily Davis', total_score: 1820, role: 'Full Stack at Netflix' },
          { username: 'Michael Chang', total_score: 1540, role: 'Backend Dev at Uber' },
          { username: 'David Kim', total_score: 1200, role: 'SDE Intern at Microsoft' },
          { username: userName, total_score: userScore, role: 'Aspiring SDE' }
        ];

        // Combine fetched data if any
        if (fetchedData.length > 0) {
           allUsers = [...allUsers, ...fetchedData];
        }

        // Remove duplicates by username (keep highest score)
        const uniqueUsersMap = new Map();
        allUsers.forEach(u => {
          if (!uniqueUsersMap.has(u.username) || uniqueUsersMap.get(u.username).total_score < u.total_score) {
            uniqueUsersMap.set(u.username, u);
          }
        });

        let sortedUsers = Array.from(uniqueUsersMap.values()).sort((a, b) => b.total_score - a.total_score);

        // Simulated Friends data
        if (activeTab === 'Friends') {
          sortedUsers = sortedUsers.filter(u => u.username === userName || ['Alex Chen', 'Rahul Sharma'].includes(u.username));
        }

        sortedUsers = sortedUsers.map((u, i) => ({
          ...u,
          name: u.username,
          score: u.total_score,
          rank: i + 1,
          isCurrent: u.username === userName
        }));

        setUsers(sortedUsers);
      } catch (err) {
        console.error("Failed to setup leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();

    const handleStatsUpdate = () => {
      fetchLeaderboard();
    };
    window.addEventListener('statsUpdated', handleStatsUpdate);

    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdate);
    };
  }, [currentUserEmail, activeTab]);

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-muted)' }}>Loading Global Standings...</div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in">
      <Navbar />
      <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(250, 204, 21, 0.2) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: -1 }}></div>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(245, 158, 11, 0.1))', padding: '1.2rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: 'inset 0 0 20px rgba(250, 204, 21, 0.4), 0 0 40px rgba(250, 204, 21, 0.3)', border: '1px solid rgba(250, 204, 21, 0.5)' }}>
            <Trophy size={56} color="#facc15" style={{ filter: 'drop-shadow(0 0 10px #facc15)' }} />
          </div>
          <h1 className="heading-gradient" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #fde047, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '900', textTransform: 'uppercase' }}>Global Ranking</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Compete with the community and climb to the top 1%.</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '30px', padding: '5px', display: 'flex', gap: '5px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <button 
              onClick={() => setActiveTab('Global')}
              style={{ background: activeTab === 'Global' ? 'linear-gradient(135deg, #facc15, #f59e0b)' : 'transparent', color: activeTab === 'Global' ? '#000' : 'var(--text-muted)', padding: '10px 30px', borderRadius: '25px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.3s', boxShadow: activeTab === 'Global' ? '0 0 20px rgba(250, 204, 21, 0.4)' : 'none' }}
            >
              Global
            </button>
            <button 
              onClick={() => setActiveTab('Friends')}
              style={{ background: activeTab === 'Friends' ? 'linear-gradient(135deg, #a855f7, #3b82f6)' : 'transparent', color: activeTab === 'Friends' ? '#fff' : 'var(--text-muted)', padding: '10px 30px', borderRadius: '25px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.3s', boxShadow: activeTab === 'Friends' ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none' }}
            >
              Friends
            </button>
          </div>
        </div>

        {users.length > 0 ? (
          <div className="podium-container">
            {/* Second Place */}
            {users.length > 1 && (
              <div className="glass-panel podium-2 premium-3d" style={{ width: '200px', padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(to top, rgba(148, 163, 184, 0.3), rgba(15,20,30,0.8))', border: '1px solid rgba(148, 163, 184, 0.4)', borderBottom: '6px solid #94a3b8', boxShadow: '0 -10px 40px rgba(148, 163, 184, 0.1)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', borderRadius: '50%', padding: '0.5rem', border: '4px solid #1f2937', boxShadow: '0 0 30px #94a3b8' }}><Medal size={36} color="#0f172a"/></div>
                <div style={{ height: '40px' }}></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.2rem', color: '#e2e8f0' }}>{users[1].name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{users[1].role}</p>
                <div style={{ color: '#cbd5e1', fontWeight: '900', fontSize: '1.3rem', background: 'rgba(148,163,184,0.1)', padding: '5px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)' }}>{users[1].score} pts</div>
              </div>
            )}
            
            {/* First Place */}
            {users.length > 0 && (
              <div className="glass-panel podium-1 premium-3d" style={{ width: '240px', padding: '2.5rem 1.5rem', textAlign: 'center', background: 'linear-gradient(to top, rgba(250, 204, 21, 0.4), rgba(15,20,30,0.9))', border: '2px solid rgba(250, 204, 21, 0.5)', borderBottom: '8px solid #facc15', boxShadow: '0 -20px 60px rgba(250, 204, 21, 0.25)', position: 'relative', zIndex: 10, transform: 'translateY(-20px)' }}>
                <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #fef08a, #f59e0b)', borderRadius: '50%', padding: '0.8rem', border: '4px solid #1f2937', boxShadow: '0 0 40px #facc15', animation: 'pulse 2s infinite' }}><Trophy size={45} color="#451a03"/></div>
                <div style={{ height: '50px' }}></div>
                <h3 style={{ fontSize: '1.6rem', color: '#facc15', fontWeight: '900', marginBottom: '0.2rem', textShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }}>{users[0].name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{users[0].role}</p>
                <div style={{ color: '#facc15', fontWeight: '900', fontSize: '1.6rem', background: 'rgba(250,204,21,0.1)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(250,204,21,0.4)', textShadow: '0 0 15px rgba(250, 204, 21, 0.6)' }}>{users[0].score} pts</div>
              </div>
            )}

            {/* Third Place */}
            {users.length > 2 && (
              <div className="glass-panel podium-3 premium-3d" style={{ width: '200px', padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(to top, rgba(180, 83, 9, 0.3), rgba(15,20,30,0.8))', border: '1px solid rgba(180, 83, 9, 0.4)', borderBottom: '6px solid #d97706', boxShadow: '0 -10px 40px rgba(180, 83, 9, 0.1)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #fcd34d, #b45309)', borderRadius: '50%', padding: '0.5rem', border: '4px solid #1f2937', boxShadow: '0 0 30px #b45309' }}><Medal size={36} color="#451a03"/></div>
                <div style={{ height: '40px' }}></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.2rem', color: '#fbbf24' }}>{users[2].name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{users[2].role}</p>
                <div style={{ color: '#f59e0b', fontWeight: '900', fontSize: '1.3rem', background: 'rgba(180,83,9,0.1)', padding: '5px', borderRadius: '8px', border: '1px solid rgba(180,83,9,0.3)' }}>{users[2].score} pts</div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>No players have joined yet. Be the first!</div>
        )}

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.slice(3).map((user, idx) => (
            <div 
              key={user.id || idx} 
              className={`glass-panel premium-3d ${user.isCurrent ? 'current-user-row' : ''}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1.25rem 2rem',
                border: user.isCurrent ? '2px solid rgba(168, 85, 247, 0.8)' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: user.isCurrent ? '0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.1)' : '0 10px 30px rgba(0,0,0,0.5)',
                animation: user.isCurrent ? 'pulse 2s infinite' : 'none',
                transform: user.isCurrent ? 'scale(1.02)' : 'scale(1)',
                zIndex: user.isCurrent ? 10 : 1
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = user.isCurrent ? 'scale(1.02)' : 'scale(1)'; }}
            >
              <div style={{ width: '60px', fontSize: '1.4rem', fontWeight: '900', color: user.isCurrent ? '#c084fc' : 'var(--text-muted)' }}>
                #{user.rank}
              </div>
              
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: user.isCurrent ? 'linear-gradient(135deg, #a855f7, #7e22ce)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: user.isCurrent ? 'white' : 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {user.name} {user.isCurrent && <span style={{ fontSize: '0.8rem', background: '#a855f7', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>YOU</span>}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.role}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: user.isCurrent ? '#a855f7' : 'var(--text-main)' }}>
                <Star size={20} color={user.isCurrent ? "#a855f7" : "#f59e0b"} fill={user.isCurrent ? "#a855f7" : "#f59e0b"} /> 
                {user.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
