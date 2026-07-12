import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import HelpLayout from '../../components/HelpLayout'

const rules = [
  { icon: '📍', color: '#00C896', bg: '#ecfdf5', title: 'Always Meet in Public', body: 'Meet at the campus library, student union, security desk, or any busy area. Never in a private home, car, or unfamiliar location — even if the seller insists it\'s more convenient.' },
  { icon: '💵', color: '#d97706', bg: '#fffbeb', title: 'Never Send Money First', body: 'Cash on delivery only. No EcoCash, bank transfer, or any advance payment before you physically receive and inspect the item. This is how 99% of marketplace scams work.' },
  { icon: '👥', color: '#2563EB', bg: '#eff6ff', title: 'Bring a Friend', body: 'Especially for higher-value items. Having someone with you deters bad actors and gives you confidence to walk away if something feels wrong.' },
  { icon: '🔎', color: '#7c3aed', bg: '#f5f3ff', title: 'Inspect Before Paying', body: 'Test electronics. Try on clothing. Check for defects, damage, or differences from photos. Once you pay, the transaction is done. A genuine seller will never rush you.' },
  { icon: '📞', color: '#be185d', bg: '#fdf2f8', title: 'Verify Before You Go', body: 'Ask questions on WhatsApp before meeting. Genuine sellers are patient and transparent. If they avoid questions or pressure you, that is a red flag.' },
  { icon: '📱', color: '#0f4c81', bg: '#eff6ff', title: 'Keep WhatsApp Records', body: 'Don\'t delete your conversation with the seller until after the transaction is complete. If something goes wrong, your WhatsApp history is your evidence.' },
]

const redFlags = [
  'Price dramatically below market value — "too good to be true"',
  'Seller asks for EcoCash or bank transfer before meeting',
  'Seller refuses to provide additional photos when asked',
  'Seller insists on meeting at a home or private location',
  'Seller becomes aggressive or threatening when questioned',
  'Listing photos look professional or copied from the internet',
  'Seller claims to be abroad and needs to "ship" the item',
  'Seller asks for your ID, bank details, or OTP code',
]

export default function StayingSafe() {
  const navigate = useNavigate()
  return (
    <HelpLayout icon="🔒" title="Staying Safe" subtitle="Your safety is our top priority — read this before your first transaction" accentColor="#dc2626" navigate={navigate}>

      <div className="hl-alert" style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', marginBottom: '24px' }}>
        <span className="hl-alert-icon">⚠️</span>
        <div>
          <p className="hl-alert-title" style={{ color: 'white' }}>The Golden Rule</p>
          <p className="hl-alert-body" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Never send money before receiving and inspecting your item in person. This is how all marketplace scams work. Cash on delivery, always.
          </p>
        </div>
      </div>

      <p className="hl-section-label">Safety Rules</p>
      <div className="hl-card" style={{ marginBottom: '24px' }}>
        {rules.map((r, i) => (
          <div key={i} className="hl-tip">
            <div className="hl-tip-icon" style={{ background: r.bg }}>
              <span style={{ fontSize: '20px' }}>{r.icon}</span>
            </div>
            <div>
              <p className="hl-tip-title">{r.title}</p>
              <p className="hl-tip-body">{r.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="hl-section-label">🚩 Red Flags — Walk Away Immediately</p>
      <div className="hl-card" style={{ marginBottom: '24px', border: '1px solid #fee2e2' }}>
        {redFlags.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', padding: '13px 20px', borderBottom: i < redFlags.length - 1 ? '1px solid #fef2f2' : 'none', alignItems: 'flex-start' }}>
            <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>✕</span>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#374151', lineHeight: 1.65 }}>{f}</p>
          </div>
        ))}
      </div>

      <p className="hl-section-label">Emergency Contacts</p>
      <div className="hl-card" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Zimbabwe Republic Police', value: '999 or 995', icon: '🚔' },
          { label: 'Scalablenexus Support', value: '+91 73030 15894', icon: '📱' },
          { label: 'Email Support', value: 'support@scalablenexus.co.zw', icon: '📧' },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '18px' }}>{c.icon}</span>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{c.label}</p>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#0f172a', fontWeight: 800 }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="hl-cta">
        <p className="hl-cta-title">Something suspicious?</p>
        <p className="hl-cta-sub">Report any listing or user. Our team investigates within 48 hours.</p>
        <Link to="/help/contact" className="hl-cta-btn" style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)' }}>
          🚩 Report Now
        </Link>
      </div>

      <div className="hl-footer">
        <p className="hl-footer-brand">Scalable<span>nexus</span></p>
        <p className="hl-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
      </div>
    </HelpLayout>
  )
}