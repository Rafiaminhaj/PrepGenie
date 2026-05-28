import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Building, ArrowRight, Star, Clock, Target, CheckCircle, Code, Shield, Briefcase, Award, ChevronDown, BookOpen, Mic2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CompanyPrep() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (selectedCompany && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedCompany]);

  const companies = [
    {
      id: 'google', name: 'Google', icon: '🔍', difficulty: 'Hard', package: '₹20-30 LPA', rounds: 5,
      brandColor: 'linear-gradient(135deg, #4285F4, #EA4335)',
      about: 'Google organizes the world’s information and makes it universally accessible and useful. Known for intense algorithmic rounds.',
      topics: ['DSA', 'System Design', 'Graphs', 'Dynamic Programming', 'OS Concepts'],
      timeline: '4-8 Weeks',
      questions: [
        { q: 'Design Google Maps (HLD & LLD)', topic: 'System Design', diff: 'Hard', ans: 'Focus on distributed graph algorithms (A*), QuadTrees for spatial indexing, and CDN for map tiles. Handle high write throughput for live location tracking.' },
        { q: 'Number of Islands', topic: 'Graphs', diff: 'Medium', ans: 'Use DFS or BFS to traverse the 2D grid and count connected components.' },
        { q: 'Design YouTube Video Storage', topic: 'System Design', diff: 'Hard', ans: 'Blob storage for chunks, CDN for delivery, metadata in NoSQL, and transcoding pipeline.' }
      ]
    },
    {
      id: 'microsoft', name: 'Microsoft', icon: '💻', difficulty: 'Medium-Hard', package: '₹15-25 LPA', rounds: 4,
      brandColor: 'linear-gradient(135deg, #00A4EF, #7FBA00)',
      about: 'Microsoft empowers every person and organization to achieve more. Strong focus on practical coding, system design, and cultural fit.',
      topics: ['Trees', 'Linked Lists', 'OOPs', 'System Design', 'C#/Java'],
      timeline: '4-6 Weeks',
      questions: [
        { q: 'Design an Elevator System', topic: 'LLD', diff: 'Hard', ans: 'Use State design pattern. Define states: Moving Up, Moving Down, Idle. Handle concurrent requests with a priority queue.' },
        { q: 'Lowest Common Ancestor of a Binary Tree', topic: 'Trees', diff: 'Medium', ans: 'Recursive approach: if root is null or equals p or q, return root. Recurse left and right.' },
        { q: 'Implement LRU Cache', topic: 'Data Structures', diff: 'Medium', ans: 'Use a Doubly Linked List for order and a HashMap for O(1) access to nodes.' }
      ]
    },
    {
      id: 'amazon', name: 'Amazon', icon: '📦', difficulty: 'Hard', package: '₹18-28 LPA', rounds: 4,
      brandColor: 'linear-gradient(135deg, #FF9900, #232F3E)',
      about: 'Amazon focuses heavily on their 14 Leadership Principles and behavioral questions alongside deep technical knowledge.',
      topics: ['Leadership Principles', 'String Manipulation', 'System Design', 'Trees'],
      timeline: '3-6 Weeks',
      questions: [
        { q: 'Tell me about a time you showed customer obsession', topic: 'Behavioral', diff: 'Medium', ans: 'Use the STAR method (Situation, Task, Action, Result). Focus on how your Action specifically benefited the customer, even if it cost the company short-term.' },
        { q: 'Design Amazon E-commerce (Checkout Flow)', topic: 'System Design', diff: 'Hard', ans: 'Focus on distributed transactions, saga pattern for payments, and inventory locking to prevent overselling.' }
      ]
    },
    {
      id: 'flipkart', name: 'Flipkart', icon: '🛒', difficulty: 'Medium-Hard', package: '₹15-22 LPA', rounds: 4,
      brandColor: 'linear-gradient(135deg, #047BD5, #F1C40F)',
      about: 'India’s leading e-commerce platform. Heavy emphasis on Machine Coding rounds and LLD.',
      topics: ['Machine Coding', 'LLD', 'DSA', 'Java/Spring Boot'],
      timeline: '3-5 Weeks',
      questions: [
        { q: 'Machine Coding: Design a Ride Sharing app like Uber', topic: 'Machine Coding', diff: 'Hard', ans: 'Must be completed in 90 mins with working code. Focus on clean OOPs, decoupled services, Strategy pattern for pricing, and Observer pattern for ride updates.' },
        { q: 'Next Greater Element', topic: 'Stacks', diff: 'Medium', ans: 'Use a monotonic decreasing stack to keep track of elements and resolve them in O(N) time.' }
      ]
    },
    { id: 'deloitte', name: 'Deloitte', icon: '📊', difficulty: 'Medium', package: '₹6-9 LPA', rounds: 3, brandColor: 'linear-gradient(135deg, #86BC25, #000000)', about: 'Global consulting firm. Focus on logical reasoning, SQL, and business communication.', topics: ['SQL', 'Aptitude', 'Java', 'Communication'], timeline: '2-4 Weeks', questions: [{ q: 'Explain Joins in SQL', topic: 'SQL', diff: 'Easy', ans: 'Inner, Left, Right, Full Outer Joins. Know the differences and Venn diagrams.' }, { q: 'What is a Primary Key vs Unique Key?', topic: 'SQL', diff: 'Easy', ans: 'Primary Key cannot be null and there is only 1 per table. Unique Key allows one null.' }] },
    { id: 'maersk', name: 'Maersk', icon: '🚢', difficulty: 'Medium', package: '₹10-14 LPA', rounds: 3, brandColor: 'linear-gradient(135deg, #42B4E6, #000000)', about: 'Global shipping leader transitioning to a tech powerhouse.', topics: ['Microservices', 'Spring Boot', 'SQL', 'System Design'], timeline: '3-4 Weeks', questions: [{ q: 'How does Spring Boot AutoConfiguration work?', topic: 'Spring Boot', diff: 'Medium', ans: 'Uses @Conditional annotations to configure beans based on what is present in the classpath.' }] },
    { id: 'tcs', name: 'TCS', icon: '🏗️', difficulty: 'Easy-Medium', package: '₹3.5-7 LPA', rounds: 2, brandColor: 'linear-gradient(135deg, #0A2F4C, #E31837)', about: 'Global IT services. Focus on fundamentals, core Java, and aptitude.', topics: ['Core Java', 'Aptitude', 'SQL', 'OOPs'], timeline: '2-3 Weeks', questions: [{ q: 'Difference between final, finally, and finalize?', topic: 'Java', diff: 'Easy', ans: 'Keyword (constants), block (exception handling), and method (garbage collection) respectively.' }] },
    { id: 'infosys', name: 'Infosys', icon: '💼', difficulty: 'Easy-Medium', package: '₹3.6-8 LPA', rounds: 2, brandColor: 'linear-gradient(135deg, #007CC3, #000000)', about: 'Next-generation digital services and consulting.', topics: ['Python/Java', 'DBMS', 'Aptitude', 'Software Engineering'], timeline: '2-3 Weeks', questions: [{ q: 'What is Normalization?', topic: 'DBMS', diff: 'Medium', ans: 'Organizing data to minimize redundancy (1NF, 2NF, 3NF).' }] },
    { id: 'swiggy', name: 'Swiggy', icon: '🍔', difficulty: 'Hard', package: '₹20-30 LPA', rounds: 4, brandColor: 'linear-gradient(135deg, #FC8019, #000000)', about: 'Leading food delivery platform. Extreme focus on LLD, Concurrency, and System Design.', topics: ['Concurrency', 'LLD', 'Caching', 'DSA'], timeline: '4-6 Weeks', questions: [{ q: 'Design Swiggy Delivery Assignment system', topic: 'System Design', diff: 'Hard', ans: 'Geospatial queries, pub-sub for driver matching, Redis for live tracking, bipartite matching algorithms.' }] },
    { id: 'razorpay', name: 'Razorpay', icon: '💳', difficulty: 'Hard', package: '₹18-25 LPA', rounds: 4, brandColor: 'linear-gradient(135deg, #3395FF, #02042B)', about: 'Fintech giant. Focus on highly reliable systems, transactions, and API design.', topics: ['System Design', 'API Design', 'Idempotency', 'Java/Go'], timeline: '4-6 Weeks', questions: [{ q: 'How to handle duplicate payment requests?', topic: 'API Design', diff: 'Hard', ans: 'Use Idempotency keys in headers. Store the key in Redis/DB with a lock before processing the payment.' }] }
  ];

  const handleStartMock = () => {
    // Save activity
    const sessions = parseInt(localStorage.getItem('totalSessions') || '0');
    localStorage.setItem('totalSessions', sessions + 1);
    localStorage.setItem('lastActivityDate', new Date().toISOString().split('T')[0]);
    
    // Redirect to interview with context (via state or just routing for now)
    toast.success(`Starting Mock Interview for ${selectedCompany.name}!`);
    navigate('/interview');
  };

  const renderCompanyGrid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
      {companies.map((company, index) => (
        <div 
          key={company.id}
          onClick={() => { setSelectedCompany(company); setExpandedQ(null); }}
          className="glass-panel premium-3d cascade-reveal"
          style={{ 
            animationDelay: `${index * 0.05}s`,
            padding: '0', 
            cursor: 'pointer', 
            textAlign: 'center', 
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            border: selectedCompany?.id === company.id ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
            transform: selectedCompany?.id === company.id ? 'translateY(-5px) scale(1.02)' : 'none',
            boxShadow: selectedCompany?.id === company.id ? '0 15px 30px rgba(16, 185, 129, 0.2)' : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}
        >
          {/* Brand Color Header Strip */}
          <div style={{ height: '6px', width: '100%', background: company.brandColor }}></div>
          
          <div style={{ padding: '2rem 1.5rem' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1.2rem',
              width: '80px',
              height: '80px',
              margin: '0 auto 1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {company.icon}
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.8rem', fontWeight: '700', letterSpacing: '0.5px' }}>{company.name}</h3>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600',
                color: company.difficulty.includes('Hard') ? '#ef4444' : '#f59e0b', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                background: company.difficulty.includes('Hard') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                padding: '4px 10px',
                borderRadius: '12px'
              }}>
                <Target size={12} /> {company.difficulty}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCompanyDetails = () => {
    if (!selectedCompany) return null;
    const { name, icon, about, difficulty, package: pkg, rounds, topics, timeline, questions } = selectedCompany;

    return (
      <div ref={detailsRef} className="glass-panel animate-fade-in" style={{ 
        padding: '3rem', 
        borderLeft: '4px solid transparent', 
        borderImage: `${selectedCompany.brandColor} 1`,
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        background: 'linear-gradient(145deg, rgba(30, 30, 45, 0.8) 0%, rgba(15, 15, 23, 0.95) 100%)'
      }}>
        {/* Background watermark */}
        <div style={{ position: 'absolute', right: '-2%', top: '-15%', fontSize: '25rem', opacity: 0.02, pointerEvents: 'none', filter: 'blur(4px)' }}>{icon}</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              {icon} {name} Interview Guide
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', lineHeight: '1.6' }}>{about}</p>
          </div>
          <button onClick={handleStartMock} className="btn-primary hover-glow" style={{ padding: '15px 30px', display: 'flex', gap: '10px', alignItems: 'center', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Mic2 size={20} /> Start Mock Interview
          </button>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#ef4444', marginBottom: '0.5rem' }}><Target size={24} /></div>
            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{difficulty}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Difficulty Level</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#10b981', marginBottom: '0.5rem' }}><Award size={24} /></div>
            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{pkg}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average CTC</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#3b82f6', marginBottom: '0.5rem' }}><Briefcase size={24} /></div>
            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{rounds} Rounds</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interview Process</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}><Clock size={24} /></div>
            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{timeline}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ideal Prep Time</div>
          </div>
        </div>

        {/* Must Know Topics */}
        <div style={{ marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Star color="#f59e0b" /> Must-Know Topics</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {topics.map(t => (
              <span key={t} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.9rem' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Most Asked Questions */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen color="#3b82f6" /> Most Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((q, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div 
                  onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
                  style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  className="hover-bg-light"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '25px' }}>{idx + 1}.</span>
                    <span style={{ color: '#fff', fontSize: '1.1rem' }}>{q.q}</span>
                    <span style={{ background: q.diff === 'Hard' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: q.diff === 'Hard' ? '#ef4444' : '#f59e0b', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', border: q.diff === 'Hard' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)' }}>{q.diff}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{q.topic}</span>
                  </div>
                  <ChevronDown size={20} color="var(--text-muted)" style={{ transform: expandedQ === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.3s ease' }} />
                </div>
                
                {expandedQ === idx && (
                  <div style={{ padding: '0 1.5rem 1.5rem 4rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
                    <h4 style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Ideal Answer Approach</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{q.ans}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="app-container">
      <Navbar />
      <div style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto', padding: '100px 20px 50px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
            <Building color="#10b981" size={40} />
          </div>
          <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Company Interview Prep</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Select a target company to unlock detailed interview playbooks, most asked questions, and tailored AI mock interviews.
          </p>
        </div>

        {renderCompanyGrid()}
        {renderCompanyDetails()}
        
      </div>
    </div>
  );
}
