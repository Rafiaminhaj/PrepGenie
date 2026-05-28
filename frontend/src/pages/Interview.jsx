import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Mic2, MicOff, Play, Square, CheckCircle2, AlertCircle, Volume2, Users, Bot } from 'lucide-react';
import P2PInterview from '../components/P2PInterview';

export default function Interview() {
  const [interviewMode, setInterviewMode] = useState('ai'); // 'ai' or 'p2p'
  const [inProgress, setInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  
  const questions = [
    "Tell me about a time you faced a difficult technical challenge and how you solved it.",
    "Explain the difference between REST and GraphQL.",
    "How do you handle state management in a large React application?"
  ];

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        // Only update if we have actual text
        if (currentTranscript.trim()) {
           setAnswer(prev => {
             // For a real app, interim handling is tricky. 
             // We'll just append it simply for this demo if it's a final result, 
             // but since it's continuous, we'll replace the last part or just append.
             // A simpler approach for the demo is to overwrite the answer with the full session transcript.
             // However, to allow user editing, we just append final results.
             if (event.results[i] && event.results[i].isFinal) {
                return prev + (prev ? " " : "") + currentTranscript.trim();
             }
             return prev;
           });
           
           // If we want real-time typing effect (interim), we'd need more complex state.
           // For stability, we'll only append when isFinal is true in the loop.
        }
      };
      
      // Let's rewrite the onresult for better UX:
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
           setAnswer(prev => prev + (prev ? " " : "") + finalTranscript.trim());
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.1; // Slightly higher pitch
      
      // Try to find a good English voice
      const voices = window.speechSynthesis.getVoices();
      const aiVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.lang.includes('en-US'));
      if (aiVoice) utterance.voice = aiVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = () => {
    setInProgress(true);
    setCurrentQuestion(0);
    setAnswer('');
    speakQuestion(questions[0]);
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setAnswer('');
      if (isListening) toggleListening();
      speakQuestion(questions[nextQ]);
    } else {
      setInProgress(false);
      if (isListening) toggleListening();
      window.speechSynthesis.cancel();
      alert("Interview Complete! Check your feedback.");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        // Stop AI speaking if user starts talking
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } catch (e) {
        console.error("Speech recognition error:", e);
      }
    }
  };

  return (
    <div className="app-container animate-fade-in">
      <Navbar />
      
      {/* Waveform CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .waveform-container {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 40px;
        }
        .waveform-bar {
          width: 4px;
          background: var(--primary);
          border-radius: 4px;
          animation: waveform 1s ease-in-out infinite;
        }
        .waveform-bar:nth-child(1) { animation-delay: 0.0s; height: 10px; }
        .waveform-bar:nth-child(2) { animation-delay: 0.1s; height: 20px; }
        .waveform-bar:nth-child(3) { animation-delay: 0.2s; height: 35px; }
        .waveform-bar:nth-child(4) { animation-delay: 0.3s; height: 20px; }
        .waveform-bar:nth-child(5) { animation-delay: 0.4s; height: 10px; }
        @keyframes waveform {
          0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
          50% { transform: scaleY(1.5); opacity: 1; }
        }
        .pulse-mic {
          animation: pulseMic 2s infinite;
        }
        @keyframes pulseMic {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />

      {/* Mode Toggle */}
      {!inProgress && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setInterviewMode('ai')}
              style={{ 
                padding: '10px 24px', 
                borderRadius: '24px', 
                border: 'none', 
                background: interviewMode === 'ai' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
                color: interviewMode === 'ai' ? '#fff' : 'var(--text-muted)',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <Bot size={18} /> AI Interviewer
            </button>
            <button 
              onClick={() => setInterviewMode('p2p')}
              style={{ 
                padding: '10px 24px', 
                borderRadius: '24px', 
                border: 'none', 
                background: interviewMode === 'p2p' ? 'linear-gradient(135deg, #10b981, #3b82f6)' : 'transparent',
                color: interviewMode === 'p2p' ? '#fff' : 'var(--text-muted)',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <Users size={18} /> Peer-to-Peer
            </button>
          </div>
        </div>
      )}

      {interviewMode === 'p2p' ? (
        <P2PInterview />
      ) : !inProgress ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Mic2 color="#6366f1" size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Voice-Driven Mock Interview</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Experience a realistic interview simulation. Our AI will speak the questions, and you can answer using your microphone.
          </p>
          <button onClick={handleStart} className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
            <Play size={20} /> Start Voice Interview
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Question {currentQuestion + 1} of {questions.length}</span>
              <button onClick={() => {
                setInProgress(false);
                window.speechSynthesis.cancel();
                recognitionRef.current?.stop();
              }} style={{ background: 'transparent', border: '1px solid rgba(255,0,0,0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                <Square size={14} style={{ display: 'inline', marginRight: '5px' }}/> End Interview
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: isSpeaking ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: '16px', 
              padding: '2rem', 
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}>
              {/* AI Speaking Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ 
                  background: isSpeaking ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.1)', 
                  padding: '8px', 
                  borderRadius: '50%',
                  transition: 'background 0.3s'
                }}>
                  <Volume2 size={24} color={isSpeaking ? '#a855f7' : '#9ca3af'} />
                </div>
                <span style={{ color: isSpeaking ? '#a855f7' : 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem', transition: 'color 0.3s' }}>
                  {isSpeaking ? 'AI is speaking...' : 'AI Interviewer'}
                </span>
                
                {isSpeaking && (
                  <div className="waveform-container" style={{ marginLeft: 'auto' }}>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '1.5rem', lineHeight: '1.5', color: isSpeaking ? 'var(--text-main)' : 'var(--text-muted)', transition: 'color 0.3s' }}>
                "{questions[currentQuestion]}"
              </h3>
              
              <button 
                onClick={() => speakQuestion(questions[currentQuestion])}
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Play size={14} /> Replay
              </button>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Your Response</label>
                
                <button 
                  onClick={toggleListening}
                  className={isListening ? "pulse-mic" : ""}
                  style={{ 
                    background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.1)', 
                    border: isListening ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(99, 102, 241, 0.3)',
                    color: isListening ? '#ef4444' : '#6366f1',
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  {isListening ? (
                    <><MicOff size={16} /> Stop Recording</>
                  ) : (
                    <><Mic2 size={16} /> Record Answer</>
                  )}
                </button>
              </div>
              
              <textarea 
                className="input-field" 
                rows="6" 
                placeholder="Start speaking or type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                style={{ 
                  resize: 'vertical',
                  borderColor: isListening ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isListening ? '0 0 0 2px rgba(239, 68, 68, 0.1)' : 'none',
                  transition: 'all 0.3s'
                }}
              ></textarea>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleNext} className="btn-primary">
                Submit & Next Question
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <AlertCircle size={18} color="#a855f7" /> Tips
              </h4>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px' }}>
                <li>Speak clearly and directly into your microphone.</li>
                <li>Use the STAR method (Situation, Task, Action, Result).</li>
                <li>You can pause and edit the transcribed text before submitting.</li>
              </ul>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <CheckCircle2 size={18} color="#10b981" /> Live Feedback
              </h4>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
                Feedback will appear here after you submit your answer.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
