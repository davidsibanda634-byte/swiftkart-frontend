import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { Search, Download, UserPlus } from 'lucide-react'

const PAGE_SIZE = 20

function exportCSV(rows, headers, filename) {
  const csvRows = [headers.map(function(h) { return h.label }).join(',')]
  rows.forEach(function(row) {
    csvRows.push(headers.map(function(h) {
      const val = h.get(row)
      const escaped = ('' + (val ?? '')).replace(/"/g, '""')
      return '"' + escaped + '"'
    }).join(','))
  })
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminUsers() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [page, setPage] = useState(1)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchData()
  }, [])

  function fetchData() {
    setLoading(true)
    Promise.all([api.get('/admin/users'), api.get('/admin/stats')])
      .then(function(res) { setUsers(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function toggleBan(id) {
    if (!window.confirm('Change ban status?')) return
    api.put('/admin/users/' + id + '/ban').then(fetchData).catch(function() { alert('Failed') })
  }

  function toggleAdmin(id) {
    if (!window.confirm('Change admin status?')) return
    api.put('/admin/users/' + id + '/admin').then(fetchData).catch(function() { alert('Failed') })
  }

  function deleteUser(id) {
    if (!window.confirm('Permanently delete this user?')) return
    api.delete('/admin/users/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  function banSelected() {
    if (selectedIds.size === 0) return
    if (!window.confirm('Toggle ban status for ' + selectedIds.size + ' user' + (selectedIds.size !== 1 ? 's' : '') + '?')) return
    Promise.all(Array.from(selectedIds).map(function(id) { return api.put('/admin/users/' + id + '/ban') }))
      .then(function() { setSelectedIds(new Set()); fetchData() })
      .catch(function() { alert('Some updates failed.'); fetchData() })
  }

  function makeAdminSelected() {
    if (selectedIds.size === 0) return
    if (!window.confirm('Toggle admin status for ' + selectedIds.size + ' user' + (selectedIds.size !== 1 ? 's' : '') + '?')) return
    Promise.all(Array.from(selectedIds).map(function(id) { return api.put('/admin/users/' + id + '/admin') }))
      .then(function() { setSelectedIds(new Set()); fetchData() })
      .catch(function() { alert('Some updates failed.'); fetchData() })
  }

  function deleteSelected() {
    if (selectedIds.size === 0) return
    if (!window.confirm('Permanently delete ' + selectedIds.size + ' user' + (selectedIds.size !== 1 ? 's' : '') + '?')) return
    Promise.all(Array.from(selectedIds).map(function(id) { return api.delete('/admin/users/' + id) }))
      .then(function() { setSelectedIds(new Set()); fetchData() })
      .catch(function() { alert('Some deletions failed.'); fetchData() })
  }

  const filtered = useMemo(function() {
    return users.filter(function(u) {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      if (filter === 'admins') return matchSearch && u.isAdmin
      if (filter === 'banned') return matchSearch && u.isBanned
      return matchSearch
    })
  }, [users, search, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(function() { setPage(1) }, [search, filter])

  function toggleOne(id) {
    setSelectedIds(function(prev) {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllOnPage() {
    const pageIds = pageItems.map(function(u) { return u._id })
    const allSelected = pageIds.every(function(id) { return selectedIds.has(id) })
    setSelectedIds(function(prev) {
      const next = new Set(prev)
      if (allSelected) pageIds.forEach(function(id) { next.delete(id) })
      else pageIds.forEach(function(id) { next.add(id) })
      return next
    })
  }

  function handleExport() {
    exportCSV(filtered, [
      { label: 'Name', get: function(u) { return u.name } },
      { label: 'Email', get: function(u) { return u.email } },
      { label: 'Phone', get: function(u) { return u.phone } },
      { label: 'City', get: function(u) { return u.location?.city || '' } },
      { label: 'Joined', get: function(u) { return new Date(u.createdAt).toLocaleDateString() } },
      { label: 'Status', get: function(u) { return u.isBanned ? 'Banned' : 'Active' } },
    ], 'users.csv')
  }

  const pageIds = pageItems.map(function(u) { return u._id })
  const allOnPageSelected = pageIds.length > 0 && pageIds.every(function(id) { return selectedIds.has(id) })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .au-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        .au-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .au-add-btn {
          background: #00C896; color: white; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .au-add-btn:hover { background: #059669; }

        .au-tabs { display: flex; gap: 4px; margin-bottom: 16px; overflow-x: auto; scrollbar-width: none; border-bottom: 1.5px solid #eef0f4; }
        .au-tabs::-webkit-scrollbar { display: none; }
        .au-tab {
          padding: 9px 14px; font-size: 12.5px; font-weight: 700; color: #6b7280;
          background: none; border: none; cursor: pointer; font-family: inherit;
          white-space: nowrap; border-bottom: 2.5px solid transparent; margin-bottom: -1.5px;
        }
        .au-tab.active { color: #08162F; border-bottom-color: #00C896; }
        .au-tab:hover:not(.active) { color: #374151; }

        .au-filters-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .au-search {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 10px; padding: 0 14px; height: 40px; flex: 1; min-width: 200px;
        }
        .au-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .au-search input { border: none; outline: none; font-size: 13px; color: #374151; font-family: inherit; flex: 1; background: transparent; }
        .au-export-btn {
          height: 40px; padding: 0 14px; border: 1.5px solid #e8ecf4; border-radius: 10px;
          background: white; font-size: 12.5px; font-weight: 700; color: #374151; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .au-export-btn:hover { border-color: #00C896; color: #059669; }

        .au-bulk-bar {
          display: flex; align-items: center; gap: 10px; background: #08162F; color: white;
          padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .au-bulk-count { font-size: 12.5px; font-weight: 700; }
        .au-bulk-btn {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;
        }
        .au-bulk-btn.green { background: #00C896; border-color: #00C896; }
        .au-bulk-btn.green:hover { background: #059669; }
        .au-bulk-btn.amber { background: #d97706; border-color: #d97706; }
        .au-bulk-btn.amber:hover { background: #b45309; }
        .au-bulk-btn.danger { background: #ef4444; border-color: #ef4444; }
        .au-bulk-btn.danger:hover { background: #dc2626; }
        .au-bulk-clear { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; margin-left: auto; }
        .au-bulk-clear:hover { color: white; }

        .au-table { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
        .au-table-header {
          display: grid; grid-template-columns: 26px 2fr 2fr 1.5fr 1fr auto;
          gap: 16px; padding: 12px 20px;
          background: #f8fafc; border-bottom: 1px solid #f1f5f9;
          font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .au-user-row {
          display: grid; grid-template-columns: 26px 2fr 2fr 1.5fr 1fr auto;
          gap: 16px; padding: 14px 20px; align-items: center;
          border-bottom: 1px solid #f8fafc; transition: background 0.15s;
        }
        .au-user-row:last-child { border-bottom: none; }
        .au-user-row:hover { background: #fafbff; }

        .au-user-info { display: flex; align-items: center; gap: 10px; }
        .au-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg,#08162F,#1e3a8a);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: white; font-weight: 800; flex-shrink: 0;
        }
        .au-name { font-size: 13.5px; font-weight: 700; color: #111827; }
        .au-email { font-size: 11.5px; color: #9ca3af; margin-top: 1px; }
        .au-phone { font-size: 12.5px; color: #6b7280; font-weight: 500; }
        .au-joined { font-size: 12px; color: #9ca3af; }

        .au-badges { display: flex; gap: 5px; flex-wrap: wrap; }
        .au-badge {
          font-size: 9.5px; font-weight: 700; padding: 2px 8px; border-radius: 8px;
        }
        .au-badge-admin { background: #ecfdf5; color: #059669; }
        .au-badge-banned { background: #fef2f2; color: #dc2626; }
        .au-badge-active { background: #f0fdf4; color: #16a34a; }

        .au-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .au-btn {
          padding: 5px 12px; border-radius: 8px; font-size: 11px;
          font-weight: 700; cursor: pointer; font-family: inherit; border: 1.5px solid;
          transition: all 0.2s;
        }
        .au-btn-ban { background: #fffbeb; color: #d97706; border-color: #fde68a; }
        .au-btn-ban:hover { background: #fef3c7; }
        .au-btn-unban { background: #ecfdf5; color: #059669; border-color: #bbf7d0; }
        .au-btn-unban:hover { background: #d1fae5; }
        .au-btn-admin { background: #eff6ff; color: #2563EB; border-color: #bfdbfe; }
        .au-btn-admin:hover { background: #dbeafe; }
        .au-btn-delete { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
        .au-btn-delete:hover { background: #fee2e2; }

        .au-empty { text-align: center; padding: 60px 20px; color: #9ca3af; }
        .au-loading { text-align: center; padding: 60px 20px; color: #9ca3af; }

        .au-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; flex-wrap: wrap; gap: 10px; }
        .au-page-info { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .au-page-btns { display: flex; gap: 5px; }
        .au-page-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid #e8ecf4; background: white;
          font-size: 12px; font-weight: 700; color: #374151; cursor: pointer; font-family: inherit;
        }
        .au-page-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .au-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 900px) {
          .au-table-header { display: none; }
          .au-user-row {
            grid-template-columns: 1fr;
            gap: 10px; padding: 16px;
          }
          .au-actions { justify-content: flex-start; }
        }
      `}</style>

      <div className="au-page">
        <div className="au-toolbar">
          <div className="adm-page-header" style={{ marginBottom: 0 }}>
            <h1 className="adm-page-title">Users</h1>
            <p className="adm-page-sub">{users.length} total users on Scalablenexus</p>
          </div>
          <Link to="/register" className="au-add-btn"><UserPlus size={14} /> Add User</Link>
        </div>

        <div className="au-tabs">
          {[
            { key: 'all', label: 'All Users', count: users.length },
            { key: 'admins', label: 'Admins', count: users.filter(function(u) { return u.isAdmin }).length },
            { key: 'banned', label: 'Banned Users', count: users.filter(function(u) { return u.isBanned }).length },
          ].map(function(f) {
            return (
              <button key={f.key} className={'au-tab' + (filter === f.key ? ' active' : '')}
                onClick={function() { setFilter(f.key) }}>
                {f.label} ({f.count})
              </button>
            )
          })}
        </div>

        <div className="au-filters-row">
          <div className="au-search">
            <Search size={14} color="#9ca3af" />
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={function(e) { setSearch(e.target.value) }}
            />
          </div>
          <button className="au-export-btn" onClick={handleExport}><Download size={14} /> Export CSV</button>
        </div>

        {selectedIds.size > 0 && (
          <div className="au-bulk-bar">
            <span className="au-bulk-count">{selectedIds.size} selected</span>
            <button className="au-bulk-btn green" onClick={makeAdminSelected}>Make Admin</button>
            <button className="au-bulk-btn amber" onClick={banSelected}>Ban</button>
            <button className="au-bulk-btn danger" onClick={deleteSelected}>Delete</button>
            <button className="au-bulk-clear" onClick={function() { setSelectedIds(new Set()) }}>Clear</button>
          </div>
        )}

        <div className="au-table">
          <div className="au-table-header">
            <input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} />
            <span>User</span>
            <span>Contact</span>
            <span>Joined</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="au-loading">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="au-empty">No users found</div>
          ) : pageItems.map(function(u) {
            return (
              <div key={u._id} className="au-user-row">
                <input type="checkbox" checked={selectedIds.has(u._id)} onChange={function() { toggleOne(u._id) }} />
                <div className="au-user-info">
                  <div className="au-avatar">{u.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="au-name">{u.name}</p>
                    <p className="au-email">{u.email}</p>
                  </div>
                </div>
                <div>
                  <p className="au-phone">{u.phone}</p>
                  <p className="au-email">{u.location?.city}{u.location?.country ? ', ' + u.location.country : ''}</p>
                </div>
                <p className="au-joined">
                  {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="au-badges">
                  {u.isAdmin && <span className="au-badge au-badge-admin">ADMIN</span>}
                  {u.isBanned ? (
                    <span className="au-badge au-badge-banned">BANNED</span>
                  ) : (
                    <span className="au-badge au-badge-active">ACTIVE</span>
                  )}
                </div>
                <div className="au-actions">
                  <button
                    className={u.isBanned ? 'au-btn au-btn-unban' : 'au-btn au-btn-ban'}
                    onClick={function() { toggleBan(u._id) }}
                  >
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </button>
                  <button className="au-btn au-btn-admin" onClick={function() { toggleAdmin(u._id) }}>
                    {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button className="au-btn au-btn-delete" onClick={function() { deleteUser(u._id) }}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="au-pagination">
            <span className="au-page-info">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="au-page-btns">
              <button className="au-page-btn" disabled={page === 1} onClick={function() { setPage(page - 1) }}>‹</button>
              {Array.from({ length: totalPages }).slice(0, 5).map(function(_, i) {
                const p = i + 1
                return <button key={p} className={'au-page-btn' + (page === p ? ' active' : '')} onClick={function() { setPage(p) }}>{p}</button>
              })}
              <button className="au-page-btn" disabled={page === totalPages} onClick={function() { setPage(page + 1) }}>›</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}