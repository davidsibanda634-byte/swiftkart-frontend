import { useState, useEffect } from 'react'
import ListingCard from '../components/cards/ListingCard'
import api from '../services/api'

const CATEGORIES = ['All', 'Fashion', 'Cosmetics & Hair', 'Mobile & Accessories', 'Vehicles', 'Furniture', 'Electronics', 'Food', 'Other']

const CATEGORY_ICONS = {
  'All': '🛍️',
  'Fashion': '👗',
  'Cosmetics & Hair': '💄',
  'Mobile & Accessories': '📱',
  'Vehicles': '🚗',
  'Furniture': '🛋️',
  'Electronics': '💻',
  'Food': '🍔',
  'Other': '📦'
}

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchListings = async (cat = category) => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (city) params.city = city
      if (cat && cat !== 'All') params.category = cat
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

  const handleCategoryClick = (cat) => {
    setCategory(cat)
    fetchListings(cat)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827' }}>Marketplace</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Buy and sell items within your campus community
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
        <button onClick={() => fetchListings()} style={{
          backgroundColor: '#1a56db', color: 'white',
          border: 'none', padding: '11px 24px',
          borderRadius: '8px', fontWeight: '600',
          fontSize: '14px', cursor: 'pointer'
        }}>Search</button>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex', gap: '8px',
        marginBottom: '28px', flexWrap: 'wrap'
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            style={{
              padding: '8px 16px', borderRadius: '20px',
              border: '1px solid #d1d5db',
              backgroundColor: category === cat ? '#1a56db' : 'white',
              color: category === cat ? 'white' : '#374151',
              fontSize: '13px', fontWeight: '500',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Results Count */}
      {!loading && (
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
          {listings.length} listing{listings.length !== 1 ? 's' : ''} found
          {category !== 'All' ? ` in ${category}` : ''}
        </p>
      )}

      {/* Results */}
      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Loading listings...</p>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>No listings found.</p>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '8px' }}>
            Try a different category or search term
          </p>
        </div>
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