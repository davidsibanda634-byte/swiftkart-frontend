import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function HowToBuy() {
  const navigate = useNavigate()

  const steps = [
    {
      num: '01',
      icon: '🔍',
      title: 'Browse or Search',
      body: 'Open the Marketplace, Services, Jobs, Events or Accommodation section. Use the search bar to find something specific, or browse by category. You can filter by price, city, and category to narrow results.'
    },
    {
      num: '02',
      icon: '👀',
      title: 'View the Listing',
      body: 'Click on any listing to see the full details — description, photos, price, location, and seller information. Read the description carefully and check all photos before contacting the seller.'
    },
    {
      num: '03',
      icon: '💬',
      title: 'Contact the Seller on WhatsApp',
      body: 'When you\'re ready, tap the "Contact on WhatsApp" button. This opens WhatsApp with a pre-written message. Introduce yourself, ask any questions, and agree on a meeting time and place.'
    },
    {
      num: '04',
      icon: '📍',
      title: 'Agree on a Safe Meeting Spot',
      body: 'Always meet in a public, well-lit location — the campus library entrance, student union, security desk, or a busy campus area. Never meet in a private or unfamiliar location.'
    },
    {
      num: '05',
      icon: '🔎',
      title: 'Inspect Before You Pay',
      body: 'When you meet the seller, inspect the item carefully before handing over any money. Test electronics. Check clothing for defects. Make sure the item matches what was described and shown in photos.'
    },
    {
      num: '06',
      icon: '💵',
      title: 'Pay Cash on Delivery',
      body: 'Scalablenexus uses cash on delivery. Pay only after you have received and inspected the item and are satisfied. Never send money in advance via EcoCash, bank transfer, or any other method before seeing the item.'
    },
  ]

  const tips = [
    { icon: '⚠️', tip: 'Never send money in advance — this is the most common scam on any marketplace platform.' },
    { icon: '📸', tip: 'Ask for additional photos if the listing only has one or two — genuine sellers are happy to provide more.' },
    { icon: '🕐', tip: 'If a seller is unresponsive or pressures you to decide quickly, be cautious.' },
    { icon: '👥', tip: 'Bring a friend to the meeting, especially for higher-value items.' },
    { icon: '🚫', tip: 'If a deal seems too good to be true, it probably is. Trust your instincts.' },
    { icon: '🚩', tip: 'Report any suspicious listings using the Report button on the listing page.' },
  ]

  return (
    <HelpPage
      title="How to Buy"
      icon="🛍️"
      subtitle="A step-by-step guide to buying safely on Scalablenexus"
      navigate={navigate}
      color="#00C896"
    >
      <Section label="Step by Step">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#00C896,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '12px', flexShrink: 0 }}>
                {s.num}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '16px' }}>{s.icon}</span>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{s.title}</p>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.75 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Buyer Safety Tips">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tips.map((t, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{t.icon}</span>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#374151', lineHeight: 1.7 }}>{t.tip}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTACard
        title="Something went wrong?"
        sub="Our support team is here to help with any transaction issues."
        btnLabel="Contact Support"
        btnTo="/help/contact"
        color="#00C896"
      />
    </HelpPage>
  )
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '11px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 12px' }}>{label}</p>
      {children}
    </div>
  )
}

function CTACard({ title, sub, btnLabel, btnTo, color }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,#08162F,#0f2167)', borderRadius: '16px', padding: '22px', textAlign: 'center', marginBottom: '20px' }}>
      <p style={{ fontSize: '16px', fontWeight: 800, color: 'white', margin: '0 0 6px' }}>{title}</p>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px' }}>{sub}</p>
      <Link to={btnTo} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `linear-gradient(135deg,${color},#059669)`, color: 'white', borderRadius: '50px', padding: '11px 22px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
        {btnLabel} →
      </Link>
    </div>
  )
}

function HelpPage({ title, icon, subtitle, navigate, color, children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hp-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .hp-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 20px 32px; }
        .hp-header-inner { max-width: 760px; margin: 0 auto; }
        .hp-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s; }
        .hp-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .hp-header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
        .hp-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .hp-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }
        .hp-content { max-width: 760px; margin: 0 auto; padding: 24px 20px 100px; }
        @media (max-width: 768px) { .hp-content { padding: 16px 14px 100px; } .hp-header { padding: 20px 16px 24px; } }
      `}</style>
      <div className="hp-root">
        <div className="hp-header">
          <div className="hp-header-inner">
            <button className="hp-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="hp-header-icon">{icon}</div>
            <h1 className="hp-title">{title}</h1>
            <p className="hp-sub">{subtitle}</p>
          </div>
        </div>
        <div className="hp-content">{children}</div>
      </div>
    </>
  )
}