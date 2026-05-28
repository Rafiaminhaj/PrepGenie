import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Server, Database, Globe, Layers, Cpu, Sparkles, X, CheckCircle2, AlertTriangle, Network, Zap, HardDrive, Cloud, Users, Activity, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import CertificateModal from '../components/CertificateModal';

const NODE_TYPES = [
  { type: 'Client / Users', icon: <Users size={20} />, color: '#3b82f6' },
  { type: 'API Gateway', icon: <Network size={20} />, color: '#ec4899' },
  { type: 'Load Balancer', icon: <Layers size={20} />, color: '#8b5cf6' },
  { type: 'App Server', icon: <Server size={20} />, color: '#10b981' },
  { type: 'Message Queue', icon: <Zap size={20} />, color: '#eab308' },
  { type: 'Database', icon: <Database size={20} />, color: '#f59e0b' },
  { type: 'Cache', icon: <Cpu size={20} />, color: '#ef4444' },
  { type: 'Object Storage', icon: <HardDrive size={20} />, color: '#14b8a6' },
  { type: 'CDN', icon: <Cloud size={20} />, color: '#0ea5e9' },
];

const COMPONENT_INFO = {
  'API Gateway': {
    title: 'API Gateway',
    color: '#06b6d4',
    icon: <Network size={36} color="#06b6d4" />,
    description: 'The single entry point that handles routing, authentication, and rate-limiting for your microservices.',
    visualLayout: (
      <>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 60%)', animation: 'pulse 3s infinite' }}></div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: '#3b82f6', padding: '15px', borderRadius: '50%', display: 'inline-flex', marginBottom: '10px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
              <Globe size={30} color="#fff" />
            </div>
            <div style={{ fontWeight: '600', color: '#e2e8f0' }}>User Client</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, borderRadius: '2px' }}>
            <div style={{ position: 'absolute', top: '-4px', left: 0, width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', animation: 'slideRightFlow 2s infinite linear', boxShadow: '0 0 10px #3b82f6' }}></div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '130px' }}>
            <div style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', padding: '20px', borderRadius: '16px', display: 'inline-flex', marginBottom: '10px', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 25px rgba(6, 182, 212, 0.6)' }}>
              <Network size={45} color="#fff" />
            </div>
            <div style={{ fontWeight: '700', color: '#06b6d4', fontSize: '1.1rem', letterSpacing: '1px' }}>API Gateway</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Auth • Routing • Rate Limit</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative', zIndex: 1 }}>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
              <div style={{ position: 'absolute', top: '-3px', left: 0, width: '9px', height: '9px', background: '#10b981', borderRadius: '50%', animation: 'slideRightFlow 2s infinite linear 0.2s', boxShadow: '0 0 10px #10b981' }}></div>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
              <div style={{ position: 'absolute', top: '-3px', left: 0, width: '9px', height: '9px', background: '#f59e0b', borderRadius: '50%', animation: 'slideRightFlow 2.5s infinite linear 0.5s', boxShadow: '0 0 10px #f59e0b' }}></div>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
              <div style={{ position: 'absolute', top: '-3px', left: 0, width: '9px', height: '9px', background: '#8b5cf6', borderRadius: '50%', animation: 'slideRightFlow 1.8s infinite linear 0.8s', boxShadow: '0 0 10px #8b5cf6' }}></div>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 1, minWidth: '140px' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', padding: '12px 15px', borderRadius: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={16} color="#10b981" /> Auth Service
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)', padding: '12px 15px', borderRadius: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={16} color="#f59e0b" /> User Service
            </div>
            <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.4)', padding: '12px 15px', borderRadius: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} color="#8b5cf6" /> Payment DB
            </div>
        </div>
      </>
    )
  },
  'Load Balancer': {
    title: 'Load Balancer',
    color: '#8b5cf6',
    icon: <Layers size={36} color="#8b5cf6" />,
    description: 'Distributes incoming network traffic across multiple servers to prevent overload and ensure high availability.',
    visualLayout: (
      <>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)', animation: 'pulse 3s infinite' }}></div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: '#3b82f6', padding: '15px', borderRadius: '50%', display: 'inline-flex', marginBottom: '10px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
              <Globe size={30} color="#fff" />
            </div>
            <div style={{ fontWeight: '600', color: '#e2e8f0' }}>Traffic</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, borderRadius: '2px' }}>
            <div style={{ position: 'absolute', top: '-4px', left: 0, width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', animation: 'slideRightFlow 2s infinite linear', boxShadow: '0 0 10px #3b82f6' }}></div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '130px' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #c084fc)', padding: '20px', borderRadius: '16px', display: 'inline-flex', marginBottom: '10px', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)' }}>
              <Layers size={45} color="#fff" />
            </div>
            <div style={{ fontWeight: '700', color: '#8b5cf6', fontSize: '1.1rem', letterSpacing: '1px' }}>Load Balancer</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative', zIndex: 1 }}>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
              <div style={{ position: 'absolute', top: '-3px', left: 0, width: '9px', height: '9px', background: '#10b981', borderRadius: '50%', animation: 'slideRightFlow 2s infinite linear 0.2s', boxShadow: '0 0 10px #10b981' }}></div>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
              <div style={{ position: 'absolute', top: '-3px', left: 0, width: '9px', height: '9px', background: '#10b981', borderRadius: '50%', animation: 'slideRightFlow 2.5s infinite linear 0.5s', boxShadow: '0 0 10px #10b981' }}></div>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
              <div style={{ position: 'absolute', top: '-3px', left: 0, width: '9px', height: '9px', background: '#10b981', borderRadius: '50%', animation: 'slideRightFlow 1.8s infinite linear 0.8s', boxShadow: '0 0 10px #10b981' }}></div>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 1, minWidth: '140px' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', padding: '12px 15px', borderRadius: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={16} color="#10b981" /> Server Pool A
            </div>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', padding: '12px 15px', borderRadius: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={16} color="#10b981" /> Server Pool B
            </div>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', padding: '12px 15px', borderRadius: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={16} color="#10b981" /> Server Pool C
            </div>
        </div>
      </>
    )
  },
  'Cache': {
    title: 'Cache (Redis)',
    color: '#ef4444',
    icon: <Cpu size={36} color="#ef4444" />,
    description: 'Stores frequently accessed data in-memory for sub-millisecond response speeds, bypassing slow database disk I/O.',
    visualLayout: (
      <>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 60%)', animation: 'pulse 3s infinite' }}></div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: '#10b981', padding: '15px', borderRadius: '50%', display: 'inline-flex', marginBottom: '10px', boxShadow: '0 0 20px rgba(16,185,129, 0.4)' }}>
              <Server size={30} color="#fff" />
            </div>
            <div style={{ fontWeight: '600', color: '#e2e8f0' }}>App Service</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, borderRadius: '2px' }}>
            <div style={{ position: 'absolute', top: '-4px', left: 0, width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', animation: 'slideRightFlow 1.5s infinite linear', boxShadow: '0 0 10px #ef4444' }}></div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '130px' }}>
            <div style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', padding: '20px', borderRadius: '16px', display: 'inline-flex', marginBottom: '10px', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)' }}>
              <Cpu size={45} color="#fff" />
            </div>
            <div style={{ fontWeight: '700', color: '#ef4444', fontSize: '1.1rem', letterSpacing: '1px' }}>Redis Cache</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, borderRadius: '2px' }}>
            <div style={{ position: 'absolute', top: '-4px', left: 0, width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%', animation: 'slideRightFlow 3s infinite linear', boxShadow: '0 0 10px #f59e0b' }}></div>
            <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cache Miss</div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: 'rgba(245,158,11,0.2)', border: '2px solid #f59e0b', padding: '15px', borderRadius: '12px', display: 'inline-flex', marginBottom: '10px' }}>
              <Database size={30} color="#f59e0b" />
            </div>
            <div style={{ fontWeight: '600', color: '#f59e0b' }}>Database</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Disk I/O)</div>
        </div>
      </>
    )
  },
  'Database': {
    title: 'Database',
    color: '#f59e0b',
    icon: <Database size={36} color="#f59e0b" />,
    description: 'The persistent storage layer where structured application data is securely saved and queried.',
    visualLayout: (
      <>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 60%)', animation: 'pulse 3s infinite' }}></div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: '#10b981', padding: '15px', borderRadius: '50%', display: 'inline-flex', marginBottom: '10px', boxShadow: '0 0 20px rgba(16,185,129, 0.4)' }}>
              <Server size={30} color="#fff" />
            </div>
            <div style={{ fontWeight: '600', color: '#e2e8f0' }}>App Service</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
              <div style={{ position: 'absolute', top: '-3px', left: 0, width: '9px', height: '9px', background: '#3b82f6', borderRadius: '50%', animation: 'slideRightFlow 2s infinite linear', boxShadow: '0 0 10px #3b82f6' }}></div>
              <div style={{ position: 'absolute', top: '-20px', width: '100%', textAlign: 'center', fontSize: '0.7rem', color: '#3b82f6' }}>READ</div>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
              <div style={{ position: 'absolute', top: '-3px', left: 0, width: '9px', height: '9px', background: '#ef4444', borderRadius: '50%', animation: 'slideRightFlow 2.5s infinite linear 1s', boxShadow: '0 0 10px #ef4444' }}></div>
              <div style={{ position: 'absolute', top: '-20px', width: '100%', textAlign: 'center', fontSize: '0.7rem', color: '#ef4444' }}>WRITE</div>
            </div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '130px' }}>
            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', padding: '20px', borderRadius: '16px', display: 'inline-flex', marginBottom: '10px', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)' }}>
              <Database size={45} color="#fff" />
            </div>
            <div style={{ fontWeight: '700', color: '#f59e0b', fontSize: '1.1rem', letterSpacing: '1px' }}>Master DB</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Persistent Storage</div>
        </div>
      </>
    )
  },
  'CDN': {
    title: 'CDN (Content Delivery Network)',
    color: '#0ea5e9',
    icon: <Cloud size={36} color="#0ea5e9" />,
    description: 'A geographically distributed network of proxy servers designed to provide high availability by distributing assets closer to end users.',
    visualLayout: (
      <>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 60%)', animation: 'pulse 3s infinite' }}></div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: '#3b82f6', padding: '15px', borderRadius: '50%', display: 'inline-flex', marginBottom: '10px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
              <Users size={30} color="#fff" />
            </div>
            <div style={{ fontWeight: '600', color: '#e2e8f0' }}>User</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, borderRadius: '2px' }}>
            <div style={{ position: 'absolute', top: '-4px', left: 0, width: '12px', height: '12px', background: '#0ea5e9', borderRadius: '50%', animation: 'slideRightFlow 1.5s infinite linear', boxShadow: '0 0 10px #0ea5e9' }}></div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '130px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', padding: '20px', borderRadius: '16px', display: 'inline-flex', marginBottom: '10px', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 25px rgba(14, 165, 233, 0.6)' }}>
              <Cloud size={45} color="#fff" />
            </div>
            <div style={{ fontWeight: '700', color: '#0ea5e9', fontSize: '1.1rem', letterSpacing: '1px' }}>Edge Server</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Static Assets</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, borderRadius: '2px' }}>
            <div style={{ position: 'absolute', top: '-4px', left: 0, width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', animation: 'slideRightFlow 3s infinite linear', boxShadow: '0 0 10px #10b981' }}></div>
            <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cache Miss</div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981', padding: '15px', borderRadius: '12px', display: 'inline-flex', marginBottom: '10px' }}>
              <Server size={30} color="#10b981" />
            </div>
            <div style={{ fontWeight: '600', color: '#10b981' }}>Origin</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(App Server)</div>
        </div>
      </>
    )
  },
  'Message Queue': {
    title: 'Message Queue',
    color: '#eab308',
    icon: <Zap size={36} color="#eab308" />,
    description: 'An asynchronous communication service used in microservices architectures to decouple heavyweight processing.',
    visualLayout: (
      <>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 60%)', animation: 'pulse 3s infinite' }}></div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: '#ec4899', padding: '15px', borderRadius: '12px', display: 'inline-flex', marginBottom: '10px', boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' }}>
              <Server size={30} color="#fff" />
            </div>
            <div style={{ fontWeight: '600', color: '#e2e8f0' }}>Producer</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, borderRadius: '2px' }}>
            <div style={{ position: 'absolute', top: '-4px', left: 0, width: '12px', height: '12px', background: '#ec4899', borderRadius: '50%', animation: 'slideRightFlow 2s infinite linear', boxShadow: '0 0 10px #ec4899' }}></div>
            <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Publish</div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '130px' }}>
            <div style={{ background: 'linear-gradient(135deg, #eab308, #facc15)', padding: '20px', borderRadius: '16px', display: 'inline-flex', marginBottom: '10px', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 25px rgba(234, 179, 8, 0.6)' }}>
              <Zap size={45} color="#fff" />
            </div>
            <div style={{ fontWeight: '700', color: '#eab308', fontSize: '1.1rem', letterSpacing: '1px' }}>Kafka Queue</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, borderRadius: '2px' }}>
            <div style={{ position: 'absolute', top: '-4px', left: 0, width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', animation: 'slideRightFlow 2s infinite linear', boxShadow: '0 0 10px #3b82f6' }}></div>
            <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consume</div>
        </div>
        <div style={{ textAlign: 'center', zIndex: 1, minWidth: '100px' }}>
            <div style={{ background: '#3b82f6', padding: '15px', borderRadius: '12px', display: 'inline-flex', marginBottom: '10px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
              <Cpu size={30} color="#fff" />
            </div>
            <div style={{ fontWeight: '600', color: '#e2e8f0' }}>Consumer</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Worker)</div>
        </div>
      </>
    )
  }
};

