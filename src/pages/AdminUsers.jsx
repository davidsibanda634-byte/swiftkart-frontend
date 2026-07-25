import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

export default function AdminUsers() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

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

  const filtered = users.filter(function(u) {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    if (filter === 'admins') return matchSearch && u.isAdmin
    if (filter === 'banned') return matchSearch && u.isBanned
    return matchSearch
  })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .au-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .au-filters { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .au-filter-btn {
          padding: 7px 16px; border-radius: 20px; border: 1.5px solid #e8ecf4;
          background: white; font-size: 12.5px; font-weight: 700; color: #6b7280;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .au-filter-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .au-filter-btn:hover:not(.active) { border-color: #00C896; color: #00C896; }
        .au-count-pill {
          background: rgba(255,255,255,0.2); color: inherit;
          font-size: 10px; padding: 1px 6px; border-radius: 8px; font-weight: 700;
        }
        .au-filter-btn:not(.active) .au-count-pill { background: #f1f5f9; color: #6b7280; }

        .au-search {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 12px; padding: 0 16px; height: 44px;
          margin-bottom: 20px; transition: all 0.2s;
        }
        .au-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .au-search input {
          border: none; outline: none; font-size: 13.5px;
          color: #374151; font-family: inherit; flex: 1; background: transparent;
        }

        .au-table { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
        .au-table-header {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 1fr auto;
          gap: 16px; padding: 12px 20px;
          background: #f8fafc; border-bottom: 1px solid #f1f5f9;
          font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .au-user-row {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 1fr auto;
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
        <div className="adm-page-header">
          <h1 className="adm-page-title">👤 Manage Users</h1>
          <p className="adm-page-sub">{users.length} total users on Scalablenexus</p>
        </div>

        <div className="au-filters">
          {[
            { key: 'all', label: 'All Users', count: users.length },
            { key: 'admins', label: 'Admins', count: users.filter(function(u) { return u.isAdmin }).length },
            { key: 'banned', label: 'Banned', count: users.filter(function(u) { return u.isBanned }).length },
          ].map(function(f) {
            return (
              <button key={f.key} className={'au-filter-btn' + (filter === f.key ? ' active' : '')}
                onClick={function() { setFilter(f.key) }}>
                {f.label} <span className="au-count-pill">{f.count}</span>
              </button>
            )
          })}
        </div>

        <div className="au-search">
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={function(e) { setSearch(e.target.value) }}
          />
        </div>

        <div className="au-table">
          <div className="au-table-header">
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
          ) : filtered.map(function(u) {
            return (
              <div key={u._id} className="au-user-row">
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
      </div>
    </AdminLayout>
  )
}