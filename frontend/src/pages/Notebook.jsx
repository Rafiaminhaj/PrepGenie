import { useState } from 'react';
import Navbar from '../components/Navbar';
import { BookText, Play, Square, Headphones, FileText, Sparkles, Upload } from 'lucide-react';

export default function Notebook() {
  const [sourceText, setSourceText] = useState('');
  const [hasSource, setHasSource] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!sourceText.trim()) return;
    setHasSource(true);
    setShowStudio(true);
  };

  const handleGeneratePodcast = () => {
    setIsGenerating(true);
    // Mock generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setIsPlaying(true);
    }, 3000);
  };

  return (
    <div className="app-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '0' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', gap: '20px', overflow: 'hidden', paddingBottom: '20px' }}>
        
        {/* Source Panel (Left) */}
        <div className="glass-panel" style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            <BookText color="var(--primary)" /> Sources
          </h2>

          {!hasSource ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Paste your study notes, code snippets, or documentation here.</p>
              <textarea 
                className="input-field" 
                style={{ flex: 1, resize: 'none', padding: '15px', fontSize: '1rem', background: 'rgba(0,0,0,0.2)' }}
                placeholder="Paste text here..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              <button onClick={handleUpload} className="btn-primary" disabled={!sourceText.trim()}>
                <Upload size={18} /> Add to Notebook
              </button>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', flex: 1, overflowY: 'auto' }}>
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{sourceText}</p>
              </div>
              <button onClick={() => { setHasSource(false); setShowStudio(false); setIsPlaying(false); }} className="btn-primary" style={{ marginTop: '15px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', boxShadow: 'none' }}>
                Clear Source
              </button>
            </div>
          )}
        </div>

        {/* Studio Panel (Right) */}
        <div className="glass-panel" style={{ flex: '1.5', display: 'flex', flexDirection: 'column', padding: '20px', position: 'relative', overflowY: 'auto' }}>
          
          {!showStudio ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Sparkles size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
              <h3>Add a source to unlock the Studio</h3>
              <p>AI will generate podcasts and study guides based on your notes.</p>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Audio Overview Section */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#a855f7' }}>
                  <Headphones size={20} /> Audio Overview
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Listen to a lifelike AI podcast discussing your uploaded notes.
                </p>

                {isGenerating ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(168, 85, 247, 0.1)', padding: '15px', borderRadius: '8px' }}>
                    <div className="dot-typing" style={{ background: '#a855f7' }}></div>
                    <span style={{ color: '#a855f7', fontWeight: '500' }}>Synthesizing AI voices...</span>
                  </div>
                ) : isPlaying ? (
                  <div className="animate-fade-in" style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                      <button onClick={() => setIsPlaying(false)} style={{ background: '#a855f7', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                        <Square size={16} fill="white" />
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Deep Dive: Your Notes</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hosts: AI Alex & AI Sarah</div>
                      </div>
                    </div>
                    {/* Fake Audio Waveform */}
                    <div style={{ display: 'flex', gap: '3px', height: '30px', alignItems: 'flex-end' }}>
                      {[...Array(30)].map((_, i) => (
                        <div key={i} style={{ 
                          flex: 1, 
                          background: '#a855f7', 
                          height: `${Math.max(10, Math.random() * 100)}%`,
                          borderRadius: '2px',
                          animation: `pulse ${0.5 + Math.random()}s infinite alternate`
                        }}></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button onClick={handleGeneratePodcast} className="btn-primary" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', width: '100%' }}>
                    <Play size={18} fill="white" /> Generate Podcast
                  </button>
                )}
              </div>

              {/* Study Guide Section */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#38bdf8' }}>
                  <FileText size={20} /> Smart Briefing Doc
                </h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>Key Concepts</span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>Timeline</span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>FAQs</span>
                </div>

                <ul style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li><strong>Core Idea:</strong> AI extracted the main concept from your text.</li>
                  <li><strong>Crucial Detail:</strong> It highlights definitions and important keywords automatically.</li>
                  <li><strong>Summary:</strong> Use this briefing doc for a quick 2-minute revision before your interview.</li>
                </ul>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
