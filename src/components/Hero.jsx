import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <div>
      {/* Banner */}
      <div style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1562774053-701939374585?w=1400')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 16px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(20px, 5vw, 32px)',
          fontWeight: '700',
          marginBottom: '20px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          maxWidth: '600px'
        }}>
          Find Services, Jobs & Deals on Your Campus
        </h1>

        {/* Search Box */}
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '600px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          marginBottom: '12px'
        }}>
          <input
            type="text"
            placeholder="Search for items, services, jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1,
              padding: '13px 16px',
              fontSize: '14px',
              border: 'none',
              outline: 'none',
              color: '#374151',
              minWidth: 0
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: '#1a56db',
              color: 'white',
              border: 'none',
              padding: '13px 18px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
            🔍 Search
          </button>
        </div>

        {/* Post Listing Button */}
        <button
          onClick={() => navigate('/create')}
          style={{
            backgroundColor: '#fbbf24',
            color: '#1e3a8a',
            border: 'none',
            padding: '12px 28px',
            fontSize: '14px',
            fontWeight: '700',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
          📌 Post Listing
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        overflowX: 'auto',
        flexWrap: 'wrap'
      }}>
        {[
          { label: '🛍️ Marketplace', color: '#1a56db' },
          { label: '🧑‍💼 Student Services', color: '#1a56db' },
          { label: '💼 Campus Jobs', color: '#4b5563' },
          { label: '🎉 Events', color: '#4b5563' },
        ].map(tab => (
          <button key={tab.label} style={{
            backgroundColor: tab.color,
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}>{tab.label}</button>
        ))}
      </div>
    </div>
  )
}