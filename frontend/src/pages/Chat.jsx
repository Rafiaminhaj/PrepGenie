import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: (
      <div>
        Hello! I am your <strong>PrepGenie</strong>. How can I help you prepare today?
      </div>
    ) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
      return (
        <div>
          <p>Hello there! 👋 I'm Genie, your AI Prep Assistant.</p>
          <p style={{ marginTop: '10px' }}>I can help you with:</p>
          <ul style={{ marginLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <li>☕ Java Programming & Concepts</li>
            <li>⚙️ System Design Architecture</li>
            <li>💻 Code Reviews & Optimization</li>
            <li>🤝 HR & Behavioral Preparation</li>
          </ul>
          <p style={{ marginTop: '10px' }}>What would you like to practice today?</p>
        </div>
      );
    }
    
    if (lowerText.includes('java')) {
      return (
        <div>
          <p><strong>Java</strong> is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible.</p>
          <p style={{ marginTop: '10px' }}>Key concepts include:</p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li><strong>OOPs:</strong> Encapsulation, Inheritance, Polymorphism, Abstraction.</li>
            <li><strong>Memory Management:</strong> Automatic Garbage Collection via JVM.</li>
            <li><strong>Platform Independent:</strong> Write Once, Run Anywhere (WORA).</li>
          </ul>
          <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '8px', marginTop: '15px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
            <code style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>
{`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, PrepGenie!");
    }
}`}
            </code>
          </pre>
        </div>
      );
    }
    
    if (lowerText.includes('caching') || lowerText.includes('redis')) {
      return (
        <div>
          <p><strong>Caching</strong> is a technique to store frequently accessed data in a fast, temporary storage layer (like RAM) to reduce latency and database load.</p>
          <p style={{ marginTop: '10px' }}>Popular strategies:</p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li><strong>Cache Aside:</strong> Application checks cache first, then DB if miss.</li>
            <li><strong>Write-Through:</strong> Data is written to DB and cache simultaneously.</li>
          </ul>
          <p style={{ marginTop: '10px' }}>Common tools: <strong>Redis</strong>, <strong>Memcached</strong>.</p>
        </div>
      );
    }

    if (lowerText.includes('load balancer') || lowerText.includes('load balancing')) {
      return (
        <div>
          <p>A <strong>Load Balancer</strong> efficiently distributes incoming network traffic across a group of backend servers.</p>
          <p style={{ marginTop: '10px' }}>Common Algorithms:</p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li><strong>Round Robin:</strong> Requests distributed sequentially.</li>
            <li><strong>Least Connections:</strong> Sent to server with fewest active connections.</li>
            <li><strong>IP Hash:</strong> Determines server based on client IP.</li>
          </ul>
        </div>
      );
    }

    if (lowerText.includes('multithreading') || lowerText.includes('thread')) {
      return (
        <div>
          <p><strong>Multithreading</strong> allows concurrent execution of two or more parts of a program for maximum utilization of CPU.</p>
          <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '8px', marginTop: '15px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
            <code style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>
{`class MyThread extends Thread {
    public void run() {
        System.out.println("Thread is running");
    }
}

// Usage:
MyThread t1 = new MyThread();
t1.start();`}
            </code>
          </pre>
        </div>
      );
    }

    // Default response
    return (
      <div>
        <p>That's an interesting question about <strong>"{text}"</strong>.</p>
        <p style={{ marginTop: '10px' }}>However, my mock brain is currently tuned for specific topics. Try asking me about:</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(168,85,247,0.2)', padding: '5px 12px', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(168,85,247,0.4)' }}>Java</span>
          <span style={{ background: 'rgba(99,102,241,0.2)', padding: '5px 12px', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(99,102,241,0.4)' }}>Caching</span>
          <span style={{ background: 'rgba(16,185,129,0.2)', padding: '5px 12px', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(16,185,129,0.4)' }}>Load Balancer</span>
          <span style={{ background: 'rgba(245,158,11,0.2)', padding: '5px 12px', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(245,158,11,0.4)' }}>Multithreading</span>
        </div>
      </div>
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input.trim();
    // Wrap user string in simple div for structural consistency
    const userMessage = { role: 'user', content: <div>{userMessageText}</div> };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Mock AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: generateAIResponse(userMessageText) }
      ]);
      
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: <div>Oops! I'm having trouble connecting to my AI brain right now.</div> }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '0' }}>
      <Navbar />
      
      <style>{`
        .dot-typing {
          animation: dotFlash 1.4s infinite linear;
          display: inline-block;
          font-size: 20px;
          line-height: 10px;
        }
        @keyframes dotFlash {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRadius: '16px 16px 0 0', border: '1px solid var(--border)', borderBottom: 'none', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '10px', borderRadius: '50%' }}>
            <Sparkles color="#6366f1" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Genie Assistant</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Online & Ready</span>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '15px',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}>
              <div style={{
                background: msg.role === 'user' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                padding: '10px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.role === 'user' ? <User size={20} color="#a855f7" /> : <Bot size={20} color="#6366f1" />}
              </div>
              <div style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255, 255, 255, 0.05)',
                padding: '15px 20px',
                borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                maxWidth: '70%',
                color: 'white',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                lineHeight: '1.5'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '50%' }}>
                <Bot size={20} color="#6366f1" />
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '15px 20px',
                borderRadius: '20px 20px 20px 0',
                border: '1px solid var(--border)',
                display: 'flex',
                gap: '5px'
              }}>
                <span className="dot-typing" style={{ animationDelay: '0s' }}>.</span>
                <span className="dot-typing" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="dot-typing" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Genie anything (try 'java' or 'caching')..."
              className="input-field"
              style={{ borderRadius: '24px', padding: '15px 20px' }}
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: '54px', height: '54px', padding: '0', flexShrink: 0 }}>
              <Send size={20} style={{ marginLeft: '-2px' }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
