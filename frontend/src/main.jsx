import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { polyfill } from "mobile-drag-drop";
import "mobile-drag-drop/default.css";

// Polyfill HTML5 drag and drop for touch devices (used in JobTracker)
polyfill({
    dragImageCenterOnTouch: true
});

// Prevent touch scroll when dragging
window.addEventListener('touchmove', function() {}, {passive: false});

// Initialize PostHog
posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_sSCnc2Qxa3uC5wYgq8ZpsgLGE8nCKhB46wTtoKSwuQrd', {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
