import { useState, useEffect } from 'react'
import ListingCard from '../components/cards/ListingCard'
import api from '../services/api'

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (city) params.city = city
      const { data } = await api.get('/listings', { params })
      setListings(data)
    } catch {
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827' }}>Marketplace</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Buy and sell items within your campus community
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchListings()}
          style={{
            flex: 1, minWidth: '200px', padding: '11px 16px',
            border: '1px solid #d1d5db', borderRadius: '8px',
            fontSize: '14px', outline: 'none'
          }}
        />
        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchListings()}
          style={{
            width: '180px', padding: '11px 16px',
            border: '1px solid #d1d5db', borderRadius: '8px',
            fontSize: '14px', outline: 'none'
          }}
        />
        <button
          onClick={fetchListings}
          style={{
            backgroundColor: '#1a56db', color: 'white',
            border: 'none', padding: '11px 24px',
            borderRadius: '8px', fontWeight: '600',
            fontSize: '14px', cursor: 'pointer'
          }}
        >Search</button>
      </div>

      {/* Results */}
      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Loading listings...</p>
      ) : listings.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>No listings found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {listings.map(l => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}
    </div>
  )
}