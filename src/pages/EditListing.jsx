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

  useEffect(function() {
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
  }, [id])

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

  const inp = {
    width: '100%', padding: '11px 14px',
    border: '1px solid #d1d5db', borderRadius: '10px',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
    backgroundColor: 'white', transition: 'border .2s'
  }
  const lbl = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }
  const fld = { marginBottom: '16px' }
  const onFocus = function(e) { e.target.style.border = '1px solid #00C896' }
  const onBlur = function(e) { e.target.style.border = '1px solid #d1d5db' }

  if (loading) return (
    <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      Loading...
    </p>
  )

  return (
    <div style={{ background: '#f4f7fb', minHeight: '80vh', padding: '24px 16px 80px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        <button
          onClick={function() { navigate('/my-listings') }}
          style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#374151', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', fontWeight: 600 }}
        >← Back to My Listings</button>

        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,.08)', padding: '28px 24px' }}>

          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#08162F', marginBottom: '4px' }}>Edit Listing</h1>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>Update your listing details below</p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={fld}>
              <label style={lbl}>Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Enter a clear title" required style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div style={fld}>
              <label style={lbl}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your listing..." rows={4} style={Object.assign({}, inp, { resize: 'vertical' })} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div style={fld}>
              <label style={lbl}>Price (R) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" required style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div style={fld}>
              <label style={lbl}>WhatsApp Phone Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+263771234567" required style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div style={fld}>
              <label style={lbl}>Location *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="text" name="country" value={form.location.country} onChange={handleLocation} placeholder="Country" required style={inp} onFocus={onFocus} onBlur={onBlur} />
                <input type="text" name="city" value={form.location.city} onChange={handleLocation} placeholder="City" required style={inp} onFocus={onFocus} onBlur={onBlur} />
                <input type="text" name="area" value={form.location.area} onChange={handleLocation} placeholder="Area (optional)" style={inp} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={function() { navigate('/my-listings') }}
                style={{ flex: 1, background: 'white', color: '#374151', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >Cancel</button>
              <button
                type="submit"
                disabled={saving}
                style={{ flex: 1, background: saving ? '#6ee7b7' : 'linear-gradient(135deg,#00C896,#059669)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
              >{saving ? 'Saving...' : '💾 Save Changes'}</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}