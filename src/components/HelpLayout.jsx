import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HelpLayout({ icon, title, subtitle, accentColor = '#00C896', children }) {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .hl-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f4f7fb;
          min-height: 100vh;
        }

        /* ── Hero Header ── */
        .hl-hero {
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          padding: 0;
          position: relative;
          overflow: hidden;
        }
        .hl-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
        }
        .hl-hero::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 150px; height: 150px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
        }
        .hl-hero-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 28px 24px 40px;
          position: relative;
          z-index: 1;
        }
        .hl-back {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.85);
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 28px;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .hl-back:hover { background: rgba(255,255,255,0.18); color: white; }

        .hl-hero-content { display: flex; align-items: flex-start; gap: 20px; }
        .hl-icon-wrap {
          width: 64px; height: 64px; border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .hl-hero-text { flex: 1; }
        .hl-title {
          font-size: 28px; font-weight: 800; color: white;
          margin: 0 0 8px; letter-spacing: -0.6px; line-height: 1.2;
        }
        .hl-subtitle { font-size: 14px; color: rgba(255,255,255,0.55); margin: 0; line-height: 1.6; }

        /* ── Content ── */
        .hl-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 28px 24px 120px;
        }

        /* ── Section label ── */
        .hl-section-label {
          font-size: 11px; font-weight: 800; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.8px;
          margin: 0 0 14px; display: flex; align-items: center; gap: 8px;
        }
        .hl-section-label::after {
          content: ''; flex: 1; height: 1px; background: #e2e8f0;
        }

        /* ── Card base ── */
        .hl-card {
          background: white; border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9; overflow: hidden;
          margin-bottom: 12px;
        }

        /* ── Step card ── */
        .hl-step {
          display: flex; gap: 16px; padding: 20px;
          border-bottom: 1px solid #f8fafc;
        }
        .hl-step:last-child { border-bottom: none; }
        .hl-step-num {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 800; font-size: 13px; flex-shrink: 0;
        }
        .hl-step-icon { font-size: 18px; margin-bottom: 4px; }
        .hl-step-title { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 5px; }
        .hl-step-body { font-size: 13px; color: #6b7280; line-height: 1.75; margin: 0; }

        /* ── Tip row ── */
        .hl-tip {
          display: flex; gap: 14px; padding: 14px 18px;
          border-bottom: 1px solid #f8fafc; align-items: flex-start;
        }
        .hl-tip:last-child { border-bottom: none; }
        .hl-tip-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; flex-shrink: 0;
        }
        .hl-tip-title { font-size: 13.5px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
        .hl-tip-body { font-size: 12.5px; color: #6b7280; line-height: 1.7; margin: 0; }

        /* ── Alert banner ── */
        .hl-alert {
          border-radius: 16px; padding: 18px 20px;
          display: flex; gap: 14px; align-items: flex-start;
          margin-bottom: 20px;
        }
        .hl-alert-icon { font-size: 28px; flex-shrink: 0; }
        .hl-alert-title { font-size: 14px; font-weight: 800; margin: 0 0 4px; }
        .hl-alert-body { font-size: 13px; line-height: 1.7; margin: 0; }

        /* ── CTA Banner ── */
        .hl-cta {
          background: linear-gradient(135deg, #08162F, #0f2167);
          border-radius: 20px; padding: 28px 24px; text-align: center;
          margin-bottom: 16px; position: relative; overflow: hidden;
        }
        .hl-cta::before {
          content: ''; position: absolute; top: -30px; right: -30px;
          width: 120px; height: 120px; border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .hl-cta-title { font-size: 18px; font-weight: 800; color: white; margin: 0 0 8px; }
        .hl-cta-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0 0 20px; }
        .hl-cta-btn {
          display: inline-flex; align-items: center; gap: 7px;
          color: white; border-radius: 50px; padding: 12px 26px;
          font-size: 13.5px; font-weight: 800; text-decoration: none;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: all 0.2s;
          border: none; cursor: pointer; font-family: inherit;
        }
        .hl-cta-btn:hover { transform: translateY(-2px); filter: brightness(1.08); }

        /* ── Info grid ── */
        .hl-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .hl-info-card {
          background: white; border-radius: 14px; padding: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
        }
        .hl-info-icon { font-size: 26px; margin-bottom: 10px; }
        .hl-info-title { font-size: 13.5px; font-weight: 800; color: #0f172a; margin: 0 0 5px; }
        .hl-info-body { font-size: 12.5px; color: #6b7280; line-height: 1.7; margin: 0; }

        /* ── Form elements ── */
        .hl-form-card {
          background: white; border-radius: 16px; padding: 22px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
          margin-bottom: 16px;
        }
        .hl-label-text {
          display: block; font-size: 12px; font-weight: 700;
          color: #374151; margin-bottom: 7px;
        }
        .hl-input {
          width: 100%; padding: 12px 14px;
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 11px; font-size: 13.5px; color: #1f2937;
          outline: none; box-sizing: border-box; font-family: inherit; transition: all 0.2s;
        }
        .hl-input:focus { border-color: #00C896; background: white; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .hl-input::placeholder { color: #9ca3af; }

        /* ── Footer brand ── */
        .hl-footer {
          text-align: center; padding: 20px;
          background: white; border-radius: 16px;
          border: 1px solid #f1f5f9; margin-top: 8px;
        }
        .hl-footer-brand { font-size: 15px; font-weight: 800; color: #08162F; margin: 0 0 3px; }
        .hl-footer-brand span { color: #00C896; }
        .hl-footer-sub { font-size: 12px; color: #9ca3af; margin: 0; }

        /* ── Desktop ── */
        @media (min-width: 769px) {
          .hl-hero-inner { padding: 36px 32px 48px; }
          .hl-content { padding: 32px 32px 100px; }
          .hl-title { font-size: 32px; }
          .hl-icon-wrap { width: 72px; height: 72px; font-size: 32px; }
          .hl-info-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .hl-info-grid { grid-template-columns: 1fr; }
          .hl-hero-content { flex-direction: column; gap: 14px; }
          .hl-title { font-size: 24px; }
        }
      `}</style>

      <div className="hl-root">
        <div className="hl-hero">
          <div className="hl-hero-inner">
            <button className="hl-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="hl-hero-content">
              <div className="hl-icon-wrap" style={{ background: `${accentColor}22` }}>
                {icon}
              </div>
              <div className="hl-hero-text">
                <h1 className="hl-title">{title}</h1>
                <p className="hl-subtitle">{subtitle}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hl-content">{children}</div>
      </div>
    </>
  )
}