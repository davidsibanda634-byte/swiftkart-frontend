import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const JOB_CATEGORIES = ['Internship', 'Part-Time', 'Full-Time', 'Freelance', 'Volunteer', 'Other']

export default function EditJob() {
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Internship',
    company: '',
    phone: '',
    location: { country: '', city: '', area: '' }
  })

  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate('/login'); return }
    api.get('/jobs/' + id)
      .then(res => {
        const data = res.data
        const ownerId = data.user?._id || data.user
        if (ownerId !== user._id) { navigate('/'); return }
        setForm({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Internship',
          company: data.company || '',
          phone: data.phone || '',
          location: {
            country: data.location?.country || '',
            city: data.location?.city || '',
            area: data.location?.area || ''
          }
        })
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, authReady])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleLocation(e) {
    setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    api.put('/jobs/' + id, form)
      .then(() => {
        setSuccess('Job updated successfully!')
        setTimeout(() => navigate('/my-listings'), 1500)
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to update.'))
      .finally(() => setSaving(false))
  }

  if (!authReady || loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08162F' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Loading...</p>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ej-bg { min-height:100vh; font-family:'Plus Jakarta Sans',sans-serif; padding:24px 16px 80px; background-image:linear-gradient(to bottom,rgba(8,14,40,0.88) 0%,rgba(10,20,55,0.82) 50%,rgba(8,14,40,0.92) 100%),url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80'); background-size:cover; background-position:center; background-attachment:fixed; }
        .ej-inner { max-width:560px; margin:0 auto; }
        .ej-back { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white; padding:8px 16px; border-radius:10px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:5px; margin-bottom:20px; transition:all 0.2s; }
        .ej-back:hover { background:rgba(255,255,255,0.18); }
        .ej-card { background:rgba(255,255,255,0.07); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-radius:24px; border:1px solid rgba(255,255,255,0.14); padding:32px 28px; box-shadow:0 24px 64px rgba(0,0,0,0.4); }
        .ej-header { text-align:center; margin-bottom:28px; }
        .ej-header-icon { width:52px; height:52px; background:linear-gradient(135deg,#d97706,#b45309); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 14px; box-shadow:0 8px 24px rgba(217,119,6,0.4); }
        .ej-title { font-size:21px; font-weight:800; color:white; margin:0 0 5px; letter-spacing:-0.4px; }
        .ej-sub { font-size:13px; color:rgba(255,255,255,0.55); margin:0; }
        .ej-label { display:block; font-size:12px; font-weight:600; color:rgba(255,255,255,0.72); margin-bottom:7px; }
        .ej-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.16); border-radius:11px; font-size:13.5px; color:white; outline:none; box-sizing:border-box; font-family:inherit; transition:all 0.2s; }
        .ej-input::placeholder { color:rgba(255,255,255,0.32); }
        .ej-input:focus { border-color:#d97706; background:rgba(255,255,255,0.14); box-shadow:0 0 0 3px rgba(217,119,6,0.15); }
        .ej-field { margin-bottom:15px; }
        .ej-hint { font-size:10.5px; color:rgba(255,255,255,0.38); margin-top:4px; }
        .ej-cat-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:4px; }
        .ej-cat-btn { padding:9px 10px; border-radius:9px; border:1.5px solid rgba(255,255,255,0.13); background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.6); font-weight:500; font-size:12px; cursor:pointer; font-family:inherit; text-align:left; transition:all 0.2s; }
        .ej-cat-btn.active { border-color:#d97706; background:rgba(217,119,6,0.15); color:#fcd34d; }
        .ej-cat-btn:hover { border-color:rgba(255,255,255,0.28); color:white; }
        .ej-section-label { font-size:11px; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.8px; margin:18px 0 10px; }
        .ej-location-group { display:flex; flex-direction:column; gap:8px; }
        .ej-error { background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.35); color:#fca5a5; padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:16px; }
        .ej-success { background:rgba(217,119,6,0.15); border:1px solid rgba(217,119,6,0.35); color:#fcd34d; padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:16px; }
        .ej-btn-row { display:flex; gap:10px; margin-top:22px; }
        .ej-cancel-btn { flex:1; background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.15); padding:13px; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; }
        .ej-cancel-btn:hover { background:rgba(255,255,255,0.14); }
        .ej-save-btn { flex:2; background:linear-gradient(135deg,#d97706,#b45309); color:white; border:none; padding:13px; border-radius:12px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit; box-shadow:0 6px 20px rgba(217,119,6,0.4); transition:all 0.2s; }
        .ej-save-btn:hover { transform:translateY(-1px); }
        .ej-save-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        @media(max-width:480px){ .ej-card { padding:24px 16px; } }
      `}</style>

      <div className="ej-bg">
        <div className="ej-inner">
          <button className="ej-back" onClick={() => navigate('/my-listings')}>← My Listings</button>
          <div className="ej-card">
            <div className="ej-header">
              <div className="ej-header-icon">✏️</div>
              <h1 className="ej-title">Edit Job</h1>
              <p className="ej-sub">Update your job listing details below</p>
            </div>

            {error && <div className="ej-error">{error}</div>}
            {success && <div className="ej-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="ej-field">
                <label className="ej-label">Title *</label>
                <input className="ej-input" type="text" name="title" value={form.title} onChange={handleChange} placeholder="Job title" required />
              </div>
              <div className="ej-field">
                <label className="ej-label">Description</label>
                <textarea className="ej-input" name="description" value={form.description} onChange={handleChange} placeholder="Describe the job..." rows={4} style={{ resize: 'vertical' }} />
              </div>
              <div className="ej-field">
                <label className="ej-label">Job Category *</label>
                <div className="ej-cat-grid">
                  {JOB_CATEGORIES.map(cat => (
                    <button key={cat} type="button"
                      className={'ej-cat-btn' + (form.category === cat ? ' active' : '')}
                      onClick={() => setForm({ ...form, category: cat })}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ej-field">
                <label className="ej-label">Company / Organization</label>
                <input className="ej-input" type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
              </div>
              <div className="ej-field">
                <label className="ej-label">WhatsApp Number *</label>
                <input className="ej-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+263771234567" required />
                <p className="ej-hint">Include country code e.g. +263 Zimbabwe</p>
              </div>
              <p className="ej-section-label">Location</p>
              <div className="ej-location-group">
                <input className="ej-input" type="text" name="country" value={form.location.country} onChange={handleLocation} placeholder="Country" required />
                <input className="ej-input" type="text" name="city" value={form.location.city} onChange={handleLocation} placeholder="City" required />
                <input className="ej-input" type="text" name="area" value={form.location.area} onChange={handleLocation} placeholder="Area / Campus (optional)" />
              </div>
              <div className="ej-btn-row">
                <button type="button" className="ej-cancel-btn" onClick={() => navigate('/my-listings')}>Cancel</button>
                <button type="submit" className="ej-save-btn" disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}