export default function SystemDesign() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragMoved, setDragMoved] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [activeModalComponent, setActiveModalComponent] = useState(null);
  const canvasRef = useRef(null);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (!type) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes([...nodes, { id: Date.now(), type, x: x - 60, y: y - 30 }]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasMouseMove = (e) => {
    if (draggingNodeId !== null && canvasRef.current) {
      setDragMoved(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setNodes(nodes.map(n => 
        n.id === draggingNodeId 
          ? { ...n, x: x - 60, y: y - 35 } 
          : n
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggingNodeId !== null) {
      setDraggingNodeId(null);
    }
  };

  const handleNodeClick = (e, id, type) => {
    e.stopPropagation();
    if (dragMoved) {
      setDragMoved(false);
      return; // Ignore click if we were dragging
    }

    if (COMPONENT_INFO[type]) {
      setActiveModalComponent(type);
    }

    if (connectingFrom === null) {
      setConnectingFrom(id);
      if (!COMPONENT_INFO[type]) {
         toast('Select another node to connect', { icon: '🔗' });
      }
    } else {
      if (connectingFrom !== id) {
        // Prevent duplicate connections
        const exists = connections.some(c => 
          (c.from === connectingFrom && c.to === id) || 
          (c.from === id && c.to === connectingFrom)
        );
        if (!exists) {
          setConnections([...connections, { from: connectingFrom, to: id }]);
        }
      }
      setConnectingFrom(null);
    }
  };

  const handleCanvasClick = () => {
    if (connectingFrom !== null) {
      setConnectingFrom(null);
    }
  };

  const deleteNode = (e, id) => {
    e.stopPropagation();
    setNodes(nodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
    if (connectingFrom === id) setConnectingFrom(null);
  };

  const analyzeDesign = async () => {
    if (nodes.length === 0) {
      toast.error('Add some components to the canvas first!');
      return;
    }
    
    setIsAnalyzing(true);
    setFeedback(null);
    
    try {
      const { analyzeSystemDesign } = await import('../lib/gemini');
      const aiResponse = await analyzeSystemDesign(nodes, connections);
      setFeedback(aiResponse);
      toast.success('Genie has analyzed your design!');
      
      // XP Reward
      const currentGems = parseInt(localStorage.getItem('gems') || '0', 10);
      localStorage.setItem('gems', currentGems + 40);
    } catch (error) {
      console.error(error);
      toast.error('Genie failed to analyze the design. Showing fallback feedback.');
      
      // Fallback
      const hasDB = nodes.some(n => n.type === 'Database');
      const hasLB = nodes.some(n => n.type === 'Load Balancer');
      const dbCount = nodes.filter(n => n.type === 'Database').length;
      
      let fallbackResponse = [];
      if (!hasDB) {
        fallbackResponse.push({ type: 'error', text: 'You have no Database. Where will data be persisted?' });
      } else if (dbCount === 1 && !hasLB) {
        fallbackResponse.push({ type: 'warning', text: 'You have a single Database without a Load Balancer. This is a Single Point of Failure (SPOF).' });
      } else if (hasLB && dbCount > 1) {
        fallbackResponse.push({ type: 'success', text: 'Excellent! You have a Load Balancer distributing traffic, and multiple databases, ensuring high availability.' });
      } else {
        fallbackResponse.push({ type: 'warning', text: 'Consider adding a Cache layer (like Redis) to reduce load on your Database.' });
      }

      setFeedback(fallbackResponse);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem 2rem' }}>
      <Navbar />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="heading-gradient">Interactive System Design</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Drag components to canvas. Click nodes to connect them. Drag placed nodes to move them.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowCert(true)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}>
            <Award size={18} /> Claim Certificate
          </button>
          <button onClick={analyzeDesign} className="btn-primary" disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : <><Sparkles size={18} /> Genie Review</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        {/* Sidebar Tools */}
        <div className="glass-panel" style={{ width: '250px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Components</h3>
          {NODE_TYPES.map(node => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              onClick={() => {
                if (COMPONENT_INFO[node.type]) {
                  setActiveModalComponent(node.type);
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid ' + node.color + '50',
                padding: '12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'grab',
                transition: 'all 0.2s',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <div style={{ color: node.color }}>{node.icon}</div>
              <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{node.type}</span>
            </div>
          ))}
          
          {feedback && (
            <div className="animate-fade-in" style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 0 15px rgba(168, 85, 247, 0.15)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#a855f7' }}>
                <Sparkles size={16} /> AI Feedback
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {feedback.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {msg.type === 'error' && <AlertTriangle size={14} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />}
                    {msg.type === 'warning' && <AlertTriangle size={14} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />}
                    {msg.type === 'success' && <CheckCircle2 size={14} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />}
                    <span style={{ color: 'var(--text-main)' }}>{msg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div 
          className="glass-panel" 
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          style={{ 
            flex: 1, 
            position: 'relative', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 2px, transparent 2px)',
            backgroundSize: '30px 30px',
            overflow: 'hidden',
            cursor: connectingFrom ? 'crosshair' : (draggingNodeId ? 'grabbing' : 'default')
          }}
        >
          {/* SVG for connections & animations */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(168, 85, 247, 0.6)" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              
              const x1 = fromNode.x + 60;
              const y1 = fromNode.y + 35;
              const x2 = toNode.x + 60;
              const y2 = toNode.y + 35;
              
              const pathId = `path-${conn.from}-${conn.to}`;

              return (
                <g key={idx}>
                  <line 
                    x1={x1} y1={y1} x2={x2} y2={y2} 
                    stroke="rgba(168, 85, 247, 0.3)" 
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  {/* Invisible path for animation to follow */}
                  <path 
                    id={pathId} 
                    d={`M ${x1} ${y1} L ${x2} ${y2}`} 
                    fill="none" 
                    stroke="none" 
                  />
                  {/* Glowing data packets traveling along the line */}
                  <circle r="3" fill="#c084fc" filter="url(#glow)">
                    <animateMotion dur="2s" repeatCount="indefinite">
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  </circle>
                  <circle r="3" fill="#e879f9" filter="url(#glow)">
                    <animateMotion dur="2.5s" begin="1s" repeatCount="indefinite">
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const nodeInfo = NODE_TYPES.find(n => n.type === node.type);
            const isConnecting = connectingFrom === node.id;
            const isDragging = draggingNodeId === node.id;
            
            return (
              <div
                key={node.id}
                onMouseDown={(e) => {
                  if (e.button !== 0) return; // Only left click
                  e.stopPropagation();
                  setDraggingNodeId(node.id);
                  setDragMoved(false);
                }}
                onClick={(e) => handleNodeClick(e, node.id, node.type)}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  width: '120px',
                  padding: '10px',
                  background: isConnecting ? 'rgba(168, 85, 247, 0.25)' : 'rgba(20, 20, 25, 0.95)',
                  border: isConnecting ? '2px solid #a855f7' : '2px solid ' + nodeInfo.color,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isDragging ? 'grabbing' : 'pointer',
                  zIndex: isDragging ? 10 : 1,
                  boxShadow: isConnecting ? `0 0 15px ${nodeInfo.color}80` : '0 4px 15px rgba(0,0,0,0.6)',
                  transition: isDragging ? 'none' : 'box-shadow 0.2s, border-color 0.2s',
                  userSelect: 'none'
                }}
              >
                <div style={{ color: nodeInfo.color }}>{nodeInfo.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', textAlign: 'center', pointerEvents: 'none' }}>{node.type}</div>
                
                <button 
                  onClick={(e) => deleteNode(e, node.id)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                    zIndex: 20
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Concept Explainer Modal */}
      {activeModalComponent && COMPONENT_INFO[activeModalComponent] && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          <style>{`
            @keyframes slideRightFlow {
              0% { left: 0; opacity: 0; }
              10% { opacity: 1; }
              90% { left: 95%; opacity: 1; }
              100% { left: 100%; opacity: 0; }
            }
          `}</style>

          <div className="glass-panel premium-3d" style={{ width: '90%', maxWidth: '850px', padding: '3rem', position: 'relative', border: `1px solid ${COMPONENT_INFO[activeModalComponent].color}`, boxShadow: `0 0 40px ${COMPONENT_INFO[activeModalComponent].color}30`, borderRadius: '24px' }}>
            
            <button onClick={() => setActiveModalComponent(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              <X size={20} />
            </button>
            
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '15px' }}>
              {COMPONENT_INFO[activeModalComponent].icon} 
              What is a {COMPONENT_INFO[activeModalComponent].title}?
            </h2>
            
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              {COMPONENT_INFO[activeModalComponent].description}
            </p>

            {/* Dynamic Conceptual Diagram Visualizer */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '2.5rem 2rem', border: `1px dashed ${COMPONENT_INFO[activeModalComponent].color}60`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
              {COMPONENT_INFO[activeModalComponent].visualLayout}
            </div>

          </div>
        </div>
      )}

      <CertificateModal 
        show={showCert} 
        onClose={() => setShowCert(false)} 
        userName="PrepGenie Architect" 
        courseName="Advanced System Architecture" 
      />
    </div>
  );
}
