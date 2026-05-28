import { useState, useEffect } from 'react';
import { Flame, Zap, Clock, Star, ArrowRight, Layers, Sparkles, Terminal, Upload, FileText, X, CheckCircle, Database, Server, Network, Shield, BookOpen, Mic, Cpu, User, Code, Trophy, Medal, Award } from 'lucide-react';
import { playHoverInSound, playHoverOutSound } from '../utils/sound';
import { useDropzone } from 'react-dropzone';

const MOCK_JAVA_QUESTIONS = [
  {
    q: "What is the main difference between fail-fast and fail-safe iterators in Java?",
    a: ["Fail-fast throws ConcurrentModificationException, fail-safe doesn't", "Fail-safe is faster than fail-fast", "Fail-fast operates on a clone of the collection", "There is no difference"],
    c: 0,
    exp: "Fail-fast iterators operate directly on the collection and throw ConcurrentModificationException if modified during iteration. Fail-safe iterators operate on a clone."
  },
  {
    q: "Which of the following is true about the volatile keyword?",
    a: ["It guarantees atomicity of compound operations", "It ensures visibility of changes across threads", "It is used to synchronize blocks of code", "It prevents deadlocks"],
    c: 1,
    exp: "The volatile keyword guarantees visibility of changes to variables across threads but does not guarantee atomicity for compound operations like count++."
  },
  {
    q: "How does the ConcurrentHashMap achieve high concurrency?",
    a: ["By locking the entire map during updates", "By using a single global lock", "By dividing the map into segments (or using CAS in Java 8+)", "By using synchronized methods"],
    c: 2,
    exp: "ConcurrentHashMap achieves high concurrency by locking at a granular level (segment-level lock in Java 7, and CAS operations with node-level locks in Java 8+)."
  }
];

const CORE_TOPICS = [
  { id: 'caching', title: 'Caching Strategies', icon: <Zap size={24} />, color: '#f59e0b', desc: 'Redis, Memcached, Write-through vs Write-back.', detail: 'Caching significantly reduces database load and speeds up read operations. A Write-through cache updates both cache and DB synchronously, ensuring data consistency, while Write-back updates the DB asynchronously.' },
  { id: 'loadbalancer', title: 'Load Balancing', icon: <Network size={24} />, color: '#ec4899', desc: 'Round Robin, Least Connections, Layer 4 vs Layer 7.', detail: 'Load balancers distribute incoming network traffic across multiple servers. Layer 4 load balancing operates at the transport layer (TCP/UDP), while Layer 7 operates at the application layer (HTTP) for smarter routing.' },
  { id: 'sharding', title: 'Database Sharding', icon: <Database size={24} />, color: '#10b981', desc: 'Horizontal partitioning, Consistent Hashing.', detail: 'Sharding splits a large database into smaller, faster, and more easily managed parts called data shards. Consistent hashing helps in distributing data evenly without major rebalancing when nodes are added or removed.' },
  { id: 'security', title: 'Security & Auth', icon: <Shield size={24} />, color: '#3b82f6', desc: 'JWT, OAuth 2.0, Rate Limiting, CORS.', detail: 'Security is paramount. JWTs provide stateless authentication. OAuth 2.0 allows delegated access. Rate limiting prevents DDoS attacks and brute force attempts.' }
];

