import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle, XCircle, Loader2, Terminal, TerminalSquare, ChevronDown, GitBranch, FlaskConical } from 'lucide-react';
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
    functionName: 'twoSum',
    testCases: [
      { input: '([2,7,11,15], 9)', inputArgsJava: '(new int[]{2,7,11,15}, 9)', displayInput: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
      { input: '([3,2,4], 6)', inputArgsJava: '(new int[]{3,2,4}, 6)', displayInput: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
      { input: '([3,3], 6)', inputArgsJava: '(new int[]{3,3}, 6)', displayInput: 'nums = [3,3], target = 6', expected: '[0,1]' }
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}\n\n// console.log(twoSum([2, 7, 11, 15], 9));',
      python: 'def twoSum(nums, target):\n    # Write your code here\n    pass\n\nprint(twoSum([2, 7, 11, 15], 9))',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
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
    functionName: 'reverseString',
    testCases: [
      { input: '(["h","e","l","l","o"])', inputArgsJava: '(new char[]{\'h\',\'e\',\'l\',\'l\',\'o\'})', displayInput: 's = ["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
      { input: '(["H","a","n","n","a","h"])', inputArgsJava: '(new char[]{\'H\',\'a\',\'n\',\'n\',\'a\',\'h\'})', displayInput: 's = ["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' }
    ],
    starterCode: {
      javascript: 'function reverseString(s) {\n  // Write your code here (Return the modified array for testing!)\n  \n}\n\n// let arr = ["h","e","l","l","o"];\n// console.log(reverseString(arr));',
      python: 'def reverseString(s):\n    # Write your code here\n    pass\n\narr = ["h","e","l","l","o"]\nreverseString(arr)\nprint(arr)',
      java: 'class Solution {\n    public char[] reverseString(char[] s) {\n        // Write your code here (return the array for testing)\n        return s;\n    }\n}',
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
    functionName: 'isPalindrome',
    testCases: [
      { input: '("A man, a plan, a canal: Panama")', inputArgsJava: '("A man, a plan, a canal: Panama")', displayInput: 's = "A man, a plan, a canal: Panama"', expected: 'true' },
      { input: '("race a car")', inputArgsJava: '("race a car")', displayInput: 's = "race a car"', expected: 'false' },
      { input: '(" ")', inputArgsJava: '(" ")', displayInput: 's = " "', expected: 'true' }
    ],
    starterCode: {
      javascript: 'function isPalindrome(s) {\n  // Write your code here\n  \n}\n\n// console.log(isPalindrome("A man, a plan, a canal: Panama"));',
      python: 'def isPalindrome(s):\n    # Write your code here\n    pass\n\nprint(isPalindrome("A man, a plan, a canal: Panama"))',
      java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Test your code\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    // Test your code\n    return 0;\n}',
      go: 'package main\nimport "fmt"\n\nfunc main() {\n    // Test your code\n}',
      r: '# Write your code here\nprint("Hello from R")'
    }
  },
  {
    id: 4,
    title: 'Graph Sandbox',
    difficulty: 'None',
    description: 'Write code in any language to draw a graph!\n\nPrint the following commands in your code to draw:\n\nVIS_NODE:id,label,x%,y%\nVIS_EDGE:source_id,target_id\n\nExample in Java:\nSystem.out.println("VIS_NODE:1,Root,50,20");\nSystem.out.println("VIS_NODE:2,Left,30,50");\nSystem.out.println("VIS_EDGE:1,2");',
    examples: '',
    functionName: '',
    testCases: [],
    starterCode: {
      javascript: 'console.log("VIS_NODE:1,Root,50,20");\nconsole.log("VIS_NODE:2,Child,50,60");\nconsole.log("VIS_EDGE:1,2");\nconsole.log("Hello, Graph!");',
      python: 'print("VIS_NODE:1,Root,50,20")\nprint("VIS_NODE:2,Child,50,60")\nprint("VIS_EDGE:1,2")\nprint("Hello, Graph!")',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("VIS_NODE:1,Root,50,20");\n        System.out.println("VIS_NODE:2,Child,50,60");\n        System.out.println("VIS_EDGE:1,2");\n        System.out.println("Hello, Graph!");\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "VIS_NODE:1,Root,50,20" << endl;\n    cout << "VIS_NODE:2,Child,50,60" << endl;\n    cout << "VIS_EDGE:1,2" << endl;\n    cout << "Hello, Graph!" << endl;\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    printf("VIS_NODE:1,Root,50,20\\n");\n    printf("VIS_NODE:2,Child,50,60\\n");\n    printf("VIS_EDGE:1,2\\n");\n    printf("Hello, Graph!\\n");\n    return 0;\n}',
      go: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("VIS_NODE:1,Root,50,20")\n    fmt.Println("VIS_NODE:2,Child,50,60")\n    fmt.Println("VIS_EDGE:1,2")\n    fmt.Println("Hello, Graph!")\n}',
      r: 'print("VIS_NODE:1,Root,50,20")\nprint("VIS_NODE:2,Child,50,60")\nprint("VIS_EDGE:1,2")\nprint("Hello, Graph!")'
    }
  }
];

