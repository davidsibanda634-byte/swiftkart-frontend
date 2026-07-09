import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [similar, setSimilar] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api.get('/services')
      .then(res => {
        const found = res.data.find(s => s._id === id)
        if (!found) { navigate('/services'); return }
        setService(found)
        setSimilar(res.data.filter(s => s._id !== id && s.category === found.category).slice(0, 3))
      })
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false))
  }, [id])

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShareWA() {
    const text = 'Check out this service on Scalablenexus: *' + (service?.title || '') + '*\n' + window.location.href
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb' }}>
      <p style={{ color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Loading...</p>
    </div>
  )

  if (!service) return null

  const phone = service.phone ? service.phone.replace(/\D/g, '') : ''
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in your service: ' + service.title)
  const postedDate = service.createdAt
    ? new Date(service.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sd-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .sd-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; background: white; border-bottom: 1px solid #f1f5f9;
          position: sticky; top: 60px; z-index: 50;
        }
        .sd-back { background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 700; color: #374151; display: flex; align-items: center; gap: 5px; font-family: inherit; }
        .sd-share-row { display: flex; gap: 8px; }
        .sd-btn-wa { background: #25d366; color: white; border: none; padding: 7px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: inherit; }
        .sd-btn-copy { background: #f1f5f9; color: #374151; border: none; padding: 7px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }

        .sd-header { background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%); padding: 24px 16px 28px; }
        .sd-header-inner { max-width: 760px; margin: 0 auto; }
        .sd-cat-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 10.5px; font-weight: 800; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); margin-bottom: 10px; }
        .sd-title { font-size: 24px; font-weight: 800; color: white; margin: 0 0 10px; line-height: 1.2; letter-spacing: -0.4px; }
        .sd-meta { display: flex; gap: 16px; flex-wrap: wrap; }
        .sd-meta-item { font-size: 12.5px; color: rgba(255,255,255,0.6); font-weight: 500; display: flex; align-items: center; gap: 5px; }

        .sd-gallery { position: relative; background: #0f172a; }
        .sd-main-img { width: 100%; max-height: 380px; object-fit: cover; display: block; cursor: pointer; }
        .sd-no-img { width: 100%; height: 260px; display: flex; align-items: center; justify-content: center; font-size: 80px; background: linear-gradient(135deg, #f5f3ff, #ede9fe); }
        .sd-thumbs { display: flex; gap: 6px; padding: 8px 12px; background: #0f172a; overflow-x: auto; scrollbar-width: none; }
        .sd-thumbs::-webkit-scrollbar { display: none; }
        .sd-thumb { width: 64px; height: 46px; object-fit: cover; border-radius: 7px; cursor: pointer; opacity: 0.6; border: 2px solid transparent; flex-shrink: 0; transition: all 0.2s; }
        .sd-thumb.active { opacity: 1; border-color: #7c3aed; }
        .sd-img-count { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.5); color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 10px; backdrop-filter: blur(6px); }

        .sd-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .sd-lightbox-img { max-width: 90vw; max-height: 85vh; object-fit: contain; border-radius: 8px; }
        .sd-lightbox-close { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.15); border: none; color: white; width: 38px; height: 38px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .sd-lightbox-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: white; width: 42px; height: 42px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .sd-lightbox-arrow.left { left: 16px; }
        .sd-lightbox-arrow.right { right: 16px; }

        .sd-content { max-width: 760px; margin: 0 auto; padding: 20px 16px 120px; }

        .sd-price-card { background: linear-gradient(135deg, #4c1d95, #7c3aed); border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; }
        .sd-price-main { font-size: 26px; font-weight: 800; color: white; }
        .sd-price-sub { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px; }

        .sd-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; margin-bottom: 14px; }
        .sd-card-header { padding: 14px 18px; border-bottom: 1px solid #f8fafc; font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; }
        .sd-card-body { padding: 16px 18px; }
        .sd-description { font-size: 14px; color: #374151; line-height: 1.85; white-space: pre-wrap; }

        .sd-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .sd-info-box { background: #f8fafc; border-radius: 10px; padding: 12px; }
        .sd-info-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 4px; }
        .sd-info-value { font-size: 13px; font-weight: 700; color: #0f172a; }

        .sd-cta { position: sticky; bottom: 62px; background: white; padding: 14px 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.07); z-index: 40; }
        .sd-wa-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: linear-gradient(135deg, #25d366, #16a34a); color: white; border: none; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; text-decoration: none; box-shadow: 0 4px 16px rgba(37,211,102,0.35); }

        .sd-similar-card { background: white; border-radius: 12px; padding: 12px 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: flex; gap: 12px; align-items: center; cursor: pointer; transition: transform 0.2s; margin-bottom: 10px; }
        .sd-similar-card:hover { transform: translateY(-2px); }
        .sd-similar-img { width: 70px; height: 52px; border-radius: 9px; object-fit: cover; flex-shrink: 0; background: #f5f3ff; display: flex; align-items: center; justify-content: center; font-size: 24px; }

        @media (min-width: 769px) { .sd-cta { position: static; box-shadow: none; background: transparent; padding: 0; margin-bottom: 16px; } }
        @media (max-width: 480px) { .sd-info-grid { grid-template-columns: 1fr; } }
      `}</style>

      {lightbox && service.images?.length > 0 && (
        <div className="sd-lightbox" onClick={() => setLightbox(false)}>
          <button className="sd-lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <button className="sd-lightbox-arrow left" onClick={e => { e.stopPropagation(); setActiveImg(prev => (prev - 1 + service.images.length) % service.images.length) }}>‹</button>
          <img className="sd-lightbox-img" src={service.images[activeImg]} alt="" onClick={e => e.stopPropagation()} />
          <button className="sd-lightbox-arrow right" onClick={e => { e.stopPropagation(); setActiveImg(prev => (prev + 1) % service.images.length) }}>›</button>
        </div>
      )}

      <div className="sd-root">
        <div className="sd-topbar">
          <button className="sd-back" onClick={() => navigate(-1)}>← Back</button>
          <div className="sd-share-row">
            <button className="sd-btn-wa" onClick={handleShareWA}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share
            </button>
            <button className="sd-btn-copy" onClick={handleCopyLink}>{copied ? '✅' : '🔗'}</button>
          </div>
        </div>

        <div className="sd-header">
          <div className="sd-header-inner">
            {service.category && <div className="sd-cat-badge">🧑‍💼 {service.category}</div>}
            <h1 className="sd-title">{service.title}</h1>
            <div className="sd-meta">
              {service.location?.city && <span className="sd-meta-item">📍 {service.location.city}{service.location.area ? ', ' + service.location.area : ''}</span>}
              {postedDate && <span className="sd-meta-item">🗓️ Posted {postedDate}</span>}
              {service.user?.name && <span className="sd-meta-item">👤 {service.user.name}</span>}
            </div>
          </div>
        </div>

        {service.images?.length > 0 ? (
          <div className="sd-gallery">
            <img className="sd-main-img" src={service.images[activeImg]} alt={service.title} onClick={() => setLightbox(true)} />
            {service.images.length > 1 && (
              <>
                <div className="sd-img-count">📷 {activeImg + 1} / {service.images.length}</div>
                <div className="sd-thumbs">
                  {service.images.map((img, i) => (
                    <img key={i} className={'sd-thumb' + (i === activeImg ? ' active' : '')} src={img} alt="" onClick={() => setActiveImg(i)} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="sd-no-img">🧑‍💼</div>
        )}

        <div className="sd-content">

          {service.pricePerHour && (
            <div className="sd-price-card">
              <div>
                <div className="sd-price-main">${service.pricePerHour}</div>
                <div className="sd-price-sub">per hour</div>
              </div>
              <span style={{ fontSize: '28px' }}>🧑‍💼</span>
            </div>
          )}

          {service.description && (
            <div className="sd-card">
              <div className="sd-card-header">About this Service</div>
              <div className="sd-card-body">
                <p className="sd-description">{service.description}</p>
              </div>
            </div>
          )}

          <div className="sd-card">
            <div className="sd-card-header">Service Details</div>
            <div className="sd-card-body">
              <div className="sd-info-grid">
                {service.category && (
                  <div className="sd-info-box">
                    <div className="sd-info-label">Category</div>
                    <div className="sd-info-value">🧑‍💼 {service.category}</div>
                  </div>
                )}
                {service.location?.country && (
                  <div className="sd-info-box">
                    <div className="sd-info-label">Country</div>
                    <div className="sd-info-value">🌍 {service.location.country}</div>
                  </div>
                )}
                {service.location?.city && (
                  <div className="sd-info-box">
                    <div className="sd-info-label">City</div>
                    <div className="sd-info-value">🏙️ {service.location.city}</div>
                  </div>
                )}
                {service.location?.area && (
                  <div className="sd-info-box">
                    <div className="sd-info-label">Area / Campus</div>
                    <div className="sd-info-value">📍 {service.location.area}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {phone && (
            <div className="sd-cta">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="sd-wa-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact on WhatsApp
              </a>
            </div>
          )}

          {similar.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '5px', height: '22px', background: 'linear-gradient(180deg,#4c1d95,#7c3aed)', borderRadius: '3px' }} />
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Similar Services</span>
              </div>
              {similar.map(s => (
                <div key={s._id} className="sd-similar-card" onClick={() => navigate('/services/' + s._id)}>
                  <div className="sd-similar-img">
                    {s.images?.[0] ? <img src={s.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9px' }} /> : '🧑‍💼'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</p>
                    <p style={{ margin: '0 0 3px', fontSize: '11.5px', color: '#9ca3af' }}>📍 {s.location?.city}{s.location?.area ? ', ' + s.location.area : ''}</p>
                    {s.pricePerHour && <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#7c3aed' }}>${s.pricePerHour}/hr</p>}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: '#f5f3ff', color: '#6d28d9', flexShrink: 0 }}>
                    {s.category}
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