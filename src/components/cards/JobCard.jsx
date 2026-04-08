export default function JobCard({ job }) {
  const phone = job.phone?.replace(/\D/g, '')
  const message = `Hi, I am interested in the job: ${job.title}`
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

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
        width: '50px', height: '50px', borderRadius: '50%',
        backgroundColor: '#eff6ff', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', flexShrink: 0
      }}>💼</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{job.title}</p>
        {job.company && <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{job.company}</p>}
        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px', marginBottom: '12px' }}>
          {job.location?.city}{job.location?.area ? `, ${job.location.area}` : ''}
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