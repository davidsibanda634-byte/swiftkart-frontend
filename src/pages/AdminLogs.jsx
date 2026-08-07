import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { Search, Download, Shield } from 'lucide-react'

const PAGE_SIZE = 25

const ACTION_META = {
  ban_user:             { label: 'Ban User',             color: '#dc2626', bg: '#fef2f2', icon: '🚫' },
  unban_user:           { label: 'Unban User',           color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
  make_admin:           { label: 'Make Admin',           color: '#7c3aed', bg: '#f5f3ff', icon: '🛡️' },
  remove_admin:         { label: 'Remove Admin',         color: '#d97706', bg: '#fffbeb', icon: '🔓' },
  verify_user:          { label: 'Verify User',          color: '#2563eb', bg: '#eff6ff', icon: '✔️' },
  unverify_user:        { label: 'Unverify User',        color: '#6b7280', bg: '#f9fafb', icon: '❌' },
  delete_user:          { label: 'Delete User',          color: '#dc2626', bg: '#fef2f2', icon: '🗑️' },
  delete_listing:       { label: 'Delete Listing',       color: '#dc2626', bg: '#fef2f2', icon: '🗑️' },
  delete_service:       { label: 'Delete Service',       color: '#dc2626', bg: '#fef2f2', icon: '🗑️' },
  delete_job:           { label: 'Delete Job',           color: '#dc2626', bg: '#fef2f2', icon: '🗑️' },
  delete_event:         { label: 'Delete Event',         color: '#dc2626', bg: '#fef2f2', icon: '🗑️' },
  delete_accommodation: { label: 'Delete Property',      color: '#dc2626', bg: '#fef2f2', icon: '🗑️' },
  delete_report:        { label: 'Dismiss Report',       color: '#059669', bg: '#ecfdf5', icon: '✅' },
  dismiss_report:       { label: 'Dismiss Report',       color: '#059669', bg: '#ecfdf5', icon: '✅' },
}

function exportCSV(rows) {
  const headers = ['Timestamp', 'Admin', 'Action', 'Target Type', 'Target ID', 'Details']
  const csvRows = [headers.join(',')]
  rows.forEach(log => {
    const vals = [
      new Date(log.createdAt).toLocaleString(),
      log.adminName || '',
      log.action || '',
      log.targetType || '',
      log.targetId || '',
      log.details || '',
    ]
    csvRows.push(vals.map(v => '"' + ('' + v).replace(/"/g, '""') + '"').join(','))
  })
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'admin-logs-' + new Date().toISOString().slice(0, 10) + '.csv'
  a.click()
  URL.revokeObjectURL(url)
}

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

export default function AdminLogs() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(function () {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchData()
  }, [])

  function fetchData() {
    setLoading(true)
    Promise.all([api.get('/admin/logs'), api.get('/admin/stats')])
      .then(function (res) { setLogs(res[0].data); setStats(res[1].data) })
      .catch(function () {})
      .finally(function () { setLoading(false) })
  }

  const ACTION_TYPES = ['All', ...Object.keys(ACTION_META)]

  const filtered = useMemo(function () {
    return logs.filter(function (log) {
      const matchSearch =
        (log.adminName || '').toLowerCase().includes(search.toLowerCase()) ||
        (log.details || '').toLowerCase().includes(search.toLowerCase()) ||
        (log.targetType || '').toLowerCase().includes(search.toLowerCase())
      const matchAction = actionFilter === 'All' || log.action === actionFilter
      return matchSearch && matchAction
    })
  }, [logs, search, actionFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(function () { setPage(1) }, [search, actionFilter])

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .al2-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        .al2-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }

        .al2-notice {
          display: flex; align-items: center; gap: 10px;
          background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;
          padding: 10px 16px; margin-bottom: 16px; font-size: 12.5px; color: #1e40af; font-weight: 600;
        }

        .al2-filters-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .al2-search {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid #e8ecf4; border-radius: 10px;
          padding: 0 14px; height: 40px; flex: 1; min-width: 200px;
        }
        .al2-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .al2-search input { border: none; outline: none; font-size: 13px; color: #374151; font-family: inherit; flex: 1; background: transparent; }
        .al2-select {
          height: 40px; border: 1.5px solid #e8ecf4; border-radius: 10px; padding: 0 12px;
          font-size: 12.5px; font-weight: 600; color: #374151; background: white; font-family: inherit; cursor: pointer;
        }
        .al2-export-btn {
          height: 40px; padding: 0 14px; border: 1.5px solid #e8ecf4; border-radius: 10px;
          background: white; font-size: 12.5px; font-weight: 700; color: #374151; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .al2-export-btn:hover { border-color: #00C896; color: #059669; }

        .al2-table-wrap { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow-x: auto; }
        .al2-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 700px; }
        .al2-table th {
          text-align: left; color: #9ca3af; font-weight: 700; font-size: 10.5px; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #fafbfc; white-space: nowrap;
        }
        .al2-table td { padding: 11px 14px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
        .al2-table tr:last-child td { border-bottom: none; }
        .al2-table tr:hover td { background: #fafbfc; }

        .al2-action-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap;
        }

        .al2-admin-name { font-weight: 700; color: #0f172a; font-size: 13px; }
        .al2-details { color: #374151; font-size: 12.5px; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .al2-time { font-size: 11.5px; color: #9ca3af; white-space: nowrap; }
        .al2-target { font-size: 11px; color: #6b7280; font-weight: 600; }

        .al2-empty { text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 13.5px; }

        .al2-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; flex-wrap: wrap; gap: 10px; }
        .al2-page-info { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .al2-page-btns { display: flex; gap: 5px; }
        .al2-page-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid #e8ecf4; background: white;
          font-size: 12px; font-weight: 700; color: #374151; cursor: pointer; font-family: inherit;
        }
        .al2-page-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .al2-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .al2-readonly-banner {
          display: flex; align-items: center; gap: 8px;
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 8px 14px; font-size: 11.5px; color: #6b7280; font-weight: 600; margin-bottom: 14px;
        }

        @media (max-width: 700px) {
          .al2-filters-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      <div className="al2-page">
        <div className="al2-toolbar">
          <div className="adm-page-header" style={{ marginBottom: 0 }}>
            <h1 className="adm-page-title">System Logs</h1>
            <p className="adm-page-sub">
              {logs.length} audit entries — append-only, read-only record of all admin actions
            </p>
          </div>
        </div>

        <div className="al2-notice">
          <Shield size={15} />
          This is a read-only audit trail. Entries cannot be edited or deleted.
          Every destructive admin action is recorded here automatically.
        </div>

        <div className="al2-readonly-banner">
          🔒 Showing the {logs.length} most recent entries (cap: 500). Newest first.
        </div>

        <div className="al2-filters-row">
          <div className="al2-search">
            <Search size={14} color="#9ca3af" />
            <input
              placeholder="Search by admin name, details or target type..."
              value={search}
              onChange={function (e) { setSearch(e.target.value) }}
            />
          </div>
          <select
            className="al2-select"
            value={actionFilter}
            onChange={function (e) { setActionFilter(e.target.value) }}
          >
            <option value="All">All Actions</option>
            {Object.entries(ACTION_META).map(function ([key, meta]) {
              return <option key={key} value={key}>{meta.label}</option>
            })}
          </select>
          <button className="al2-export-btn" onClick={function () { exportCSV(filtered) }}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="al2-empty">Loading logs...</div>
        ) : filtered.length === 0 ? (
          <div className="al2-empty">
            {logs.length === 0
              ? 'No admin actions have been logged yet. Logs will appear here as soon as any admin performs an action.'
              : 'No logs match your search.'
            }
          </div>
        ) : (
          <>
            <div className="al2-table-wrap">
              <table className="al2-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(function (log) {
                    const meta = ACTION_META[log.action] || { label: log.action, color: '#6b7280', bg: '#f9fafb', icon: '•' }
                    return (
                      <tr key={log._id}>
                        <td>
                          <div className="al2-time">
                            {timeAgo(log.createdAt)}
                          </div>
                          <div style={{ fontSize: '10px', color: '#c4c9d4', marginTop: '2px' }}>
                            {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td>
                          <div className="al2-admin-name">{log.adminName || '—'}</div>
                        </td>
                        <td>
                          <span
                            className="al2-action-pill"
                            style={{ background: meta.bg, color: meta.color }}
                          >
                            {meta.icon} {meta.label}
                          </span>
                        </td>
                        <td>
                          {log.targetType && (
                            <span className="al2-target">
                              {log.targetType}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="al2-details" title={log.details}>
                            {log.details || '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="al2-pagination">
              <span className="al2-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="al2-page-btns">
                <button className="al2-page-btn" disabled={page === 1} onClick={function () { setPage(page - 1) }}>‹</button>
                {Array.from({ length: Math.min(totalPages, 5) }).map(function (_, i) {
                  const p = i + 1
                  return (
                    <button
                      key={p}
                      className={'al2-page-btn' + (page === p ? ' active' : '')}
                      onClick={function () { setPage(p) }}
                    >
                      {p}
                    </button>
                  )
                })}
                <button className="al2-page-btn" disabled={page === totalPages} onClick={function () { setPage(page + 1) }}>›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}