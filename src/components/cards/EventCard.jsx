import { useNavigate } from 'react-router-dom'
export default function EventCard({ event }) {

  const navigate = useNavigate()


  function getImageUrl(img) {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  const imageUrl = getImageUrl(event.image || event.images?.[0])
  const phone = event.phone?.replace(/\D/g, '') || ''
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in the event: ' + event.title)

  function handleCardClick() {

    navigate(`/events/${event._id}`)
  }
  function handleWhatsApp(e) {
    e.stopPropagation()
    window.open(waLink, '_blank')
  }

  const eventDate = event.date ? new Date(event.date) : null
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''
  const dayNum = eventDate ? eventDate.getDate() : null
  const monthShort = eventDate ? eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : null
  const isPast = eventDate ? eventDate < new Date() : false

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ec-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          position: relative;
          cursor: pointer;
        }
        .ec-card:hover { transform: translateY(-5px); box-shadow: 0 16px 36px rgba(0,0,0,0.12); }

        .ec-img-wrap {
          width: 100%;
          aspect-ratio: 16/10;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          position: relative;
          overflow: hidden;
        }
        .ec-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.35s ease; }
        .ec-card:hover .ec-img-wrap img { transform: scale(1.05); }
        .ec-no-img {
          width: 100%; height: 100%; display: flex; align-items: center;
          justify-content: center; font-size: 48px;
        }

        .ec-date-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: white;
          border-radius: 10px;
          padding: 5px 10px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
          min-width: 44px;
        }
        .ec-date-month { font-size: 9px; font-weight: 800; color: #be185d; letter-spacing: 0.5px; }
        .ec-date-day { font-size: 17px; font-weight: 800; color: #0f172a; line-height: 1.1; }

        .ec-past-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 20px;
        }

        .ec-body { padding: 14px; flex: 1; display: flex; flex-direction: column; }

        .ec-title {
          font-weight: 700;
          font-size: 15px;
          color: #111827;
          margin: 0 0 6px;
          line-height: 1.35;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .ec-date-text {
          color: #be185d;
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .ec-location {
          color: #9ca3af;
          font-size: 11.5px;
          margin: 0 0 14px;
        }

        .ec-footer { margin-top: auto; }
        .ec-wa-btn {
          width: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 11px;
          font-size: 12.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 3px 10px rgba(34,197,94,0.28);
          transition: all 0.2s ease;
        }
        .ec-wa-btn:hover { background: linear-gradient(135deg, #16a34a, #15803d); transform: translateY(-1px); box-shadow: 0 5px 14px rgba(34,197,94,0.38); }
      `}</style>


      <div className="ec-card" onClick={handleCardClick}>

        <div className="ec-img-wrap">
          {imageUrl
            ? <img src={imageUrl} alt={event.title} loading="lazy" />
            : <div className="ec-no-img">🎉</div>
          }
          {dayNum && (
            <div className="ec-date-badge">
              <div className="ec-date-month">{monthShort}</div>
              <div className="ec-date-day">{dayNum}</div>
            </div>
          )}
          {isPast && <div className="ec-past-badge">Past Event</div>}
        </div>

        <div className="ec-body">
          <p className="ec-title">{event.title}</p>
          {formattedDate && (
            <p className="ec-date-text">📅 {formattedDate}</p>
          )}
          <p className="ec-location">
            📍 {event.location?.city}{event.location?.area ? ', ' + event.location.area : ''}
          </p>

          <div className="ec-footer">
            <button className="ec-wa-btn" onClick={handleWhatsApp}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  )
}