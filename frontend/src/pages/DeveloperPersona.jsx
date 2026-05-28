import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Search, GitBranch, Star, GitFork, Users, Code, Activity, Award } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

export default function DeveloperPersona() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [persona, setPersona] = useState(null);
  const [topLangs, setTopLangs] = useState([]);
  const [topRepositories, setTopRepositories] = useState([]);

  const analyzeGitHub = async (e) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    try {
      // Fetch User Profile and Repos concurrently
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
      ]);

      if (!userRes.ok || !reposRes.ok) throw new Error('Failed to fetch data');
      
      const user = await userRes.json();
      const repos = await reposRes.json();

      // Calculate Metrics
      let totalStars = 0;
      let totalForks = 0;
      let langCounts = {};
      
      repos.forEach(repo => {
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
      });

      // Top Languages
      const sortedLangs = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang, count]) => ({ name: lang, percent: Math.round((count / repos.filter(r=>r.language).length) * 100) }));

      // Top Repos
      const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3);

      // Calculate Radar Chart Data (Scale 0-100)
      const activityScore = Math.min((user.public_repos * 2), 100);
      const popularityScore = Math.min((user.followers * 5) + (totalStars * 2), 100) || 10; 
      const diversityScore = Math.min((Object.keys(langCounts).length * 15), 100) || 10;
      
      const createdYear = new Date(user.created_at).getFullYear();
      const currentYear = new Date().getFullYear();
      const yearsActive = currentYear - createdYear || 1;
      const experienceScore = Math.min((yearsActive * 12), 100);
      
      const influenceScore = Math.min((totalForks * 3) + (user.public_gists * 5), 100) || 10;

      const data = [
        { subject: 'Activity', A: activityScore, fullMark: 100 },
        { subject: 'Popularity', A: popularityScore, fullMark: 100 },
        { subject: 'Diversity', A: diversityScore, fullMark: 100 },
        { subject: 'Experience', A: experienceScore, fullMark: 100 },
        { subject: 'Influence', A: influenceScore, fullMark: 100 },
      ];
      
      setChartData(data);

      // Determine Persona
      let assignedPersona = { title: 'Junior Padawan', description: 'Just starting the coding journey.', color: '#38bdf8' };
      
      if (totalStars > 100 || user.followers > 50) {
        assignedPersona = { title: 'Open Source Influencer', description: 'Your code is loved and followed by the community!', color: '#f59e0b' };
      } else if (Object.keys(langCounts).length > 8) {
        assignedPersona = { title: 'Polyglot Sorcerer', description: 'You speak many languages and adapt to any stack.', color: '#a855f7' };
      } else if (user.public_repos > 50) {
        assignedPersona = { title: 'Code Machine', description: 'You are constantly building and pushing new projects.', color: '#10b981' };
      } else if (yearsActive > 5) {
        assignedPersona = { title: 'Veteran Architect', description: 'A seasoned developer with years of deep experience.', color: '#6366f1' };
      } else if (totalStars > 10) {
        assignedPersona = { title: 'Rising Star', description: 'Gaining traction in the developer community.', color: '#ec4899' };
      }

      setTopLangs(sortedLangs);
      setTopRepositories(topRepos);
      setPersona(assignedPersona);
      setUserData({ ...user, totalStars, totalForks, uniqueLanguages: Object.keys(langCounts).length });
      toast.success('Persona Analyzed!');
    } catch (error) {
      toast.error('Error fetching data. GitHub API limit may be reached or user not found.');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Navbar />
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          <span className="heading-gradient">Developer Persona Analyzer</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Enter your GitHub username to generate an AI-powered developer report card and radar chart.
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto', position: 'relative', zIndex: 10 }}>
        <form onSubmit={analyzeGitHub} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <GitBranch size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g., torvalds" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ paddingLeft: '48px', fontSize: '1.1rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
              required
            />
          </div>
          <button type="submit" className="btn-primary hover-glow" disabled={loading} style={{ padding: '0 2rem', borderRadius: '16px' }}>
            {loading ? 'Scanning...' : <><Search size={20} /> Analyze</>}
          </button>
        </form>
      </div>

      {/* Holographic Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .holographic-card {
          position: relative;
          background: linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(10, 10, 15, 0.9));
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .holographic-card:hover {
          transform: translateY(-10px) scale(1.02);
        }
        .holo-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
          background-size: 100% 200%;
          animation: holoScan 4s linear infinite;
          pointer-events: none;
          z-index: 5;
        }
        @keyframes holoScan {
          0% { background-position: 0 -100%; }
          100% { background-position: 0 200%; }
        }
        .avatar-glow {
          position: relative;
          z-index: 10;
        }
        .avatar-glow::before {
          content: '';
          position: absolute;
          top: -10px; left: -10px; right: -10px; bottom: -10px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent, var(--theme-color), transparent);
          animation: spin 3s linear infinite;
          z-index: -1;
          filter: blur(10px);
        }
      `}} />

      {userData && persona && (
        <div className="cascade-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Holographic Persona Card */}
          <div className="holographic-card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', '--theme-color': persona.color }}>
            <div className="holo-overlay"></div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: 'radial-gradient(ellipse at top, ' + persona.color + '60, transparent 70%)', zIndex: 1 }}></div>
            
            <div className="avatar-glow" style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>
              <img 
                src={userData.avatar_url} 
                alt="Avatar" 
                style={{ width: '140px', height: '140px', borderRadius: '50%', border: '4px solid ' + persona.color, zIndex: 10, position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
              />
            </div>
            
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.2rem', zIndex: 10, color: '#fff', letterSpacing: '-0.5px' }}>{userData.name || userData.login}</h2>
            <a href={userData.html_url} target="_blank" rel="noreferrer" style={{ color: persona.color, textDecoration: 'none', marginBottom: '2rem', zIndex: 10, fontWeight: '500', fontSize: '1.1rem' }}>@{userData.login}</a>
            
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid ' + persona.color + '40', padding: '1.5rem', borderRadius: '16px', width: '100%', marginBottom: '2.5rem', zIndex: 10, backdropFilter: 'blur(10px)', boxShadow: 'inset 0 0 20px ' + persona.color + '10' }}>
              <div style={{ color: persona.color, display: 'flex', justifyContent: 'center', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px ' + persona.color + '80)' }}>
                <Award size={40} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{persona.title}</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{persona.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', width: '100%', zIndex: 10 }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <Code size={20} color="#38bdf8" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{userData.public_repos}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Repositories</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <Users size={20} color="#a855f7" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{userData.followers}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Followers</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <Star size={20} color="#facc15" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{userData.totalStars}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Stars</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <GitFork size={20} color="#10b981" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{userData.uniqueLanguages}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Languages</div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.2s', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '700' }}>
              <Activity size={24} color={persona.color} /> Engineering Matrix
            </h3>
            
            <div style={{ width: '100%', height: '400px', filter: `drop-shadow(0 0 10px ${persona.color}40)` }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(20, 20, 25, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: persona.color }}
                  />
                  <Radar name={userData.login} dataKey="A" stroke={persona.color} fill={persona.color} fillOpacity={0.5} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Metrics are calculated dynamically based on public repositories, followers, stars, and account age.
            </p>
          </div>
        </div>
      )}

      {/* Top Languages & Repos */}
      {userData && persona && (
        <div className="cascade-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '3rem auto 0', animationDelay: '0.4s' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: `1px solid ${persona.color}30` }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code size={20} color={persona.color} /> Top Languages
            </h3>
            {topLangs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topLangs.map((lang, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.95rem' }}>
                      <span style={{ fontWeight: '500' }}>{lang.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{lang.percent}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${lang.percent}%`, height: '100%', background: persona.color, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No language data available.</p>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: `1px solid ${persona.color}30` }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={20} color="#facc15" /> Top Repositories
            </h3>
            {topRepositories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topRepositories.map((repo, index) => (
                  <a key={index} href={repo.html_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8', marginBottom: '5px', wordBreak: 'break-all' }}>{repo.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{repo.description || 'No description provided.'}</div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#fff' }}>
                      {repo.language && <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: persona.color }}></div> {repo.language}</span>}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Star size={14} color="#facc15" /> {repo.stargazers_count}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><GitFork size={14} color="#10b981" /> {repo.forks_count}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No public repositories found.</p>
            )}
          </div>
          
        </div>
      )}

      {/* GitHub Contributions Graph */}
      {userData && persona && (
        <div className="cascade-reveal" style={{ maxWidth: '1000px', margin: '3rem auto 0', animationDelay: '0.6s' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: `1px solid ${persona.color}30`, textAlign: 'center', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Activity size={24} color={persona.color} /> Consistency Heatmap
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-block', minWidth: '100%' }}>
               <img 
                 src={`https://ghchart.rshah.org/${persona.color.replace('#', '')}/${userData.login}`} 
                 alt={`${userData.login}'s GitHub chart`} 
                 style={{ width: '100%', maxWidth: '900px', filter: 'hue-rotate(0deg) drop-shadow(0 0 8px rgba(255,255,255,0.1))' }} 
               />
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Public contributions over the last year.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
