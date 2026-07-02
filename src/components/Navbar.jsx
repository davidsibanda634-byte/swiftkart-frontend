
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
    setProfileOpen(false)
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-navbar {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #08162F;
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
          background: linear-gradient(135deg, #00C896, #059669);
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
        .sk-logo-text span { color: #00C896; }

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
          background: linear-gradient(135deg, #00C896, #059669);
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
          box-shadow: 0 3px 10px rgba(0,200,150,0.3);
        }
        .sk-btn-green:hover { transform: translateY(-1px); }

        .sk-profile-wrap { position: relative; }
        .sk-profile-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00C896, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          color: white;
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.2);
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .sk-profile-avatar:hover { border-color: #00C896; transform: scale(1.05); }
        .sk-profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border-radius: 14px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          padding: 8px;
          min-width: 200px;
          z-index: 300;
          border: 1px solid #f1f5f9;
          animation: sk-dropdown-in 0.15s ease;
        }
        @keyframes sk-dropdown-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sk-dropdown-header {
          padding: 10px 12px 8px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 6px;
        }
        .sk-dropdown-name { font-size: 14px; font-weight: 700; color: #111827; }
        .sk-dropdown-sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .sk-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.15s;
          border: none;
          background: none;
          width: 100%;
          font-family: inherit;
        }
        .sk-dropdown-item:hover { background: #f8fafc; color: #111827; }
        .sk-dropdown-item.danger { color: #ef4444; }
        .sk-dropdown-item.danger:hover { background: #fef2f2; }
        .sk-dropdown-item.admin { color: #7c3aed; }
        .sk-dropdown-item.admin:hover { background: #f5f3ff; }
        .sk-dropdown-divider {
          border: none;
          border-top: 1px solid #f1f5f9;
          margin: 6px 0;
        }
        .sk-dropdown-icon { font-size: 16px; width: 20px; text-align: center; }

        /* ── MOBILE PROFILE ICON (replaces hamburger) ── */
        .sk-mobile-profile-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00C896, #059669);
          border: 2px solid rgba(255,255,255,0.25);
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          flex-shrink: 0;
          font-family: inherit;
          transition: all 0.2s;
          position: relative;
        }
        .sk-mobile-profile-btn:hover { border-color: #00C896; transform: scale(1.05); }

        /* Profile drawer overlay */
        .sk-profile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1100;
          animation: sk-fade-in 0.2s ease;
        }
        @keyframes sk-fade-in {
          from { opacity: 0; } to { opacity: 1; }
        }

        /* Profile drawer panel */
        .sk-profile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 82vw;
          max-width: 320px;
          background: #0d1224;
          z-index: 1200;
          display: flex;
          flex-direction: column;
          animation: sk-slide-in 0.25s cubic-bezier(0.32,0.72,0,1);
          overflow-y: auto;
        }
        @keyframes sk-slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        /* Drawer header */
        .sk-drawer-header {
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          padding: 48px 20px 24px;
          position: relative;
        }
        .sk-drawer-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
          transition: background 0.2s;
        }
        .sk-drawer-close:hover { background: rgba(255,255,255,0.2); }

        .sk-drawer-avatar {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00C896, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
          color: white;
          border: 3px solid rgba(255,255,255,0.2);
          margin-bottom: 12px;
        }
        .sk-drawer-avatar-guest {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 12px;
          border: 2px solid rgba(255,255,255,0.15);
        }
        .sk-drawer-name {
          font-size: 17px;
          font-weight: 800;
          color: white;
          margin: 0 0 2px;
        }
        .sk-drawer-email {
          font-size: 11.5px;
          color: rgba(255,255,255,0.45);
          font-weight: 500;
        }
        .sk-drawer-guest-label {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          font-weight: 600;
        }

        /* Drawer body */
        .sk-drawer-body {
          flex: 1;
          padding: 12px 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sk-drawer-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.82);
          text-decoration: none;
          cursor: pointer;
          transition: background 0.15s;
          border: none;
          background: none;
          width: 100%;
          font-family: inherit;
          text-align: left;
        }
        .sk-drawer-item:hover { background: rgba(255,255,255,0.08); color: white; }
        .sk-drawer-item.danger { color: #fca5a5; }
        .sk-drawer-item.danger:hover { background: rgba(239,68,68,0.12); }
        .sk-drawer-item.admin-item { color: #c4b5fd; }
        .sk-drawer-item.admin-item:hover { background: rgba(124,58,237,0.12); }
        .sk-drawer-icon { font-size: 18px; width: 24px; text-align: center; flex-shrink: 0; }
        .sk-drawer-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 6px 0;
        }

        /* Auth buttons in drawer */
        .sk-drawer-auth {
          padding: 0 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sk-drawer-auth-btn {
          display: block;
          padding: 13px 16px;
          border-radius: 11px;
          font-weight: 700;
          font-size: 14px;
          text-align: center;
          text-decoration: none;
          font-family: inherit;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s;
        }
        .sk-drawer-auth-btn:hover { opacity: 0.88; }

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
          .sk-mobile-profile-btn { display: none !important; }
          .sk-nav-center { display: flex !important; }
          .sk-nav-right { display: flex !important; }
        }
        @media (max-width: 768px) {
          .sk-nav-center { display: none !important; }
          .sk-nav-right { display: none !important; }
          .sk-mobile-profile-btn { display: flex !important; }
          .sk-navbar-inner { padding: 0 16px; }
        }
      `}</style>

      <nav className="sk-navbar">
        <div className="sk-navbar-inner">
          <Link to="/" className="sk-logo">
            <div className="sk-logo-icon">🛒</div>
            <span className="sk-logo-text">Scalable<span>nexus</span></span>
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
            {user ? (
              <>
                <Link to="/create" className="sk-btn-green">+ Post Listing</Link>
                <div className="sk-profile-wrap" ref={profileRef}>
                  <div className="sk-profile-avatar" onClick={() => setProfileOpen(!profileOpen)}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {profileOpen && (
                    <div className="sk-profile-dropdown">
                      <div className="sk-dropdown-header">
                        <div className="sk-dropdown-name">{user.name}</div>
                        <div className="sk-dropdown-sub">{user.email}</div>
                      </div>
                      <Link to="/my-listings" className="sk-dropdown-item" onClick={() => setProfileOpen(false)}>
                        <span className="sk-dropdown-icon">🛍️</span> My Listings
                      </Link>
                      {user.isAdmin && (
                        <Link to="/admin" className="sk-dropdown-item admin" onClick={() => setProfileOpen(false)}>
                          <span className="sk-dropdown-icon">🛡️</span> Admin Panel
                        </Link>
                      )}
                      <Link to="/saved" className="sk-dropdown-item" onClick={() => setProfileOpen(false)}>
                        <span className="sk-dropdown-icon">❤️</span> Saved Items
                      </Link>
                      <Link to={'/profile/' + user._id} className="sk-dropdown-item" onClick={() => setProfileOpen(false)}>
                        <span className="sk-dropdown-icon">👤</span> My Profile
                      </Link>
                      <hr className="sk-dropdown-divider" />
                      <button className="sk-dropdown-item danger" onClick={handleLogout}>
                        <span className="sk-dropdown-icon">🚪</span> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="sk-btn-outline">Login</Link>
                <Link to="/register" className="sk-btn-green">Register</Link>
              </>
            )}
          </div>

          {/* Mobile: Profile icon instead of hamburger */}
          <button
  className="sk-mobile-profile-btn"
  onClick={() => navigate('/profile-menu')}
  aria-label="Profile menu"
>
  {user ? user.name?.charAt(0).toUpperCase() : '👤'}
</button>
        </div>

        {/* Mobile profile drawer */}
        {menuOpen && (
          <>
            <div className="sk-profile-overlay" onClick={() => setMenuOpen(false)} />
            <div className="sk-profile-drawer">
              {/* Drawer header */}
              <div className="sk-drawer-header">
                <button className="sk-drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
                {user ? (
                  <>
                    <div className="sk-drawer-avatar">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="sk-drawer-name">{user.name}</div>
                    <div className="sk-drawer-email">{user.email}</div>
                  </>
                ) : (
                  <>
                    <div className="sk-drawer-avatar-guest">👤</div>
                    <div className="sk-drawer-guest-label">Welcome, Guest</div>
                    <div className="sk-drawer-email" style={{ marginTop: 4 }}>Sign in to get started</div>
                  </>
                )}
              </div>

              {/* Navigation links */}
              <div className="sk-drawer-body">
                {[
                  { label: '🛍️ Marketplace', to: '/marketplace' },
                  { label: '🧑‍💼 Services', to: '/services' },
                  { label: '💼 Jobs', to: '/jobs' },
                  { label: '🎉 Events', to: '/events' },
                  { label: '🏠 Accommodation', to: '/accommodation' },
                ].map(item => (
                  <Link key={item.label} to={item.to} className="sk-drawer-item"
                    onClick={() => setMenuOpen(false)}>
                    <span className="sk-drawer-icon">{item.label.split(' ')[0]}</span>
                    {item.label.split(' ').slice(1).join(' ')}
                  </Link>
                ))}

                {user && (
                  <>
                    <hr className="sk-drawer-divider" />
                    <Link to={'/profile/' + user._id} className="sk-drawer-item" onClick={() => setMenuOpen(false)}>
                      <span className="sk-drawer-icon">👤</span> My Profile
                    </Link>
                    <Link to="/my-listings" className="sk-drawer-item" onClick={() => setMenuOpen(false)}>
                      <span className="sk-drawer-icon">🛍️</span> My Listings
                    </Link>
                    <Link to="/saved" className="sk-drawer-item" onClick={() => setMenuOpen(false)}>
                      <span className="sk-drawer-icon">❤️</span> Saved Items
                    </Link>
                    <Link to="/create" className="sk-drawer-item" onClick={() => setMenuOpen(false)}>
                      <span className="sk-drawer-icon">➕</span> Post Listing
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="sk-drawer-item admin-item" onClick={() => setMenuOpen(false)}>
                        <span className="sk-drawer-icon">🛡️</span> Admin Panel
                      </Link>
                    )}
                    <hr className="sk-drawer-divider" />
                    <button className="sk-drawer-item danger" onClick={handleLogout}>
                      <span className="sk-drawer-icon">🚪</span> Logout
                    </button>
                  </>
                )}
              </div>

              {!user && (
                <div className="sk-drawer-auth">
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="sk-drawer-auth-btn"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    className="sk-drawer-auth-btn"
                    style={{ background: 'linear-gradient(135deg,#00C896,#059669)', color: 'white' }}>
                    Register Free
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  )
}