import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle2, Circle, XCircle, Diamond, Sparkles, Trophy, Award } from 'lucide-react';
import CertificateModal from '../components/CertificateModal';
import confetti from 'canvas-confetti';

const MASTER_POOL = [
  { id: 1, q: "Which of the following is true about Java's garbage collection?", options: ["It guarantees that out-of-memory errors will never occur", "It runs on a separate daemon thread", "It can be forced to run by calling System.gc()", "It reclaims memory of unreachable objects immediately"], ans: 1 },
  { id: 2, q: "In System Design, what is the primary purpose of a Load Balancer?", options: ["To encrypt database connections", "To distribute incoming network traffic across multiple servers", "To cache frequently accessed data", "To manage user authentication sessions"], ans: 1 },
  { id: 3, q: "Which data structure is most suitable for implementing a LRU cache?", options: ["Binary Search Tree", "Hash Map + Doubly Linked List", "Array + Queue", "Min Heap"], ans: 1 },
  { id: 4, q: "What is a 'Race Condition' in Java Multithreading?", options: ["When threads compete for CPU time", "When two threads access shared data concurrently and the outcome depends on execution order", "When a thread enters an infinite loop", "When a thread waits indefinitely for a lock"], ans: 1 },
  { id: 5, q: "What is the primary benefit of using a CDN?", options: ["Secure database queries", "Execute server-side logic", "Cache static assets closer to users to reduce latency", "Manage user sessions"], ans: 2 },
  { id: 6, q: "In JVM architecture, where are objects dynamically allocated?", options: ["Stack", "Heap", "Method Area", "PC Register"], ans: 1 },
  { id: 7, q: "Which of the following describes 'Sharding'?", options: ["Adding more CPU to a single server", "Horizontal partitioning of a database into smaller, faster pieces", "Caching data in memory", "Backing up a database"], ans: 1 },
  { id: 8, q: "What does the 'volatile' keyword guarantee in Java?", options: ["Atomicity", "Visibility of changes across threads", "Mutual exclusion", "Deadlock prevention"], ans: 1 },
  { id: 9, q: "Which strategy helps in handling 'Cache Stampede'?", options: ["Increasing cache size", "Using a message queue", "Adding jitter to cache expiration times", "Using a relational database"], ans: 2 },
  { id: 10, q: "What is the default port for Redis?", options: ["3306", "5432", "6379", "8080"], ans: 2 },
  { id: 11, q: "In Java, which collection class is thread-safe?", options: ["ArrayList", "HashMap", "ConcurrentHashMap", "LinkedList"], ans: 2 },
  { id: 12, q: "What is the CAP Theorem?", options: ["Consistency, Availability, Partition Tolerance", "Capacity, Availability, Performance", "Compute, Architecture, Processing", "Caching, API, Persistence"], ans: 0 },
  { id: 13, q: "Which design pattern restricts a class to have only one instance?", options: ["Factory", "Observer", "Singleton", "Decorator"], ans: 2 },
  { id: 14, q: "What is the primary purpose of an API Gateway?", options: ["To store user passwords", "To act as a single entry point for routing client requests to microservices", "To render HTML pages", "To run complex analytics"], ans: 1 },
  { id: 15, q: "Which protocol is connection-oriented and reliable?", options: ["UDP", "IP", "TCP", "ICMP"], ans: 2 },
  { id: 16, q: "In Java, what is the parent class of all classes?", options: ["Object", "Class", "Main", "System"], ans: 0 },
  { id: 17, q: "What is 'Eventual Consistency'?", options: ["Data is immediately consistent across all nodes", "Data will become consistent over time", "Data is never consistent", "Data consistency is guaranteed by ACID transactions"], ans: 1 },
  { id: 18, q: "Which tool is commonly used as a Message Broker?", options: ["Nginx", "Redis", "RabbitMQ", "Docker"], ans: 2 },
  { id: 19, q: "What is a major advantage of Microservices Architecture?", options: ["Simpler deployment", "Independent scaling of services", "Shared database", "Monolithic codebase"], ans: 1 },
  { id: 20, q: "In OOP, what concept allows a child class to provide a specific implementation of a method?", options: ["Overloading", "Encapsulation", "Overriding", "Abstraction"], ans: 2 }
];