export default function CodingPlayground() {
  const location = useLocation();
  
  const [allQuestions, setAllQuestions] = useState(PRELOADED_QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState(PRELOADED_QUESTIONS[0]);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(PRELOADED_QUESTIONS[0].starterCode['javascript']);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [successParticles, setSuccessParticles] = useState(false);
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'graph' | 'tests'
  const [graphNodes, setGraphNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    if (location.state?.question) {
      const q = location.state.question;
      const dynamicQuestion = {
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        description: `Solve the following problem:\n\n${q.title}\n\n(This problem was loaded from your DSA Roadmap. Try implementing the optimal algorithm!)`,
        examples: 'Input: Example input\nOutput: Example output',
        functionName: '',
        testCases: [],
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
      setGraphNodes([]);
      setGraphEdges([]);
      setTestResults([]);
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
    setGraphNodes([]);
    setGraphEdges([]);
    setTestResults([]);
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
    setActiveTab('terminal');
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

  const parseOutputForGraph = (rawOutput) => {
    const lines = rawOutput.split('\n');
    const cleanLines = [];
    const nodes = [];
    const edges = [];
    
    lines.forEach(line => {
      if (line.trim().startsWith('VIS_NODE:')) {
        const parts = line.substring(line.indexOf('VIS_NODE:') + 9).split(',');
        if(parts.length >= 4) {
          nodes.push({ id: parts[0].trim(), label: parts[1].trim(), x: parts[2].trim(), y: parts[3].trim() });
        }
      } else if (line.trim().startsWith('VIS_EDGE:')) {
        const parts = line.substring(line.indexOf('VIS_EDGE:') + 9).split(',');
        if(parts.length >= 2) {
          edges.push({ source: parts[0].trim(), target: parts[1].trim() });
        }
      } else {
        cleanLines.push(line);
      }
    });
    
    setGraphNodes(nodes);
    setGraphEdges(edges);
    
    if (nodes.length > 0 || edges.length > 0) {
      setActiveTab('graph');
    } else {
      setActiveTab('terminal');
    }
    
    return cleanLines.join('\n');
  };

  // Run Code (Manual Execution)
  const executeCode = async () => {
    setIsRunning(true);
    setOutput('Executing...');
    setShowTerminal(true);
    setActiveTab('terminal');

    if (language === 'javascript') {
      setTimeout(() => {
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
          
          const cleanOutput = parseOutputForGraph(logOutput);
          setOutput(cleanOutput || "Execution completed (No output)");
          toast.success('Execution completed');
        } catch (error) {
          setOutput(logOutput + "\nError: " + error.message);
          toast.error('Execution finished with errors');
        } finally {
          console.log = originalLog;
          console.error = originalError;
          setIsRunning(false);
        }
      }, 100);
    } else {
      // Backend Execution
      try {
        const response = await fetch('http://localhost:8080/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: language, code: code })
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();
        
        if (data.success) {
          const cleanOutput = parseOutputForGraph(data.output || "");
          setOutput(cleanOutput || "Execution completed (No output)");
          toast.success('Execution completed');
        } else {
          setOutput((data.output ? data.output + "\n" : "") + (data.error || "Execution failed"));
          toast.error('Execution finished with errors');
        }
      } catch (error) {
        setOutput(`Error connecting to execution server: ${error.message}\nPlease ensure your Spring Boot backend is running.`);
        toast.error('Failed to connect to backend');
      } finally {
        setIsRunning(false);
      }
    }
  };

  // Submit Code (Automated Tests)
  const submitCode = async () => {
    if (language !== 'javascript' && language !== 'java') {
      toast.error('Automated Test Cases are currently only available for JavaScript and Java!');
      return;
    }

    if (!activeQuestion.testCases || activeQuestion.testCases.length === 0) {
      toast.error('No automated test cases available for this problem.');
      return;
    }

    setIsTesting(true);
    setShowTerminal(true);
    setActiveTab('tests');
    setTestResults([]);

    if (language === 'javascript') {
      setTimeout(() => {
        const results = [];
        let allPassed = true;

        try {
          const runnerCode = `
            ${code}
            
            return function(inputArgsStr) {
               return eval("${activeQuestion.functionName}" + inputArgsStr);
            }
          `;
          // eslint-disable-next-line no-new-func
          const runTest = new Function(runnerCode)();

          for (let i = 0; i < activeQuestion.testCases.length; i++) {
            const tc = activeQuestion.testCases[i];
            try {
              const actualVal = runTest(tc.input);
              const actualStr = JSON.stringify(actualVal) || 'undefined';
              
              const passed = actualStr.replace(/\\s+/g, '') === tc.expected.replace(/\\s+/g, '');
              if (!passed) allPassed = false;

              results.push({
                index: i + 1,
                passed: passed,
                input: tc.displayInput,
                expected: tc.expected,
                actual: actualStr
              });
            } catch (e) {
              allPassed = false;
              results.push({
                index: i + 1,
                passed: false,
                input: tc.displayInput,
                expected: tc.expected,
                actual: 'Error: ' + e.message
              });
            }
          }
          
          setTestResults(results);
          if (allPassed) {
            toast.success('All Test Cases Passed! 🎉');
            setSuccessParticles(true);
            setTimeout(() => setSuccessParticles(false), 3000);
          } else {
            toast.error('Some test cases failed. Keep trying!');
          }
        } catch (err) {
          toast.error('Syntax Error in your code!');
          setTestResults([{
            index: 1,
            passed: false,
            input: 'Code Compilation',
            expected: 'Valid Code',
            actual: 'Error: ' + err.message
          }]);
        } finally {
          setIsTesting(false);
        }
      }, 200);
    } else if (language === 'java') {
      // Generate Java Wrapper
      let javaCode = code + '\n\npublic class Main {\n  public static void main(String[] args) {\n    Solution sol = new Solution();\n';
      activeQuestion.testCases.forEach((tc, idx) => {
        javaCode += `    try {\n`;
        javaCode += `      Object res = sol.${activeQuestion.functionName}${tc.inputArgsJava};\n`;
        javaCode += `      String out = "";\n`;
        javaCode += `      if (res instanceof int[]) out = java.util.Arrays.toString((int[])res);\n`;
        javaCode += `      else if (res instanceof char[]) { out = "["; for(int i=0;i<((char[])res).length;i++) out += "\\"" + ((char[])res)[i] + "\\"" + (i<((char[])res).length-1?",":""); out += "]"; }\n`;
        javaCode += `      else out = String.valueOf(res);\n`;
        javaCode += `      System.out.println("TEST_RES:${idx}:" + out);\n`;
        javaCode += `    } catch (Exception e) { System.out.println("TEST_ERR:${idx}:" + e.getMessage()); }\n`;
      });
      javaCode += '  }\n}';

      try {
        const response = await fetch('http://localhost:8080/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: 'java', code: javaCode })
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();
        
        if (!data.success && !(data.output && data.output.includes('TEST_RES:'))) {
           setTestResults([{ index: 1, passed: false, input: 'Compilation', expected: 'Success', actual: data.error || data.output }]);
           toast.error('Compilation Error!');
        } else {
           const results = [];
           let allPassed = true;
           const outLines = (data.output || '').split('\n');
           
           for (let i = 0; i < activeQuestion.testCases.length; i++) {
             const tc = activeQuestion.testCases[i];
             const resLine = outLines.find(l => l.startsWith(`TEST_RES:${i}:`));
             const errLine = outLines.find(l => l.startsWith(`TEST_ERR:${i}:`));
             
             if (resLine) {
               const actualStr = resLine.substring(`TEST_RES:${i}:`.length).trim();
               const passed = actualStr.replace(/\\s+/g, '') === tc.expected.replace(/\\s+/g, '');
               if (!passed) allPassed = false;
               results.push({ index: i + 1, passed: passed, input: tc.displayInput, expected: tc.expected, actual: actualStr });
             } else if (errLine) {
               allPassed = false;
               results.push({ index: i + 1, passed: false, input: tc.displayInput, expected: tc.expected, actual: errLine.substring(`TEST_ERR:${i}:`.length) });
             } else {
               allPassed = false;
               results.push({ index: i + 1, passed: false, input: tc.displayInput, expected: tc.expected, actual: 'No Output' });
             }
           }
           setTestResults(results);
           if (allPassed && results.length > 0) {
             toast.success('All Test Cases Passed! 🎉');
             setSuccessParticles(true);
             setTimeout(() => setSuccessParticles(false), 3000);
           } else {
             toast.error('Some test cases failed. Keep trying!');
           }
        }
      } catch (error) {
        toast.error('Failed to connect to backend');
        setTestResults([{ index: 1, passed: false, input: 'Connection', expected: 'Success', actual: error.message }]);
      } finally {
        setIsTesting(false);
      }
    }
  };

  return (
    <div className="main-content responsive-padding-mobile" style={{ padding: 'clamp(1rem, 3vw, 2rem)', marginTop: '20px' }}>
      <style>{`
        .vis-node { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .vis-link { transition: stroke 0.4s ease, stroke-width 0.4s ease; }
      `}</style>
      
      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="heading-gradient" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>Coding Playground</h1>
          <p style={{ color: 'var(--text-muted)' }}>Write, test, and submit your code against automated test cases.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
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
        
        <div style={{ flex: '0.5', minWidth: '120px' }}>
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
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.8rem', flex: '2', minWidth: '350px' }}>
          <button 
            className="btn-primary" 
            onClick={executeCode} 
            disabled={isRunning || isTesting || isAskingAI}
            style={{ flex: 1, height: '48px', background: 'rgba(255,255,255,0.1)' }}
          >
            {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
            Run Code
          </button>

          <button 
            onClick={submitCode} 
            disabled={isRunning || isTesting || isAskingAI}
            style={{ 
              flex: 1.5, 
              height: '48px',
              background: '#10b981',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            {isTesting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            Submit Code
          </button>
          
          <button 
            onClick={handleAskAI}
            disabled={isRunning || isTesting || isAskingAI}
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
            disabled={isRunning || isTesting}
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
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={18} />
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
           <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Code Editor</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auto-save enabled</span>
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
                fontSize: 15,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                fontLigatures: true,
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
          {[...Array(60)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '8px', height: '8px',
              background: ['#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
              borderRadius: '50%',
              boxShadow: '0 0 12px currentColor',
              animation: `particleExplode 1.2s ease-out forwards`,
              transform: `rotate(${Math.random() * 360}deg) translate(${50 + Math.random() * 400}px)`,
              opacity: 0
            }}></div>
          ))}
          <style>{`
            @keyframes particleExplode {
              0% { opacity: 1; transform: scale(1) translate(0,0); }
              100% { opacity: 0; transform: scale(0) translate(${Math.random() * 800 - 400}px, ${Math.random() * 800 - 400}px); }
            }
          `}</style>
        </div>
      )}

      {/* Bottom Output / Drawer */}
      <div style={{
        position: 'fixed',
        bottom: showTerminal ? '0' : '-500px',
        left: '80px',
        right: '0',
        height: '450px',
        background: 'rgba(10, 10, 15, 0.98)',
        borderTop: '2px solid rgba(59, 130, 246, 0.5)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.8), inset 0 20px 40px rgba(59, 130, 246, 0.05)',
        transition: 'bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Drawer Header */}
        <div style={{ padding: '10px 20px', background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setActiveTab('terminal')}
              style={{
                background: activeTab === 'terminal' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: activeTab === 'terminal' ? '#3b82f6' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}
            >
              <TerminalSquare size={16} /> OUTPUT TERMINAL
            </button>
            <button 
              onClick={() => setActiveTab('tests')}
              style={{
                background: activeTab === 'tests' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: activeTab === 'tests' ? '#10b981' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}
            >
              <FlaskConical size={16} /> TEST RESULTS
            </button>
            <button 
              onClick={() => setActiveTab('graph')}
              style={{
                background: activeTab === 'graph' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: activeTab === 'graph' ? '#a855f7' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}
            >
              <GitBranch size={16} /> GRAPH VIEW
            </button>
          </div>

          <button onClick={() => setShowTerminal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <ChevronDown size={20} />
          </button>
        </div>
        
        {/* Drawer Body */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          
          {/* Terminal Tab */}
          <div style={{ 
            display: activeTab === 'terminal' ? 'block' : 'none', 
            height: '100%', 
            padding: '20px', 
            overflowY: 'auto', 
            fontFamily: '"Fira Code", monospace', 
            fontSize: '0.9rem', 
            color: '#a78bfa' 
          }}>
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

          {/* Tests Tab */}
          <div style={{ 
            display: activeTab === 'tests' ? 'block' : 'none', 
            height: '100%', 
            padding: '20px', 
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.3)'
          }}>
            {testResults.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
                <FlaskConical size={48} opacity={0.2} style={{ marginBottom: '10px' }} />
                <p>No test results to show.</p>
                <p style={{ fontSize: '0.8rem' }}>Click "Submit Code" to run the automated tests.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {testResults.map((tr, idx) => (
                  <div key={idx} style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    border: `1px solid ${tr.passed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    borderRadius: '8px',
                    padding: '15px',
                    borderLeft: `4px solid ${tr.passed ? '#10b981' : '#ef4444'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      {tr.passed ? <CheckCircle color="#10b981" size={20} /> : <XCircle color="#ef4444" size={20} />}
                      <h4 style={{ margin: 0, color: tr.passed ? '#10b981' : '#ef4444' }}>Test Case {tr.index}</h4>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Input</span>
                        <div style={{ fontFamily: 'monospace', color: '#e2e8f0', marginTop: '5px' }}>{tr.input}</div>
                      </div>
                      
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expected Output</span>
                        <div style={{ fontFamily: 'monospace', color: '#10b981', marginTop: '5px' }}>{tr.expected}</div>
                      </div>
                      
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Output</span>
                        <div style={{ fontFamily: 'monospace', color: tr.passed ? '#10b981' : '#ef4444', marginTop: '5px' }}>{tr.actual}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Graph Tab */}
          <div style={{ 
            display: activeTab === 'graph' ? 'block' : 'none', 
            height: '100%', 
            width: '100%',
            background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
            position: 'relative'
          }}>
            {graphNodes.length === 0 && graphEdges.length === 0 ? (
               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-muted)', textAlign: 'center' }}>
                 <GitBranch size={48} opacity={0.2} style={{ marginBottom: '10px' }} />
                 <p>No graph commands found in output.</p>
                 <p style={{ fontSize: '0.8rem' }}>Use <code>VIS_NODE:id,label,x,y</code> to draw.</p>
               </div>
            ) : (
              <>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                  {graphEdges.map((link, idx) => {
                    const sourceNode = graphNodes.find(n => n.id === link.source);
                    const targetNode = graphNodes.find(n => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;

                    return (
                      <line 
                        key={idx}
                        x1={`${sourceNode.x}%`} 
                        y1={`${sourceNode.y}%`} 
                        x2={`${targetNode.x}%`} 
                        y2={`${targetNode.y}%`} 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth="3"
                        className="vis-link"
                      />
                    );
                  })}
                </svg>

                {graphNodes.map(node => (
                  <div 
                    key={node.id}
                    className="vis-node"
                    style={{ 
                      position: 'absolute', 
                      top: `${node.y}%`, 
                      left: `${node.x}%`, 
                      transform: 'translate(-50%, -50%)',
                      width: '60px',
                      height: '60px',
                      background: '#1e293b',
                      border: '2px solid rgba(168, 85, 247, 0.5)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a855f7',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      zIndex: 2,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(168, 85, 247, 0.2)'
                    }}
                  >
                    {node.label}
                  </div>
                ))}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
