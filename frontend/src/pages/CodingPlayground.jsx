import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle, XCircle, Loader2, Terminal, TerminalSquare, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = {
  javascript: { id: 'javascript', name: 'JavaScript', version: '*' },
  python: { id: 'python', name: 'Python', version: '*' },
  java: { id: 'java', name: 'Java', version: '*' },
  cpp: { id: 'cpp', name: 'C++', version: '*' },
  c: { id: 'c', name: 'C', version: '*' },
  go: { id: 'go', name: 'Go', version: '*' },
  r: { id: 'r', name: 'R', version: '*' },
};

const PRELOADED_QUESTIONS = [
  {
    id: 1,
    title: '1. Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));',
      python: 'def twoSum(nums, target):\n    # Write your code here\n    pass\n\nprint(twoSum([2, 7, 11, 15], 9))',
      java: 'public class Main {\n    public static void main(String[] args) {\n        // Test your code\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Test your code\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    // Test your code\n    return 0;\n}',
      go: 'package main\nimport "fmt"\n\nfunc main() {\n    // Test your code\n}',
      r: '# Write your code here\nprint("Hello from R")'
    }
  },
  {
    id: 2,
    title: '2. Reverse String',
    difficulty: 'Easy',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    examples: 'Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]',
    starterCode: {
      javascript: 'function reverseString(s) {\n  // Write your code here\n  \n}\n\nlet arr = ["h","e","l","l","o"];\nreverseString(arr);\nconsole.log(arr);',
      python: 'def reverseString(s):\n    # Write your code here\n    pass\n\narr = ["h","e","l","l","o"]\nreverseString(arr)\nprint(arr)',
      java: 'public class Main {\n    public static void main(String[] args) {\n        // Test your code\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Test your code\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    // Test your code\n    return 0;\n}',
      go: 'package main\nimport "fmt"\n\nfunc main() {\n    // Test your code\n}',
      r: '# Write your code here\nprint("Hello from R")'
    }
  },
  {
    id: 3,
    title: '3. Valid Palindrome',
    difficulty: 'Easy',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    examples: 'Input: s = "A man, a plan, a canal: Panama"\nOutput: true\nExplanation: "amanaplanacanalpanama" is a palindrome.',
    starterCode: {
      javascript: 'function isPalindrome(s) {\n  // Write your code here\n  \n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama"));',
      python: 'def isPalindrome(s):\n    # Write your code here\n    pass\n\nprint(isPalindrome("A man, a plan, a canal: Panama"))',
      java: 'public class Main {\n    public static void main(String[] args) {\n        // Test your code\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Test your code\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    // Test your code\n    return 0;\n}',
      go: 'package main\nimport "fmt"\n\nfunc main() {\n    // Test your code\n}',
      r: '# Write your code here\nprint("Hello from R")'
    }
  },
  {
    id: 4,
    title: 'Custom Blank Editor',
    difficulty: 'None',
    description: 'Write any code you want in this blank playground. Test algorithms, try out snippets, and run your code freely!',
    examples: '',
    starterCode: {
      javascript: 'console.log("Hello, PrepGenie!");',
      python: 'print("Hello, PrepGenie!")',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, PrepGenie!");\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, PrepGenie!" << endl;\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, PrepGenie!\\n");\n    return 0;\n}',
      go: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, PrepGenie!")\n}',
      r: 'print("Hello, PrepGenie!")'
    }
  }
];

