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
  const [saving, setSaving] = useState(false)

  const getImageUrl = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    return `https://swiftkart2-backend.onrender.com/${img.replace(/\\/g, '/')}`
  }

  const imageUrl = getImageUrl(listing.images?.[0])
  const phone = listing.phone?.replace(/\D/g, '')
  const message = `Hi, I am interested in your listing: ${listing.title}`
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  const catStyle = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS['Other']

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price on request'
    return `R ${Number(price).toLocaleString()}`
  }

  const handleSave = (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    setSaving(true)
    try {
      const key = `sk_saved_${user._id}`
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      const updated = saved
        ? existing.filter(id => id !== listing._id)
        : [...existing, listing._id]
      localStorage.setItem(key, JSON.stringify(updated))
      setSaved(!saved)
      if (onToggleSave) onToggleSave(listing._id, !saved)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .sk-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.13);
        }
        .sk-card-img-wrap {
          width: 100%;
          aspect-ratio: 4 / 5;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .sk-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.4s ease;
        }
        .sk-card:hover .sk-card-img-wrap img { transform: scale(1.07); }
        .sk-card-no-img {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 52px;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        }
        .sk-img-cat-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
          z-index: 5;
        }
        .sk-heart-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(8px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          transition: all 0.2s;
          z-index: 10;
        }
        .sk-heart-btn:hover { transform: scale(1.18); background: white; }
        .sk-heart-btn.saved { background: #fef2f2; }
        .sk-wa-float {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #25d366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(37,211,102,0.5);
          text-decoration: none;
          transition: all 0.2s;
          z-index: 10;
        }
        .sk-wa-float:hover { transform: scale(1.12); }
        .sk-card-info {
          padding: 10px 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sk-card-title {
          font-weight: 700;
          font-size: 13px;
          color: #111827;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.4;
        }
        .sk-card-price {
          font-size: 16px;
          font-weight: 800;
          color: #08162F;
          letter-spacing: -0.5px;
          margin-top: 2px;
        }
        .sk-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
        }
        .sk-card-location {
          color: #9ca3af;
          font-size: 10.5px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sk-card-verified {
          background: #ecfdf5;
          color: #059669;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 8px;
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>

      <div className="sk-card">
        <div className="sk-card-img-wrap" onClick={() => navigate(`/listings/${listing._id}`)}>
          {imageUrl
            ? <img src={imageUrl} alt={listing.title} loading="lazy" />
            : <div className="sk-card-no-img">🛍️</div>
          }

          {listing.category && (
            <span className="sk-img-cat-badge"
              style={{ backgroundColor: catStyle.bg, color: catStyle.color }}>
              {listing.category}
            </span>
          )}

          <button
            className={`sk-heart-btn ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saved ? '❤️' : '🤍'}
          </button>

          
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="sk-wa-float"
            onClick={e => e.stopPropagation()}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>

        <div className="sk-card-info" onClick={() => navigate(`/listings/${listing._id}`)}>
          <p className="sk-card-title">{listing.title}</p>
          <p className="sk-card-price">{formatPrice(listing.price)}</p>
          <div className="sk-card-bottom">
            <span className="sk-card-location">
              📍 {listing.location?.city}{listing.location?.area ? `, ${listing.location.area}` : ''}
            </span>
            {listing.user && (
              <span className="sk-card-verified">✔ Verified</span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}