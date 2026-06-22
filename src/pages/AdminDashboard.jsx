import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export function AdminLayout({ children, stats }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { to: '/admin/users', icon: '👤', label: 'Users', badge: stats?.userCount },
    { to: '/admin/listings', icon: '🛍️', label: 'Listings', badge: stats?.listingCount },
    { to: '/admin/reports', icon: '🚩', label: 'Reports', badge: stats?.reportCount, alert: stats?.reportCount > 0 },
  ]

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/admin'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .adm-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          min-height: calc(100vh - 60px);
          background: #f4f7fb;
        }

        /* Sidebar */
        .adm-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: linear-gradient(180deg, #08162F 0%, #0f2167 100%);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          overflow-y: auto;
        }

        .adm-sidebar-top {
          padding: 24px 16px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .adm-sidebar-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,200,150,0.15);
          border: 1px solid rgba(0,200,150,0.3);
          color: #34d399;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }

        .adm-sidebar-title {
          font-size: 15px;
          font-weight: 800;
          color: white;
          margin: 0 0 2px;
        }

        .adm-sidebar-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }

        .adm-nav {
          padding: 12px 10px;
          flex: 1;
        }

        .adm-nav-label {
          font-size: 10px;
          font-weight: 800;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 0 8px;
          margin: 8px 0 6px;
        }

        .adm-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 2px;
          position: relative;
        }
        .adm-nav-item:hover { background: rgba(255,255,255,0.07); color: white; }
        .adm-nav-item.active { background: rgba(0,200,150,0.15); color: #34d399; }
        .adm-nav-item.active .adm-nav-icon { filter: none; }

        .adm-nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }

        .adm-nav-badge {
          margin-left: auto;
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 10px;
          min-width: 22px;
          text-align: center;
        }
        .adm-nav-item.active .adm-nav-badge { background: rgba(0,200,150,0.2); color: #34d399; }
        .adm-nav-badge.alert { background: rgba(239,68,68,0.2); color: #f87171; }

        .adm-sidebar-footer {
          padding: 14px 10px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .adm-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          font-family: inherit;
        }
        .adm-back-btn:hover { background: rgba(255,255,255,0.07); color: white; }

        /* Main content */
        .adm-main {
          flex: 1;
          padding: 28px 28px 60px;
          min-width: 0;
        }

        .adm-page-header {
          margin-bottom: 24px;
        }

        .adm-page-title {
          font-size: 22px;
          font-weight: 800;
          color: #08162F;
          margin: 0 0 4px;
          letter-spacing: -0.4px;
        }

        .adm-page-sub {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
        }

        /* Stat cards */
        .adm-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        .adm-stat-card {
          background: white;
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
          text-decoration: none;
          display: block;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .adm-stat-card.clickable { cursor: pointer; }
        .adm-stat-card.clickable:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

        .adm-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .adm-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .adm-stat-trend {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .adm-stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #08162F;
          line-height: 1;
          margin: 0 0 4px;
          letter-spacing: -1px;
        }

        .adm-stat-label {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 600;
          margin: 0;
        }

        /* Section */
        .adm-section {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .adm-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f8fafc;
        }

        .adm-section-title {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .adm-section-link {
          font-size: 12px;
          font-weight: 700;
          color: #00C896;
          text-decoration: none;
        }
        .adm-section-link:hover { text-decoration: underline; }

        /* Quick action buttons */
        .adm-actions-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .adm-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .adm-action-btn:hover { transform: translateY(-1px); opacity: 0.9; }

        /* Row items */
        .adm-row-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }
        .adm-row-item:last-child { border-bottom: none; }
        .adm-row-item:hover { background: #fafafa; }

        /* Search */
        .adm-search {
          width: 100%;
          padding: 10px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          outline: none;
          font-family: inherit;
          transition: border 0.2s;
          margin-bottom: 16px;
        }
        .adm-search:focus { border-color: #00C896; }

        /* Mobile sidebar collapses */
        @media (max-width: 900px) {
          .adm-sidebar { display: none; }
          .adm-main { padding: 20px 16px 60px; }
          .adm-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 540px) {
          .adm-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>

      <div className="adm-wrap">
        <aside className="adm-sidebar">
          <div className="adm-sidebar-top">
            <div className="adm-sidebar-badge">🛡️ ADMIN</div>
            <p className="adm-sidebar-title">SwiftKart Admin</p>
            <p className="adm-sidebar-sub">{user?.name}</p>
          </div>

          <nav className="adm-nav">
            <p className="adm-nav-label">Navigation</p>
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={'adm-nav-item' + (isActive(item.to, item.exact) ? ' active' : '')}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge !== undefined && (
                  <span className={'adm-nav-badge' + (item.alert ? ' alert' : '')}>{item.badge}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="adm-sidebar-footer">
            <button className="adm-back-btn" onClick={() => navigate('/')}>
              ← Back to Site
            </button>
          </div>
        </aside>

        <main className="adm-main">
          {children}
        </main>
      </div>
    </>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    api.get('/admin/stats')
      .then(function(res) { setStats(res.data) })
      .catch(function() { navigate('/') })
      .finally(function() { setLoading(false) })
  }, [user])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      Loading dashboard...
    </div>
  )

  const statCards = [
    { label: 'Total Users', value: stats?.userCount || 0, icon: '👤', bg: '#eff6ff', color: '#1e40af', to: '/admin/users' },
    { label: 'Listings', value: stats?.listingCount || 0, icon: '🛍️', bg: '#ecfdf5', color: '#059669', to: '/admin/listings' },
    { label: 'Pending Reports', value: stats?.reportCount || 0, icon: '🚩', bg: '#fef2f2', color: '#dc2626', to: '/admin/reports' },
    { label: 'Banned Users', value: stats?.bannedCount || 0, icon: '🚫', bg: '#fff7ed', color: '#c2410c', to: '/admin/users' },
    { label: 'Services', value: stats?.serviceCount || 0, icon: '🧑‍💼', bg: '#f5f3ff', color: '#7c3aed' },
    { label: 'Jobs', value: stats?.jobCount || 0, icon: '💼', bg: '#fefce8', color: '#b45309' },
    { label: 'Events', value: stats?.eventCount || 0, icon: '🎉', bg: '#fdf2f8', color: '#be185d' },
  ]

  return (
    <AdminLayout stats={stats}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">📊 Dashboard Overview</h1>
        <p className="adm-page-sub">Welcome back, {user?.name} — here's what's happening on SwiftKart</p>
      </div>

      <div className="adm-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {statCards.map(card => {
          const inner = (
            <>
              <div className="adm-stat-top">
                <div className="adm-stat-icon" style={{ background: card.bg }}>
                  {card.icon}
                </div>
                {card.to && (
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>View →</span>
                )}
              </div>
              <p className="adm-stat-value">{card.value}</p>
              <p className="adm-stat-label">{card.label}</p>
            </>
          )
          return card.to ? (
            <Link key={card.label} to={card.to} className="adm-stat-card clickable">
              {inner}
            </Link>
          ) : (
            <div key={card.label} className="adm-stat-card">
              {inner}
            </div>
          )
        })}
      </div>

      <div className="adm-actions-row">
        <Link to="/admin/users" className="adm-action-btn"
          style={{ background: 'linear-gradient(135deg,#08162F,#1e3a8a)', color: 'white' }}>
          👤 Manage Users
        </Link>
        <Link to="/admin/listings" className="adm-action-btn"
          style={{ background: 'linear-gradient(135deg,#00C896,#059669)', color: 'white' }}>
          🛍️ Manage Listings
        </Link>
        <Link to="/admin/reports" className="adm-action-btn"
          style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white' }}>
          🚩 View Reports {stats?.reportCount > 0 && `(${stats.reportCount})`}
        </Link>
      </div>

      {stats?.reportCount > 0 && (
        <div className="adm-section">
          <div className="adm-section-header">
            <p className="adm-section-title">⚠️ Attention Required</p>
            <Link to="/admin/reports" className="adm-section-link">View all →</Link>
          </div>
          <div className="adm-row-item">
            <span style={{ fontSize: '20px' }}>🚩</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                {stats.reportCount} pending report{stats.reportCount !== 1 ? 's' : ''} need review
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                Click to review and take action
              </p>
            </div>
            <Link to="/admin/reports" className="adm-action-btn"
              style={{ background: '#fef2f2', color: '#dc2626', fontSize: '12px', padding: '7px 14px' }}>
              Review
            </Link>
          </div>
        </div>
      )}

      <div className="adm-section">
        <div className="adm-section-header">
          <p className="adm-section-title">📈 Platform Summary</p>
        </div>
        {[
          { label: 'Total content posted', value: (stats?.listingCount || 0) + (stats?.serviceCount || 0) + (stats?.jobCount || 0) + (stats?.eventCount || 0), icon: '📦', color: '#ecfdf5', text: '#059669' },
          { label: 'Active users (not banned)', value: (stats?.userCount || 0) - (stats?.bannedCount || 0), icon: '✅', color: '#eff6ff', text: '#1e40af' },
          { label: 'Banned accounts', value: stats?.bannedCount || 0, icon: '🚫', color: '#fef2f2', text: '#dc2626' },
        ].map(item => (
          <div key={item.label} className="adm-row-item">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              {item.icon}
            </div>
            <p style={{ flex: 1, margin: 0, fontSize: '13px', color: '#374151', fontWeight: 500 }}>{item.label}</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: item.text }}>{item.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}