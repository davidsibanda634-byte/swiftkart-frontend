import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import ListingCard from '../components/cards/ListingCard'
import ServiceCard from '../components/cards/ServiceCard'
import JobCard from '../components/cards/JobCard'
import EventCard from '../components/cards/EventCard'

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [services, setServices] = useState([])
  const [jobs, setJobs] = useState([])
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState('listings')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [l, s, j, e] = await Promise.all([
          api.get('/listings'),
          api.get('/services'),
          api.get('/jobs'),
          api.get('/events'),
        ])

        const userListings = l.data.filter(i => i.user?._id === id || i.user === id)
        const userServices = s.data.filter(i => i.user?._id === id || i.user === id)
        const userJobs = j.data.filter(i => i.user?._id === id || i.user === id)
        const userEvents = e.data.filter(i => i.user?._id === id || i.user === id)

        setListings(userListings)
        setServices(userServices)
        setJobs(userJobs)
        setEvents(userEvents)

        // Get user info from first listing
        const firstItem = userListings[0] || userServices[0] || userJobs[0] || userEvents[0]
        if (firstItem?.user) setUser(firstItem.user)

      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const tabs = [
    { key: 'listings', label: '🛍️ Items', count: listings.length },
    { key: 'services', label: '🧑‍💼 Services', count: services.length },
    { key: 'jobs', label: '💼 Jobs', count: jobs.length },
    { key: 'events', label: '🎉 Events', count: events.length },
  ]

  const total = listings.length + services.length + jobs.length + events.length

  if (loading) return (
    <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>Loading profile...</p>
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Back Button */}
      <button onClick={() => navigate(-1)} style={{
        backgroundColor: 'transparent',
        border: '1px solid #d1d5db',
        padding: '8px 16px', borderRadius: '8px',
        fontSize: '13px', color: '#374151',
        cursor: 'pointer', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>← Back</button>

      {/* Profile Header */}
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '28px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '20px'
      }}>
        {/* Avatar */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          backgroundColor: '#1a56db', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', color: 'white', fontWeight: '700',
          flexShrink: 0
        }}>
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>

        {/* Info */}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
            {user?.name || 'SwiftKart User'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
            📱 {user?.phone || 'No phone listed'}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>
            {total} listing{total !== 1 ? 's' : ''} posted
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '8px 18px', borderRadius: '20px',
            border: '1px solid #d1d5db',
            backgroundColor: activeTab === tab.key ? '#1a56db' : 'white',
            color: activeTab === tab.key ? 'white' : '#374151',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer'
          }}>
            {tab.label}
            <span style={{
              marginLeft: '6px',
              backgroundColor: activeTab === tab.key ? 'rgba(255,255,255,0.3)' : '#f3f4f6',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              padding: '1px 7px', borderRadius: '10px', fontSize: '11px'
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'listings' && (
        listings.length === 0
          ? <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>No items posted yet.</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {listings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
      )}

      {activeTab === 'services' && (
        services.length === 0
          ? <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>No services posted yet.</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {services.map(s => <ServiceCard key={s._id} service={s} />)}
            </div>
      )}

      {activeTab === 'jobs' && (
        jobs.length === 0
          ? <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>No jobs posted yet.</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {jobs.map(j => <JobCard key={j._id} job={j} />)}
            </div>
      )}

      {activeTab === 'events' && (
        events.length === 0
          ? <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>No events posted yet.</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {events.map(e => <EventCard key={e._id} event={e} />)}
            </div>
      )}

    </div>
  )
}