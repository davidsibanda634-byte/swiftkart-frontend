import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function MyListings() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [listings, setListings] = useState([])
  const [services, setServices] = useState([])
  const [jobs, setJobs] = useState([])
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState('listings')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [l, s, j, e] = await Promise.all([
        api.get('/listings'),
        api.get('/services'),
        api.get('/jobs'),
        api.get('/events'),
      ])
      setListings(l.data.filter(i => i.user?._id === user._id || i.user === user._id))
      setServices(s.data.filter(i => i.user?._id === user._id || i.user === user._id))
      setJobs(j.data.filter(i => i.user?._id === user._id || i.user === user._id))
      setEvents(e.data.filter(i => i.user?._id === user._id || i.user === user._id))
    } catch {}
    finally { setLoading(false) }
  }

  const getImageUrl = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    return `https://swiftkart2-backend.onrender.com/${img.replace(/\\/g, '/')}`
  }

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await api.delete(`/listings/${id}`)
      setListings(listings.filter(l => l._id !== id))
    } catch { alert('Failed to delete listing.') }
  }

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return
    try {
      await api.delete(`/services/${id}`)
      setServices(services.filter(s => s._id !== id))
    } catch { alert('Failed to delete service.') }
  }

  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await api.delete(`/jobs/${id}`)
      setJobs(jobs.filter(j => j._id !== id))
    } catch { alert('Failed to delete job.') }
  }

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      setEvents(events.filter(e => e._id !== id))
    } catch { alert('Failed to delete event.') }
  }

  const tabs = [
    { key: 'listings', label: '🛍️ Items', count: listings.length },
    { key: 'services', label: '🧑‍💼 Services', count: services.length },
    { key: 'jobs', label: '💼 Jobs', count: jobs.length },
    { key: 'events', label: '🎉 Events', count: events.length },
  ]

  const deleteBtn = {
    backgroundColor: '#fef2f2', color: '#dc2626',
    border: '1px solid #fecaca', padding: '6px 14px',
    borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
  }

  const editBtn = {
    backgroundColor: '#eff6ff', color: '#1a56db',
    border: '1px solid #bfdbfe', padding: '6px 14px',
    borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
  }

  const renderItems = (items, type) => {
    if (items.length === 0) return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
        <p style={{ fontSize: '16px', marginBottom: '12px' }}>No {type} posted yet.</p>
        <button onClick={() => navigate('/create')} style={{
          backgroundColor: '#1a56db', color: 'white',
          border: 'none', padding: '10px 24px',
          borderRadius: '8px', fontWeight: '600',
          fontSize: '14px', cursor: 'pointer'
        }}>+ Post One Now</button>
      </div>
    )

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(item => (
          <div key={item._id} style={{
            backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '16px',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: '12px'
          }}>
            {/* Image for listings */}
            {type === 'listings' && item.images?.[0] && (
              <img
                src={getImageUrl(item.images[0])}
                alt={item.title}
                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
              />
            )}

            {/* Info */}
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', fontSize: '15px', color: '#111827' }}>{item.title}</p>
              {type === 'listings' && (
                <p style={{ color: '#1a56db', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>${item.price}</p>
              )}
              {type === 'services' && item.pricePerHour && (
                <p style={{ color: '#1a56db', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>${item.pricePerHour}/hr</p>
              )}
              {type === 'jobs' && item.company && (
                <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>{item.company}</p>
              )}
              {type === 'events' && item.date && (
                <p style={{ color: '#1a56db', fontSize: '13px', marginTop: '2px' }}>
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
              <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
                {item.location?.city}{item.location?.area ? `, ${item.location.area}` : ''}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }}>
                Posted {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Edit only for listings */}
              {type === 'listings' && (
                <button
                  onClick={() => navigate(`/listings/edit/${item._id}`)}
                  style={editBtn}
                >✏️ Edit</button>
              )}

              {/* Delete for all types */}
              {type === 'listings' && (
                <button onClick={() => deleteListing(item._id)} style={deleteBtn}>🗑️ Delete</button>
              )}
              {type === 'services' && (
                <button onClick={() => deleteService(item._id)} style={deleteBtn}>🗑️ Delete</button>
              )}
              {type === 'jobs' && (
                <button onClick={() => deleteJob(item._id)} style={deleteBtn}>🗑️ Delete</button>
              )}
              {type === 'events' && (
                <button onClick={() => deleteEvent(item._id)} style={deleteBtn}>🗑️ Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const currentItems = { listings, services, jobs, events }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Back Button */}
      <button onClick={() => navigate('/')} style={{
        backgroundColor: 'transparent',
        border: '1px solid #d1d5db',
        padding: '8px 16px', borderRadius: '8px',
        fontSize: '13px', color: '#374151',
        cursor: 'pointer', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>← Back to Home</button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>My Listings</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Manage everything you have posted</p>
        </div>
        <button onClick={() => navigate('/create')} style={{
          backgroundColor: '#1a56db', color: 'white',
          border: 'none', padding: '10px 20px',
          borderRadius: '8px', fontWeight: '600',
          fontSize: '14px', cursor: 'pointer'
        }}>+ New Post</button>
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
      {loading
        ? <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px 0' }}>Loading your listings...</p>
        : renderItems(currentItems[activeTab], activeTab)
      }
    </div>
  )
}