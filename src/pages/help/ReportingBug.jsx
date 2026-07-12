import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    const waText = `*🐛 Bug Report — Scalablenexus*\n\nName: ${form.name}\nEmail: ${form.email}\nCategory: ${category}\nDevice: ${form.device}\nPage/Feature: ${form.page}\n\nDescription:\n${form.description}\n\nSteps to Reproduce:\n${form.steps}`
    window.open('https://wa.me/2637700000000?text=' + encodeURIComponent(waText), '_blank')
    setSubmitted(true)
  }

  const bugCategories = [
    { key: 'display', icon: '🖥️', label: 'Display / Layout Issue' },
    { key: 'crash', icon: '💥', label: 'App Crash or Error' },
    { key: 'login', icon: '🔐', label: 'Login / Account Issue' },
    { key: 'listing', icon: '🛍️', label: 'Listing Not Working' },
    { key: 'images', icon: '📸', label: 'Images Not Loading' },
    { key: 'performance', icon: '🐌', label: 'Slow Performance' },
    { key: 'whatsapp', icon: '📱', label: 'WhatsApp Button Issue' },
    { key: 'other', icon: '🔧', label: 'Other' },
  ]

  const knownIssues = [
    { issue: 'Slow loading on first visit', status: 'Known — backend wakes up after inactivity (30-60 sec wait)', color: '#d97706', bg: '#fffbeb' },
    { issue: 'Images occasionally slow to load', status: 'Known — Cloudinary CDN delays on slow connections', color: '#d97706', bg: '#fffbeb' },
    { issue: 'PWA install prompt not showing', status: 'Varies by browser — Chrome and Edge support best', color: '#2563EB', bg: '#eff6ff' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .rb-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .rb-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 20px 32px; }
        .rb-header-inner { max-width: 760px; margin: 0 auto; }
        .rb-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s; }
        .rb-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .rb-header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
        .rb-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .rb-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }
        .rb-content { max-width: 760px; margin: 0 auto; padding: 24px 20px 100px; }
        .rb-label { font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 12px; }
        .rb-input { width: 100%; padding: 12px 14px; background: white; border: 1.5px solid #e2e8f0; border-radius: 11px; font-size: 13.5px; color: #1f2937; outline: none; box-sizing: border-box; font-family: inherit; transition: all 0.2s; }
        .rb-input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
        .rb-input::placeholder { color: #9ca3af; }
        .rb-cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 4px; }
        .rb-cat-btn { padding: 10px 12px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; color: #374151; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; text-align: left; transition: all 0.2s; display: flex; align-items: center; gap: 7px; }
        .rb-cat-btn:hover { border-color: #f59e0b; }
        .rb-cat-btn.active { border-color: #f59e0b; background: #fffbeb; color: #92400e; }
        .rb-submit { width: 100%; padding: 14px; background: linear-gradient(135deg,#f59e0b,#d97706); color: #1e3a5f; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; margin-top: 4px; box-shadow: 0 6px 20px rgba(245,158,11,0.35); transition: all 0.2s; }
        .rb-submit:hover { transform: translateY(-1px); }
        @media (max-width: 768px) { .rb-content { padding: 16px 14px 100px; } .rb-header { padding: 20px 16px 24px; } }
      `}</style>

      <div className="rb-root">
        <div className="rb-header">
          <div className="rb-header-inner">
            <button className="rb-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="rb-header-icon">🐛</div>
            <h1 className="rb-title">Report a Bug</h1>
            <p className="rb-sub">Help us improve Scalablenexus by reporting issues you find</p>
          </div>
        </div>

        <div className="rb-content">

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>💡</span>
            <p style={{ margin: 0, fontSize: '13px', color: '#92400e', lineHeight: 1.7 }}>
              Before reporting, check the Known Issues section below — your issue may already be on our radar. The more detail you provide, the faster we can fix it.
            </p>
          </div>

          <p className="rb-label">Known Issues</p>
          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {knownIssues.map((k, i) => (
              <div key={i} style={{ background: k.bg, border: `1px solid ${k.color}40`, borderRadius: '12px', padding: '12px 16px' }}>
                <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{k.issue}</p>
                <p style={{ margin: 0, fontSize: '12px', color: k.color, fontWeight: 600 }}>📌 {k.status}</p>
              </div>
            ))}
          </div>

          {submitted ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '28px', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🙏</div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Bug report sent!</p>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>Thank you for helping us improve Scalablenexus. We'll investigate and fix this as soon as possible.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', device: '', page: '', description: '', steps: '' }); setCategory('') }} style={{ background: 'none', border: '1px solid #00C896', color: '#059669', padding: '8px 18px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Report Another Bug
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <p className="rb-label">Bug Category *</p>
                <div className="rb-cat-grid">
                  {bugCategories.map(c => (
                    <button key={c.key} type="button" className={'rb-cat-btn' + (category === c.key ? ' active' : '')} onClick={() => setCategory(c.key)}>
                      <span>{c.icon}</span> {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p className="rb-label" style={{ margin: 0 }}>Your Details</p>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Name *</label>
                  <input className="rb-input" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email *</label>
                  <input className="rb-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Device & Browser</label>
                  <input className="rb-input" name="device" value={form.device} onChange={handleChange} placeholder="e.g. Samsung A32, Chrome / iPhone 12, Safari" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Page or Feature Affected</label>
                  <input className="rb-input" name="page" value={form.page} onChange={handleChange} placeholder="e.g. Marketplace page, Create Listing form, Login" />
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p className="rb-label" style={{ margin: 0 }}>Bug Details</p>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>What happened? *</label>
                  <textarea className="rb-input" name="description" value={form.description} onChange={handleChange} placeholder="Describe what went wrong — what did you see vs what you expected to see?" rows={3} style={{ resize: 'vertical' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Steps to Reproduce</label>
                  <textarea className="rb-input" name="steps" value={form.steps} onChange={handleChange} placeholder="e.g. 1. Go to Marketplace 2. Tap Electronics 3. Tap a listing 4. App crashes" rows={3} style={{ resize: 'vertical' }} />
                </div>
              </div>

              <button type="submit" className="rb-submit" disabled={!category}>
                🐛 Submit Bug Report via WhatsApp
              </button>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', textAlign: 'center', margin: 0 }}>This opens WhatsApp with your report pre-filled — no app download required</p>
            </form>
          )}
        </div>
      </div>
    </>
  )
}