import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AdminLayout } from './AdminDashboard'
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
    fetchAll()
  }, [])

  function fetchAll() {
    setLoading(true)
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/stats'),
    ])
      .then(function([u, s]) { setUsers(u.data); setStats(s.data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function toggleBan(id) {
    if (!window.confirm('Change this user\'s ban status?')) return
    api.put('/admin/users/' + id + '/ban')
      .then(function() { fetchAll() })
      .catch(function() { alert('Failed to update user.') })
  }

  function toggleAdmin(id) {
    if (!window.confirm('Change this user\'s admin status?')) return
    api.put('/admin/users/' + id + '/admin')
      .then(function() { fetchAll() })
      .catch(function() { alert('Failed to update user.') })
  }

  function deleteUser(id) {
    if (!window.confirm('Permanently delete this user?')) return
    api.delete('/admin/users/' + id)
      .then(function() { fetchAll() })
      .catch(function() { alert('Failed to delete user.') })
  }

  const filtered = users.filter(function(u) {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    if (filter === 'banned') return matchesSearch && u.isBanned
    if (filter === 'admins') return matchesSearch && u.isAdmin
    return matchesSearch
  })

  return (
    <AdminLayout stats={stats}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">👤 Manage Users</h1>
        <p className="adm-page-sub">{users.length} total users on Scalablenexus</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All Users', count: users.length },
          { key: 'admins', label: 'Admins', count: users.filter(u => u.isAdmin).length },
          { key: 'banned', label: 'Banned', count: users.filter(u => u.isBanned).length },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '7px 16px', borderRadius: '20px', border: '1.5px solid',
              borderColor: filter === f.key ? '#00C896' : '#e2e8f0',
              background: filter === f.key ? '#ecfdf5' : 'white',
              color: filter === f.key ? '#059669' : '#374151',
              fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {f.label}
            <span style={{
              background: filter === f.key ? '#00C896' : '#f1f5f9',
              color: filter === f.key ? 'white' : '#6b7280',
              fontSize: '10px', fontWeight: 800, padding: '1px 7px', borderRadius: '10px'
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      <input
        className="adm-search"
        type="text"
        placeholder="🔍 Search by name or email..."
        value={search}
        onChange={function(e) { setSearch(e.target.value) }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Loading users...</div>
      ) : (
        <div className="adm-section">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>
              No users found
            </div>
          ) : filtered.map(function(u) {
            return (
              <div key={u._id} className="adm-row-item">
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: u.isBanned ? '#fef2f2' : 'linear-gradient(135deg,#08162F,#1e3a8a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', color: u.isBanned ? '#dc2626' : 'white', fontWeight: 800,
                }}>
                  {u.isBanned ? '🚫' : u.name.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>{u.name}</p>
                    {u.isAdmin && (
                      <span style={{ fontSize: '9px', background: '#ecfdf5', color: '#059669', padding: '2px 7px', borderRadius: '8px', fontWeight: 800 }}>ADMIN</span>
                    )}
                    {u.isBanned && (
                      <span style={{ fontSize: '9px', background: '#fef2f2', color: '#dc2626', padding: '2px 7px', borderRadius: '8px', fontWeight: 800 }}>BANNED</span>
                    )}
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#9ca3af' }}>
                    {u.email} • {u.phone || 'No phone'}
                  </p>
                  <p style={{ margin: '1px 0 0', fontSize: '10.5px', color: '#c4c9d4' }}>
                    Joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <button onClick={() => toggleBan(u._id)} style={{
                    background: u.isBanned ? '#f0fdf4' : '#fef2f2',
                    color: u.isBanned ? '#16a34a' : '#dc2626',
                    border: '1px solid ' + (u.isBanned ? '#bbf7d0' : '#fecaca'),
                    padding: '5px 11px', borderRadius: '8px', fontSize: '11px',
                    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{u.isBanned ? 'Unban' : 'Ban'}</button>

                  <button onClick={() => toggleAdmin(u._id)} style={{
                    background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe',
                    padding: '5px 11px', borderRadius: '8px', fontSize: '11px',
                    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{u.isAdmin ? 'Remove Admin' : 'Make Admin'}</button>

                  <button onClick={() => deleteUser(u._id)} style={{
                    background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                    padding: '5px 11px', borderRadius: '8px', fontSize: '11px',
                    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}