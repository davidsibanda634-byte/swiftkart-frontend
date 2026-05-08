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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-home { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .sk-trust-strip {
          background: linear-gradient(135deg, #0f2167, #1e4db7);
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .sk-trust-item {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,0.88);
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
        .sk-content {
          max-width: 1240px;
          margin: 0 auto;
          padding: 36px 20px 60px;
        }
        .sk-section { margin-bottom: 48px; }
        .sk-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .sk-section-left { display: flex; align-items: center; gap: 10px; }
        .sk-section-dot {
          width: 6px;
          height: 28px;
          background: linear-gradient(180deg, #1e4db7, #10b981);
          border-radius: 3px;
          flex-shrink: 0;
        }
        .sk-section-title {
          font-size: 21px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
        }
        .sk-section-sub {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 500;
          margin-top: 1px;
        }
        .sk-view-all {
          color: #1e4db7;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 7px 16px;
          border-radius: 20px;
          border: 1.5px solid #c7d7ff;
          transition: all 0.2s ease;
          background: white;
        }
        .sk-view-all:hover {
          background: #eff6ff;
          border-color: #1e4db7;
        }
        .sk-listing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .sk-service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .sk-two-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }
        .sk-empty {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          padding: 32px;
          background: white;
          border-radius: 14px;
          text-align: center;
          border: 2px dashed #e2e8f0;
        }
        .sk-filter-pill {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #4b5563;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .sk-filter-pill.active,
        .sk-filter-pill:hover {
          background: linear-gradient(135deg, #1a3a8f, #1e4db7);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(26,58,143,0.25);
        }
        .sk-service-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }

        @media (max-width: 1024px) {
          .sk-listing-grid { grid-template-columns: repeat(3, 1fr); }
          .sk-service-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .sk-listing-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .sk-service-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .sk-two-grid { grid-template-columns: 1fr; gap: 12px; }
          .sk-content { padding: 24px 14px 60px; }
          .sk-trust-strip { gap: 16px; padding: 10px 16px; }
          .sk-section-title { font-size: 17px; }
        }
        @media (max-width: 480px) {
          .sk-listing-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .sk-service-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>

      <div className="sk-home">
        <Hero />

        <div className="sk-trust-strip">
          {[
            { icon: '✔', label: 'Verified Vendors' },
            { icon: '💬', label: 'WhatsApp Support' },
            { icon: '⚡', label: 'Fast Delivery' },
            { icon: '🔒', label: 'Safe & Secure' },
          ].map(item => (
            <div key={item.label} className="sk-trust-item">
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>

        <div className="sk-content">

          <section className="sk-section">
            <div className="sk-section-header">
              <div className="sk-section-left">
                <div className="sk-section-dot" />
                <div>
                  <div className="sk-section-title">🛍️ Marketplace</div>
                  <div className="sk-section-sub">Fresh listings from campus sellers</div>
                </div>
              </div>
              <Link to="/marketplace" className="sk-view-all">View All →</Link>
            </div>
            <div className="sk-listing-grid">
              {listings.length > 0
                ? listings.map(l => <ListingCard key={l._id} listing={l} />)
                : <p className="sk-empty">No listings yet. Be the first to post!</p>}
            </div>
          </section>

          <section className="sk-section">
            <div className="sk-section-header">
              <div className="sk-section-left">
                <div className="sk-section-dot" style={{ background: 'linear-gradient(180deg, #7c3aed, #a855f7)' }} />
                <div>
                  <div className="sk-section-title">🧑‍💼 Student Services</div>
                  <div className="sk-section-sub">Skills & services offered by students</div>
                </div>
              </div>
              <Link to="/services" className="sk-view-all">View All →</Link>
            </div>
            <div className="sk-service-filters">
              {['All', 'Tutoring', 'Design', 'Tech Help', 'Photography'].map(tab => (
                <button key={tab} className={`sk-filter-pill ${tab === 'All' ? 'active' : ''}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="sk-service-grid">
              {services.length > 0
                ? services.map(s => <ServiceCard key={s._id} service={s} />)
                : <p className="sk-empty">No services yet.</p>}
            </div>
          </section>

          <section className="sk-section">
            <div className="sk-section-header">
              <div className="sk-section-left">
                <div className="sk-section-dot" style={{ background: 'linear-gradient(180deg, #f59e0b, #d97706)' }} />
                <div>
                  <div className="sk-section-title">💼 Campus Jobs</div>
                  <div className="sk-section-sub">Part-time & full-time opportunities</div>
                </div>
              </div>
              <Link to="/jobs" className="sk-view-all">View All →</Link>
            </div>
            <div className="sk-two-grid">
              {jobs.length > 0
                ? jobs.map(j => <JobCard key={j._id} job={j} />)
                : <p className="sk-empty">No jobs posted yet.</p>}
            </div>
          </section>

          <section className="sk-section">
            <div className="sk-section-header">
              <div className="sk-section-left">
                <div className="sk-section-dot" style={{ background: 'linear-gradient(180deg, #ef4444, #f97316)' }} />
                <div>
                  <div className="sk-section-title">🎉 Upcoming Events</div>
                  <div className="sk-section-sub">Don't miss what's happening on campus</div>
                </div>
              </div>
              <Link to="/events" className="sk-view-all">View All →</Link>
            </div>
            <div className="sk-two-grid">
              {events.length > 0
                ? events.map(e => <EventCard key={e._id} event={e} />)
                : <p className="sk-empty">No events posted yet.</p>}
            </div>
          </section>

        </div>
      </div>
    </>
  )
}