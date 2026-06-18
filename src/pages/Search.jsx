import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ListingCard from '../components/cards/ListingCard'
import ServiceCard from '../components/cards/ServiceCard'
import JobCard from '../components/cards/JobCard'
import EventCard from '../components/cards/EventCard'
import api from '../services/api'

export default function Search() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState({ listings: [], services: [], jobs: [], events: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!query) { setLoading(false); return }
    const fetchResults = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/search?q=' + query)
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
    { key: 'all', label: '🔍 All', count: total, color: '#08162F' },
    { key: 'listings', label: '🛍️ Items', count: results.listings.length, color: '#00C896' },
    { key: 'services', label: '🧑‍💼 Services', count: results.services.length, color: '#7c3aed' },
    { key: 'jobs', label: '💼 Jobs', count: results.jobs.length, color: '#d97706' },
    { key: 'events', label: '🎉 Events', count: results.events.length, color: '#be185d' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sr-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .sr-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 24px 30px; }
        .sr-header-inner { max-width: 1240px; margin: 0 auto; }
        .sr-back {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex;
          align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s;
        }
        .sr-back:hover { background: rgba(255,255,255,0.18); color: white; }

        .sr-title { font-size: 24px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .sr-sub { color: rgba(255,255,255,0.6); font-size: 13.5px; margin: 0; }
        .sr-sub strong { color: white; }

        .sr-content { max-width: 1240px; margin: 0 auto; padding: 20px 20px 60px; }

        .sr-tabs { display: flex; gap: 8px; margin-bottom: 22px; flex-wrap: wrap; }
        .sr-tab {
          padding: 8px 16px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: white;
          color: #4b5563; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.2s;
          font-family: inherit; display: flex; align-items: center; gap: 6px;
        }
        .sr-tab.active { color: white; border-color: transparent; box-shadow: 0 3px 10px rgba(0,0,0,0.15); }
        .sr-tab-count {
          font-size: 10.5px; padding: 1px 7px; border-radius: 10px; font-weight: 800;
          background: rgba(0,0,0,0.08);
        }
        .sr-tab.active .sr-tab-count { background: rgba(255,255,255,0.25); color: white; }

        .sr-section-title {
          display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 800;
          color: #0f172a; margin: 28px 0 16px;
        }
        .sr-section-dot { width: 5px; height: 20px; border-radius: 3px; flex-shrink: 0; }

        .sr-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .sr-grid-wide { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        .sr-skeleton-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .sr-skeleton { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #f1f5f9; }
        .sr-skeleton-img {
          width: 100%; aspect-ratio: 4/5;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: sr-shimmer 1.4s infinite;
        }
        @keyframes sr-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .sr-empty {
          text-align: center; padding: 60px 20px; background: white; border-radius: 16px;
          border: 2px dashed #e2e8f0;
        }
        .sr-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .sr-empty-title { font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px; }
        .sr-empty-sub { font-size: 13px; color: #9ca3af; }
        .sr-empty-btn {
          margin-top: 16px; background: linear-gradient(135deg, #00C896, #059669); color: white; border: none;
          padding: 10px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: inherit;
        }

        @media (max-width: 1024px) { .sr-grid, .sr-skeleton-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .sr-grid, .sr-skeleton-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .sr-grid-wide { grid-template-columns: 1fr; gap: 12px; }
          .sr-header { padding: 20px 16px 24px; }
          .sr-content { padding: 16px 14px 60px; }
        }
      `}</style>

      <div className="sr-wrap">
        <div className="sr-header">
          <div className="sr-header-inner">
            <button className="sr-back" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="sr-title">Search Results</h1>
            {query && (
              <p className="sr-sub">
                {loading ? 'Searching…' : total + ' result' + (total !== 1 ? 's' : '') + ' for '}
                {!loading && <strong>"{query}"</strong>}
              </p>
            )}
          </div>
        </div>

        <div className="sr-content">
          <div className="sr-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={'sr-tab' + (activeTab === tab.key ? ' active' : '')}
                style={activeTab === tab.key ? { background: tab.color } : {}}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="sr-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="sr-skeleton-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sr-skeleton"><div className="sr-skeleton-img" /></div>
              ))}
            </div>
          )}

          {!loading && total === 0 && (
            <div className="sr-empty">
              <div className="sr-empty-icon">🔍</div>
              <div className="sr-empty-title">No results found</div>
              <div className="sr-empty-sub">Try searching with different keywords</div>
              <button className="sr-empty-btn" onClick={() => navigate('/marketplace')}>Browse Marketplace</button>
            </div>
          )}

          {!loading && total > 0 && (
            <>
              {(activeTab === 'all' || activeTab === 'listings') && results.listings.length > 0 && (
                <div>
                  {activeTab === 'all' && (
                    <div className="sr-section-title">
                      <div className="sr-section-dot" style={{ background: '#00C896' }} />
                      🛍️ Marketplace Items
                    </div>
                  )}
                  <div className="sr-grid">
                    {results.listings.map(l => <ListingCard key={l._id} listing={l} />)}
                  </div>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'services') && results.services.length > 0 && (
                <div>
                  {activeTab === 'all' && (
                    <div className="sr-section-title">
                      <div className="sr-section-dot" style={{ background: '#7c3aed' }} />
                      🧑‍💼 Services
                    </div>
                  )}
                  <div className="sr-grid">
                    {results.services.map(s => <ServiceCard key={s._id} service={s} />)}
                  </div>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
                <div>
                  {activeTab === 'all' && (
                    <div className="sr-section-title">
                      <div className="sr-section-dot" style={{ background: '#d97706' }} />
                      💼 Jobs
                    </div>
                  )}
                  <div className="sr-grid-wide">
                    {results.jobs.map(j => <JobCard key={j._id} job={j} />)}
                  </div>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
                <div>
                  {activeTab === 'all' && (
                    <div className="sr-section-title">
                      <div className="sr-section-dot" style={{ background: '#be185d' }} />
                      🎉 Events
                    </div>
                  )}
                  <div className="sr-grid-wide">
                    {results.events.map(e => <EventCard key={e._id} event={e} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}