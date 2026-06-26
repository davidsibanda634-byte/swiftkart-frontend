import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export function AdminLayout({ children, stats }) {
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { to: '/admin/users', icon: '👤', label: 'Users', badge: stats?.userCount },
    { to: '/admin/listings', icon: '🛍️', label: 'Listings', badge: stats?.listingCount },
    { to: '/admin/reports', icon: '🚩', label: 'Reports', badge: stats?.reportCount, alert: stats?.reportCount > 0 },
    { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
    { to: '/admin/activity', icon: '💬', label: 'Activity Feed' },
  ]

  const isActive = (to, exact) => exact
    ? location.pathname === to
    : location.pathname === to

  if (!authReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb' }}>
        <p style={{ color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }}>Loading...</p>
      </div>
    )
  }

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

        .adm-sidebar {
          width: 220px;
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
          padding: 20px 14px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .adm-sidebar-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(0,200,150,0.15);
          border: 1px solid rgba(0,200,150,0.3);
          color: #34d399;
          font-size: 9.5px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .adm-sidebar-title { font-size: 14px; font-weight: 800; color: white; margin: 0 0 2px; }
        .adm-sidebar-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin: 0; }

        .adm-nav { padding: 10px 8px; flex: 1; }
        .adm-nav-label {
          font-size: 9.5px; font-weight: 800; color: rgba(255,255,255,0.28);
          text-transform: uppercase; letter-spacing: 0.8px;
          padding: 0 8px; margin: 10px 0 5px;
        }
        .adm-nav-item {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 10px; border-radius: 10px; font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.55); text-decoration: none; transition: all 0.2s;
          margin-bottom: 2px; position: relative;
        }
        .adm-nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
        .adm-nav-item.active { background: rgba(0,200,150,0.14); color: #34d399; }
        .adm-nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }
        .adm-nav-badge {
          margin-left: auto; background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.5);
          font-size: 10px; font-weight: 800; padding: 1px 7px; border-radius: 10px; min-width: 20px; text-align: center;
        }
        .adm-nav-item.active .adm-nav-badge { background: rgba(0,200,150,0.2); color: #34d399; }
        .adm-nav-badge.alert { background: rgba(239,68,68,0.2); color: #f87171; }

        .adm-sidebar-footer { padding: 12px 8px; border-top: 1px solid rgba(255,255,255,0.07); }
        .adm-back-btn {
          display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 10px;
          font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.4); text-decoration: none;
          transition: all 0.2s; cursor: pointer; border: none; background: none; width: 100%; font-family: inherit;
        }
        .adm-back-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }

        .adm-main { flex: 1; padding: 26px 26px 60px; min-width: 0; overflow: hidden; }

        .adm-page-header { margin-bottom: 22px; }
        .adm-page-title { font-size: 21px; font-weight: 800; color: #08162F; margin: 0 0 4px; letter-spacing: -0.4px; }
        .adm-page-sub { font-size: 13px; color: #9ca3af; margin: 0; }

        .adm-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }

        .adm-stat-card {
          background: white; border-radius: 14px; padding: 16px 18px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          text-decoration: none; display: block; transition: transform 0.2s, box-shadow 0.2s;
        }
        .adm-stat-card.clickable:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.09); }

        .adm-stat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .adm-stat-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
        .adm-stat-value { font-size: 26px; font-weight: 800; color: #08162F; line-height: 1; margin: 0 0 3px; letter-spacing: -1px; }
        .adm-stat-label { font-size: 11.5px; color: #9ca3af; font-weight: 600; margin: 0; }

        .adm-section {
          background: white; border-radius: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          overflow: hidden; margin-bottom: 16px;
        }
        .adm-section-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; border-bottom: 1px solid #f8fafc;
        }
        .adm-section-title { font-size: 13.5px; font-weight: 800; color: #0f172a; margin: 0; }
        .adm-section-link { font-size: 12px; font-weight: 700; color: #00C896; text-decoration: none; }
        .adm-section-link:hover { text-decoration: underline; }

        .adm-row-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 18px; border-bottom: 1px solid #f8fafc; transition: background 0.15s;
        }
        .adm-row-item:last-child { border-bottom: none; }
        .adm-row-item:hover { background: #fafbfc; }

        .adm-search {
          width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 13px; outline: none; font-family: inherit; transition: border 0.2s; margin-bottom: 14px;
        }
        .adm-search:focus { border-color: #00C896; }

        .adm-action-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 10px; font-size: 12.5px; font-weight: 700;
          text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; font-family: inherit;
        }
        .adm-action-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        @media (max-width: 900px) {
          .adm-sidebar { display: none; }
          .adm-main { padding: 18px 14px 60px; }
          .adm-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .adm-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        }
      `}</style>

      <div className="adm-wrap">
        <aside className="adm-sidebar">
          <div className="adm-sidebar-top">
            <div className="adm-sidebar-badge">🛡️ ADMIN</div>
            <p className="adm-sidebar-title">Scalablenexus Admin</p>
            <p className="adm-sidebar-sub">{user?.name}</p>
          </div>

          <nav className="adm-nav">
            <p className="adm-nav-label">Main</p>
            {navItems.slice(0, 4).map(item => (
              <Link key={item.to} to={item.to} className={'adm-nav-item' + (isActive(item.to, item.exact) ? ' active' : '')}>
                <span className="adm-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge !== undefined && (
                  <span className={'adm-nav-badge' + (item.alert ? ' alert' : '')}>{item.badge}</span>
                )}
              </Link>
            ))}
            <p className="adm-nav-label" style={{ marginTop: '14px' }}>Insights</p>
            {navItems.slice(4).map(item => (
              <Link key={item.to} to={item.to} className={'adm-nav-item' + (isActive(item.to, item.exact) ? ' active' : '')}>
                <span className="adm-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="adm-sidebar-footer">
            <button className="adm-back-btn" onClick={() => navigate('/')}>← Back to Site</button>
          </div>
        </aside>

        <main className="adm-main">{children}</main>
      </div>
    </>
  )
}

export default function AdminDashboard() {
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!authReady) return
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    api.get('/admin/stats')
      .then(function(res) { setStats(res.data) })
      .catch(function() { navigate('/') })
      .finally(function() { setLoading(false) })
  }, [user, authReady])

  if (!authReady) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb' }}>
      <p style={{ color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }}>Loading...</p>
    </div>
  )

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      Loading dashboard...
    </div>
  )

  const topCards = [
    { label: 'Total Users', value: stats?.userCount || 0, icon: '👤', bg: '#eff6ff', to: '/admin/users' },
    { label: 'Listings', value: stats?.listingCount || 0, icon: '🛍️', bg: '#ecfdf5', to: '/admin/listings' },
    { label: 'Pending Reports', value: stats?.reportCount || 0, icon: '🚩', bg: '#fef2f2', to: '/admin/reports' },
    { label: 'Banned Users', value: stats?.bannedCount || 0, icon: '🚫', bg: '#fff7ed', to: '/admin/users' },
  ]

  const bottomCards = [
    { label: 'Services', value: stats?.serviceCount || 0, icon: '🧑‍💼', bg: '#f5f3ff' },
    { label: 'Jobs', value: stats?.jobCount || 0, icon: '💼', bg: '#fefce8' },
    { label: 'Events', value: stats?.eventCount || 0, icon: '🎉', bg: '#fdf2f8' },
    { label: 'Active Users', value: (stats?.userCount || 0) - (stats?.bannedCount || 0), icon: '✅', bg: '#f0fdf4' },
  ]

  const totalContent = (stats?.listingCount || 0) + (stats?.serviceCount || 0) + (stats?.jobCount || 0) + (stats?.eventCount || 0)

  return (
    <AdminLayout stats={stats}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">📊 Dashboard Overview</h1>
        <p className="adm-page-sub">Welcome back, {user?.name} — here's what's happening on Scalablenexus</p>
      </div>

      {stats?.reportCount > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '13px', color: '#dc2626', fontWeight: 600, flex: 1 }}>
            {stats.reportCount} pending report{stats.reportCount !== 1 ? 's' : ''} need your attention
          </p>
          <Link to="/admin/reports" className="adm-action-btn" style={{ background: '#dc2626', color: 'white', padding: '6px 14px', fontSize: '12px' }}>
            Review Now
          </Link>
        </div>
      )}

      <div className="adm-stats-grid">
        {topCards.map(card => (
          <Link key={card.label} to={card.to} className="adm-stat-card clickable">
            <div className="adm-stat-top">
              <div className="adm-stat-icon" style={{ background: card.bg }}>{card.icon}</div>
              <span style={{ fontSize: '10.5px', color: '#9ca3af', fontWeight: 600 }}>View →</span>
            </div>
            <p className="adm-stat-value">{card.value}</p>
            <p className="adm-stat-label">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="adm-stats-grid" style={{ marginBottom: '20px' }}>
        {bottomCards.map(card => (
          <div key={card.label} className="adm-stat-card">
            <div className="adm-stat-top">
              <div className="adm-stat-icon" style={{ background: card.bg }}>{card.icon}</div>
            </div>
            <p className="adm-stat-value">{card.value}</p>
            <p className="adm-stat-label">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="adm-section">
        <div className="adm-section-header">
          <p className="adm-section-title">📈 Platform Summary</p>
          <Link to="/admin/analytics" className="adm-section-link">Full analytics →</Link>
        </div>
        {[
          { label: 'Total content posted', value: totalContent, icon: '📦', bg: '#ecfdf5', color: '#059669' },
          { label: 'Active users (not banned)', value: (stats?.userCount || 0) - (stats?.bannedCount || 0), icon: '✅', bg: '#eff6ff', color: '#1e40af' },
          { label: 'Marketplace items', value: stats?.listingCount || 0, icon: '🛍️', bg: '#ecfdf5', color: '#059669' },
          { label: 'Banned accounts', value: stats?.bannedCount || 0, icon: '🚫', bg: '#fef2f2', color: '#dc2626' },
          { label: 'Pending moderation', value: stats?.reportCount || 0, icon: '🚩', bg: '#fef2f2', color: '#dc2626' },
        ].map(item => (
          <div key={item.label} className="adm-row-item">
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
              {item.icon}
            </div>
            <p style={{ flex: 1, margin: 0, fontSize: '13px', color: '#374151', fontWeight: 500 }}>{item.label}</p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="adm-section">
        <div className="adm-section-header">
          <p className="adm-section-title">📦 Content Breakdown</p>
        </div>
        {[
          { label: 'Marketplace Listings', value: stats?.listingCount || 0, total: totalContent, color: '#00C896' },
          { label: 'Services', value: stats?.serviceCount || 0, total: totalContent, color: '#7c3aed' },
          { label: 'Jobs', value: stats?.jobCount || 0, total: totalContent, color: '#d97706' },
          { label: 'Events', value: stats?.eventCount || 0, total: totalContent, color: '#be185d' },
        ].map(item => {
          const pct = totalContent > 0 ? Math.round((item.value / totalContent) * 100) : 0
          return (
            <div key={item.label} className="adm-row-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#374151' }}>{item.label}</span>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{item.value} <span style={{ color: '#9ca3af', fontWeight: 500 }}>({pct}%)</span></span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '7px', overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: item.color, borderRadius: '6px', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          )
        })}
      </div>
    </AdminLayout>
  )
}