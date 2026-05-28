import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Image as ImageIcon, Sparkles, Download, ArrowRight, Layers, Cpu, Code, Database, Globe } from 'lucide-react';
import { playHoverInSound, playHoverOutSound } from '../utils/sound';

export default function VisualLearning() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  
  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [answers, setAnswers] = useState({});

  const RECENT_CONCEPTS = [
    { name: 'Java Architecture', icon: <Layers size={18} /> },
    { name: 'OAuth 2.0 Flow', icon: <Globe size={18} /> },
    { name: 'Event Loop in JS', icon: <Code size={18} /> },
    { name: 'Kubernetes Architecture', icon: <Cpu size={18} /> },
    { name: 'SQL Joins Explained', icon: <Database size={18} /> },
  ];

  // Mock Database for Dynamic Content
  const knowledgeBase = {
    'java': {
      diagramType: 'jvm',
      summary: [
        {
          title: "JVM Architecture & Memory Management",
          content: "Java's power comes from the JVM. Code is compiled into bytecode (.class), which the JVM interprets. The JVM memory is divided into Heap (objects, Garbage Collected) and Stack (method execution, local variables). Understanding the Young Generation (Eden, S0, S1) and Old Generation is critical for tuning GC."
        },
        {
          title: "Internal Working of HashMap (Java 8+)",
          content: "HashMap uses an array of Nodes. When a collision occurs (same hashcode), it uses a LinkedList. In Java 8, if the bucket size exceeds 8 (TREEIFY_THRESHOLD), the LinkedList converts into a Red-Black Tree (O(log n) lookup) to prevent performance degradation."
        },
        {
          title: "Multithreading & Concurrency",
          content: "Always prefer the java.util.concurrent package over manual wait()/notify(). Use ExecutorService for thread pooling, ConcurrentHashMap for thread-safe maps (uses lock striping), and CountDownLatch/CyclicBarrier for synchronization."
        },
        {
          title: "String Pool & Immutability",
          content: "Strings are immutable in Java for security, synchronization, and caching. String literals are stored in the String Constant Pool (SCP). Using 'new String(\"A\")' creates two objects: one in Heap, one in SCP (if not present)."
        }
      ],
      quiz: [
        { q: "In Java 8+, when does a HashMap bucket convert from a LinkedList to a Red-Black Tree?", options: ["When bucket size > 8", "When load factor > 0.75", "When total elements > 16", "It never converts"], ans: 0 },
        { q: "Which memory area stores object instances and arrays in Java?", options: ["Stack Memory", "Heap Memory", "Metaspace", "Program Counter Register"], ans: 1 },
        { q: "Why is String immutable in Java?", options: ["To save memory", "For security and thread-safety", "To allow caching in String Pool", "All of the above"], ans: 3 },
        { q: "Which Map implementation uses Lock Striping for high concurrency?", options: ["Collections.synchronizedMap", "ConcurrentHashMap", "HashTable", "TreeMap"], ans: 1 },
        { q: "What happens if you call Thread.run() directly instead of Thread.start()?", options: ["Compilation error", "Runtime exception", "It executes in the current thread", "It creates a new thread"], ans: 2 }
      ]
    },
    'spring boot': {
      diagramType: 'mvc',
      summary: [
        {
          title: "Spring Boot MVC Architecture",
          content: "Spring Boot simplifies Spring by providing auto-configuration. The MVC pattern separates concerns: The Controller handles HTTP requests, the Service layer contains business logic, and the Repository interacts with the Database."
        },
        {
          title: "Dependency Injection & IoC",
          content: "Inversion of Control (IoC) is managed by the Spring Container. Beans are injected using @Autowired, reducing tight coupling between classes."
        },
        {
          title: "Auto-Configuration",
          content: "Spring Boot looks at the classpath (e.g., if Tomcat is there, it configures an embedded web server) and automatically sets up beans."
        }
      ],
      quiz: [
        { q: "Which layer in Spring Boot MVC should contain the core business logic?", options: ["Controller", "Service", "Repository", "Entity"], ans: 1 },
        { q: "What annotation is used to create a RESTful web service controller?", options: ["@Controller", "@RestController", "@WebController", "@Service"], ans: 1 },
        { q: "How does Spring Boot achieve Inversion of Control?", options: ["Through Inheritance", "Through Dependency Injection", "Through Interfaces", "Through Static Methods"], ans: 1 }
      ]
    },
    'react virtual dom': {
      diagramType: 'tree',
      summary: [
        {
          title: "Virtual DOM Rendering",
          content: "React uses a Virtual DOM to optimize rendering performance. When state changes, a new Virtual DOM tree is created and compared with the old one (Diffing)."
        },
        {
          title: "Reconciliation Process",
          content: "Only the actual changed nodes are updated in the Real DOM (Reconciliation), making UI updates extremely fast."
        }
      ],
      quiz: [
        { q: "What is the process of comparing the new and old Virtual DOM called?", options: ["Rendering", "Reconciliation", "Diffing", "Mounting"], ans: 2 }
      ]
    },
    'default': {
      diagramType: 'network',
      summary: [
        {
          title: "Component Isolation",
          content: "This architecture diagram visualizes the isolated core components."
        },
        {
          title: "Data Flow",
          content: "Arrows dictate the real-time bidirectional data flow between modules."
        },
        {
          title: "Execution Priority",
          content: "Highlighted nodes represent high-priority execution contexts in the main thread."
        }
      ],
      quiz: [
        { q: "What do the connecting lines in the diagram represent?", options: ["Hardware cables", "Data flow", "Memory leaks", "User inputs"], ans: 1 }
      ]
    }
  };

  const handleGenerate = (e, presetTopic = null) => {
    if (e) e.preventDefault();
    const query = presetTopic || topic;
    if (!query.trim()) return;

    if (presetTopic) setTopic(presetTopic);
    setIsGenerating(true);
    setResult(null);
    setShowQuiz(false);
    setAnswers({});
    setQuizScore(null);

    const lookupKey = query.toLowerCase();
    const data = knowledgeBase[lookupKey] || knowledgeBase['default'];

    // Mock AI image generation delay
    setTimeout(() => {
      setResult({
        topic: query,
        diagramType: data.diagramType,
        summary: data.summary,
        quiz: data.quiz
      });
      setIsGenerating(false);
    }, 2500);
  };

  const submitQuiz = () => {
    let score = 0;
    result.quiz.forEach((q, idx) => {
      if (answers[idx] === q.ans) score++;
    });
    setQuizScore(score);
    // Grant XP if perfect
    if (score === result.quiz.length) {
      const currentXP = parseInt(localStorage.getItem('prepGenie_score') || '0', 10);
      localStorage.setItem('prepGenie_score', currentXP + 10);
      window.dispatchEvent(new Event('statsUpdated'));
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Navbar />

      {/* Background Glows */}
      <div style={{ position: 'fixed', top: '20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(59, 130, 246, 0.2))', padding: '20px', borderRadius: '50%', boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)' }}>
              <ImageIcon color="#38bdf8" size={40} />
            </div>
          </div>
          <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', fontWeight: '800', letterSpacing: '-1px' }}>
            Visual Concepts
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Struggling with abstract theories? Summon our AI to generate crystal-clear architectural diagrams and visual explanations.
          </p>
        </div>

        <div className="glass-panel premium-3d cascade-reveal" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(56, 189, 248, 0.1)' }}>
          <form onSubmit={(e) => handleGenerate(e)} style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Sparkles size={20} color="#38bdf8" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="e.g., How REST APIs work, React Virtual DOM, DNS Resolution..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{ width: '100%', fontSize: '1.1rem', padding: '18px 20px 18px 55px', borderRadius: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <button type="submit" className="btn-primary hover-glow" disabled={isGenerating || !topic.trim()} style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)', whiteSpace: 'nowrap', padding: '0 30px', borderRadius: '16px', fontSize: '1.1rem' }}>
              {isGenerating ? 'Generating...' : 'Visualize'}
            </button>
          </form>

          {/* Quick Tags */}
          {!result && !isGenerating && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginRight: '10px' }}>Popular Searches:</span>
              {RECENT_CONCEPTS.map((concept, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleGenerate(null, concept.name)}
                  onMouseEnter={() => window.playHoverInSound && window.playHoverInSound()}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-main)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'; e.currentTarget.style.color = '#38bdf8'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                >
                  {concept.icon} {concept.name}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 2rem' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '2px dashed rgba(56, 189, 248, 0.5)', borderRadius: '50%', animation: 'spin 4s linear infinite' }}></div>
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '130px', height: '130px', border: '2px solid rgba(168, 85, 247, 0.5)', borderRadius: '50%', animation: 'spin 3s linear infinite reverse' }}></div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(56, 189, 248, 0.2)', padding: '15px', borderRadius: '50%', boxShadow: '0 0 30px rgba(56, 189, 248, 0.5)', animation: 'pulse 1.5s infinite' }}>
                  <ImageIcon color="#38bdf8" size={32} />
                </div>
              </div>
              <p style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: '500', letterSpacing: '1px' }}>Synthesizing "{topic}"...</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Generating architectural diagrams and conceptual mapping</p>
            </div>
          )}

          {/* Results State */}
          {result && !isGenerating && (
            <div className="animate-fade-in" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2.5rem', marginTop: '2.5rem' }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                <Sparkles color="#38bdf8" /> Visual Output: <span style={{ color: '#38bdf8' }}>{result.topic}</span>
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                
                {/* Image Section */}
                <div style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  boxShadow: '0 0 40px rgba(56, 189, 248, 0.15)',
                  background: '#000',
                  minHeight: '350px'
                }}>
                  {/* Scanning Laser Animation */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)', boxShadow: '0 0 15px #38bdf8', animation: 'scanline 3s linear infinite', zIndex: 10 }}></div>
                  {/* Custom Animated Node Diagram (Replaces the Planet Image) */}
                  <div style={{ width: '100%', height: '100%', minHeight: '350px', background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    
                    {/* Grid Background */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5 }}></div>

                    {/* Nodes and Connecting Lines based on diagramType */}
                    {result.diagramType === 'network' && (
                      <>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                          <line x1="50%" y1="20%" x2="20%" y2="60%" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" strokeDasharray="5,5" className="animated-line" />
                          <line x1="50%" y1="20%" x2="80%" y2="60%" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" strokeDasharray="5,5" className="animated-line" />
                          <line x1="20%" y1="60%" x2="50%" y2="85%" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2" strokeDasharray="5,5" className="animated-line" />
                          <line x1="80%" y1="60%" x2="50%" y2="85%" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2" strokeDasharray="5,5" className="animated-line" />
                          <line x1="20%" y1="60%" x2="80%" y2="60%" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" className="animated-line" />
                        </svg>
                        <div className="node" style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #38bdf8', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}>
                          <Globe color="#38bdf8" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>Client</div>
                        </div>
                        <div className="node-2" style={{ position: 'absolute', top: '60%', left: '20%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #a855f7', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}>
                          <Cpu color="#a855f7" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>Server</div>
                        </div>
                        <div className="node-3" style={{ position: 'absolute', top: '60%', left: '80%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #a855f7', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}>
                          <Code color="#a855f7" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>API</div>
                        </div>
                        <div className="node" style={{ position: 'absolute', top: '85%', left: '50%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #10b981', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                          <Database color="#10b981" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>Database</div>
                        </div>
                      </>
                    )}

                    {result.diagramType === 'jvm' && (
                      <>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                          <line x1="20%" y1="50%" x2="40%" y2="50%" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="3" className="animated-line" />
                          <line x1="60%" y1="50%" x2="80%" y2="50%" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="3" className="animated-line" />
                        </svg>
                        <div className="node" style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #f59e0b', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>
                          <Code color="#f59e0b" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>.java</div>
                        </div>
                        <div className="node-2" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #ef4444', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>
                          <Layers color="#ef4444" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>Javac</div>
                        </div>
                        <div className="node-3" style={{ position: 'absolute', top: '50%', left: '90%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #38bdf8', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}>
                          <Cpu color="#38bdf8" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>JVM (.class)</div>
                        </div>
                      </>
                    )}

                    {result.diagramType === 'mvc' && (
                      <>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                          <line x1="50%" y1="15%" x2="50%" y2="45%" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="3" className="animated-line" />
                          <line x1="50%" y1="45%" x2="50%" y2="75%" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="3" className="animated-line" />
                        </svg>
                        <div className="node" style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #10b981', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                          <Globe color="#10b981" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>Controller</div>
                        </div>
                        <div className="node-2" style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #3b82f6', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
                          <Cpu color="#3b82f6" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>Service Layer</div>
                        </div>
                        <div className="node-3" style={{ position: 'absolute', top: '75%', left: '50%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #a855f7', padding: '15px', borderRadius: '12px', zIndex: 2, boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}>
                          <Database color="#a855f7" size={32} />
                          <div style={{ color: '#fff', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>Repository</div>
                        </div>
                      </>
                    )}

                    {result.diagramType === 'tree' && (
                      <>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                          <line x1="50%" y1="20%" x2="30%" y2="60%" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="3" className="animated-line" />
                          <line x1="50%" y1="20%" x2="70%" y2="60%" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="3" className="animated-line" />
                        </svg>
                        <div className="node" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #ec4899', padding: '15px', borderRadius: '50%', zIndex: 2, boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' }}>
                          <Layers color="#ec4899" size={24} />
                        </div>
                        <div className="node-2" style={{ position: 'absolute', top: '60%', left: '30%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #ec4899', padding: '15px', borderRadius: '50%', zIndex: 2, boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' }}>
                          <Layers color="#ec4899" size={24} />
                        </div>
                        <div className="node-3" style={{ position: 'absolute', top: '60%', left: '70%', transform: 'translate(-50%, -50%)', background: '#0f172a', border: '2px solid #ec4899', padding: '15px', borderRadius: '50%', zIndex: 2, boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' }}>
                          <Layers color="#ec4899" size={24} />
                        </div>
                      </>
                    )}

                  </div>
                  
                  {/* Overlay Controls */}
                  <div style={{ position: 'absolute', bottom: '15px', right: '15px', zIndex: 20 }}>
                    <button className="btn-primary" style={{ padding: '10px 20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Download size={16} /> HD Download
                    </button>
                  </div>
                </div>
                
                {/* AI Summary Section */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', flex: 1 }}>
                    <h4 style={{ color: '#38bdf8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                      <Cpu size={20} /> Intensive Interview Breakdown
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', maxHeight: '400px', paddingRight: '10px' }}>
                      {result.summary.map((point, i) => (
                        <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', background: 'rgba(56, 189, 248, 0.05)', padding: '15px', borderRadius: '12px', borderLeft: '3px solid #38bdf8' }}>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Sparkles size={16} color="#38bdf8" /> {point.title}
                            </h5>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>{point.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowQuiz(true)}
                    className="btn-primary hover-glow" 
                    style={{ width: '100%', marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.05))', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '15px', display: 'flex', justifyContent: 'center', gap: '10px', color: '#c084fc', fontSize: '1.1rem' }}
                  >
                    Generate Quiz from Diagram <ArrowRight size={18} />
                  </button>
                </div>

              </div>
              
              {/* Interactive Quiz Section */}
              {showQuiz && (
                <div className="cascade-reveal" style={{ marginTop: '3rem', padding: '2.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20,20,30,0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                  <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={24} /> Concept Verification Quiz
                  </h3>
                  
                  {quizScore !== null ? (
                    <div className="cascade-reveal" style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.4)', borderRadius: '20px', border: quizScore === result.quiz.length ? '2px solid #10b981' : '2px solid #f59e0b', boxShadow: quizScore === result.quiz.length ? '0 0 30px rgba(16, 185, 129, 0.3)' : '0 0 30px rgba(245, 158, 11, 0.2)' }}>
                      <div style={{ fontSize: '5rem', fontWeight: '900', color: quizScore === result.quiz.length ? '#10b981' : '#f59e0b', marginBottom: '1rem', textShadow: `0 0 20px ${quizScore === result.quiz.length ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}` }}>
                        {quizScore} <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/ {result.quiz.length}</span>
                      </div>
                      <p style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 'bold' }}>
                        {quizScore === result.quiz.length ? "Flawless Victory! +10 XP Awarded! 🎉" : "Good effort! Review the breakdown and try again."}
                      </p>
                      <button onClick={() => { setQuizScore(null); setAnswers({}); }} className="btn-primary hover-glow" style={{ marginTop: '2rem', background: 'linear-gradient(90deg, #38bdf8, #a855f7)', padding: '12px 30px', fontSize: '1.1rem', border: 'none' }}>
                        Retake Assessment
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {result.quiz.map((q, idx) => (
                        <div key={idx} className="glass-panel" style={{ background: 'rgba(15, 20, 30, 0.8)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: answers[idx] !== undefined ? '#10b981' : '#38bdf8', transition: 'background 0.3s' }}></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '1.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                              {idx + 1}
                            </div>
                            <p style={{ color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: '700', lineHeight: '1.4' }}>{q.q}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '47px' }}>
                            {q.options.map((opt, optIdx) => {
                              const isSelected = answers[idx] === optIdx;
                              return (
                                <label 
                                  key={optIdx} 
                                  style={{ 
                                    display: 'flex', alignItems: 'center', gap: '15px', 
                                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)', 
                                    padding: '16px 20px', borderRadius: '12px', cursor: 'pointer', 
                                    border: `1px solid ${isSelected ? '#10b981' : 'rgba(255,255,255,0.05)'}`, 
                                    transition: 'all 0.2s',
                                    boxShadow: isSelected ? 'inset 0 0 20px rgba(16, 185, 129, 0.1)' : 'none'
                                  }}
                                  onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                                  onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                                >
                                  {/* Custom Checkbox Circle */}
                                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${isSelected ? '#10b981' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                    {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>}
                                  </div>
                                  
                                  {/* Hide default radio */}
                                  <input type="radio" name={`quiz-${idx}`} checked={isSelected} onChange={() => setAnswers({...answers, [idx]: optIdx})} style={{ display: 'none' }} />
                                  <span style={{ color: isSelected ? '#fff' : 'var(--text-main)', fontSize: '1.05rem', fontWeight: isSelected ? '600' : 'normal' }}>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={submitQuiz} 
                        className="btn-primary hover-glow" 
                        disabled={Object.keys(answers).length !== result.quiz.length} 
                        style={{ 
                          alignSelf: 'center', 
                          background: Object.keys(answers).length === result.quiz.length ? 'linear-gradient(90deg, #10b981, #059669)' : 'rgba(255,255,255,0.1)', 
                          color: Object.keys(answers).length === result.quiz.length ? '#fff' : 'var(--text-muted)', 
                          fontWeight: 'bold', padding: '16px 40px', fontSize: '1.2rem', marginTop: '1rem', border: 'none',
                          boxShadow: Object.keys(answers).length === result.quiz.length ? '0 10px 30px rgba(16, 185, 129, 0.4)' : 'none',
                          cursor: Object.keys(answers).length === result.quiz.length ? 'pointer' : 'not-allowed'
                        }}
                      >
                        {Object.keys(answers).length === result.quiz.length ? 'Submit Final Answers 🚀' : `Answer all ${result.quiz.length} questions to submit`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
