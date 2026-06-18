import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORY_COLORS = {
  Tutoring:     { bg: '#eff6ff', color: '#1e40af' },
  Design:       { bg: '#fdf2f8', color: '#9d174d' },
  'Tech Help':  { bg: '#eef2ff', color: '#3730a3' },
  Photography:  { bg: '#f0fdf4', color: '#166534' },
  Writing:      { bg: '#fff7ed', color: '#9a3412' },
  Other:        { bg: '#f9fafb', color: '#374151' },
}

export default function ServiceCard({ service }) {
  const navigate = useNavigate()

  const getImageUrl = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  const imageUrl = getImageUrl(service.images?.[0])
  const phone = service.phone?.replace(/\D/g, '') || ''
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in your service: ' + service.title)
  const cat = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.Other

  function handleWhatsApp(e) {
    e.stopPropagation()
    window.open(waLink, '_blank')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sc-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .sc-card:hover { transform: translateY(-5px); box-shadow: 0 16px 36px rgba(0,0,0,0.12); }

        .sc-img-wrap {
          width: 100%;
          aspect-ratio: 1/1;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          position: relative;
          overflow: hidden;
        }
        .sc-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.35s ease; }
        .sc-card:hover .sc-img-wrap img { transform: scale(1.05); }
        .sc-no-img {
          width: 100%; height: 100%; display: flex; align-items: center;
          justify-content: center; font-size: 48px;
        }

        .sc-body {
          padding: 14px 14px 8px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .sc-cat-badge {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 7px;
          align-self: flex-start;
        }

        .sc-title {
          font-weight: 700;
          font-size: 14px;
          color: #111827;
          margin: 0 0 5px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.35;
        }

        .sc-price {
          font-size: 17px;
          font-weight: 800;
          color: #7c3aed;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }

        .sc-desc {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0 0 8px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .sc-location {
          color: #9ca3af;
          font-size: 11px;
          font-weight: 500;
          margin: 0;
        }

        .sc-footer { padding: 0 12px 12px; margin-top: auto; }
        .sc-wa-btn {
          width: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 3px 10px rgba(34,197,94,0.28);
          transition: all 0.2s ease;
        }
        .sc-wa-btn:hover { background: linear-gradient(135deg, #16a34a, #15803d); transform: translateY(-1px); box-shadow: 0 5px 14px rgba(34,197,94,0.38); }
      `}</style>

      <div className="sc-card" onClick={() => navigate('/services/' + service._id)}>
        <div className="sc-img-wrap">
          {imageUrl
            ? <img src={imageUrl} alt={service.title} loading="lazy" />
            : <div className="sc-no-img">🧑‍💼</div>
          }
        </div>

        <div className="sc-body">
          {service.category && (
            <span className="sc-cat-badge" style={{ backgroundColor: cat.bg, color: cat.color }}>
              {service.category}
            </span>
          )}
          <p className="sc-title">{service.title}</p>
          {service.pricePerHour && (
            <p className="sc-price">${service.pricePerHour}<span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af' }}>/hr</span></p>
          )}
          {service.description && (
            <p className="sc-desc">{service.description}</p>
          )}
          <p className="sc-location">
            📍 {service.location?.city}{service.location?.area ? ', ' + service.location.area : ''}
          </p>
        </div>

        <div className="sc-footer">
          <button className="sc-wa-btn" onClick={handleWhatsApp}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>
    </>
  )
}