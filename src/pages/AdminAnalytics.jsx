import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AdminLayout } from './AdminDashboard'
import api from '../services/api'

export default function AdminAnalytics() {
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
      api.get('/admin/listings'),
    ])
      .then(function([s, l]) { setStats(s.data); setListings(l.data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }, [user])

  if (loading) return (
    <AdminLayout stats={stats}>
      <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Loading analytics...</div>
    </AdminLayout>
  )

  // Category breakdown from real listings
  const categoryCounts = listings.reduce(function(acc, l) {
    const cat = l.category || 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const categoryColors = {
    Fashion: '#ec4899', Electronics: '#3b82f6', 'Cosmetics & Hair': '#a855f7',
    Vehicles: '#f59e0b', Furniture: '#10b981', Food: '#ef4444',
    'Mobile & Accessories': '#06b6d4', Other: '#6b7280',
  }

  const sortedCats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
  const maxCat = sortedCats[0]?.[1] || 1

  // Price analysis
  const prices = listings.map(l => l.price || 0).filter(p => p > 0)
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0

  // Top sellers
  const sellerMap = listings.reduce(function(acc, l) {
    const name = l.user?.name || 'Unknown'
    const id = l.user?._id || 'unknown'
    if (!acc[id]) acc[id] = { name, count: 0 }
    acc[id].count++
    return acc
  }, {})
  const topSellers = Object.values(sellerMap).sort((a, b) => b.count - a.count).slice(0, 5)

  const totalContent = (stats?.listingCount || 0) + (stats?.serviceCount || 0) + (stats?.jobCount || 0) + (stats?.eventCount || 0)

  return (
    <AdminLayout stats={stats}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">📈 Analytics</h1>
        <p className="adm-page-sub">Platform performance and content insights</p>
      </div>

      {/* KPI row */}
      <div className="adm-stats-grid" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Content', value: totalContent, icon: '📦', bg: '#ecfdf5' },
          { label: 'Avg Listing Price', value: '$' + avgPrice.toLocaleString(), icon: '💰', bg: '#fefce8' },
          { label: 'Highest Price', value: '$' + maxPrice.toLocaleString(), icon: '📈', bg: '#eff6ff' },
          { label: 'Active Sellers', value: Object.keys(sellerMap).length, icon: '🧑‍💼', bg: '#f5f3ff' },
        ].map(card => (
          <div key={card.label} className="adm-stat-card">
            <div className="adm-stat-top">
              <div className="adm-stat-icon" style={{ background: card.bg }}>{card.icon}</div>
            </div>
            <p className="adm-stat-value" style={{ fontSize: typeof card.value === 'string' && card.value.length > 6 ? '20px' : '26px' }}>{card.value}</p>
            <p className="adm-stat-label">{card.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Category breakdown */}
        <div className="adm-section">
          <div className="adm-section-header">
            <p className="adm-section-title">🛍️ Listings by Category</p>
          </div>
          {sortedCats.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No listings yet</div>
          ) : sortedCats.map(function([cat, count]) {
            const pct = Math.round((count / maxCat) * 100)
            const color = categoryColors[cat] || '#6b7280'
            return (
              <div key={cat} className="adm-row-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#374151' }}>{cat}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{count}</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '5px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: '5px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Top sellers */}
        <div className="adm-section">
          <div className="adm-section-header">
            <p className="adm-section-title">🏆 Top Sellers</p>
          </div>
          {topSellers.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No data yet</div>
          ) : topSellers.map(function(seller, i) {
            return (
              <div key={seller.name} className="adm-row-item">
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : i === 1 ? 'linear-gradient(135deg,#9ca3af,#6b7280)' : i === 2 ? 'linear-gradient(135deg,#b45309,#92400e)' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800,
                  color: i < 3 ? 'white' : '#6b7280',
                }}>
                  {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                </div>
                <p style={{ flex: 1, margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{seller.name}</p>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#00C896' }}>{seller.count} listing{seller.count !== 1 ? 's' : ''}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Price ranges */}
      <div className="adm-section">
        <div className="adm-section-header">
          <p className="adm-section-title">💰 Price Distribution</p>
        </div>
        {[
          { label: 'Under $10', count: listings.filter(l => l.price < 10).length },
          { label: '$10 – $50', count: listings.filter(l => l.price >= 10 && l.price < 50).length },
          { label: '$50 – $100', count: listings.filter(l => l.price >= 50 && l.price < 100).length },
          { label: '$100 – $500', count: listings.filter(l => l.price >= 100 && l.price < 500).length },
          { label: 'Over $500', count: listings.filter(l => l.price >= 500).length },
        ].map(function(range) {
          const pct = listings.length > 0 ? Math.round((range.count / listings.length) * 100) : 0
          return (
            <div key={range.label} className="adm-row-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#374151' }}>{range.label}</span>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{range.count} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct}%)</span></span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '5px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: 'linear-gradient(90deg,#00C896,#059669)', borderRadius: '5px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )
        })}
      </div>
    </AdminLayout>
  )
}