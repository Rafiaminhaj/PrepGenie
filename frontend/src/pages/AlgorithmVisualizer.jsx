import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Layers, Code as CodeIcon, GitBranch, Terminal, Code2 } from 'lucide-react';
import { Editor } from '@monaco-editor/react';

const algorithms = {
  inorder: {
    id: 'inorder',
    name: 'Inorder Traversal',
    code: `const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

function inorderTraversal(node) {
  if (node === null) return;
  inorderTraversal(node.left);
  console.log(node.val);
  inorderTraversal(node.right);
}

inorderTraversal(root);`,
    trace: [
      { line: 14, text: 'Calling inorderTraversal(1)', nodeFocus: 1 },
      { line: 7, text: 'Enter inorderTraversal(1)', nodeFocus: 1 },
      { line: 8, text: 'node (1) is not null', nodeFocus: 1 },
      { line: 9, text: 'Calling inorderTraversal(1.left -> 2)', nodeFocus: 1 },
      { line: 7, text: 'Enter inorderTraversal(2)', nodeFocus: 2 },
      { line: 8, text: 'node (2) is not null', nodeFocus: 2 },
      { line: 9, text: 'Calling inorderTraversal(2.left -> 4)', nodeFocus: 2 },
      { line: 7, text: 'Enter inorderTraversal(4)', nodeFocus: 4 },
      { line: 8, text: 'node (4) is not null', nodeFocus: 4 },
      { line: 9, text: 'Calling inorderTraversal(4.left -> null)', nodeFocus: 4 },
      { line: 7, text: 'Enter inorderTraversal(null)', nodeFocus: null },
      { line: 8, text: 'node is null, return', nodeFocus: null },
      { line: 10, text: 'Back to inorderTraversal(4), print 4', nodeFocus: 4, print: 4 },
      { line: 11, text: 'Calling inorderTraversal(4.right -> null)', nodeFocus: 4 },
      { line: 7, text: 'Enter inorderTraversal(null)', nodeFocus: null },
      { line: 8, text: 'node is null, return', nodeFocus: null },
      { line: 12, text: 'Finished inorderTraversal(4)', nodeFocus: 4 },
      { line: 10, text: 'Back to inorderTraversal(2), print 2', nodeFocus: 2, print: 2 },
      { line: 11, text: 'Calling inorderTraversal(2.right -> 5)', nodeFocus: 2 },
      { line: 7, text: 'Enter inorderTraversal(5)', nodeFocus: 5 },
      { line: 8, text: 'node (5) is not null', nodeFocus: 5 },
      { line: 9, text: 'Calling inorderTraversal(5.left -> null)', nodeFocus: 5 },
      { line: 7, text: 'Enter inorderTraversal(null)', nodeFocus: null },
      { line: 8, text: 'node is null, return', nodeFocus: null },
      { line: 10, text: 'Back to inorderTraversal(5), print 5', nodeFocus: 5, print: 5 },
      { line: 11, text: 'Calling inorderTraversal(5.right -> null)', nodeFocus: 5 },
      { line: 7, text: 'Enter inorderTraversal(null)', nodeFocus: null },
      { line: 8, text: 'node is null, return', nodeFocus: null },
      { line: 12, text: 'Finished inorderTraversal(5)', nodeFocus: 5 },
      { line: 12, text: 'Finished inorderTraversal(2)', nodeFocus: 2 },
      { line: 10, text: 'Back to inorderTraversal(1), print 1', nodeFocus: 1, print: 1 },
      { line: 11, text: 'Calling inorderTraversal(1.right -> 3)', nodeFocus: 1 },
      { line: 7, text: 'Enter inorderTraversal(3)', nodeFocus: 3 },
      { line: 8, text: 'node (3) is not null', nodeFocus: 3 },
      { line: 9, text: 'Calling inorderTraversal(3.left -> null)', nodeFocus: 3 },
      { line: 7, text: 'Enter inorderTraversal(null)', nodeFocus: null },
      { line: 8, text: 'node is null, return', nodeFocus: null },
      { line: 10, text: 'Back to inorderTraversal(3), print 3', nodeFocus: 3, print: 3 },
      { line: 11, text: 'Calling inorderTraversal(3.right -> null)', nodeFocus: 3 },
      { line: 7, text: 'Enter inorderTraversal(null)', nodeFocus: null },
      { line: 8, text: 'node is null, return', nodeFocus: null },
      { line: 12, text: 'Finished inorderTraversal(3)', nodeFocus: 3 },
      { line: 12, text: 'Finished inorderTraversal(1)', nodeFocus: 1 },
      { line: 14, text: 'Execution Complete!', nodeFocus: null }
    ],
    tree: {
      nodes: [
        { id: 1, val: 1, x: 50, y: 15 },
        { id: 2, val: 2, x: 25, y: 40 },
        { id: 3, val: 3, x: 75, y: 40 },
        { id: 4, val: 4, x: 10, y: 70 },
        { id: 5, val: 5, x: 40, y: 70 },
      ],
      links: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 2, target: 5 },
      ]
    }
  },
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci',
    code: `function fib(n) {
  // Base cases
  if (n <= 1) return n;
  
  // Recursive case
  return fib(n - 1) + fib(n - 2);
}

const result = fib(3);`,
    trace: [
      { line: 9, text: 'Calling fib(3)', nodeFocus: 'fib(3)' },
      { line: 1, text: 'Enter fib(3)', nodeFocus: 'fib(3)' },
      { line: 3, text: 'n (3) is not <= 1', nodeFocus: 'fib(3)' },
      { line: 6, text: 'Need to compute fib(2) + fib(1)', nodeFocus: 'fib(3)' },
      { line: 1, text: 'Enter fib(2)', nodeFocus: 'fib(2)' },
      { line: 3, text: 'n (2) is not <= 1', nodeFocus: 'fib(2)' },
      { line: 6, text: 'Need to compute fib(1) + fib(0)', nodeFocus: 'fib(2)' },
      { line: 1, text: 'Enter fib(1)', nodeFocus: 'fib(1)' },
      { line: 3, text: 'n (1) <= 1, return 1', nodeFocus: 'fib(1)', result: 1 },
      { line: 6, text: 'Back to fib(2), now need fib(0)', nodeFocus: 'fib(2)' },
      { line: 1, text: 'Enter fib(0)', nodeFocus: 'fib(0)' },
      { line: 3, text: 'n (0) <= 1, return 0', nodeFocus: 'fib(0)', result: 0 },
      { line: 6, text: 'Back to fib(2), return 1 + 0 = 1', nodeFocus: 'fib(2)', result: 1 },
      { line: 6, text: 'Back to fib(3), now need fib(1)', nodeFocus: 'fib(3)' },
      { line: 1, text: 'Enter fib(1)_right', nodeFocus: 'fib(1)_right' },
      { line: 3, text: 'n (1) <= 1, return 1', nodeFocus: 'fib(1)_right', result: 1 },
      { line: 6, text: 'Back to fib(3), return 1 + 1 = 2', nodeFocus: 'fib(3)', result: 2 },
      { line: 9, text: 'Execution Complete! result = 2', nodeFocus: null }
    ],
    tree: {
      nodes: [
        { id: 'fib(3)', val: 'fib(3)', x: 50, y: 15 },
        { id: 'fib(2)', val: 'fib(2)', x: 30, y: 40 },
        { id: 'fib(1)_right', val: 'fib(1)', x: 70, y: 40 },
        { id: 'fib(1)', val: 'fib(1)', x: 15, y: 70 },
        { id: 'fib(0)', val: 'fib(0)', x: 45, y: 70 },
      ],
      links: [
        { source: 'fib(3)', target: 'fib(2)' },
        { source: 'fib(3)', target: 'fib(1)_right' },
        { source: 'fib(2)', target: 'fib(1)' },
        { source: 'fib(2)', target: 'fib(0)' },
      ]
    }
  },
  sandbox: {
    id: 'sandbox',
    name: 'Custom Sandbox',
    code: `// Write your own algorithm and draw it!
// Use the Visualizer API:
// Visualizer.addNode(id, label, x%, y%)
// Visualizer.addEdge(sourceId, targetId)
// Visualizer.highlightNode(id)
// Visualizer.print(text)
// await Visualizer.sleep(ms)

async function run() {
  Visualizer.print("Starting Custom Graph...");
  
  Visualizer.addNode(1, "Root", 50, 20);
  await Visualizer.sleep(800);
  
  Visualizer.addNode(2, "Left", 30, 50);
  Visualizer.addEdge(1, 2);
  Visualizer.highlightNode(2);
  Visualizer.print("Traversing left...");
  await Visualizer.sleep(800);
  
  Visualizer.addNode(3, "Right", 70, 50);
  Visualizer.addEdge(1, 3);
  Visualizer.highlightNode(3);
  Visualizer.print("Traversing right...");
  await Visualizer.sleep(800);
  
  Visualizer.highlightNode(1);
  Visualizer.print("Done!");
}

run();`
  }
};

