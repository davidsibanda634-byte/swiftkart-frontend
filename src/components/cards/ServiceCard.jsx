export default function ServiceCard({ service }) {
  const phone = service.phone?.replace(/\D/g, '')
  const message = `Hi, I am interested in your service: ${service.title}`
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s'
    }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        height: '150px',
        backgroundColor: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px'
      }}>🧑‍💼</div>
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontWeight: '600', fontSize: '14px', color: '#111827', marginBottom: '4px' }}>{service.title}</p>
        {service.pricePerHour && (
          <p style={{ color: '#1a56db', fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>${service.pricePerHour}/hr</p>
        )}
        <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>{service.description}</p>
        <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>
          {service.location?.city}{service.location?.area ? `, ${service.location.area}` : ''}
        </p>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto' }}>
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