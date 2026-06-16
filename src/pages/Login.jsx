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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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
          max-width: 400px;
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
          margin-bottom: 28px;
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
          font-size: 22px;
          font-weight: 800;
          color: white;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        }

        .auth-sub {
          font-size: 13.5px;
          color: rgba(255,255,255,0.6);
          margin: 0;
          font-weight: 400;
        }

        .auth-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          margin-bottom: 7px;
        }

        .auth-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 11px;
          font-size: 14px;
          color: white;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
          transition: all 0.2s;
        }

        .auth-input::placeholder { color: rgba(255,255,255,0.35); }
        .auth-input:focus {
          border-color: #10b981;
          background: rgba(255,255,255,0.14);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }

        .auth-field { margin-bottom: 16px; }

        .auth-submit {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          margin-top: 8px;
          box-shadow: 0 6px 20px rgba(16,185,129,0.4);
          transition: all 0.2s;
          letter-spacing: 0.1px;
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
          margin-bottom: 18px;
        }

        .auth-footer {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          margin-top: 20px;
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
          .auth-card { padding: 28px 20px; }
        }
      `}</style>

      <div className="auth-bg">
        <button className="auth-back" onClick={() => navigate('/')}>← Home</button>

        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">🛒</div>
            <h1 className="auth-title">Welcome Back!</h1>
            <p className="auth-sub">Sign in to continue</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email or Phone Number</label>
              <input
                className="auth-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  )
}