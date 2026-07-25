import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    Promise.all([
      api.get('/admin/stats'),
      api.get('/listings'),
    ]).then(function(results) {
      setStats(results[0].data)
      setListings(results[1].data)
    }).catch(function() {})
    .finally(function() { setLoading(false) })
  }, [user])

  if (loading) return (
    <AdminLayout stats={null}>
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>Loading dashboard...</div>
    </AdminLayout>
  )

  const metricCards = [
    { label: 'Total Users', value: stats?.userCount || 0, icon: '👤', color: '#2563EB', bg: '#eff6ff', to: '/admin/users', trend: '+2 this week' },
    { label: 'Total Listings', value: stats?.listingCount || 0, icon: '🛍️', color: '#00C896', bg: '#ecfdf5', to: '/admin/listings', trend: '+14 today' },
    { label: 'Pending Reports', value: stats?.reportCount || 0, icon: '🚩', color: '#ef4444', bg: '#fef2f2', to: '/admin/reports', trend: 'Needs review' },
    { label: 'Banned Users', value: stats?.bannedCount || 0, icon: '🚫', color: '#991b1b', bg: '#fef2f2', to: '/admin/users', trend: '' },
    { label: 'Jobs Posted', value: stats?.jobCount || 0, icon: '💼', color: '#d97706', bg: '#fffbeb', to: '/admin/jobs', trend: '' },
    { label: 'Active Users', value: (stats?.userCount || 0) - (stats?.bannedCount || 0), icon: '✅', color: '#059669', bg: '#ecfdf5', to: '/admin/users', trend: '' },
    { label: 'Services', value: stats?.serviceCount || 0, icon: '🧑‍💼', color: '#7C3AED', bg: '#f5f3ff', to: '/admin/services', trend: '' },
    { label: 'Events', value: stats?.eventCount || 0, icon: '🎉', color: '#EC4899', bg: '#fdf2f8', to: '/admin/events', trend: '' },
  ]

  const totalContent = (stats?.listingCount || 0) + (stats?.jobCount || 0) + (stats?.serviceCount || 0) + (stats?.eventCount || 0)

  const catGroups = {}
  listings.forEach(function(l) {
    const cat = l.category || 'Other'
    catGroups[cat] = (catGroups[cat] || 0) + 1
  })
  const catData = Object.entries(catGroups).sort(function(a, b) { return b[1] - a[1] })
  const maxCat = catData[0]?.[1] || 1

  const sellerGroups = {}
  listings.forEach(function(l) {
    const name = l.user?.name || 'Unknown'
    sellerGroups[name] = (sellerGroups[name] || 0) + 1
  })
  const topSellers = Object.entries(sellerGroups)
    .sort(function(a, b) { return b[1] - a[1] })
    .slice(0, 5)

  const prices = listings.map(function(l) { return Number(l.price) }).filter(function(p) { return p > 0 })
  const avgPrice = prices.length ? Math.round(prices.reduce(function(a, b) { return a + b }, 0) / prices.length) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0

  const CAT_COLORS = ['#00C896','#2563EB','#7C3AED','#EC4899','#d97706','#ef4444','#059669','#0891b2']

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .adm-dash { font-family: 'Plus Jakarta Sans', sans-serif; }

        .adm-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .adm-metric-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
          text-decoration: none;
          display: block;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .adm-metric-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .adm-metric-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
        }

        .adm-metric-top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 14px;
        }
        .adm-metric-icon {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .adm-metric-link {
          font-size: 11px; font-weight: 700; color: #9ca3af;
          text-decoration: none; transition: color 0.2s;
        }
        .adm-metric-card:hover .adm-metric-link { color: #00C896; }

        .adm-metric-value {
          font-size: 32px; font-weight: 800; color: #08162F;
          letter-spacing: -1px; margin: 0 0 4px; line-height: 1;
        }
        .adm-metric-label { font-size: 12.5px; color: #9ca3af; font-weight: 600; margin: 0; }
        .adm-metric-trend { font-size: 11px; font-weight: 600; margin-top: 6px; }

        .adm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .adm-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 24px; }

        .adm-panel {
          background: white; border-radius: 16px;
          padding: 22px; box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
        }

        .adm-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px;
        }
        .adm-panel-title {
          font-size: 14px; font-weight: 800; color: #08162F;
          display: flex; align-items: center; gap: 8px;
        }
        .adm-panel-link {
          font-size: 12px; font-weight: 700; color: #00C896;
          text-decoration: none;
        }

        .adm-cat-row { margin-bottom: 12px; }
        .adm-cat-name { font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 5px; display: flex; justify-content: space-between; }
        .adm-cat-bar-bg { height: 7px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
        .adm-cat-bar { height: 100%; border-radius: 4px; transition: width 0.6s ease; }

        .adm-seller-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0; border-bottom: 1px solid #f8fafc;
        }
        .adm-seller-row:last-child { border-bottom: none; }
        .adm-seller-rank {
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; flex-shrink: 0;
        }
        .adm-seller-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg,#08162F,#1e3a8a);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: white; font-weight: 800; flex-shrink: 0;
        }
        .adm-seller-name { font-size: 13px; font-weight: 700; color: #111827; flex: 1; }
        .adm-seller-count { font-size: 12px; font-weight: 700; color: #00C896; }

        .adm-summary-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 0; border-bottom: 1px solid #f8fafc;
        }
        .adm-summary-row:last-child { border-bottom: none; }
        .adm-summary-left { display: flex; align-items: center; gap: 10px; }
        .adm-summary-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .adm-summary-label { font-size: 13px; font-weight: 600; color: #374151; }
        .adm-summary-value { font-size: 15px; font-weight: 800; color: #00C896; }

        .adm-price-row { margin-bottom: 14px; }
        .adm-price-label { display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 5px; }
        .adm-price-bar-bg { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
        .adm-price-bar { height: 100%; border-radius: 4px; background: linear-gradient(135deg,#00C896,#059669); }

        .adm-quick-actions {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
          margin-bottom: 24px;
        }
        .adm-quick-btn {
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 14px; padding: 16px 12px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          cursor: pointer; font-family: inherit; text-decoration: none;
          transition: all 0.2s;
        }
        .adm-quick-btn:hover { border-color: #00C896; background: #ecfdf5; transform: translateY(-2px); }
        .adm-quick-icon { font-size: 22px; }
        .adm-quick-label { font-size: 11.5px; font-weight: 700; color: #374151; text-align: center; }

        @media (max-width: 1100px) {
          .adm-metric-grid { grid-template-columns: repeat(2,1fr); }
          .adm-row { grid-template-columns: 1fr; }
          .adm-row-3 { grid-template-columns: 1fr 1fr; }
          .adm-quick-actions { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 600px) {
          .adm-metric-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .adm-metric-value { font-size: 24px; }
          .adm-row-3 { grid-template-columns: 1fr; }
          .adm-quick-actions { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <div className="adm-dash">

        {/* Page Header */}
        <div className="adm-page-header">
          <h1 className="adm-page-title">📊 Dashboard Overview</h1>
          <p className="adm-page-sub">
            Welcome back, {user?.name} — here's what's happening on Scalablenexus
          </p>
        </div>

        {/* Quick Actions */}
        <div className="adm-quick-actions">
          {[
            { icon: '👤', label: 'Manage Users', to: '/admin/users' },
            { icon: '🛍️', label: 'View Listings', to: '/admin/listings' },
            { icon: '🚩', label: 'Review Reports', to: '/admin/reports' },
            { icon: '📈', label: 'Analytics', to: '/admin/analytics' },
          ].map(function(q) {
            return (
              <Link key={q.to} to={q.to} className="adm-quick-btn">
                <span className="adm-quick-icon">{q.icon}</span>
                <span className="adm-quick-label">{q.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Metric Cards */}
        <div className="adm-metric-grid">
          {metricCards.map(function(c) {
            return (
              <Link key={c.label} to={c.to} className="adm-metric-card"
                style={{ '--card-color': c.color }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: c.color, borderRadius: '16px 16px 0 0'
                }} />
                <div className="adm-metric-top">
                  <div className="adm-metric-icon" style={{ background: c.bg }}>
                    {c.icon}
                  </div>
                  <span className="adm-metric-link">View →</span>
                </div>
                <p className="adm-metric-value">{c.value.toLocaleString()}</p>
                <p className="adm-metric-label">{c.label}</p>
                {c.trend && (
                  <p className="adm-metric-trend" style={{ color: c.color }}>{c.trend}</p>
                )}
              </Link>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="adm-row">

          {/* Listings by Category */}
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">🛍️ Listings by Category</span>
              <Link to="/admin/listings" className="adm-panel-link">View all →</Link>
            </div>
            {catData.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>No listings yet</p>
            ) : catData.map(function(item, i) {
              return (
                <div key={item[0]} className="adm-cat-row">
                  <div className="adm-cat-name">
                    <span>{item[0]}</span>
                    <span style={{ color: CAT_COLORS[i % CAT_COLORS.length], fontWeight: 700 }}>{item[1]}</span>
                  </div>
                  <div className="adm-cat-bar-bg">
                    <div
                      className="adm-cat-bar"
                      style={{
                        width: Math.round((item[1] / maxCat) * 100) + '%',
                        background: CAT_COLORS[i % CAT_COLORS.length]
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Top Sellers */}
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">🏆 Top Sellers</span>
              <Link to="/admin/users" className="adm-panel-link">View all →</Link>
            </div>
            {topSellers.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>No sellers yet</p>
            ) : topSellers.map(function(seller, i) {
              const rankColors = ['#f59e0b','#9ca3af','#d97706','#6b7280','#374151']
              const medals = ['🥇','🥈','🥉']
              return (
                <div key={seller[0]} className="adm-seller-row">
                  <div className="adm-seller-rank"
                    style={{ background: rankColors[i] + '22', color: rankColors[i] }}>
                    {medals[i] || i + 1}
                  </div>
                  <div className="adm-seller-avatar">{seller[0].charAt(0).toUpperCase()}</div>
                  <span className="adm-seller-name">{seller[0]}</span>
                  <span className="adm-seller-count">{seller[1]} listings</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="adm-row">

          {/* Platform Summary */}
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">📋 Platform Summary</span>
              <Link to="/admin/analytics" className="adm-panel-link">Full analytics →</Link>
            </div>
            {[
              { icon: '📦', bg: '#ecfdf5', label: 'Total content posted', value: totalContent },
              { icon: '✅', bg: '#ecfdf5', label: 'Active users (not banned)', value: (stats?.userCount || 0) - (stats?.bannedCount || 0) },
              { icon: '🛍️', bg: '#eff6ff', label: 'Marketplace items', value: stats?.listingCount || 0 },
              { icon: '🚫', bg: '#fef2f2', label: 'Banned accounts', value: stats?.bannedCount || 0 },
              { icon: '🚩', bg: '#fef2f2', label: 'Pending reports', value: stats?.reportCount || 0 },
              { icon: '💰', bg: '#fffbeb', label: 'Avg listing price', value: 'R ' + avgPrice },
              { icon: '🏷️', bg: '#fffbeb', label: 'Highest priced listing', value: 'R ' + maxPrice.toLocaleString() },
            ].map(function(row) {
              return (
                <div key={row.label} className="adm-summary-row">
                  <div className="adm-summary-left">
                    <div className="adm-summary-icon" style={{ background: row.bg }}>{row.icon}</div>
                    <span className="adm-summary-label">{row.label}</span>
                  </div>
                  <span className="adm-summary-value">{row.value}</span>
                </div>
              )
            })}
          </div>

          {/* Price Distribution */}
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">💰 Price Distribution</span>
            </div>
            {(function() {
              const ranges = [
                { label: 'Under R10', min: 0, max: 10 },
                { label: 'R10 – R50', min: 10, max: 50 },
                { label: 'R50 – R200', min: 50, max: 200 },
                { label: 'R200 – R500', min: 200, max: 500 },
                { label: 'Over R500', min: 500, max: Infinity },
              ]
              return ranges.map(function(range) {
                const count = prices.filter(function(p) { return p >= range.min && p < range.max }).length
                const pct = prices.length ? Math.round((count / prices.length) * 100) : 0
                return (
                  <div key={range.label} className="adm-price-row">
                    <div className="adm-price-label">
                      <span>{range.label}</span>
                      <span style={{ color: '#00C896' }}>{count} ({pct}%)</span>
                    </div>
                    <div className="adm-price-bar-bg">
                      <div className="adm-price-bar" style={{ width: pct + '%' }} />
                    </div>
                  </div>
                )
              })
            })()}

            {/* Reports quick view */}
            {stats?.reportCount > 0 && (
              <div style={{ marginTop: '20px', padding: '14px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', margin: '0 0 8px' }}>
                  🚩 {stats.reportCount} Pending Report{stats.reportCount !== 1 ? 's' : ''}
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 10px' }}>
                  Reports need your attention
                </p>
                <Link to="/admin/reports" style={{
                  display: 'inline-block', background: '#ef4444', color: 'white',
                  padding: '7px 16px', borderRadius: '8px', fontSize: '12px',
                  fontWeight: 700, textDecoration: 'none'
                }}>Review Now →</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}