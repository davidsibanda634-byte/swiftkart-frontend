import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function CommunityGuidelines() {
  const navigate = useNavigate()

  const dos = [
    { icon: '✅', text: 'Post accurate, honest listings with real prices and real photos' },
    { icon: '✅', text: 'Respond to buyers promptly and professionally on WhatsApp' },
    { icon: '✅', text: 'Meet in public, safe locations for transactions' },
    { icon: '✅', text: 'Respect other users regardless of their background, campus, or location' },
    { icon: '✅', text: 'Report listings or users that violate these guidelines' },
    { icon: '✅', text: 'Provide accurate descriptions including any defects or damage' },
    { icon: '✅', text: 'Post in the correct category so buyers can find your listing' },
    { icon: '✅', text: 'Remove or update your listing when an item is no longer available' },
  ]

  const donts = [
    { icon: '❌', text: 'Post misleading, exaggerated, or fraudulent listings' },
    { icon: '❌', text: 'Ask buyers to send money in advance before meeting' },
    { icon: '❌', text: 'Post illegal items, substances, or services of any kind' },
    { icon: '❌', text: 'Harass, threaten, or disrespect other users' },
    { icon: '❌', text: 'Post the same listing multiple times to game search rankings' },
    { icon: '❌', text: 'Use fake photos or descriptions copied from other sources' },
    { icon: '❌', text: 'Create multiple accounts to bypass a suspension or ban' },
    { icon: '❌', text: 'Share personal data of other users without their consent' },
  ]

  const enforcement = [
    { level: '⚠️ Warning', color: '#f59e0b', bg: '#fffbeb', desc: 'First-time minor violations receive a warning. The listing is removed and the user is notified.' },
    { level: '⏸️ Temporary Suspension', color: '#d97706', bg: '#fef3c7', desc: 'Repeated violations or moderately serious offences result in a 7-30 day suspension from posting.' },
    { level: '🚫 Permanent Ban', color: '#dc2626', bg: '#fef2f2', desc: 'Serious violations — fraud, illegal listings, harassment — result in permanent account removal with no appeal.' },
    { level: '🚔 Legal Referral', color: '#7c3aed', bg: '#f5f3ff', desc: 'Illegal activity may be reported to Zimbabwe Republic Police or relevant authorities.' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .cg-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .cg-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 20px 32px; }
        .cg-header-inner { max-width: 760px; margin: 0 auto; }
        .cg-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s; }
        .cg-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .cg-header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
        .cg-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 6px; letter-spacing: -0.5px; }
        .cg-updated { font-size: 12px; color: rgba(255,255,255,0.4); }
        .cg-content { max-width: 760px; margin: 0 auto; padding: 24px 20px 100px; }
        .cg-intro { background: white; border-radius: 16px; padding: 18px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 20px; font-size: 13.5px; color: #374151; line-height: 1.8; }
        .cg-label { font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 12px; }
        .cg-list-card { background: white; border-radius: 16px; padding: 18px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 16px; }
        .cg-list-title { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 14px; }
        .cg-list-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: #374151; line-height: 1.65; margin-bottom: 10px; }
        .cg-list-item:last-child { margin-bottom: 0; }
        .cg-list-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .cg-enforcement { margin-bottom: 20px; }
        .cg-enforcement-card { border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; border: 1px solid transparent; }
        .cg-enforcement-level { font-size: 13.5px; font-weight: 800; margin: 0 0 4px; }
        .cg-enforcement-desc { font-size: 13px; line-height: 1.6; margin: 0; color: #374151; }
        .cg-report-card { background: linear-gradient(135deg, #08162F, #0f2167); border-radius: 16px; padding: 22px; text-align: center; }
        .cg-report-title { font-size: 17px; font-weight: 800; color: white; margin: 0 0 8px; }
        .cg-report-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin: 0 0 16px; }
        .cg-report-btn { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #00C896, #059669); color: white; border: none; padding: 11px 22px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; text-decoration: none; }
        .cg-footer { background: white; border-radius: 16px; padding: 18px 20px; border: 1px solid #f1f5f9; text-align: center; margin-top: 16px; }
        .cg-footer-brand { font-size: 16px; font-weight: 800; color: #08162F; margin: 0 0 4px; }
        .cg-footer-brand span { color: #00C896; }
        .cg-footer-sub { font-size: 12px; color: #9ca3af; margin: 0; }
        @media (max-width: 768px) { .cg-content { padding: 16px 14px 100px; } .cg-header { padding: 20px 16px 24px; } }
      `}</style>

      <div className="cg-root">
        <div className="cg-header">
          <div className="cg-header-inner">
            <button className="cg-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="cg-header-icon">📜</div>
            <h1 className="cg-title">Community Guidelines</h1>
            <p className="cg-updated">Last updated: January 2025</p>
          </div>
        </div>

        <div className="cg-content">
          <div className="cg-intro">
            Scalablenexus works because our community trusts each other. These guidelines define the behaviour we expect from every member — buyer, seller, service provider, or event organiser. Violating these guidelines may result in content removal, account suspension, or permanent ban.
          </div>

          <p className="cg-label">✅ What We Expect — The Do's</p>
          <div className="cg-list-card">
            <p className="cg-list-title">Behaviour that makes Scalablenexus great</p>
            {dos.map((d, i) => (
              <div key={i} className="cg-list-item">
                <span className="cg-list-icon">{d.icon}</span>
                <span>{d.text}</span>
              </div>
            ))}
          </div>

          <p className="cg-label">❌ What We Don't Allow — The Don'ts</p>
          <div className="cg-list-card">
            <p className="cg-list-title">Behaviour that will get you removed</p>
            {donts.map((d, i) => (
              <div key={i} className="cg-list-item">
                <span className="cg-list-icon">{d.icon}</span>
                <span>{d.text}</span>
              </div>
            ))}
          </div>

          <p className="cg-label" style={{ marginTop: '8px' }}>Enforcement — What Happens When You Break the Rules</p>
          <div className="cg-enforcement">
            {enforcement.map((e, i) => (
              <div key={i} className="cg-enforcement-card" style={{ background: e.bg, borderColor: e.color + '40' }}>
                <p className="cg-enforcement-level" style={{ color: e.color }}>{e.level}</p>
                <p className="cg-enforcement-desc">{e.desc}</p>
              </div>
            ))}
          </div>

          <div className="cg-report-card">
            <p className="cg-report-title">See Something Wrong?</p>
            <p className="cg-report-sub">Use the Report button on any listing or user profile. Our moderation team reviews all reports within 48 hours.</p>
            <Link to="/help/contact" className="cg-report-btn">🚩 Report a Violation</Link>
          </div>

          <div className="cg-footer" style={{ marginTop: '16px' }}>
            <p className="cg-footer-brand">Scalable<span>nexus</span></p>
            <p className="cg-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
          </div>
        </div>
      </div>
    </>
  )
}