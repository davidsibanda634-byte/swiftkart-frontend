import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { icon: '📱', label: 'Electronics' },
  { icon: '👗', label: 'Fashion' },
  { icon: '📚', label: 'Books' },
  { icon: '🛋️', label: 'Home & Living' },
  { icon: '🔧', label: 'Services' },
  { icon: '💼', label: 'Jobs' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-hero {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 52px 20px 48px;
          text-align: center;
          background-image:
            linear-gradient(to bottom, rgba(8,14,40,0.78) 0%, rgba(10,20,55,0.70) 60%, rgba(8,14,40,0.85) 100%),
            url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80');
          background-size: cover;
          background-position: center top;
        }

        .sk-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.4);
          color: #6ee7b7;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 20px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .sk-hero h1 {
          color: white;
          font-size: clamp(28px, 5vw, 46px);
          font-weight: 800;
          line-height: 1.12;
          margin-bottom: 12px;
          letter-spacing: -1px;
          text-shadow: 0 2px 24px rgba(0,0,0,0.5);
          max-width: 700px;
        }

        .sk-hero h1 span {
          background: linear-gradient(135deg, #34d399, #6ee7b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sk-hero-sub {
          color: rgba(255,255,255,0.68);
          font-size: 15px;
          margin-bottom: 32px;
          font-weight: 400;
        }

        /* Search bar */
        .sk-search-wrap {
          width: 100%;
          max-width: 640px;
          margin-bottom: 16px;
          z-index: 10;
          position: relative;
        }

        .sk-search-bar {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 12px;
          overflow: visible;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
          position: relative;
          height: 50px;
        }

        .sk-cat-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          height: 100%;
          background: transparent;
          border: none;
          border-right: 1px solid #e5e7eb;
          font-size: 12.5px;
          font-weight: 700;
          color: #374151;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          flex-shrink: 0;
          transition: background 0.2s;
          border-radius: 12px 0 0 12px;
        }
        .sk-cat-btn:hover { background: #f9fafb; }
        .sk-cat-arrow { font-size: 10px; color: #9ca3af; }

        .sk-cat-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.18);
          padding: 8px;
          min-width: 180px;
          z-index: 100;
          border: 1px solid #f1f5f9;
        }
        .sk-cat-option {
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sk-cat-option:hover { background: #f0fdf4; color: #059669; }

        .sk-search-divider {
          width: 1px;
          height: 24px;
          background: #e5e7eb;
          flex-shrink: 0;
        }

        .sk-search-input {
          flex: 1;
          height: 100%;
          padding: 0 14px;
          font-size: 13.5px;
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
          padding: 0 22px;
          background: linear-gradient(135deg, #1a3a8f, #1e4db7);
          color: white;
          border: none;
          border-radius: 0 12px 12px 0;
          font-size: 13.5px;
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
          padding: 13px 36px;
          font-size: 14.5px;
          font-weight: 800;
          border-radius: 50px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          box-shadow: 0 6px 20px rgba(245,158,11,0.45);
          transition: all 0.2s ease;
          position: relative;
          z-index: 2;
        }
        .sk-post-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(245,158,11,0.55); }

        /* Trust strip */
        .sk-trust-strip {
          background: white;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-bottom: 1px solid #f1f5f9;
          flex-wrap: wrap;
        }
        .sk-trust-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 24px;
          border-right: 1px solid #e5e7eb;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sk-trust-item:last-child { border-right: none; }
        .sk-trust-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .sk-trust-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #111827;
        }
        .sk-trust-sub {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
          margin-top: 1px;
        }

        /* Category icons row */
        .sk-cat-section {
          background: white;
          padding: 24px 20px;
          border-bottom: 1px solid #f1f5f9;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sk-cat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1240px;
          margin: 0 auto 18px;
        }
        .sk-cat-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
        }
        .sk-cat-viewall {
          font-size: 13px;
          font-weight: 700;
          color: #1e4db7;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .sk-cat-viewall:hover { text-decoration: underline; }
        .sk-cat-grid {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1240px;
          margin: 0 auto;
        }
        .sk-cat-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.2s;
          min-width: 72px;
          background: none;
          border: none;
          font-family: inherit;
          padding: 0;
        }
        .sk-cat-icon-btn:hover { transform: translateY(-3px); }
        .sk-cat-icon-circle {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          transition: all 0.2s;
        }
        .sk-cat-icon-btn:hover .sk-cat-icon-circle {
          background: #eff6ff;
          border-color: #1e4db7;
        }
        .sk-cat-icon-label {
          font-size: 11.5px;
          font-weight: 600;
          color: #374151;
          text-align: center;
        }

        @media (max-width: 640px) {
          .sk-hero { min-height: 320px; padding: 40px 16px 40px; }
          .sk-trust-item { padding: 8px 14px; }
          .sk-trust-sub { display: none; }
          .sk-search-bar { height: 46px; }
          .sk-cat-btn { padding: 0 10px; font-size: 11px; }
          .sk-search-btn { padding: 0 14px; font-size: 12.5px; }
        }
      `}</style>

      {/* Hero Banner */}
      <div className="sk-hero">
        <div className="sk-hero-badge">🌍 Campus Marketplace · Zimbabwe</div>
        <h1>Find Deals, Services &<br /><span>Jobs on Campus</span></h1>
        <p className="sk-hero-sub">Buy, sell, and connect with students around you</p>

        {/* Search */}
        <div className="sk-search-wrap">
          <div className="sk-search-bar">
            <button className="sk-cat-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              🗂️ {category} <span className="sk-cat-arrow">▼</span>
            </button>
            {dropdownOpen && (
              <div className="sk-cat-dropdown">
                {['All Categories', ...CATEGORIES.map(c => c.label)].map(c => (
                  <div key={c} className="sk-cat-option"
                    onClick={() => { setCategory(c); setDropdownOpen(false) }}>
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
            <div className="sk-trust-icon-wrap" style={{ background: item.bg }}>
              {item.icon}
            </div>
            <div>
              <div className="sk-trust-label">{item.label}</div>
              <div className="sk-trust-sub">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Shop by Category */}
      <div className="sk-cat-section">
        <div className="sk-cat-header">
          <span className="sk-cat-title">Shop by Category</span>
          <a href="/marketplace" className="sk-cat-viewall">View All →</a>
        </div>
        <div className="sk-cat-grid">
          {CATEGORIES.map(cat => (
            <button key={cat.label} className="sk-cat-icon-btn"
              onClick={() => navigate(`/marketplace?category=${cat.label}`)}>
              <div className="sk-cat-icon-circle">{cat.icon}</div>
              <span className="sk-cat-icon-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}