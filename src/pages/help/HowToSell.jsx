import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function HowToSell() {
  const navigate = useNavigate()

  const steps = [
    {
      num: '01', icon: '📝', title: 'Create an Account',
      body: 'Register on Scalablenexus with your name, email, phone number and campus. Registration is free and takes less than 2 minutes.'
    },
    {
      num: '02', icon: '📌', title: 'Tap Post a Listing',
      body: 'Tap the ➕ button at the bottom of the screen or go to Post a Listing from your profile. Choose what you\'re posting — Item, Service, Job, Event, or Property.'
    },
    {
      num: '03', icon: '📸', title: 'Add a Great Title, Description & Photos',
      body: 'Write a clear, honest title. Describe the item accurately including any defects. Upload up to 5 clear photos — listings with photos get 3× more interest. Good lighting and multiple angles make a big difference.'
    },
    {
      num: '04', icon: '💰', title: 'Set a Fair Price',
      body: 'Research what similar items sell for on the Platform. Price fairly — overpriced items get ignored, underpriced items sell too fast. You can always negotiate with buyers on WhatsApp.'
    },
    {
      num: '05', icon: '📍', title: 'Add Your Location',
      body: 'Add your country, city, and campus area. Buyers prefer listings close to them. Being specific about your location builds trust and reduces time-wasting enquiries.'
    },
    {
      num: '06', icon: '✅', title: 'Publish & Wait for WhatsApp Messages',
      body: 'Hit Publish — your listing goes live immediately. Interested buyers will contact you directly on WhatsApp. Respond promptly and professionally. Agree on a time and safe meeting place.'
    },
    {
      num: '07', icon: '🤝', title: 'Meet, Hand Over, Get Paid',
      body: 'Meet the buyer in a safe, public location. Hand over the item, collect your cash. Done. Mark your listing as sold or delete it from My Listings to keep the Platform clean.'
    },
  ]

  const tips = [
    { icon: '📸', tip: 'Photos are everything. Clean your item, find good natural lighting, and take photos from multiple angles.' },
    { icon: '✏️', tip: 'Be honest about defects. Buyers who feel misled leave bad impressions and waste your time.' },
    { icon: '⚡', tip: 'Reply quickly on WhatsApp. Buyers move on if you don\'t respond within a few hours.' },
    { icon: '🔄', tip: 'Re-post your listing if it hasn\'t sold in 2 weeks. Fresh listings appear higher in results.' },
    { icon: '💬', tip: 'Be professional and friendly on WhatsApp. First impressions matter even in a campus marketplace.' },
    { icon: '🗑️', tip: 'Delete or mark as sold once your item is gone. Stale listings frustrate buyers and hurt the Platform.' },
  ]

  return (
    <HelpPage title="How to Sell" icon="🏪" subtitle="Start earning from your campus community today" navigate={navigate}>
      <Section label="Step by Step">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '12px', flexShrink: 0 }}>
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

      <Section label="Seller Tips">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tips.map((t, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{t.icon}</span>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#374151', lineHeight: 1.7 }}>{t.tip}</p>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>What Can You Sell?</p>
        {[
          { icon: '🛍️', label: 'Items', desc: 'Fashion, electronics, furniture, food, vehicles, cosmetics and more' },
          { icon: '🧑‍💼', label: 'Services', desc: 'Tutoring, design, photography, tech help, writing and more' },
          { icon: '💼', label: 'Jobs', desc: 'Post internships, part-time roles, freelance gigs or volunteer positions' },
          { icon: '🎉', label: 'Events', desc: 'Promote workshops, concerts, social gatherings and campus activities' },
          { icon: '🏠', label: 'Properties', desc: 'List rooms, apartments and houses for rent or sale near campus' },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f8fafc' : 'none' }}>
            <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{c.icon}</span>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{c.label}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <CTACard title="Ready to start selling?" sub="It's free, takes 2 minutes, and your listing goes live immediately." btnLabel="Post a Listing" btnTo="/create" color="#7c3aed" />
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
      <Link to={btnTo} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `linear-gradient(135deg,${color},#6d28d9)`, color: 'white', borderRadius: '50px', padding: '11px 22px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
        {btnLabel} →
      </Link>
    </div>
  )
}

function HelpPage({ title, icon, subtitle, navigate, children }) {
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