import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ZIM_CITIES = [
  'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru',
  'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi', 'Bindura',
  'Marondera', 'Zvishavane', 'Chegutu', 'Rusape', 'Kariba',
  'Hwange', 'Victoria Falls', 'Beitbridge', 'Chiredzi', 'Other',
]

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    location: { country: 'Zimbabwe', city: '', area: '' }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleLocation = e => setForm({
    ...form,
    location: { ...form.location, [e.target.name]: e.target.value }
  })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .rg-bg {
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 60px;
          background-image:
            linear-gradient(to bottom, rgba(8,14,40,0.85) 0%, rgba(10,20,55,0.80) 50%, rgba(8,14,40,0.90) 100%),
            url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .rg-inner { max-width: 480px; width: 100%; }

        .rg-logo {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-bottom: 28px; text-decoration: none;
        }
        .rg-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #00C896, #059669);
          border-radius: 10px; display: flex; align-items: center;
          justify-content: center; font-size: 18px;
        }
        .rg-logo-text { font-size: 22px; font-weight: 800; color: white; letter-spacing: -0.5px; }
        .rg-logo-text span { color: #00C896; }

        .rg-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.14);
          padding: 32px 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }

        .rg-header { text-align: center; margin-bottom: 24px; }
        .rg-header-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #00C896, #059669);
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; font-size: 24px; margin: 0 auto 14px;
          box-shadow: 0 8px 24px rgba(0,200,150,0.4);
        }
        .rg-title { font-size: 22px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.4px; }
        .rg-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }

        .rg-label {
          display: block; font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.72); margin-bottom: 7px;
        }

        .rg-input {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 11px; font-size: 13.5px; color: white;
          outline: none; box-sizing: border-box; font-family: inherit; transition: all 0.2s;
        }
        .rg-input::placeholder { color: rgba(255,255,255,0.32); }
        .rg-input:focus {
          border-color: #00C896;
          background: rgba(255,255,255,0.14);
          box-shadow: 0 0 0 3px rgba(0,200,150,0.15);
        }

        .rg-select {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 11px; font-size: 13.5px; color: white;
          outline: none; box-sizing: border-box; font-family: inherit; transition: all 0.2s;
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.5)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 12px;
          padding-right: 38px;
        }
        .rg-select:focus {
          border-color: #00C896;
          background-color: rgba(255,255,255,0.14);
          box-shadow: 0 0 0 3px rgba(0,200,150,0.15);
        }
        .rg-select option { background: #08162F; color: white; }

        .rg-field { margin-bottom: 15px; }
        .rg-hint { font-size: 10.5px; color: rgba(255,255,255,0.38); margin-top: 4px; }

        .rg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        .rg-section-label {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.8px; margin: 18px 0 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .rg-section-label::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
        }

        .rg-error {
          background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35);
          color: #fca5a5; padding: 10px 14px; border-radius: 9px;
          font-size: 13px; margin-bottom: 16px;
        }

        .rg-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #00C896, #059669);
          color: white; border: none; border-radius: 13px;
          font-size: 15px; font-weight: 800; cursor: pointer;
          font-family: inherit; margin-top: 6px;
          box-shadow: 0 6px 20px rgba(0,200,150,0.4);
          transition: all 0.2s; letter-spacing: 0.1px;
        }
        .rg-submit:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(0,200,150,0.5); }
        .rg-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .rg-footer { text-align: center; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.5); }
        .rg-footer a { color: #00C896; font-weight: 700; text-decoration: none; }
        .rg-footer a:hover { text-decoration: underline; }

        .rg-terms {
          font-size: 11px; color: rgba(255,255,255,0.3); text-align: center;
          margin-top: 14px; line-height: 1.6;
        }
        .rg-terms a { color: rgba(255,255,255,0.5); text-decoration: underline; }

        @media (max-width: 480px) {
          .rg-card { padding: 24px 16px; }
          .rg-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rg-bg">
        <div className="rg-inner">

          <Link to="/" className="rg-logo">
            <div className="rg-logo-icon">🛒</div>
            <span className="rg-logo-text">Scalable<span>nexus</span></span>
          </Link>

          <div className="rg-card">
            <div className="rg-header">
              <div className="rg-header-icon">🚀</div>
              <h1 className="rg-title">Join the Community</h1>
              <p className="rg-sub">Free to join. Free to post. Built for Zimbabwe.</p>
            </div>

            {error && <div className="rg-error">{error}</div>}

            <form onSubmit={handleSubmit}>

              <p className="rg-section-label">Personal Details</p>

              <div className="rg-field">
                <label className="rg-label">Full Name *</label>
                <input className="rg-input" type="text" name="name"
                  value={form.name} onChange={handleChange}
                  placeholder="Your full name" required />
              </div>

              <div className="rg-field">
                <label className="rg-label">Email Address *</label>
                <input className="rg-input" type="email" name="email"
                  value={form.email} onChange={handleChange}
                  placeholder="your@email.com" required />
              </div>

              <div className="rg-field">
                <label className="rg-label">Password *</label>
                <input className="rg-input" type="password" name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="At least 6 characters" required minLength={6} />
              </div>

              <div className="rg-field">
                <label className="rg-label">WhatsApp Number *</label>
                <input className="rg-input" type="tel" name="phone"
                  value={form.phone} onChange={handleChange}
                  placeholder="+263771234567" required />
                <p className="rg-hint">Include country code — e.g. +263 for Zimbabwe, +27 for South Africa</p>
              </div>

              <p className="rg-section-label">Your Location</p>

              <div className="rg-field">
                <label className="rg-label">Country *</label>
                <input className="rg-input" type="text" name="country"
                  value={form.location.country}
                  onChange={handleLocation}
                  placeholder="e.g. Zimbabwe, South Africa" required />
              </div>

              <div className="rg-row">
                <div className="rg-field">
                  <label className="rg-label">City *</label>
                  <select
                    className="rg-select"
                    name="city"
                    value={form.location.city}
                    onChange={handleLocation}
                    required
                  >
                    <option value="" disabled>Select your city</option>
                    {ZIM_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="rg-field">
                  <label className="rg-label">Area / Suburb</label>
                  <input className="rg-input" type="text" name="area"
                    value={form.location.area}
                    onChange={handleLocation}
                    placeholder="e.g. Mount Pleasant" />
                </div>
              </div>

              <p className="rg-hint" style={{ marginTop: '-8px', marginBottom: '16px' }}>
                📍 This helps buyers and sellers near you find your listings first
              </p>

              <button className="rg-submit" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : '🚀 Create Free Account'}
              </button>

            </form>

            <p className="rg-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>

            <p className="rg-terms">
              By registering you agree to our{' '}
              <Link to="/legal/terms">Terms of Use</Link> and{' '}
              <Link to="/legal/privacy">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}