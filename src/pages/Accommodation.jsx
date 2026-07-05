import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const PROPERTY_TYPES = ['All', 'Room', 'Studio', 'Apartment', 'House', 'Cottage', 'Flat', 'Other']
const PROPERTY_ICONS = {
  'All': '🏘️', 'Room': '🛏️', 'Studio': '🏠', 'Apartment': '🏢',
  'House': '🏡', 'Cottage': '🌿', 'Flat': '🏗️', 'Other': '📦'
}

export default function Accommodation() {
  const navigate = useNavigate()
  const [accommodations, setAccommodations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [propertyType, setPropertyType] = useState('All')
  const [listingType, setListingType] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    api.get('/accommodations')
      .then(res => {
        setAccommodations(res.data)
        setFiltered(res.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const applyFilters = (data, q, pt, lt, min, max) => {
    let result = [...data]
    if (q) result = result.filter(a =>
      a.title?.toLowerCase().includes(q.toLowerCase()) ||
      a.location?.city?.toLowerCase().includes(q.toLowerCase()) ||
      a.location?.area?.toLowerCase().includes(q.toLowerCase())
    )
    if (pt && pt !== 'All') result = result.filter(a => a.propertyType === pt)
    if (lt && lt !== 'All') result = result.filter(a => a.listingType === lt)
    if (min !== '') result = result.filter(a => (a.price || 0) >= Number(min))
    if (max !== '') result = result.filter(a => (a.price || 0) <= Number(max))
    setFiltered(result)
  }

  const handleSearch = () => applyFilters(accommodations, search, propertyType, listingType, minPrice, maxPrice)
  const handlePropertyType = (pt) => { setPropertyType(pt); applyFilters(accommodations, search, pt, listingType, minPrice, maxPrice) }
  const handleListingType = (lt) => { setListingType(lt); applyFilters(accommodations, search, propertyType, lt, minPrice, maxPrice) }
  const clearFilters = () => { setSearch(''); setPropertyType('All'); setListingType('All'); setMinPrice(''); setMaxPrice(''); setFiltered(accommodations) }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ac-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        /* Header */
        .ac-header {
          background: linear-gradient(135deg, #0f4c81 0%, #1a237e 100%);
          padding: 20px 16px 0;
        }
        .ac-header-inner { max-width: 1240px; margin: 0 auto; }
        .ac-back {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px;
          font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit;
          display: inline-flex; align-items: center; gap: 5px; margin-bottom: 14px; transition: all 0.2s;
        }
        .ac-back:hover { background: rgba(255,255,255,0.18); color: white; }

        .ac-title { font-size: 24px; font-weight: 800; color: white; margin: 0 0 4px; letter-spacing: -0.5px; }
        .ac-sub { color: rgba(255,255,255,0.55); font-size: 13px; margin: 0 0 16px; }

        .ac-search-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .ac-search-bar {
          flex: 1; display: flex; align-items: center;
          background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 11px; height: 42px; padding: 0 12px; gap: 8px; transition: all 0.2s;
        }
        .ac-search-bar:focus-within { background: rgba(255,255,255,0.15); border-color: #64b5f6; }
        .ac-search-input { flex: 1; border: none; outline: none; font-size: 13px; color: white; font-family: inherit; background: transparent; }
        .ac-search-input::placeholder { color: rgba(255,255,255,0.4); }
        .ac-search-btn {
          height: 42px; padding: 0 18px;
          background: linear-gradient(135deg, #2196F3, #1565C0);
          color: white; border: none; border-radius: 11px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit; white-space: nowrap; flex-shrink: 0;
        }

        /* Type chips */
        .ac-type-row {
          display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
          padding-bottom: 14px;
        }
        .ac-type-row::-webkit-scrollbar { display: none; }

        .ac-type-chip {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          flex-shrink: 0; cursor: pointer; border: none; background: none;
          font-family: inherit; padding: 0; min-width: 56px; transition: transform 0.2s;
        }
        .ac-type-chip:hover { transform: translateY(-2px); }
        .ac-type-circle {
          width: 46px; height: 46px; border-radius: 14px;
          background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center; font-size: 20px; transition: all 0.2s;
        }
        .ac-type-chip.active .ac-type-circle {
          background: linear-gradient(135deg, #2196F3, #1565C0);
          border-color: transparent; box-shadow: 0 4px 12px rgba(33,150,243,0.4);
        }
        .ac-type-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.6); text-align: center; white-space: nowrap; }
        .ac-type-chip.active .ac-type-label { color: #90caf9; }

        /* Content */
        .ac-content { max-width: 1240px; margin: 0 auto; padding: 16px 14px 80px; }

        /* For Rent / For Sale toggle */
        .ac-listing-toggle {
          display: flex; gap: 8px; margin-bottom: 14px; background: white;
          border-radius: 12px; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9; width: fit-content;
        }
        .ac-toggle-btn {
          padding: 8px 22px; border-radius: 9px; border: none; font-size: 13px;
          font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; color: #6b7280;
          background: transparent;
        }
        .ac-toggle-btn.active { background: linear-gradient(135deg, #0f4c81, #1a237e); color: white; box-shadow: 0 3px 10px rgba(15,76,129,0.3); }

        /* Controls */
        .ac-controls {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .ac-count { font-size: 13px; font-weight: 700; color: #374151; }
        .ac-count span { color: #2196F3; }
        .ac-filter-btn {
          display: flex; align-items: center; gap: 6px;
          background: white; border: 1.5px solid #e2e8f0; border-radius: 9px;
          padding: 7px 12px; font-size: 12px; font-weight: 700; color: #374151;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .ac-filter-btn.active { background: #eff6ff; border-color: #2196F3; color: #1565C0; }

        /* Advanced filters */
        .ac-filters-panel {
          background: white; border-radius: 12px; padding: 14px;
          margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9; display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;
        }
        .ac-filter-group { display: flex; flex-direction: column; gap: 5px; }
        .ac-filter-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
        .ac-price-row { display: flex; align-items: center; gap: 6px; }
        .ac-price-input {
          width: 80px; padding: 7px 10px; border: 1.5px solid #e2e8f0; border-radius: 8px;
          font-size: 13px; outline: none; font-family: inherit; transition: border 0.2s;
        }
        .ac-price-input:focus { border-color: #2196F3; }
        .ac-apply-btn {
          background: linear-gradient(135deg, #2196F3, #1565C0); color: white; border: none;
          padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .ac-clear-btn {
          background: none; border: none; color: #ef4444; font-size: 12px;
          font-weight: 700; cursor: pointer; font-family: inherit;
        }

        /* Grid */
        .ac-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        /* Card */
        .ac-card {
          background: white; border-radius: 16px; overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #f1f5f9;
          cursor: pointer; transition: transform 0.25s, box-shadow 0.25s;
        }
        .ac-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }

        .ac-card-img-wrap { position: relative; aspect-ratio: 16/10; overflow: hidden; background: #f1f5f9; }
        .ac-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .ac-card:hover .ac-card-img { transform: scale(1.04); }
        .ac-card-no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; background: linear-gradient(135deg, #eff6ff, #dbeafe); }

        .ac-card-type-badge {
          position: absolute; top: 10px; left: 10px;
          padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800;
          letter-spacing: 0.3px;
        }
        .ac-card-type-badge.rent { background: #dcfce7; color: #16a34a; }
        .ac-card-type-badge.sale { background: #fef3c7; color: #d97706; }

        .ac-card-prop-badge {
          position: absolute; top: 10px; right: 10px;
          background: rgba(0,0,0,0.55); color: white; backdrop-filter: blur(6px);
          padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700;
        }

        .ac-card-body { padding: 14px; }
        .ac-card-title { font-size: 14.5px; font-weight: 800; color: #0f172a; margin: 0 0 5px; line-height: 1.3; }
        .ac-card-location { font-size: 12px; color: #9ca3af; margin: 0 0 10px; display: flex; align-items: center; gap: 4px; }

        .ac-card-specs { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
        .ac-spec { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: #6b7280; font-weight: 600; }

        .ac-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .ac-card-price { font-size: 17px; font-weight: 800; color: #0f4c81; }
        .ac-card-price-sub { font-size: 10px; color: #9ca3af; font-weight: 500; margin-top: 1px; }
        .ac-card-wa-btn {
          background: linear-gradient(135deg, #25d366, #16a34a); color: white;
          border: none; padding: 8px 14px; border-radius: 10px; font-size: 11.5px;
          font-weight: 700; cursor: pointer; display: flex; align-items: center;
          gap: 5px; font-family: inherit; box-shadow: 0 3px 10px rgba(37,211,102,0.3);
          transition: all 0.2s;
        }
        .ac-card-wa-btn:hover { transform: translateY(-1px); }

        /* Skeleton */
        .ac-skeleton { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9; }
        .ac-skeleton-img { width: 100%; aspect-ratio: 16/10; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: ac-shimmer 1.4s infinite; }
        .ac-skeleton-line { height: 12px; margin: 12px 14px 8px; border-radius: 6px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: ac-shimmer 1.4s infinite; }
        .ac-skeleton-line.short { width: 55%; }
        @keyframes ac-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* Empty */
        .ac-empty { grid-column: 1/-1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; border: 2px dashed #e2e8f0; }
        .ac-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .ac-empty-title { font-size: 17px; font-weight: 800; color: #374151; margin-bottom: 6px; }
        .ac-empty-sub { font-size: 13px; color: #9ca3af; margin-bottom: 20px; }
        .ac-empty-btn {
          background: linear-gradient(135deg, #0f4c81, #1a237e); color: white; border: none;
          padding: 11px 24px; border-radius: 11px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }

        @media (max-width: 1024px) { .ac-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .ac-grid { grid-template-columns: repeat(1, 1fr); gap: 12px; }
          .ac-content { padding: 14px 12px 80px; }
        }
      `}</style>

      <div className="ac-wrap">

        <div className="ac-header">
          <div className="ac-header-inner">
            <button className="ac-back" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="ac-title">🏠 Accommodation</h1>
            <p className="ac-sub">Find rooms, apartments and houses near your campus</p>

            <div className="ac-search-row">
              <div className="ac-search-bar">
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>🔍</span>
                <input
                  className="ac-search-input"
                  type="text"
                  placeholder="Search by title, city or area…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button className="ac-search-btn" onClick={handleSearch}>Search</button>
            </div>

            <div className="ac-type-row">
              {PROPERTY_TYPES.map(pt => (
                <button
                  key={pt}
                  className={'ac-type-chip' + (propertyType === pt ? ' active' : '')}
                  onClick={() => handlePropertyType(pt)}
                >
                  <div className="ac-type-circle">{PROPERTY_ICONS[pt]}</div>
                  <span className="ac-type-label">{pt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ac-content">

          {/* For Rent / For Sale toggle */}
          <div className="ac-listing-toggle">
            {['All', 'For Rent', 'For Sale'].map(lt => (
              <button
                key={lt}
                className={'ac-toggle-btn' + (listingType === lt ? ' active' : '')}
                onClick={() => handleListingType(lt)}
              >
                {lt === 'All' ? '🏘️ All' : lt === 'For Rent' ? '🔑 For Rent' : '🏷️ For Sale'}
              </button>
            ))}
          </div>

          <div className="ac-controls">
            <p className="ac-count">
              <span>{filtered.length}</span> propert{filtered.length !== 1 ? 'ies' : 'y'} found
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={'ac-filter-btn' + (showFilters ? ' active' : '')}
                onClick={() => setShowFilters(!showFilters)}
              >
                🎛️ Price Filter
              </button>
              <button
                className="ac-filter-btn"
                onClick={() => navigate('/create')}
                style={{ background: 'linear-gradient(135deg,#0f4c81,#1a237e)', color: 'white', borderColor: 'transparent' }}
              >
                + List Property
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="ac-filters-panel">
              <div className="ac-filter-group">
                <label className="ac-filter-label">Price Range ($)</label>
                <div className="ac-price-row">
                  <input className="ac-price-input" type="number" placeholder="Min"
                    value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  <span style={{ color: '#9ca3af' }}>–</span>
                  <input className="ac-price-input" type="number" placeholder="Max"
                    value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
              </div>
              <button className="ac-apply-btn" onClick={() => applyFilters(accommodations, search, propertyType, listingType, minPrice, maxPrice)}>
                Apply
              </button>
              <button className="ac-clear-btn" onClick={clearFilters}>Clear All</button>
            </div>
          )}

          <div className="ac-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="ac-skeleton">
                  <div className="ac-skeleton-img" />
                  <div className="ac-skeleton-line" />
                  <div className="ac-skeleton-line short" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="ac-empty">
                <div className="ac-empty-icon">🏠</div>
                <div className="ac-empty-title">No properties found</div>
                <div className="ac-empty-sub">Be the first to list a property near campus</div>
                <button className="ac-empty-btn" onClick={() => navigate('/create')}>
                  + List a Property
                </button>
              </div>
            ) : (
              filtered.map(a => {
                const phone = a.phone ? a.phone.replace(/\D/g, '') : ''
                const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in your property: ' + a.title)
                return (
                  <div key={a._id} className="ac-card" onClick={() => navigate('/accommodation/' + a._id)}>
                    <div className="ac-card-img-wrap">
                      {a.images?.[0]
                        ? <img className="ac-card-img" src={a.images[0]} alt={a.title} />
                        : <div className="ac-card-no-img">🏠</div>
                      }
                      <span className={'ac-card-type-badge ' + (a.listingType === 'For Rent' ? 'rent' : 'sale')}>
                        {a.listingType === 'For Rent' ? '🔑 For Rent' : '🏷️ For Sale'}
                      </span>
                      {a.propertyType && (
                        <span className="ac-card-prop-badge">{PROPERTY_ICONS[a.propertyType]} {a.propertyType}</span>
                      )}
                    </div>
                    <div className="ac-card-body">
                      <p className="ac-card-title">{a.title}</p>
                      <p className="ac-card-location">
                        📍 {a.location?.city}{a.location?.area ? ', ' + a.location.area : ''}
                      </p>
                      <div className="ac-card-specs">
                        <span className="ac-spec">🛏️ {a.bedrooms} bed{a.bedrooms !== 1 ? 's' : ''}</span>
                        <span className="ac-spec">🚿 {a.bathrooms} bath{a.bathrooms !== 1 ? 's' : ''}</span>
                        {a.furnished && <span className="ac-spec">🛋️ {a.furnished}</span>}
                      </div>
                      <div className="ac-card-footer">
                        <div>
                          <p className="ac-card-price">${a.price?.toLocaleString()}</p>
                          <p className="ac-card-price-sub">{a.priceType}</p>
                        </div>
                        {phone && (
                          <button
                            className="ac-card-wa-btn"
                            onClick={e => { e.stopPropagation(); window.open(waLink, '_blank') }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}