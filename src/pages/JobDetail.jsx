import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import linkify from '../utils/linkify'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    api.get('/jobs')
      .then(function(res) {
        const found = res.data.find(function(j) { return j._id === id })
        if (!found) { navigate('/jobs'); return }
        setJob(found)
      })
      .catch(function() { navigate('/jobs') })
      .finally(function() { setLoading(false) })
  }, [id])

  if (loading) return (
    <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      Loading...
    </p>
  )

  if (!job) return null

  const phone = job.phone ? job.phone.replace(/\D/g, '') : ''
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in the job: ' + job.title)
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#f4f7fb', minHeight: '100vh', padding: '24px 20px 60px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <button
          onClick={function() { navigate(-1) }}
          style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#374151', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', fontWeight: 600 }}
        >← Back to Jobs</button>

        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,.08)', padding: '28px' }}>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'linear-gradient(135deg,#fef3c7,#fde68a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', flexShrink: 0
            }}>💼</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#08162F', margin: 0, lineHeight: 1.3 }}>
                {job.title}
              </h1>
              {job.company && (
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '6px 0 0', fontWeight: 600 }}>
                  🏢 {job.company}
                </p>
              )}
            </div>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
            📍 {job.location && job.location.city}{job.location && job.location.area ? ', ' + job.location.area : ''}
            {postedDate ? ' • Posted ' + postedDate : ''}
          </p>

          {job.description && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '10px' }}>
                Full Description
              </p>
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {linkify(job.description)}
              </p>
            </div>
          )}

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>
            💡 <strong>Tip:</strong> If a link is included above, click it to apply directly. Otherwise contact the poster on WhatsApp below.
          </div>

          {phone && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', background: 'linear-gradient(135deg,#25d366,#16a34a)',
              color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
              fontSize: '15px', fontWeight: 800, cursor: 'pointer', textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(37,211,102,.35)', boxSizing: 'border-box'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}