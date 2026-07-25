import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { section: 'MAIN' },
  { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { to: '/admin/users', icon: '👤', label: 'Users', key: 'userCount' },
  { to: '/admin/listings', icon: '🛍️', label: 'Listings', key: 'listingCount' },
  { to: '/admin/reports', icon: '🚩', label: 'Reports', key: 'reportCount' },
  { section: 'INSIGHTS' },
  { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
  { to: '/admin/activity', icon: '🕐', label: 'Activity Log' },
  { section: 'SETTINGS' },
  { to: '/admin/settings', icon: '⚙️', label: 'Platform Settings' },
  { to: '/admin/announcements', icon: '📢', label: 'Announcements' },
]

export default function AdminLayout({ children, stats }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  function isActive(to, exact) {
    if (exact) return location.pathname === '/admin'
    return location.pathname === to
  }

  const currentPage = location.pathname.split('/admin')[1]?.replace('/', '') || 'Dashboard'
  const pageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1) || 'Dashboard'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          min-height: 100vh;
          background: #f0f2f8;
        }

        /* ── SIDEBAR ── */
        .adm-sidebar {
          width: 230px;
          background: linear-gradient(180deg, #06112a 0%, #0a1940 50%, #06112a 100%);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 200;
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          overflow-y: auto;
          scrollbar-width: none;
          box-shadow: 4px 0 24px rgba(0,0,0,0.3);
        }
        .adm-sidebar::-webkit-scrollbar { display: none; }

        /* Logo area */
        .adm-sidebar-top {
          padding: 22px 18px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .adm-logo-link {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 18px;
        }
        .adm-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #00C896, #059669);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(0,200,150,0.4);
        }
        .adm-logo-text { font-size: 16px; font-weight: 800; color: white; letter-spacing: -0.3px; }
        .adm-logo-text span { color: #00C896; }

        .adm-admin-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(0,200,150,0.12);
          border: 1px solid rgba(0,200,150,0.25);
          color: #00C896; font-size: 9.5px; font-weight: 800;
          padding: 3px 9px; border-radius: 6px;
          letter-spacing: 0.8px; margin-bottom: 10px;
        }

        .adm-user-name { font-size: 13px; font-weight: 700; color: white; }
        .adm-user-email { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 2px; }

        /* Nav */
        .adm-nav { flex: 1; padding: 8px 12px 12px; }

        .adm-nav-section {
          font-size: 9px; font-weight: 800;
          color: rgba(255,255,255,0.22);
          letter-spacing: 1.4px;
          padding: 16px 8px 6px;
          text-transform: uppercase;
        }

        .adm-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          text-decoration: none;
          font-size: 12.5px; font-weight: 600;
          color: rgba(255,255,255,0.52);
          transition: all 0.18s;
          margin-bottom: 2px;
          position: relative;
        }
        .adm-nav-item:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.9);
        }
        .adm-nav-item.active {
          background: linear-gradient(135deg, rgba(0,200,150,0.2), rgba(0,200,150,0.08));
          color: #00C896;
          border: 1px solid rgba(0,200,150,0.18);
        }
        .adm-nav-item.active::before {
          content: '';
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; background: #00C896;
          border-radius: 0 3px 3px 0;
        }

        .adm-nav-icon { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }

        .adm-nav-badge {
          margin-left: auto;
          font-size: 10px; font-weight: 800;
          padding: 2px 7px; border-radius: 8px;
          min-width: 20px; text-align: center;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
        }
        .adm-nav-item.active .adm-nav-badge {
          background: rgba(0,200,150,0.2);
          color: #00C896;
        }
        .adm-nav-badge.danger {
          background: rgba(239,68,68,0.2);
          color: #f87171;
        }

        /* Footer */
        .adm-sidebar-footer {
          padding: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .adm-footer-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 12px; border-radius: 10px;
          font-size: 12px; font-weight: 600;
          background: none; border: none;
          cursor: pointer; font-family: inherit;
          width: 100%; transition: all 0.18s;
          text-decoration: none;
        }
        .adm-footer-back { color: rgba(255,255,255,0.4); }
        .adm-footer-back:hover { color: white; background: rgba(255,255,255,0.07); }
        .adm-footer-logout { color: rgba(239,68,68,0.65); margin-top: 3px; }
        .adm-footer-logout:hover { color: #ef4444; background: rgba(239,68,68,0.08); }

        /* ── MAIN ── */
        .adm-main {
          margin-left: 230px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* ── TOP BAR ── */
        .adm-topbar {
          background: white;
          border-bottom: 1px solid #eaecf4;
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 1px 10px rgba(0,0,0,0.05);
        }

        .adm-topbar-left { display: flex; align-items: center; gap: 14px; }

        .adm-hamburger {
          display: none;
          background: none; border: 1.5px solid #e8ecf4;
          border-radius: 8px; cursor: pointer;
          font-size: 16px; color: #374151;
          width: 36px; height: 36px;
          align-items: center; justify-content: center;
        }

        .adm-breadcrumb {
          font-size: 13px; font-weight: 500; color: #9ca3af;
        }
        .adm-breadcrumb strong { color: #111827; font-weight: 700; }

        .adm-topbar-right { display: flex; align-items: center; gap: 10px; }

        .adm-search-wrap {
          display: flex; align-items: center; gap: 8px;
          background: #f8fafc; border: 1.5px solid #eaecf4;
          border-radius: 10px; height: 38px; padding: 0 14px;
          transition: all 0.2s; width: 200px;
        }
        .adm-search-wrap:focus-within {
          border-color: #00C896;
          box-shadow: 0 0 0 3px rgba(0,200,150,0.1);
          background: white;
        }
        .adm-search-wrap input {
          border: none; outline: none; background: transparent;
          font-size: 12.5px; color: #374151; font-family: inherit; width: 100%;
        }
        .adm-search-wrap input::placeholder { color: #c0c7d4; }

        .adm-topbar-icon-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: #f8fafc; border: 1.5px solid #eaecf4;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px; position: relative;
          transition: all 0.2s; text-decoration: none; color: inherit;
        }
        .adm-topbar-icon-btn:hover { border-color: #00C896; background: #ecfdf5; }

        .adm-notif-dot {
          position: absolute; top: 7px; right: 7px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #ef4444; border: 2px solid white;
        }

        .adm-topbar-avatar {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #08162F, #1e3a8a);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: white; font-weight: 800;
          cursor: pointer; border: 2px solid #eaecf4;
          transition: border-color 0.2s;
        }
        .adm-topbar-avatar:hover { border-color: #00C896; }

        /* ── CONTENT ── */
        .adm-content {
          flex: 1;
          padding: 28px;
        }

        .adm-page-header { margin-bottom: 24px; }
        .adm-page-title {
          font-size: 22px; font-weight: 800; color: #08162F;
          margin: 0 0 5px; letter-spacing: -0.4px;
          display: flex; align-items: center; gap: 10px;
        }
        .adm-page-sub { font-size: 13px; color: #9ca3af; margin: 0; font-weight: 500; }

        /* Overlay */
        .adm-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 190; backdrop-filter: blur(2px);
        }
        .adm-overlay.open { display: block; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .adm-sidebar { transform: translateX(-100%); }
          .adm-sidebar.open { transform: translateX(0); }
          .adm-main { margin-left: 0; }
          .adm-hamburger { display: flex !important; }
          .adm-search-wrap { display: none; }
          .adm-content { padding: 16px; }
          .adm-topbar { padding: 0 16px; }
        }
      `}</style>

      <div className="adm-root">

        {/* Mobile overlay */}
        <div
          className={'adm-overlay' + (sidebarOpen ? ' open' : '')}
          onClick={function() { setSidebarOpen(false) }}
        />

        {/* ── SIDEBAR ── */}
        <aside className={'adm-sidebar' + (sidebarOpen ? ' open' : '')}>

          <div className="adm-sidebar-top">
            <Link to="/" className="adm-logo-link">
              <div className="adm-logo-icon">🛒</div>
              <span className="adm-logo-text">Scalable<span>nexus</span></span>
            </Link>
            <div className="adm-admin-pill">🛡️ ADMIN PANEL</div>
            <p className="adm-user-name">{user?.name || 'Admin'}</p>
            <p className="adm-user-email">{user?.email}</p>
          </div>

          <nav className="adm-nav">
            {NAV.map(function(item, i) {
              if (item.section) {
                return <div key={i} className="adm-nav-section">{item.section}</div>
              }
              const count = stats && item.key ? stats[item.key] : null
              const active = isActive(item.to, item.exact)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={'adm-nav-item' + (active ? ' active' : '')}
                  onClick={function() { setSidebarOpen(false) }}
                >
                  <span className="adm-nav-icon">{item.icon}</span>
                  {item.label}
                  {count !== null && count !== undefined && (
                    <span className={
                      'adm-nav-badge' +
                      (item.key === 'reportCount' && count > 0 ? ' danger' : '')
                    }>
                      {count}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="adm-sidebar-footer">
            <Link to="/" className="adm-footer-btn adm-footer-back">
              ← Back to Site
            </Link>
            <button className="adm-footer-btn adm-footer-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="adm-main">

          <div className="adm-topbar">
            <div className="adm-topbar-left">
              <button
                className="adm-hamburger"
                onClick={function() { setSidebarOpen(!sidebarOpen) }}
              >
                ☰
              </button>
              <div className="adm-breadcrumb">
                Admin / <strong>{pageName}</strong>
              </div>
            </div>

            <div className="adm-topbar-right">
              <div className="adm-search-wrap">
                <span style={{ color: '#c0c7d4', fontSize: '13px' }}>🔍</span>
                <input placeholder="Search..." />
              </div>

              <div className="adm-topbar-icon-btn" title="Notifications">
                🔔
                {stats && stats.reportCount > 0 && <div className="adm-notif-dot" />}
              </div>

              <Link to="/" className="adm-topbar-icon-btn" title="View Live Site">
                🌐
              </Link>

              <div className="adm-topbar-avatar" title={user?.name}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="adm-content">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}