import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'
import {
  Users, ShoppingBag, Flag, Ban, Briefcase, UserCheck, UserCog, PartyPopper,
  Eye, Bell, CalendarDays, TrendingUp, Zap, History, Pencil, Trash2, Package,
} from 'lucide-react'

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

// Returns null when there isn't enough history to say anything meaningful,
// rather than a misleading "+1488%" style spike from a tiny sample.
function weeklyTrend(items) {
  const thisWeek = countSince(items, 7)
  const twoWeeks = countSince(items, 14)
  const lastWeek = twoWeeks - thisWeek
  if (thisWeek === 0 && lastWeek === 0) return null
  if (lastWeek < 3) return { up: true, label: '+' + thisWeek + ' this week' }
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
  const w = 640, h = 170, padTop = 12, padBottom = 24
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
          <stop offset="0%" stopColor="#00C896" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#00C896" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(function (f) {
        const y = padTop + (h - padTop - padBottom) * f
        return <line key={f} x1="0" x2={w} y1={y} y2={y} stroke="#eef1f6" strokeWidth="1" />
      })}
      <path d={areaD} fill="url(#growthFill)" stroke="none" />
      <path d={pathD} fill="none" stroke="#00C896" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      {last && <circle cx={last[0]} cy={last[1]} r="4" fill="#00C896" stroke="white" strokeWidth="2" />}
      {data.map(function (d, i) {
        if (i % labelEvery !== 0 && i !== data.length - 1) return null
        const x = i * stepX
        return (
          <text key={i} x={x} y={h - 5} fontSize="9.5" fill="#9ca3af" textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}>
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
    <AdminLayout>
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>Loading dashboard...</div>
    </AdminLayout>
  )

  const metricCards = [
    { label: 'Total Users', value: stats?.userCount || 0, Icon: Users, color: '#2563EB', bg: '#eff6ff', to: '/admin/users', trend: weeklyTrend(users) },
    { label: 'Total Listings', value: stats?.listingCount || 0, Icon: ShoppingBag, color: '#00C896', bg: '#ecfdf5', to: '/admin/listings', trend: weeklyTrend(listings) },
    { label: 'Pending Reports', value: stats?.reportCount ?? reports.length, Icon: Flag, color: '#ef4444', bg: '#fef2f2', to: '/admin/reports', trend: null },
    { label: 'Banned Users', value: stats?.bannedCount || 0, Icon: Ban, color: '#991b1b', bg: '#fef2f2', to: '/admin/users', trend: null },
    { label: 'Jobs Posted', value: stats?.jobCount || 0, Icon: Briefcase, color: '#d97706', bg: '#fffbeb', to: '/admin/jobs', trend: null },
    { label: 'Active Users', value: (stats?.userCount || 0) - (stats?.bannedCount || 0), Icon: UserCheck, color: '#059669', bg: '#ecfdf5', to: '/admin/users', trend: null },
    { label: 'Services', value: stats?.serviceCount || 0, Icon: UserCog, color: '#7C3AED', bg: '#f5f3ff', to: '/admin/services', trend: null },
    { label: 'Events', value: stats?.eventCount || 0, Icon: PartyPopper, color: '#EC4899', bg: '#fdf2f8', to: '/admin/events', trend: null },
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
    recentActivity.push({ Icon: Flag, bg: '#fef2f2', color: '#ef4444', text: 'Report submitted for "' + (r.listing?.title || 'listing') + '"', time: r.createdAt })
  })
  listings.slice(0, 3).forEach(function (l) {
    recentActivity.push({ Icon: ShoppingBag, bg: '#ecfdf5', color: '#00C896', text: 'New listing "' + l.title + '" posted', time: l.createdAt })
  })
  users.slice(0, 3).forEach(function (u) {
    recentActivity.push({ Icon: Users, bg: '#eff6ff', color: '#2563EB', text: u.name + ' registered as a new user', time: u.createdAt })
  })
  recentActivity.sort(function (a, b) { return new Date(b.time) - new Date(a.time) })

  function severityFor(report) {
    const reason = (report.reason || '').toLowerCase()
    if (reason.includes('fraud') || reason.includes('fake') || reason.includes('scam')) return { label: 'High', color: '#ef4444', bg: '#fef2f2' }
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
    <AdminLayout>
      <style>{`
        .adm-dash { font-family: 'Plus Jakarta Sans', sans-serif; }

        .adm-page-header { margin-bottom: 14px; }
        .adm-page-title { font-size: 19px; font-weight: 800; color: #08162F; margin: 0 0 3px; display: flex; align-items: center; gap: 8px; }
        .adm-page-sub { font-size: 12.5px; color: #9ca3af; margin: 0; }

        /* ---------- Utility bar ---------- */
        .adm-util-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .adm-util-right { display: flex; align-items: center; gap: 10px; }
        .adm-util-date {
          font-size: 11.5px; font-weight: 600; color: #6b7280;
          background: white; border: 1px solid #e8ecf4; border-radius: 9px;
          padding: 7px 12px; display: flex; align-items: center; gap: 6px;
        }
        .adm-util-live {
          font-size: 11.5px; font-weight: 700; color: #2563EB;
          background: #eff6ff; border: 1px solid #dbeafe; border-radius: 9px;
          padding: 7px 12px; text-decoration: none; display: flex; align-items: center; gap: 6px;
        }
        .adm-util-live:hover { background: #dbeafe; }
        .adm-util-bell {
          position: relative; width: 33px; height: 33px; border-radius: 9px;
          background: white; border: 1px solid #e8ecf4; display: flex;
          align-items: center; justify-content: center; color: #6b7280;
        }
        .adm-util-bell-badge {
          position: absolute; top: -4px; right: -4px; background: #ef4444; color: white;
          font-size: 9.5px; font-weight: 800; border-radius: 20px; padding: 1px 5px; min-width: 15px; text-align: center;
        }

        /* ---------- Metric cards (mobile-first: 2 cols) ---------- */
        .adm-metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
        .adm-metric-card {
          background: white; border-radius: 13px; padding: 14px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          text-decoration: none; display: block; transition: all 0.2s; position: relative; overflow: hidden;
        }
        .adm-metric-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.09); }
        .adm-metric-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .adm-metric-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
        .adm-metric-link { font-size: 10px; font-weight: 700; color: #9ca3af; text-decoration: none; }
        .adm-metric-card:hover .adm-metric-link { color: #00C896; }
        .adm-metric-value { font-size: 21px; font-weight: 800; color: #08162F; letter-spacing: -0.5px; margin: 0 0 2px; line-height: 1; }
        .adm-metric-label { font-size: 11px; color: #9ca3af; font-weight: 600; margin: 0; }
        .adm-metric-trend { font-size: 10px; font-weight: 700; margin-top: 5px; display: flex; align-items: center; gap: 2px; }

        /* ---------- Panels / rows (mobile-first: single column) ---------- */
        .adm-row { display: grid; grid-template-columns: 1fr; gap: 14px; margin-bottom: 14px; }
        .adm-panel { background: white; border-radius: 14px; padding: 16px; box-shadow: 0 1px 6px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
        .adm-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 13px; }
        .adm-panel-title { font-size: 12.5px; font-weight: 800; color: #08162F; display: flex; align-items: center; gap: 6px; }
        .adm-panel-link { font-size: 11px; font-weight: 700; color: #00C896; text-decoration: none; }

        .adm-linechart-svg { width: 100%; height: 160px; display: block; }

        .adm-donut-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .adm-donut-wrap { flex-shrink: 0; }
        .adm-donut { width: 108px; height: 108px; border-radius: 50%; position: relative; }
        .adm-donut-hole {
          position: absolute; top: 15px; left: 15px; width: 78px; height: 78px;
          background: white; border-radius: 50%; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .adm-donut-value { font-size: 16px; font-weight: 800; color: #08162F; line-height: 1.1; }
        .adm-donut-label { font-size: 9px; color: #9ca3af; font-weight: 600; }
        .adm-donut-legend { flex: 1; display: flex; flex-direction: column; gap: 7px; min-width: 140px; }
        .adm-legend-row { display: flex; align-items: center; gap: 7px; font-size: 11.5px; }
        .adm-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .adm-legend-label { color: #374151; font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .adm-legend-value { color: #9ca3af; font-weight: 700; white-space: nowrap; }

        .act-feed { display: flex; flex-direction: column; gap: 2px; }
        .act-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f8fafc; }
        .act-item:last-child { border-bottom: none; }
        .act-icon { width: 28px; height: 28px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .act-main { font-size: 12px; font-weight: 600; color: #111827; margin: 0; line-height: 1.35; }
        .act-time { font-size: 10px; color: #c4c9d4; font-weight: 600; white-space: nowrap; }

        .rep-item { padding: 10px 0; border-bottom: 1px solid #f8fafc; }
        .rep-item:last-child { border-bottom: none; }
        .rep-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
        .rep-title { font-size: 12.5px; font-weight: 700; color: #111827; }
        .rep-badge { font-size: 9.5px; font-weight: 800; padding: 2px 7px; border-radius: 20px; flex-shrink: 0; }
        .rep-sub { font-size: 11px; color: #9ca3af; margin: 0 0 6px; }
        .rep-cta { font-size: 10.5px; font-weight: 700; color: #ef4444; text-decoration: none; }

        .usr-row { display: flex; align-items: center; gap: 9px; padding: 8px 0; border-bottom: 1px solid #f8fafc; }
        .usr-row:last-child { border-bottom: none; }
        .usr-avatar { width: 29px; height: 29px; border-radius: 50%; background: linear-gradient(135deg,#08162F,#1e3a8a); display: flex; align-items: center; justify-content: center; font-size: 11.5px; color: white; font-weight: 800; flex-shrink: 0; }
        .usr-name { font-size: 12px; font-weight: 700; color: #111827; margin: 0; }
        .usr-email { font-size: 10.5px; color: #9ca3af; margin: 0; }
        .usr-badge { font-size: 9.5px; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: #ecfdf5; color: #059669; white-space: nowrap; }
        .usr-badge.banned { background: #fef2f2; color: #dc2626; }

        .adm-table-wrap { overflow-x: auto; }
        .adm-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .adm-table th { text-align: left; color: #9ca3af; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.03em; padding: 0 9px 9px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
        .adm-table td { padding: 11px 9px; border-bottom: 1px solid #f8fafc; vertical-align: middle; white-space: nowrap; }
        .adm-table tr:last-child td { border-bottom: none; }
        .adm-table-title { font-weight: 700; color: #111827; }
        .adm-status-pill { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
        .adm-status-active { background: #ecfdf5; color: #059669; }
        .adm-status-pending { background: #fffbeb; color: #d97706; }
        .adm-table-actions { display: flex; gap: 5px; }
        .adm-table-actions a, .adm-table-actions button {
          width: 25px; height: 25px; border-radius: 7px; border: 1px solid #e8ecf4; background: white;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280;
        }
        .adm-table-actions button.danger:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
        .adm-table-actions a:hover { background: #eff6ff; border-color: #dbeafe; color: #2563EB; }

        /* ---------- Tablet ---------- */
        @media (min-width: 640px) {
          .adm-metric-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
        }

        /* ---------- Desktop ---------- */
        @media (min-width: 1024px) {
          .adm-page-title { font-size: 21px; }
          .adm-metric-card { padding: 18px; }
          .adm-metric-value { font-size: 26px; }
          .adm-panel { padding: 20px; }
          .adm-row-3 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1280px) {
          .adm-row-growth { grid-template-columns: 1.4fr 1fr 1fr; }
        }
      `}</style>

      <div className="adm-dash">

        {/* Page Header */}
        <div className="adm-page-header">
          <h1 className="adm-page-title">Dashboard Overview</h1>
          <p className="adm-page-sub">Welcome back, {user?.name} — here's what's happening on Scalablenexus</p>
        </div>

        {/* Utility bar */}
        <div className="adm-util-bar">
          <span className="adm-util-date">
            <CalendarDays size={13} />
            {now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            &nbsp;·&nbsp;{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="adm-util-right">
            <a className="adm-util-live" href={LIVE_SITE_URL} target="_blank" rel="noopener noreferrer">
              <Eye size={13} /> View Live Site
            </a>
            <Link to="/admin/reports" className="adm-util-bell">
              <Bell size={16} />
              {pendingReports.length > 0 && <span className="adm-util-bell-badge">{reports.length}</span>}
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="adm-metric-grid">
          {metricCards.map(function (c) {
            const CardIcon = c.Icon
            return (
              <Link key={c.label} to={c.to} className="adm-metric-card">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: c.color, borderRadius: '13px 13px 0 0' }} />
                <div className="adm-metric-top">
                  <div className="adm-metric-icon" style={{ background: c.bg }}>
                    <CardIcon size={16} color={c.color} strokeWidth={2.25} />
                  </div>
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
        <div className="adm-row adm-row-growth">
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title"><TrendingUp size={14} color="#00C896" /> User Growth (Last 14 Days)</span>
              <Link to="/admin/analytics" className="adm-panel-link">Full analytics →</Link>
            </div>
            <GrowthChart data={growthSeries} />
          </div>

          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title"><ShoppingBag size={14} color="#00C896" /> Listings by Category</span>
            </div>
            {catData.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No listings yet</p>
              : <Donut data={catData} colors={CAT_COLORS} centerValue={listings.length} centerLabel="Total" />}
          </div>

          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title"><Zap size={14} color="#2563EB" /> Platform Activity</span>
            </div>
            {activityData.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No activity yet</p>
              : <Donut data={activityData} colors={ACTIVITY_COLORS} centerValue={totalContent} centerLabel="Activities" />}
          </div>
        </div>

        {/* Activity / Reports / Users */}
        <div className="adm-row adm-row-3">
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span className="adm-panel-title"><History size={14} color="#08162F" /> Recent Activity</span>
              <Link to="/admin/logs" className="adm-panel-link">View all →</Link>
            </div>
            {recentActivity.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No recent activity</p>
              : (
                <div className="act-feed">
                  {recentActivity.slice(0, 6).map(function (a, i) {
                    const ActIcon = a.Icon
                    return (
                      <div key={i} className="act-item">
                        <div className="act-icon" style={{ background: a.bg }}><ActIcon size={13} color={a.color} /></div>
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
              <span className="adm-panel-title"><Flag size={14} color="#ef4444" /> Pending Reports</span>
              <Link to="/admin/reports" className="adm-panel-link">View all →</Link>
            </div>
            {pendingReports.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No pending reports</p>
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
              <span className="adm-panel-title"><Users size={14} color="#2563EB" /> Latest Users</span>
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
            <span className="adm-panel-title"><Package size={14} color="#08162F" /> Latest Listings</span>
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
                      <td>{formatPrice(l.price)}</td>
                      <td><span className={'adm-status-pill ' + (isPending ? 'adm-status-pending' : 'adm-status-active')}>{l.status || 'Active'}</span></td>
                      <td>{timeAgo(l.createdAt)}</td>
                      <td>
                        <div className="adm-table-actions">
                          <Link to={'/admin/listings/' + l._id} title="View"><Eye size={13} /></Link>
                          <Link to={'/admin/listings/' + l._id + '/edit'} title="Edit"><Pencil size={13} /></Link>
                          <button className="danger" title="Delete" onClick={function () { handleDeleteListing(l._id) }}><Trash2 size={13} /></button>
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