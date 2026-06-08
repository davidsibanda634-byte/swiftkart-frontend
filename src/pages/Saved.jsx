import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ListingCard from '../components/cards/ListingCard'
import api from '../services/api'

export default function Saved() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const key = `sk_saved_${user._id}`
    const ids = JSON.parse(localStorage.getItem(key) || '[]')
    setSavedIds(ids)
    if (ids.length === 0) { setLoading(false); return }
    api.get('/listings').then(res => {
      const saved = res.data.filter(l => ids.includes(l._id))
      setListings(saved)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const handleToggleSave = (id, isSaved) => {
    if (!isSaved) {
      setListings(prev => prev.filter(l => l._id !== id))
      setSavedIds(prev => prev.filter(sid => sid !== id))
    }
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 20px 60px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{
        background: 'transparent', border: '1px solid #e2e8f0',
        padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
        color: '#374151', cursor: 'pointer', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>← Back</button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#08162F', marginBottom: '4px' }}>
          ❤️ Saved Items
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '13px' }}>
          {listings.length} saved listing{listings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Loading...</p>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🤍</p>
          <p style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            No saved items yet
          </p>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
            Tap the heart on any listing to save it for later
          </p>
          <button onClick={() => navigate('/marketplace')} style={{
            backgroundColor: '#08162F', color: 'white',
            border: 'none', padding: '12px 28px',
            borderRadius: '10px', fontWeight: '700',
            fontSize: '14px', cursor: 'pointer'
          }}>Browse Marketplace</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {listings.map(l => (
            <ListingCard
              key={l._id}
              listing={l}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  )
}