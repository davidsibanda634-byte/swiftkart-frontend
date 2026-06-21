import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AdminListings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchListings()
  }, [])

  function fetchListings() {
    setLoading(true)
    api.get('/admin/listings')
      .then(function(res) { setListings(res.data) })
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
      .then(function() { fetchListings() })
      .catch(function() { alert('Failed to delete listing.') })
  }

  const filtered = listings.filter(function(l) {
    return l.title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 80px' }}>

      <button
        onClick={function() { navigate('/admin') }}
        style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#374151', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', fontWeight: 600 }}
      >← Back to Dashboard</button>

      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#08162F', marginBottom: '4px' }}>🛍️ All Listings</h1>
      <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>{listings.length} total listings</p>

      <input
        type="text"
        placeholder="Search listings..."
        value={search}
        onChange={function(e) { setSearch(e.target.value) }}
        style={{ width: '100%', padding: '11px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box', fontFamily: 'inherit' }}
      />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>Loading listings...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(function(l) {
            const imgUrl = getImg(l.images && l.images[0])
            return (
              <div key={l._id} style={{
                background: 'white', borderRadius: '14px', padding: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap'
              }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                  {imgUrl ? (
                    <img src={imgUrl} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛍️</div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '160px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{l.title}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0' }}>
                    R {Number(l.price).toLocaleString()} • by {l.user?.name || 'Unknown'}
                  </p>
                </div>

                <button onClick={function() { deleteListing(l._id) }} style={{
                  background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                  padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
                }}>Delete</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}