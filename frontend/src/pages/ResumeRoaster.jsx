import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { useDropzone } from 'react-dropzone';
import { Flame, FileText, Upload, Download, CheckCircle, XCircle, Edit3, Target, Eye, Cpu, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export default function ResumeRoaster() {
  const [file, setFile] = useState(null);
  const [isRoasting, setIsRoasting] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [results, setResults] = useState(null);

  const roastMessages = [
    "Hmm... let me judge your life choices 👀",
    "Reading between the lines... 🔍",
    "Oh boy, did you really put that? 🤦‍♂️",
    "Consulting the career gods... ⚡",
    "Calculating how many recruiters will cry... 😭",
    "Almost done roasting... 🔥"
  ];

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResults(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const startRoast = () => {
    if (!file) {
      toast.error('Please upload a PDF first!');
      return;
    }
    setIsRoasting(true);
    let msgIndex = 0;
    setLoadingMsg(roastMessages[0]);
    
    const interval = setInterval(() => {
      msgIndex++;
      if (msgIndex < roastMessages.length) {
        setLoadingMsg(roastMessages[msgIndex]);
      }
    }, 2000);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Pdf = e.target.result.split(',')[1];
        const { analyzeResume } = await import('../lib/gemini');
        const aiResults = await analyzeResume(base64Pdf);
        
        clearInterval(interval);
        setResults(aiResults);
        
        // Save activity to localStorage for streak
        const sessions = parseInt(localStorage.getItem('totalSessions') || '0');
        localStorage.setItem('totalSessions', sessions + 1);
        localStorage.setItem('lastActivityDate', new Date().toISOString().split('T')[0]);
        
        toast.success('Roast complete! Proceed with caution.', { icon: '🔥' });
      } catch (error) {
        console.error(error);
        clearInterval(interval);
        toast.error("AI Analysis failed. Falling back to default roast.");
        generateMockResults();
      } finally {
        setIsRoasting(false);
      }
    };
    reader.onerror = () => {
      clearInterval(interval);
      setIsRoasting(false);
      toast.error("Failed to read the PDF file.");
    };
    reader.readAsDataURL(file);
  };

  const generateMockResults = () => {
    setResults({
      score: 42,
      atsScore: 35,
      impactScore: 40,
      readabilityScore: 50,
      roasts: [
        "Your skills section looks like you googled 'what to put in resume' at 2AM 😂",
        "You listed 'Microsoft Word' as a technical skill in 2024. Are you serious? 😭",
        "This font size is testing my AI vision capabilities. Did you want recruiters to use a microscope? 🔬",
        "Your summary says 'Passionate Developer' but your GitHub link is broken. The irony hurts! 💔"
      ],
      suggestions: {
        add: [
          "Measurable metrics (e.g., 'Improved API response time by 20%')",
          "A working link to your portfolio/GitHub",
          "Modern frameworks relevant to the job description"
        ],
        remove: [
          "High school details (you're an engineer now!)",
          "The 'Hobbies' section where you listed 'Watching Netflix'",
          "Buzzwords without context (Synergy, Dynamic, Go-getter)"
        ],
        rewrite: [
          "Change 'Responsible for writing code' to 'Architected and deployed scalable backend services'",
          "Fix the formatting inconsistencies in the education dates"
        ]
      }
    });
  };

  const downloadReport = () => {
    if (!results) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(236, 72, 153);
    doc.text("PrepGenie AI Resume Roast", 20, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`Overall Survival Score: ${results.score}/100`, 20, 35);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("The Brutal Truth (Roasts):", 20, 50);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let y = 60;
    results.roasts.forEach(roast => {
      const splitText = doc.splitTextToSize(`- ${roast}`, 170);
      doc.text(splitText, 20, y);
      y += 10 * splitText.length;
    });

    doc.setFont("helvetica", "bold");
    doc.text("How to actually get hired (Suggestions):", 20, y + 10);
    y += 20;
    
    doc.setFont("helvetica", "normal");
    results.suggestions.add.forEach(s => {
      doc.text(`[ADD] ${s}`, 20, y);
      y += 10;
    });
    results.suggestions.remove.forEach(s => {
      doc.text(`[REMOVE] ${s}`, 20, y);
      y += 10;
    });

    doc.save("PrepGenie_Resume_Roast.pdf");
    toast.success("Roast Report downloaded!");
  };

  const renderMeter = (score, label, icon) => {
    let color = score < 50 ? '#ef4444' : score < 75 ? '#f59e0b' : '#10b981';
    return (
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <div style={{ color: color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: color, marginBottom: '0.5rem' }}>{score}%</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Navbar />
      <div style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: '100vh', maxWidth: '1000px', margin: '0 auto', padding: '100px 20px 50px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
          <div className="hero-aura-1" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%', zIndex: -1 }}></div>
          <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(239, 68, 68, 0.15))', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 30px rgba(236, 72, 153, 0.4)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            <Flame color="#ec4899" size={45} />
          </div>
          <h1 className="heading-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>AI Resume Roaster</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Upload your resume and let our brutal AI judge your life choices. Don't worry, we'll tell you how to fix it too!
          </p>
        </div>

        {!results && !isRoasting && (
          <div className="glass-panel premium-3d cascade-reveal" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(236, 72, 153, 0.2)', boxShadow: '0 15px 40px rgba(0,0,0,0.5)' }}>
            <div 
              {...getRootProps()} 
              style={{
                border: isDragActive ? '2px dashed #ec4899' : '2px dashed rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '4rem 2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: isDragActive ? 'rgba(236, 72, 153, 0.05)' : 'rgba(20, 20, 30, 0.5)',
                marginBottom: '2rem'
              }}
              className="hover-glow"
            >
              <input {...getInputProps()} />
              <Upload size={48} color={isDragActive ? '#ec4899' : 'var(--text-muted)'} style={{ margin: '0 auto 1.5rem' }} />
              {file ? (
                <div style={{ color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <FileText color="#10b981" /> {file.name}
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Drop your Resume PDF here</h3>
                  <p style={{ color: 'var(--text-muted)' }}>or click to browse files (Max 5MB)</p>
                </>
              )}
            </div>
            <button 
              onClick={startRoast} 
              disabled={!file}
              className="btn-primary" 
              style={{ padding: '15px 40px', fontSize: '1.2rem', background: 'linear-gradient(135deg, #ec4899, #ef4444)', opacity: !file ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: '10px' }}
            >
              <Flame size={20} /> Roast My Resume
            </button>
          </div>
        )}

        {isRoasting && (
          <div className="glass-panel animate-fade-in" style={{ padding: '5rem 3rem', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '4px solid rgba(236, 72, 153, 0.2)', borderRadius: '50%', borderTopColor: '#ec4899', animation: 'spin 1s linear infinite' }}></div>
              <Flame color="#ec4899" size={30} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 1s infinite' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>{loadingMsg}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Scanning {file?.name}...</p>
          </div>
        )}

        {results && (
          <div className="animate-fade-in">
            {/* Score Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(236, 72, 153, 0.1))', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center', gridColumn: '1 / -1' }}>
                <h3 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1rem' }}>Overall Survival Score</h3>
                <div style={{ fontSize: '5rem', fontWeight: '800', color: '#ef4444', lineHeight: '1', marginBottom: '1rem' }}>{results.score}<span style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.2)' }}>/100</span></div>
                <p style={{ color: '#fff' }}>Yikes. We have a lot of work to do. 😬</p>
              </div>
              {renderMeter(results.atsScore, 'ATS Compatibility', <Cpu size={24} />)}
              {renderMeter(results.impactScore, 'Impact & Metrics', <Target size={24} />)}
              {renderMeter(results.readabilityScore, 'Readability', <Eye size={24} />)}
            </div>

            {/* The Roast */}
            <div className="glass-panel premium-3d cascade-reveal" style={{ padding: '2.5rem', marginBottom: '3rem', borderLeft: '4px solid #ef4444', background: 'rgba(20, 20, 30, 0.7)' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                <Flame color="#ef4444" size={28} /> The Brutal Truth
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {results.roasts.map((roast, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
                    <AlertTriangle color="#f59e0b" style={{ flexShrink: 0 }} />
                    <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.5' }}>{roast}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-panel premium-3d cascade-reveal" style={{ padding: '2.5rem', marginBottom: '3rem', animationDelay: '0.2s', background: 'rgba(20, 20, 30, 0.7)' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#fff' }}>How to actually get hired</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div>
                  <h3 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}><CheckCircle size={20} /> What to ADD</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {results.suggestions.add.map((s, i) => (
                      <li key={i} style={{ color: 'var(--text-muted)', display: 'flex', gap: '10px' }}><span style={{ color: '#10b981' }}>+</span> {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}><XCircle size={20} /> What to REMOVE</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {results.suggestions.remove.map((s, i) => (
                      <li key={i} style={{ color: 'var(--text-muted)', display: 'flex', gap: '10px' }}><span style={{ color: '#ef4444' }}>-</span> {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 style={{ color: '#a855f7', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}><Edit3 size={20} /> What to REWRITE</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {results.suggestions.rewrite.map((s, i) => (
                      <li key={i} style={{ color: 'var(--text-muted)', display: 'flex', gap: '10px' }}><span style={{ color: '#a855f7' }}>~</span> {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setResults(null)} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={20} /> Roast Another Resume
              </button>
              <button onClick={downloadReport} className="btn-primary" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Download size={20} /> Download Fix Report
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); } }
      `}</style>
    </div>
  );
}
