import { useState, useEffect } from 'react'
import ServiceCard from '../components/cards/ServiceCard'
import api from '../services/api'

const CATEGORIES = ['All', 'Tutoring', 'Design', 'Tech Help', 'Photography', 'Writing', 'Other']

export default function Services() {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/services')
        setServices(data)
      } catch {
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const filtered = services.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase())
    const matchTab = activeTab === 'All' || s.category === activeTab
    return matchSearch && matchTab
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827' }}>Student Services</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Find skilled students offering services on your campus
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search services..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '11px 16px',
          border: '1px solid #d1d5db', borderRadius: '8px',
          fontSize: '14px', outline: 'none',
          marginBottom: '16px', boxSizing: 'border-box'
        }}
      />

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {CATEGORIES.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '7px 18px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              backgroundColor: activeTab === tab ? '#1a56db' : 'white',
              color: activeTab === tab ? 'white' : '#374151',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >{tab}</button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Loading services...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>No services found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {filtered.map(s => <ServiceCard key={s._id} service={s} />)}
        </div>
      )}
    </div>
  )
}