export default function PracticeQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [submitted, setSubmitted] = useState(false);
  const [stats, setStats] = useState({ score: 0, correct: 0, wrong: 0 });
  const [gemsAnim, setGemsAnim] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Dynamic Question Pool & No-Repeat Engine
    let attemptedIds = JSON.parse(localStorage.getItem('quizAttemptedIds') || '[]');
    let available = MASTER_POOL.filter(q => !attemptedIds.includes(q.id));
    
    // Reset pool if less than 10 questions available
    if (available.length < 10) {
      available = [...MASTER_POOL];
      attemptedIds = [];
    }
    
    // Shuffle and pick 10
    const shuffled = available.sort(() => 0.5 - Math.random());
    const selectedQs = shuffled.slice(0, 10);
    setQuestions(selectedQs);
    
    // Save new attempts
    const newAttemptedIds = [...attemptedIds, ...selectedQs.map(q => q.id)];
    localStorage.setItem('quizAttemptedIds', JSON.stringify(newAttemptedIds));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted && questions.length > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      setSubmitted(true);
    }
  }, [timeLeft, submitted, questions]);

  const playSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'right') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.type = 'sine'; // Soft low-frequency thump
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime); // Low volume
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  const handleNext = () => {
    const isCorrect = selected === questions[currentQ].ans;
    const finalCorrectCount = isCorrect ? stats.correct + 1 : stats.correct;
    
    if (isCorrect) {
      playSound('right');
      setStats(prev => ({ ...prev, score: prev.score + 10, correct: prev.correct + 1 }));
    } else {
      playSound('wrong');
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
    } else {
      setSubmitted(true);
      import('../utils/activity').then(({ logSession }) => {
        logSession(finalCorrectCount * 5); // 5 gems per correct
      });
      setTimeout(() => setGemsAnim(true), 500);
      if (finalCorrectCount >= 5) {
         // Unlock badge
         const badges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
         let newlyUnlocked = false;
         if (!badges.includes('quiz_master')) {
           badges.push('quiz_master');
           localStorage.setItem('unlockedBadges', JSON.stringify(badges));
           newlyUnlocked = true;
         }
         
         if (newlyUnlocked) {
           setTimeout(() => {
             setShowBadge(true);
             confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
           }, 1200);
           // Show cert after badge
           setTimeout(() => {
             setShowBadge(false);
             setShowCert(true);
           }, 5000); // 3.8 seconds later
         } else {
           setTimeout(() => setShowCert(true), 1500);
         }
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (questions.length === 0) return null;

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', padding: '2rem' }}>
      
      <style>{`
        @keyframes gemPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Back Button */}
      <button 
        onClick={() => window.location.href = '/dashboard'}
        className="glass-panel hover-glow" 
        style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', borderRadius: '30px', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#c084fc', cursor: 'pointer', background: 'rgba(20,20,30,0.8)', zIndex: 100 }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel premium-3d animate-fade-in" style={{ width: '100%', maxWidth: '750px', padding: '3.5rem', borderRadius: '24px', border: '1px solid rgba(234, 179, 8, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(234, 179, 8, 0.1)' }}>
          
          {!submitted ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: 0 }}>⚡ Quick Practice Quiz</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eab308', background: 'rgba(234, 179, 8, 0.1)', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
                  <Clock size={20} /> {formatTime(timeLeft)}
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {currentQ + 1} of {questions.length}</div>
              <h3 style={{ fontSize: '1.4rem', color: '#e2e8f0', marginBottom: '2.5rem', lineHeight: '1.5' }}>
                {questions[currentQ].q}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '3rem' }}>
                {questions[currentQ].options.map((opt, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelected(idx)}
                    style={{ 
                      padding: '1.2rem 1.5rem', 
                      borderRadius: '12px', 
                      border: `1px solid ${selected === idx ? '#eab308' : 'rgba(255,255,255,0.1)'}`, 
                      background: selected === idx ? 'rgba(234, 179, 8, 0.15)' : 'rgba(0,0,0,0.3)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      transition: 'all 0.2s',
                      color: selected === idx ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    {selected === idx ? <CheckCircle2 size={24} color="#eab308" /> : <Circle size={24} />}
                    <span style={{ fontSize: '1.1rem' }}>{opt}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleNext}
                  disabled={selected === null}
                  className="btn-primary" 
                  style={{ background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', opacity: selected === null ? 0.5 : 1, padding: '1rem 3rem', borderRadius: '30px', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(234, 179, 8, 0.3)' }}
                >
                  {currentQ === questions.length - 1 ? 'Finish & Score' : 'Next Question'}
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(16,185,129,0.1)', padding: '20px', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                <Trophy size={64} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.5rem' }}>Quiz Completed!</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>Here is your performance summary</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.score}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>Total Score</div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CheckCircle2 size={24} /> {stats.correct}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>Correct</div>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <XCircle size={24} /> {stats.wrong}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>Wrong</div>
                </div>
              </div>

              {/* Dynamic Streak Gems */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '3rem', minHeight: '40px' }}>
                {gemsAnim && Array.from({ length: Math.min(stats.correct, 5) }).map((_, i) => (
                  <div key={i} style={{ animation: `gemPop 0.5s ease forwards ${i * 0.15}s`, opacity: 0 }}>
                    <Diamond size={32} color="#a855f7" fill="rgba(168,85,247,0.5)" style={{ filter: 'drop-shadow(0 0 10px #a855f7)' }} />
                  </div>
                ))}
                {gemsAnim && stats.correct === 10 && (
                  <div style={{ animation: `gemPop 0.5s ease forwards 1s`, opacity: 0 }}>
                     <Sparkles size={32} color="#eab308" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {stats.correct >= 5 && (
                  <button onClick={() => setShowCert(true)} className="btn-primary hover-glow" style={{ padding: '1rem 2rem', borderRadius: '30px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={20} /> Claim Certificate
                  </button>
                )}
                <button onClick={() => window.location.href = '/dashboard'} className="btn-primary hover-glow" style={{ padding: '1rem 2rem', borderRadius: '30px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Return to Dashboard
                </button>
              </div>

              <CertificateModal 
                show={showCert} 
                onClose={() => setShowCert(false)} 
                userName="PrepGenie Achiever" 
                courseName="Advanced Quiz Challenge" 
              />
            </div>
          )}

          {/* Badge Unlock Overlay */}
          {showBadge && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s' }}>
              <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)', animation: 'spin 10s linear infinite' }}></div>
              <div style={{ zIndex: 10, textAlign: 'center', animation: 'gemPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
                <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '1rem', textShadow: '0 0 20px #3b82f6', letterSpacing: '2px', textTransform: 'uppercase' }}>Badge Unlocked!</h1>
                <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', width: '150px', height: '150px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 0 50px rgba(59, 130, 246, 0.8)', border: '4px solid rgba(255,255,255,0.4)', position: 'relative' }}>
                  <Award size={80} color="#fff" />
                </div>
                <h2 style={{ color: '#60a5fa', fontSize: '2rem', marginBottom: '0.5rem' }}>Quiz Master</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>You dominated the practice quiz and grabbed this shiny new badge!</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
