import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '80vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', backgroundColor: '#f4f6f8'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#374151',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >← Back to Home</button>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '40px'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '32px' }}>🛒</span>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a56db', marginTop: '8px' }}>
              SwiftKart
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              Sign in to your account
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '20px'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.border = '1px solid #1a56db'}
                onBlur={e => e.target.style.border = '1px solid #d1d5db'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.border = '1px solid #1a56db'}
                onBlur={e => e.target.style.border = '1px solid #d1d5db'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', backgroundColor: loading ? '#93c5fd' : '#1a56db',
                color: 'white', border: 'none', padding: '12px',
                borderRadius: '8px', fontSize: '15px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1a56db', fontWeight: '600' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}