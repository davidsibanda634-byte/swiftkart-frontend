import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function EditService() {
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
    pricePerHour: '',
    phone: '',
    location: { country: '', city: '', area: '' }
  })

  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate('/login'); return }
    api.get('/services/' + id)
      .then(res => {
        const data = res.data
        const ownerId = data.user?._id || data.user
        if (ownerId !== user._id) { navigate('/'); return }
        setForm({
          title: data.title || '',
          description: data.description || '',
          pricePerHour: data.pricePerHour || '',
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
    api.put('/services/' + id, form)
      .then(() => {
        setSuccess('Service updated successfully!')
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
        .es-bg { min-height:100vh; font-family:'Plus Jakarta Sans',sans-serif; padding:24px 16px 80px; background-image: linear-gradient(to bottom,rgba(8,14,40,0.88) 0%,rgba(10,20,55,0.82) 50%,rgba(8,14,40,0.92) 100%), url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80'); background-size:cover; background-position:center; background-attachment:fixed; }
        .es-inner { max-width:560px; margin:0 auto; }
        .es-back { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white; padding:8px 16px; border-radius:10px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:5px; margin-bottom:20px; transition:all 0.2s; backdrop-filter:blur(8px); }
        .es-back:hover { background:rgba(255,255,255,0.18); }
        .es-card { background:rgba(255,255,255,0.07); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-radius:24px; border:1px solid rgba(255,255,255,0.14); padding:32px 28px; box-shadow:0 24px 64px rgba(0,0,0,0.4); }
        .es-header { text-align:center; margin-bottom:28px; }
        .es-header-icon { width:52px; height:52px; background:linear-gradient(135deg,#7c3aed,#6d28d9); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 14px; box-shadow:0 8px 24px rgba(124,58,237,0.4); }
        .es-title { font-size:21px; font-weight:800; color:white; margin:0 0 5px; letter-spacing:-0.4px; }
        .es-sub { font-size:13px; color:rgba(255,255,255,0.55); margin:0; }
        .es-label { display:block; font-size:12px; font-weight:600; color:rgba(255,255,255,0.72); margin-bottom:7px; }
        .es-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.16); border-radius:11px; font-size:13.5px; color:white; outline:none; box-sizing:border-box; font-family:inherit; transition:all 0.2s; }
        .es-input::placeholder { color:rgba(255,255,255,0.32); }
        .es-input:focus { border-color:#7c3aed; background:rgba(255,255,255,0.14); box-shadow:0 0 0 3px rgba(124,58,237,0.15); }
        .es-field { margin-bottom:15px; }
        .es-hint { font-size:10.5px; color:rgba(255,255,255,0.38); margin-top:4px; }
        .es-section-label { font-size:11px; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.8px; margin:18px 0 10px; }
        .es-location-group { display:flex; flex-direction:column; gap:8px; }
        .es-error { background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.35); color:#fca5a5; padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:16px; }
        .es-success { background:rgba(124,58,237,0.15); border:1px solid rgba(124,58,237,0.35); color:#c4b5fd; padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:16px; }
        .es-btn-row { display:flex; gap:10px; margin-top:22px; }
        .es-cancel-btn { flex:1; background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.15); padding:13px; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .es-cancel-btn:hover { background:rgba(255,255,255,0.14); }
        .es-save-btn { flex:2; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:white; border:none; padding:13px; border-radius:12px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit; box-shadow:0 6px 20px rgba(124,58,237,0.4); transition:all 0.2s; }
        .es-save-btn:hover { transform:translateY(-1px); }
        .es-save-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        @media(max-width:480px){ .es-card { padding:24px 16px; } }
      `}</style>

      <div className="es-bg">
        <div className="es-inner">
          <button className="es-back" onClick={() => navigate('/my-listings')}>← My Listings</button>
          <div className="es-card">
            <div className="es-header">
              <div className="es-header-icon">✏️</div>
              <h1 className="es-title">Edit Service</h1>
              <p className="es-sub">Update your service details below</p>
            </div>

            {error && <div className="es-error">{error}</div>}
            {success && <div className="es-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="es-field">
                <label className="es-label">Title *</label>
                <input className="es-input" type="text" name="title" value={form.title} onChange={handleChange} placeholder="Service title" required />
              </div>
              <div className="es-field">
                <label className="es-label">Description</label>
                <textarea className="es-input" name="description" value={form.description} onChange={handleChange} placeholder="Describe your service..." rows={4} style={{ resize: 'vertical' }} />
              </div>
              <div className="es-field">
                <label className="es-label">Price per Hour ($)</label>
                <input className="es-input" type="number" name="pricePerHour" value={form.pricePerHour} onChange={handleChange} placeholder="0.00" />
              </div>
              <div className="es-field">
                <label className="es-label">WhatsApp Number *</label>
                <input className="es-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+263771234567" required />
                <p className="es-hint">Include country code e.g. +263 Zimbabwe</p>
              </div>
              <p className="es-section-label">Location</p>
              <div className="es-location-group">
                <input className="es-input" type="text" name="country" value={form.location.country} onChange={handleLocation} placeholder="Country" required />
                <input className="es-input" type="text" name="city" value={form.location.city} onChange={handleLocation} placeholder="City" required />
                <input className="es-input" type="text" name="area" value={form.location.area} onChange={handleLocation} placeholder="Area / Campus (optional)" />
              </div>
              <div className="es-btn-row">
                <button type="button" className="es-cancel-btn" onClick={() => navigate('/my-listings')}>Cancel</button>
                <button type="submit" className="es-save-btn" disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}