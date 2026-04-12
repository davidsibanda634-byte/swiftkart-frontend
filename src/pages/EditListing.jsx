import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function EditListing() {
  const { user } = useAuth()
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
    phone: '',
    location: { country: '', city: '', area: '' }
  })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`)
        if (data.user?._id !== user._id && data.user !== user._id) {
          navigate('/')
          return
        }
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          phone: data.phone || '',
          location: {
            country: data.location?.country || '',
            city: data.location?.city || '',
            area: data.location?.area || ''
          }
        })
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLocation = (e) => {
    setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await api.put(`/listings/${id}`, form)
      setSuccess('Listing updated successfully!')
      setTimeout(() => navigate('/my-listings'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1px solid #d1d5db', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
    backgroundColor: 'white'
  }

  const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#374151', marginBottom: '6px'
  }

  const fieldStyle = { marginBottom: '16px' }
  const focusInput = (e) => e.target.style.border = '1px solid #1a56db'
  const blurInput = (e) => e.target.style.border = '1px solid #d1d5db'

  if (loading) return (
    <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>Loading...</p>
  )

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '80vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>

        {/* Back Button */}
        <button onClick={() => navigate('/my-listings')} style={{
          backgroundColor: 'transparent',
          border: '1px solid #d1d5db',
          padding: '8px 16px', borderRadius: '8px',
          fontSize: '13px', color: '#374151',
          cursor: 'pointer', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>← Back to My Listings</button>

        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '40px'
        }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
            Edit Listing
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
            Update your listing details below
          </p>

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
              <input
                type="text" name="title" value={form.title}
                onChange={handleChange} placeholder="Enter a clear title" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description" value={form.description}
                onChange={handleChange} placeholder="Describe your listing..."
                rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={focusInput} onBlur={blurInput}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Price ($) *</label>
              <input
                type="number" name="price" value={form.price}
                onChange={handleChange} placeholder="0.00" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>WhatsApp Phone Number *</label>
              <input
                type="tel" name="phone" value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +263771234567" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Location *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text" name="country" value={form.location.country}
                  onChange={handleLocation} placeholder="Country" required
                  style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                />
                <input
                  type="text" name="city" value={form.location.city}
                  onChange={handleLocation} placeholder="City" required
                  style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                />
                <input
                  type="text" name="area" value={form.location.area}
                  onChange={handleLocation} placeholder="Area (optional)"
                  style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/my-listings')}
                style={{
                  flex: 1, backgroundColor: 'white',
                  color: '#374151', border: '1px solid #d1d5db',
                  padding: '12px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}
              >Cancel</button>

              <button
                type="submit" disabled={saving}
                style={{
                  flex: 1,
                  backgroundColor: saving ? '#93c5fd' : '#1a56db',
                  color: 'white', border: 'none', padding: '12px',
                  borderRadius: '8px', fontSize: '14px',
                  fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >{saving ? 'Saving...' : '💾 Save Changes'}</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}