export default function AlgorithmVisualizer() {
  const [activeAlgo, setActiveAlgo] = useState(algorithms.inorder);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Custom Sandbox State
  const [sandboxCode, setSandboxCode] = useState(algorithms.sandbox.code);
  const [sandboxNodes, setSandboxNodes] = useState([]);
  const [sandboxLinks, setSandboxLinks] = useState([]);
  const [sandboxLogs, setSandboxLogs] = useState([]);
  const [sandboxActiveNode, setSandboxActiveNode] = useState(null);
  const [sandboxStatus, setSandboxStatus] = useState("Ready");
  const [isRunningSandbox, setIsRunningSandbox] = useState(false);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [decorations, setDecorations] = useState([]);

  const isSandbox = activeAlgo.id === 'sandbox';

  // Computed variables for fixed algorithms
  const trace = isSandbox ? [] : activeAlgo.trace;
  const currentStep = isSandbox ? null : trace[stepIndex];
  
  useEffect(() => {
    let interval;
    if (isPlaying && !isSandbox) {
      interval = setInterval(() => {
        setStepIndex((prev) => {
          if (prev < trace.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSandbox, trace.length]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    if (!isSandbox) {
      highlightLine(currentStep.line);
    }
  };

  useEffect(() => {
    if (!isSandbox && currentStep) {
      highlightLine(currentStep.line);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, activeAlgo, isSandbox]);

  const highlightLine = (lineNumber) => {
    if (!editorRef.current || !monacoRef.current) return;
    const newDecorations = editorRef.current.deltaDecorations(decorations, [
      {
        range: new monacoRef.current.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'active-line-highlight',
          glyphMarginClassName: 'active-line-glyph'
        }
      }
    ]);
    setDecorations(newDecorations);
    editorRef.current.revealLineInCenter(lineNumber);
  };

  const clearHighlight = () => {
    if (!editorRef.current || !monacoRef.current) return;
    const newDecorations = editorRef.current.deltaDecorations(decorations, []);
    setDecorations(newDecorations);
  };

  // Switch tabs
  const handleAlgoSwitch = (algo) => {
    setActiveAlgo(algo);
    setIsPlaying(false);
    if (algo.id === 'sandbox') {
      clearHighlight();
    } else {
      setStepIndex(0);
    }
  };

  // Fixed algorithms output
  const getPrintedOutput = () => {
    if (isSandbox) return [];
    const outputs = [];
    for (let i = 0; i <= stepIndex; i++) {
      if (trace[i].print !== undefined) outputs.push(trace[i].print);
    }
    return outputs;
  };

  const getComputedResults = () => {
    if (isSandbox) return {};
    const results = {};
    for (let i = 0; i <= stepIndex; i++) {
      if (trace[i].result !== undefined && trace[i].nodeFocus) {
        results[trace[i].nodeFocus] = trace[i].result;
      }
    }
    return results;
  };
  
  const computedResults = getComputedResults();

  // Run Sandbox Code
  const runSandboxCode = async () => {
    setIsRunningSandbox(true);
    setSandboxNodes([]);
    setSandboxLinks([]);
    setSandboxLogs([]);
    setSandboxActiveNode(null);
    setSandboxStatus("Running...");

    // Create a safe visualizer API
    const Visualizer = {
      addNode: (id, val, x, y) => {
        setSandboxNodes(prev => [...prev.filter(n => n.id !== id), { id, val, x, y }]);
      },
      addEdge: (source, target) => {
        setSandboxLinks(prev => [...prev, { source, target }]);
      },
      highlightNode: (id) => {
        setSandboxActiveNode(id);
      },
      print: (text) => {
        setSandboxLogs(prev => [...prev, text]);
      },
      sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms))
    };

    try {
      // AsyncFunction constructor
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const executable = new AsyncFunction('Visualizer', sandboxCode);
      await executable(Visualizer);
      setSandboxStatus("Execution Complete!");
    } catch (err) {
      console.error(err);
      Visualizer.print(`Error: ${err.message}`);
      setSandboxStatus("Error occurred!");
    } finally {
      setIsRunningSandbox(false);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ paddingBottom: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <style>{`
        .active-line-highlight {
          background: rgba(16, 185, 129, 0.3);
          border-left: 4px solid #10b981;
        }
        .active-line-glyph {
          background: #10b981;
          border-radius: 50%;
          width: 8px !important;
          height: 8px !important;
          margin-left: 5px;
          margin-top: 5px;
        }
        .vis-node {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .vis-node.active {
          transform: translate(-50%, -50%) scale(1.3) !important;
          box-shadow: 0 0 30px rgba(56, 189, 248, 0.8), inset 0 0 15px rgba(255,255,255,0.5) !important;
          border-color: #38bdf8 !important;
          background: #0ea5e9 !important;
          color: #fff !important;
          z-index: 20 !important;
        }
        .vis-link {
          transition: stroke 0.4s ease, stroke-width 0.4s ease;
        }
        .vis-link.active {
          stroke: #38bdf8 !important;
          stroke-width: 4px !important;
          filter: drop-shadow(0 0 8px #38bdf8);
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, padding: '2rem 5%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="heading-gradient" style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', fontWeight: '800' }}>
              Algorithm Visualizer
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>See exactly how algorithms execute line-by-line.</p>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            {Object.values(algorithms).map(algo => (
              <button
                key={algo.id}
                onClick={() => handleAlgoSwitch(algo)}
                className="btn-primary hover-glow"
                style={{
                  background: activeAlgo.id === algo.id ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${activeAlgo.id === algo.id ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: activeAlgo.id === algo.id ? '#fff' : 'var(--text-muted)'
                }}
              >
                {algo.id === 'sandbox' ? <Code2 size={18} color={activeAlgo.id === algo.id ? '#10b981' : 'currentColor'} /> : <Layers size={18} color={activeAlgo.id === algo.id ? '#10b981' : 'currentColor'} />} 
                {algo.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1 }}>
          
          {/* Left Column: Code Editor */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CodeIcon size={20} color="#10b981" />
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{isSandbox ? 'Live Editor' : 'Execution Trace'}</span>
              </div>
              {isSandbox && (
                <button 
                  onClick={runSandboxCode}
                  disabled={isRunningSandbox}
                  className="hover-glow"
                  style={{ background: '#10b981', color: '#000', border: 'none', padding: '6px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: isRunningSandbox ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Play size={16} fill="currentColor" /> {isRunningSandbox ? 'Running...' : 'Run Code'}
                </button>
              )}
            </div>
            
            <div style={{ flex: 1, position: 'relative' }}>
              <Editor
                key={isSandbox ? 'sandbox' : 'readonly'}
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={isSandbox ? sandboxCode : activeAlgo.code}
                onChange={(val) => {
                  if (isSandbox) setSandboxCode(val);
                }}
                options={{
                  readOnly: !isSandbox,
                  minimap: { enabled: false },
                  fontSize: 16,
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                  lineHeight: 28,
                  scrollBeyondLastLine: false,
                  glyphMargin: !isSandbox,
                  padding: { top: 20 },
                  renderLineHighlight: isSandbox ? "all" : "none"
                }}
                onMount={handleEditorDidMount}
              />
            </div>
            
            {/* Terminal Output */}
            <div style={{ height: '120px', background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '15px', fontFamily: 'monospace', overflowY: 'auto' }}>
              <div style={{ color: '#8b949e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Terminal size={14} /> Console Output</div>
              <div style={{ color: '#10b981', fontSize: '1.1rem' }}>
                {isSandbox ? (
                  sandboxLogs.map((log, i) => <div key={i}>{log}</div>)
                ) : (
                  <>
                    {activeAlgo.id === 'inorder' ? getPrintedOutput().join(' ') : (stepIndex === trace.length - 1 ? 'Result: ' + computedResults['fib(3)'] : '')}
                  </>
                )}
                {!isRunningSandbox && <span className="blink">_</span>}
              </div>
            </div>
          </div>

          {/* Right Column: Visualization Canvas */}
          <div className="glass-panel premium-3d" style={{ display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(56, 189, 248, 0.1)' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GitBranch size={20} color="#38bdf8" />
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Call Stack & Data Structure</span>
              </div>
              <div style={{ color: '#38bdf8', fontSize: '0.9rem', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 12px', borderRadius: '12px' }}>
                {isSandbox ? "Sandbox Mode" : `Step ${stepIndex + 1} of ${trace.length}`}
              </div>
            </div>
            
            <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)', overflow: 'hidden' }}>
              
              {/* Status Banner */}
              <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '10px 25px', borderRadius: '20px', color: '#fff', zIndex: 10, textAlign: 'center', minWidth: '300px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {isSandbox ? sandboxStatus : currentStep?.text}
              </div>

              {/* Tree Canvas */}
              <div style={{ width: '100%', height: '100%', position: 'relative', marginTop: '20px' }}>
                
                {/* Lines */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                  {(isSandbox ? sandboxLinks : activeAlgo.tree.links).map((link, idx) => {
                    const nodesArray = isSandbox ? sandboxNodes : activeAlgo.tree.nodes;
                    const sourceNode = nodesArray.find(n => n.id === link.source);
                    const targetNode = nodesArray.find(n => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;

                    const isActiveLink = isSandbox ? sandboxActiveNode === targetNode.id : currentStep?.nodeFocus === targetNode.id;

                    return (
                      <line 
                        key={idx}
                        x1={`${sourceNode.x}%`} 
                        y1={`${sourceNode.y}%`} 
                        x2={`${targetNode.x}%`} 
                        y2={`${targetNode.y}%`} 
                        stroke="rgba(255,255,255,0.15)" 
                        strokeWidth="2"
                        className={`vis-link ${isActiveLink ? 'active' : ''}`}
                      />
                    );
                  })}
                </svg>

                {/* Nodes */}
                {(isSandbox ? sandboxNodes : activeAlgo.tree.nodes).map(node => {
                  const isActive = isSandbox ? sandboxActiveNode === node.id : currentStep?.nodeFocus === node.id;
                  const computedVal = isSandbox ? undefined : computedResults[node.id];
                  
                  return (
                    <div 
                      key={node.id}
                      className={`vis-node ${isActive ? 'active' : ''}`}
                      style={{ 
                        position: 'absolute', 
                        top: `${node.y}%`, 
                        left: `${node.x}%`, 
                        transform: 'translate(-50%, -50%)',
                        width: '50px',
                        height: '50px',
                        background: '#1e293b',
                        border: '2px solid rgba(255,255,255,0.2)',
                        borderRadius: activeAlgo.id === 'fibonacci' && !isSandbox ? '12px' : '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        zIndex: 2,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        flexDirection: 'column'
                      }}
                    >
                      <span>{node.val}</span>
                      {computedVal !== undefined && (
                        <div style={{ position: 'absolute', bottom: '-25px', fontSize: '0.8rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '8px', border: '1px solid #10b981', whiteSpace: 'nowrap' }}>
                          ret: {computedVal}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls (Only show in fixed modes) */}
            {!isSandbox && (
              <div style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button 
                  onClick={() => setStepIndex(0)} 
                  className="hover-glow"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '10px' }}
                  title="Reset"
                >
                  <RefreshCw size={24} />
                </button>
                
                <button 
                  onClick={() => { setIsPlaying(false); setStepIndex(p => Math.max(0, p - 1)) }} 
                  className="hover-glow"
                  disabled={stepIndex === 0}
                  style={{ background: 'transparent', border: 'none', color: stepIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: stepIndex === 0 ? 'not-allowed' : 'pointer', padding: '10px' }}
                >
                  <SkipBack size={24} />
                </button>
                
                <button 
                  onClick={() => {
                    if (stepIndex === trace.length - 1) setStepIndex(0);
                    setIsPlaying(!isPlaying);
                  }} 
                  style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', color: '#fff', cursor: 'pointer', padding: '15px', borderRadius: '50%', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(1.1)' }}
                  className="hover-glow"
                >
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />}
                </button>
                
                <button 
                  onClick={() => { setIsPlaying(false); setStepIndex(p => Math.min(trace.length - 1, p + 1)) }} 
                  className="hover-glow"
                  disabled={stepIndex === trace.length - 1}
                  style={{ background: 'transparent', border: 'none', color: stepIndex === trace.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: stepIndex === trace.length - 1 ? 'not-allowed' : 'pointer', padding: '10px' }}
                >
                  <SkipForward size={24} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
