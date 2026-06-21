import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AdminUsers() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchUsers()
  }, [])

  function fetchUsers() {
    setLoading(true)
    api.get('/admin/users')
      .then(function(res) { setUsers(res.data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function toggleBan(id) {
    if (!window.confirm('Are you sure you want to change this user\'s ban status?')) return
    api.put('/admin/users/' + id + '/ban')
      .then(function() { fetchUsers() })
      .catch(function() { alert('Failed to update user.') })
  }

  function toggleAdmin(id) {
    if (!window.confirm('Are you sure you want to change this user\'s admin status?')) return
    api.put('/admin/users/' + id + '/admin')
      .then(function() { fetchUsers() })
      .catch(function() { alert('Failed to update user.') })
  }

  function deleteUser(id) {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return
    api.delete('/admin/users/' + id)
      .then(function() { fetchUsers() })
      .catch(function() { alert('Failed to delete user.') })
  }

  const filtered = users.filter(function(u) {
    return u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 80px' }}>

      <button
        onClick={function() { navigate('/admin') }}
        style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#374151', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', fontWeight: 600 }}
      >← Back to Dashboard</button>

      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#08162F', marginBottom: '4px' }}>👤 Manage Users</h1>
      <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>{users.length} total users</p>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={function(e) { setSearch(e.target.value) }}
        style={{ width: '100%', padding: '11px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box', fontFamily: 'inherit' }}
      />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>Loading users...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(function(u) {
            return (
              <div key={u._id} style={{
                background: 'white', borderRadius: '14px', padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,#08162F,#1e3a8a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', color: 'white', fontWeight: 800, flexShrink: 0
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: '160px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {u.name}
                    {u.isAdmin && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>ADMIN</span>}
                    {u.isBanned && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>BANNED</span>}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0' }}>{u.email} • {u.phone}</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={function() { toggleBan(u._id) }} style={{
                    background: u.isBanned ? '#f0fdf4' : '#fef2f2',
                    color: u.isBanned ? '#16a34a' : '#dc2626',
                    border: '1px solid ' + (u.isBanned ? '#bbf7d0' : '#fecaca'),
                    padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
                  }}>{u.isBanned ? 'Unban' : 'Ban'}</button>

                  <button onClick={function() { toggleAdmin(u._id) }} style={{
                    background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe',
                    padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
                  }}>{u.isAdmin ? 'Remove Admin' : 'Make Admin'}</button>

                  <button onClick={function() { deleteUser(u._id) }} style={{
                    background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                    padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
                  }}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}