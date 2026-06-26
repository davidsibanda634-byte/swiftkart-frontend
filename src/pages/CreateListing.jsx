import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const CATEGORIES = ['Fashion', 'Cosmetics & Hair', 'Mobile & Accessories', 'Vehicles', 'Furniture', 'Electronics', 'Food', 'Other']
const JOB_CATEGORIES = ['Internship', 'Part-Time', 'Full-Time', 'Freelance', 'Volunteer', 'Other']

export default function CreateListing() {
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = useState('listing')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [images, setImages] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Other', jobCategory: 'Internship',
    pricePerHour: '', company: '', date: '', phone: '',
    location: { country: '', city: '', area: '' }
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleLocation = (e) => setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } })
  const handleImages = (e) => setImages(e.target.files)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!user) { navigate('/login'); return }
    setLoading(true)
    try {
      if (type === 'listing') {
        const fd = new FormData()
        fd.append('title', form.title)
        fd.append('description', form.description)
        fd.append('price', form.price)
        fd.append('category', form.category)
        fd.append('phone', form.phone)
        fd.append('location[country]', form.location.country)
        fd.append('location[city]', form.location.city)
        fd.append('location[area]', form.location.area)
        Array.from(images).forEach(img => fd.append('images', img))
        await api.post('/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else if (type === 'service') {
        const fd = new FormData()
        fd.append('title', form.title)
        fd.append('description', form.description)
        fd.append('pricePerHour', form.pricePerHour)
        fd.append('phone', form.phone)
        fd.append('location[country]', form.location.country)
        fd.append('location[city]', form.location.city)
        fd.append('location[area]', form.location.area)
        Array.from(images).forEach(img => fd.append('images', img))
        await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else if (type === 'job') {
        await api.post('/jobs', {
          title: form.title, description: form.description,
          category: form.jobCategory,
          company: form.company, phone: form.phone, location: form.location
        })
      } else if (type === 'event') {
        const fd = new FormData()
        fd.append('title', form.title)
        fd.append('description', form.description)
        fd.append('date', form.date)
        fd.append('phone', form.phone)
        fd.append('location[country]', form.location.country)
        fd.append('location[city]', form.location.city)
        fd.append('location[area]', form.location.area)
        Array.from(images).forEach(img => fd.append('images', img))
        await api.post('/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setSuccess('Posted successfully! Redirecting...')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  // Wait for auth to be confirmed before redirecting
  if (!authReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08162F' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }}>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          .cl-bg { min-height:100vh; font-family:'Plus Jakarta Sans',sans-serif; display:flex; align-items:center; justify-content:center; padding:24px; background-image: linear-gradient(to bottom,rgba(8,14,40,0.82) 0%,rgba(10,20,55,0.75) 50%,rgba(8,14,40,0.90) 100%), url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80'); background-size:cover; background-position:center; }
        `}</style>
        <div className="cl-bg">
          <div style={{ textAlign:'center', color:'white' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🔒</div>
            <p style={{ fontSize:'18px', fontWeight:700, marginBottom:'16px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Login required to post</p>
            <button onClick={() => navigate('/login')} style={{ background:'linear-gradient(135deg,#10b981,#059669)', color:'white', border:'none', padding:'12px 28px', borderRadius:'12px', fontWeight:700, fontSize:'14px', cursor:'pointer', fontFamily:'inherit' }}>
              Go to Login
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .cl-bg {
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          padding: 24px 16px 60px;
          background-image:
            linear-gradient(to bottom, rgba(8,14,40,0.88) 0%, rgba(10,20,55,0.82) 50%, rgba(8,14,40,0.92) 100%),
            url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .cl-inner { max-width: 560px; margin: 0 auto; }

        .cl-back {
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
        .cl-back:hover { background: rgba(255,255,255,0.18); }

        .cl-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.14);
          padding: 32px 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }

        .cl-header { text-align: center; margin-bottom: 28px; }

        .cl-header-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin: 0 auto 14px;
          box-shadow: 0 8px 24px rgba(16,185,129,0.4);
        }

        .cl-title { font-size: 21px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.4px; }
        .cl-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin: 0; }

        .cl-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.72);
          margin-bottom: 7px;
        }

        .cl-input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 11px;
          font-size: 13.5px;
          color: white;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
          transition: all 0.2s;
        }
        .cl-input::placeholder { color: rgba(255,255,255,0.32); }
        .cl-input:focus {
          border-color: #10b981;
          background: rgba(255,255,255,0.14);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }

        .cl-field { margin-bottom: 15px; }

        .cl-hint { font-size: 10.5px; color: rgba(255,255,255,0.38); margin-top: 4px; }

        .cl-type-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 22px;
        }

        .cl-type-btn {
          padding: 10px 6px;
          border-radius: 11px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.65);
          font-weight: 600;
          font-size: 11.5px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-align: center;
        }
        .cl-type-btn.active {
          border-color: #10b981;
          background: rgba(16,185,129,0.15);
          color: #34d399;
        }
        .cl-type-btn:hover { border-color: rgba(255,255,255,0.3); color: white; }

        .cl-cat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-bottom: 4px;
        }

        .cl-cat-btn {
          padding: 9px 10px;
          border-radius: 9px;
          border: 1.5px solid rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.6);
          font-weight: 500;
          font-size: 12px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: all 0.2s;
        }
        .cl-cat-btn.active {
          border-color: #10b981;
          background: rgba(16,185,129,0.15);
          color: #34d399;
        }
        .cl-cat-btn:hover { border-color: rgba(255,255,255,0.28); color: white; }

        .cl-section-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin: 18px 0 10px;
        }

        .cl-location-group { display: flex; flex-direction: column; gap: 8px; }

        .cl-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 13px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          margin-top: 22px;
          box-shadow: 0 6px 20px rgba(16,185,129,0.4);
          transition: all 0.2s;
          letter-spacing: 0.1px;
        }
        .cl-submit:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(16,185,129,0.5); }
        .cl-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .cl-error {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.35);
          color: #fca5a5;
          padding: 10px 14px;
          border-radius: 9px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .cl-success {
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.35);
          color: #6ee7b7;
          padding: 10px 14px;
          border-radius: 9px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        @media (max-width: 480px) {
          .cl-card { padding: 24px 16px; }
          .cl-type-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="cl-bg">
        <div className="cl-inner">
          <button className="cl-back" onClick={() => navigate(-1)}>← Back</button>

          <div className="cl-card">
            <div className="cl-header">
              <div className="cl-header-icon">📌</div>
              <h1 className="cl-title">Post a Listing</h1>
              <p className="cl-sub">Fill in the details to publish your post</p>
            </div>

            <label className="cl-label">What are you posting?</label>
            <div className="cl-type-grid">
              {[
                { key: 'listing', label: '🛍️ Item' },
                { key: 'service', label: '🧑‍💼 Service' },
                { key: 'job', label: '💼 Job' },
                { key: 'event', label: '🎉 Event' },
              ].map(t => (
                <button
                  key={t.key}
                  type="button"
                  className={'cl-type-btn' + (type === t.key ? ' active' : '')}
                  onClick={() => setType(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {error && <div className="cl-error">{error}</div>}
            {success && <div className="cl-success">{success}</div>}

            <form onSubmit={handleSubmit}>

              <div className="cl-field">
                <label className="cl-label">Title *</label>
                <input className="cl-input" type="text" name="title"
                  value={form.title} onChange={handleChange}
                  placeholder="Enter a clear title" required />
              </div>

              <div className="cl-field">
                <label className="cl-label">Description</label>
                <textarea className="cl-input" name="description"
                  value={form.description} onChange={handleChange}
                  placeholder="Describe your listing in detail... (Tip: paste application links here)"
                  rows={3} style={{ resize: 'vertical' }} />
              </div>

              {type === 'listing' && (
                <>
                  <div className="cl-field">
                    <label className="cl-label">Category *</label>
                    <div className="cl-cat-grid">
                      {CATEGORIES.map(cat => (
                        <button key={cat} type="button"
                          className={'cl-cat-btn' + (form.category === cat ? ' active' : '')}
                          onClick={() => setForm({ ...form, category: cat })}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">Price ($) *</label>
                    <input className="cl-input" type="number" name="price"
                      value={form.price} onChange={handleChange}
                      placeholder="0.00" required />
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">Images (up to 5)</label>
                    <input className="cl-input" type="file" multiple accept="image/*"
                      onChange={handleImages} style={{ padding: '8px' }} />
                  </div>
                </>
              )}

              {type === 'service' && (
                <>
                  <div className="cl-field">
                    <label className="cl-label">Price per Hour ($)</label>
                    <input className="cl-input" type="number" name="pricePerHour"
                      value={form.pricePerHour} onChange={handleChange} placeholder="0.00" />
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">Portfolio Images</label>
                    <input className="cl-input" type="file" multiple accept="image/*"
                      onChange={handleImages} style={{ padding: '8px' }} />
                  </div>
                </>
              )}

              {type === 'job' && (
                <>
                  <div className="cl-field">
                    <label className="cl-label">Job Category *</label>
                    <div className="cl-cat-grid">
                      {JOB_CATEGORIES.map(cat => (
                        <button key={cat} type="button"
                          className={'cl-cat-btn' + (form.jobCategory === cat ? ' active' : '')}
                          onClick={() => setForm({ ...form, jobCategory: cat })}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">Company / Organization</label>
                    <input className="cl-input" type="text" name="company"
                      value={form.company} onChange={handleChange} placeholder="Company name" />
                  </div>
                </>
              )}

              {type === 'event' && (
                <>
                  <div className="cl-field">
                    <label className="cl-label">Event Date *</label>
                    <input className="cl-input" type="date" name="date"
                      value={form.date} onChange={handleChange} required />
                  </div>
                  <div className="cl-field">
                    <label className="cl-label">Event Poster / Image</label>
                    <input className="cl-input" type="file" multiple accept="image/*"
                      onChange={handleImages} style={{ padding: '8px' }} />
                  </div>
                </>
              )}

              <div className="cl-field">
                <label className="cl-label">WhatsApp Number *</label>
                <input className="cl-input" type="tel" name="phone"
                  value={form.phone} onChange={handleChange}
                  placeholder="+263771234567" required />
                <p className="cl-hint">Include country code e.g. +263 Zimbabwe, +27 South Africa</p>
              </div>

              <p className="cl-section-label">Location</p>
              <div className="cl-location-group">
                <input className="cl-input" type="text" name="country"
                  value={form.location.country} onChange={handleLocation}
                  placeholder="Country (e.g. Zimbabwe)" required />
                <input className="cl-input" type="text" name="city"
                  value={form.location.city} onChange={handleLocation}
                  placeholder="City (e.g. Harare)" required />
                <input className="cl-input" type="text" name="area"
                  value={form.location.area} onChange={handleLocation}
                  placeholder="Area / Campus (optional)" />
              </div>

              <button className="cl-submit" type="submit" disabled={loading}>
                {loading ? 'Publishing...' : '🚀 Publish Listing'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}