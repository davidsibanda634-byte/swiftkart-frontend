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

  const total = listings.length + services.length + jobs.length + events.length

  const tabs = [
    { key: 'listings', label: '🛍️ Items', count: listings.length, color: '#00C896' },
    { key: 'services', label: '🧑‍💼 Services', count: services.length, color: '#7c3aed' },
    { key: 'jobs', label: '💼 Jobs', count: jobs.length, color: '#d97706' },
    { key: 'events', label: '🎉 Events', count: events.length, color: '#be185d' },
  ]

  // Member since — fallback to oldest item date if user.createdAt unavailable
  const allItems = [...listings, ...services, ...jobs, ...events]
  const oldestDate = allItems.length > 0
    ? allItems.reduce((oldest, item) => new Date(item.createdAt) < new Date(oldest) ? item.createdAt : oldest, allItems[0].createdAt)
    : null
  const memberSince = user?.createdAt || oldestDate

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .up-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .up-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 24px 60px; }
        .up-header-inner { max-width: 1000px; margin: 0 auto; }
        .up-back {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex;
          align-items: center; gap: 5px; margin-bottom: 24px; transition: all 0.2s;
        }
        .up-back:hover { background: rgba(255,255,255,0.18); color: white; }

        .up-profile-card {
          background: white; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          padding: 28px; margin-top: -36px; position: relative; z-index: 2;
          display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
        }

        .up-avatar {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, #08162F, #1e3a8a);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; color: white; font-weight: 800; flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(8,22,47,0.3);
        }

        .up-info { flex: 1; min-width: 0; }
        .up-name-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
        .up-name { font-size: 22px; font-weight: 800; color: #111827; margin: 0; }
        .up-verified-badge {
          display: inline-flex; align-items: center; gap: 4px; background: #ecfdf5;
          color: #059669; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;
        }

        .up-meta-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .up-meta-item { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 5px; }

        .up-stats { display: flex; gap: 10px; flex-shrink: 0; }
        .up-stat-box {
          background: #f8fafc; border-radius: 12px; padding: 10px 18px; text-align: center;
          border: 1px solid #f1f5f9; min-width: 70px;
        }
        .up-stat-num { font-size: 19px; font-weight: 800; color: #08162F; }
        .up-stat-label { font-size: 10.5px; color: #9ca3af; font-weight: 600; margin-top: 1px; }

        .up-content { max-width: 1000px; margin: 0 auto; padding: 24px 20px 60px; }

        .up-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .up-tab {
          padding: 8px 16px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: white;
          color: #4b5563; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.2s;
          font-family: inherit; display: flex; align-items: center; gap: 6px;
        }
        .up-tab.active { color: white; border-color: transparent; box-shadow: 0 3px 10px rgba(0,0,0,0.15); }
        .up-tab-count {
          font-size: 10.5px; padding: 1px 7px; border-radius: 10px; font-weight: 800;
          background: rgba(0,0,0,0.08);
        }
        .up-tab.active .up-tab-count { background: rgba(255,255,255,0.25); color: white; }

        .up-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .up-grid-services { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .up-grid-wide { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        .up-empty {
          text-align: center; padding: 50px 20px; background: white; border-radius: 16px;
          border: 2px dashed #e2e8f0; grid-column: 1 / -1;
        }
        .up-empty-icon { font-size: 44px; margin-bottom: 10px; }
        .up-empty-text { font-size: 14px; color: #9ca3af; }

        .up-loading { text-align: center; padding: 100px 0; color: #9ca3af; font-family: 'Plus Jakarta Sans', sans-serif; }

        @media (max-width: 768px) {
          .up-header { padding: 20px 16px 50px; }
          .up-content { padding: 20px 14px 60px; }
          .up-profile-card { padding: 20px; flex-direction: column; align-items: flex-start; }
          .up-stats { width: 100%; }
          .up-stat-box { flex: 1; }
          .up-grid, .up-grid-services { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .up-grid-wide { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>

      <div className="up-wrap">
        <div className="up-header">
          <div className="up-header-inner">
            <button className="up-back" onClick={() => navigate(-1)}>← Back</button>
          </div>
        </div>

        <div className="up-content" style={{ paddingTop: 0 }}>
          <div className="up-profile-card" style={{ maxWidth: '1000px', margin: '-36px auto 0' }}>
            <div className="up-avatar">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>

            <div className="up-info">
              <div className="up-name-row">
                <h1 className="up-name">{user?.name || 'Scalablenexus User'}</h1>
                <span className="up-verified-badge">✔ Verified Seller</span>
              </div>
              <div className="up-meta-row">
                {user?.phone && <span className="up-meta-item">📱 {user.phone}</span>}
                {user?.location?.city && (
                  <span className="up-meta-item">
                    📍 {user.location.city}{user.location?.area ? ', ' + user.location.area : ''}
                  </span>
                )}
                {memberSince && (
                  <span className="up-meta-item">
                    🗓️ Member since {new Date(memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            <div className="up-stats">
              <div className="up-stat-box">
                <div className="up-stat-num">{total}</div>
                <div className="up-stat-label">Total Posts</div>
              </div>
              <div className="up-stat-box">
                <div className="up-stat-num">{listings.length}</div>
                <div className="up-stat-label">Items</div>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="up-loading">Loading profile...</p>
          ) : (
            <>
              <div className="up-tabs" style={{ marginTop: '24px' }}>
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    className={'up-tab' + (activeTab === tab.key ? ' active' : '')}
                    style={activeTab === tab.key ? { background: tab.color } : {}}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                    <span className="up-tab-count">{tab.count}</span>
                  </button>
                ))}
              </div>

              {activeTab === 'listings' && (
                <div className="up-grid">
                  {listings.length === 0 ? (
                    <div className="up-empty"><div className="up-empty-icon">🛍️</div><p className="up-empty-text">No items posted yet</p></div>
                  ) : listings.map(l => <ListingCard key={l._id} listing={l} />)}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="up-grid-services">
                  {services.length === 0 ? (
                    <div className="up-empty"><div className="up-empty-icon">🧑‍💼</div><p className="up-empty-text">No services posted yet</p></div>
                  ) : services.map(s => <ServiceCard key={s._id} service={s} />)}
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="up-grid-wide">
                  {jobs.length === 0 ? (
                    <div className="up-empty"><div className="up-empty-icon">💼</div><p className="up-empty-text">No jobs posted yet</p></div>
                  ) : jobs.map(j => <JobCard key={j._id} job={j} />)}
                </div>
              )}

              {activeTab === 'events' && (
                <div className="up-grid-wide">
                  {events.length === 0 ? (
                    <div className="up-empty"><div className="up-empty-icon">🎉</div><p className="up-empty-text">No events posted yet</p></div>
                  ) : events.map(e => <EventCard key={e._id} event={e} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}