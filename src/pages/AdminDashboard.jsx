import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    api.get('/admin/stats')
      .then(function(res) { setStats(res.data) })
      .catch(function() { navigate('/') })
      .finally(function() { setLoading(false) })
  }, [user])

  if (loading) return (
    <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      Loading dashboard...
    </p>
  )

  const cards = [
    { label: 'Total Users', value: stats && stats.userCount, icon: '👤', color: '#2563EB', to: '/admin/users' },
    { label: 'Marketplace Items', value: stats && stats.listingCount, icon: '🛍️', color: '#00C896', to: '/admin/listings' },
    { label: 'Services', value: stats && stats.serviceCount, icon: '🧑‍💼', color: '#7C3AED', to: '' },
    { label: 'Jobs', value: stats && stats.jobCount, icon: '💼', color: '#F59E0B', to: '' },
    { label: 'Events', value: stats && stats.eventCount, icon: '🎉', color: '#EC4899', to: '' },
    { label: 'Reports', value: stats && stats.reportCount, icon: '🚩', color: '#EF4444', to: '/admin/reports' },
    { label: 'Banned Users', value: stats && stats.bannedCount, icon: '🚫', color: '#991b1b', to: '/admin/users' },
  ]

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 80px' }}>

      <button
        onClick={function() { navigate('/') }}
        style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#374151', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', fontWeight: 600 }}
      >← Back to Site</button>

      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#08162F', marginBottom: '4px' }}>
        🛡️ Admin Dashboard
      </h1>
      <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '28px' }}>
        Manage users, listings and reports across SwiftKart
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map(function(c) {
          const cardContent = (
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: c.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                {c.icon}
              </div>
              <p style={{ fontSize: '26px', fontWeight: 800, color: '#08162F', margin: 0 }}>{c.value || 0}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginTop: '4px' }}>{c.label}</p>
            </div>
          )

          const cardStyle = {
            background: 'white', borderRadius: '16px', padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1px solid #f1f5f9',
            textDecoration: 'none', cursor: c.to ? 'pointer' : 'default',
            transition: 'transform .2s', display: 'block'
          }

          if (c.to) {
            return (
              <Link key={c.label} to={c.to} style={cardStyle}>
                {cardContent}
              </Link>
            )
          }

          return (
            <div key={c.label} style={cardStyle}>
              {cardContent}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/admin/users" style={{
          background: 'linear-gradient(135deg,#08162F,#1e3a8a)', color: 'white',
          padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
        }}>👤 Manage Users</Link>
        <Link to="/admin/listings" style={{
          background: 'linear-gradient(135deg,#00C896,#059669)', color: 'white',
          padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
        }}>🛍️ Manage Listings</Link>
        <Link to="/admin/reports" style={{
          background: 'linear-gradient(135deg,#EF4444,#dc2626)', color: 'white',
          padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
        }}>🚩 View Reports</Link>
      </div>
    </div>
  )
}