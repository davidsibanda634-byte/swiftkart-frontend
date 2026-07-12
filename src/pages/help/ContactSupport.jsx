import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function ContactSupport() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const waText = `*Scalablenexus Support Request*\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`
    window.open('https://wa.me/2637700000000?text=' + encodeURIComponent(waText), '_blank')
    setSubmitted(true)
  }

  const channels = [
    {
      icon: '📱', color: '#25d366', bg: '#dcfce7',
      title: 'WhatsApp Support',
      body: 'Fastest response. Send us a WhatsApp message and we typically respond within 2 hours during business hours.',
      action: 'Chat on WhatsApp',
      href: 'https://wa.me/2637700000000'
    },
    {
      icon: '📧', color: '#2563EB', bg: '#eff6ff',
      title: 'Email Support',
      body: 'For detailed issues, complaints, or formal requests. We respond within 24-48 hours.',
      action: 'Send Email',
      href: 'mailto:support@scalablenexus.co.zw'
    },
  ]

  const faqs = [
    { q: 'How do I delete my listing?', a: 'Go to My Listings from the Profile Menu, find your listing, and tap the Delete button.' },
    { q: 'Someone scammed me — what do I do?', a: 'Report the user and listing using the Report button. Contact Zimbabwe Republic Police (999) if money was lost. Then contact our support team.' },
    { q: 'My listing was removed. Why?', a: 'Listings are removed when they violate our Terms of Use or Community Guidelines. Check your email for a notice from our moderation team.' },
    { q: 'How do I change my phone number?', a: 'Edit your profile from the Profile Menu. Update your WhatsApp number there.' },
    { q: 'How do I report a fake listing?', a: 'Open the listing and tap the Report button. Our team reviews all reports within 48 hours.' },
    { q: 'Is Scalablenexus free to use?', a: 'Yes — completely free to register, browse, and post listings. We do not charge commission on any transactions.' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .cs-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .cs-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 20px 32px; }
        .cs-header-inner { max-width: 760px; margin: 0 auto; }
        .cs-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s; }
        .cs-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .cs-header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
        .cs-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .cs-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }
        .cs-content { max-width: 760px; margin: 0 auto; padding: 24px 20px 100px; }
        .cs-label { font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 12px; }
        .cs-input { width: 100%; padding: 12px 14px; background: white; border: 1.5px solid #e2e8f0; border-radius: 11px; font-size: 13.5px; color: #1f2937; outline: none; box-sizing: border-box; font-family: inherit; transition: all 0.2s; }
        .cs-input:focus { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .cs-input::placeholder { color: #9ca3af; }
        .cs-submit { width: 100%; padding: 14px; background: linear-gradient(135deg,#00C896,#059669); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; margin-top: 4px; box-shadow: 0 6px 20px rgba(0,200,150,0.35); transition: all 0.2s; }
        .cs-submit:hover { transform: translateY(-1px); }
        .cs-faq-item { background: white; border-radius: 12px; padding: 16px 18px; margin-bottom: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; }
        .cs-faq-q { font-size: 13.5px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
        .cs-faq-a { font-size: 13px; color: #6b7280; line-height: 1.7; margin: 0; }
        @media (max-width: 768px) { .cs-content { padding: 16px 14px 100px; } .cs-header { padding: 20px 16px 24px; } }
      `}</style>

      <div className="cs-root">
        <div className="cs-header">
          <div className="cs-header-inner">
            <button className="cs-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="cs-header-icon">💬</div>
            <h1 className="cs-title">Contact Support</h1>
            <p className="cs-sub">We're here to help — reach out any time</p>
          </div>
        </div>

        <div className="cs-content">

          <p className="cs-label">Get in Touch</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {channels.map((c, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{c.title}</p>
                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{c.body}</p>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: c.color, color: 'white', padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                    {c.action} →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="cs-label">Send Us a Message</p>
          {submitted ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '28px', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Message sent on WhatsApp!</p>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>We've opened WhatsApp with your message. We'll respond within 2 hours during business hours.</p>
              <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: '1px solid #00C896', color: '#059669', padding: '8px 18px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Your Name *</label>
                <input className="cs-input" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email Address *</label>
                <input className="cs-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Subject *</label>
                <input className="cs-input" name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Listing removed, account issue, scam report" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Message *</label>
                <textarea className="cs-input" name="message" value={form.message} onChange={handleChange} placeholder="Describe your issue in detail..." rows={4} style={{ resize: 'vertical' }} required />
              </div>
              <button type="submit" className="cs-submit">📱 Send via WhatsApp</button>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', textAlign: 'center', margin: 0 }}>This will open WhatsApp with your message pre-filled</p>
            </form>
          )}

          <p className="cs-label">Frequently Asked Questions</p>
          <div style={{ marginBottom: '20px' }}>
            {faqs.map((f, i) => (
              <div key={i} className="cs-faq-item">
                <p className="cs-faq-q">❓ {f.q}</p>
                <p className="cs-faq-a">{f.a}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px 18px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 4px' }}>Business Hours</p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Monday – Saturday, 8am – 8pm CAT</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>We aim to respond to all messages within 2 hours during business hours</p>
          </div>

        </div>
      </div>
    </>
  )
}