export default function Dashboard() {
  const [greeting, setGreeting] = useState('Welcome back');
  const [userName, setUserName] = useState('Scholar');
  const [searchQuery, setSearchQuery] = useState('');

  // New Features States
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [activeTopicState, setActiveTopicState] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
  
  const [quizQuestions, setQuizQuestions] = useState(MOCK_JAVA_QUESTIONS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Dropzone logic
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setIsAnalyzingPdf(true);
      setPdfUploadProgress(0);
      
      const interval = setInterval(() => {
        setPdfUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsAnalyzingPdf(false);
              setIsQuizActive(true);
              setQuizFinished(false);
              setQuizScore(0);
              setCurrentQIndex(0);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'application/pdf': ['.pdf']}
  });
  
  const handleQuizSelect = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === quizQuestions[currentQIndex].c) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    if (currentQIndex < quizQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  // Terminal State
  const terminalLines = [
    "> Initializing PrepGenie AI Core...",
    "> Establishing WebSocket connection... [OK]",
    "> Loading LLM for Mock Interviews...",
    "> Calibrating Voice Analysis Engine...",
    "> Analyzing time complexity... O(N log N)",
    "> System architecture optimal. Ready."
  ];
  const [visibleLines, setVisibleLines] = useState(1);

  useEffect(() => {
    // Real-time System Time Greeting Logic
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
      setGreeting('Good Morning 🌅');
    } else if (hour >= 12 && hour < 16) {
      setGreeting('Good Afternoon ☀️');
    } else {
      setGreeting('Good Evening 🌙');
    }
    
    // Dynamic User Name Tracking
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.name) {
          setUserName(parsed.name);
        }
      } catch (e) {
        setUserName('Scholar');
      }
    } else {
      setUserName('Scholar');
    }

    // Fetch stats and badges from Supabase
    import('../lib/supabase').then(async ({ supabase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('user_stats').select('current_streak, gems').eq('user_id', user.id).single();
        if (data) {
          const badges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
          if (data.current_streak >= 1 && !badges.includes('first_blood')) {
            badges.push('first_blood');
            localStorage.setItem('unlockedBadges', JSON.stringify(badges));
          }
          setUnlockedBadges(badges);
        } else {
          // Fallback logic
          const badges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
          const streak = parseInt(localStorage.getItem('prepGenie_streak') || '1');
          if (streak >= 1 && !badges.includes('first_blood')) {
            badges.push('first_blood');
            localStorage.setItem('unlockedBadges', JSON.stringify(badges));
          }
          setUnlockedBadges(badges);
        }
      }
    });
    // Terminal typing effect
    const interval = setInterval(() => {
      setVisibleLines(prev => (prev < terminalLines.length ? prev + 1 : 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simulate navigation to chat with query
      window.location.href = `/chat?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'fixed', top: '10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Welcome Banner */}
        <div className="glass-panel premium-3d" style={{ 
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)', 
          borderRadius: '30px', 
          marginBottom: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          background: 'linear-gradient(135deg, rgba(20,20,30,0.6) 0%, rgba(10,10,15,0.8) 100%)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(168, 85, 247, 0.1)'
        }}>
          <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', marginBottom: '1.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
              <Star size={16} fill="currentColor" /> Welcome to the Future of Interview Prep
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              {greeting}, {userName}
            </div>
            <h1 className="hero-summon-text" style={{ fontWeight: '800', lineHeight: '1.1', marginBottom: '1rem', letterSpacing: '-1px' }}>
              Summon Your <span className="heading-gradient">Potential.</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
              PrepGenie isn't just an app; it's a comprehensive AI ecosystem designed to help you master technical interviews, analyze your resume, and write better code.
            </p>
          </div>
          
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '400px', 
              aspectRatio: '1', 
              borderRadius: '24px', 
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(20,20,30,0.4) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 40px rgba(168, 85, 247, 0.15)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Animated Background Gradients */}
              <div style={{ position: 'absolute', width: '150%', height: '150%', background: 'conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.1), transparent 30%)', animation: 'spin 10s linear infinite' }}></div>
              <div style={{ position: 'absolute', width: '200px', height: '200px', background: '#a855f7', filter: 'blur(80px)', opacity: 0.3, animation: 'pulse 4s infinite' }}></div>
              
              {/* Floating Holographic Structure */}
              <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', perspective: '1000px' }}>
                
                {/* AI Avatar */}
                <div style={{ position: 'absolute', top: '15%', left: '20%', animation: 'float 4s ease-in-out infinite' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '15px', borderRadius: '50%', border: '1px solid #3b82f6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
                    <Cpu size={32} color="#3b82f6" />
                  </div>
                  <div style={{ color: '#3b82f6', fontSize: '0.7rem', fontWeight: 'bold', marginTop: '5px', textAlign: 'center' }}>AI GENIE</div>
                </div>

                {/* Student Avatar */}
                <div style={{ position: 'absolute', bottom: '15%', right: '20%', animation: 'float 5s ease-in-out infinite 1s' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '15px', borderRadius: '50%', border: '1px solid #10b981', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                    <User size={32} color="#10b981" />
                  </div>
                  <div style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 'bold', marginTop: '5px', textAlign: 'center' }}>STUDENT</div>
                </div>

                {/* System Design Visual */}
                <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(20,20,30,0.8)', padding: '15px', borderRadius: '12px', border: '1px dashed #a855f7', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'float 6s ease-in-out infinite 0.5s' }}>
                  <Network size={24} color="#a855f7" />
                  <div style={{ height: '2px', width: '30px', background: 'rgba(168, 85, 247, 0.5)' }}></div>
                  <Database size={24} color="#eab308" />
                </div>

                {/* Java Code Structure Visual */}
                <div style={{ position: 'absolute', bottom: '35%', left: '40%', transform: 'rotateX(20deg) rotateY(-20deg)', background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', borderLeft: '3px solid #ec4899', backdropFilter: 'blur(5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'float 5.5s ease-in-out infinite 1.5s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Code size={16} color="#ec4899" />
                    <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: '500' }}>AuthService.java</span>
                  </div>
                  <div style={{ width: '120px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginBottom: '6px' }}></div>
                  <div style={{ width: '90px', height: '4px', background: 'rgba(236,72,153,0.5)', borderRadius: '2px', marginBottom: '6px', marginLeft: '10px' }}></div>
                  <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginLeft: '10px' }}></div>
                </div>

                {/* Connection Lines (SVGs) */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <path d="M 120 100 Q 200 150 200 150" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  <path d="M 280 300 Q 200 200 180 250" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  <circle cx="200" cy="150" r="3" fill="#a855f7" />
                  <circle cx="180" cy="250" r="3" fill="#ec4899" />
                </svg>

              </div>
            </div>
          </div>
        </div>

        {/* Genie's Quick Insights - Control Grid */}
        <div style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', animation: 'fadeInUp 1s ease 0.4s backwards', maxWidth: '850px', margin: '0 auto 4rem auto' }}>
          
          <button 
            onClick={() => window.location.href = '/practice-quiz'}
            className="glass-panel hover-glow" 
            style={{ 
              padding: '1.5rem', 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(20,20,30,0.8) 100%)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ padding: '12px', background: 'rgba(234, 179, 8, 0.2)', borderRadius: '50%', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={28} style={{ animation: 'pulse 2s infinite' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Quick Practice Quiz (5 min)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Test your Java & System Design skills instantly</div>
            </div>
          </button>

          <button 
            onClick={() => window.location.href = '/smart-notebook'}
            className="glass-panel hover-glow" 
            style={{ 
              padding: '1.5rem', 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(20,20,30,0.8) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '50%', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mic size={28} style={{ animation: 'pulse 2s infinite' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Start Daily AI Audio Pod</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Listen to 2-minute bite-sized core concept revision</div>
            </div>
          </button>

        </div>

        {/* --- NEW BADGES & ACHIEVEMENTS SECTION --- */}
        <div style={{ marginBottom: '4rem', animation: 'fadeInUp 1s ease 0.45s backwards' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Medal color="#facc15" /> Your Earned Badges
            </h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px' }}>
              3 Unlocked
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            
            {/* Badge 1 */}
            <div className={`glass-panel ${unlockedBadges.includes('first_blood') ? 'hover-glow' : ''}`} style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', background: unlockedBadges.includes('first_blood') ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(0,0,0,0.4) 100%)' : 'rgba(0,0,0,0.2)', border: unlockedBadges.includes('first_blood') ? '1px solid rgba(245, 158, 11, 0.3)' : '1px dashed rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', opacity: unlockedBadges.includes('first_blood') ? 1 : 0.6 }}>
              {unlockedBadges.includes('first_blood') && <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 50%)', animation: 'spin 10s linear infinite' }}></div>}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ background: unlockedBadges.includes('first_blood') ? 'linear-gradient(135deg, #f59e0b, #ca8a04)' : 'rgba(255,255,255,0.05)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: unlockedBadges.includes('first_blood') ? '0 0 20px rgba(245, 158, 11, 0.5)' : 'none', border: '2px solid rgba(255,255,255,0.2)' }}>
                  <Flame size={30} color={unlockedBadges.includes('first_blood') ? "#fff" : "var(--text-muted)"} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: unlockedBadges.includes('first_blood') ? '#fff' : 'var(--text-muted)', marginBottom: '5px' }}>First Blood</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{unlockedBadges.includes('first_blood') ? 'Maintained a 1-day streak' : 'Lock: Maintain a 1-day streak'}</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className={`glass-panel ${unlockedBadges.includes('quiz_master') ? 'hover-glow' : ''}`} style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', background: unlockedBadges.includes('quiz_master') ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0.4) 100%)' : 'rgba(0,0,0,0.2)', border: unlockedBadges.includes('quiz_master') ? '1px solid rgba(59, 130, 246, 0.3)' : '1px dashed rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', opacity: unlockedBadges.includes('quiz_master') ? 1 : 0.6 }}>
              {unlockedBadges.includes('quiz_master') && <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 50%)', animation: 'spin 12s linear infinite reverse' }}></div>}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ background: unlockedBadges.includes('quiz_master') ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.05)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: unlockedBadges.includes('quiz_master') ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none', border: '2px solid rgba(255,255,255,0.2)' }}>
                  <Award size={30} color={unlockedBadges.includes('quiz_master') ? "#fff" : "var(--text-muted)"} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: unlockedBadges.includes('quiz_master') ? '#fff' : 'var(--text-muted)', marginBottom: '5px' }}>Quiz Master</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{unlockedBadges.includes('quiz_master') ? 'Scored well in Practice Quiz' : 'Lock: Score 5+ in Practice Quiz'}</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className={`glass-panel ${unlockedBadges.includes('system_architect') ? 'hover-glow' : ''}`} style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', background: unlockedBadges.includes('system_architect') ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0.4) 100%)' : 'rgba(0,0,0,0.2)', border: unlockedBadges.includes('system_architect') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px dashed rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', opacity: unlockedBadges.includes('system_architect') ? 1 : 0.6 }}>
              {unlockedBadges.includes('system_architect') && <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 50%)', animation: 'spin 15s linear infinite' }}></div>}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ background: unlockedBadges.includes('system_architect') ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: unlockedBadges.includes('system_architect') ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none', border: '2px solid rgba(255,255,255,0.2)' }}>
                  <Layers size={30} color={unlockedBadges.includes('system_architect') ? "#fff" : "var(--text-muted)"} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: unlockedBadges.includes('system_architect') ? '#fff' : 'var(--text-muted)', marginBottom: '5px' }}>System Architect</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{unlockedBadges.includes('system_architect') ? 'Completed a System Design task' : 'Lock: Design a System'}</p>
              </div>
            </div>

            {/* Locked Badge */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', border: '1px dashed rgba(255,255,255,0.1)', opacity: 0.6 }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '2px solid rgba(255,255,255,0.1)' }}>
                <Trophy size={30} color="var(--text-muted)" />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '5px' }}>Interview Ace</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lock: Pass AI HR Interview</p>
            </div>

          </div>
        </div>
        {/* ------------------------------------------- */}

        {/* Interactive Student Study Room Modules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem', animation: 'fadeInUp 1s ease 0.5s backwards' }}>
          
          {/* 1. Topic Mastery Panel */}
          <div className="glass-panel premium-3d" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(20,20,30,0.6) 0%, rgba(10,10,15,0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen color="#10b981" /> Topic Mastery
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>Java Core & Architecture</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>75%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', boxShadow: '0 0 10px #10b981', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>System Design Mastery</span>
                <span style={{ color: '#a855f7', fontWeight: '600' }}>40%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #a855f7, #c084fc)', boxShadow: '0 0 10px #a855f7', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          {/* 2. Today's Prep Target */}
          <div className="glass-panel premium-3d" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(20,20,30,0.6) 0%, rgba(10,10,15,0.8) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle color="#3b82f6" /> Today's Prep Target
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <CheckCircle size={18} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>Complete 1 Mock HR Interview</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', marginTop: '2px', flexShrink: 0 }}></div>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Attempt Java Quiz from Uploaded PDF</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', marginTop: '2px', flexShrink: 0 }}></div>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Design a system with Load Balancer on Canvas</span>
              </div>
            </div>
          </div>

          {/* 3. Genie's Daily Byte */}
          <div className="glass-panel premium-3d hover-glow" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(20,20,30,0.8) 100%)', border: '1px solid rgba(236, 72, 153, 0.3)', cursor: 'pointer' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#ec4899' }}>
              <Sparkles color="#ec4899" /> Genie's Daily Byte
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-main)', lineHeight: '1.5' }}>
                💡 Concept of the Day: <span style={{ color: '#ec4899' }}>Why use Redis over traditional DB for sessions?</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #ec4899', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <strong>Answer:</strong> In-memory retrieval speeds up sub-millisecond lookups! Redis avoids disk I/O, making it extremely fast for ephemeral data like session tokens.
              </div>
            </div>
          </div>

        </div>

        {/* Project About Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap color="#eab308" /> Project Highlights
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Card 1 */}
            <div className="glass-panel premium-3d" style={{ borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="showcase-image-container">
                <div className="showcase-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop")' }}></div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', color: '#3b82f6' }}>AI-Powered Engine</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Powered by cutting-edge LLMs, PrepGenie dynamically generates context-aware interview questions, parses complex PDF resumes, and provides real-time architectural feedback.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-panel premium-3d" style={{ borderRadius: '24px', border: '1px solid rgba(236, 72, 153, 0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="showcase-image-container">
                <div className="showcase-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop")' }}></div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', color: '#ec4899' }}>Real-time Architecture</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Built with a modern Spring Boot backend and React frontend, utilizing WebSockets for zero-latency AI chat and dynamic state management without page reloads.
                </p>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="glass-panel premium-3d" style={{ borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="showcase-image-container">
                <div className="showcase-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop")' }}></div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', color: '#10b981' }}>Gamified Experience</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Learning doesn't have to be boring. With a custom-built dynamic leaderboard, daily gem rewards, and streak tracking, preparation feels like an engaging game.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass-panel premium-3d" style={{ borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="showcase-image-container">
                <div className="showcase-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2069&auto=format&fit=crop")' }}></div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', color: '#f59e0b' }}>Smart Notebook</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Paste any study material and instantly generate interactive flashcards, personalized AI podcasts, and study guides. It's like having a tutor in your pocket.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="glass-panel premium-3d" style={{ borderRadius: '24px', border: '1px solid rgba(168, 85, 247, 0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="showcase-image-container">
                <div className="showcase-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop")' }}></div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', color: '#a855f7' }}>Visual Concepts</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Struggling with a complex topic? PrepGenie automatically generates architectural diagrams and visual representations to help you understand better.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="glass-panel premium-3d" style={{ borderRadius: '24px', border: '1px solid rgba(14, 165, 233, 0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="showcase-image-container">
                <div className="showcase-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop")' }}></div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600', color: '#0ea5e9' }}>Mock Interviews</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Simulate real-world technical interviews with our voice-enabled AI. Get instant feedback on your answers, communication tone, and technical accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Tech Stack & System Status */}
        <div style={{ 
          marginTop: '6rem', 
          display: 'flex', 
          gap: '2rem', 
          flexWrap: 'wrap',
          animation: 'fadeInUp 1s ease 0.8s backwards'
        }}>
          
          {/* Tech Stack */}
          <div className="glass-panel" style={{ 
            flex: '2 1 600px', 
            padding: '3rem', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(20,20,30,0.6) 0%, rgba(10,10,15,0.8) 100%)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers color="#a855f7" /> Core Architecture
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.5rem' }}>
              {[
                { name: 'React 18', color: '#61dafb' },
                { name: 'Spring Boot', color: '#6db33f' },
                { name: 'Java 17', color: '#f89820' },
                { name: 'LLM Engine', color: '#10a37f' },
                { name: 'WebSockets', color: '#f97316' },
                { name: 'OAuth 2.0', color: '#eab308' },
              ].map((tech, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = tech.color; e.currentTarget.style.boxShadow = `0 10px 20px -10px ${tech.color}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: tech.color, boxShadow: `0 0 10px ${tech.color}` }}></div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="glass-panel" style={{ 
            flex: '1 1 300px', 
            padding: '3rem', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(20,20,30,0.6) 0%, rgba(10,10,15,0.8) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap color="#10b981" /> System Status
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>AI Inference Engine</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '500', fontSize: '0.9rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
                  Operational
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Backend API</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '500', fontSize: '0.9rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                  Connected
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Database Sync</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '500', fontSize: '0.9rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                  Synced
                </span>
              </div>
            </div>
          </div>

          {/* Live AI Terminal */}
          <div className="glass-panel" style={{ 
            flex: '1 1 300px', 
            padding: '2rem', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(5,5,10,0.98) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontFamily: 'monospace',
            boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.05)'
          }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ display: 'flex', gap: '8px' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
               </div>
               <Terminal size={16} color="#10b981" />
             </div>
             <div style={{ color: '#10b981', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                {terminalLines.slice(0, visibleLines).map((line, idx) => (
                  <div key={idx} style={{ opacity: 0.9, textShadow: '0 0 5px rgba(16, 185, 129, 0.4)' }}>{line}</div>
                ))}
                <div style={{ animation: 'pulse 1s infinite', display: 'inline-block', width: '8px', height: '14px', background: '#10b981' }}></div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
