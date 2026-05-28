import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, MessageSquare, BrainCircuit, Mic2, Image as ImageIcon, BookText, LogOut, Settings, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <nav className="navbar" style={{ position: 'relative', zIndex: 100 }}>
        <div className="logo">
          <Sparkles color="var(--primary)" size={24} />
          <span className="heading-gradient">PrepGenie</span>
        </div>
        
        {/* Desktop Nav Links */}
        <div className="nav-links desktop-only">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')} flex-center`}>
            <BrainCircuit size={18} style={{ marginRight: '6px' }} />
            Dashboard
          </Link>
          <Link to="/chat" className={`nav-link ${isActive('/chat')} flex-center`}>
            <MessageSquare size={18} style={{ marginRight: '6px' }} />
            Chat
          </Link>
          <Link to="/interview" className={`nav-link ${isActive('/interview')} flex-center`}>
            <Mic2 size={18} style={{ marginRight: '6px' }} />
            Interview
          </Link>
          <Link to="/visual" className={`nav-link ${isActive('/visual')} flex-center`}>
            <ImageIcon size={18} style={{ marginRight: '6px' }} />
            Visuals
          </Link>
          <Link to="/notebook" className={`nav-link ${isActive('/notebook')} flex-center`}>
            <BookText size={18} style={{ marginRight: '6px' }} />
            Notebook
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mobile Hamburger Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'none' }}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/settings" className={`nav-link ${isActive('/settings')}`} style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
              <Settings size={20} />
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
              }} 
              className="btn-primary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.1)', boxShadow: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={16} style={{ marginRight: '6px' }} />
              Exit
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Side Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" style={{ position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)', background: 'var(--bg-dark)', zIndex: 99, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
          <Link to="/dashboard" onClick={toggleMenu} className={`nav-link ${isActive('/dashboard')}`} style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={24} /> Dashboard
          </Link>
          <Link to="/chat" onClick={toggleMenu} className={`nav-link ${isActive('/chat')}`} style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={24} /> Chat
          </Link>
          <Link to="/interview" onClick={toggleMenu} className={`nav-link ${isActive('/interview')}`} style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mic2 size={24} /> Interview
          </Link>
          <Link to="/visual" onClick={toggleMenu} className={`nav-link ${isActive('/visual')}`} style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImageIcon size={24} /> Visuals
          </Link>
          <Link to="/notebook" onClick={toggleMenu} className={`nav-link ${isActive('/notebook')}`} style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookText size={24} /> Notebook
          </Link>
          <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0' }}></div>
          <Link to="/settings" onClick={toggleMenu} className={`nav-link ${isActive('/settings')}`} style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={24} /> Settings
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }} 
            className="btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '1.1rem', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', display: 'flex', justifyContent: 'center', gap: '10px' }}
          >
            <LogOut size={20} /> Exit PrepGenie
          </button>
        </div>
      )}
    </>
  );
}
