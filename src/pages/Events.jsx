import { useState, useEffect } from 'react'
import EventCard from '../components/cards/EventCard'
import api from '../services/api'

export default function Events() {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/events')
        setEvents(data)
      } catch {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827' }}>Upcoming Events</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Discover workshops, meetups and campus activities
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '11px 16px',
          border: '1px solid #d1d5db', borderRadius: '8px',
          fontSize: '14px', outline: 'none',
          marginBottom: '24px', boxSizing: 'border-box'
        }}
      />

      {/* Results */}
      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Loading events...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>No events found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filtered.map(e => <EventCard key={e._id} event={e} />)}
        </div>
      )}
    </div>
  )
}