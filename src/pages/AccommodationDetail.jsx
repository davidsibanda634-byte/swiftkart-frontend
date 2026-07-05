import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const AMENITY_ICONS = {
  'WiFi': '📶', 'Parking': '🚗', 'Security': '🔒', 'Water': '💧',
  'Electricity': '⚡', 'Kitchen': '🍳', 'Laundry': '👕', 'Garden': '🌿',
  'Swimming Pool': '🏊', 'Gym': '💪', 'CCTV': '📹', 'Generator': '⚙️',
}

export default function AccommodationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [accommodation, setAccommodation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [similar, setSimilar] = useState([])

  useEffect(() => {
    api.get('/accommodations/' + id)
      .then(res => {
        setAccommodation(res.data)
        return api.get('/accommodations')
      })
      .then(res => {
        const sim = res.data
          .filter(a => a._id !== id && a.propertyType === res.data.find(x => x._id === id)?.propertyType)
          .slice(0, 3)
        setSimilar(sim)
      })
      .catch(() => navigate('/accommodation'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb' }}>
      <p style={{ color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Loading...</p>
    </div>
  )

  if (!accommodation) return null

  const phone = accommodation.phone ? accommodation.phone.replace(/\D/g, '') : ''
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in your property: ' + accommodation.title)
  const postedDate = accommodation.createdAt
    ? new Date(accommodation.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .acd-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .acd-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; background: white; border-bottom: 1px solid #f1f5f9;
          position: sticky; top: 60px; z-index: 50;
        }
        .acd-back { background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 700; color: #374151; display: flex; align-items: center; gap: 5px; font-family: inherit; }

        /* Image Gallery */
        .acd-gallery { position: relative; background: #0f172a; }
        .acd-main-img { width: 100%; max-height: 420px; object-fit: cover; cursor: pointer; display: block; }
        .acd-no-img { width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; font-size: 80px; background: linear-gradient(135deg, #eff6ff, #dbeafe); }
        .acd-thumbs { display: flex; gap: 6px; padding: 8px 12px; background: #0f172a; overflow-x: auto; scrollbar-width: none; }
        .acd-thumbs::-webkit-scrollbar { display: none; }
        .acd-thumb { width: 64px; height: 46px; object-fit: cover; border-radius: 7px; cursor: pointer; opacity: 0.6; border: 2px solid transparent; flex-shrink: 0; transition: all 0.2s; }
        .acd-thumb.active { opacity: 1; border-color: #2196F3; }
        .acd-img-count { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.5); color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 10px; backdrop-filter: blur(6px); }

        /* Lightbox */
        .acd-lightbox {
          position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 2000;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .acd-lightbox-img { max-width: 90vw; max-height: 85vh; object-fit: contain; border-radius: 8px; }
        .acd-lightbox-close { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.15); border: none; color: white; width: 38px; height: 38px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .acd-lightbox-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: white; width: 42px; height: 42px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .acd-lightbox-arrow:hover { background: rgba(255,255,255,0.25); }
        .acd-lightbox-arrow.left { left: 16px; }
        .acd-lightbox-arrow.right { right: 16px; }

        /* Content */
        .acd-content { max-width: 800px; margin: 0 auto; padding: 20px 16px 120px; }

        .acd-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; margin-bottom: 16px; }
        .acd-card-header { padding: 16px 18px; border-bottom: 1px solid #f8fafc; }
        .acd-card-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
        .acd-prop-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.25; }
        .acd-type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; flex-shrink: 0; }
        .acd-type-badge.rent { background: #dcfce7; color: #16a34a; }
        .acd-type-badge.sale { background: #fef3c7; color: #d97706; }

        .acd-location { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 5px; margin-bottom: 12px; }

        .acd-specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .acd-spec-box { background: #f8fafc; border-radius: 10px; padding: 10px; text-align: center; }
        .acd-spec-icon { font-size: 20px; margin-bottom: 4px; }
        .acd-spec-value { font-size: 14px; font-weight: 800; color: #0f172a; }
        .acd-spec-label { font-size: 10px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }

        .acd-section-pad { padding: 16px 18px; }
        .acd-section-label { font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px; }
        .acd-description { font-size: 14px; color: #374151; line-height: 1.85; white-space: pre-wrap; }

        .acd-amenities { display: flex; flex-wrap: wrap; gap: 8px; }
        .acd-amenity { display: flex; align-items: center; gap: 6px; background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 700; }

        .acd-price-card { background: linear-gradient(135deg, #0f4c81, #1a237e); border-radius: 14px; padding: 18px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
        .acd-price-main { font-size: 28px; font-weight: 800; color: white; }
        .acd-price-type { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 2px; }
        .acd-available-badge { background: rgba(0,255,150,0.15); border: 1px solid rgba(0,255,150,0.3); color: #34d399; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }

        /* Sticky CTA */
        .acd-cta { position: sticky; bottom: 62px; background: white; padding: 14px 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.07); z-index: 40; }
        .acd-wa-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; background: linear-gradient(135deg, #25d366, #16a34a);
          color: white; border: none; padding: 15px; border-radius: 14px;
          font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit;
          text-decoration: none; box-shadow: 0 4px 16px rgba(37,211,102,0.35);
        }

        /* Similar */
        .acd-similar-card {
          background: white; border-radius: 12px; padding: 12px 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          display: flex; gap: 12px; align-items: center; cursor: pointer;
          transition: transform 0.2s; margin-bottom: 10px;
        }
        .acd-similar-card:hover { transform: translateY(-2px); }
        .acd-similar-img { width: 70px; height: 52px; border-radius: 9px; object-fit: cover; flex-shrink: 0; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 24px; }

        @media (min-width: 769px) {
          .acd-cta { position: static; box-shadow: none; background: transparent; padding: 0; margin-bottom: 16px; }
          .acd-specs-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 768px) {
          .acd-specs-grid { grid-template-columns: repeat(2, 1fr); }
          .acd-prop-title { font-size: 18px; }
        }
      `}</style>

      <div className="acd-root">

        {lightbox && accommodation.images?.length > 0 && (
          <div className="acd-lightbox" onClick={() => setLightbox(false)}>
            <button className="acd-lightbox-close" onClick={() => setLightbox(false)}>✕</button>
            <button className="acd-lightbox-arrow left" onClick={e => { e.stopPropagation(); setActiveImg(prev => (prev - 1 + accommodation.images.length) % accommodation.images.length) }}>‹</button>
            <img className="acd-lightbox-img" src={accommodation.images[activeImg]} alt="" onClick={e => e.stopPropagation()} />
            <button className="acd-lightbox-arrow right" onClick={e => { e.stopPropagation(); setActiveImg(prev => (prev + 1) % accommodation.images.length) }}>›</button>
          </div>
        )}

        <div className="acd-topbar">
          <button className="acd-back" onClick={() => navigate(-1)}>← Back</button>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>🏠 {accommodation.propertyType}</span>
        </div>

        {/* Image Gallery */}
        <div className="acd-gallery">
          {accommodation.images?.length > 0 ? (
            <>
              <img
                className="acd-main-img"
                src={accommodation.images[activeImg]}
                alt={accommodation.title}
                onClick={() => setLightbox(true)}
              />
              {accommodation.images.length > 1 && (
                <>
                  <div className="acd-img-count">📷 {activeImg + 1} / {accommodation.images.length}</div>
                  <div className="acd-thumbs">
                    {accommodation.images.map((img, i) => (
                      <img key={i} className={'acd-thumb' + (i === activeImg ? ' active' : '')} src={img} alt="" onClick={() => setActiveImg(i)} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="acd-no-img">🏠</div>
          )}
        </div>

        <div className="acd-content">

          {/* Price card */}
          <div className="acd-price-card">
            <div>
              <div className="acd-price-main">${accommodation.price?.toLocaleString()}</div>
              <div className="acd-price-type">{accommodation.priceType}</div>
            </div>
            <div className="acd-available-badge">
              {accommodation.available ? '✅ Available' : '❌ Unavailable'}
            </div>
          </div>

          {/* Main info card */}
          <div className="acd-card">
            <div className="acd-card-header">
              <div className="acd-card-title-row">
                <h1 className="acd-prop-title">{accommodation.title}</h1>
                <span className={'acd-type-badge ' + (accommodation.listingType === 'For Rent' ? 'rent' : 'sale')}>
                  {accommodation.listingType === 'For Rent' ? '🔑 For Rent' : '🏷️ For Sale'}
                </span>
              </div>
              <p className="acd-location">
                📍 {accommodation.location?.address ? accommodation.location.address + ', ' : ''}{accommodation.location?.area ? accommodation.location.area + ', ' : ''}{accommodation.location?.city}{accommodation.location?.country ? ', ' + accommodation.location.country : ''}
              </p>
              <div className="acd-specs-grid">
                <div className="acd-spec-box">
                  <div className="acd-spec-icon">🛏️</div>
                  <div className="acd-spec-value">{accommodation.bedrooms}</div>
                  <div className="acd-spec-label">Bedroom{accommodation.bedrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="acd-spec-box">
                  <div className="acd-spec-icon">🚿</div>
                  <div className="acd-spec-value">{accommodation.bathrooms}</div>
                  <div className="acd-spec-label">Bathroom{accommodation.bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="acd-spec-box">
                  <div className="acd-spec-icon">🛋️</div>
                  <div className="acd-spec-value" style={{ fontSize: '11px' }}>{accommodation.furnished}</div>
                  <div className="acd-spec-label">Furnished</div>
                </div>
                <div className="acd-spec-box">
                  <div className="acd-spec-icon">🏠</div>
                  <div className="acd-spec-value" style={{ fontSize: '11px' }}>{accommodation.propertyType}</div>
                  <div className="acd-spec-label">Type</div>
                </div>
              </div>
            </div>

            {accommodation.description && (
              <div className="acd-section-pad" style={{ borderTop: '1px solid #f8fafc' }}>
                <p className="acd-section-label">Description</p>
                <p className="acd-description">{accommodation.description}</p>
              </div>
            )}

            {accommodation.amenities?.length > 0 && (
              <div className="acd-section-pad" style={{ borderTop: '1px solid #f8fafc' }}>
                <p className="acd-section-label">Amenities</p>
                <div className="acd-amenities">
                  {accommodation.amenities.map(am => (
                    <span key={am} className="acd-amenity">
                      {AMENITY_ICONS[am] || '✅'} {am}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(accommodation.availableFrom || postedDate) && (
              <div className="acd-section-pad" style={{ borderTop: '1px solid #f8fafc', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {accommodation.availableFrom && (
                  <div>
                    <p className="acd-section-label" style={{ marginBottom: '4px' }}>Available From</p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 }}>
                      📅 {new Date(accommodation.availableFrom).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}
                {postedDate && (
                  <div>
                    <p className="acd-section-label" style={{ marginBottom: '4px' }}>Listed On</p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 }}>🗓️ {postedDate}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp CTA */}
          {phone && (
            <div className="acd-cta">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="acd-wa-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact Landlord on WhatsApp
              </a>
            </div>
          )}

          {/* Similar properties */}
          {similar.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '5px', height: '22px', background: 'linear-gradient(180deg,#0f4c81,#1a237e)', borderRadius: '3px' }} />
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Similar Properties</span>
              </div>
              {similar.map(a => (
                <div key={a._id} className="acd-similar-card" onClick={() => navigate('/accommodation/' + a._id)}>
                  <div className="acd-similar-img">
                    {a.images?.[0] ? <img src={a.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9px' }} /> : '🏠'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                    <p style={{ margin: '0 0 4px', fontSize: '11.5px', color: '#9ca3af' }}>📍 {a.location?.city}{a.location?.area ? ', ' + a.location.area : ''}</p>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0f4c81' }}>${a.price?.toLocaleString()} <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>{a.priceType}</span></p>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: a.listingType === 'For Rent' ? '#dcfce7' : '#fef3c7', color: a.listingType === 'For Rent' ? '#16a34a' : '#d97706', flexShrink: 0 }}>
                    {a.listingType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}