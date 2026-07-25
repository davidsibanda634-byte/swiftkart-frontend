import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

export default function AdminActivity() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [listings, setListings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/reports'),
      api.get('/admin/listings'),
      api.get('/admin/users'),
    ]).then(function(res) {
      setStats(res[0].data)
      setReports(res[1].data)
      setListings(res[2].data)
      setUsers(res[3].data)
    }).catch(function() {})
    .finally(function() { setLoading(false) })
  }, [user])

  if (loading) return <AdminLayout stats={null}><div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>Loading activity...</div></AdminLayout>

  const activities = []

  reports.slice(0, 5).forEach(function(r) {
    activities.push({
      icon: '🚩', color: '#ef4444', bg: '#fef2f2',
      text: 'New report submitted for: ' + (r.listing?.title || 'Unknown listing'),
      sub: 'Reported by ' + (r.reportedBy?.name || 'Unknown'),
      time: r.createdAt,
    })
  })

  listings.slice(0, 5).forEach(function(l) {
    activities.push({
      icon: '🛍️', color: '#00C896', bg: '#ecfdf5',
      text: 'New listing posted: ' + l.title,
      sub: 'by ' + (l.user?.name || 'Unknown') + ' • R' + l.price,
      time: l.createdAt,
    })
  })

  users.slice(0, 5).forEach(function(u) {
    activities.push({
      icon: '👤', color: '#2563EB', bg: '#eff6ff',
      text: 'New user registered: ' + u.name,
      sub: u.email,
      time: u.createdAt,
    })
  })

  activities.sort(function(a, b) { return new Date(b.time) - new Date(a.time) })

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (days > 0) return days + 'd ago'
    if (hrs > 0) return hrs + 'h ago'
    if (mins > 0) return mins + 'm ago'
    return 'Just now'
  }

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .act-feed { display: flex; flex-direction: column; gap: 10px; }
        .act-item {
          background: white; border-radius: 14px; padding: 16px 18px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          display: flex; align-items: center; gap: 14px; transition: all 0.2s;
        }
        .act-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .act-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .act-text { flex: 1; }
        .act-main { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0 0 2px; }
        .act-sub { font-size: 12px; color: #9ca3af; margin: 0; }
        .act-time { font-size: 11px; font-weight: 600; color: #c4c9d4; white-space: nowrap; }
        .act-empty { text-align: center; padding: 80px 20px; color: #9ca3af; font-size: 14px; }
      `}</style>

      <div className="adm-page-header">
        <h1 className="adm-page-title">🕐 Activity Log</h1>
        <p className="adm-page-sub">Recent platform activity across all modules</p>
      </div>

      {activities.length === 0 ? (
        <div className="act-empty">No activity recorded yet</div>
      ) : (
        <div className="act-feed">
          {activities.map(function(a, i) {
            return (
              <div key={i} className="act-item">
                <div className="act-icon" style={{ background: a.bg }}>{a.icon}</div>
                <div className="act-text">
                  <p className="act-main">{a.text}</p>
                  <p className="act-sub">{a.sub}</p>
                </div>
                <span className="act-time">{timeAgo(a.time)}</span>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}