export default function CodingPlayground() {
  const location = useLocation();
  
  const [allQuestions, setAllQuestions] = useState(PRELOADED_QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState(PRELOADED_QUESTIONS[3]);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(PRELOADED_QUESTIONS[3].starterCode['javascript']);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [successParticles, setSuccessParticles] = useState(false);

  useEffect(() => {
    if (location.state?.question) {
      const q = location.state.question;
      const dynamicQuestion = {
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        description: `Solve the following problem:\n\n${q.title}\n\n(This problem was loaded from your DSA Roadmap. Try implementing the optimal algorithm!)`,
        examples: 'Input: Example input\nOutput: Example output',
        starterCode: {
          javascript: `// ${q.title}\nfunction solve() {\n  // Write your code here\n  \n}\n\nconsole.log(solve());`,
          python: `# ${q.title}\ndef solve():\n    # Write your code here\n    pass\n\nprint(solve())`,
          java: `// ${q.title}\npublic class Main {\n    public static void main(String[] args) {\n        // Test your code\n    }\n}`,
          cpp: `// ${q.title}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Test your code\n    return 0;\n}`,
          c: `// ${q.title}\n#include <stdio.h>\n\nint main() {\n    // Test your code\n    return 0;\n}`,
          go: `// ${q.title}\npackage main\nimport "fmt"\n\nfunc main() {\n    // Test your code\n}`,
          r: `# ${q.title}\n# Write your code here`
        }
      };
      
      setAllQuestions(prev => {
        if (!prev.find(item => item.id === q.id)) {
          return [dynamicQuestion, ...prev];
        }
        return prev;
      });
      
      setActiveQuestion(dynamicQuestion);
      setCode(dynamicQuestion.starterCode[language]);
    }
  }, [location.state]);
  
  const handleQuestionChange = (e) => {
    const qId = e.target.value;
    const q = allQuestions.find(x => String(x.id) === String(qId));
    if (q) {
      setActiveQuestion(q);
      setCode(q.starterCode[language]);
      setOutput('');
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(activeQuestion.starterCode[lang] || '');
  };

  const handleReset = () => {
    setCode(activeQuestion.starterCode[language]);
    setOutput('');
    toast.success('Code reset to default');
  };

  const [isAskingAI, setIsAskingAI] = useState(false);

  const handleAskAI = async () => {
    if (!code.trim()) {
      toast.error('Write some code first!');
      return;
    }
    setIsAskingAI(true);
    setShowTerminal(true);
    setOutput('AI is thinking...');
    try {
      const { getHint } = await import('../lib/gemini');
      const hint = await getHint(code, activeQuestion.description);
      setOutput(`🤖 AI Hint:\n\n${hint}`);
      toast.success('Hint generated!');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      toast.error('Failed to get hint');
    } finally {
      setIsAskingAI(false);
    }
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('Executing...');
    setShowTerminal(true);

    setTimeout(() => {
      if (language === 'javascript') {
        let logOutput = "";
        const originalLog = console.log;
        const originalError = console.error;
        
        console.log = (...args) => {
          logOutput += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(" ") + "\n";
        };
        console.error = (...args) => {
          logOutput += "Error: " + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(" ") + "\n";
        };

        try {
          // eslint-disable-next-line no-eval
          const result = eval(code);
          if (result !== undefined && logOutput === "") {
             logOutput += String(result) + "\n";
          }
          setOutput(logOutput || "Execution completed (No output)");
          toast.success('Execution completed');
          setSuccessParticles(true);
          setTimeout(() => setSuccessParticles(false), 2000);
        } catch (error) {
          setOutput(logOutput + "\nError: " + error.message);
          toast.error('Execution finished with errors');
        } finally {
          console.log = originalLog;
          console.error = originalError;
          setIsRunning(false);
        }
      } else {
        setOutput(`Execution for ${LANGUAGES[language].name} is temporarily disabled.\n\nReason: The public Piston API was recently restricted.\nPlease use JavaScript for now!`);
        toast.error('Backend execution unavailable');
        setIsRunning(false);
      }
    }, 500);
  };

  return (
    <div className="main-content responsive-padding-mobile" style={{ padding: 'clamp(1rem, 3vw, 2rem)', marginTop: '20px' }}>
      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="heading-gradient" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>Coding Playground</h1>
          <p style={{ color: 'var(--text-muted)' }}>Write, test, and run your code right in the browser.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <label className="form-label">Select Problem</label>
          <select 
            className="input-field"
            value={activeQuestion.id}
            onChange={handleQuestionChange}
            style={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', color: '#fff' }}
          >
            {allQuestions.map(q => (
              <option key={q.id} value={q.id} style={{ backgroundColor: '#1a1a24', color: '#fff' }}>{q.title} {q.difficulty !== 'None' ? `(${q.difficulty})` : ''}</option>
            ))}
          </select>
        </div>
        
        <div style={{ flex: '0.5', minWidth: '150px' }}>
          <label className="form-label">Language</label>
          <select 
            className="input-field"
            value={language}
            onChange={handleLanguageChange}
            style={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', color: '#fff' }}
          >
            {Object.values(LANGUAGES).map(lang => (
              <option key={lang.id} value={lang.id} style={{ backgroundColor: '#1a1a24', color: '#fff' }}>{lang.name}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flex: '1', minWidth: '250px' }}>
          <button 
            className="btn-primary" 
            onClick={executeCode} 
            disabled={isRunning || isAskingAI}
            style={{ flex: 1, height: '48px' }}
          >
            {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          
          <button 
            onClick={handleAskAI}
            disabled={isRunning || isAskingAI}
            style={{ 
              flex: 1, 
              height: '48px',
              background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            {isAskingAI ? <Loader2 size={18} className="animate-spin" /> : '✨ Ask AI'}
          </button>
          <button 
            onClick={handleReset}
            disabled={isRunning}
            style={{ 
              height: '48px', 
              padding: '0 16px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={() => setShowTerminal(!showTerminal)}
            style={{ 
              height: '48px', 
              padding: '0 16px', 
              background: 'rgba(59, 130, 246, 0.1)', 
              border: '1px solid rgba(59, 130, 246, 0.4)', 
              borderRadius: '8px',
              color: '#3b82f6',
              display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'pointer'
            }}
          >
            <TerminalSquare size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '600px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: '1 1 300px', minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Problem Description</h3>
          </div>
          <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{activeQuestion.title}</h2>
            {activeQuestion.difficulty !== 'None' && (
              <span style={{ 
                display: 'inline-block', 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '0.8rem', 
                fontWeight: '600',
                marginBottom: '1rem',
                backgroundColor: activeQuestion.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: activeQuestion.difficulty === 'Easy' ? '#10b981' : '#f59e0b'
              }}>
                {activeQuestion.difficulty}
              </span>
            )}
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {activeQuestion.description}
            </p>
            {activeQuestion.examples && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#e2e8f0', fontSize: '0.9rem' }}>
                  {activeQuestion.examples}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ flex: '2 1 300px', minWidth: '280px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
           <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Code Editor</h3>
          </div>
          <div style={{ flex: 1, padding: '1rem 0' }}>
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16 }
              }}
            />
          </div>
        </div>

      </div>

      {/* Success Particles Overlay */}
      {successParticles && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999 }}>
          {[...Array(50)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '8px', height: '8px',
              background: ['#10b981', '#3b82f6', '#a855f7', '#f59e0b'][Math.floor(Math.random() * 4)],
              borderRadius: '50%',
              boxShadow: '0 0 10px currentColor',
              animation: `particleExplode 1s ease-out forwards`,
              transform: `rotate(${Math.random() * 360}deg) translate(${100 + Math.random() * 300}px)`,
              opacity: 0
            }}></div>
          ))}
          <style>{`
            @keyframes particleExplode {
              0% { opacity: 1; transform: scale(1) translate(0,0); }
              100% { opacity: 0; transform: scale(0.5) translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px); }
            }
          `}</style>
        </div>
      )}

      {/* Terminal Drawer */}
      <div style={{
        position: 'fixed',
        bottom: showTerminal ? '0' : '-400px',
        left: '80px',
        right: '0',
        height: '400px',
        background: 'rgba(10, 10, 15, 0.95)',
        borderTop: '2px solid rgba(59, 130, 246, 0.5)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.8), inset 0 20px 40px rgba(59, 130, 246, 0.05)',
        transition: 'bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Terminal Header */}
        <div style={{ padding: '10px 20px', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', fontFamily: 'monospace', fontWeight: 'bold' }}>
            <TerminalSquare size={16} /> OUTPUT TERMINAL
          </div>
          <button onClick={() => setShowTerminal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <ChevronDown size={20} />
          </button>
        </div>
        
        {/* Terminal Body */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontFamily: '"Fira Code", monospace', fontSize: '0.9rem', color: '#a78bfa' }}>
          {output ? (
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, textShadow: '0 0 5px rgba(167, 139, 250, 0.5)' }}>
              {output}
              <span className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '15px', background: '#a78bfa', marginLeft: '5px', verticalAlign: 'middle' }}></span>
            </pre>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>
              Ready for execution...
              <span className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '15px', background: 'var(--text-muted)', marginLeft: '5px', verticalAlign: 'middle' }}></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
