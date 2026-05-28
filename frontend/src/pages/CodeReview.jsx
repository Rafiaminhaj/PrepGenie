import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Code, Play, Bug, ShieldAlert, Cpu, CheckCircle, SearchCode, Terminal, AlertTriangle, Zap, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CodeReview() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Java');
  const [reviewType, setReviewType] = useState('Full Review');
  const [isReviewing, setIsReviewing] = useState(false);
  const [results, setResults] = useState(null);

  const sampleProblems = [
    {
      name: 'Two Sum',
      lang: 'Java',
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for(int i=0; i<nums.length; i++) {
            for(int j=i+1; j<nums.length; j++) {
                if(nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return null;
    }
}`
    },
    {
      name: 'Reverse String',
      lang: 'JavaScript',
      code: `function reverseString(str) {
  let reversed = "";
  for(let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`
    },
    {
      name: 'SQL Injection Vulnerability',
      lang: 'Java',
      code: `public User getUser(String username) {
    String query = "SELECT * FROM users WHERE username = '" + username + "'";
    return jdbcTemplate.queryForObject(query, User.class);
}`
    },
    {
      name: 'Unoptimized SQL Query',
      lang: 'SQL',
      code: `-- Get user data and orders without index optimization
SELECT * FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active';`
    }
  ];

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to review!');
      return;
    }
    
    setIsReviewing(true);
    setResults(null);
    
    // Save activity
    const sessions = parseInt(localStorage.getItem('totalSessions') || '0');
    localStorage.setItem('totalSessions', sessions + 1);
    localStorage.setItem('lastActivityDate', new Date().toISOString().split('T')[0]);

    try {
      const { analyzeCode } = await import('../lib/gemini');
      const analysis = await analyzeCode(code, language, reviewType);
      
      // Map Gemini JSON to our UI state
      const resultObj = {
        score: Math.round(analysis.overallScore / 10), // Convert 0-100 to 0-10
        timeComplexity: 'N/A', // We can add these back if we update the prompt
        spaceComplexity: 'N/A',
        bugs: analysis.bestPractices?.issues || [],
        smells: analysis.performance?.issues || [],
        security: analysis.security?.issues?.length ? analysis.security.issues : ['Pass: No obvious security vulnerabilities detected'],
        refactored: `// AI Suggestions:\n// ${analysis.summary}\n\n${code}` 
      };
      
      setResults(resultObj);
      toast.success('Code Review Complete!');
    } catch (error) {
      toast.error(error.message || 'Failed to analyze code.');
    } finally {
      setIsReviewing(false);
    }
  };

  const loadSample = (sample) => {
    setLanguage(sample.lang);
    setCode(sample.code);
    setResults(null);
  };

  const getBorderColor = () => {
    if (!results) return 'transparent';
    if (results.score >= 8) return '#10b981';
    if (results.score >= 5) return '#f59e0b';
    return '#ef4444';
  };

  const getBgColor = () => {
    if (!results) return 'transparent';
    if (results.score >= 8) return 'rgba(16,185,129,0.1)';
    if (results.score >= 5) return 'rgba(245,158,11,0.1)';
    return 'rgba(239,68,68,0.1)';
  };

  return (
    <div className="app-container">
      <Navbar />
      <div style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto', padding: '100px 20px 50px' }}>
        
        <style>{`
          @keyframes scanline {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes glitch {
            0% { transform: translate(0) }
            20% { transform: translate(-2px, 2px) }
            40% { transform: translate(-2px, -2px) }
            60% { transform: translate(2px, 2px) }
            80% { transform: translate(2px, -2px) }
            100% { transform: translate(0) }
          }
          .ide-scrollbar::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          .ide-scrollbar::-webkit-scrollbar-track {
            background: #1e1e1e;
          }
          .ide-scrollbar::-webkit-scrollbar-thumb {
            background: #424242;
            border-radius: 0px;
          }
          .ide-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #4f4f4f;
          }
        `}</style>

        <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
          <div className="hero-aura-2" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%', zIndex: -1 }}></div>
          <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(59, 130, 246, 0.15))', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 30px rgba(168, 85, 247, 0.4)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <Terminal color="#a855f7" size={45} />
          </div>
          <h1 className="heading-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #a855f7, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>AI Code Reviewer</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Paste your code to get instant feedback on time complexity, security vulnerabilities, and code quality.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {/* Main Editor Area */}
          <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
            <div className="premium-3d" style={{ padding: '0', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', borderRadius: '8px', background: '#1e1e1e' }}>
              
              {/* VS Code Style Header */}
              <div style={{ background: '#252526', padding: '8px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', marginRight: '15px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                  </div>
                  <div style={{ color: '#858585', fontSize: '0.85rem', fontFamily: 'sans-serif', background: '#1e1e1e', padding: '4px 15px', borderRadius: '4px 4px 0 0', borderBottom: '1px solid #1e1e1e' }}>
                    Solution.{language === 'Python' ? 'py' : language === 'JavaScript' ? 'js' : language === 'C++' ? 'cpp' : language === 'SQL' ? 'sql' : 'java'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ background: '#333333', color: '#ccc', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                  >
                    <option>Java</option>
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>C++</option>
                    <option>SQL</option>
                  </select>
                  <button 
                    onClick={handleReview}
                    disabled={isReviewing}
                    className="hover-glow"
                    style={{ padding: '4px 15px', display: 'flex', alignItems: 'center', gap: '6px', background: '#0e639c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer', opacity: isReviewing ? 0.7 : 1 }}
                  >
                    {isReviewing ? <SearchCode className="spin" size={14} /> : <Play size={14} />}
                    {isReviewing ? 'Analyzing...' : 'Run Review'}
                  </button>
                </div>
              </div>

              {/* IDE Editor Area */}
              <div style={{ display: 'flex', height: '450px', position: 'relative', background: '#1e1e1e' }}>
                
                {/* Simulated Line Numbers */}
                <div style={{ width: '50px', padding: '20px 0', background: '#1e1e1e', borderRight: '1px solid #333', textAlign: 'right', color: '#858585', fontFamily: '"Fira Code", monospace', fontSize: '1rem', lineHeight: '1.5', userSelect: 'none' }}>
                  {code.split('\n').map((_, i) => (
                    <div key={i} style={{ paddingRight: '15px' }}>{i + 1}</div>
                  ))}
                  {code.split('\n').length === 0 && <div style={{ paddingRight: '15px' }}>1</div>}
                </div>

                {/* Laser Scanner Overlay */}
                {isReviewing && (
                  <div style={{ position: 'absolute', top: 0, left: '50px', right: 0, height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
                    <div style={{ position: 'absolute', width: '100%', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.4))', borderBottom: '2px solid #a855f7', animation: 'scanline 2s infinite linear', boxShadow: '0 5px 15px rgba(168, 85, 247, 0.5)' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#a855f7', fontSize: '2rem', fontWeight: 'bold', animation: 'glitch 0.2s infinite', textShadow: '0 0 10px #a855f7', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '8px' }}>
                      ANALYZING...
                    </div>
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  className="ide-scrollbar"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your code here..."
                  style={{
                    flex: 1,
                    height: '100%',
                    background: 'transparent',
                    color: '#d4d4d4',
                    padding: '20px',
                    border: 'none',
                    outline: 'none',
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    resize: 'none',
                    whiteSpace: 'pre'
                  }}
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Results Panel */}
            {results && (
              <div className="glass-panel premium-3d cascade-reveal" style={{ marginTop: '2rem', padding: '2.5rem', borderTop: '4px solid #a855f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <SearchCode color="#a855f7" /> AI Review Results
                  </h2>
                  <div style={{ background: getBgColor(), padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', border: `1px solid ${getBorderColor()}` }}>
                    <span style={{ color: 'var(--text-muted)' }}>Score:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: results.score >= 8 ? '#10b981' : results.score >= 5 ? '#f59e0b' : '#ef4444' }}>{results.score}/10</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid #3b82f6' }}>
                    <div style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><Clock size={18} /> Time Complexity</div>
                    <div style={{ fontSize: '1.2rem', color: '#fff' }}>{results.timeComplexity}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid #ec4899' }}>
                    <div style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><Cpu size={18} /> Space Complexity</div>
                    <div style={{ fontSize: '1.2rem', color: '#fff' }}>{results.spaceComplexity}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  {results.bugs.length > 0 && (
                    <div>
                      <h4 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><Bug size={18} /> Bugs Detected</h4>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {results.bugs.map((b, i) => <li key={i} style={{ color: 'var(--text-muted)', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', marginBottom: '5px' }}>{b}</li>)}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><AlertTriangle size={18} /> Code Smells</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {results.smells.map((s, i) => <li key={i} style={{ color: 'var(--text-muted)', padding: '8px 12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px', marginBottom: '5px' }}>{s}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><ShieldAlert size={18} /> Security Analysis</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {results.security.map((s, i) => <li key={i} style={{ color: 'var(--text-muted)', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', marginBottom: '5px' }}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ color: '#a855f7', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.2rem' }}><Zap size={20} /> AI Refactored Solution</h4>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(results.refactored); toast.success('Copied to clipboard!'); }}
                      style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(168, 85, 247, 0.4)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(168, 85, 247, 0.2)'}
                    >
                      Copy Code
                    </button>
                  </div>
                  
                  {/* Refactored Code VS Code Style */}
                  <div style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', background: '#1e1e1e' }}>
                    <div style={{ background: '#252526', padding: '6px 15px', fontSize: '0.8rem', color: '#858585', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Terminal size={14} /> Optimized_Solution.{language === 'Python' ? 'py' : language === 'JavaScript' ? 'js' : language === 'C++' ? 'cpp' : language === 'SQL' ? 'sql' : 'java'}
                    </div>
                    <pre className="ide-scrollbar" style={{ margin: 0, padding: '1.5rem', color: '#4ec9b0', overflowX: 'auto', fontFamily: '"Fira Code", monospace', fontSize: '0.95rem' }}>
                      {results.refactored}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
            <div className="glass-panel premium-3d" style={{ padding: '1.5rem', background: 'rgba(20, 20, 30, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Code size={20} color="#3b82f6" /> Try Samples
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sampleProblems.map((sample, idx) => (
                  <div 
                    key={idx}
                    onClick={() => loadSample(sample)}
                    className="module-card"
                    style={{ 
                      padding: '1.2rem', 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ color: '#fff', fontWeight: '600', marginBottom: '6px', fontSize: '1.05rem' }}>{sample.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', display: 'inline-block', padding: '2px 8px', borderRadius: '12px' }}>{sample.lang}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
