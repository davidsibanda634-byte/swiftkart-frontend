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
          background: #0a0f1e;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .sk-navbar-inner {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          max-width: 1400px;
          margin: 0 auto;
          gap: 16px;
        }
        .sk-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .sk-logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .sk-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }
        .sk-logo-text span { color: #34d399; }

        .sk-nav-center {
          display: flex;
          align-items: center;
          gap: 2px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .sk-nav-link {
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 7px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .sk-nav-link:hover { color: white; background: rgba(255,255,255,0.1); }

        .sk-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .sk-wa-nav {
          width: 32px;
          height: 32px;
          background: #25d366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .sk-wa-nav:hover { transform: scale(1.1); }
        .sk-user-name {
          color: rgba(255,255,255,0.78);
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }
        .sk-btn-outline {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.22);
          padding: 7px 15px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.2s;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
        }
        .sk-btn-outline:hover { background: rgba(255,255,255,0.18); }
        .sk-btn-green {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 7px 15px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.2s;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 3px 10px rgba(16,185,129,0.3);
        }
        .sk-btn-green:hover { transform: translateY(-1px); }
        .sk-hamburger {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          display: none;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: inherit;
        }
        .sk-mobile-menu {
          background: #0d1224;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .sk-mobile-nav-link {
          color: rgba(255,255,255,0.78);
          font-size: 14px;
          font-weight: 600;
          padding: 10px 13px;
          border-radius: 9px;
          text-decoration: none;
          display: block;
          transition: background 0.2s;
        }
        .sk-mobile-nav-link:hover { background: rgba(255,255,255,0.08); color: white; }
        .sk-mobile-divider { border: none; border-top: 1px solid rgba(255,255,255,0.09); margin: 5px 0; }
        .sk-mobile-action {
          padding: 11px 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          text-align: center;
          text-decoration: none;
          display: block;
          font-family: inherit;
          cursor: pointer;
          border: none;
          margin-bottom: 5px;
          transition: opacity 0.2s;
        }
        .sk-mobile-action:hover { opacity: 0.88; }

        @media (min-width: 769px) {
          .sk-hamburger { display: none !important; }
          .sk-nav-center { display: flex !important; }
          .sk-nav-right { display: flex !important; }
        }
        @media (max-width: 768px) {
          .sk-nav-center { display: none !important; }
          .sk-nav-right { display: none !important; }
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

          <div className="sk-nav-center">
            {[
              { label: 'Marketplace', to: '/marketplace' },
              { label: 'Services', to: '/services' },
              { label: 'Jobs', to: '/jobs' },
              { label: 'Events', to: '/events' },
            ].map(item => (
              <Link key={item.label} to={item.to} className="sk-nav-link">{item.label}</Link>
            ))}
          </div>

          <div className="sk-nav-right">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="sk-wa-nav">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            {user ? (
              <>
                <span className="sk-user-name">Hi, {user.name} 👋</span>
                <Link to="/my-listings" className="sk-btn-outline">My Listings</Link>
                <button onClick={handleLogout} className="sk-btn-outline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="sk-btn-outline">Login</Link>
                <Link to="/register" className="sk-btn-green">Register</Link>
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
              <Link key={item.label} to={item.to} className="sk-mobile-nav-link"
                onClick={() => setMenuOpen(false)}>{item.label}</Link>
            ))}
            <hr className="sk-mobile-divider" />
            {user ? (
              <>
                <span className="sk-mobile-nav-link" style={{ color: 'rgba(255,255,255,0.45)', cursor: 'default' }}>
                  Hi, {user.name}
                </span>
                <Link to="/my-listings" onClick={() => setMenuOpen(false)} className="sk-mobile-action"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>My Listings</Link>
                <Link to="/create" onClick={() => setMenuOpen(false)} className="sk-mobile-action"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white' }}>+ Post Listing</Link>
                <button onClick={handleLogout} className="sk-mobile-action"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="sk-mobile-action"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="sk-mobile-action"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white' }}>Register Free</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  )
}