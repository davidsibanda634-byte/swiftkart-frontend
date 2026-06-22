import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AdminLayout } from './AdminDashboard'
import api from '../services/api'

export default function AdminListings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
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
      api.get('/admin/listings'),
      api.get('/admin/stats'),
    ])
      .then(function([l, s]) { setListings(l.data); setStats(s.data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function getImg(img) {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  function deleteListing(id) {
    if (!window.confirm('Permanently delete this listing?')) return
    api.delete('/admin/listings/' + id)
      .then(function() { fetchAll() })
      .catch(function() { alert('Failed to delete listing.') })
  }

  const CATEGORIES = ['All', 'Fashion', 'Cosmetics & Hair', 'Mobile & Accessories', 'Vehicles', 'Furniture', 'Electronics', 'Food', 'Other']

  const filtered = listings.filter(function(l) {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.user?.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || l.category === filter
    return matchSearch && matchFilter
  })

  return (
    <AdminLayout stats={stats}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">🛍️ Manage Listings</h1>
        <p className="adm-page-sub">{listings.length} total listings on the platform</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat === 'All' ? 'all' : cat)}
            style={{
              padding: '6px 13px', borderRadius: '20px', border: '1.5px solid',
              borderColor: (filter === 'all' && cat === 'All') || filter === cat ? '#00C896' : '#e2e8f0',
              background: (filter === 'all' && cat === 'All') || filter === cat ? '#ecfdf5' : 'white',
              color: (filter === 'all' && cat === 'All') || filter === cat ? '#059669' : '#374151',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >{cat}</button>
        ))}
      </div>

      <input
        className="adm-search"
        type="text"
        placeholder="🔍 Search by title or seller name..."
        value={search}
        onChange={function(e) { setSearch(e.target.value) }}
      />

      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px', fontWeight: 600 }}>
        Showing {filtered.length} of {listings.length} listings
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Loading listings...</div>
      ) : (
        <div className="adm-section">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>
              No listings found
            </div>
          ) : filtered.map(function(l) {
            const imgUrl = getImg(l.images && l.images[0])
            return (
              <div key={l._id} className="adm-row-item">
                <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                  {imgUrl
                    ? <img src={imgUrl} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🛍️</div>
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {l.title}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#9ca3af' }}>
                    ${Number(l.price).toLocaleString()} • by {l.user?.name || 'Unknown'} • {l.category}
                  </p>
                  <p style={{ margin: '1px 0 0', fontSize: '10.5px', color: '#c4c9d4' }}>
                    {new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => navigate('/listings/' + l._id)}
                    style={{ background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0', padding: '5px 11px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                  >View</button>
                  <button
                    onClick={() => deleteListing(l._id)}
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '5px 11px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                  >Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}