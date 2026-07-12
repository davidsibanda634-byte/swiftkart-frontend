import { useNavigate } from 'react-router-dom'

export default function CookiePolicy() {
  const navigate = useNavigate()

  const cookieTypes = [
    {
      icon: '⚙️',
      bg: 'rgba(0,200,150,0.1)',
      name: 'Essential Cookies',
      required: true,
      desc: 'These cookies are required for the Platform to function. They keep you logged in, remember your session, and enable core features. These cannot be disabled.'
    },
    {
      icon: '📊',
      bg: 'rgba(37,99,235,0.1)',
      name: 'Analytics Cookies',
      required: false,
      desc: 'These help us understand how users interact with the Platform — which pages are visited most, where users drop off, and how to improve the experience. Data is anonymous and aggregated.'
    },
    {
      icon: '⚡',
      bg: 'rgba(245,158,11,0.1)',
      name: 'Performance Cookies',
      required: false,
      desc: 'These store cached data locally on your device to make the Platform load faster on repeat visits — especially important for users on slow connections.'
    },
    {
      icon: '🔧',
      bg: 'rgba(124,58,237,0.1)',
      name: 'Preference Cookies',
      required: false,
      desc: 'These remember your settings and preferences, such as your last selected category, search filters, and recently viewed listings.'
    },
  ]

  const sections = [
    { title: 'What Are Cookies?', content: `Cookies are small text files stored on your device when you visit a website or use a web app. They are widely used to make platforms work efficiently and to provide information to the platform owners.\n\nScalablenexus uses cookies and similar technologies such as localStorage and sessionStorage — which work in the same way but are stored differently on your device.` },
    { title: 'How to Control Cookies', content: `You can control cookies through your browser settings:\n\n• Chrome: Settings → Privacy and Security → Cookies\n• Firefox: Options → Privacy & Security\n• Safari: Preferences → Privacy\n• Samsung Internet: Settings → Privacy\n\nNote: Disabling essential cookies will prevent you from staying logged in and using key Platform features. We recommend keeping essential cookies enabled.` },
    { title: 'Third-Party Cookies', content: `We use a small number of trusted third-party services that may set their own cookies:\n\n• Google Fonts — for loading our typeface (Plus Jakarta Sans). No personal data is collected.\n• Cloudinary — for image hosting and delivery. Images are loaded from their CDN.\n• Render — our backend hosting provider may log request data for performance monitoring.\n\nWe do not use advertising cookies or tracking cookies from ad networks.` },
    { title: 'Changes to This Policy', content: `We may update this Cookie Policy as the Platform evolves. Continued use after changes constitutes acceptance of the updated policy.` },
    { title: 'Contact', content: `For questions about our use of cookies:\n📧 privacy@scalablenexus.co.zw\n📱 WhatsApp: +263 77 000 0000` },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ck-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .ck-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 20px 32px; }
        .ck-header-inner { max-width: 760px; margin: 0 auto; }
        .ck-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s; }
        .ck-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .ck-header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
        .ck-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 6px; letter-spacing: -0.5px; }
        .ck-updated { font-size: 12px; color: rgba(255,255,255,0.4); }
        .ck-content { max-width: 760px; margin: 0 auto; padding: 24px 20px 100px; }
        .ck-intro { background: white; border-radius: 16px; padding: 18px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 20px; font-size: 13.5px; color: #374151; line-height: 1.8; }
        .ck-label { font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 12px; }
        .ck-type-card { background: white; border-radius: 14px; padding: 16px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 10px; display: flex; gap: 14px; }
        .ck-type-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .ck-type-name { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 3px; display: flex; align-items: center; gap: 8px; }
        .ck-required-tag { font-size: 9.5px; font-weight: 800; padding: 2px 8px; border-radius: 10px; background: #ecfdf5; color: #059669; letter-spacing: 0.3px; }
        .ck-optional-tag { font-size: 9.5px; font-weight: 800; padding: 2px 8px; border-radius: 10px; background: #f1f5f9; color: #6b7280; letter-spacing: 0.3px; }
        .ck-type-desc { font-size: 13px; color: #6b7280; line-height: 1.7; margin: 0; }
        .ck-section { background: white; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 10px; overflow: hidden; }
        .ck-section-title { font-size: 14px; font-weight: 800; color: #08162F; padding: 16px 20px; border-bottom: 1px solid #f8fafc; margin: 0; }
        .ck-section-body { padding: 16px 20px; font-size: 13.5px; color: #374151; line-height: 1.85; white-space: pre-wrap; }
        .ck-footer { background: white; border-radius: 16px; padding: 18px 20px; border: 1px solid #f1f5f9; text-align: center; margin-top: 20px; }
        .ck-footer-brand { font-size: 16px; font-weight: 800; color: #08162F; margin: 0 0 4px; }
        .ck-footer-brand span { color: #00C896; }
        .ck-footer-sub { font-size: 12px; color: #9ca3af; margin: 0; }
        @media (max-width: 768px) { .ck-content { padding: 16px 14px 100px; } .ck-header { padding: 20px 16px 24px; } }
      `}</style>

      <div className="ck-root">
        <div className="ck-header">
          <div className="ck-header-inner">
            <button className="ck-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="ck-header-icon">🍪</div>
            <h1 className="ck-title">Cookie Policy</h1>
            <p className="ck-updated">Last updated: January 2025</p>
          </div>
        </div>

        <div className="ck-content">
          <div className="ck-intro">
            Scalablenexus uses cookies and similar technologies to keep the Platform working, remember your preferences, and help us understand how to improve the experience. This policy explains exactly what we use and why.
          </div>

          <p className="ck-label" style={{ marginBottom: '12px' }}>Types of Cookies We Use</p>
          {cookieTypes.map((c, i) => (
            <div key={i} className="ck-type-card">
              <div className="ck-type-icon" style={{ background: c.bg }}>{c.icon}</div>
              <div>
                <p className="ck-type-name">
                  {c.name}
                  {c.required
                    ? <span className="ck-required-tag">Required</span>
                    : <span className="ck-optional-tag">Optional</span>
                  }
                </p>
                <p className="ck-type-desc">{c.desc}</p>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            {sections.map((s, i) => (
              <div key={i} className="ck-section">
                <p className="ck-section-title">{s.title}</p>
                <div className="ck-section-body">{s.content}</div>
              </div>
            ))}
          </div>

          <div className="ck-footer">
            <p className="ck-footer-brand">Scalable<span>nexus</span></p>
            <p className="ck-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
          </div>
        </div>
      </div>
    </>
  )
}