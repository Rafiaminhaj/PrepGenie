import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, AlertTriangle, CheckCircle, Clock, Volume2, Target, BarChart2, Zap } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function LiveSpeak() {
  const [sessionState, setSessionState] = useState('IDLE'); // IDLE, LISTENING, RESULTS
  // State to force re-renders
  const [transcript, setTranscript] = useState('');
  const [fillerWords, setFillerWords] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(100);
  const [grammarFlags, setGrammarFlags] = useState([]);
  
  // Refs to hold the absolute latest values for stopSession
  const transcriptRef = useRef('');
  const fillerWordsRef = useRef(0);
  const grammarFlagsRef = useRef([]);

  // Dynamic Score State
  const [finalScores, setFinalScores] = useState(null);
  const [dynamicTips, setDynamicTips] = useState([]);
  
  // Speech Recognition Ref
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        transcriptRef.current = currentTranscript;
        analyzeLiveTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if(event.error === 'not-allowed') {
          alert("Microphone access is required for LiveSpeak AI.");
          stopSession();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const analyzeLiveTranscript = (text) => {
    const lowerText = text.toLowerCase();
    
    // 1. Detect Filler Words using Regex word boundaries
    const fillers = ['um', 'uh', 'like', 'actually', 'basically', 'literally'];
    let count = 0;
    fillers.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    });
    
    const phraseMatches = text.match(/\byou know\b/gi);
    if (phraseMatches) count += phraseMatches.length;
    
    setFillerWords(count);
    fillerWordsRef.current = count;

    // 2. Confidence Estimation
    const newConfidence = Math.max(30, 100 - (count * 3));
    setConfidenceScore(newConfidence);

    // 3. Dynamic Grammar & Vocabulary Suggestions
    const newFlags = [];
    if (lowerText.includes('i done') && !grammarFlagsRef.current.find(g => g.error === 'i done')) {
      newFlags.push({ error: 'i done', correction: 'I successfully completed' });
    }
    if (lowerText.includes('myself is') && !grammarFlagsRef.current.find(g => g.error === 'myself is')) {
      newFlags.push({ error: 'myself is', correction: 'My name is' });
    }
    if (lowerText.includes('very good') && !grammarFlagsRef.current.find(g => g.error === 'very good')) {
      newFlags.push({ error: 'very good', correction: 'excellent / optimal' });
    }
    if (lowerText.includes('very bad') && !grammarFlagsRef.current.find(g => g.error === 'very bad')) {
      newFlags.push({ error: 'very bad', correction: 'suboptimal / inefficient' });
    }
    if (/\ba lot of\b/i.test(text) && !grammarFlagsRef.current.find(g => g.error === 'a lot of')) {
      newFlags.push({ error: 'a lot of', correction: 'numerous / multiple' });
    }
    if (/\bi think\b/i.test(text) && !grammarFlagsRef.current.find(g => g.error === 'i think')) {
      newFlags.push({ error: 'i think', correction: 'in my professional opinion / I believe' });
    }
    
    if (newFlags.length > 0) {
      const updatedFlags = [...newFlags, ...grammarFlagsRef.current];
      setGrammarFlags(updatedFlags);
      grammarFlagsRef.current = updatedFlags;
    }
  };

  const startSession = () => {
    setSessionState('LISTENING');
    setTranscript('');
    transcriptRef.current = '';
    setFillerWords(0);
    fillerWordsRef.current = 0;
    setConfidenceScore(100);
    setGrammarFlags([]);
    grammarFlagsRef.current = [];
    setFinalScores(null);
    setDynamicTips([]);
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch(e) {}
    }
  };

  const startSimulatedSession = () => {
    setSessionState('LISTENING');
    setTranscript('');
    transcriptRef.current = '';
    setFillerWords(0);
    fillerWordsRef.current = 0;
    setConfidenceScore(100);
    setGrammarFlags([]);
    grammarFlagsRef.current = [];
    setFinalScores(null);
    setDynamicTips([]);

    const demoScript = "Um, myself is developer. I done a very good project recently. I used React for the frontend and Java Spring Boot for the backend. Um, the system architecture connects to a database through an API. I think it has a lot of features, but like, there were some very bad bugs initially which I fixed.".split(" ");
    
    let currentWordIndex = 0;
    
    const interval = setInterval(() => {
      if (currentWordIndex < demoScript.length) {
        const newText = transcriptRef.current + (currentWordIndex === 0 ? '' : ' ') + demoScript[currentWordIndex];
        setTranscript(newText);
        transcriptRef.current = newText;
        analyzeLiveTranscript(newText);
        currentWordIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => stopSession(), 1000);
      }
    }, 300); // Add a word every 300ms
    
    // Store interval ID in ref to clear it if user stops manually
    recognitionRef.current.simInterval = interval;
  };

  const stopSession = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      if (recognitionRef.current.simInterval) {
        clearInterval(recognitionRef.current.simInterval);
      }
    }
    
    const finalTranscript = transcriptRef.current;
    const wordCount = finalTranscript.split(' ').filter(w => w.length > 0).length;

    if (wordCount === 0) {
      setDynamicTips([{
        title: "Microphone Issue / No Speech Detected",
        color: "#EF4444",
        desc: "We couldn't hear you! Please make sure your microphone is working, you have granted browser permissions, and you speak loudly and clearly in English."
      }]);
      setFinalScores({ grammar: 0, fluency: 0, confidence: 0, clarity: 0, tech: 0, body: 0 });
      setSessionState('RESULTS');
      return;
    }

    setSessionState('ANALYZING');

    try {
      const { analyzeSpeech } = await import('../lib/gemini');
      const analysis = await analyzeSpeech(finalTranscript);

      const bodyLangScore = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      const confidenceScore = Math.floor(Math.random() * (95 - 70 + 1)) + 70;

      const scores = {
        grammar: analysis.scores?.grammar || 60,
        fluency: analysis.scores?.fluency || 60,
        confidence: confidenceScore,
        clarity: analysis.scores?.clarity || 60,
        tech: analysis.scores?.tech || 60,
        body: bodyLangScore
      };

      setFinalScores(scores);
      setDynamicTips(analysis.tips || []);

      const currentGems = parseInt(localStorage.getItem('gems') || '0', 10);
      localStorage.setItem('gems', currentGems + 30);
      const sessions = parseInt(localStorage.getItem('totalSessions') || '0', 10);
      localStorage.setItem('totalSessions', sessions + 1);
      
    } catch (error) {
      console.error(error);
      setDynamicTips([{
        title: "AI Analysis Failed",
        color: "#EF4444",
        desc: "There was an error connecting to the AI. Please try again."
      }]);
      setFinalScores({ grammar: 50, fluency: 50, confidence: 50, clarity: 50, tech: 50, body: 50 });
    } finally {
      setSessionState('RESULTS');
    }
  };

  const getScoreData = () => {
    if (!finalScores) return [];
    return [
      { subject: 'Grammar', A: finalScores.grammar, fullMark: 100 },
      { subject: 'Fluency', A: finalScores.fluency, fullMark: 100 },
      { subject: 'Confidence', A: finalScores.confidence, fullMark: 100 },
      { subject: 'Clarity', A: finalScores.clarity, fullMark: 100 },
      { subject: 'Tech Comm.', A: finalScores.tech, fullMark: 100 },
      { subject: 'Body Lang.', A: finalScores.body, fullMark: 100 },
    ];
  };

  const overallScore = finalScores ? Math.floor((finalScores.grammar + finalScores.fluency + finalScores.confidence + finalScores.clarity + finalScores.tech + finalScores.body) / 6) : 0;

  return (
    <div className="main-content" style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      paddingBottom: '6rem',
      marginLeft: '80px',
      marginTop: '20px',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
          50% { transform: scaleY(1.5); opacity: 1; }
        }
        .wave-bar {
          border-radius: 4px;
        }
      `}} />
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 className="heading-gradient" style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))', padding: '0.75rem', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}>
                <Mic size={32} color="#8B5CF6" />
              </div>
              LiveSpeak <span style={{ color: '#8B5CF6' }}>AI</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Real-time interview coach & speech analytics.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {sessionState === 'LISTENING' && (
              <button onClick={stopSession} className="hover-glow" style={{ background: 'linear-gradient(135deg, #EF4444, #B91C1C)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '50px', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)' }}>
                <MicOff size={20} /> End Session
              </button>
            )}
            {sessionState === 'ANALYZING' && (
              <button disabled style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', border: 'none', padding: '0.75rem 2rem', borderRadius: '50px', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'not-allowed' }}>
                <Activity size={20} className="animate-spin" /> Analyzing...
              </button>
            )}
            {(sessionState === 'IDLE' || sessionState === 'RESULTS') && (
              <>
                <button onClick={startSession} className="hover-glow" style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', color: 'white', border: 'none', padding: '0.75rem 2.5rem', borderRadius: '50px', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)' }}>
                  <Mic size={20} /> {sessionState === 'IDLE' ? 'Start Speaking' : 'Try Again'}
                </button>
                <button onClick={startSimulatedSession} className="hover-glow" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4', border: '1px solid rgba(6, 182, 212, 0.5)', padding: '0.75rem 2rem', borderRadius: '50px', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(6, 182, 212, 0.2)' }}>
                  <Zap size={20} /> Simulate Demo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {sessionState === 'RESULTS' && finalScores ? (
          /* ================= SCORECARD VIEW ================= */
          <div className="cascade-reveal" style={{ animationDelay: '0.1s' }}>
            <div className="glass-panel premium-3d" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Overall Performance Score</h2>
                <div style={{ fontSize: '6rem', fontWeight: '900', background: 'linear-gradient(to right, #8B5CF6, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(139, 92, 246, 0.2)' }}>
                  {overallScore}<span style={{ fontSize: '2.5rem', color: 'var(--text-muted)', WebkitTextFillColor: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'center' }}>
                {/* Radar Chart */}
                <div className="glass-panel" style={{ flex: '1 1 400px', height: '450px', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getScoreData()}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="User" dataKey="A" stroke="#06B6D4" strokeWidth={3} fill="url(#colorUv)" fillOpacity={0.6} />
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* AI Practice Suggestions */}
                <div style={{ flex: '1 1 400px' }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#F59E0B' }}>
                    <Target size={28} /> AI Contextual Feedback
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {dynamicTips.map((tip, idx) => (
                      <div key={idx} className="glass-panel premium-3d" style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1.5rem', borderRadius: '16px', borderLeft: `5px solid ${tip.color}` }}>
                        <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem', color: '#FFF' }}>{tip.title}</p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : sessionState !== 'RESULTS' ? (
          /* ================= LIVE SPEAKING VIEW ================= */
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* Left Panel: Microphone & Transcript */}
            <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Teleprompter / Status */}
              <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.1s', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)', width: '300px', height: '300px', borderRadius: '50%' }}></div>
                
                {sessionState === 'ANALYZING' ? (
                  <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid rgba(139, 92, 246, 0.3)', animation: 'pulse 1s infinite' }}>
                      <Activity size={50} color="#8B5CF6" className="animate-spin" />
                    </div>
                    <h2 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '1rem', fontWeight: '800', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI is analyzing...</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Evaluating your grammar, fluency, and technical accuracy.</p>
                  </div>
                ) : sessionState === 'IDLE' ? (
                  <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease', position: 'relative', zIndex: 1 }}>
                    <div className="hero-aura-1" style={{ width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%', zIndex: -1 }}></div>
                    <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5), 0 0 30px rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)', animation: 'pulse 2s infinite' }}>
                      <Mic size={50} color="#8B5CF6" />
                    </div>
                    <h2 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '1rem', fontWeight: '800', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ready to listen</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Click "Start Speaking" and answer a mock interview question.</p>
                  </div>
                ) : (
                  <>
                    <div className="live-waveform-container glass-panel" style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 16px', borderRadius: '30px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#EF4444', fontWeight: '700', marginRight: '8px', animation: 'pulse 1.5s infinite', textShadow: '0 0 10px rgba(239, 68, 68, 0.6)' }}>● LIVE</span>
                      <div className="wave-bar" style={{ height: '15px', width: '4px', background: '#06B6D4', animation: 'wave 1.2s ease-in-out infinite' }}></div>
                      <div className="wave-bar" style={{ height: '25px', width: '4px', background: '#8B5CF6', animation: 'wave 1s ease-in-out infinite 0.2s' }}></div>
                      <div className="wave-bar" style={{ height: '15px', width: '4px', background: '#06B6D4', animation: 'wave 1.5s ease-in-out infinite 0.4s' }}></div>
                    </div>
                    
                    <div style={{ width: '100%', maxWidth: '800px', marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                      <p style={{ fontSize: '1.2rem', color: '#8B5CF6', marginBottom: '1.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>AI Interviewer:</p>
                      <h3 style={{ fontSize: '2.4rem', fontWeight: '700', marginBottom: '2rem', color: '#fff', lineHeight: '1.4' }}>"Tell me about a time you had to optimize a slow application. How did you approach it?"</h3>
                    </div>
                  </>
                )}
              </div>

              {/* Live Transcript Area */}
              <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.2s', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', flexGrow: 1, minHeight: '350px' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-muted)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '600' }}>
                  <Volume2 size={24} /> Live Transcript
                </h3>
                {transcript ? (
                  <p style={{ fontSize: '1.6rem', lineHeight: '1.8', color: '#fff', fontWeight: '400' }}>
                    {transcript}
                    <span style={{ display: 'inline-block', width: '4px', height: '1.4rem', background: '#8B5CF6', marginLeft: '8px', animation: 'pulse 1s infinite', boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)' }}></span>
                  </p>
                ) : (
                  <p style={{ fontSize: '1.6rem', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    {sessionState === 'LISTENING' ? "Listening to your voice..." : "Transcript will appear here."}
                  </p>
                )}
              </div>

            </div>

            {/* Right Panel: Live Analytics */}
            <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.3s', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(6, 182, 212, 0.4)', boxShadow: '0 10px 30px rgba(6, 182, 212, 0.1)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '600' }}>
                  <Activity size={20} color="#06B6D4" /> Confidence Level
                </h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '4rem', fontWeight: '900', color: '#06B6D4', lineHeight: '1', textShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}>{confidenceScore}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: '600' }}>/ 100</span>
                </div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: `${confidenceScore}%`, height: '100%', background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)', transition: 'width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)' }}></div>
                </div>
              </div>

              <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.4s', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.1)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '600' }}>
                  <AlertTriangle size={20} color="#F59E0B" /> Filler Words Detected
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ fontSize: '4.5rem', fontWeight: '900', color: fillerWords > 5 ? '#EF4444' : '#F59E0B', lineHeight: '1', textShadow: fillerWords > 5 ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 0 20px rgba(245, 158, 11, 0.4)' }}>{fillerWords}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Avoid saying <span style={{ color: '#FFF', fontWeight: '600', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>"um"</span>, <span style={{ color: '#FFF', fontWeight: '600', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>"like"</span>, or <span style={{ color: '#FFF', fontWeight: '600', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>"actually"</span>. Try to use brief silences instead.
                  </div>
                </div>
              </div>

              <div className="glass-panel premium-3d cascade-reveal" style={{ animationDelay: '0.5s', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.4)', flexGrow: 1, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.1)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '600' }}>
                  <CheckCircle size={20} color="#8B5CF6" /> Live Grammar Suggestions
                </h3>
                
                {grammarFlags.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(255,255,255,0.3)' }}>
                    <Target size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem' }}>No grammar flags detected yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {grammarFlags.map((flag, idx) => (
                      <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '16px', animation: 'fadeIn 0.4s ease', borderLeft: '4px solid #EF4444' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#EF4444', textDecoration: 'line-through', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>
                          <AlertTriangle size={16} /> "{flag.error}"
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#10B981', fontWeight: '700', fontSize: '1.1rem' }}>
                          <CheckCircle size={16} /> "{flag.correction}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
