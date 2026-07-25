import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

// ---------- Config ----------
// Adjust to your real storefront URL (or read from an env var, e.g. import.meta.env.VITE_SITE_URL)
const LIVE_SITE_URL = 'https://scalablenexus.vercel.app'

const CAT_COLORS = ['#00C896', '#2563EB', '#7C3AED', '#EC4899', '#d97706', '#ef4444', '#059669', '#0891b2']
const ACTIVITY_COLORS = ['#2563EB', '#7C3AED', '#d97706', '#EC4899', '#9ca3af']

// ---------- Helpers ----------
function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return days + 'd ago'
  if (hrs > 0) return hrs + 'h ago'
  if (mins > 0) return mins + 'm ago'
  return 'Just now'
}

function countSince(items, days) {
  const cutoff = Date.now() - days * 86400000
  return items.filter(function (i) { return i.createdAt && new Date(i.createdAt).getTime() >= cutoff }).length
}

function weeklyTrend(items) {
  const thisWeek = countSince(items, 7)
  const twoWeeks = countSince(items, 14)
  const lastWeek = twoWeeks - thisWeek
  if (lastWeek <= 0) return thisWeek > 0 ? { pct: 100, up: true, label: '+' + thisWeek + ' this week' } : null
  const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
  return { pct, up: pct >= 0, label: (pct >= 0 ? '+' : '') + pct + '% this week' }
}

function buildGrowthSeries(users, days) {
  const sorted = [...users].sort(function (a, b) { return new Date(a.createdAt) - new Date(b.createdAt) })
  const now = new Date()
  now.setHours(23, 59, 59, 999)
  const buckets = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const count = sorted.filter(function (u) { return u.createdAt && new Date(u.createdAt) <= d }).length
    buckets.push({ label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), value: count })
  }
  return buckets
}

function buildConicGradient(data, colors) {
  const total = data.reduce(function (a, b) { return a + b.value }, 0) || 1
  let cumulative = 0
  const stops = data.map(function (d, i) {
    const start = (cumulative / total) * 360
    cumulative += d.value
    const end = (cumulative / total) * 360
    return colors[i % colors.length] + ' ' + start + 'deg ' + end + 'deg'
  })
  return 'conic-gradient(' + stops.join(',') + ')'
}

