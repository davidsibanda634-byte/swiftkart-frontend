import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HelpLayout from '../../components/HelpLayout'

const faqs = [
  { q: 'How do I delete my listing?', a: 'Go to My Listings from the Profile Menu, find your listing, and tap the Delete button.' },
  { q: 'Someone scammed me — what do I do?', a: 'Report the user and listing using the Report button. Contact Zimbabwe Republic Police (999) if money was lost. Then contact our support team.' },
  { q: 'My listing was removed. Why?', a: 'Listings are removed when they violate our Terms of Use or Community Guidelines. Check your email for a notice from our moderation team.' },
  { q: 'How do I update my phone number?', a: 'Edit your profile from the Profile Menu. Update your WhatsApp number there.' },
  { q: 'How do I report a suspicious listing?', a: 'Open the listing and tap the Report button. Our team reviews all reports within 48 hours.' },
  { q: 'Is Scalablenexus free?', a: 'Yes — completely free to register, browse, and post listings. No commission on any transactions.' },
]

export default function ContactSupport() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const waText = `*Scalablenexus Support Request*\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`
    window.open('https://wa.me/917303015894?text=' + encodeURIComponent(waText), '_blank')
    setSubmitted(true)
  }

  return (
    <HelpLayout icon="💬" title="Contact Support" subtitle="We're here to help — reach out via WhatsApp or email" accentColor="#2563EB" navigate={navigate}>

      <p className="hl-section-label">Get in Touch</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { icon: '📱', color: '#25d366', bg: '#dcfce7', title: 'WhatsApp', body: 'Fastest — typically within 2 hours', value: '+91 73030 15894', href: 'https://wa.me/917303015894', btn: 'Chat Now' },
          { icon: '📧', color: '#2563EB', bg: '#eff6ff', title: 'Email', body: 'Detailed issues, 24–48h response', value: 'support@scalablenexus.co.zw', href: 'mailto:support@scalablenexus.co.zw', btn: 'Send Email' },
        ].map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>{c.icon}</div>
            <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{c.title}</p>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#9ca3af' }}>{c.body}</p>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>{c.value}</p>
            <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: c.color, color: 'white', padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
              {c.btn} →
            </a>
          </div>
        ))}
      </div>

      <p className="hl-section-label">Send a Message</p>
      {submitted ? (
        <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '52px', marginBottom: '14px' }}>✅</div>
          <p style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Message sent on WhatsApp!</p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 18px' }}>We\'ve opened WhatsApp with your message. We\'ll respond within 2 hours during business hours.</p>
          <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: '1.5px solid #00C896', color: '#059669', padding: '9px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div className="hl-form-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="hl-label-text">Your Name *</label>
                <input className="hl-input" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
              </div>
              <div>
                <label className="hl-label-text">Email Address *</label>
                <input className="hl-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label className="hl-label-text">Subject *</label>
              <input className="hl-input" name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Listing issue, account problem, scam report" required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="hl-label-text">Message *</label>
              <textarea className="hl-input" name="message" value={form.message} onChange={handleChange} placeholder="Describe your issue in detail..." rows={4} style={{ resize: 'vertical' }} required />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#00C896,#059669)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(0,200,150,0.35)', transition: 'all 0.2s' }}>
              📱 Send via WhatsApp
            </button>
            <p style={{ fontSize: '11.5px', color: '#9ca3af', textAlign: 'center', margin: '10px 0 0' }}>Opens WhatsApp with your message pre-filled</p>
          </div>
        </form>
      )}

      <p className="hl-section-label">Frequently Asked Questions</p>
      <div className="hl-card" style={{ marginBottom: '24px' }}>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #f8fafc' : 'none' }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', textAlign: 'left' }}
            >
              <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>❓ {f.q}</p>
              <span style={{ fontSize: '12px', color: '#9ca3af', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>▼</span>
            </button>
            {openFaq === i && (
              <div style={{ padding: '0 20px 16px', fontSize: '13px', color: '#6b7280', lineHeight: 1.75 }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '1px solid #f1f5f9', textAlign: 'center', marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 3px' }}>Business Hours</p>
        <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Monday – Saturday, 8am – 8pm CAT</p>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>WhatsApp responses within 2 hours · Email within 24–48 hours</p>
      </div>

      <div className="hl-footer">
        <p className="hl-footer-brand">Scalable<span>nexus</span></p>
        <p className="hl-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
      </div>
    </HelpLayout>
  )
}