import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Users, Bot, Send, CheckCircle2, TrendingUp, Target, MessageSquare, Award, RefreshCw, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_HR_QUESTIONS = [
  "Tell me about a time you handled a severe conflict in a tech team.",
  "Describe a situation where you failed under pressure. What did you learn?",
  "Why do you want to join PrepGenie over other tech companies?",
  "How do you balance technical debt with delivering features on a tight deadline?",
  "What are your salary expectations, and how do you justify them?"
];

export default function HrInterview() {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Typing Effect State
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const currentQuestion = MOCK_HR_QUESTIONS[currentQIndex];

  useEffect(() => {
    if (isInterviewComplete) return;
    
    // Reset typing state
    setDisplayedText("");
    setIsTyping(true);
    
    let i = 0;
    let currentText = "";
    const typingInterval = setInterval(() => {
      if (i < currentQuestion.length) {
        currentText += currentQuestion.charAt(i);
        setDisplayedText(currentText);
        i++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 40); // 40ms per character

    return () => clearInterval(typingInterval);
  }, [currentQuestion, isInterviewComplete]);

  const toggleMicrophone = () => {
    if (isRecording) {
      if (window.currentRecognition) {
        window.currentRecognition.stop();
      }
      setIsRecording(false);
      toast('Recording stopped.', { icon: '🛑' });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast.success("Listening... Start speaking!");
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setAnswerText(prev => (prev + " " + finalTranscript).trim());
      }
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        toast.error("Please allow microphone access to use voice typing.");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    window.currentRecognition = recognition;
    recognition.start();
  };

  const [aiReport, setAiReport] = useState(null);

  const handleSubmit = async () => {
    if (answerText.trim().length < 50) {
      toast.error("Please provide a more detailed response (at least 50 characters).");
      return;
    }

    if (isRecording && window.currentRecognition) {
      window.currentRecognition.stop();
      setIsRecording(false);
    }

    setIsSubmitting(true);
    const newAnswers = [...answers, { q: currentQuestion, a: answerText }];
    setAnswers(newAnswers);
    setAnswerText("");

    if (currentQIndex < MOCK_HR_QUESTIONS.length - 1) {
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentQIndex(prev => prev + 1);
      }, 500);
    } else {
      toast.success("Interview Complete! Generating your AI report card...");
      try {
        const { analyzeHrInterview } = await import('../lib/gemini');
        const report = await analyzeHrInterview(newAnswers);
        setAiReport(report);
      } catch (error) {
        toast.error("AI Analysis failed. Showing fallback results.");
        setAiReport({
          scores: { commSkill: 70, leadership: 70, techAlign: 70 },
          feedback: "We could not generate an AI analysis at this time.",
          improvements: ["Please try again later or check your API key."]
        });
      } finally {
        setIsSubmitting(false);
        setIsInterviewComplete(true);
        // XP Reward
        const currentGems = parseInt(localStorage.getItem('gems') || '0', 10);
        localStorage.setItem('gems', currentGems + 50);
      }
    }
  };

  const renderReportCard = () => {
    if (!aiReport) return null;

    const { commSkill, leadership, techAlign } = aiReport.scores;
    const overall = Math.floor((commSkill + leadership + techAlign) / 3);

    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
          <Award color="#10b981" size={40} />
        </div>
        
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#10b981' }}>Interview Completed!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Our AI has analyzed your responses. Here is your Performance Breakdown Report Card.
        </p>

        {/* Overall Score */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '24px', padding: '2rem', marginBottom: '3rem', border: '1px solid rgba(168, 85, 247, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 50%)', animation: 'spin 10s linear infinite' }}></div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>Overall Fit Score</h3>
          <div style={{ fontSize: '5rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1', position: 'relative', zIndex: 1 }}>
            {overall}<span style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.3)', WebkitTextFillColor: 'rgba(255,255,255,0.3)' }}>/100</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <MessageSquare color="#3b82f6" size={30} style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Communication</h4>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
               <div style={{ width: `${commSkill}%`, height: '100%', background: '#3b82f6', transition: 'width 1s ease-out' }}></div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>{commSkill}%</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <TrendingUp color="#f59e0b" size={30} style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Leadership Quotient</h4>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
               <div style={{ width: `${leadership}%`, height: '100%', background: '#f59e0b', transition: 'width 1s ease-out' }}></div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>{leadership}%</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            <Target color="#ec4899" size={30} style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Technical Alignment</h4>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
               <div style={{ width: `${techAlign}%`, height: '100%', background: '#ec4899', transition: 'width 1s ease-out' }}></div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ec4899' }}>{techAlign}%</div>
          </div>

        </div>

        {/* AI Feedback Section */}
        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '3rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Bot size={24} /> AI Executive Summary
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e2e8f0', marginBottom: '2rem' }}>
            {aiReport.feedback}
          </p>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#f59e0b' }}>Areas for Improvement:</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {aiReport.improvements.map((imp, idx) => (
              <li key={idx} style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.8rem', color: '#cbd5e1' }}>
                <span style={{ color: '#ef4444' }}>•</span> {imp}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => { setIsInterviewComplete(false); setCurrentQIndex(0); setAnswers([]); setAiReport(null); }} className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <RefreshCw size={20} /> Restart Simulation
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Navbar />
      <div style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: '100vh', maxWidth: '1000px', margin: '0 auto', padding: '100px 20px 50px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2))', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Users color="#f59e0b" size={40} />
          </div>
          <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Behavioral Interview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Master your soft skills, cultural fit, and behavioral scenarios with real-time AI simulation.
          </p>
        </div>

        {isInterviewComplete ? (
          renderReportCard()
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                Question {currentQIndex + 1} of {MOCK_HR_QUESTIONS.length}
              </span>
              <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${((currentQIndex) / MOCK_HR_QUESTIONS.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            {/* AI Panel Section */}
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, position: 'relative' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)', position: 'relative', zIndex: 2 }}>
                  <Bot color="#fff" size={30} />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', border: '2px solid #f59e0b', animation: isTyping ? 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none', opacity: 0.5, zIndex: 1 }}></div>
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#f59e0b', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '600' }}>Genie HR</h3>
                <div style={{ fontSize: '1.4rem', lineHeight: '1.6', color: '#fff', minHeight: '80px' }}>
                  {displayedText}
                  {isTyping && <span style={{ display: 'inline-block', width: '8px', height: '24px', background: '#f59e0b', marginLeft: '8px', animation: 'pulse 1s infinite', verticalAlign: 'middle' }}></span>}
                </div>
              </div>
            </div>

            {/* Student Answer Response Zone */}
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Your Response</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>
                    Type or speak your answer
                  </span>
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Use the STAR method (Situation, Task, Action, Result)..."
                  disabled={isTyping || isSubmitting}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    background: 'rgba(0,0,0,0.2)',
                    border: isRecording ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: '#fff',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                    opacity: (isTyping || isSubmitting) ? 0.6 : 1,
                    boxShadow: isRecording ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none'
                  }}
                  onFocus={(e) => { if(!isRecording) e.target.style.borderColor = 'rgba(245, 158, 11, 0.5)' }}
                  onBlur={(e) => { if(!isRecording) e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
                {isRecording && (
                  <div style={{ position: 'absolute', top: '10px', right: '15px', display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem', animation: 'pulse 1.5s infinite' }}>
                    <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
                    RECORDING
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  <span style={{ color: answerText.length > 0 ? (answerText.length < 50 ? '#ef4444' : '#10b981') : 'var(--text-muted)' }}>
                    {answerText.length}
                  </span> / 2000 characters
                </div>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    onClick={toggleMicrophone}
                    disabled={isTyping || isSubmitting}
                    className="btn-secondary"
                    style={{
                      padding: '12px 20px',
                      borderRadius: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isRecording ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                      color: isRecording ? '#ef4444' : '#fff',
                      transition: 'all 0.3s'
                    }}
                  >
                    {isRecording ? <><MicOff size={18} /> Stop Mic</> : <><Mic size={18} /> Speak Answer</>}
                  </button>

                  <button 
                    onClick={handleSubmit} 
                    disabled={isTyping || isSubmitting || answerText.length === 0}
                    className="btn-primary"
                    style={{ 
                      padding: '15px 30px', 
                      fontSize: '1.1rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                      boxShadow: '0 10px 20px -10px rgba(245, 158, 11, 0.8)',
                      opacity: (isTyping || isSubmitting || answerText.length === 0) ? 0.5 : 1
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Submit Answer <Send size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
        
      </div>
    </div>
  );
}
