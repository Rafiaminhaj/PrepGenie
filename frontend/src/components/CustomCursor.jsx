import { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Store coordinates in refs to avoid re-renders
  const mouse = useRef({ x: -100, y: -100 });
  const outline = useRef({ x: -100, y: -100 }); // for trailing effect

  useEffect(() => {
    let animationFrameId;
    
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const renderLoop = () => {
      // Direct DOM manipulation for maximum performance
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      if (outlineRef.current) {
        // Linear interpolation (lerp) for smooth trailing
        outline.current.x += (mouse.current.x - outline.current.x) * 0.2;
        outline.current.y += (mouse.current.y - outline.current.y) * 0.2;
        
        outlineRef.current.style.transform = `translate3d(${outline.current.x}px, ${outline.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.classList.contains('glass-panel') ||
        target.closest('.hover-glow')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    
    // Add global body class to hide default cursor
    document.body.classList.add('custom-cursor-enabled');
    
    // Start animation loop
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.body.classList.remove('custom-cursor-enabled');
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef}
        className={`cursor-dot ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
      ></div>
      <div 
        ref={outlineRef}
        className={`cursor-outline ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
      ></div>
    </>
  );
}
