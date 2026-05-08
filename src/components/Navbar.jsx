import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-navbar {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(135deg, #0f2167 0%, #1a3a8f 50%, #1e4db7 100%);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 24px rgba(15, 33, 103, 0.35);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .sk-navbar-inner {
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .sk-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .sk-logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(16,185,129,0.4);
          flex-shrink: 0;
        }
        .sk-logo-text {
          font-size: 20px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }
        .sk-logo-text span { color: #34d399; }
        .sk-nav-links {
          display: flex;
          gap: 4px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .sk-nav-link {
          color: rgba(255,255,255,0.82);
          font-size: 13.5px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .sk-nav-link:hover {
          color: white;
          background: rgba(255,255,255,0.12);
        }
        .sk-auth-area {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sk-user-greeting {
          color: rgba(255,255,255,0.75);
          font-size: 12.5px;
          font-weight: 500;
          white-space: nowrap;
        }
        .sk-btn-outline {
          background: rgba(255,255,255,0.12);
          color: white;
          border: 1px solid rgba(255,255,255,0.25);
          padding: 8px 16px;
          border-radius: 22px;
          font-weight: 600;
          font-size: 12.5px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.2s ease;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
        }
        .sk-btn-outline:hover {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.5);
        }
        .sk-btn-gold {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #1e3a5f;
          border: none;
          padding: 8px 18px;
          border-radius: 22px;
          font-weight: 700;
          font-size: 12.5px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.2s ease;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(245,158,11,0.35);
        }
        .sk-btn-gold:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(245,158,11,0.45);
        }
        .sk-hamburger {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          display: none;
          font-family: inherit;
          transition: background 0.2s;
        }
        .sk-hamburger:hover { background: rgba(255,255,255,0.2); }
        .sk-mobile-menu {
          background: linear-gradient(180deg, #0f2167, #1e4db7);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .sk-mobile-link {
          color: rgba(255,255,255,0.85);
          font-size: 14px;
          font-weight: 600;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
          cursor: pointer;
        }
        .sk-mobile-link:hover { background: rgba(255,255,255,0.1); color: white; }
        .sk-mobile-btn {
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13.5px;
          text-align: center;
          text-decoration: none;
          display: block;
          font-family: inherit;
          cursor: pointer;
          border: none;
        }
        .sk-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.15);
          margin: 4px 0;
        }
        @media (min-width: 769px) {
          .sk-hamburger { display: none !important; }
          .sk-nav-links { display: flex !important; }
          .sk-auth-area { display: flex !important; }
        }
        @media (max-width: 768px) {
          .sk-nav-links { display: none !important; }
          .sk-auth-area { display: none !important; }
          .sk-hamburger { display: flex !important; }
          .sk-navbar-inner { padding: 0 16px; }
        }
      `}</style>

      <nav className="sk-navbar">
        <div className="sk-navbar-inner">

          <Link to="/" className="sk-logo">
            <div className="sk-logo-icon">🛒</div>
            <span className="sk-logo-text">Swift<span>Kart</span></span>
          </Link>

          <div className="sk-nav-links">
            {[
              { label: 'Marketplace', to: '/marketplace' },
              { label: 'Services', to: '/services' },
              { label: 'Jobs', to: '/jobs' },
              { label: 'Events', to: '/events' },
            ].map(item => (
              <Link key={item.label} to={item.to} className="sk-nav-link">{item.label}</Link>
            ))}
          </div>

          <div className="sk-auth-area">
            {user ? (
              <>
                <span className="sk-user-greeting">Hi, {user.name} 👋</span>
                <Link to="/my-listings" className="sk-btn-outline">My Listings</Link>
                <button onClick={handleLogout} className="sk-btn-gold">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="sk-btn-outline">Login</Link>
                <Link to="/register" className="sk-btn-gold">Register</Link>
              </>
            )}
          </div>

          <button className="sk-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <div className="sk-mobile-menu">
            {[
              { label: '🛍️ Marketplace', to: '/marketplace' },
              { label: '🧑‍💼 Services', to: '/services' },
              { label: '💼 Jobs', to: '/jobs' },
              { label: '🎉 Events', to: '/events' },
            ].map(item => (
              <Link key={item.label} to={item.to} className="sk-mobile-link"
                onClick={() => setMenuOpen(false)}>{item.label}</Link>
            ))}
            <hr className="sk-divider" />
            {user ? (
              <>
                <span className="sk-mobile-link" style={{ cursor: 'default', color: 'rgba(255,255,255,0.6)' }}>
                  Hi, {user.name}
                </span>
                <Link to="/my-listings" onClick={() => setMenuOpen(false)}
                  className="sk-mobile-btn"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  My Listings
                </Link>
                <Link to="/create" onClick={() => setMenuOpen(false)}
                  className="sk-mobile-btn"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
                  + Post Listing
                </Link>
                <button onClick={handleLogout}
                  className="sk-mobile-btn"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1e3a5f' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="sk-mobile-btn"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="sk-mobile-btn"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1e3a5f' }}>
                  Register Free
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  )
}