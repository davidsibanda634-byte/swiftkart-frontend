import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openSection, setOpenSection] = useState(null)

  function handleLogout() {
    logout()
    navigate('/')
  }

  function toggleSection(key) {
    setOpenSection(prev => prev === key ? null : key)
  }

  const accountItems = [
    { icon: '👤', label: 'My Profile', to: user ? '/profile/' + user._id : '/login', bg: 'rgba(0,200,150,0.12)' },
    { icon: '🛍️', label: 'My Listings', to: '/my-listings', bg: 'rgba(0,200,150,0.12)' },
    { icon: '❤️', label: 'Saved Items', to: '/saved', bg: 'rgba(239,68,68,0.12)' },
    { icon: '➕', label: 'Post a Listing', to: '/create', bg: 'rgba(0,200,150,0.12)' },
  ]

  const exploreItems = [
    { icon: '🛍️', label: 'Marketplace', to: '/marketplace', bg: 'rgba(0,200,150,0.12)' },
    { icon: '🧑‍💼', label: 'Services', to: '/services', bg: 'rgba(37,99,235,0.12)' },
    { icon: '💼', label: 'Jobs', to: '/jobs', bg: 'rgba(124,58,237,0.12)' },
    { icon: '🎉', label: 'Events', to: '/events', bg: 'rgba(245,158,11,0.12)' },
    { icon: '🏠', label: 'Accommodation', to: '/accommodation', bg: 'rgba(239,68,68,0.12)' },
  ]

  const helpItems = [
    { icon: '❓', label: 'How to Buy', to: '/help/how-to-buy', bg: 'rgba(37,99,235,0.12)' },
    { icon: '🏪', label: 'How to Sell', to: '/help/how-to-sell', bg: 'rgba(37,99,235,0.12)' },
    { icon: '🔒', label: 'Staying Safe', to: '/help/safety', bg: 'rgba(239,68,68,0.12)' },
    { icon: '💬', label: 'Contact Support', to: '/help/contact', bg: 'rgba(37,99,235,0.12)' },
    { icon: '🐛', label: 'Report a Bug', to: '/help/bug', bg: 'rgba(245,158,11,0.12)' },
  ]

  const legalItems = [
    { icon: '📋', label: 'Terms of Use', to: '/legal/terms', bg: 'rgba(255,255,255,0.06)' },
    { icon: '🔐', label: 'Privacy Policy', to: '/legal/privacy', bg: 'rgba(255,255,255,0.06)' },
    { icon: '🛡️', label: 'Privacy Centre', to: '/legal/privacy-centre', bg: 'rgba(255,255,255,0.06)' },
    { icon: '🏢', label: 'About Us', to: '/about', bg: 'rgba(255,255,255,0.06)' },
    { icon: '📜', label: 'Cookie Policy', to: '/legal/cookies', bg: 'rgba(255,255,255,0.06)' },
    { icon: '⚖️', label: 'Community Guidelines', to: '/legal/guidelines', bg: 'rgba(255,255,255,0.06)' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pm-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #0a0f1e;
        }

        /* ── Header ── */
        .pm-header {
          background: linear-gradient(160deg, #08162F 0%, #0f2167 100%);
          padding: 48px 20px 28px;
          position: relative;
        }
        .pm-back {
          position: absolute; top: 14px; left: 14px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7); width: 34px; height: 34px; border-radius: 50%;
          font-size: 15px; cursor: pointer; display: flex; align-items: center;
          justify-content: center; font-family: inherit; transition: all 0.2s;
        }
        .pm-back:hover { background: rgba(255,255,255,0.15); color: white; }

        .pm-avatar-wrap { display: flex; flex-direction: column; align-items: center; }
        .pm-avatar {
          width: 82px; height: 82px; border-radius: 50%;
          background: linear-gradient(135deg, #00C896, #059669);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; font-weight: 800; color: white;
          border: 3px solid rgba(255,255,255,0.2); margin-bottom: 14px;
          box-shadow: 0 8px 28px rgba(0,200,150,0.35);
        }
        .pm-avatar-guest {
          width: 82px; height: 82px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 34px; margin-bottom: 14px;
        }
        .pm-name { font-size: 20px; font-weight: 800; color: white; margin: 0 0 3px; text-align: center; }
        .pm-email { font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; font-weight: 500; margin: 0 0 16px; }
        .pm-guest-label { font-size: 17px; color: rgba(255,255,255,0.7); font-weight: 700; text-align: center; margin: 0 0 4px; }

        .pm-verified-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(0,200,150,0.15); border: 1px solid rgba(0,200,150,0.3);
          color: #34d399; padding: 4px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.3px; margin-bottom: 16px;
        }

        .pm-stats {
          display: flex; gap: 1px; border-radius: 14px; overflow: hidden;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
        }
        .pm-stat { flex: 1; padding: 12px 8px; text-align: center; }
        .pm-stat + .pm-stat { border-left: 1px solid rgba(255,255,255,0.06); }
        .pm-stat-num { font-size: 17px; font-weight: 800; color: #00C896; }
        .pm-stat-label { font-size: 9.5px; color: rgba(255,255,255,0.35); font-weight: 700; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.4px; }

        /* ── Content ── */
        .pm-content { padding: 12px 14px 100px; }

        /* ── Section Group ── */
        .pm-group { margin-bottom: 8px; }

        .pm-group-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px; border-radius: 14px; cursor: pointer;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.2s; user-select: none;
        }
        .pm-group-header:hover { background: rgba(255,255,255,0.07); }
        .pm-group-header.open {
          border-radius: 14px 14px 0 0; border-bottom-color: transparent;
          background: rgba(255,255,255,0.06);
        }

        .pm-group-left { display: flex; align-items: center; gap: 12px; }
        .pm-group-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0;
        }
        .pm-group-title { font-size: 14px; font-weight: 700; color: white; }
        .pm-group-sub { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; margin-top: 1px; }
        .pm-group-chevron {
          font-size: 12px; color: rgba(255,255,255,0.3); transition: transform 0.25s;
        }
        .pm-group-chevron.open { transform: rotate(180deg); }

        /* ── Dropdown body ── */
        .pm-dropdown {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-top: none; border-radius: 0 0 14px 14px; overflow: hidden;
        }

        /* ── Item inside dropdown ── */
        .pm-item {
          display: flex; align-items: center; gap: 13px;
          padding: 13px 16px; font-size: 13.5px; font-weight: 600;
          color: rgba(255,255,255,0.75); text-decoration: none; cursor: pointer;
          transition: background 0.15s; border: none; background: none;
          width: 100%; font-family: inherit; text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .pm-item:last-child { border-bottom: none; }
        .pm-item:hover { background: rgba(255,255,255,0.06); color: white; }
        .pm-item.danger { color: #fca5a5; }
        .pm-item.danger:hover { background: rgba(239,68,68,0.1); }
        .pm-item.admin-item { color: #c4b5fd; }
        .pm-item.admin-item:hover { background: rgba(124,58,237,0.1); }

        .pm-item-icon {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .pm-item-arrow { margin-left: auto; color: rgba(255,255,255,0.18); font-size: 13px; }

        /* ── Direct link (not in dropdown) ── */
        .pm-direct-item {
          display: flex; align-items: center; gap: 13px;
          padding: 14px 16px; border-radius: 14px; font-size: 13.5px; font-weight: 600;
          color: rgba(255,255,255,0.75); text-decoration: none; cursor: pointer;
          transition: all 0.2s; border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.04); width: 100%; font-family: inherit;
          text-align: left; margin-bottom: 8px;
        }
        .pm-direct-item:hover { background: rgba(255,255,255,0.08); color: white; }
        .pm-direct-item.danger { color: #fca5a5; border-color: rgba(239,68,68,0.15); background: rgba(239,68,68,0.05); }
        .pm-direct-item.danger:hover { background: rgba(239,68,68,0.1); }

        .pm-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 12px 0; }

        /* ── Auth buttons ── */
        .pm-auth { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
        .pm-auth-btn {
          display: block; padding: 14px 16px; border-radius: 14px; font-weight: 700;
          font-size: 14px; text-align: center; text-decoration: none;
          font-family: inherit; cursor: pointer; border: none; transition: opacity 0.2s;
        }
        .pm-auth-btn:hover { opacity: 0.88; }

        /* ── App version ── */
        .pm-version { text-align: center; font-size: 11px; color: rgba(255,255,255,0.18); font-weight: 600; margin-top: 24px; }
        .pm-version span { color: #00C896; }

        @media (min-width: 769px) { .pm-wrap { max-width: 520px; margin: 0 auto; } }
      `}</style>

      <div className="pm-wrap">

        {/* ── Header ── */}
        <div className="pm-header">
          <button className="pm-back" onClick={() => navigate(-1)}>←</button>
          <div className="pm-avatar-wrap">
            {user ? (
              <>
                <div className="pm-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <p className="pm-name">{user.name}</p>
                <p className="pm-email">{user.email}</p>
                <div className="pm-verified-badge">✅ Campus Member</div>
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
                    <div className="pm-stat-num">🛍️</div>
                    <div className="pm-stat-label">Seller</div>
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
        </div>

        {/* ── Content ── */}
        <div className="pm-content">

          {user ? (
            <>
              {/* ── Manage Account dropdown ── */}
              <div className="pm-group">
                <div
                  className={'pm-group-header' + (openSection === 'account' ? ' open' : '')}
                  onClick={() => toggleSection('account')}
                >
                  <div className="pm-group-left">
                    <div className="pm-group-icon" style={{ background: 'rgba(0,200,150,0.12)' }}>⚙️</div>
                    <div>
                      <div className="pm-group-title">Manage Account</div>
                      <div className="pm-group-sub">Profile, listings, saved items</div>
                    </div>
                  </div>
                  <span className={'pm-group-chevron' + (openSection === 'account' ? ' open' : '')}>▼</span>
                </div>
                {openSection === 'account' && (
                  <div className="pm-dropdown">
                    {accountItems.map(item => (
                      <Link key={item.label} to={item.to} className="pm-item">
                        <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                        {item.label}
                        <span className="pm-item-arrow">›</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Explore dropdown ── */}
              <div className="pm-group">
                <div
                  className={'pm-group-header' + (openSection === 'explore' ? ' open' : '')}
                  onClick={() => toggleSection('explore')}
                >
                  <div className="pm-group-left">
                    <div className="pm-group-icon" style={{ background: 'rgba(37,99,235,0.12)' }}>🗂️</div>
                    <div>
                      <div className="pm-group-title">Explore Platform</div>
                      <div className="pm-group-sub">Marketplace, jobs, events & more</div>
                    </div>
                  </div>
                  <span className={'pm-group-chevron' + (openSection === 'explore' ? ' open' : '')}>▼</span>
                </div>
                {openSection === 'explore' && (
                  <div className="pm-dropdown">
                    {exploreItems.map(item => (
                      <Link key={item.label} to={item.to} className="pm-item">
                        <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                        {item.label}
                        <span className="pm-item-arrow">›</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Admin ── */}
              {user.isAdmin && (
                <div className="pm-group">
                  <div
                    className={'pm-group-header' + (openSection === 'admin' ? ' open' : '')}
                    onClick={() => toggleSection('admin')}
                  >
                    <div className="pm-group-left">
                      <div className="pm-group-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>🛡️</div>
                      <div>
                        <div className="pm-group-title" style={{ color: '#c4b5fd' }}>Administration</div>
                        <div className="pm-group-sub">Manage the platform</div>
                      </div>
                    </div>
                    <span className={'pm-group-chevron' + (openSection === 'admin' ? ' open' : '')}>▼</span>
                  </div>
                  {openSection === 'admin' && (
                    <div className="pm-dropdown">
                      {[
                        { icon: '📊', label: 'Dashboard', to: '/admin', bg: 'rgba(124,58,237,0.15)' },
                        { icon: '👤', label: 'Manage Users', to: '/admin/users', bg: 'rgba(124,58,237,0.15)' },
                        { icon: '🛍️', label: 'Manage Listings', to: '/admin/listings', bg: 'rgba(124,58,237,0.15)' },
                        { icon: '🚩', label: 'Reports', to: '/admin/reports', bg: 'rgba(239,68,68,0.12)' },
                        { icon: '📈', label: 'Analytics', to: '/admin/analytics', bg: 'rgba(124,58,237,0.15)' },
                        { icon: '💬', label: 'Activity Feed', to: '/admin/activity', bg: 'rgba(124,58,237,0.15)' },
                      ].map(item => (
                        <Link key={item.label} to={item.to} className="pm-item admin-item">
                          <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                          {item.label}
                          <span className="pm-item-arrow">›</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <hr className="pm-divider" />

              {/* ── Help Centre dropdown ── */}
              <div className="pm-group">
                <div
                  className={'pm-group-header' + (openSection === 'help' ? ' open' : '')}
                  onClick={() => toggleSection('help')}
                >
                  <div className="pm-group-left">
                    <div className="pm-group-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>🆘</div>
                    <div>
                      <div className="pm-group-title">Help Centre</div>
                      <div className="pm-group-sub">Guides, safety tips, support</div>
                    </div>
                  </div>
                  <span className={'pm-group-chevron' + (openSection === 'help' ? ' open' : '')}>▼</span>
                </div>
                {openSection === 'help' && (
                  <div className="pm-dropdown">
                    {helpItems.map(item => (
                      <Link key={item.label} to={item.to} className="pm-item">
                        <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                        {item.label}
                        <span className="pm-item-arrow">›</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Legal & Policies dropdown ── */}
              <div className="pm-group">
                <div
                  className={'pm-group-header' + (openSection === 'legal' ? ' open' : '')}
                  onClick={() => toggleSection('legal')}
                >
                  <div className="pm-group-left">
                    <div className="pm-group-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>⚖️</div>
                    <div>
                      <div className="pm-group-title">Legal & Policies</div>
                      <div className="pm-group-sub">Terms, privacy, about us</div>
                    </div>
                  </div>
                  <span className={'pm-group-chevron' + (openSection === 'legal' ? ' open' : '')}>▼</span>
                </div>
                {openSection === 'legal' && (
                  <div className="pm-dropdown">
                    {legalItems.map(item => (
                      <Link key={item.label} to={item.to} className="pm-item">
                        <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                        {item.label}
                        <span className="pm-item-arrow">›</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <hr className="pm-divider" />

              {/* ── Logout ── */}
              <button className="pm-direct-item danger" onClick={handleLogout}>
                <div className="pm-item-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>🚪</div>
                Logout
                <span className="pm-item-arrow">›</span>
              </button>
            </>
          ) : (
            <>
              {/* ── Guest: Explore dropdown ── */}
              <div className="pm-group">
                <div
                  className={'pm-group-header' + (openSection === 'explore' ? ' open' : '')}
                  onClick={() => toggleSection('explore')}
                >
                  <div className="pm-group-left">
                    <div className="pm-group-icon" style={{ background: 'rgba(37,99,235,0.12)' }}>🗂️</div>
                    <div>
                      <div className="pm-group-title">Explore Platform</div>
                      <div className="pm-group-sub">Browse without an account</div>
                    </div>
                  </div>
                  <span className={'pm-group-chevron' + (openSection === 'explore' ? ' open' : '')}>▼</span>
                </div>
                {openSection === 'explore' && (
                  <div className="pm-dropdown">
                    {exploreItems.map(item => (
                      <Link key={item.label} to={item.to} className="pm-item">
                        <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                        {item.label}
                        <span className="pm-item-arrow">›</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Guest: Help ── */}
              <div className="pm-group">
                <div
                  className={'pm-group-header' + (openSection === 'help' ? ' open' : '')}
                  onClick={() => toggleSection('help')}
                >
                  <div className="pm-group-left">
                    <div className="pm-group-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>🆘</div>
                    <div>
                      <div className="pm-group-title">Help Centre</div>
                      <div className="pm-group-sub">Guides, safety tips, support</div>
                    </div>
                  </div>
                  <span className={'pm-group-chevron' + (openSection === 'help' ? ' open' : '')}>▼</span>
                </div>
                {openSection === 'help' && (
                  <div className="pm-dropdown">
                    {helpItems.map(item => (
                      <Link key={item.label} to={item.to} className="pm-item">
                        <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                        {item.label}
                        <span className="pm-item-arrow">›</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Guest: Legal ── */}
              <div className="pm-group">
                <div
                  className={'pm-group-header' + (openSection === 'legal' ? ' open' : '')}
                  onClick={() => toggleSection('legal')}
                >
                  <div className="pm-group-left">
                    <div className="pm-group-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>⚖️</div>
                    <div>
                      <div className="pm-group-title">Legal & Policies</div>
                      <div className="pm-group-sub">Terms, privacy, about us</div>
                    </div>
                  </div>
                  <span className={'pm-group-chevron' + (openSection === 'legal' ? ' open' : '')}>▼</span>
                </div>
                {openSection === 'legal' && (
                  <div className="pm-dropdown">
                    {legalItems.map(item => (
                      <Link key={item.label} to={item.to} className="pm-item">
                        <div className="pm-item-icon" style={{ background: item.bg }}>{item.icon}</div>
                        {item.label}
                        <span className="pm-item-arrow">›</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <hr className="pm-divider" />

              <div className="pm-auth">
                <Link to="/login" className="pm-auth-btn"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Login to Your Account
                </Link>
                <Link to="/register" className="pm-auth-btn"
                  style={{ background: 'linear-gradient(135deg,#00C896,#059669)', color: 'white' }}>
                  Register Free — Join the Community
                </Link>
              </div>
            </>
          )}

          <p className="pm-version">Scalable<span>nexus</span> v1.0 · Built for Campus Zimbabwe</p>
        </div>
      </div>
    </>
  )
}