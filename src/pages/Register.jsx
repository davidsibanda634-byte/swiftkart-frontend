import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '',
    location: { country: '', city: '', area: '' }
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleLocation = (e) => setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .auth-bg {
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background-image:
            linear-gradient(to bottom, rgba(8,14,40,0.82) 0%, rgba(10,20,55,0.75) 50%, rgba(8,14,40,0.90) 100%),
            url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80');
          background-size: cover;
          background-position: center;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 36px 32px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }

        .auth-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 26px;
        }

        .auth-logo-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 14px;
          box-shadow: 0 8px 24px rgba(16,185,129,0.4);
        }

        .auth-title {
          font-size: 21px;
          font-weight: 800;
          color: white;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        }

        .auth-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          margin: 0;
        }

        .auth-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.72);
          margin-bottom: 6px;
        }

        .auth-input {
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
        .auth-input::placeholder { color: rgba(255,255,255,0.32); }
        .auth-input:focus {
          border-color: #10b981;
          background: rgba(255,255,255,0.13);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }

        .auth-field { margin-bottom: 13px; }

        .auth-hint {
          font-size: 10.5px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
        }

        .auth-section-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin: 18px 0 12px;
        }

        .auth-location-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-submit {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          margin-top: 18px;
          box-shadow: 0 6px 20px rgba(16,185,129,0.4);
          transition: all 0.2s;
        }
        .auth-submit:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(16,185,129,0.5); }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .auth-error {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.35);
          color: #fca5a5;
          padding: 10px 14px;
          border-radius: 9px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .auth-footer {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-top: 18px;
        }
        .auth-footer a {
          color: #34d399;
          font-weight: 700;
          text-decoration: none;
        }
        .auth-footer a:hover { text-decoration: underline; }

        .auth-back {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .auth-back:hover { background: rgba(255,255,255,0.18); }

        @media (max-width: 480px) {
          .auth-card { padding: 26px 18px; }
        }
      `}</style>

      <div className="auth-bg">
        <button className="auth-back" onClick={() => navigate('/')}>← Home</button>

        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">🛒</div>
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-sub">Join thousands of students on Scalablenexus</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input className="auth-input" type="text" name="name"
                value={form.name} onChange={handleChange}
                placeholder="John Doe" required />
            </div>

            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input className="auth-input" type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" required />
            </div>

            <div className="auth-field">
              <label className="auth-label">Phone Number</label>
              <input className="auth-input" type="tel" name="phone"
                value={form.phone} onChange={handleChange}
                placeholder="+263771234567" required />
              <p className="auth-hint">Include country code — used for WhatsApp</p>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" name="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••" required />
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <input className="auth-input" type="password" name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange}
                placeholder="••••••••" required />
            </div>

            <p className="auth-section-label">Your Location</p>
            <div className="auth-location-group">
              <input className="auth-input" type="text" name="country"
                value={form.location.country} onChange={handleLocation}
                placeholder="Country (e.g. Zimbabwe)" required />
              <input className="auth-input" type="text" name="city"
                value={form.location.city} onChange={handleLocation}
                placeholder="City (e.g. Harare)" required />
              <input className="auth-input" type="text" name="area"
                value={form.location.area} onChange={handleLocation}
                placeholder="Area / Campus (optional)" />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  )
}