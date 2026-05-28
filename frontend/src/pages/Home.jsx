import { Link } from 'react-router-dom';
import { Sparkles, BrainCircuit, Code, Users, Play, ArrowRight, ShieldCheck, Zap, Globe, Mic2, Terminal, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';

const words = ['Interviews', 'System Design', 'DSA Coding', 'HR Rounds'];

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    let timeoutId;
    const currentWord = words[wordIndex];

    if (isTyping) {
      if (typedText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setTypedText(currentWord.slice(0, typedText.length + 1));
        }, 100);
      } else {
        timeoutId = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (typedText.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedText(currentWord.slice(0, typedText.length - 1));
        }, 50);
      } else {
        setWordIndex((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [typedText, isTyping, wordIndex]);

  // Smooth scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-up-element');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container" style={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative', background: '#0a0a0f' }}>
      
      {/* Animated Glowing Grid Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px', transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)', animation: 'gridMove 20s linear infinite' }}></div>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'pulse 4s infinite alternate' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'pulse 5s infinite alternate-reverse' }} />
      </div>

      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 50px; }
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}</style>

      {/* Hero Section */}
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        
        <div className="glass-panel" style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeInDown 1s ease', border: '1px solid rgba(168, 85, 247, 0.4)', background: 'rgba(20,20,30,0.6)', boxShadow: '0 0 20px rgba(168,85,247,0.2)' }}>
          <Sparkles size={18} color="#c084fc" className="animate-pulse" />
          <span style={{ fontSize: '1rem', color: '#e9d5ff', fontWeight: '600', letterSpacing: '0.5px' }}>PrepGenie AI 2.0 is Here</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem', animation: 'fadeInUp 1s ease 0.2s backwards', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          Master Your <br/>
          <span className="heading-gradient" style={{ display: 'inline-block', minWidth: 'auto', textAlign: 'center' }}>
            {typedText}<span className="animate-pulse" style={{ color: '#fff' }}>|</span>
          </span>
        </h1>
        
        <p style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: '650px', marginBottom: '3.5rem', lineHeight: '1.6', animation: 'fadeInUp 1s ease 0.4s backwards' }}>
          Stop memorizing generic answers. PrepGenie uses advanced AI to simulate real interviews, review your system designs, and build your developer persona.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeInUp 1s ease 0.6s backwards' }}>
          <Link to="/auth" className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: 'clamp(1rem, 3vw, 1.2rem)', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '50px', boxShadow: '0 0 30px rgba(168,85,247,0.4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
            <Play fill="currentColor" size={20} />
            Start Your Journey
          </Link>
          <a href="#features" className="btn-secondary" style={{ padding: '1.2rem 2.5rem', fontSize: 'clamp(1rem, 3vw, 1.2rem)', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
            Explore Features <ArrowRight size={20} />
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }} className="fade-up-element">
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '1.5rem' }}>Unfair Advantage for <span style={{ color: '#3b82f6', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Developers</span>.</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 3vw, 1.3rem)', maxWidth: '600px', margin: '0 auto' }}>Everything you need to crack FAANG and top startups.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          
          {/* Feature 1 */}
          <div className="fade-up-element" style={{ display: 'flex', gap: '5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'inline-flex', padding: '1.2rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '20px', marginBottom: '1.5rem', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)', boxShadow: '0 0 30px rgba(168,85,247,0.2)' }}>
                <BrainCircuit size={36} />
              </div>
              <h3 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2' }}>AI Mock Interviews</h3>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                Experience realistic technical and behavioral interviews with our voice-enabled AI. Get instant feedback on your tone, technical accuracy, and communication skills.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1.1rem' }}><ShieldCheck color="#10b981" size={24} /> Real-time feedback & scoring</li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1.1rem' }}><Mic2 color="#10b981" size={24} /> Voice tone & confidence analysis</li>
              </ul>
            </div>
            <div className="glass-panel premium-3d cascade-reveal" style={{ flex: '1 1 300px', height: '450px', width: '100%', borderRadius: '30px', background: 'radial-gradient(circle at top right, rgba(168,85,247,0.2), transparent 50%), linear-gradient(135deg, rgba(15,23,42,0.9), rgba(0,0,0,0.8))', border: '1px solid rgba(168,85,247,0.4)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(168,85,247,0.1)' }}>
              
              {/* Background Glow */}
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'rgba(168,85,247,0.4)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%', height: '75%', background: 'rgba(15,23,42,0.6)', borderRadius: '24px', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}>
                
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.15)', padding: '0.4rem 1rem', borderRadius: '50px', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981', animation: 'pulse 1.5s infinite' }}></div>
                  <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>AI ACTIVE</span>
                </div>

                {/* Mic & Wave */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(168,85,247,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite', border: '2px solid rgba(168,85,247,0.6)', boxShadow: '0 0 30px rgba(168,85,247,0.3)' }}>
                    <Mic2 size={32} color="#e9d5ff" />
                  </div>
                  {/* Soundwaves */}
                  <div style={{ display: 'flex', gap: '5px', height: '40px', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} style={{ width: '4px', height: `${15 + Math.random()*25}px`, background: 'linear-gradient(to top, #c084fc, #e9d5ff)', borderRadius: '4px', animation: `wave 1s ease-in-out infinite ${i*0.15}s` }}></div>
                    ))}
                  </div>
                </div>

                {/* Subtitle / Transcript */}
                <div style={{ width: '85%', padding: '1.2rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
                  <div style={{ color: '#c084fc', fontWeight: '600', fontSize: '1rem', letterSpacing: '0.5px', marginBottom: '0.8rem', fontStyle: 'italic' }}>"Tell me about a time you failed..."</div>
                  <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(59,130,246,0.15)', color: '#93c5fd', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(59,130,246,0.3)' }}>Tone: Confident</span>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.3)' }}>Pace: Optimal</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="fade-up-element" style={{ display: 'flex', gap: '5rem', alignItems: 'center', flexWrap: 'wrap-reverse' }}>
            <div className="glass-panel premium-3d cascade-reveal" style={{ flex: '1 1 300px', height: 'auto', minHeight: '450px', borderRadius: '30px', background: 'radial-gradient(circle at bottom left, rgba(59,130,246,0.2), transparent 50%), linear-gradient(135deg, rgba(15,23,42,0.9), rgba(0,0,0,0.8))', border: '1px solid rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(59,130,246,0.1)', position: 'relative', overflow: 'hidden' }}>
              
              {/* Blueprint Grid Overlay */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.6 }}></div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', padding: '2rem', width: '100%', position: 'relative', zIndex: 1 }}>
                  {/* Box 1: Client / Load Balancer */}
                  <div 
                    style={{ height: '130px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.4)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.1)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.2)'; e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.1)'; e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.4)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>🖥️</span>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <div style={{ width: '4px', height: '12px', background: '#3b82f6', animation: 'wave 1s ease-in-out infinite' }}></div>
                        <div style={{ width: '4px', height: '18px', background: '#3b82f6', animation: 'wave 1s ease-in-out infinite 0.2s' }}></div>
                        <div style={{ width: '4px', height: '12px', background: '#3b82f6', animation: 'wave 1s ease-in-out infinite 0.4s' }}></div>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.5px' }}>Load Balancer</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Traffic Router</p>
                    </div>
                  </div>

                  {/* Box 2: API Gateway / Server */}
                  <div 
                    style={{ height: '130px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.05)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.2)'; e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.05)'; e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.3)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'pulse 1.5s infinite' }}></div>
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.5px' }}>API Gateway</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Auth & Rate Limits</p>
                    </div>
                  </div>

                  {/* Box 3: Distributed Cache / Redis */}
                  <div 
                    style={{ height: '130px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.05)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.2)'; e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.05)'; e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.3)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>🗄️</span>
                      <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>99.9% HIT</div>
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.5px' }}>Redis Cache</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>In-Memory Store</p>
                    </div>
                  </div>

                  {/* Box 4: Core Database / PostgreSQL */}
                  <div 
                    style={{ height: '130px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.4)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.1)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.2)'; e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.1)'; e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.4)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>💧</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#3b82f6' }}></div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(59, 130, 246, 0.3)' }}></div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(59, 130, 246, 0.3)' }}></div>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.5px' }}>PostgreSQL</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Primary Database</p>
                    </div>
                  </div>
                </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'inline-flex', padding: '1.2rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', marginBottom: '1.5rem', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}>
                <Code size={36} />
              </div>
              <h3 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2' }}>Smart System Design</h3>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                Draw your architecture on our interactive whiteboard and let PrepGenie review it. Get suggestions on scalability, bottlenecks, and alternative databases.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1.1rem' }}><Zap color="#facc15" size={24} /> Architecture Scalability Analysis</li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1.1rem' }}><Terminal color="#facc15" size={24} /> Component & Database Optimization</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div style={{ padding: '8rem 2rem', textAlign: 'center', background: 'linear-gradient(to top, rgba(168,85,247,0.15), transparent)', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(168,85,247,0.2)' }}>
        <h2 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem', textShadow: '0 0 30px rgba(168,85,247,0.5)' }}>Ready to get hired?</h2>
        <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem auto' }}>Join the community of developers cracking top interviews at FAANG and beyond.</p>
        <Link to="/auth" className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.4rem', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '1rem', boxShadow: '0 20px 50px rgba(168,85,247,0.5)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
          Start Now <ArrowRight size={24} />
        </Link>
      </div>

    </div>
  );
}
