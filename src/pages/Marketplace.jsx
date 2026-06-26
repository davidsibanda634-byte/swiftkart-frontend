import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ListingCard from '../components/cards/ListingCard'
import api from '../services/api'

const CATEGORIES = ['All', 'Fashion', 'Cosmetics & Hair', 'Mobile & Accessories', 'Vehicles', 'Furniture', 'Electronics', 'Food', 'Other']

const CATEGORY_ICONS = {
  'All': '🛍️', 'Fashion': '👗', 'Cosmetics & Hair': '💄',
  'Mobile & Accessories': '📱', 'Vehicles': '🚗', 'Furniture': '🛋️',
  'Electronics': '💻', 'Food': '🍔', 'Other': '📦',
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low → High' },
  { value: 'price_high', label: 'Price: High → Low' },
]

export default function Marketplace() {
  const navigate = useNavigate()
  const location = useLocation()

  const [allListings, setAllListings] = useState([])
  const [listings, setListings] = useState([])
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const cat = params.get('category')
    if (cat) setCategory(cat)
  }, [location.search])

  useEffect(() => { fetchListings() }, [])
  useEffect(() => {
    applyFilters(allListings, category, search, city, sort, minPrice, maxPrice)
  }, [category, sort])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/listings')
      setAllListings(data)
      applyFilters(data, category, search, city, sort, minPrice, maxPrice)
    } catch {
      setAllListings([]); setListings([])
    } finally { setLoading(false) }
  }

  const availableCities = useMemo(() => {
    const cities = allListings.map(l => l.location?.city).filter(Boolean)
    return [...new Set(cities)].sort()
  }, [allListings])

  const applyFilters = (data, cat, q, c, s, min, max) => {
    let result = [...data]
    if (cat && cat !== 'All') result = result.filter(l => l.category === cat)
    if (q) result = result.filter(l => l.title?.toLowerCase().includes(q.toLowerCase()) || l.description?.toLowerCase().includes(q.toLowerCase()))
    if (c) result = result.filter(l => l.location?.city?.toLowerCase() === c.toLowerCase())
    if (min !== '' && min !== undefined) result = result.filter(l => (l.price || 0) >= Number(min))
    if (max !== '' && max !== undefined) result = result.filter(l => (l.price || 0) <= Number(max))
    if (s === 'price_low') result.sort((a, b) => (a.price || 0) - (b.price || 0))
    else if (s === 'price_high') result.sort((a, b) => (b.price || 0) - (a.price || 0))
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setListings(result)
  }

  const handleSearch = () => applyFilters(allListings, category, search, city, sort, minPrice, maxPrice)
  const handleCategory = (cat) => { setCategory(cat); applyFilters(allListings, cat, search, city, sort, minPrice, maxPrice) }
  const handleSort = (s) => { setSort(s); applyFilters(allListings, category, search, city, s, minPrice, maxPrice) }
  const handleCityChange = (c) => { setCity(c); applyFilters(allListings, category, search, c, sort, minPrice, maxPrice) }
  const handlePriceApply = () => applyFilters(allListings, category, search, city, sort, minPrice, maxPrice)
  const clearAllFilters = () => {
    setSearch(''); setCity(''); setMinPrice(''); setMaxPrice(''); setCategory('All'); setSort('newest')
    applyFilters(allListings, 'All', '', '', 'newest', '', '')
  }

  const activeFilterCount = [category !== 'All', city !== '', minPrice !== '', maxPrice !== ''].filter(Boolean).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .mp-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        /* Header */
        .mp-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 20px 16px 0; }
        .mp-header-inner { max-width: 1240px; margin: 0 auto; }
        .mp-back {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex;
          align-items: center; gap: 5px; margin-bottom: 14px; transition: all 0.2s;
        }
        .mp-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .mp-title { font-size: 22px; font-weight: 800; color: white; margin: 0 0 3px; letter-spacing: -0.5px; }
        .mp-sub { color: rgba(255,255,255,0.5); font-size: 13px; margin: 0 0 16px; }

        /* Search inside header */
        .mp-search-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .mp-search-bar {
          flex: 1; display: flex; align-items: center;
          background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 11px; height: 42px; padding: 0 12px; gap: 8px; transition: all 0.2s;
        }
        .mp-search-bar:focus-within { background: rgba(255,255,255,0.15); border-color: #00C896; }
        .mp-search-input { flex: 1; border: none; outline: none; font-size: 13px; color: white; font-family: inherit; background: transparent; }
        .mp-search-input::placeholder { color: rgba(255,255,255,0.4); }
        .mp-search-btn {
          height: 42px; padding: 0 18px; background: linear-gradient(135deg, #00C896, #059669);
          color: white; border: none; border-radius: 11px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .mp-search-btn:hover { filter: brightness(1.08); }

        /* Category scroll row — sits at bottom of header, flush */
        .mp-cat-scroll-wrap {
          margin: 0 -16px;
          padding: 0 16px;
          overflow-x: auto;
          scrollbar-width: none;
          display: flex;
          gap: 8px;
          padding-bottom: 14px;
        }
        .mp-cat-scroll-wrap::-webkit-scrollbar { display: none; }

        .mp-cat-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          cursor: pointer;
          border: none;
          background: none;
          font-family: inherit;
          padding: 0;
          min-width: 56px;
          transition: transform 0.2s;
        }
        .mp-cat-chip:hover { transform: translateY(-2px); }

        .mp-cat-chip-circle {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.2s;
        }
        .mp-cat-chip.active .mp-cat-chip-circle {
          background: linear-gradient(135deg, #00C896, #059669);
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(0,200,150,0.4);
        }
        .mp-cat-chip-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          text-align: center;
          white-space: nowrap;
        }
        .mp-cat-chip.active .mp-cat-chip-label { color: #34d399; }

        /* Content */
        .mp-content { max-width: 1240px; margin: 0 auto; padding: 14px 14px 80px; }

        /* Controls bar — sort + filters */
        .mp-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 14px;
          background: white;
          border-radius: 12px;
          padding: 10px 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }

        .mp-sort-wrap { position: relative; flex-shrink: 0; }
        .mp-sort-select {
          appearance: none; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 9px;
          padding: 7px 28px 7px 10px; font-size: 12px; font-weight: 600; color: #374151;
          cursor: pointer; font-family: inherit; outline: none;
        }
        .mp-sort-select:focus { border-color: #00C896; }
        .mp-sort-arrow { position: absolute; right: 9px; top: 50%; transform: translateY(-50%); font-size: 9px; color: #9ca3af; pointer-events: none; }

        .mp-filter-btn {
          display: flex; align-items: center; gap: 6px;
          background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 9px;
          padding: 7px 12px; font-size: 12px; font-weight: 700; color: #374151;
          cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap;
        }
        .mp-filter-btn:hover { border-color: #00C896; color: #059669; }
        .mp-filter-btn.active { background: #ecfdf5; border-color: #00C896; color: #059669; }
        .mp-filter-count {
          background: #00C896; color: white; font-size: 9px; font-weight: 800;
          width: 16px; height: 16px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center;
        }

        /* Advanced panel */
        .mp-advanced-panel {
          background: white; border-radius: 12px; padding: 14px;
          margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9; display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;
        }
        .mp-filter-group { display: flex; flex-direction: column; gap: 5px; }
        .mp-filter-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
        .mp-price-inputs { display: flex; align-items: center; gap: 6px; }
        .mp-price-input {
          width: 80px; padding: 7px 10px; border: 1.5px solid #e2e8f0; border-radius: 8px;
          font-size: 13px; outline: none; font-family: inherit; transition: border 0.2s;
        }
        .mp-price-input:focus { border-color: #00C896; }
        .mp-price-sep { color: #9ca3af; font-size: 12px; }
        .mp-city-select-wrap { position: relative; }
        .mp-city-select {
          appearance: none; background: white; border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 7px 28px 7px 10px; font-size: 13px; font-weight: 600; color: #374151;
          cursor: pointer; font-family: inherit; outline: none; min-width: 140px;
        }
        .mp-city-select:focus { border-color: #00C896; }
        .mp-city-arrow { position: absolute; right: 9px; top: 50%; transform: translateY(-50%); font-size: 9px; color: #9ca3af; pointer-events: none; }
        .mp-apply-btn {
          background: linear-gradient(135deg, #00C896, #059669); color: white; border: none;
          padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .mp-clear-btn {
          background: none; border: none; color: #ef4444; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: inherit; padding: 4px;
        }
        .mp-clear-btn:hover { text-decoration: underline; }

        /* Results row */
        .mp-results-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px; flex-wrap: wrap; gap: 6px;
        }
        .mp-count-badge {
          display: inline-flex; align-items: center; gap: 6px; background: white;
          border: 1px solid #e2e8f0; border-radius: 20px; padding: 4px 12px;
          font-size: 12px; font-weight: 700; color: #374151;
        }
        .mp-count-dot { width: 6px; height: 6px; border-radius: 50%; background: #00C896; flex-shrink: 0; }
        .mp-active-tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .mp-active-filter {
          display: inline-flex; align-items: center; gap: 4px; background: #f0fdf4;
          border: 1px solid #bbf7d0; color: #059669; border-radius: 20px;
          padding: 3px 9px; font-size: 11px; font-weight: 700;
        }
        .mp-active-filter button { background: none; border: none; cursor: pointer; color: #059669; font-size: 12px; padding: 0; margin-left: 1px; }

        /* Grid */
        .mp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

        .mp-skeleton { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #f1f5f9; }
        .mp-skeleton-img {
          width: 100%; aspect-ratio: 4/5;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: mp-shimmer 1.4s infinite;
        }
        .mp-skeleton-line {
          height: 12px; margin: 12px 12px 8px; border-radius: 6px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: mp-shimmer 1.4s infinite;
        }
        .mp-skeleton-line.short { width: 55%; }
        @keyframes mp-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .mp-empty { grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; border: 2px dashed #e2e8f0; }
        .mp-empty-icon { font-size: 48px; margin-bottom: 12px; }
        .mp-empty-title { font-size: 16px; font-weight: 700; color: #374151; margin-bottom: 6px; }
        .mp-empty-sub { font-size: 13px; color: #9ca3af; }
        .mp-empty-btn {
          margin-top: 14px; background: linear-gradient(135deg, #00C896, #059669); color: white; border: none;
          padding: 10px 22px; border-radius: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }

        @media (max-width: 1024px) { .mp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .mp-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .mp-advanced-panel { flex-direction: column; align-items: stretch; }
          .mp-price-inputs { width: 100%; }
          .mp-price-input { flex: 1; width: auto; }
          .mp-city-select-wrap { width: 100%; }
          .mp-city-select { width: 100%; }
        }
        @media (max-width: 480px) { .mp-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } }
      `}</style>

      <div className="mp-wrap">

        <div className="mp-header">
          <div className="mp-header-inner">
            <button className="mp-back" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="mp-title">🛍️ Marketplace</h1>
            <p className="mp-sub">Buy and sell items within your campus community</p>

            <div className="mp-search-row">
              <div className="mp-search-bar">
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>🔍</span>
                <input
                  className="mp-search-input"
                  type="text"
                  placeholder="Search listings…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button className="mp-search-btn" onClick={handleSearch}>Search</button>
            </div>

            {/* Category horizontal scroll — flush to header bottom */}
            <div className="mp-cat-scroll-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={'mp-cat-chip' + (category === cat ? ' active' : '')}
                  onClick={() => handleCategory(cat)}
                >
                  <div className="mp-cat-chip-circle">{CATEGORY_ICONS[cat]}</div>
                  <span className="mp-cat-chip-label">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mp-content">

          {/* Controls bar — sort + filter toggle only */}
          <div className="mp-controls-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {category !== 'All' && (
                <div className="mp-active-filter">
                  {CATEGORY_ICONS[category]} {category}
                  <button onClick={() => handleCategory('All')}>✕</button>
                </div>
              )}
              {city && (
                <div className="mp-active-filter">
                  📍 {city}
                  <button onClick={() => handleCityChange('')}>✕</button>
                </div>
              )}
              {(minPrice || maxPrice) && (
                <div className="mp-active-filter">
                  💰 ${minPrice || '0'} – ${maxPrice || '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); applyFilters(allListings, category, search, city, sort, '', '') }}>✕</button>
                </div>
              )}
              {activeFilterCount === 0 && (
                <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>
                  {loading ? '...' : listings.length + ' listing' + (listings.length !== 1 ? 's' : '')}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                className={'mp-filter-btn' + (showMoreFilters ? ' active' : '')}
                onClick={() => setShowMoreFilters(!showMoreFilters)}
              >
                🎛️ Filters
                {activeFilterCount > 0 && <span className="mp-filter-count">{activeFilterCount}</span>}
              </button>

              <div className="mp-sort-wrap">
                <select className="mp-sort-select" value={sort} onChange={e => handleSort(e.target.value)}>
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="mp-sort-arrow">▼</span>
              </div>
            </div>
          </div>

          {/* Advanced filters panel */}
          {showMoreFilters && (
            <div className="mp-advanced-panel">
              <div className="mp-filter-group">
                <label className="mp-filter-label">Price Range ($)</label>
                <div className="mp-price-inputs">
                  <input className="mp-price-input" type="number" placeholder="Min"
                    value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePriceApply()} />
                  <span className="mp-price-sep">–</span>
                  <input className="mp-price-input" type="number" placeholder="Max"
                    value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePriceApply()} />
                </div>
              </div>

              <div className="mp-filter-group">
                <label className="mp-filter-label">City</label>
                <div className="mp-city-select-wrap">
                  <select className="mp-city-select" value={city} onChange={e => handleCityChange(e.target.value)}>
                    <option value="">All Cities</option>
                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="mp-city-arrow">▼</span>
                </div>
              </div>

              <button className="mp-apply-btn" onClick={handlePriceApply}>Apply</button>
              <button className="mp-clear-btn" onClick={clearAllFilters}>Clear All</button>
            </div>
          )}

          {/* Grid */}
          <div className="mp-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="mp-skeleton">
                  <div className="mp-skeleton-img" />
                  <div className="mp-skeleton-line" />
                  <div className="mp-skeleton-line short" />
                </div>
              ))
            ) : listings.length === 0 ? (
              <div className="mp-empty">
                <div className="mp-empty-icon">🔍</div>
                <div className="mp-empty-title">No listings found</div>
                <div className="mp-empty-sub">Try a different category, city or price range</div>
                <button className="mp-empty-btn" onClick={clearAllFilters}>Clear Filters</button>
              </div>
            ) : (
              listings.map(l => <ListingCard key={l._id} listing={l} />)
            )}
          </div>

        </div>
      </div>
    </>
  )
}