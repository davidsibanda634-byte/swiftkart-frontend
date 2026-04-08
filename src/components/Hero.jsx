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
        height: '260px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '24px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Find Services, Jobs & Deals on Your Campus
        </h1>

        {/* Search + Post Listing — separated */}
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '800px',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            flex: 1,
            minWidth: '280px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <input
              type="text"
              placeholder="Search for items, services, jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1,
                padding: '14px 18px',
                fontSize: '14px',
                border: 'none',
                outline: 'none',
                color: '#374151'
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                backgroundColor: '#1a56db',
                color: 'white',
                border: 'none',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
              🔍 Search
            </button>
          </div>

          {/* Post Listing Button — separated */}
          <button
            onClick={() => navigate('/create')}
            style={{
              backgroundColor: '#fbbf24',
              color: '#1e3a8a',
              border: 'none',
              padding: '14px 22px',
              fontSize: '14px',
              fontWeight: '700',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
            📌 Post Listing
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        padding: '14px 40px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        overflowX: 'auto'
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
            padding: '10px 28px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}>{tab.label}</button>
        ))}
      </div>
    </div>
  )
}