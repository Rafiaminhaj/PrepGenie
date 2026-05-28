import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, MessageSquare } from 'lucide-react';
import { playClickSound } from '../utils/sound';

export default function FloatingGenie() {
  const [showBubble, setShowBubble] = useState(false);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [hoverTimes, setHoverTimes] = useState([]);

  // Hide genie on auth page
  if (location.pathname === '/auth' || location.pathname === '/') {
    return null;
  }

  useEffect(() => {
    // Array of motivational AI greetings
    const messages = [
      "Master, today is a great day to practice System Design!",
      "Ready to level up your Java skills today?",
      "Your next big interview is waiting. Let's practice!",
      "Need a quick revision? Try the Smart Flashcards!",
      "I am at your service. Ask me anything in Chat!"
    ];
    
    // Pick a random message
    setGreeting(messages[Math.floor(Math.random() * messages.length)]);

    // Show bubble automatically for the first 8 seconds after login/mount
    const timer = setTimeout(() => {
      setShowBubble(true);
      
      // Hide it after 6 seconds
      const hideTimer = setTimeout(() => {
        setShowBubble(false);
      }, 6000);
      
      return () => clearTimeout(hideTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Only trigger when route changes

  const handleClick = () => {
    playClickSound();
    navigate('/chat');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '1rem'
      }}
    >
      {/* Speech Bubble */}
      <div 
        style={{
          background: 'rgba(20, 20, 25, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          padding: '1rem 1.5rem',
          borderRadius: '16px 16px 0 16px',
          boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.2)',
          maxWidth: '250px',
          color: 'var(--text-main)',
          fontSize: '0.95rem',
          lineHeight: '1.4',
          opacity: showBubble ? 1 : 0,
          transform: showBubble ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          pointerEvents: showBubble ? 'auto' : 'none',
          cursor: 'pointer'
        }}
        onClick={handleClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#a855f7', fontWeight: '600', fontSize: '0.85rem' }}>
          <Sparkles size={14} /> Genie
        </div>
        {greeting}
      </div>

      {/* Floating Lamp / Avatar */}
      <div 
        className="genie-avatar"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)',
          position: 'relative'
        }}
        onMouseEnter={() => {
          setShowBubble(true);
          const now = Date.now();
          const newTimes = [...hoverTimes, now].filter(t => now - t < 2000);
          setHoverTimes(newTimes);
          
          if (newTimes.length >= 4) {
            document.body.classList.toggle('cave-of-wonders');
            const isGolden = document.body.classList.contains('cave-of-wonders');
            window.dispatchEvent(new CustomEvent('theme-magic', { detail: { theme: isGolden ? 'golden' : 'default' }}));
            setHoverTimes([]);
          }
        }}
        onMouseLeave={() => {
          // Add a slight delay before closing to make it feel natural
          setTimeout(() => setShowBubble(false), 500);
        }}
        onClick={handleClick}
      >
        <MessageSquare size={28} color="#ffffff" style={{ zIndex: 2 }} />
        
        {/* Pulsing rings */}
        <div className="pulse-ring" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid #a855f7', opacity: 0.5 }}></div>
        <div className="pulse-ring delay" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid #6366f1', opacity: 0.3 }}></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .genie-avatar {
          animation: float 4s ease-in-out infinite;
          transition: transform 0.2s ease;
        }
        
        .genie-avatar:hover {
          transform: scale(1.1) !important;
        }

        .pulse-ring {
          animation: pulseRing 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        
        .pulse-ring.delay {
          animation-delay: 1.25s;
        }
      `}} />
    </div>
  );
}
