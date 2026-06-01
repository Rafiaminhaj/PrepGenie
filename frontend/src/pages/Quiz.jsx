import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { BookOpen, CheckCircle, XCircle, Clock, Frown, Trophy, ArrowRight, RotateCcw, Home, Sparkles, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Confetti from 'react-confetti';
import { quizQuestions } from '../data/quizQuestions';
import aiQuestionsData from '../data/AI_Generated_Questions.json';
import CertificateModal from '../components/CertificateModal';

export default function Quiz() {
  const [topic, setTopic] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, skipped: 0 });
  const [timerActive, setTimerActive] = useState(false);
  const [showCert, setShowCert] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Window resize for Confetti
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const detectSize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  const handleStart = () => {
    let selectedQs = [];
    let baseBank = [];
    
    if (difficulty === 'Mixed') {
      const easyQs = quizQuestions[topic]?.['Easy'] || [];
      const medQs = quizQuestions[topic]?.['Medium'] || [];
      const hardQs = quizQuestions[topic]?.['Hard'] || [];
      baseBank = [...easyQs, ...medQs, ...hardQs];
    } else {
      baseBank = quizQuestions[topic]?.[difficulty] || [];
    }

    // Extract relevant AI questions
    let aiBank = [];
    aiQuestionsData.forEach(batch => {
      if (batch.category === topic && (difficulty === 'Mixed' || batch.difficulty === difficulty)) {
        if (batch.questions) {
          batch.questions.forEach(aiQ => {
            aiBank.push({
              q: `[AI] ${aiQ.q}`,
              a: aiQ.a,
              c: aiQ.c,
              exp: aiQ.exp
            });
          });
        }
      }
    });

    // Shuffle both banks
    const shuffledAI = [...aiBank].sort(() => 0.5 - Math.random());
    const shuffledNormal = [...baseBank].sort(() => 0.5 - Math.random());
    
    // Always put AI questions at the top
    const combined = [...shuffledAI, ...shuffledNormal];
    selectedQs = combined.slice(0, 10);

    if (selectedQs.length === 0) {
      alert(`Oops! We don't have enough '${difficulty}' questions for '${topic}' right now. Our AI Agent is generating them in the background. Please try a different difficulty or topic!`);
      return;
    }
    
    setQuestions(selectedQs);
    setQuizStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setStats({ correct: 0, wrong: 0, skipped: 0 });
    setSelectedOption(null);
    setTimeLeft(30);
    setTimerActive(true);
    setQuizFinished(false);
  };

  const handleSelect = (idx) => {
    if (selectedOption !== null || !timerActive) return; // Prevent changing answer or answering after time's up
    
    setSelectedOption(idx);
    setTimerActive(false); // Stop timer

    const isCorrect = idx === questions[currentQIndex].c;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const handleNext = async () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      // Finish quiz
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
             await supabase.from('quiz_results').insert([{
               user_id: userData.user.id,
               topic: topic,
               difficulty: difficulty,
               score: score,
               total_questions: 10,
               time_taken: 300 - timeLeft // rough estimate
             }]);
          }
        }
      } catch (e) {
        console.error("Failed to save quiz result", e);
      }
      import('../utils/activity').then(({ logSession }) => {
        logSession(score * 5); // 5 gems per correct answer
      });
      setQuizFinished(true);
    }
  };

  const renderSelection = () => {
    const topics = ['Java', 'Spring Boot', 'JavaScript', 'System Design', 'DSA', 'Python', 'Machine Learning Basics', 'Deep Learning & Neural Networks', 'Generative AI & LLMs', 'Data Processing'];
    const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];

    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)' }}>
            <Sparkles color="#ec4899" size={40} />
          </div>
          <h2 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Configure Your Quiz</h2>
          <p style={{ color: 'var(--text-muted)' }}>Select a topic and difficulty to generate your customized 10-question assessment.</p>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>1. Select Topic</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: topic === t ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))' : 'rgba(255,255,255,0.05)',
                border: topic === t ? '1px solid #ec4899' : '1px solid var(--border)',
                color: topic === t ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                fontWeight: topic === t ? '600' : '400'
              }}
              className="hover-glow"
            >
              {t}
            </button>
          ))}
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>2. Select Difficulty</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: difficulty === d ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))' : 'rgba(255,255,255,0.05)',
                border: difficulty === d ? '1px solid #a855f7' : '1px solid var(--border)',
                color: difficulty === d ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                fontWeight: difficulty === d ? '600' : '400'
              }}
              className="hover-glow"
            >
              {d}
            </button>
          ))}
        </div>

        <button 
          onClick={handleStart} 
          disabled={!topic || !difficulty}
          className="btn-primary" 
          style={{ width: '100%', padding: '15px', fontSize: '1.2rem', opacity: (!topic || !difficulty) ? 0.5 : 1 }}
        >
          Start Quiz Session
        </button>
      </div>
    );
  };

  const renderActiveQuiz = () => {
    const q = questions[currentQIndex];
    if (!q) return null; // Safety check
    const showFeedback = selectedOption !== null || timeLeft === 0;

    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        
        {/* Header Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#fff', fontSize: '1.1rem' }}>Q{currentQIndex + 1}</span> 
            <span>/ {questions.length}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: timeLeft <= 5 ? '#ef4444' : '#a855f7',
            background: timeLeft <= 5 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}>
            <Clock size={16} />
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: `${((currentQIndex) / questions.length) * 100}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #a855f7, #ec4899)', 
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {/* Question Text */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.5', minHeight: '60px' }}>
          {q.q}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {q.a.map((opt, idx) => {
            let isCorrect = idx === q.c;
            let isSelected = idx === selectedOption;
            let bgColor = 'rgba(255, 255, 255, 0.05)';
            let borderColor = 'var(--border)';

            if (showFeedback) {
              if (isCorrect) {
                bgColor = 'rgba(16, 185, 129, 0.2)';
                borderColor = '#10b981';
              } else if (isSelected && !isCorrect) {
                bgColor = 'rgba(239, 68, 68, 0.2)';
                borderColor = '#ef4444';
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  padding: '1.2rem',
                  background: bgColor,
                  border: '1px solid ' + borderColor,
                  borderRadius: '12px',
                  color: 'var(--text-main)',
                  textAlign: 'left',
                  fontSize: '1rem',
                  cursor: showFeedback ? 'default' : 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  opacity: (showFeedback && !isCorrect && !isSelected) ? 0.6 : 1
                }}
                className={!showFeedback ? 'quiz-option-hover' : ''}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '30px', height: '30px', borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.1)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                    color: showFeedback && isCorrect ? '#10b981' : (showFeedback && isSelected ? '#ef4444' : '#fff')
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  {opt}
                </div>
                {showFeedback && isCorrect && <CheckCircle color="#10b981" size={24} />}
                {showFeedback && isSelected && !isCorrect && <XCircle color="#ef4444" size={24} />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button Container */}
        <div style={{ minHeight: '120px' }}>
          {showFeedback && (
            <div className="animate-fade-in">
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(168, 85, 247, 0.1)', 
                borderLeft: '4px solid #a855f7',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '15px'
              }}>
                <BookOpen color="#a855f7" size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>Explanation</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>{q.exp}</p>
                </div>
              </div>
              <button 
                onClick={handleNext}
                className="btn-primary hover-glow"
                style={{ width: '100%', padding: '15px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                {currentQIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderScorecard = () => {
    const isHighScore = score >= 8;
    const isLowScore = score < 5;

    return (
      <>
        {isHighScore && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, pointerEvents: 'none' }}>
            <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} numberOfPieces={500} />
          </div>
        )}
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            {isHighScore ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
                <Trophy color="#10b981" size={50} />
              </div>
            ) : isLowScore ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)' }}>
                <Frown color="#ef4444" size={50} />
              </div>
            ) : (
              <div style={{ background: 'rgba(168, 85, 247, 0.2)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}>
                <CheckCircle color="#a855f7" size={50} />
              </div>
            )}
          </div>

          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: isHighScore ? '#10b981' : isLowScore ? '#ef4444' : '#a855f7' }}>
            {isHighScore ? 'Outstanding Performance!' : isLowScore ? 'Keep Practicing!' : 'Good Effort!'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            You completed the <strong>{topic} ({difficulty})</strong> assessment.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {score} <span style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.3)', WebkitTextFillColor: 'rgba(255,255,255,0.3)' }}>/ 10</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <div>
                <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>{stats.correct}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Correct</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: '700' }}>{stats.wrong}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Wrong</div>
              </div>
              <div>
                <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700' }}>{stats.skipped}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Skipped</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {isHighScore && (
              <button 
                onClick={() => setShowCert(true)} 
                style={{ flex: 1, minWidth: '150px', padding: '15px', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', border: 'none', borderRadius: '8px', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)' }}
                className="hover-glow"
              >
                <Award size={18} /> Claim Certificate
              </button>
            )}
            <button 
              onClick={() => { setQuizStarted(false); setQuizFinished(false); setShowCert(false); }} 
              style={{ flex: 1, minWidth: '150px', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="hover-glow"
            >
              <Home size={18} /> New Topic
            </button>
            <button 
              onClick={handleStart} 
              className="btn-primary hover-glow"
              style={{ flex: 1, minWidth: '150px', padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
            >
              <RotateCcw size={18} /> Try Again
            </button>
          </div>
        </div>

        <CertificateModal 
          show={showCert} 
          onClose={() => setShowCert(false)} 
          userName="PrepGenie Scholar" 
          courseName={`${topic} Assessment`} 
        />
      </>
    );
  };

  return (
    <div className="app-container">
      <Navbar />
      <div style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!quizStarted ? renderSelection() : quizFinished ? renderScorecard() : renderActiveQuiz()}
      </div>
    </div>
  );
}
