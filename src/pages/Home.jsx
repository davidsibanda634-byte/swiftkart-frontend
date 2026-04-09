import Hero from '../components/Hero'
import ListingCard from '../components/cards/ListingCard'
import ServiceCard from '../components/cards/ServiceCard'
import JobCard from '../components/cards/JobCard'
import EventCard from '../components/cards/EventCard'
import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Home() {
  const [listings, setListings] = useState([])
  const [services, setServices] = useState([])
  const [jobs, setJobs] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    api.get('/listings').then(r => setListings(r.data.slice(0, 4))).catch(() => {})
    api.get('/services').then(r => setServices(r.data.slice(0, 3))).catch(() => {})
    api.get('/jobs').then(r => setJobs(r.data.slice(0, 2))).catch(() => {})
    api.get('/events').then(r => setEvents(r.data.slice(0, 2))).catch(() => {})
  }, [])

  const sectionStyle = { marginBottom: '40px' }

  const sectionHeader = {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px'
  }

  const sectionTitle = { fontSize: '20px', fontWeight: '700', color: '#111827' }
  const viewAll = { color: '#1a56db', fontSize: '13px', fontWeight: '500' }
  const empty = { color: '#9ca3af', fontSize: '14px' }

  return (
    <div>
      <Hero />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Marketplace */}
        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Marketplace</h2>
            <Link to="/marketplace" style={viewAll}>View All ›</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '12px'
          }}>
            {listings.length > 0
              ? listings.map(l => <ListingCard key={l._id} listing={l} />)
              : <p style={empty}>No listings yet.</p>}
          </div>
        </section>

        {/* Services */}
        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Student Services</h2>
            <Link to="/services" style={viewAll}>View All ›</Link>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {['All', 'Tutoring', 'Design', 'Tech Help', 'Photography'].map(tab => (
              <button key={tab} style={{
                padding: '5px 14px', borderRadius: '20px',
                border: '1px solid #d1d5db',
                backgroundColor: tab === 'All' ? '#1a56db' : 'white',
                color: tab === 'All' ? 'white' : '#374151',
                fontSize: '12px', fontWeight: '500', cursor: 'pointer'
              }}>{tab}</button>
            ))}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '12px'
          }}>
            {services.length > 0
              ? services.map(s => <ServiceCard key={s._id} service={s} />)
              : <p style={empty}>No services yet.</p>}
          </div>
        </section>

        {/* Jobs */}
        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Campus Jobs</h2>
            <Link to="/jobs" style={viewAll}>View All ›</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {jobs.length > 0
              ? jobs.map(j => <JobCard key={j._id} job={j} />)
              : <p style={empty}>No jobs yet.</p>}
          </div>
        </section>

        {/* Events */}
        <section style={sectionStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Upcoming Events</h2>
            <Link to="/events" style={viewAll}>View All ›</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {events.length > 0
              ? events.map(e => <EventCard key={e._id} event={e} />)
              : <p style={empty}>No events yet.</p>}
          </div>
        </section>

      </div>
    </div>
  )
}