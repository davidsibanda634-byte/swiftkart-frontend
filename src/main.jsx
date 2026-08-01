import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// ── PWA service worker is handled entirely by vite-plugin-pwa ──
// The manual sw.js registration below has been removed because
// vite-plugin-pwa auto-registers its own service worker.
// Having two registrations caused conflicts and broke the install prompt.