// ---------- Small chart components ----------
function GrowthChart({ data }) {
  const w = 640, h = 190, padTop = 14, padBottom = 26
  const values = data.map(function (d) { return d.value })
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const stepX = data.length > 1 ? w / (data.length - 1) : w
  const range = (max - min) || 1
  const points = data.map(function (d, i) {
    const x = i * stepX
    const y = padTop + (h - padTop - padBottom) * (1 - (d.value - min) / range)
    return [x, y]
  })
  const pathD = points.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1) }).join(' ')
  const areaD = pathD + ' L ' + (w) + ',' + (h - padBottom) + ' L 0,' + (h - padBottom) + ' Z'
  const last = points[points.length - 1]
  const labelEvery = Math.ceil(data.length / 6)

  return (
    <svg viewBox={'0 0 ' + w + ' ' + h} className="adm-linechart-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00C896" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#00C896" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(function (f) {
        const y = padTop + (h - padTop - padBottom) * f
        return <line key={f} x1="0" x2={w} y1={y} y2={y} stroke="#eef1f6" strokeWidth="1" />
      })}
      <path d={areaD} fill="url(#growthFill)" stroke="none" />
      <path d={pathD} fill="none" stroke="#00C896" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {last && <circle cx={last[0]} cy={last[1]} r="4.5" fill="#00C896" stroke="white" strokeWidth="2" />}
      {data.map(function (d, i) {
        if (i % labelEvery !== 0 && i !== data.length - 1) return null
        const x = i * stepX
        return (
          <text key={i} x={x} y={h - 6} fontSize="10" fill="#9ca3af" textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}>
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}

function Donut({ data, colors, centerValue, centerLabel }) {
  const gradient = useMemo(function () { return buildConicGradient(data, colors) }, [data, colors])
  const total = data.reduce(function (a, b) { return a + b.value }, 0)
  return (
    <div className="adm-donut-row">
      <div className="adm-donut-wrap">
        <div className="adm-donut" style={{ background: gradient }}>
          <div className="adm-donut-hole">
            <span className="adm-donut-value">{centerValue.toLocaleString()}</span>
            <span className="adm-donut-label">{centerLabel}</span>
          </div>
        </div>
      </div>
      <div className="adm-donut-legend">
        {data.map(function (d, i) {
          const pct = total ? Math.round((d.value / total) * 100) : 0
          return (
            <div key={d.label} className="adm-legend-row">
              <span className="adm-legend-dot" style={{ background: colors[i % colors.length] }} />
              <span className="adm-legend-label">{d.label}</span>
              <span className="adm-legend-value">{d.value.toLocaleString()} ({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Main component ----------
export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [listings, setListings] = useState([])
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(new Date())

  useEffect(function () {
    const t = setInterval(function () { setNow(new Date()) }, 30000)
    return function () { clearInterval(t) }
  }, [])

  useEffect(function () {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/listings').catch(function () { return api.get('/listings') }),
      api.get('/admin/users').catch(function () { return { data: [] } }),
      api.get('/admin/reports').catch(function () { return { data: [] } }),
    ]).then(function (results) {
      setStats(results[0].data)
      setListings(results[1].data)
      setUsers(results[2].data)
      setReports(results[3].data)
    }).catch(function () {})
      .finally(function () { setLoading(false) })
  }, [user])

  if (loading) return (
    <AdminLayout stats={null}>
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>Loading dashboard...</div>
    </AdminLayout>
  )

  const metricCards = [
    { label: 'Total Users', value: stats?.userCount || 0, icon: '👤', color: '#2563EB', bg: '#eff6ff', to: '/admin/users', trend: weeklyTrend(users) },
    { label: 'Total Listings', value: stats?.listingCount || 0, icon: '🛍️', color: '#00C896', bg: '#ecfdf5', to: '/admin/listings', trend: weeklyTrend(listings) },
    { label: 'Pending Reports', value: stats?.reportCount ?? reports.length, icon: '🚩', color: '#ef4444', bg: '#fef2f2', to: '/admin/reports', trend: null },
    { label: 'Banned Users', value: stats?.bannedCount || 0, icon: '🚫', color: '#991b1b', bg: '#fef2f2', to: '/admin/users', trend: null },
    { label: 'Jobs Posted', value: stats?.jobCount || 0, icon: '💼', color: '#d97706', bg: '#fffbeb', to: '/admin/jobs', trend: null },
    { label: 'Active Users', value: (stats?.userCount || 0) - (stats?.bannedCount || 0), icon: '✅', color: '#059669', bg: '#ecfdf5', to: '/admin/users', trend: null },
    { label: 'Services', value: stats?.serviceCount || 0, icon: '🧑‍💼', color: '#7C3AED', bg: '#f5f3ff', to: '/admin/services', trend: null },
    { label: 'Events', value: stats?.eventCount || 0, icon: '🎉', color: '#EC4899', bg: '#fdf2f8', to: '/admin/events', trend: null },
  ]

  const totalContent = (stats?.listingCount || 0) + (stats?.jobCount || 0) + (stats?.serviceCount || 0) + (stats?.eventCount || 0)

  const catGroups = {}
  listings.forEach(function (l) {
    const cat = l.category || 'Other'
    catGroups[cat] = (catGroups[cat] || 0) + 1
  })
  const catData = Object.entries(catGroups).sort(function (a, b) { return b[1] - a[1] }).map(function (e) { return { label: e[0], value: e[1] } })

  const activityData = [
    { label: 'Listings', value: stats?.listingCount || 0 },
    { label: 'Services', value: stats?.serviceCount || 0 },
    { label: 'Jobs', value: stats?.jobCount || 0 },
    { label: 'Events', value: stats?.eventCount || 0 },
  ].filter(function (d) { return d.value > 0 })

  const growthSeries = buildGrowthSeries(users.length ? users : [], 14)

  const latestUsers = [...users]
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
    .slice(0, 5)

  const latestListings = [...listings]
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
    .slice(0, 6)

  const pendingReports = [...reports]
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
    .slice(0, 3)

  const recentActivity = []
  reports.slice(0, 3).forEach(function (r) {
    recentActivity.push({ icon: '🚩', bg: '#fef2f2', text: 'Report submitted for "' + (r.listing?.title || 'listing') + '"', time: r.createdAt })
  })
  listings.slice(0, 3).forEach(function (l) {
    recentActivity.push({ icon: '🛍️', bg: '#ecfdf5', text: 'New listing "' + l.title + '" posted', time: l.createdAt })
  })
  users.slice(0, 3).forEach(function (u) {
    recentActivity.push({ icon: '👤', bg: '#eff6ff', text: u.name + ' registered as a new user', time: u.createdAt })
  })
  recentActivity.sort(function (a, b) { return new Date(b.time) - new Date(a.time) })

  function severityFor(report) {
    const reason = (report.reason || '').toLowerCase()
    if (reason.includes('fraud') || reason.includes('fake') || reason.includes('scam')) return { label: 'High', color: '#ef4444', bg: '#fef2f2' }
    if (reason.includes('copyright')) return { label: 'Medium', color: '#d97706', bg: '#fffbeb' }
    return { label: 'Medium', color: '#d97706', bg: '#fffbeb' }
  }

  async function handleDeleteListing(id) {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return
    try {
      await api.delete('/admin/listings/' + id)
      setListings(function (prev) { return prev.filter(function (l) { return l._id !== id }) })
    } catch (err) {
      alert('Could not delete listing. Please try again.')
    }
  }

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .adm-dash { font-family: 'Plus Jakarta Sans', sans-serif; }

        .adm-util-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; flex-wrap: wrap; gap: 12px;
        }
        .adm-util-right { display: flex; align-items: center; gap: 12px; }
        .adm-util-date {
          font-size: 12.5px; font-weight: 600; color: #6b7280;
          background: white; border: 1px solid #e8ecf4; border-radius: 10px;
          padding: 8px 14px; display: flex; align-items: center; gap: 8px;
        }
        .adm-util-live {
          font-size: 12.5px; font-weight: 700; color: #2563EB;
          background: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px;
          padding: 8px 14px; text-decoration: none; display: flex; align-items: center; gap: 6px;
          transition: all 0.15s;
        }
        .adm-util-live:hover { background: #dbeafe; }
        .adm-util-bell {
          position: relative; width: 36px; height: 36px; border-radius: 10px;
          background: white; border: 1px solid #e8ecf4; display: flex;
          align-items: center; justify-content: center; font-size: 16px;
        }
        .adm-util-bell-badge {
          position: absolute; top: -4px; right: -4px; background: #ef4444; color: white;
          font-size: 10px; font-weight: 800; border-radius: 20px; padding: 1px 5px; min-width: 16px; text-align: center;
        }

        .adm-metric-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;
        }
        .adm-metric-card {
          background: white; border-radius: 16px; padding: 20px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
          text-decoration: none; display: block; transition: all 0.2s; position: relative; overflow: hidden;
        }
        .adm-metric-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .adm-metric-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .adm-metric-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .adm-metric-link { font-size: 11px; font-weight: 700; color: #9ca3af; text-decoration: none; transition: color 0.2s; }
        .adm-metric-card:hover .adm-metric-link { color: #00C896; }
        .adm-metric-value { font-size: 32px; font-weight: 800; color: #08162F; letter-spacing: -1px; margin: 0 0 4px; line-height: 1; }
        .adm-metric-label { font-size: 12.5px; color: #9ca3af; font-weight: 600; margin: 0; }
        .adm-metric-trend { font-size: 11px; font-weight: 700; margin-top: 6px; }

        .adm-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 20px; margin-bottom: 24px; align-items: stretch; }
        .adm-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .adm-panel { background: white; border-radius: 16px; padding: 22px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
        .adm-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .adm-panel-title { font-size: 14px; font-weight: 800; color: #08162F; display: flex; align-items: center; gap: 8px; }
        .adm-panel-link { font-size: 12px; font-weight: 700; color: #00C896; text-decoration: none; }

        .adm-linechart-svg { width: 100%; height: 190px; display: block; }

        .adm-donut-row { display: flex; align-items: center; gap: 18px; }
        .adm-donut-wrap { flex-shrink: 0; }
        .adm-donut { width: 132px; height: 132px; border-radius: 50%; position: relative; }
        .adm-donut-hole {
          position: absolute; top: 18px; left: 18px; width: 96px; height: 96px;
          background: white; border-radius: 50%; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .adm-donut-value { font-size: 19px; font-weight: 800; color: #08162F; line-height: 1.1; }
        .adm-donut-label { font-size: 10px; color: #9ca3af; font-weight: 600; }
        .adm-donut-legend { flex: 1; display: flex; flex-direction: column; gap: 9px; min-width: 0; }
        .adm-legend-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .adm-legend-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .adm-legend-label { color: #374151; font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .adm-legend-value { color: #9ca3af; font-weight: 700; white-space: nowrap; }

        .act-feed { display: flex; flex-direction: column; gap: 3px; }
        .act-item { display: flex; align-items: center; gap: 11px; padding: 9px 0; border-bottom: 1px solid #f8fafc; }
        .act-item:last-child { border-bottom: none; }
        .act-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .act-main { font-size: 12.5px; font-weight: 600; color: #111827; margin: 0; line-height: 1.35; }
        .act-time { font-size: 10.5px; color: #c4c9d4; font-weight: 600; white-space: nowrap; }

        .rep-item { padding: 12px 0; border-bottom: 1px solid #f8fafc; }
        .rep-item:last-child { border-bottom: none; }
        .rep-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .rep-title { font-size: 13px; font-weight: 700; color: #111827; }
        .rep-badge { font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 20px; }
        .rep-sub { font-size: 11.5px; color: #9ca3af; margin: 0 0 8px; }
        .rep-cta { font-size: 11px; font-weight: 700; color: #ef4444; text-decoration: none; }

        .usr-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid #f8fafc; }
        .usr-row:last-child { border-bottom: none; }
        .usr-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#08162F,#1e3a8a); display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; font-weight: 800; flex-shrink: 0; }
        .usr-name { font-size: 12.5px; font-weight: 700; color: #111827; margin: 0; }
        .usr-email { font-size: 11px; color: #9ca3af; margin: 0; }
        .usr-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; background: #ecfdf5; color: #059669; white-space: nowrap; }
        .usr-badge.banned { background: #fef2f2; color: #dc2626; }

        .adm-table-wrap { overflow-x: auto; }
        .adm-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        .adm-table th { text-align: left; color: #9ca3af; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; padding: 0 10px 10px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
        .adm-table td { padding: 12px 10px; border-bottom: 1px solid #f8fafc; vertical-align: middle; white-space: nowrap; }
        .adm-table tr:last-child td { border-bottom: none; }
        .adm-table-title { font-weight: 700; color: #111827; }
        .adm-status-pill { font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
        .adm-status-active { background: #ecfdf5; color: #059669; }
        .adm-status-pending { background: #fffbeb; color: #d97706; }
        .adm-table-actions { display: flex; gap: 6px; }
        .adm-table-actions a, .adm-table-actions button {
          width: 26px; height: 26px; border-radius: 7px; border: 1px solid #e8ecf4; background: white;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; color: #6b7280;
        }
        .adm-table-actions button.danger:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
        .adm-table-actions a:hover { background: #eff6ff; border-color: #dbeafe; color: #2563EB; }

        @media (max-width: 1200px) {
          .adm-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 1100px) {
          .adm-metric-grid { grid-template-columns: repeat(2,1fr); }
          .adm-row { grid-template-columns: 1fr; }
          .adm-row-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .adm-metric-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .adm-metric-value { font-size: 24px; }
        }
      `}</style>

      <div className="adm-dash">

        {/* Page Header */}
        <div className="adm-page-header">
          <h1 className="adm-page-title">📊 Dashboard Overview</h1>
          <p className="adm-page-sub">Welcome back, {user?.name} — here's what's happening on Scalablenexus</p>
        </div>

        {/* Utility bar: live clock, view live site, notifications */}
        <div className="adm-util-bar">
          <span className="adm-util-date">
            🗓️ {now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            &nbsp;·&nbsp;{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="adm-util-right">
            <a className="adm-util-live" href={LIVE_SITE_URL} target="_blank" rel="noopener noreferrer">👁️ View Live Site</a>
            <Link to="/admin/reports" className="adm-util-bell">
              🔔
              {pendingReports.length > 0 && <span className="adm-util-bell-badge">{reports.length}</span>}
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="adm-metric-grid">
          {metricCards.map(function (c) {
            return (
              <Link key={c.label} to={c.to} className="adm-metric-card">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: c.color, borderRadius: '16px 16px 0 0' }} />
                <div className="adm-metric-top">
                  <div className="adm-metric-icon" style={{ background: c.bg }}>{c.icon}</div>
                  <span className="adm-metric-link">View →</span>
                </div>
                <p className="adm-metric-value">{c.value.toLocaleString()}</p>
                <p className="adm-metric-label">{c.label}</p>
                {c.trend && (
                  <p className="adm-metric-trend" style={{ color: c.trend.up ? '#059669' : '#dc2626' }}>
                    {c.trend.up ? '↑' : '↓'} {c.trend.label}
                  </p>
                )}
              </Link>
            )
          })}
        </div>

        {/* Growth + Donuts */}
        <div className="adm-row">
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">📈 User Growth (Last 14 Days)</span>
              <Link to="/admin/analytics" className="adm-panel-link">Full analytics →</Link>
            </div>
            <GrowthChart data={growthSeries} />
          </div>

          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">🛍️ Listings by Category</span>
            </div>
            {catData.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No listings yet</p>
              : <Donut data={catData} colors={CAT_COLORS} centerValue={listings.length} centerLabel="Total" />}
          </div>

          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">⚡ Platform Activity</span>
            </div>
            {activityData.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No activity yet</p>
              : <Donut data={activityData} colors={ACTIVITY_COLORS} centerValue={totalContent} centerLabel="Activities" />}
          </div>
        </div>

        {/* Activity / Reports / Users */}
        <div className="adm-row">
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">🕐 Recent Activity</span>
              <Link to="/admin/activity" className="adm-panel-link">View all →</Link>
            </div>
            {recentActivity.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No recent activity</p>
              : (
                <div className="act-feed">
                  {recentActivity.slice(0, 6).map(function (a, i) {
                    return (
                      <div key={i} className="act-item">
                        <div className="act-icon" style={{ background: a.bg }}>{a.icon}</div>
                        <p className="act-main">{a.text}</p>
                        <span className="act-time">{timeAgo(a.time)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
          </div>

          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">🚩 Pending Reports</span>
              <Link to="/admin/reports" className="adm-panel-link">View all →</Link>
            </div>
            {pendingReports.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No pending reports 🎉</p>
              : pendingReports.map(function (r) {
                const sev = severityFor(r)
                return (
                  <div key={r._id} className="rep-item">
                    <div className="rep-top">
                      <span className="rep-title">{r.listing?.title || 'Unknown listing'}</span>
                      <span className="rep-badge" style={{ background: sev.bg, color: sev.color }}>{sev.label}</span>
                    </div>
                    <p className="rep-sub">Reported by {r.reportedBy?.name || 'Unknown'} · {timeAgo(r.createdAt)}</p>
                    <Link to={'/admin/reports/' + r._id} className="rep-cta">Review →</Link>
                  </div>
                )
              })}
          </div>

          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title">🧑‍🤝‍🧑 Latest Users</span>
              <Link to="/admin/users" className="adm-panel-link">View all →</Link>
            </div>
            {latestUsers.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No users yet</p>
              : latestUsers.map(function (u) {
                return (
                  <div key={u._id} className="usr-row">
                    <div className="usr-avatar">{(u.name || '?').charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="usr-name">{u.name}</p>
                      <p className="usr-email">{u.email}</p>
                    </div>
                    <span className={'usr-badge' + (u.isBanned ? ' banned' : '')}>{u.isBanned ? 'Banned' : 'Active'}</span>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Latest Listings Table */}
        <div className="adm-panel">
          <div className="adm-panel-header">
            <span className="adm-panel-title">🗂️ Latest Listings</span>
            <Link to="/admin/listings" className="adm-panel-link">View all →</Link>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Seller</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {latestListings.length === 0 ? (
                  <tr><td colSpan={7} style={{ color: '#9ca3af' }}>No listings yet</td></tr>
                ) : latestListings.map(function (l) {
                  const isPending = (l.status || '').toLowerCase() === 'pending'
                  return (
                    <tr key={l._id}>
                      <td className="adm-table-title">{l.title}</td>
                      <td>{l.user?.name || 'Unknown'}</td>
                      <td>{l.category || 'Other'}</td>
                      <td>R {Number(l.price || 0).toLocaleString()}</td>
                      <td><span className={'adm-status-pill ' + (isPending ? 'adm-status-pending' : 'adm-status-active')}>{l.status || 'Active'}</span></td>
                      <td>{timeAgo(l.createdAt)}</td>
                      <td>
                        <div className="adm-table-actions">
                          <Link to={'/admin/listings/' + l._id} title="View">👁️</Link>
                          <Link to={'/admin/listings/' + l._id + '/edit'} title="Edit">✏️</Link>
                          <button className="danger" title="Delete" onClick={function () { handleDeleteListing(l._id) }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}