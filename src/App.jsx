import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { AuthProvider } from './context/AuthContext'

function App() {

  // ── PWA Install Prompt ──
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {

    // Check if already installed as PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Check if user already dismissed this session
    const dismissed = sessionStorage.getItem('pwa_banner_dismissed')
    if (dismissed) return

    // Detect iOS — Safari on iPhone/iPad
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const safari = /safari/i.test(navigator.userAgent)
    const chrome = /CriOS/i.test(navigator.userAgent)
    setIsIOS(ios)

    // Show iOS guide after 3 seconds if on iOS Safari (not Chrome on iOS)
    if (ios && safari && !chrome) {
      setTimeout(() => setShowInstallBanner(true), 3000)
    }

    // ── Listen for Chrome / Android / Edge install prompt ──
    // This fires on: Chrome Android, Chrome Desktop, Edge, Samsung Internet,
    // Opera, Brave — basically any Chromium browser on any device
    const handler = (e) => {
      e.preventDefault() // prevent default mini-infobar
      setInstallPrompt(e)
      setTimeout(() => setShowInstallBanner(true), 2000) // show after 2s
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Hide banner if user installs from another prompt
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowInstallBanner(false)
      setInstallPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true)
      return
    }
    if (!installPrompt) return
    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallBanner(false)
        setInstallPrompt(null)
      }
    } catch (err) {
      console.log('Install prompt error:', err)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    setIsDismissed(true)
    sessionStorage.setItem('pwa_banner_dismissed', 'true')
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />

        {/* ── PWA Install Banner ── */}
        {showInstallBanner && !isInstalled && !isDismissed && (
          <>
            <style>{`
              @keyframes pwa-slide-up {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              @keyframes pwa-slide-down {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
              }
              .pwa-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 99999;
                animation: pwa-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              }
              .pwa-banner-inner {
                background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
                border-top: 1px solid rgba(0,200,150,0.3);
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 14px;
                box-shadow: 0 -8px 32px rgba(0,0,0,0.4);
              }
              .pwa-app-icon {
                width: 52px;
                height: 52px;
                border-radius: 14px;
                background: linear-gradient(135deg, #00C896, #059669);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                flex-shrink: 0;
                box-shadow: 0 4px 14px rgba(0,200,150,0.4);
              }
              .pwa-text { flex: 1; min-width: 0; }
              .pwa-title {
                font-size: 14px;
                font-weight: 800;
                color: white;
                margin: 0 0 2px;
                letter-spacing: -0.3px;
              }
              .pwa-sub {
                font-size: 11.5px;
                color: rgba(255,255,255,0.55);
                margin: 0;
                font-weight: 500;
              }
              .pwa-install-btn {
                background: linear-gradient(135deg, #00C896, #059669);
                color: white;
                border: none;
                padding: 10px 18px;
                border-radius: 24px;
                font-size: 13px;
                font-weight: 800;
                cursor: pointer;
                white-space: nowrap;
                font-family: inherit;
                box-shadow: 0 4px 14px rgba(0,200,150,0.4);
                transition: all 0.2s;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                gap: 6px;
              }
              .pwa-install-btn:hover { transform: scale(1.04); }
              .pwa-install-btn:active { transform: scale(0.97); }
              .pwa-dismiss-btn {
                background: none;
                border: none;
                color: rgba(255,255,255,0.4);
                font-size: 20px;
                cursor: pointer;
                padding: 4px 8px;
                line-height: 1;
                flex-shrink: 0;
                transition: color 0.2s;
                font-family: inherit;
              }
              .pwa-dismiss-btn:hover { color: rgba(255,255,255,0.8); }

              /* iOS guide overlay */
              .pwa-ios-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.85);
                z-index: 99999;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                padding: 0 16px 32px;
                animation: pwa-slide-up 0.3s ease;
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              }
              .pwa-ios-card {
                background: #0f2167;
                border: 1px solid rgba(255,255,255,0.15);
                border-radius: 24px;
                padding: 28px 24px;
                width: 100%;
                max-width: 420px;
                text-align: center;
                position: relative;
              }
              .pwa-ios-title {
                font-size: 18px;
                font-weight: 800;
                color: white;
                margin: 0 0 6px;
              }
              .pwa-ios-sub {
                font-size: 13px;
                color: rgba(255,255,255,0.55);
                margin: 0 0 24px;
              }
              .pwa-ios-step {
                display: flex;
                align-items: flex-start;
                gap: 14px;
                text-align: left;
                margin-bottom: 16px;
              }
              .pwa-ios-step-num {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: rgba(0,200,150,0.2);
                border: 1px solid rgba(0,200,150,0.4);
                color: #00C896;
                font-size: 12px;
                font-weight: 800;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
              }
              .pwa-ios-step-text {
                font-size: 13.5px;
                color: rgba(255,255,255,0.85);
                line-height: 1.6;
                padding-top: 4px;
              }
              .pwa-ios-step-text strong { color: white; }
              .pwa-ios-close {
                width: 100%;
                margin-top: 20px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.15);
                color: white;
                padding: 13px;
                border-radius: 14px;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                font-family: inherit;
              }
              /* Arrow pointing down for iOS (since share button is at bottom on iPhone) */
              .pwa-ios-arrow {
                margin-top: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                color: rgba(255,255,255,0.4);
                font-size: 12px;
              }
            `}</style>

            <div className="pwa-banner">
              <div className="pwa-banner-inner">
                <div className="pwa-app-icon">🛒</div>
                <div className="pwa-text">
                  <p className="pwa-title">Install Scalablenexus</p>
                  <p className="pwa-sub">
                    {isIOS
                      ? 'Add to Home Screen for the best experience'
                      : 'Install the app — works offline, loads faster'
                    }
                  </p>
                </div>
                <button className="pwa-install-btn" onClick={handleInstall}>
                  {isIOS ? '📲 How to Install' : '⬇️ Install'}
                </button>
                <button className="pwa-dismiss-btn" onClick={handleDismiss}>
                  ✕
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── iOS Step-by-Step Guide Overlay ── */}
        {showIOSGuide && (
          <>
            <style>{`
              @keyframes pwa-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
            <div
              className="pwa-ios-overlay"
              style={{ animation: 'pwa-fade-in 0.3s ease' }}
              onClick={() => setShowIOSGuide(false)}
            >
              <div
                className="pwa-ios-card"
                onClick={e => e.stopPropagation()}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📱</div>
                <p className="pwa-ios-title">Install on iPhone or iPad</p>
                <p className="pwa-ios-sub">Follow these steps in Safari</p>

                <div className="pwa-ios-step">
                  <div className="pwa-ios-step-num">1</div>
                  <p className="pwa-ios-step-text">
                    Tap the <strong>Share button ⬆️</strong> at the bottom of your Safari browser
                  </p>
                </div>

                <div className="pwa-ios-step">
                  <div className="pwa-ios-step-num">2</div>
                  <p className="pwa-ios-step-text">
                    Scroll down in the share menu and tap <strong>"Add to Home Screen"</strong>
                  </p>
                </div>

                <div className="pwa-ios-step">
                  <div className="pwa-ios-step-num">3</div>
                  <p className="pwa-ios-step-text">
                    Tap <strong>"Add"</strong> in the top right — the app will appear on your home screen
                  </p>
                </div>

                <div className="pwa-ios-step">
                  <div className="pwa-ios-step-num">4</div>
                  <p className="pwa-ios-step-text">
                    Open <strong>Scalablenexus</strong> from your home screen — it works just like a real app
                  </p>
                </div>

                <div className="pwa-ios-arrow">
                  ↓ Share button is at the bottom of Safari
                </div>

                <button
                  className="pwa-ios-close"
                  onClick={() => { setShowIOSGuide(false); setShowInstallBanner(false); handleDismiss() }}
                >
                  Got it — I'll do it now
                </button>
              </div>
            </div>
          </>
        )}

      </AuthProvider>
    </BrowserRouter>
  )
}

export default App