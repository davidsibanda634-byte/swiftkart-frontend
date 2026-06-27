import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const CATEGORIES = ['Fashion', 'Cosmetics & Hair', 'Mobile & Accessories', 'Vehicles', 'Furniture', 'Electronics', 'Food', 'Other']

export default function EditListing() {
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
    price: '',
    category: 'Other',
    phone: '',
    location: { country: '', city: '', area: '' }
  })

  useEffect(function() {
    if (!authReady) return
    if (!user) { navigate('/login'); return }
    api.get('/listings/' + id)
      .then(function(res) {
        const data = res.data
        const ownerId = data.user?._id || data.user
        if (ownerId !== user._id) { navigate('/'); return }
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          category: data.category || 'Other',
          phone: data.phone || '',
          location: {
            country: data.location?.country || '',
            city: data.location?.city || '',
            area: data.location?.area || ''
          }
        })
      })
      .catch(function() { navigate('/') })
      .finally(function() { setLoading(false) })
  }, [id, authReady])

  function handleChange(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }))
  }

  function handleLocation(e) {
    setForm(Object.assign({}, form, {
      location: Object.assign({}, form.location, { [e.target.name]: e.target.value })
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    api.put('/listings/' + id, form)
      .then(function() {
        setSuccess('Listing updated successfully!')
        setTimeout(function() { navigate('/my-listings') }, 1500)
      })
      .catch(function(err) {
        setError(err.response?.data?.message || 'Failed to update listing.')
      })
      .finally(function() { setSaving(false) })
  }

  if (!authReady || loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08162F' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }}>Loading...</p>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .el-bg {
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 24px 16px 80px;
          background-image:
            linear-gradient(to bottom, rgba(8,14,40,0.88) 0%, rgba(10,20,55,0.82) 50%, rgba(8,14,40,0.92) 100%),
            url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .el-inner { max-width: 560px; margin: 0 auto; }

        .el-back {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 20px;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .el-back:hover { background: rgba(255,255,255,0.18); }

        .el-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.14);
          padding: 32px 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }

        .el-header { text-align: center; margin-bottom: 28px; }
        .el-header-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #00C896, #059669);
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; font-size: 24px;
          margin: 0 auto 14px;
          box-shadow: 0 8px 24px rgba(0,200,150,0.4);
        }
        .el-title { font-size: 21px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.4px; }
        .el-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin: 0; }

        .el-label {
          display: block; font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.72); margin-bottom: 7px;
        }

        .el-input {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 11px; font-size: 13.5px; color: white;
          outline: none; box-sizing: border-box; font-family: inherit; transition: all 0.2s;
        }
        .el-input::placeholder { color: rgba(255,255,255,0.32); }
        .el-input:focus {
          border-color: #00C896;
          background: rgba(255,255,255,0.14);
          box-shadow: 0 0 0 3px rgba(0,200,150,0.15);
        }

        .el-field { margin-bottom: 15px; }
        .el-hint { font-size: 10.5px; color: rgba(255,255,255,0.38); margin-top: 4px; }

        .el-cat-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 4px;
        }
        .el-cat-btn {
          padding: 9px 10px; border-radius: 9px;
          border: 1.5px solid rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.6); font-weight: 500; font-size: 12px;
          cursor: pointer; font-family: inherit; text-align: left; transition: all 0.2s;
        }
        .el-cat-btn.active {
          border-color: #00C896;
          background: rgba(0,200,150,0.15);
          color: #34d399;
        }
        .el-cat-btn:hover { border-color: rgba(255,255,255,0.28); color: white; }

        .el-section-label {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.8px; margin: 18px 0 10px;
        }

        .el-location-group { display: flex; flex-direction: column; gap: 8px; }

        .el-error {
          background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35);
          color: #fca5a5; padding: 10px 14px; border-radius: 9px;
          font-size: 13px; margin-bottom: 16px;
        }
        .el-success {
          background: rgba(0,200,150,0.15); border: 1px solid rgba(0,200,150,0.35);
          color: #6ee7b7; padding: 10px 14px; border-radius: 9px;
          font-size: 13px; margin-bottom: 16px;
        }

        .el-btn-row { display: flex; gap: 10px; margin-top: 22px; }
        .el-cancel-btn {
          flex: 1; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.15); padding: 13px; border-radius: 12px;
          font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .el-cancel-btn:hover { background: rgba(255,255,255,0.14); }
        .el-save-btn {
          flex: 2; background: linear-gradient(135deg, #00C896, #059669);
          color: white; border: none; padding: 13px; border-radius: 12px;
          font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit;
          box-shadow: 0 6px 20px rgba(0,200,150,0.4); transition: all 0.2s;
        }
        .el-save-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(0,200,150,0.5); }
        .el-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        @media (max-width: 480px) {
          .el-card { padding: 24px 16px; }
        }
      `}</style>

      <div className="el-bg">
        <div className="el-inner">
          <button className="el-back" onClick={() => navigate('/my-listings')}>← My Listings</button>

          <div className="el-card">
            <div className="el-header">
              <div className="el-header-icon">✏️</div>
              <h1 className="el-title">Edit Listing</h1>
              <p className="el-sub">Update your listing details below</p>
            </div>

            {error && <div className="el-error">{error}</div>}
            {success && <div className="el-success">{success}</div>}

            <form onSubmit={handleSubmit}>

              <div className="el-field">
                <label className="el-label">Title *</label>
                <input className="el-input" type="text" name="title"
                  value={form.title} onChange={handleChange}
                  placeholder="Enter a clear title" required />
              </div>

              <div className="el-field">
                <label className="el-label">Description</label>
                <textarea className="el-input" name="description"
                  value={form.description} onChange={handleChange}
                  placeholder="Describe your listing..."
                  rows={4} style={{ resize: 'vertical' }} />
              </div>

              <div className="el-field">
                <label className="el-label">Category *</label>
                <div className="el-cat-grid">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button"
                      className={'el-cat-btn' + (form.category === cat ? ' active' : '')}
                      onClick={() => setForm({ ...form, category: cat })}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="el-field">
                <label className="el-label">Price ($) *</label>
                <input className="el-input" type="number" name="price"
                  value={form.price} onChange={handleChange}
                  placeholder="0.00" required />
              </div>

              <div className="el-field">
                <label className="el-label">WhatsApp Number *</label>
                <input className="el-input" type="tel" name="phone"
                  value={form.phone} onChange={handleChange}
                  placeholder="+263771234567" required />
                <p className="el-hint">Include country code e.g. +263 Zimbabwe, +27 South Africa</p>
              </div>

              <p className="el-section-label">Location</p>
              <div className="el-location-group">
                <input className="el-input" type="text" name="country"
                  value={form.location.country} onChange={handleLocation}
                  placeholder="Country (e.g. Zimbabwe)" required />
                <input className="el-input" type="text" name="city"
                  value={form.location.city} onChange={handleLocation}
                  placeholder="City (e.g. Harare)" required />
                <input className="el-input" type="text" name="area"
                  value={form.location.area} onChange={handleLocation}
                  placeholder="Area / Campus (optional)" />
              </div>

              <div className="el-btn-row">
                <button type="button" className="el-cancel-btn"
                  onClick={() => navigate('/my-listings')}>
                  Cancel
                </button>
                <button type="submit" className="el-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}