import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import HelpLayout from '../../components/HelpLayout'

const steps = [
  { num: '01', icon: '📝', title: 'Create a Free Account', body: 'Register with your name, email, phone and campus. It\'s free and takes under 2 minutes.' },
  { num: '02', icon: '📌', title: 'Tap Post a Listing', body: 'Tap ➕ at the bottom of the screen. Choose what you\'re posting — Item, Service, Job, Event, or Property.' },
  { num: '03', icon: '📸', title: 'Add Photos & Description', body: 'Write a clear, honest title and description. Upload up to 5 clear photos — listings with photos get 3× more interest. Good lighting and multiple angles make a huge difference.' },
  { num: '04', icon: '💰', title: 'Set a Fair Price', body: 'Check what similar items sell for on the platform. Price fairly — overpriced listings get ignored, underpriced ones sell instantly. You can always negotiate on WhatsApp.' },
  { num: '05', icon: '📍', title: 'Add Your Location', body: 'Add your country, city and campus area. Buyers prefer listings near them. Being specific builds trust and reduces wasted enquiries.' },
  { num: '06', icon: '✅', title: 'Publish — Go Live Instantly', body: 'Tap Publish and your listing appears immediately. Interested buyers will WhatsApp you. Respond promptly and agree on a meeting place.' },
  { num: '07', icon: '🤝', title: 'Meet, Hand Over, Get Paid', body: 'Meet at a safe, public location. Hand over the item, collect your cash. Mark as sold or delete from My Listings once done.' },
]

const tips = [
  { icon: '📸', bg: '#eff6ff', title: 'Photos are everything', body: 'Clean your item, find natural lighting, multiple angles. The first photo is your thumbnail.' },
  { icon: '✏️', bg: '#f0fdf4', title: 'Be honest about defects', body: 'Buyers who feel misled waste your time and leave a bad impression. Honesty builds trust.' },
  { icon: '⚡', bg: '#fffbeb', title: 'Reply fast on WhatsApp', body: 'Buyers move on quickly. Responding within an hour dramatically increases your conversion rate.' },
  { icon: '🔄', bg: '#f0fdf4', title: 'Re-post if not selling', body: 'If your listing hasn\'t sold in 2 weeks, delete and repost. Fresh listings appear higher in results.' },
  { icon: '🗑️', bg: '#fef2f2', title: 'Delete when sold', body: 'Remove sold listings promptly. Stale listings frustrate buyers and harm the platform.' },
]

const canSell = [
  { icon: '🛍️', label: 'Items', desc: 'Fashion, electronics, furniture, food, vehicles, cosmetics and more' },
  { icon: '🧑‍💼', label: 'Services', desc: 'Tutoring, design, photography, tech help, writing and more' },
  { icon: '💼', label: 'Jobs', desc: 'Internships, part-time roles, freelance gigs, volunteer positions' },
  { icon: '🎉', label: 'Events', desc: 'Workshops, concerts, social gatherings and campus activities' },
  { icon: '🏠', label: 'Properties', desc: 'Rooms, apartments and houses for rent or sale near campus' },
]

export default function HowToSell() {
  const navigate = useNavigate()
  return (
    <HelpLayout icon="🏪" title="How to Sell" subtitle="Start earning from your campus community — it's free and takes 2 minutes" accentColor="#7c3aed" navigate={navigate}>

      <p className="hl-section-label">Step by Step Guide</p>
      <div className="hl-card" style={{ marginBottom: '24px' }}>
        {steps.map((s, i) => (
          <div key={i} className="hl-step">
            <div className="hl-step-num" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>{s.num}</div>
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

      <p className="hl-section-label">Seller Tips</p>
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

      <p className="hl-section-label">What Can You Sell?</p>
      <div className="hl-card" style={{ marginBottom: '24px' }}>
        {canSell.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 20px', borderBottom: i < canSell.length - 1 ? '1px solid #f8fafc' : 'none' }}>
            <span style={{ fontSize: '24px', width: '32px', textAlign: 'center', flexShrink: 0 }}>{c.icon}</span>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{c.label}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#9ca3af' }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="hl-cta">
        <p className="hl-cta-title">Ready to start selling?</p>
        <p className="hl-cta-sub">Free to post. Goes live immediately. No commission.</p>
        <Link to="/create" className="hl-cta-btn" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
          📌 Post a Listing
        </Link>
      </div>

      <div className="hl-footer">
        <p className="hl-footer-brand">Scalable<span>nexus</span></p>
        <p className="hl-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
      </div>
    </HelpLayout>
  )
}