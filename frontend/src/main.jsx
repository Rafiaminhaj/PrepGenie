import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { polyfill } from "mobile-drag-drop";
import "mobile-drag-drop/default.css";

// Polyfill HTML5 drag and drop for touch devices (used in JobTracker)
polyfill({
    dragImageCenterOnTouch: true
});

// Prevent touch scroll when dragging
window.addEventListener('touchmove', function() {}, {passive: false});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
