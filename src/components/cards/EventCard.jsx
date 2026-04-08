export default function EventCard({ event }) {
  const phone = event.phone?.replace(/\D/g, '')
  const message = `Hi, I am interested in the event: ${event.title}`
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    : ''

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: '16px',
      display: 'flex',
      gap: '14px',
      alignItems: 'flex-start',
      transition: 'transform 0.2s'
    }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        width: '80px', height: '80px', borderRadius: '10px',
        overflow: 'hidden', flexShrink: 0, backgroundColor: '#f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px'
      }}>
        {event.image
          ? <img src={`http://localhost:5000/${event.image}`} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '🎉'}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{event.title}</p>
        {formattedDate && <p style={{ color: '#1a56db', fontSize: '12px', fontWeight: '500', marginTop: '2px' }}>{formattedDate}</p>}
        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px', marginBottom: '12px' }}>
          {event.location?.city}{event.location?.area ? `, ${event.location.area}` : ''}
        </p>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <button style={{
            width: '100%',
            backgroundColor: '#25d366',
            color: 'white',
            border: 'none',
            padding: '9px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>💬 Contact on WhatsApp</button>
        </a>
      </div>
    </div>
  )
}