import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import HelpLayout from '../../components/HelpLayout'

const steps = [
  { num: '01', icon: '🔍', title: 'Browse or Search', body: 'Open the Marketplace, Services, Jobs, Events or Accommodation section. Use the search bar to find something specific, or browse by category. Filter by price, city, and category to narrow results.' },
  { num: '02', icon: '👀', title: 'View the Listing', body: 'Click any listing to see the full details — description, photos, price, location, and seller information. Read everything carefully and check all photos before contacting the seller.' },
  { num: '03', icon: '💬', title: 'Contact on WhatsApp', body: 'Tap "Contact on WhatsApp." This opens WhatsApp with a pre-written message. Introduce yourself, ask questions, and agree on a meeting time and place.' },
  { num: '04', icon: '📍', title: 'Agree on a Safe Meeting Spot', body: 'Always meet in a public, well-lit place — the campus library entrance, student union, security desk, or a busy campus area. Never in a private or unfamiliar location.' },
  { num: '05', icon: '🔎', title: 'Inspect Before You Pay', body: 'When you meet the seller, inspect the item carefully before handing over any money. Test electronics. Check clothing for defects. Make sure the item matches the listing.' },
  { num: '06', icon: '💵', title: 'Pay Cash on Delivery', body: 'Scalablenexus uses cash on delivery. Pay only after you have received and inspected the item. Never send money in advance via EcoCash or bank transfer.' },
]

const tips = [
  { icon: '⚠️', bg: '#fef2f2', title: 'Never send money first', body: 'This is the most common scam on any marketplace. Cash on delivery only.' },
  { icon: '📸', bg: '#eff6ff', title: 'Ask for more photos', body: 'If a listing only has one photo, ask for more. Genuine sellers are happy to send them.' },
  { icon: '🕐', bg: '#fffbeb', title: 'Watch for pressure tactics', body: 'If a seller says "buy now or I\'ll sell to someone else," slow down. Urgency is a manipulation tactic.' },
  { icon: '👥', bg: '#f0fdf4', title: 'Bring a friend', body: 'For higher-value items, bring someone with you. Deters bad actors and builds confidence.' },
  { icon: '🚩', bg: '#fef2f2', title: 'Report suspicious listings', body: 'See something off? Use the Report button on any listing. Our team reviews within 48 hours.' },
  { icon: '🤝', bg: '#f0fdf4', title: 'Trust your instincts', body: 'If something feels wrong, walk away. Your safety is worth more than any deal.' },
]

export default function HowToBuy() {
  const navigate = useNavigate()
  return (
    <HelpLayout icon="🛍️" title="How to Buy" subtitle="A complete guide to buying safely and confidently on Scalablenexus" accentColor="#00C896" navigate={navigate}>

      <p className="hl-section-label">Step by Step Guide</p>
      <div className="hl-card" style={{ marginBottom: '24px' }}>
        {steps.map((s, i) => (
          <div key={i} className="hl-step">
            <div className="hl-step-num" style={{ background: 'linear-gradient(135deg,#00C896,#059669)' }}>{s.num}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <span style={{ fontSize: '18px' }}>{s.icon}</span>
                <p className="hl-step-title">{s.title}</p>
              </div>
              <p className="hl-step-body">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="hl-section-label">Buyer Safety Tips</p>
      <div className="hl-card" style={{ marginBottom: '24px' }}>
        {tips.map((t, i) => (
          <div key={i} className="hl-tip">
            <div className="hl-tip-icon" style={{ background: t.bg }}>{t.icon}</div>
            <div>
              <p className="hl-tip-title">{t.title}</p>
              <p className="hl-tip-body">{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="hl-cta">
        <p className="hl-cta-title">Ready to start browsing?</p>
        <p className="hl-cta-sub">Thousands of listings from students on your campus</p>
        <Link to="/marketplace" className="hl-cta-btn" style={{ background: 'linear-gradient(135deg,#00C896,#059669)' }}>
          🛍️ Browse Marketplace
        </Link>
      </div>

      <div style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '14px', alignItems: 'center' }}>
        <span style={{ fontSize: '24px' }}>🆘</span>
        <div>
          <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Something went wrong?</p>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280' }}>Our support team is here to help.</p>
          <Link to="/help/contact" style={{ fontSize: '12.5px', fontWeight: 700, color: '#00C896', textDecoration: 'none' }}>Contact Support →</Link>
        </div>
      </div>

      <div className="hl-footer" style={{ marginTop: '16px' }}>
        <p className="hl-footer-brand">Scalable<span>nexus</span></p>
        <p className="hl-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
      </div>
    </HelpLayout>
  )
}