import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function CreateListing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [type, setType] = useState('listing')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [images, setImages] = useState([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    pricePerHour: '',
    company: '',
    date: '',
    phone: '',
    location: { country: '', city: '', area: '' }
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLocation = (e) => {
    setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } })
  }

  const handleImages = (e) => {
    setImages(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!user) { navigate('/login'); return }
    setLoading(true)
    try {
      if (type === 'listing') {
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('price', form.price)
        formData.append('phone', form.phone)
        formData.append('location[country]', form.location.country)
        formData.append('location[city]', form.location.city)
        formData.append('location[area]', form.location.area)
        Array.from(images).forEach(img => formData.append('images', img))
        await api.post('/listings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else if (type === 'service') {
        await api.post('/services', {
          title: form.title, description: form.description,
          pricePerHour: form.pricePerHour, phone: form.phone,
          location: form.location
        })
      } else if (type === 'job') {
        await api.post('/jobs', {
          title: form.title, description: form.description,
          company: form.company, phone: form.phone,
          location: form.location
        })
      } else if (type === 'event') {
        await api.post('/events', {
          title: form.title, description: form.description,
          date: form.date, phone: form.phone,
          location: form.location
        })
      }
      setSuccess('Posted successfully! Redirecting...')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: 'white'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  }

  const fieldStyle = { marginBottom: '16px' }
  const focusInput = (e) => e.target.style.border = '1px solid #1a56db'
  const blurInput = (e) => e.target.style.border = '1px solid #d1d5db'

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ fontSize: '18px', color: '#374151', marginBottom: '16px' }}>
          You must be logged in to post a listing.
        </p>
        <button onClick={() => navigate('/login')} style={{
          backgroundColor: '#1a56db', color: 'white',
          border: 'none', padding: '12px 28px',
          borderRadius: '8px', fontWeight: '600',
          fontSize: '14px', cursor: 'pointer'
        }}>Go to Login</button>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '80vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>

        {/* Back Button */}
        <button onClick={() => navigate(-1)} style={{
          backgroundColor: 'transparent',
          border: '1px solid #d1d5db',
          padding: '8px 16px', borderRadius: '8px',
          fontSize: '13px', color: '#374151',
          cursor: 'pointer', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>← Back</button>

        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '40px'
        }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
            Post a Listing
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
            Fill in the details below to publish your post
          </p>

          {/* Type Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>What are you posting?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
              {[
                { key: 'listing', label: '🛍️ Item' },
                { key: 'service', label: '🧑‍💼 Service' },
                { key: 'job', label: '💼 Job' },
                { key: 'event', label: '🎉 Event' },
              ].map(t => (
                <button key={t.key} type="button" onClick={() => setType(t.key)} style={{
                  padding: '10px 6px', borderRadius: '8px',
                  border: type === t.key ? '2px solid #1a56db' : '2px solid #e5e7eb',
                  backgroundColor: type === t.key ? '#eff6ff' : 'white',
                  color: type === t.key ? '#1a56db' : '#374151',
                  fontWeight: '600', fontSize: '12px', cursor: 'pointer'
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '16px'
            }}>{error}</div>
          )}
          {success && (
            <div style={{
              backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#16a34a', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '16px'
            }}>{success}</div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={fieldStyle}>
              <label style={labelStyle}>Title *</label>
              <input type="text" name="title" value={form.title}
                onChange={handleChange} placeholder="Enter a clear title" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description}
                onChange={handleChange} placeholder="Describe your listing in detail..."
                rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={focusInput} onBlur={blurInput} />
            </div>

            {type === 'listing' && (
              <>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Price ($) *</label>
                  <input type="number" name="price" value={form.price}
                    onChange={handleChange} placeholder="0.00" required
                    style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Images (up to 5)</label>
                  <input type="file" multiple accept="image/*"
                    onChange={handleImages}
                    style={{ ...inputStyle, padding: '8px' }} />
                </div>
              </>
            )}

            {type === 'service' && (
              <div style={fieldStyle}>
                <label style={labelStyle}>Price per Hour ($)</label>
                <input type="number" name="pricePerHour" value={form.pricePerHour}
                  onChange={handleChange} placeholder="0.00"
                  style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
            )}

            {type === 'job' && (
              <div style={fieldStyle}>
                <label style={labelStyle}>Company / Organization</label>
                <input type="text" name="company" value={form.company}
                  onChange={handleChange} placeholder="Company name"
                  style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
            )}

            {type === 'event' && (
              <div style={fieldStyle}>
                <label style={labelStyle}>Event Date *</label>
                <input type="date" name="date" value={form.date}
                  onChange={handleChange} required
                  style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
            )}

            {/* WhatsApp Phone */}
            <div style={fieldStyle}>
              <label style={labelStyle}>WhatsApp Phone Number *</label>
              <input type="tel" name="phone" value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +263771234567 or +27831234567" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                Include your country code e.g. +263 for Zimbabwe, +27 for South Africa
              </p>
            </div>

            {/* Location — fully flexible text inputs */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Location *</label>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
                Enter your country, city and area — you can type anything
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text" name="country" value={form.location.country}
                  onChange={handleLocation}
                  placeholder="Country (e.g. Zimbabwe, South Africa, Kenya)"
                  required style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
                <input
                  type="text" name="city" value={form.location.city}
                  onChange={handleLocation}
                  placeholder="City (e.g. Harare, Johannesburg, Nairobi)"
                  required style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
                <input
                  type="text" name="area" value={form.location.area}
                  onChange={handleLocation}
                  placeholder="Area / Campus / Neighbourhood (optional)"
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              backgroundColor: loading ? '#93c5fd' : '#1a56db',
              color: 'white', border: 'none', padding: '13px',
              borderRadius: '8px', fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px', transition: 'background 0.2s'
            }}>
              {loading ? 'Publishing...' : '🚀 Publish Listing'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}