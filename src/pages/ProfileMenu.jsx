import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pm-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #0d1224;
        }

        /* Header */
        .pm-header {
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          padding: 32px 20px 28px;
          position: relative;
        }
        .pm-back {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
          transition: background 0.2s;
        }
        .pm-back:hover { background: rgba(255,255,255,0.2); }

        .pm-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00C896, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          font-weight: 800;
          color: white;
          border: 3px solid rgba(255,255,255,0.2);
          margin: 0 auto 14px;
          box-shadow: 0 8px 24px rgba(0,200,150,0.3);
        }
        .pm-avatar-guest {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 14px;
          border: 2px solid rgba(255,255,255,0.12);
        }
        .pm-name {
          font-size: 20px;
          font-weight: 800;
          color: white;
          text-align: center;
          margin: 0 0 4px;
        }
        .pm-email {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          text-align: center;
          font-weight: 500;
        }
        .pm-guest-label {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          font-weight: 600;
          text-align: center;
        }

        /* Stats row for logged in users */
        .pm-stats {
          display: flex;
          gap: 1px;
          margin-top: 20px;
          background: rgba(255,255,255,0.06);
          border-radius: 14px;
          overflow: hidden;
        }
        .pm-stat {
          flex: 1;
          padding: 12px 8px;
          text-align: center;
          background: rgba(255,255,255,0.04);
        }
        .pm-stat-num {
          font-size: 18px;
          font-weight: 800;
          color: #00C896;
        }
        .pm-stat-label {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          font-weight: 600;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Content */
        .pm-content { padding: 16px 14px 100px; }

        .pm-section-label {
          font-size: 10px;
          font-weight: 800;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 0 6px;
          margin: 18px 0 8px;
        }

        .pm-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
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
          margin-bottom: 2px;
        }
        .pm-item:hover { background: rgba(255,255,255,0.07); color: white; }
        .pm-item.danger { color: #fca5a5; }
        .pm-item.danger:hover { background: rgba(239,68,68,0.1); }
        .pm-item.admin-item { color: #c4b5fd; }
        .pm-item.admin-item:hover { background: rgba(124,58,237,0.1); }

        .pm-item-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .pm-item-arrow {
          margin-left: auto;
          color: rgba(255,255,255,0.2);
          font-size: 14px;
        }

        .pm-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 8px 0;
        }

        /* Auth buttons */
        .pm-auth {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 16px;
        }
        .pm-auth-btn {
          display: block;
          padding: 14px 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          text-align: center;
          text-decoration: none;
          font-family: inherit;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s;
        }
        .pm-auth-btn:hover { opacity: 0.88; }

        @media (min-width: 769px) {
          .pm-wrap { max-width: 480px; margin: 0 auto; }
        }
      `}</style>

      <div className="pm-wrap">
        <div className="pm-header">
          <button className="pm-back" onClick={() => navigate(-1)}>←</button>

          {user ? (
            <>
              <div className="pm-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <p className="pm-name">{user.name}</p>
              <p className="pm-email">{user.email}</p>
              <div className="pm-stats">
                <div className="pm-stat">
                  <div className="pm-stat-num">✓</div>
                  <div className="pm-stat-label">Verified</div>
                </div>
                <div className="pm-stat">
                  <div className="pm-stat-num">📍</div>
                  <div className="pm-stat-label">{user.location?.city || 'Campus'}</div>
                </div>
                <div className="pm-stat">
                  <div className="pm-stat-num">📱</div>
                  <div className="pm-stat-label">WhatsApp</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="pm-avatar-guest">👤</div>
              <p className="pm-guest-label">Welcome, Guest</p>
              <p className="pm-email" style={{ marginTop: 4 }}>Sign in to access your account</p>
            </>
          )}
        </div>

        <div className="pm-content">
          {user ? (
            <>
              <p className="pm-section-label">My Account</p>
              <Link to={'/profile/' + user._id} className="pm-item">
                <div className="pm-item-icon" style={{ background: 'rgba(0,200,150,0.12)' }}>👤</div>
                My Profile
                <span className="pm-item-arrow">›</span>
              </Link>
              <Link to="/my-listings" className="pm-item">
                <div className="pm-item-icon" style={{ background: 'rgba(0,200,150,0.12)' }}>🛍️</div>
                My Listings
                <span className="pm-item-arrow">›</span>
              </Link>
              <Link to="/saved" className="pm-item">
                <div className="pm-item-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>❤️</div>
                Saved Items
                <span className="pm-item-arrow">›</span>
              </Link>
              <Link to="/create" className="pm-item">
                <div className="pm-item-icon" style={{ background: 'rgba(0,200,150,0.12)' }}>➕</div>
                Post a Listing
                <span className="pm-item-arrow">›</span>
              </Link>

              {user.isAdmin && (
                <>
                  <p className="pm-section-label">Administration</p>
                  <Link to="/admin" className="pm-item admin-item">
                    <div className="pm-item-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>🛡️</div>
                    Admin Panel
                    <span className="pm-item-arrow">›</span>
                  </Link>
                </>
              )}

              <p className="pm-section-label">Explore</p>
              {[
                { icon: '🛍️', label: 'Marketplace', to: '/marketplace', bg: 'rgba(0,200,150,0.12)' },
                { icon: '🧑‍💼', label: 'Services', to: '/services', bg: 'rgba(37,99,235,0.12)' },
                { icon: '💼', label: 'Jobs', to: '/jobs', bg: 'rgba(124,58,237,0.12)' },
                { icon: '🎉', label: 'Events', to: '/events', bg: 'rgba(245,158,11,0.12)' },
                { icon: '🏠', label: 'Accommodation', to: '/accommodation', bg: 'rgba(239,68,68,0.12)' },
              ].map(item => (
                <Link key={item.label} to={item.to} className="pm-item">
                  <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                  {item.label}
                  <span className="pm-item-arrow">›</span>
                </Link>
              ))}

              <hr className="pm-divider" />
              <button className="pm-item danger" onClick={handleLogout}>
                <div className="pm-item-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>🚪</div>
                Logout
              </button>
            </>
          ) : (
            <>
              <p className="pm-section-label">Explore</p>
              {[
                { icon: '🛍️', label: 'Marketplace', to: '/marketplace', bg: 'rgba(0,200,150,0.12)' },
                { icon: '🧑‍💼', label: 'Services', to: '/services', bg: 'rgba(37,99,235,0.12)' },
                { icon: '💼', label: 'Jobs', to: '/jobs', bg: 'rgba(124,58,237,0.12)' },
                { icon: '🎉', label: 'Events', to: '/events', bg: 'rgba(245,158,11,0.12)' },
                { icon: '🏠', label: 'Accommodation', to: '/accommodation', bg: 'rgba(239,68,68,0.12)' },
              ].map(item => (
                <Link key={item.label} to={item.to} className="pm-item">
                  <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                  {item.label}
                  <span className="pm-item-arrow">›</span>
                </Link>
              ))}

              <div className="pm-auth">
                <Link to="/login" className="pm-auth-btn"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
                  Login
                </Link>
                <Link to="/register" className="pm-auth-btn"
                  style={{ background: 'linear-gradient(135deg,#00C896,#059669)', color: 'white' }}>
                  Register Free
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}