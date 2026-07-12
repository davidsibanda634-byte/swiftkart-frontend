import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function StayingSafe() {
  const navigate = useNavigate()

  const rules = [
    { icon: '📍', color: '#00C896', bg: '#ecfdf5', title: 'Always Meet in Public', body: 'Meet at the campus library entrance, student union, security desk, or a busy area. Never in a private home, car, or unfamiliar location — even if the seller insists it\'s more convenient.' },
    { icon: '💵', color: '#d97706', bg: '#fffbeb', title: 'Never Send Money First', body: 'Cash on delivery only. Never EcoCash, bank transfer, or any advance payment before you have physically received and inspected the item. This is how 99% of marketplace scams work.' },
    { icon: '👥', color: '#2563EB', bg: '#eff6ff', title: 'Bring a Friend', body: 'Especially for higher-value items. Having someone with you deters bad actors and gives you confidence to walk away if something feels off.' },
    { icon: '🔎', color: '#7c3aed', bg: '#f5f3ff', title: 'Inspect Before Paying', body: 'Test electronics. Try on clothing. Check for defects, damage, or differences from photos. Once you pay, the transaction is done. Take your time — a genuine seller will not rush you.' },
    { icon: '📞', color: '#be185d', bg: '#fdf2f8', title: 'Verify Before You Go', body: 'Chat with the seller on WhatsApp before meeting. Ask questions. Genuine sellers are patient and transparent. If they avoid questions or pressure you, that is a red flag.' },
    { icon: '🚩', color: '#dc2626', bg: '#fef2f2', title: 'Know the Warning Signs', body: 'Price too good to be true. Seller insists on advance payment. Seller can\'t provide more photos. Seller wants to meet in a private location. Seller is overly pushy or aggressive. Trust your gut.' },
    { icon: '📱', color: '#0f4c81', bg: '#eff6ff', title: 'Keep WhatsApp Records', body: 'Don\'t delete your conversation with the seller before the transaction is complete. If something goes wrong, your WhatsApp history is your evidence.' },
    { icon: '🚨', color: '#dc2626', bg: '#fef2f2', title: 'If Something Goes Wrong', body: 'Report the user and listing immediately using the Report button on Scalablenexus. If you have been defrauded, report it to Zimbabwe Republic Police and contact our support team.' },
  ]

  const redFlags = [
    'Price dramatically below market value',
    'Seller asks for EcoCash or bank transfer in advance',
    'Seller refuses to provide additional photos',
    'Seller insists on meeting at a home or private location',
    'Seller becomes aggressive or threatening when questioned',
    'Listing photos look like they\'re taken from the internet',
    'Seller claims to be out of the country and needs to "ship" the item',
    'Seller asks for your ID, bank details, or OTP code',
  ]

  return (
    <HelpPage title="Staying Safe" icon="🔒" subtitle="Your safety is our top priority on Scalablenexus" navigate={navigate}>

      <div style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)', borderRadius: '16px', padding: '18px 20px', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '28px', flexShrink: 0 }}>⚠️</span>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: 'white' }}>The Golden Rule</p>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            Never send money before receiving and inspecting your item in person. This is how all marketplace scams work. Cash on delivery only.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 12px' }}>Safety Rules</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rules.map((r, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {r.icon}
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{r.title}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.75 }}>{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 12px' }}>🚩 Red Flags — Walk Away Immediately</p>
        <div style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #fee2e2' }}>
          {redFlags.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 0', borderBottom: i < redFlags.length - 1 ? '1px solid #fef2f2' : 'none' }}>
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>✕</span>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#374151', lineHeight: 1.65 }}>{f}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>🆘 Emergency Contacts Zimbabwe</p>
        {[
          { label: 'Zimbabwe Republic Police', value: '999 or 995' },
          { label: 'Scalablenexus Support', value: 'support@scalablenexus.co.zw' },
          { label: 'WhatsApp Support', value: '+263 77 000 0000' },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{c.label}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(135deg,#08162F,#0f2167)', borderRadius: '16px', padding: '22px', textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', fontWeight: 800, color: 'white', margin: '0 0 6px' }}>Something suspicious?</p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px' }}>Report any listing or user and our team will investigate within 48 hours.</p>
        <Link to="/help/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: 'white', borderRadius: '50px', padding: '11px 22px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          🚩 Report Now
        </Link>
      </div>
    </HelpPage>
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