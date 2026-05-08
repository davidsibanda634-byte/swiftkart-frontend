import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { icon: '📱', label: 'Electronics', to: '/marketplace?category=Electronics' },
  { icon: '👗', label: 'Fashion', to: '/marketplace?category=Fashion' },
  { icon: '📚', label: 'Books', to: '/marketplace?category=Books' },
  { icon: '🛋️', label: 'Home & Living', to: '/marketplace?category=Furniture' },
  { icon: '🔧', label: 'Services', to: '/services' },
  { icon: '💼', label: 'Jobs', to: '/jobs' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [selectedCat, setSelectedCat] = useState('All Categories')

  const handleSearch = () => {
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-hero {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          min-height: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 44px 20px 44px;
          text-align: center;
          background-image:
            linear-gradient(to bottom, rgba(8,14,40,0.80) 0%, rgba(10,20,55,0.72) 55%, rgba(8,14,40,0.88) 100%),
            url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80');
          background-size: cover;
          background-position: center top;
        }
        .sk-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.38);
          color: #6ee7b7;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 13px;
          border-radius: 20px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .sk-hero h1 {
          color: white;
          font-size: clamp(24px, 4.5vw, 42px);
          font-weight: 800;
          line-height: 1.13;
          margin-bottom: 10px;
          letter-spacing: -0.8px;
          text-shadow: 0 2px 24px rgba(0,0,0,0.5);
          max-width: 660px;
        }
        .sk-hero h1 span {
          background: linear-gradient(135deg, #34d399, #6ee7b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sk-hero-sub {
          color: rgba(255,255,255,0.65);
          font-size: 14px;
          margin-bottom: 26px;
          font-weight: 400;
        }

        /* Search bar */
        .sk-search-wrap {
          width: 100%;
          max-width: 620px;
          margin-bottom: 14px;
          z-index: 10;
          position: relative;
        }
        .sk-search-bar {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 10px;
          overflow: visible;
          box-shadow: 0 6px 28px rgba(0,0,0,0.32);
          height: 44px;
          position: relative;
        }
        .sk-cat-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 12px;
          height: 100%;
          background: transparent;
          border: none;
          border-right: 1px solid #e5e7eb;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          flex-shrink: 0;
          transition: background 0.2s;
          border-radius: 10px 0 0 10px;
          max-width: 140px;
          overflow: hidden;
        }
        .sk-cat-btn:hover { background: #f9fafb; }
        .sk-cat-arrow { font-size: 9px; color: #9ca3af; flex-shrink: 0; }
        .sk-cat-dropdown {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          background: white;
          border-radius: 11px;
          box-shadow: 0 10px 36px rgba(0,0,0,0.16);
          padding: 6px;
          min-width: 175px;
          z-index: 200;
          border: 1px solid #f1f5f9;
        }
        .sk-cat-option {
          padding: 8px 13px;
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s;
        }
        .sk-cat-option:hover { background: #f0fdf4; color: #059669; }
        .sk-search-input {
          flex: 1;
          height: 100%;
          padding: 0 13px;
          font-size: 13px;
          border: none;
          outline: none;
          color: #1f2937;
          font-family: inherit;
          background: transparent;
          min-width: 0;
        }
        .sk-search-input::placeholder { color: #9ca3af; }
        .sk-search-btn {
          height: 100%;
          padding: 0 20px;
          background: linear-gradient(135deg, #1a3a8f, #1e4db7);
          color: white;
          border: none;
          border-radius: 0 10px 10px 0;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .sk-search-btn:hover { background: linear-gradient(135deg, #0f2167, #1a3a8f); }

        /* Post button */
        .sk-post-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #1e3a5f;
          border: none;
          padding: 10px 28px;
          font-size: 13.5px;
          font-weight: 800;
          border-radius: 50px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: inherit;
          box-shadow: 0 5px 18px rgba(245,158,11,0.42);
          transition: all 0.2s ease;
          position: relative;
          z-index: 2;
        }
        .sk-post-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,0.52); }

        /* Trust strip */
        .sk-trust-strip {
          background: white;
          padding: 0;
          display: flex;
          align-items: stretch;
          justify-content: center;
          border-bottom: 1px solid #f1f5f9;
          flex-wrap: wrap;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sk-trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-right: 1px solid #f1f5f9;
          flex: 1;
          min-width: 160px;
          max-width: 260px;
        }
        .sk-trust-item:last-child { border-right: none; }
        .sk-trust-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .sk-trust-label { font-size: 12.5px; font-weight: 700; color: #111827; }
        .sk-trust-sub { font-size: 11px; color: #9ca3af; font-weight: 500; margin-top: 1px; }

        /* Category section */
        .sk-cat-section {
          background: white;
          padding: 20px 20px;
          border-bottom: 1px solid #f1f5f9;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sk-cat-section-inner {
          max-width: 1240px;
          margin: 0 auto;
        }
        .sk-cat-sec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .sk-cat-sec-title { font-size: 16px; font-weight: 800; color: #0f172a; }
        .sk-cat-sec-viewall {
          font-size: 12.5px;
          font-weight: 700;
          color: #1e4db7;
          text-decoration: none;
        }
        .sk-cat-sec-viewall:hover { text-decoration: underline; }
        .sk-cat-icons-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .sk-cat-icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          padding: 0;
          min-width: 68px;
          transition: transform 0.2s;
        }
        .sk-cat-icon-item:hover { transform: translateY(-3px); }
        .sk-cat-icon-circle {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          transition: all 0.2s;
        }
        .sk-cat-icon-item:hover .sk-cat-icon-circle {
          background: #eff6ff;
          border-color: #1e4db7;
        }
        .sk-cat-icon-label {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          text-align: center;
        }

        @media (max-width: 640px) {
          .sk-hero { min-height: 300px; padding: 36px 16px 36px; }
          .sk-trust-item { padding: 12px 14px; min-width: 120px; }
          .sk-trust-sub { display: none; }
          .sk-cat-btn { max-width: 110px; font-size: 11px; padding: 0 8px; }
          .sk-search-btn { padding: 0 13px; font-size: 12px; }
        }
      `}</style>

      {/* Hero */}
      <div className="sk-hero">
        <div className="sk-hero-badge">🌍 Campus Marketplace · Zimbabwe</div>
        <h1>Find Deals, Services &<br /><span>Jobs on Campus</span></h1>
        <p className="sk-hero-sub">Buy, sell, and connect with students around you</p>

        <div className="sk-search-wrap">
          <div className="sk-search-bar">
            <button className="sk-cat-btn" onClick={() => setCatOpen(!catOpen)}>
              🗂️ {selectedCat} <span className="sk-cat-arrow">▼</span>
            </button>
            {catOpen && (
              <div className="sk-cat-dropdown">
                {['All Categories', ...CATEGORIES.map(c => c.label)].map(c => (
                  <div key={c} className="sk-cat-option"
                    onClick={() => { setSelectedCat(c); setCatOpen(false) }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
            <input
              className="sk-search-input"
              type="text"
              placeholder="Search items, services, jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="sk-search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>

        <button className="sk-post-btn" onClick={() => navigate('/create')}>
          ➕ Post a Listing
        </button>
      </div>

      {/* Trust Strip */}
      <div className="sk-trust-strip">
        {[
          { icon: '🛡️', bg: '#f0fdf4', label: 'Verified Students', sub: 'Trusted community' },
          { icon: '💬', bg: '#f0fdf4', label: 'WhatsApp Support', sub: "We're here to help" },
          { icon: '⚡', bg: '#fffbeb', label: 'Fast & Reliable', sub: 'Quick responses' },
          { icon: '🔒', bg: '#eff6ff', label: 'Safe & Secure', sub: 'Your safety first' },
        ].map(item => (
          <div key={item.label} className="sk-trust-item">
            <div className="sk-trust-icon-wrap" style={{ background: item.bg }}>{item.icon}</div>
            <div>
              <div className="sk-trust-label">{item.label}</div>
              <div className="sk-trust-sub">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Shop by Category */}
      <div className="sk-cat-section">
        <div className="sk-cat-section-inner">
          <div className="sk-cat-sec-header">
            <span className="sk-cat-sec-title">Shop by Category</span>
            <a href="/marketplace" className="sk-cat-sec-viewall">View All →</a>
          </div>
          <div className="sk-cat-icons-row">
            {CATEGORIES.map(cat => (
              <button key={cat.label} className="sk-cat-icon-item"
                onClick={() => navigate(cat.to)}>
                <div className="sk-cat-icon-circle">{cat.icon}</div>
                <span className="sk-cat-icon-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}