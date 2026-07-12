import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LegalLayout({ icon, title, lastUpdated, intro, children }) {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ll-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .ll-hero { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 0; position: relative; overflow: hidden; }
        .ll-hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.03); }
        .ll-hero-inner { max-width: 900px; margin: 0 auto; padding: 28px 24px 40px; position: relative; z-index: 1; }
        .ll-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.85); padding: 7px 16px; border-radius: 20px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 24px; transition: all 0.2s; }
        .ll-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .ll-hero-content { display: flex; align-items: flex-start; gap: 18px; }
        .ll-icon { width: 60px; height: 60px; border-radius: 18px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
        .ll-title { font-size: 28px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .ll-updated { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 500; margin: 0; }
        .ll-content { max-width: 900px; margin: 0 auto; padding: 28px 24px 100px; }
        .ll-intro { background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border: 1px solid #bbf7d0; border-radius: 16px; padding: 18px 22px; margin-bottom: 20px; font-size: 13.5px; color: #065f46; line-height: 1.8; font-weight: 500; }
        .ll-section { background: white; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 10px; overflow: hidden; }
        .ll-section-header { padding: 16px 20px; border-bottom: 1px solid #f8fafc; display: flex; align-items: center; gap: 12px; background: #fafbfc; }
        .ll-section-num { width: 28px; height: 28px; border-radius: 8px; background: #08162F; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
        .ll-section-title { font-size: 14px; font-weight: 800; color: #08162F; margin: 0; }
        .ll-section-body { padding: 18px 20px; font-size: 13.5px; color: #374151; line-height: 1.9; white-space: pre-wrap; }
        .ll-footer { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; text-align: center; margin-top: 20px; }
        .ll-footer-brand { font-size: 16px; font-weight: 800; color: #08162F; margin: 0 0 4px; }
        .ll-footer-brand span { color: #00C896; }
        .ll-footer-sub { font-size: 12px; color: #9ca3af; margin: 0; }
        @media (min-width: 769px) { .ll-hero-inner { padding: 36px 32px 48px; } .ll-content { padding: 32px 32px 100px; } .ll-title { font-size: 32px; } }
        @media (max-width: 480px) { .ll-hero-content { flex-direction: column; gap: 14px; } .ll-title { font-size: 24px; } }
      `}</style>

      <div className="ll-root">
        <div className="ll-hero">
          <div className="ll-hero-inner">
            <button className="ll-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="ll-hero-content">
              <div className="ll-icon">{icon}</div>
              <div>
                <h1 className="ll-title">{title}</h1>
                <p className="ll-updated">Last updated: {lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="ll-content">
          {intro && <div className="ll-intro">ℹ️ {intro}</div>}
          {children}
          <div className="ll-footer">
            <p className="ll-footer-brand">Scalable<span>nexus</span></p>
            <p className="ll-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
          </div>
        </div>
      </div>
    </>
  )
}