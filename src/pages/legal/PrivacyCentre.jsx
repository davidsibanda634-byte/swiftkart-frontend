import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function PrivacyCentre() {
  const navigate = useNavigate()

  const controls = [
    {
      icon: '👁️',
      bg: 'rgba(0,200,150,0.1)',
      title: 'What We Can See',
      body: 'We can see your name, email, phone number, and the listings you post. We can also see basic usage data like which pages you visit.'
    },
    {
      icon: '🙈',
      bg: 'rgba(37,99,235,0.1)',
      title: 'What We Cannot See',
      body: 'We cannot see your WhatsApp conversations with sellers. We cannot see your bank account or EcoCash transactions. Your private messages are yours alone.'
    },
    {
      icon: '🌍',
      bg: 'rgba(245,158,11,0.1)',
      title: 'What Other Users Can See',
      body: 'Other users can see your name, profile picture initial, your public listings, and your general city. Your email and full phone number are never shown to other users.'
    },
    {
      icon: '🛡️',
      bg: 'rgba(124,58,237,0.1)',
      title: 'What Only You Can See',
      body: 'Only you can see your saved items, your account settings, your email address, and your full phone number in your profile.'
    },
  ]

  const rights = [
    { icon: '📋', title: 'Access Your Data', body: 'Request a full copy of all data we hold about you. We will respond within 7 days.', action: 'Request Data Copy', link: '/help/contact' },
    { icon: '✏️', title: 'Correct Your Data', body: 'Update inaccurate information directly in your profile, or contact us for help.', action: 'Edit Profile', link: '/profile-menu' },
    { icon: '🗑️', title: 'Delete Your Data', body: 'Delete your account and all associated data. This action is permanent and cannot be undone.', action: 'Contact Support', link: '/help/contact' },
    { icon: '📤', title: 'Export Your Data', body: 'Download a copy of your listings, profile, and activity in a portable format.', action: 'Request Export', link: '/help/contact' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pc-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .pc-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 20px 32px; }
        .pc-header-inner { max-width: 760px; margin: 0 auto; }
        .pc-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s; }
        .pc-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .pc-header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
        .pc-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 6px; letter-spacing: -0.5px; }
        .pc-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }
        .pc-content { max-width: 760px; margin: 0 auto; padding: 24px 20px 100px; }
        .pc-section-label { font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin: 24px 0 12px; }
        .pc-card { background: white; border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; padding: 16px 18px; margin-bottom: 10px; display: flex; gap: 14px; align-items: flex-start; }
        .pc-card-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .pc-card-title { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 5px; }
        .pc-card-body { font-size: 13px; color: #6b7280; line-height: 1.7; margin: 0; }
        .pc-right-card { background: white; border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; padding: 16px 18px; margin-bottom: 10px; }
        .pc-right-header { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 10px; }
        .pc-right-icon { width: 38px; height: 38px; border-radius: 10px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
        .pc-right-title { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 3px; }
        .pc-right-body { font-size: 12.5px; color: #6b7280; line-height: 1.7; margin: 0; }
        .pc-right-btn { display: inline-flex; align-items: center; gap: 5px; margin-top: 10px; background: #ecfdf5; color: #059669; border: 1px solid #bbf7d0; padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .pc-right-btn:hover { background: #d1fae5; }
        .pc-links { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
        .pc-link-card { flex: 1; min-width: 140px; background: white; border-radius: 14px; padding: 16px; border: 1px solid #f1f5f9; text-decoration: none; display: block; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .pc-link-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
        .pc-link-icon { font-size: 24px; margin-bottom: 8px; }
        .pc-link-title { font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
        .pc-link-sub { font-size: 11.5px; color: #9ca3af; margin: 0; }
        @media (max-width: 768px) { .pc-content { padding: 16px 14px 100px; } .pc-header { padding: 20px 16px 24px; } }
      `}</style>

      <div className="pc-root">
        <div className="pc-header">
          <div className="pc-header-inner">
            <button className="pc-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="pc-header-icon">🛡️</div>
            <h1 className="pc-title">Privacy Centre</h1>
            <p className="pc-sub">Understand and control how your data is used on Scalablenexus</p>
          </div>
        </div>

        <div className="pc-content">

          <p className="pc-section-label">Data Visibility — Who Sees What</p>
          {controls.map((c, i) => (
            <div key={i} className="pc-card">
              <div className="pc-card-icon" style={{ background: c.bg }}>{c.icon}</div>
              <div>
                <p className="pc-card-title">{c.title}</p>
                <p className="pc-card-body">{c.body}</p>
              </div>
            </div>
          ))}

          <p className="pc-section-label">Your Privacy Rights</p>
          {rights.map((r, i) => (
            <div key={i} className="pc-right-card">
              <div className="pc-right-header">
                <div className="pc-right-icon">{r.icon}</div>
                <div>
                  <p className="pc-right-title">{r.title}</p>
                  <p className="pc-right-body">{r.body}</p>
                </div>
              </div>
              <Link to={r.link} className="pc-right-btn">{r.action} →</Link>
            </div>
          ))}

          <p className="pc-section-label">Related Policies</p>
          <div className="pc-links">
            {[
              { icon: '🔐', title: 'Privacy Policy', sub: 'Full data policy', to: '/legal/privacy' },
              { icon: '🍪', title: 'Cookie Policy', sub: 'How we use cookies', to: '/legal/cookies' },
              { icon: '📋', title: 'Terms of Use', sub: 'Platform rules', to: '/legal/terms' },
              { icon: '📜', title: 'Community Guidelines', sub: 'How we treat each other', to: '/legal/guidelines' },
            ].map(l => (
              <Link key={l.title} to={l.to} className="pc-link-card">
                <div className="pc-link-icon">{l.icon}</div>
                <p className="pc-link-title">{l.title}</p>
                <p className="pc-link-sub">{l.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}