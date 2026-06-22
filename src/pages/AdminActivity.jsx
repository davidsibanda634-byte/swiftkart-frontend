import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AdminLayout } from './AdminDashboard'
import api from '../services/api'

export default function AdminActivity() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [listings, setListings] = useState([])
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/listings'),
      api.get('/admin/users'),
      api.get('/admin/reports'),
    ])
      .then(function([s, l, u, r]) {
        setStats(s.data)
        setListings(l.data)
        setUsers(u.data)
        setReports(r.data)
      })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }, [user])

  if (loading) return (
    <AdminLayout stats={stats}>
      <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Loading activity...</div>
    </AdminLayout>
  )

  // Build a unified activity feed sorted by date
  const activities = [
    ...listings.map(l => ({
      type: 'listing',
      icon: '🛍️',
      bg: '#ecfdf5',
      color: '#059669',
      title: 'New listing posted',
      detail: '"' + l.title + '" by ' + (l.user?.name || 'Unknown'),
      date: new Date(l.createdAt),
    })),
    ...users.map(u => ({
      type: 'user',
      icon: '👤',
      bg: '#eff6ff',
      color: '#1e40af',
      title: 'New user registered',
      detail: u.name + ' (' + u.email + ')',
      date: new Date(u.createdAt),
    })),
    ...reports.map(r => ({
      type: 'report',
      icon: '🚩',
      bg: '#fef2f2',
      color: '#dc2626',
      title: 'Listing reported',
      detail: (r.listing?.title || 'Deleted listing') + ' — ' + r.reason,
      date: new Date(r.createdAt),
    })),
  ]
    .filter(a => !isNaN(a.date))
    .sort((a, b) => b.date - a.date)
    .slice(0, 50)

  function timeAgo(date) {
    const diff = Math.floor((Date.now() - date) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const recentListings = [...listings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <AdminLayout stats={stats}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">💬 Activity Feed</h1>
        <p className="adm-page-sub">Recent platform activity across all users and content</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>

        {/* Main feed */}
        <div className="adm-section">
          <div className="adm-section-header">
            <p className="adm-section-title">🕐 Recent Activity</p>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>{activities.length} events</span>
          </div>
          {activities.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No activity yet</div>
          ) : activities.map(function(a, i) {
            return (
              <div key={i} className="adm-row-item">
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827' }}>{a.title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.detail}</p>
                </div>
                <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, white_space: 'nowrap', flexShrink: 0 }}>
                  {timeAgo(a.date)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Right column */}
        <div>
          <div className="adm-section" style={{ marginBottom: '16px' }}>
            <div className="adm-section-header">
              <p className="adm-section-title">🆕 Newest Users</p>
            </div>
            {recentUsers.map(function(u) {
              return (
                <div key={u._id} className="adm-row-item">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#08162F,#1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: 'white', fontWeight: 800, flexShrink: 0 }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                    <p style={{ margin: '1px 0 0', fontSize: '10.5px', color: '#9ca3af' }}>{u.email}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="adm-section">
            <div className="adm-section-header">
              <p className="adm-section-title">🆕 Latest Listings</p>
            </div>
            {recentListings.map(function(l) {
              return (
                <div key={l._id} className="adm-row-item">
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                    🛍️
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</p>
                    <p style={{ margin: '1px 0 0', fontSize: '10.5px', color: '#9ca3af' }}>${l.price} • {l.user?.name}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}