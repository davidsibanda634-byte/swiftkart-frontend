import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const CATEGORY_COLORS = {
  'Fashion':              { bg: '#fdf2f8', color: '#9d174d' },
  'Cosmetics & Hair':     { bg: '#fef9c3', color: '#854d0e' },
  'Mobile & Accessories': { bg: '#eff6ff', color: '#1e40af' },
  'Vehicles':             { bg: '#f0fdf4', color: '#166534' },
  'Furniture':            { bg: '#fff7ed', color: '#9a3412' },
  'Electronics':          { bg: '#eef2ff', color: '#3730a3' },
  'Food':                 { bg: '#fef2f2', color: '#991b1b' },
  'Other':                { bg: '#f9fafb', color: '#374151' },
}

export default function ListingCard({ listing, savedIds = [], onToggleSave }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [saved, setSaved] = useState(savedIds.includes(listing._id))

  const getImageUrl = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  const imageUrl = getImageUrl(listing.images?.[0])
  const phone = listing.phone?.replace(/\D/g, '') || ''
  const waText = 'Hi, I am interested in your listing: ' + listing.title
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(waText)
  const catStyle = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS['Other']

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price on request'
    return '$' + Number(price).toLocaleString()
  }

  const handleSave = (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    const key = 'sk_saved_' + user._id
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const next = saved
      ? existing.filter(id => id !== listing._id)
      : existing.concat([listing._id])
    localStorage.setItem(key, JSON.stringify(next))
    setSaved(!saved)
    if (onToggleSave) onToggleSave(listing._id, !saved)
  }

  const goDetail = () => navigate('/listings/' + listing._id)

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform .25s ease, box-shadow .25s ease',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 2px 16px rgba(0,0,0,.08)',
        border: '1px solid rgba(0,0,0,.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,.13)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,.08)'
      }}
    >
      {/* IMAGE ZONE */}
      <div
        onClick={goDetail}
        style={{
          width: '100%',
          aspectRatio: '4/5',
          background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '52px',
            background: 'linear-gradient(135deg,#f8fafc,#e2e8f0)',
          }}>
            🛍️
          </div>
        )}

        {/* Category badge — bottom left */}
        {listing.category && (
          <span style={{
            position: 'absolute', bottom: '10px', left: '10px',
            fontSize: '10px', fontWeight: 700,
            padding: '3px 10px', borderRadius: '20px',
            backdropFilter: 'blur(8px)', zIndex: 5,
            background: catStyle.bg, color: catStyle.color,
          }}>
            {listing.category}
          </span>
        )}

        {/* Heart — top right */}
        <button
          onClick={handleSave}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '34px', height: '34px', borderRadius: '50%',
            background: saved ? '#fef2f2' : 'rgba(255,255,255,.82)',
            backdropFilter: 'blur(8px)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,.15)', zIndex: 10,
          }}
        >
          {saved ? '❤️' : '🤍'}
        </button>

        {/* WhatsApp — bottom right ✅ FIXED */}
        
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: '10px', right: '10px',
            width: '34px', height: '34px', borderRadius: '50%',
            background: '#25d366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 12px rgba(37,211,102,.5)',
            textDecoration: 'none', zIndex: 10,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>

      {/* INFO ZONE */}
      <div
        onClick={goDetail}
        style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}
      >
        <p style={{
          fontWeight: 700, fontSize: '13px', color: '#111827',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          lineHeight: 1.4, margin: 0,
        }}>
          {listing.title}
        </p>
        <p style={{
          fontSize: '16px', fontWeight: 800,
          color: '#08162F', letterSpacing: '-.5px', margin: '2px 0 0',
        }}>
          {formatPrice(listing.price)}
        </p>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginTop: '4px', gap: '4px',
        }}>
          <span style={{
            color: '#9ca3af', fontSize: '10.5px', fontWeight: 500,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            📍 {listing.location?.city}{listing.location?.area ? ', ' + listing.location.area : ''}
          </span>
          {listing.user && (
            <span style={{
              background: '#ecfdf5', color: '#059669',
              fontSize: '9px', fontWeight: 700,
              padding: '2px 6px', borderRadius: '8px',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              ✔ Verified
            </span>
          )}
        </div>
      </div>
    </div>
  )
}