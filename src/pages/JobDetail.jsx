import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import linkify from '../utils/linkify'

const CAT_COLORS = {
  'Internship': { bg: '#eff6ff', color: '#1e40af' },
  'Part-Time': { bg: '#fef9c3', color: '#854d0e' },
  'Full-Time': { bg: '#f0fdf4', color: '#166534' },
  'Freelance': { bg: '#fdf2f8', color: '#9d174d' },
  'Volunteer': { bg: '#eef2ff', color: '#3730a3' },
  'Other': { bg: '#f9fafb', color: '#374151' },
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(function() {
    api.get('/jobs')
      .then(function(res) {
        const found = res.data.find(function(j) { return j._id === id })
        if (!found) { navigate('/jobs'); return }
        setJob(found)
        // Similar jobs — same category, exclude current
        const sim = res.data
          .filter(function(j) { return j._id !== id && j.category === found.category })
          .slice(0, 3)
        setSimilar(sim)
      })
      .catch(function() { navigate('/jobs') })
      .finally(function() { setLoading(false) })
  }, [id])

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(function() { setCopied(false) }, 2000)
  }

 async function handleShareWA() {
  const url = window.location.href
  const text = 'Check out this job on Scalablenexus: *' + job.title + '*\n' + url

  if (navigator.share) {
    try {
      // Jobs have no images so go straight to text share
      await navigator.share({
        title: job.title || 'Job on Scalablenexus',
        text,
        url,
      })
      return
    } catch (err) {
      if (err.name === 'AbortError') return
    }
  }

  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
}
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb' }}>
      <p style={{ color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }}>Loading...</p>
    </div>
  )

  if (!job) return null

  const phone = job.phone ? job.phone.replace(/\D/g, '') : ''
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in the job: ' + job.title)
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const catStyle = CAT_COLORS[job.category] || CAT_COLORS['Other']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .jd-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        /* Topbar */
        .jd-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; background: white;
          border-bottom: 1px solid #f1f5f9;
          position: sticky; top: 60px; z-index: 50;
        }
        .jd-back {
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 700; color: #374151;
          display: flex; align-items: center; gap: 6px;
          font-family: inherit; padding: 6px 0;
        }
        .jd-share-row { display: flex; gap: 8px; }
        .jd-btn-wa {
          background: #25d366; color: white; border: none;
          padding: 8px 14px; border-radius: 20px; font-size: 12px;
          font-weight: 700; cursor: pointer; display: flex; align-items: center;
          gap: 5px; font-family: inherit;
        }
        .jd-btn-copy {
          background: #f1f5f9; color: #374151; border: none;
          padding: 8px 14px; border-radius: 20px; font-size: 12px;
          font-weight: 700; cursor: pointer; font-family: inherit;
        }

        /* Header banner */
        .jd-header {
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          padding: 28px 20px 32px;
        }
        .jd-header-inner { max-width: 760px; margin: 0 auto; }

        .jd-icon-row {
          display: flex; align-items: flex-start; gap: 16px; margin-bottom: 14px;
        }
        .jd-icon {
          width: 60px; height: 60px; border-radius: 16px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .jd-header-info { flex: 1; min-width: 0; }
        .jd-cat-badge {
          display: inline-block; font-size: 10.5px; font-weight: 700;
          padding: 3px 11px; border-radius: 20px; margin-bottom: 8px;
        }
        .jd-title {
          font-size: 22px; font-weight: 800; color: white;
          margin: 0 0 6px; line-height: 1.25; letter-spacing: -0.4px;
        }
        .jd-company {
          font-size: 14px; color: rgba(255,255,255,0.65);
          font-weight: 600; margin: 0; display: flex; align-items: center; gap: 6px;
        }

        .jd-meta-row {
          display: flex; gap: 16px; flex-wrap: wrap; margin-top: 14px;
        }
        .jd-meta-item {
          font-size: 12.5px; color: rgba(255,255,255,0.5);
          font-weight: 500; display: flex; align-items: center; gap: 5px;
        }

        /* Content */
        .jd-content { max-width: 760px; margin: 0 auto; padding: 20px 16px 100px; }

        .jd-card {
          background: white; border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9; overflow: hidden; margin-bottom: 16px;
        }

        .jd-card-header {
          padding: 14px 18px; border-bottom: 1px solid #f8fafc;
          font-size: 11px; font-weight: 800; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.6px;
        }

        .jd-desc {
          padding: 18px; font-size: 14px; color: #374151;
          line-height: 1.85; white-space: pre-wrap; word-break: break-word;
        }
        .jd-desc a { color: #00C896; text-decoration: underline; }

        .jd-tip {
          background: #fffbeb; border: 1px solid #fde68a;
          border-radius: 12px; padding: 12px 16px; margin-bottom: 16px;
          font-size: 12.5px; color: #92400e; line-height: 1.6;
        }

        /* CTA */
        .jd-cta {
          position: sticky; bottom: 62px; background: white;
          padding: 14px 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
          z-index: 40;
        }
        .jd-wa-cta {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; background: linear-gradient(135deg, #25d366, #16a34a);
          color: white; border: none; padding: 15px; border-radius: 14px;
          font-size: 15px; font-weight: 800; cursor: pointer;
          font-family: inherit; text-decoration: none;
          box-shadow: 0 4px 16px rgba(37,211,102,0.35);
        }

        /* Similar jobs */
        .jd-similar { margin-bottom: 16px; }
        .jd-similar-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
        }
        .jd-similar-dot {
          width: 5px; height: 22px;
          background: linear-gradient(180deg, #d97706, #f59e0b);
          border-radius: 3px; flex-shrink: 0;
        }
        .jd-similar-title { font-size: 16px; font-weight: 800; color: #0f172a; }

        .jd-similar-card {
          background: white; border-radius: 14px; padding: 14px 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          display: flex; gap: 12px; align-items: flex-start;
          cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
          margin-bottom: 10px; text-decoration: none;
        }
        .jd-similar-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.09); }

        .jd-similar-icon {
          width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }

        @media (min-width: 769px) {
          .jd-topbar { padding: 14px 24px; top: 60px; }
          .jd-header { padding: 32px 24px 36px; }
          .jd-content { padding: 24px 24px 80px; }
          .jd-cta { position: static; box-shadow: none; background: transparent; padding: 0; margin-bottom: 16px; }
          .jd-wa-cta { border-radius: 14px; }
          .jd-title { font-size: 26px; }
        }
        @media (max-width: 768px) {
          .jd-title { font-size: 20px; }
        }
      `}</style>

      <div className="jd-root">

        {/* Sticky topbar */}
        <div className="jd-topbar">
          <button className="jd-back" onClick={() => navigate(-1)}>← Back</button>
          <div className="jd-share-row">
            <button className="jd-btn-wa" onClick={handleShareWA}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share
            </button>
            <button className="jd-btn-copy" onClick={handleCopyLink}>
              {copied ? '✅' : '🔗'}
            </button>
          </div>
        </div>

        {/* Dark header */}
        <div className="jd-header">
          <div className="jd-header-inner">
            <div className="jd-icon-row">
              <div className="jd-icon">💼</div>
              <div className="jd-header-info">
               {job.category && (
          <span className="jd-cat-badge" style={{ background: catStyle.bg, color: catStyle.color }}>
             {job.category}
             </span>
          )}
            <h1 className="jd-title">{job.title}</h1>
          {job.company && (
             <p className="jd-company">🏢 {job.company}</p>
          )}
          {/* ── Verified organizer badge ── */}
          {job.user?.isVerified && (
          <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          background: 'rgba(0,200,150,0.15)', color: '#34d399',
          fontSize: '10.5px', fontWeight: 700,
          padding: '3px 10px', borderRadius: '20px',
          border: '1px solid rgba(0,200,150,0.25)', marginTop: '8px'
      }}>
          ✅ Verified Poster
        </span>
     )}
          </div>
            </div>

            <div className="jd-meta-row">
              {job.location?.city && (
                <span className="jd-meta-item">
                  📍 {job.location.city}{job.location.area ? ', ' + job.location.area : ''}
                </span>
              )}
              {postedDate && (
                <span className="jd-meta-item">🗓️ Posted {postedDate}</span>
              )}
              {job.location?.country && (
                <span className="jd-meta-item">🌍 {job.location.country}</span>
              )}
            </div>
          </div>
        </div>

        <div className="jd-content">

          {/* Description */}
          {job.description && (
            <div className="jd-card">
              <div className="jd-card-header">Full Description</div>
              <div className="jd-desc">{linkify(job.description)}</div>
            </div>
          )}

          {/* Tip */}
          <div className="jd-tip">
            💡 <strong>Tip:</strong> If a link is included in the description above, click it to apply directly. Otherwise contact the poster on WhatsApp below.
          </div>

          {/* WhatsApp CTA */}
          {phone && (
            <div className="jd-cta">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="jd-wa-cta">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact on WhatsApp
              </a>
            </div>
          )}

          {/* Similar Jobs */}
          {similar.length > 0 && (
            <div className="jd-similar">
              <div className="jd-similar-header">
                <div className="jd-similar-dot" />
                <span className="jd-similar-title">Similar Jobs</span>
              </div>
              {similar.map(function(j) {
                const simCat = CAT_COLORS[j.category] || CAT_COLORS['Other']
                return (
                  <div key={j._id} className="jd-similar-card" onClick={() => navigate('/jobs/' + j._id)}>
                    <div className="jd-similar-icon">💼</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {j.title}
                        </p>
                        {j.category && (
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', flexShrink: 0, background: simCat.bg, color: simCat.color }}>
                            {j.category}
                          </span>
                        )}
                      </div>
                      {j.company && (
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>🏢 {j.company}</p>
                      )}
                      <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: '#9ca3af' }}>
                        📍 {j.location?.city}{j.location?.area ? ', ' + j.location.area : ''}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </>
  )
}