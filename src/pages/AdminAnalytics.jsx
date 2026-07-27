import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'

export default function AdminAnalytics() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    Promise.all([api.get('/admin/stats'), api.get('/listings')])
      .then(function(res) { setStats(res[0].data); setListings(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }, [user])

  if (loading) return <AdminLayout stats={null}><div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>Loading analytics...</div></AdminLayout>

  const prices = listings.map(function(l) { return Number(l.price) }).filter(function(p) { return p > 0 })
  const avgPrice = prices.length ? Math.round(prices.reduce(function(a, b) { return a + b }, 0) / prices.length) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0
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
  const topSellers = Object.entries(sellerGroups).sort(function(a, b) { return b[1] - a[1] }).slice(0, 5)

  const CAT_COLORS = ['#00C896','#2563EB','#7C3AED','#EC4899','#d97706','#ef4444','#059669','#0891b2']
  const priceRanges = [
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 – $50', min: 10, max: 50 },
  { label: '$50 – $200', min: 50, max: 200 },
  { label: '$200 – $500', min: 200, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity },
]

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .ana-grid4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
        .ana-card {
          background: white; border-radius: 16px; padding: 20px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
        }
        .ana-card-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 12px; }
        .ana-card-value { font-size: 28px; font-weight: 800; color: #08162F; letter-spacing: -0.5px; margin: 0 0 4px; }
        .ana-card-label { font-size: 12px; color: #9ca3af; font-weight: 600; margin: 0; }
        .ana-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .ana-panel { background: white; border-radius: 16px; padding: 22px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
        .ana-panel-title { font-size: 14px; font-weight: 800; color: #08162F; margin: 0 0 18px; display: flex; align-items: center; gap: 8px; }
        .ana-cat-row { margin-bottom: 13px; }
        .ana-cat-top { display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 5px; }
        .ana-bar-bg { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
        .ana-bar { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
        .ana-seller-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid #f8fafc; }
        .ana-seller-row:last-child { border-bottom: none; }
        .ana-seller-rank { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
        .ana-seller-av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#08162F,#1e3a8a); display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; font-weight: 800; flex-shrink: 0; }
        .ana-seller-name { flex: 1; font-size: 13px; font-weight: 700; color: #111827; }
        .ana-seller-count { font-size: 12px; font-weight: 700; color: #00C896; }
        .ana-price-row { margin-bottom: 13px; }
        .ana-price-top { display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 5px; }
        .ana-price-bar { height: 8px; border-radius: 4px; background: linear-gradient(135deg,#00C896,#059669); }
        @media (max-width: 900px) {
          .ana-grid4 { grid-template-columns: 1fr 1fr; }
          .ana-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 500px) {
          .ana-grid4 { grid-template-columns: 1fr 1fr; gap: 10px; }
        }
      `}</style>

      <div className="adm-page-header">
        <h1 className="adm-page-title">📈 Analytics</h1>
        <p className="adm-page-sub">Platform performance and content insights</p>
      </div>

      <div className="ana-grid4">
        {[
          { icon: '📦', bg: '#ecfdf5', label: 'Total Content', value: totalContent },
          { icon: '💰', bg: '#fffbeb', label: 'Avg Listing Price', value: formatPrice(avgPrice) },
          { icon: '🏷️', bg: '#eff6ff', label: 'Highest Price', value: formatPrice(maxPrice) },
          { icon: '🧑‍💼', bg: '#f5f3ff', label: 'Active Sellers', value: Object.keys(sellerGroups).length },
        ].map(function(c) {
          return (
            <div key={c.label} className="ana-card">
              <div className="ana-card-icon" style={{ background: c.bg }}>{c.icon}</div>
              <p className="ana-card-value">{c.value}</p>
              <p className="ana-card-label">{c.label}</p>
            </div>
          )
        })}
      </div>

      <div className="ana-row">
        <div className="ana-panel">
          <p className="ana-panel-title">🛍️ Listings by Category</p>
          {catData.length === 0
            ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No data yet</p>
            : catData.map(function(item, i) {
              return (
                <div key={item[0]} className="ana-cat-row">
                  <div className="ana-cat-top">
                    <span>{item[0]}</span>
                    <span style={{ color: CAT_COLORS[i % CAT_COLORS.length], fontWeight: 700 }}>{item[1]}</span>
                  </div>
                  <div className="ana-bar-bg">
                    <div className="ana-bar" style={{ width: Math.round((item[1] / maxCat) * 100) + '%', background: CAT_COLORS[i % CAT_COLORS.length] }} />
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className="ana-panel">
          <p className="ana-panel-title">🏆 Top Sellers</p>
          {topSellers.map(function(s, i) {
            const medals = ['🥇','🥈','🥉','4','5']
            return (
              <div key={s[0]} className="ana-seller-row">
                <div className="ana-seller-rank">{medals[i]}</div>
                <div className="ana-seller-av">{s[0].charAt(0).toUpperCase()}</div>
                <span className="ana-seller-name">{s[0]}</span>
                <span className="ana-seller-count">{s[1]} listings</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="ana-panel">
        <p className="ana-panel-title">💰 Price Distribution</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {priceRanges.map(function(range) {
            const count = prices.filter(function(p) { return p >= range.min && p < range.max }).length
            const pct = prices.length ? Math.round((count / prices.length) * 100) : 0
            return (
              <div key={range.label} className="ana-price-row">
                <div className="ana-price-top">
                  <span>{range.label}</span>
                  <span style={{ color: '#00C896', fontWeight: 700 }}>{count} ({pct}%)</span>
                </div>
                <div className="ana-bar-bg">
                  <div className="ana-price-bar" style={{ width: pct + '%' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}