import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingCard from '../components/cards/ListingCard'
import ServiceCard from '../components/cards/ServiceCard'
import JobCard from '../components/cards/JobCard'
import EventCard from '../components/cards/EventCard'
import api from '../services/api'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState({ listings: [], services: [], jobs: [], events: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!query) return
    const fetchResults = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/search?q=${query}`)
        setResults(data)
      } catch {
        setResults({ listings: [], services: [], jobs: [], events: [] })
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  const total = results.listings.length + results.services.length + results.jobs.length + results.events.length

  const tabs = [
    { key: 'all', label: 'All', count: total },
    { key: 'listings', label: '🛍️ Items', count: results.listings.length },
    { key: 'services', label: '🧑‍💼 Services', count: results.services.length },
    { key: 'jobs', label: '💼 Jobs', count: results.jobs.length },
    { key: 'events', label: '🎉 Events', count: results.events.length },
  ]

  const sectionTitle = (title) => (
    <h3 style={{
      fontSize: '16px',
      fontWeight: '700',
      color: '#374151',
      marginBottom: '14px',
      marginTop: '24px',
      paddingBottom: '8px',
      borderBottom: '1px solid #e5e7eb'
    }}>{title}</h3>
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
          Search Results
        </h1>
        {query && (
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            {loading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''} for `}
            {!loading && <strong style={{ color: '#111827' }}>"{query}"</strong>}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              backgroundColor: activeTab === tab.key ? '#1a56db' : 'white',
              color: activeTab === tab.key ? 'white' : '#374151',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
            <span style={{
              marginLeft: '6px',
              backgroundColor: activeTab === tab.key ? 'rgba(255,255,255,0.3)' : '#f3f4f6',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              padding: '1px 7px',
              borderRadius: '10px',
              fontSize: '11px'
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px 0' }}>
          Searching across all categories...
        </p>
      )}

      {/* No Results */}
      {!loading && total === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            No results found
          </p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Try searching with different keywords
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && total > 0 && (
        <div>
          {/* Listings */}
          {(activeTab === 'all' || activeTab === 'listings') && results.listings.length > 0 && (
            <div>
              {activeTab === 'all' && sectionTitle('🛍️ Marketplace Items')}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px'
              }}>
                {results.listings.map(l => <ListingCard key={l._id} listing={l} />)}
              </div>
            </div>
          )}

          {/* Services */}
          {(activeTab === 'all' || activeTab === 'services') && results.services.length > 0 && (
            <div>
              {activeTab === 'all' && sectionTitle('🧑‍💼 Services')}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '16px'
              }}>
                {results.services.map(s => <ServiceCard key={s._id} service={s} />)}
              </div>
            </div>
          )}

          {/* Jobs */}
          {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
            <div>
              {activeTab === 'all' && sectionTitle('💼 Jobs')}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {results.jobs.map(j => <JobCard key={j._id} job={j} />)}
              </div>
            </div>
          )}

          {/* Events */}
          {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
            <div>
              {activeTab === 'all' && sectionTitle('🎉 Events')}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {results.events.map(e => <EventCard key={e._id} event={e} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}