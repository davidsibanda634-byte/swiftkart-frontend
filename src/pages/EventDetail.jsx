import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [event, setEvent]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [similar, setSimilar]   = useState([])
  const [copied, setCopied]     = useState(false)

  const [ticketTypes, setTicketTypes] = useState([])


  useEffect(() => {
    api.get('/events')
      .then(res => {
        const found = res.data.find(e => e._id === id)
        if (!found) { navigate('/events'); return }
        setEvent(found)
        setSimilar(res.data.filter(e => e._id !== id).slice(0, 3))
      })
      .catch(() => navigate('/events'))
      .finally(() => setLoading(false))
  }, [id])


  // Fetch ticket types for this event


  useEffect(() => {


    api.get(`/ticket-types/event/${id}`)


      .then(res => setTicketTypes(res.data))


      .catch(() => {})


  }, [id])


  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShareWA() {
    const text = 'Check out this event on Scalablenexus: *' + (event?.title || '') + '*\n' + window.location.href
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb' }}>
      <p style={{ color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Loading...</p>
    </div>
  )

  if (!event) return null

  const phone     = event.phone ? event.phone.replace(/\D/g, '') : ''
  const waLink    = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in the event: ' + event.title)
  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const isPast    = event.date && new Date(event.date) < new Date()
  const postedDate = event.createdAt
    ? new Date(event.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''


  const isOrganizer = user && (event.user?._id === user._id || event.user === user._id)


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .edd-root { font-family:'Plus Jakarta Sans',sans-serif; background:#f4f7fb; min-height:100vh; }
        .edd-topbar { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:white; border-bottom:1px solid #f1f5f9; position:sticky; top:60px; z-index:50; }
        .edd-back { background:none; border:none; cursor:pointer; font-size:13px; font-weight:700; color:#374151; display:flex; align-items:center; gap:5px; font-family:inherit; }
        .edd-share-row { display:flex; gap:8px; }
        .edd-btn-wa { background:#25d366; color:white; border:none; padding:7px 12px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:5px; font-family:inherit; }
        .edd-btn-copy { background:#f1f5f9; color:#374151; border:none; padding:7px 12px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; }
        .edd-header { background:linear-gradient(135deg,#7c2d12 0%,#be185d 100%); padding:24px 16px 28px; }
        .edd-header-inner { max-width:760px; margin:0 auto; }
        .edd-badges { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
        .edd-badge { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:20px; font-size:10.5px; font-weight:800; }
        .edd-badge.upcoming { background:rgba(0,200,150,0.2); color:#34d399; border:1px solid rgba(0,200,150,0.3); }
        .edd-badge.past { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.5); }
        .edd-title { font-size:24px; font-weight:800; color:white; margin:0 0 10px; line-height:1.2; letter-spacing:-0.4px; }
        .edd-meta { display:flex; gap:16px; flex-wrap:wrap; }
        .edd-meta-item { font-size:12.5px; color:rgba(255,255,255,0.6); font-weight:500; display:flex; align-items:center; gap:5px; }
        .edd-gallery { position:relative; background:#0f172a; }
        .edd-main-img { width:100%; max-height:380px; object-fit:cover; display:block; cursor:pointer; }
        .edd-no-img { width:100%; height:260px; display:flex; align-items:center; justify-content:center; font-size:80px; background:linear-gradient(135deg,#fdf2f8,#fce7f3); }
        .edd-thumbs { display:flex; gap:6px; padding:8px 12px; background:#0f172a; overflow-x:auto; scrollbar-width:none; }
        .edd-thumbs::-webkit-scrollbar { display:none; }
        .edd-thumb { width:64px; height:46px; object-fit:cover; border-radius:7px; cursor:pointer; opacity:0.6; border:2px solid transparent; flex-shrink:0; transition:all 0.2s; }
        .edd-thumb.active { opacity:1; border-color:#be185d; }
        .edd-img-count { position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.5); color:white; font-size:11px; font-weight:700; padding:4px 10px; border-radius:10px; backdrop-filter:blur(6px); }
        .edd-lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; }
        .edd-lightbox-img { max-width:90vw; max-height:85vh; object-fit:contain; border-radius:8px; }
        .edd-lightbox-close { position:absolute; top:16px; right:16px; background:rgba(255,255,255,0.15); border:none; color:white; width:38px; height:38px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .edd-lightbox-arrow { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.15); border:none; color:white; width:42px; height:42px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .edd-lightbox-arrow.left { left:16px; }
        .edd-lightbox-arrow.right { right:16px; }
        .edd-content { max-width:760px; margin:0 auto; padding:20px 16px 120px; }
        .edd-card { background:white; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); border:1px solid #f1f5f9; overflow:hidden; margin-bottom:14px; }
        .edd-card-header { padding:14px 18px; border-bottom:1px solid #f8fafc; font-size:11px; font-weight:800; color:#9ca3af; text-transform:uppercase; letter-spacing:0.6px; }
        .edd-card-body { padding:16px 18px; }
        .edd-date-card { background:linear-gradient(135deg,#7c2d12,#be185d); border-radius:14px; padding:16px 18px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; }
        .edd-date-main { font-size:16px; font-weight:800; color:white; }
        .edd-date-sub { font-size:12px; color:rgba(255,255,255,0.6); margin-top:3px; font-weight:500; }
        .edd-status-badge { padding:6px 14px; border-radius:20px; font-size:12px; font-weight:700; }
        .edd-status-badge.upcoming { background:rgba(0,200,150,0.2); color:#34d399; border:1px solid rgba(0,200,150,0.3); }
        .edd-status-badge.past { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.5); }
        .edd-description { font-size:14px; color:#374151; line-height:1.85; white-space:pre-wrap; }
        .edd-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .edd-info-box { background:#f8fafc; border-radius:10px; padding:12px; }
        .edd-info-label { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.3px; margin-bottom:4px; }
        .edd-info-value { font-size:13px; font-weight:700; color:#0f172a; }
        .edd-cta { position:sticky; bottom:62px; background:white; padding:14px 16px; box-shadow:0 -4px 20px rgba(0,0,0,0.07); z-index:40; }
        .edd-wa-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; background:linear-gradient(135deg,#25d366,#16a34a); color:white; border:none; padding:15px; border-radius:14px; font-size:15px; font-weight:800; cursor:pointer; font-family:inherit; text-decoration:none; box-shadow:0 4px 16px rgba(37,211,102,0.35); }
        .edd-similar-card { background:white; border-radius:12px; padding:12px 14px; box-shadow:0 2px 8px rgba(0,0,0,0.05); border:1px solid #f1f5f9; display:flex; gap:12px; align-items:center; cursor:pointer; transition:transform 0.2s; margin-bottom:10px; }
        .edd-similar-card:hover { transform:translateY(-2px); }
        .edd-similar-img { width:70px; height:52px; border-radius:9px; object-fit:cover; flex-shrink:0; background:#fdf2f8; display:flex; align-items:center; justify-content:center; font-size:24px; }
        .edd-ticket-card { background:linear-gradient(135deg,#1a1a2e,#16213e); border-radius:16px; padding:20px 18px; margin-bottom:14px; border:1px solid rgba(255,255,255,0.08); }
        .edd-ticket-title { font-size:15px; font-weight:800; color:white; margin-bottom:4px; }
        .edd-ticket-sub { font-size:12px; color:rgba(255,255,255,0.5); margin-bottom:16px; }
        .edd-tt-grid { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; }
        .edd-tt-row { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; }
        .edd-tt-name { font-size:14px; font-weight:700; color:white; }
        .edd-tt-desc { font-size:11px; color:rgba(255,255,255,0.45); margin-top:2px; }
        .edd-tt-price { font-size:18px; font-weight:800; color:#34d399; }
        .edd-tt-remaining { font-size:10px; color:#fbbf24; margin-top:2px; text-align:right; }
        .edd-ticket-btn { display:block; width:100%; padding:14px; background:linear-gradient(135deg,#00b09b,#96c93d); color:white; border:none; border-radius:12px; font-size:15px; font-weight:800; cursor:pointer; font-family:inherit; text-align:center; text-decoration:none; box-shadow:0 4px 16px rgba(0,176,155,0.4); }
        .edd-organizer-link { display:block; text-align:center; margin-top:10px; font-size:12px; color:rgba(255,255,255,0.5); text-decoration:none; }
        .edd-organizer-link:hover { color:rgba(255,255,255,0.8); }
        @media(min-width:769px){ .edd-cta { position:static; box-shadow:none; background:transparent; padding:0; margin-bottom:16px; } .edd-title { font-size:28px; } }
        @media(max-width:480px){ .edd-info-grid { grid-template-columns:1fr; } }
      `}</style>

      {lightbox && event.images?.length > 0 && (
        <div className="edd-lightbox" onClick={() => setLightbox(false)}>
          <button className="edd-lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <button className="edd-lightbox-arrow left" onClick={e => { e.stopPropagation(); setActiveImg(prev => (prev - 1 + event.images.length) % event.images.length) }}>‹</button>
          <img className="edd-lightbox-img" src={event.images[activeImg]} alt="" onClick={e => e.stopPropagation()} />
          <button className="edd-lightbox-arrow right" onClick={e => { e.stopPropagation(); setActiveImg(prev => (prev + 1) % event.images.length) }}>›</button>
        </div>
      )}

      <div className="edd-root">
        <div className="edd-topbar">
          <button className="edd-back" onClick={() => navigate(-1)}>← Back</button>
          <div className="edd-share-row">
            <button className="edd-btn-wa" onClick={handleShareWA}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share
            </button>
            <button className="edd-btn-copy" onClick={handleCopyLink}>{copied ? '✅' : '🔗'}</button>
          </div>
        </div>

        <div className="edd-header">
          <div className="edd-header-inner">
            <div className="edd-badges">
              <span className={'edd-badge ' + (isPast ? 'past' : 'upcoming')}>
                {isPast ? '⏰ Past Event' : '🟢 Upcoming'}
              </span>

              {event.ticketsEnabled && <span className="edd-badge upcoming">🎟 Tickets Available</span>}

            </div>
           <h1 className="edd-title">{event.title}</h1>
            <div className="edd-meta">
           {event.location?.city && <span className="edd-meta-item">📍 {event.location.city}{event.location.area ? ', ' + event.location.area : ''}</span>}
           {postedDate && <span className="edd-meta-item">🗓️ Posted {postedDate}</span>}
           {/* ── Verified organizer badge ── */}
          {event.user?.isVerified && (
          <span className="edd-meta-item" style={{
             background: 'rgba(0,200,150,0.15)', color: '#34d399',
              padding: '3px 10px', borderRadius: '20px',
               border: '1px solid rgba(0,200,150,0.25)', fontWeight: 700
          }}>
             ✅ Verified Organizer
              </span>
          )}
        </div>
             </div>
        </div>

        {event.images?.length > 0 && (
          <div className="edd-gallery">
            <img className="edd-main-img" src={event.images[activeImg]} alt={event.title} onClick={() => setLightbox(true)} />
            {event.images.length > 1 && (
              <>
                <div className="edd-img-count">📷 {activeImg + 1} / {event.images.length}</div>
                <div className="edd-thumbs">
                  {event.images.map((img, i) => (
                    <img key={i} className={'edd-thumb' + (i === activeImg ? ' active' : '')} src={img} alt="" onClick={() => setActiveImg(i)} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        {!event.images?.length && <div className="edd-no-img">🎉</div>}

        <div className="edd-content">
          <div className="edd-date-card">
            <div>
              <div className="edd-date-main">📅 {eventDate || 'Date TBA'}</div>
              <div className="edd-date-sub">{event.location?.city || 'Location TBA'}</div>
            </div>
            <span className={'edd-status-badge ' + (isPast ? 'past' : 'upcoming')}>
              {isPast ? 'Past Event' : '✅ Upcoming'}
            </span>
          </div>

          {event.description && (
            <div className="edd-card">
              <div className="edd-card-header">About this Event</div>
              <div className="edd-card-body">
                <p className="edd-description">{event.description}</p>
              </div>
            </div>
          )}


          {/* ── Ticket section ──────────────────────────────── */}


          {event.ticketsEnabled && (


            <div className="edd-ticket-card">


              <div className="edd-ticket-title">🎟 Tickets</div>


              <div className="edd-ticket-sub">


                {event.capacity > 0 ? `${event.capacity - (event.ticketsSold || 0)} spots remaining` : 'Open attendance'}


              </div>


              {ticketTypes.length > 0 ? (


                <div className="edd-tt-grid">


                  {ticketTypes.map(tt => (


                    <div key={tt._id} className="edd-tt-row">


                      <div>


                        <div className="edd-tt-name">{tt.name}</div>


                        {tt.description && <div className="edd-tt-desc">{tt.description}</div>}


                      </div>


                      <div style={{ textAlign: 'right' }}>


                        <div className="edd-tt-price">{tt.price === 0 ? 'Free' : `$${tt.price}`}</div>


                        {tt.quantity > 0 && <div className="edd-tt-remaining">{tt.isSoldOut ? 'Sold out' : `${tt.remaining} left`}</div>}


                      </div>


                    </div>


                  ))}


                </div>


              ) : (


                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 16 }}>Ticket types loading...</p>


              )}


              {!isPast && (


                <Link to={`/events/${id}/get-ticket`} className="edd-ticket-btn">


                  🎟 Get a Ticket


                </Link>


              )}


              {isOrganizer && (


                <Link to={`/events/${id}/attendees`} className="edd-organizer-link">


                  📋 View attendees ({event.ticketsSold || 0} booked)


                </Link>


              )}


            </div>


          )}


          <div className="edd-card">
            <div className="edd-card-header">Event Details</div>
            <div className="edd-card-body">
              <div className="edd-info-grid">
                {event.location?.country && <div className="edd-info-box"><div className="edd-info-label">Country</div><div className="edd-info-value">🌍 {event.location.country}</div></div>}
                {event.location?.city && <div className="edd-info-box"><div className="edd-info-label">City</div><div className="edd-info-value">🏙️ {event.location.city}</div></div>}
                {event.location?.area && <div className="edd-info-box"><div className="edd-info-label">Area / Campus</div><div className="edd-info-value">📍 {event.location.area}</div></div>}
                {eventDate && <div className="edd-info-box"><div className="edd-info-label">Date</div><div className="edd-info-value">📅 {eventDate}</div></div>}
              </div>
            </div>
          </div>

          {phone && (
            <div className="edd-cta">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="edd-wa-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Contact Organiser on WhatsApp
              </a>
            </div>
          )}

          {similar.length > 0 && (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
                <div style={{ width:'5px', height:'22px', background:'linear-gradient(180deg,#7c2d12,#be185d)', borderRadius:'3px' }} />
                <span style={{ fontSize:'16px', fontWeight:800, color:'#0f172a' }}>More Events</span>
              </div>
              {similar.map(e => (
                <div key={e._id} className="edd-similar-card" onClick={() => navigate('/events/' + e._id)}>
                  <div className="edd-similar-img">
                    {e.images?.[0] ? <img src={e.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'9px' }} /> : '🎉'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 3px', fontSize:'13.5px', fontWeight:700, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.title}</p>
                    <p style={{ margin:'0 0 3px', fontSize:'11.5px', color:'#9ca3af' }}>📍 {e.location?.city}{e.location?.area ? ', ' + e.location.area : ''}</p>
                    {e.date && <p style={{ margin:0, fontSize:'11.5px', fontWeight:700, color:'#be185d' }}>📅 {new Date(e.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}