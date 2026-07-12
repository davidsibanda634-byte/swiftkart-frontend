import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HelpLayout from '../../components/HelpLayout'

const bugCategories = [
  { key: 'display', icon: '🖥️', label: 'Display / Layout' },
  { key: 'crash', icon: '💥', label: 'App Crash / Error' },
  { key: 'login', icon: '🔐', label: 'Login / Account' },
  { key: 'listing', icon: '🛍️', label: 'Listing Not Working' },
  { key: 'images', icon: '📸', label: 'Images Not Loading' },
  { key: 'performance', icon: '🐌', label: 'Slow Performance' },
  { key: 'whatsapp', icon: '📱', label: 'WhatsApp Button' },
  { key: 'other', icon: '🔧', label: 'Other' },
]

const knownIssues = [
  { issue: 'Slow loading on first visit', status: 'Known — backend wakes after inactivity (30–60 sec)', color: '#d97706', bg: '#fffbeb' },
  { issue: 'Images slow to load on slow data', status: 'Known — CDN delays on slow connections', color: '#d97706', bg: '#fffbeb' },
  { issue: 'PWA install prompt not showing', status: 'Chrome and Edge support best — varies by browser', color: '#2563EB', bg: '#eff6ff' },
]

export default function ReportBug() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', device: '', page: '', description: '', steps: '' })
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const waText = `*🐛 Bug Report — Scalablenexus*\n\nName: ${form.name}\nEmail: ${form.email}\nCategory: ${category}\nDevice: ${form.device}\nPage/Feature: ${form.page}\n\nWhat happened:\n${form.description}\n\nSteps to Reproduce:\n${form.steps}`
    window.open('https://wa.me/917303015894?text=' + encodeURIComponent(waText), '_blank')
    setSubmitted(true)
  }

  return (
    <HelpLayout icon="🐛" title="Report a Bug" subtitle="Help us improve Scalablenexus — every report makes the platform better" accentColor="#f59e0b" navigate={navigate}>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '16px 18px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '22px', flexShrink: 0 }}>💡</span>
        <p style={{ margin: 0, fontSize: '13px', color: '#92400e', lineHeight: 1.75 }}>
          Check the Known Issues list below first — your issue may already be on our radar. The more detail you provide, the faster we can fix it.
        </p>
      </div>

      <p className="hl-section-label">Known Issues</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {knownIssues.map((k, i) => (
          <div key={i} style={{ background: k.bg, border: `1px solid ${k.color}40`, borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>📌</span>
            <div>
              <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{k.issue}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: k.color, fontWeight: 600 }}>{k.status}</p>
            </div>
          </div>
        ))}
      </div>

      {submitted ? (
        <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '52px', marginBottom: '14px' }}>🙏</div>
          <p style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Bug report sent!</p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 18px' }}>Thank you for helping us improve. We\'ll investigate and fix this as soon as possible.</p>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', device: '', page: '', description: '', steps: '' }); setCategory('') }} style={{ background: 'none', border: '1.5px solid #f59e0b', color: '#d97706', padding: '9px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Report Another Bug
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="hl-section-label">Bug Category *</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {bugCategories.map(c => (
              <button
                key={c.key} type="button"
                onClick={() => setCategory(c.key)}
                style={{ padding: '12px 14px', borderRadius: '11px', border: `1.5px solid ${category === c.key ? '#f59e0b' : '#e2e8f0'}`, background: category === c.key ? '#fffbeb' : 'white', color: category === c.key ? '#92400e' : '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: '18px' }}>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <p className="hl-section-label">Your Details</p>
          <div className="hl-form-card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="hl-label-text">Name *</label>
                <input className="hl-input" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
              </div>
              <div>
                <label className="hl-label-text">Email *</label>
                <input className="hl-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="hl-label-text">Device & Browser</label>
                <input className="hl-input" name="device" value={form.device} onChange={handleChange} placeholder="e.g. Samsung A32, Chrome" />
              </div>
              <div>
                <label className="hl-label-text">Page / Feature</label>
                <input className="hl-input" name="page" value={form.page} onChange={handleChange} placeholder="e.g. Marketplace, Login" />
              </div>
            </div>
          </div>

          <p className="hl-section-label">Bug Details</p>
          <div className="hl-form-card" style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label className="hl-label-text">What happened? *</label>
              <textarea className="hl-input" name="description" value={form.description} onChange={handleChange} placeholder="What did you see? What did you expect to see?" rows={3} style={{ resize: 'vertical' }} required />
            </div>
            <div>
              <label className="hl-label-text">Steps to Reproduce</label>
              <textarea className="hl-input" name="steps" value={form.steps} onChange={handleChange} placeholder="e.g. 1. Open Marketplace 2. Tap Electronics 3. App crashes" rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <button type="submit" disabled={!category} style={{ width: '100%', padding: '14px', background: category ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#e2e8f0', color: category ? '#1e3a5f' : '#9ca3af', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: category ? 'pointer' : 'not-allowed', fontFamily: 'inherit', boxShadow: category ? '0 6px 20px rgba(245,158,11,0.35)' : 'none', transition: 'all 0.2s' }}>
            🐛 Submit Bug Report via WhatsApp
          </button>
          <p style={{ fontSize: '11.5px', color: '#9ca3af', textAlign: 'center', margin: '10px 0 0' }}>Opens WhatsApp with your report pre-filled</p>
        </form>
      )}

      <div className="hl-footer" style={{ marginTop: '24px' }}>
        <p className="hl-footer-brand">Scalable<span>nexus</span></p>
        <p className="hl-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
      </div>
    </HelpLayout>
  )
}