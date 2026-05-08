import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('Marketplace')

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  const tabs = [
    { label: '🛍️ Marketplace', key: 'Marketplace', to: '/marketplace' },
    { label: '🧑‍💼 Student Services', key: 'Services', to: '/services' },
    { label: '💼 Campus Jobs', key: 'Jobs', to: '/jobs' },
    { label: '🎉 Events', key: 'Events', to: '/events' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-hero {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 20px 52px;
          text-align: center;
          overflow: hidden;
          background-image:
            linear-gradient(
              to bottom,
              rgba(10, 20, 60, 0.72) 0%,
              rgba(15, 33, 103, 0.65) 60%,
              rgba(10, 20, 60, 0.80) 100%
            ),
            url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80');
          background-size: cover;
          background-position: center top;
        }
        .sk-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(52, 211, 153, 0.18);
          border: 1px solid rgba(52, 211, 153, 0.35);
          color: #6ee7b7;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .sk-hero h1 {
          color: white;
          font-size: clamp(26px, 5vw, 44px);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 10px;
          letter-spacing: -1px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
          max-width: 680px;
        }
        .sk-hero h1 span {
          background: linear-gradient(135deg, #34d399, #6ee7b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sk-hero-sub {
          color: rgba(255,255,255,0.72);
          font-size: 15px;
          margin-bottom: 28px;
          font-weight: 400;
        }
        .sk-search-wrap {
          width: 100%;
          max-width: 620px;
          position: relative;
          margin-bottom: 20px;
          z-index: 2;
        }
        .sk-search-inner {
          display: flex;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.12);
          background: white;
        }
        .sk-search-input {
          flex: 1;
          padding: 15px 20px;
          font-size: 14.5px;
          border: none;
          outline: none;
          color: #1f2937;
          font-family: inherit;
          background: white;
          min-width: 0;
        }
        .sk-search-input::placeholder { color: #9ca3af; }
        .sk-search-btn {
          background: linear-gradient(135deg, #1a3a8f, #1e4db7);
          color: white;
          border: none;
          padding: 15px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .sk-search-btn:hover { background: linear-gradient(135deg, #0f2167, #1a3a8f); }
        .sk-post-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #1e3a5f;
          border: none;
          padding: 13px 32px;
          font-size: 14.5px;
          font-weight: 800;
          border-radius: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          box-shadow: 0 6px 20px rgba(245,158,11,0.4);
          transition: all 0.2s ease;
          z-index: 2;
          position: relative;
        }
        .sk-post-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(245,158,11,0.5);
        }
        .sk-tabs-bar {
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 14px 20px;
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          border-bottom: 2px solid #f1f5f9;
        }
        .sk-tab-pill {
          padding: 9px 20px;
          border-radius: 24px;
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #4b5563;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .sk-tab-pill:hover {
          border-color: #1a3a8f;
          color: #1a3a8f;
          background: #eff6ff;
          transform: translateY(-1px);
        }
        .sk-tab-pill.active {
          background: linear-gradient(135deg, #1a3a8f, #1e4db7);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(26,58,143,0.35);
        }
        @media (max-width: 600px) {
          .sk-hero { min-height: 280px; padding: 36px 16px 44px; }
          .sk-tabs-bar { gap: 6px; padding: 12px; }
          .sk-tab-pill { padding: 8px 14px; font-size: 12px; }
        }
      `}</style>

      <div className="sk-hero">
        <div className="sk-hero-badge">🌍 Campus Marketplace · Zimbabwe</div>
        <h1>Find Deals, Services &<br /><span>Jobs on Campus</span></h1>
        <p className="sk-hero-sub">Buy, sell, and connect with students around you</p>

        <div className="sk-search-wrap">
          <div className="sk-search-inner">
            <input
              className="sk-search-input"
              type="text"
              placeholder="Search items, services, jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="sk-search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
          </div>
        </div>

        <button className="sk-post-btn" onClick={() => navigate('/create')}>
          📌 Post a Listing
        </button>
      </div>

      <div className="sk-tabs-bar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`sk-tab-pill ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); navigate(tab.to) }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  )
}