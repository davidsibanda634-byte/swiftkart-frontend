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
  const [accommodations, setAccommodations] = useState([])
  const [activeTab, setActiveTab] = useState('listings')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [l, s, j, e, a] = await Promise.all([
        api.get('/listings'),
        api.get('/services'),
        api.get('/jobs'),
        api.get('/events'),
        api.get('/accommodations'),
      ])
      const mine = (arr) => arr.data.filter(i => i.user?._id === user._id || i.user === user._id)
      setListings(mine(l))
      setServices(mine(s))
      setJobs(mine(j))
      setEvents(mine(e))
      setAccommodations(mine(a))
    } catch {} finally { setLoading(false) }
  }

  const getImageUrl = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  const deleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return
    setDeletingId(id)
    try {
      await api.delete('/' + type + '/' + id)
      if (type === 'listings') setListings(listings.filter(x => x._id !== id))
      if (type === 'services') setServices(services.filter(x => x._id !== id))
      if (type === 'jobs') setJobs(jobs.filter(x => x._id !== id))
      if (type === 'events') setEvents(events.filter(x => x._id !== id))
      if (type === 'accommodations') setAccommodations(accommodations.filter(x => x._id !== id))
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const total = listings.length + services.length + jobs.length + events.length + accommodations.length

  const tabs = [
    { key: 'listings', label: '🛍️ Items', count: listings.length, color: '#00C896' },
    { key: 'services', label: '🧑‍💼 Services', count: services.length, color: '#7c3aed' },
    { key: 'jobs', label: '💼 Jobs', count: jobs.length, color: '#d97706' },
    { key: 'events', label: '🎉 Events', count: events.length, color: '#be185d' },
    { key: 'accommodations', label: '🏠 Properties', count: accommodations.length, color: '#0f4c81' },
  ]

  const currentItems = { listings, services, jobs, events, accommodations }
  const currentTabMeta = tabs.find(t => t.key === activeTab)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ml-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .ml-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 24px 32px; }
        .ml-header-inner { max-width: 900px; margin: 0 auto; }
        .ml-back {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex;
          align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s;
        }
        .ml-back:hover { background: rgba(255,255,255,0.18); color: white; }

        .ml-header-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; }
        .ml-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .ml-sub { color: rgba(255,255,255,0.55); font-size: 13.5px; margin: 0; }

        .ml-new-btn {
          background: linear-gradient(135deg, #00C896, #059669); color: white; border: none;
          padding: 11px 22px; border-radius: 12px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0,200,150,0.35); display: flex; align-items: center; gap: 6px;
        }
        .ml-new-btn:hover { transform: translateY(-1px); }

        .ml-stats-row { display: flex; gap: 10px; margin-top: 22px; flex-wrap: wrap; }
        .ml-stat-card {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px; padding: 12px 18px; flex: 1; min-width: 80px;
        }
        .ml-stat-num { font-size: 20px; font-weight: 800; color: white; }
        .ml-stat-label { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; margin-top: 2px; }

        .ml-content { max-width: 900px; margin: 0 auto; padding: 20px 20px 60px; }

        .ml-tabs {
          display: flex; gap: 8px; margin-bottom: 20px;
          overflow-x: auto; scrollbar-width: none; padding-bottom: 2px;
        }
        .ml-tabs::-webkit-scrollbar { display: none; }
        .ml-tab {
          padding: 8px 16px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: white;
          color: #4b5563; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.2s;
          font-family: inherit; display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        .ml-tab.active { color: white; border-color: transparent; box-shadow: 0 3px 10px rgba(0,0,0,0.15); }
        .ml-tab-count {
          font-size: 10.5px; padding: 1px 7px; border-radius: 10px; font-weight: 800;
          background: rgba(0,0,0,0.08);
        }
        .ml-tab.active .ml-tab-count { background: rgba(255,255,255,0.25); color: white; }

        .ml-item-card {
          background: white; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          padding: 16px; margin-bottom: 12px; display: flex; gap: 14px;
          border: 1px solid #f1f5f9; transition: box-shadow 0.2s;
        }
        .ml-item-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); }

        .ml-item-img { width: 76px; height: 76px; object-fit: cover; border-radius: 12px; flex-shrink: 0; }
        .ml-item-img-placeholder {
          width: 76px; height: 76px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0); display: flex;
          align-items: center; justify-content: center; font-size: 28px;
        }

        .ml-item-info { flex: 1; min-width: 0; }
        .ml-item-title { font-weight: 700; font-size: 14.5px; color: #111827; margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ml-item-price { font-weight: 800; font-size: 15px; color: #08162F; margin: 0 0 4px; }
        .ml-item-meta { font-size: 12px; color: #9ca3af; margin: 0; }
        .ml-item-date { font-size: 11px; color: #c4c9d4; margin: 3px 0 0; }

        .ml-item-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
        .ml-edit-btn {
          background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; padding: 6px 14px;
          border-radius: 8px; font-size: 11.5px; font-weight: 700; cursor: pointer; white-space: nowrap;
          font-family: inherit; transition: all 0.2s;
        }
        .ml-edit-btn:hover { background: #dbeafe; }
        .ml-delete-btn {
          background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 6px 14px;
          border-radius: 8px; font-size: 11.5px; font-weight: 700; cursor: pointer; white-space: nowrap;
          font-family: inherit; transition: all 0.2s;
        }
        .ml-delete-btn:hover { background: #fee2e2; }
        .ml-delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ml-empty {
          text-align: center; padding: 60px 20px; background: white; border-radius: 16px;
          border: 2px dashed #e2e8f0;
        }
        .ml-empty-icon { font-size: 48px; margin-bottom: 14px; }
        .ml-empty-title { font-size: 16px; font-weight: 700; color: #374151; margin-bottom: 16px; }
        .ml-empty-btn {
          background: linear-gradient(135deg, #00C896, #059669); color: white; border: none;
          padding: 10px 24px; border-radius: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }

        .ml-skeleton {
          background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px;
          display: flex; gap: 14px; border: 1px solid #f1f5f9;
        }
        .ml-skel-box {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: ml-shimmer 1.4s infinite; border-radius: 8px;
        }
        @keyframes ml-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 600px) {
          .ml-header { padding: 20px 16px 24px; }
          .ml-content { padding: 16px 14px 60px; }
          .ml-item-card { flex-wrap: wrap; }
          .ml-item-actions { flex-direction: row; width: 100%; }
          .ml-edit-btn, .ml-delete-btn { flex: 1; }
          .ml-stats-row { gap: 8px; }
        }
      `}</style>

      <div className="ml-wrap">
        <div className="ml-header">
          <div className="ml-header-inner">
            <button className="ml-back" onClick={() => navigate('/')}>← Home</button>
            <div className="ml-header-top">
              <div>
                <h1 className="ml-title">📋 My Listings</h1>
                <p className="ml-sub">Manage everything you've posted on Scalablenexus</p>
              </div>
              <button className="ml-new-btn" onClick={() => navigate('/create')}>➕ New Post</button>
            </div>

            <div className="ml-stats-row">
              <div className="ml-stat-card">
                <div className="ml-stat-num">{total}</div>
                <div className="ml-stat-label">Total Posts</div>
              </div>
              <div className="ml-stat-card">
                <div className="ml-stat-num">{listings.length}</div>
                <div className="ml-stat-label">Items</div>
              </div>
              <div className="ml-stat-card">
                <div className="ml-stat-num">{services.length}</div>
                <div className="ml-stat-label">Services</div>
              </div>
              <div className="ml-stat-card">
                <div className="ml-stat-num">{jobs.length + events.length}</div>
                <div className="ml-stat-label">Jobs & Events</div>
              </div>
              <div className="ml-stat-card">
                <div className="ml-stat-num">{accommodations.length}</div>
                <div className="ml-stat-label">Properties</div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-content">
          <div className="ml-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={'ml-tab' + (activeTab === tab.key ? ' active' : '')}
                style={activeTab === tab.key ? { background: tab.color } : {}}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="ml-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="ml-skeleton">
                <div className="ml-skel-box" style={{ width: '76px', height: '76px' }} />
                <div style={{ flex: 1 }}>
                  <div className="ml-skel-box" style={{ height: '14px', width: '60%', marginBottom: '8px' }} />
                  <div className="ml-skel-box" style={{ height: '12px', width: '30%' }} />
                </div>
              </div>
            ))
          ) : currentItems[activeTab].length === 0 ? (
            <div className="ml-empty">
              <div className="ml-empty-icon">{currentTabMeta.label.split(' ')[0]}</div>
              <div className="ml-empty-title">No {activeTab} posted yet</div>
              <button className="ml-empty-btn" onClick={() => navigate('/create')}>+ Post One Now</button>
            </div>
          ) : (
            currentItems[activeTab].map(item => {
              const imgUrl = item.images?.[0] ? getImageUrl(item.images[0]) : null
              const placeholderIcons = { listings: '🛍️', services: '🧑‍💼', jobs: '💼', events: '🎉', accommodations: '🏠' }
              return (
                <div key={item._id} className="ml-item-card">
                  {imgUrl
                    ? <img className="ml-item-img" src={imgUrl} alt={item.title} />
                    : <div className="ml-item-img-placeholder">{placeholderIcons[activeTab]}</div>
                  }

                  <div className="ml-item-info">
                    <p className="ml-item-title">{item.title}</p>
                    {activeTab === 'listings' && <p className="ml-item-price">${item.price}</p>}
                    {activeTab === 'services' && item.pricePerHour && <p className="ml-item-price">${item.pricePerHour}/hr</p>}
                    {activeTab === 'jobs' && item.company && <p className="ml-item-meta">🏢 {item.company}</p>}
                    {activeTab === 'events' && item.date && (
                      <p className="ml-item-meta" style={{ color: '#be185d', fontWeight: 600 }}>
                        📅 {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                    {activeTab === 'accommodations' && (
                      <p className="ml-item-price" style={{ color: '#0f4c81' }}>${item.price?.toLocaleString()} <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>{item.priceType}</span></p>
                    )}
                    <p className="ml-item-meta">
                      📍 {item.location?.city}{item.location?.area ? ', ' + item.location.area : ''}
                    </p>
                    <p className="ml-item-date">Posted {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="ml-item-actions">
                    {activeTab === 'listings' && (
                      <button className="ml-edit-btn" onClick={() => navigate('/listings/edit/' + item._id)}>
                        ✏️ Edit
                      </button>
                    )}
                    <button
                      className="ml-delete-btn"
                      disabled={deletingId === item._id}
                      onClick={() => deleteItem(activeTab, item._id)}
                    >
                      {deletingId === item._id ? '...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}