import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Mic, Radio, BookOpen, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function SmartNotebook() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      
      if (transcript.length > 20) {
        processNotes();
      } else {
        toast.error("Not enough notes to summarize!");
        setTranscript('');
      }
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Browser doesn't support SpeechRecognition.");
        return;
      }
      
      setTranscript('');
      setSummary(null);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e) => {
        let current = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) current += e.results[i][0].transcript + ' ';
        }
        if (current) setTranscript(prev => prev + current);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      
      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const processNotes = async () => {
    setIsProcessing(true);
    toast.success("AI is structuring your notes...");
    try {
      const { summarizeNotes } = await import('../lib/gemini');
      const md = await summarizeNotes(transcript);
      setSummary(md);
      
      const currentGems = parseInt(localStorage.getItem('gems') || '0', 10);
      localStorage.setItem('gems', currentGems + 20);
    } catch (err) {
      console.error(err);
      toast.error("AI failed to summarize notes.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Navbar />
      
      <style>{`
        @keyframes rotateHolo {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1.05); }
        }
        @keyframes pulseAudio {
          0%, 100% { height: 15%; }
          50% { height: 100%; }
        }
        .holo-disc {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 2px dashed rgba(168, 85, 247, 0.5);
          top: 50%;
          left: 50%;
          margin-top: -150px;
          margin-left: -150px;
          animation: rotateHolo 10s linear infinite alternate;
          pointer-events: none;
        }
        .markdown-body h2 { color: #a855f7; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(168,85,247,0.3); padding-bottom: 0.5rem; }
        .markdown-body h3 { color: #e2e8f0; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .markdown-body p { margin-bottom: 1rem; color: #cbd5e1; line-height: 1.6; }
        .markdown-body ul { list-style: disc; padding-left: 20px; margin-bottom: 1.5rem; color: #cbd5e1; }
        .markdown-body li { margin-bottom: 0.5rem; }
        .markdown-body strong { color: #f8fafc; font-weight: 700; }
      `}</style>

      <div style={{ padding: '2rem 2rem 0', position: 'relative', zIndex: 100 }}>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="btn-primary hover-glow" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2rem', padding: '2rem', position: 'relative', zIndex: 1 }}>
        
        {/* Background ambient glow */}
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 60%)', filter: 'blur(50px)', zIndex: -1 }}></div>

        {/* Recorder Panel */}
        <div className="glass-panel premium-3d cascade-reveal" style={{ flex: '1', maxWidth: '600px', padding: '3rem', borderRadius: '30px', border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(168, 85, 247, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="holo-disc" style={{ animationPlayState: isRecording ? 'running' : 'paused', opacity: isRecording ? 1 : 0.3, transition: 'all 0.5s' }}></div>
            <div className="holo-disc" style={{ width: '240px', height: '240px', marginTop: '-120px', marginLeft: '-120px', border: '1px solid rgba(59, 130, 246, 0.4)', animationDuration: '15s', animationDirection: 'reverse', animationPlayState: isRecording ? 'running' : 'paused', opacity: isRecording ? 0.8 : 0.2 }}></div>
            
            <button onClick={toggleRecording} style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.2))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(168, 85, 247, 0.8)', boxShadow: isRecording ? '0 0 50px rgba(168, 85, 247, 0.8)' : '0 0 20px rgba(168, 85, 247, 0.3)', transition: 'all 0.3s', cursor: 'pointer' }}>
              {isRecording ? <Pause size={50} color="#ef4444" style={{ filter: 'drop-shadow(0 0 10px #ef4444)' }} /> : <Mic size={50} color="#fff" />}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px', marginBottom: '1.5rem', color: isRecording ? '#ef4444' : '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}>
            <Radio size={16} className={isRecording ? 'animate-pulse' : ''} />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>{isRecording ? 'Recording Voice Notes...' : 'Click to Speak'}</span>
          </div>

          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
            Speak freely about any technical concept you are studying. Gemini will listen and generate a perfectly structured Markdown study guide for you.
          </p>

          {/* Transcript live preview */}
          {(transcript || isRecording) && (
            <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}>
              <p style={{ color: '#fff', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.6' }}>
                {transcript || "Listening..."}
                {isRecording && <span style={{ display: 'inline-block', width: '4px', height: '1.2rem', background: '#a855f7', marginLeft: '5px', animation: 'pulse 1s infinite' }}></span>}
              </p>
            </div>
          )}

        </div>

        {/* AI Output Panel */}
        <div className="glass-panel premium-3d cascade-reveal" style={{ flex: '1', padding: '3rem', borderRadius: '30px', border: '1px solid rgba(59, 130, 246, 0.4)', background: 'rgba(20,20,30,0.8)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', color: '#3b82f6' }}>
            <BookOpen size={28} /> AI Study Guide
          </h2>
          
          {isProcessing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1rem', color: 'var(--text-muted)' }}>
              <Loader2 size={40} className="animate-spin" color="#3b82f6" />
              <p>Structuring your thoughts into a masterpiece...</p>
            </div>
          ) : summary ? (
            <div className="markdown-body" style={{ flex: 1 }}>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', textAlign: 'center' }}>
              Your generated study notes will appear here once you stop recording.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
