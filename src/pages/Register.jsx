import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    location: { country: '', city: '', area: '' }
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleLocation = (e) => setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1px solid #d1d5db', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', backgroundColor: 'white'
  }
  const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#374151', marginBottom: '6px'
  }
  const fieldStyle = { marginBottom: '16px' }
  const focusInput = (e) => e.target.style.border = '1px solid #1a56db'
  const blurInput = (e) => e.target.style.border = '1px solid #d1d5db'

  return (
    <div style={{
      minHeight: '80vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', backgroundColor: '#f4f6f8'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        <button onClick={() => navigate('/')} style={{
          backgroundColor: 'transparent', border: '1px solid #d1d5db',
          padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
          color: '#374151', cursor: 'pointer', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>← Back to Home</button>

        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '32px' }}>🛒</span>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a56db', marginTop: '8px' }}>
              Create Account
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Join SwiftKart today</p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '20px'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="John Doe" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Phone Number (for WhatsApp)</label>
              <input type="tel" name="phone" value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +263771234567 or +27831234567" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                Include your country code — this is used for WhatsApp contact
              </p>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required
                style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>

            {/* Flexible Location */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Your Location</label>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
                Type your country, city and area freely
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="text" name="country" value={form.location.country}
                  onChange={handleLocation}
                  placeholder="Country (e.g. Zimbabwe, South Africa, Kenya)"
                  required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                <input type="text" name="city" value={form.location.city}
                  onChange={handleLocation}
                  placeholder="City (e.g. Harare, Cape Town, Nairobi)"
                  required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                <input type="text" name="area" value={form.location.area}
                  onChange={handleLocation}
                  placeholder="Area / Campus / Neighbourhood (optional)"
                  style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              backgroundColor: loading ? '#93c5fd' : '#1a56db',
              color: 'white', border: 'none', padding: '12px',
              borderRadius: '8px', fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px'
            }}>{loading ? 'Creating Account...' : 'Create Account'}</button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1a56db', fontWeight: '600' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}