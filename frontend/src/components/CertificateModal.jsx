import React, { useEffect } from 'react';
import { Award, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

export default function CertificateModal({ show, onClose, userName = "Developer", courseName = "System Design & Scalability" }) {
  if (!show) return null;

  useEffect(() => {
    if (show) {
      // Trigger a realistic burst of confetti
      var duration = 3 * 1000;
      var animationEnd = Date.now() + duration;
      var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [show]);

  const handleDownload = () => {
    const certElement = document.getElementById('certificate-node');
    if (certElement) {
      // Temporarily hide the close button and download button from canvas
      html2canvas(certElement, { 
        backgroundColor: '#0f172a',
        scale: 2 // High resolution
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `PrepGenie_Certificate_${courseName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s ease' }}>

      <div style={{ position: 'relative', width: '800px', maxWidth: '95%', animation: 'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '-50px', right: '0px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'all 0.3s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.5)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
          <X size={24} />
        </button>

        {/* Certificate Card */}
        <div id="certificate-node" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '24px', padding: '3.5rem', border: '2px solid rgba(139, 92, 246, 0.5)', boxShadow: '0 0 60px rgba(139, 92, 246, 0.4), inset 0 0 40px rgba(139, 92, 246, 0.1)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          {/* Decorative Corner Ornaments */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', width: '40px', height: '40px', borderTop: '3px solid #8b5cf6', borderLeft: '3px solid #8b5cf6', opacity: 0.5 }}></div>
          <div style={{ position: 'absolute', top: '15px', right: '15px', width: '40px', height: '40px', borderTop: '3px solid #8b5cf6', borderRight: '3px solid #8b5cf6', opacity: 0.5 }}></div>
          <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '40px', height: '40px', borderBottom: '3px solid #8b5cf6', borderLeft: '3px solid #8b5cf6', opacity: 0.5 }}></div>
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '40px', height: '40px', borderBottom: '3px solid #8b5cf6', borderRight: '3px solid #8b5cf6', opacity: 0.5 }}></div>
          
          {/* Faint Grid Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Award size={72} color="#c084fc" style={{ margin: '0 auto 1.5rem auto', filter: 'drop-shadow(0 0 25px rgba(168,85,247,0.8))' }} />
            
            <h2 style={{ color: '#94a3b8', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '5px', marginBottom: '1rem', fontWeight: '600' }}>Certificate of Excellence</h2>
            <div style={{ width: '100px', height: '2px', background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)', margin: '0 auto' }}></div>
            
            <h1 style={{ color: '#fff', fontSize: '4rem', fontWeight: '900', margin: '2rem 0', fontFamily: 'serif', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>{userName}</h1>
            
            <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: '550px', margin: '0 auto 3rem auto', lineHeight: '1.7' }}>
              Has successfully completed the advanced module in <strong style={{ color: '#60a5fa', fontWeight: '700' }}>{courseName}</strong> and demonstrated outstanding skills on <strong style={{ color: '#34d399', fontWeight: '700' }}>PrepGenie</strong>.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2.5rem', paddingBottom: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '2rem', color: '#a78bfa', marginBottom: '0.5rem', transform: 'rotate(-5deg)' }}>PrepGenie AI</div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Authorized Signature</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', border: '2px dashed rgba(139, 92, 246, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
                  <Award size={24} color="#8b5cf6" />
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Verified</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', color: '#f8fafc', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Date of Completion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Excluded from html2canvas automatically because it's outside #certificate-node) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button onClick={handleDownload} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2.5rem', borderRadius: '50px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.5)' }}>
            <Download size={24} /> Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
