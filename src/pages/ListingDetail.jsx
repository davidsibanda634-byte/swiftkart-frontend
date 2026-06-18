import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ListingCard from '../components/cards/ListingCard'
import api from '../services/api'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportSuccess, setReportSuccess] = useState('')
  const [reportError, setReportError] = useState('')
  const [copied, setCopied] = useState(false)
  const [similar, setSimilar] = useState([])
  const [similarLoading, setSimilarLoading] = useState(true)

  useEffect(function() {
    window.scrollTo(0, 0)
    api.get('/listings/' + id)
      .then(function(res) {
        setListing(res.data)
        window.scrollTo(0, 0)
        fetchSimilar(res.data)
      })
      .catch(function() { navigate('/') })
      .finally(function() { setLoading(false) })
  }, [id])

  function fetchSimilar(currentListing) {
    setSimilarLoading(true)
    api.get('/listings')
      .then(function(res) {
        const filtered = res.data
          .filter(function(l) {
            return l._id !== currentListing._id && l.category === currentListing.category
          })
          .slice(0, 4)
        setSimilar(filtered)
      })
      .catch(function() { setSimilar([]) })
      .finally(function() { setSimilarLoading(false) })
  }

  function getImg(img) {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  function handleReport(e) {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!reportReason) { setReportError('Please select a reason'); return }
    setReportLoading(true)
    setReportError('')
    api.post('/reports', { listingId: id, reason: reportReason, details: reportDetails })
      .then(function() {
        setReportSuccess('Report submitted. Thank you!')
        setTimeout(function() {
          setShowReport(false)
          setReportSuccess('')
          setReportReason('')
          setReportDetails('')
        }, 2000)
      })
      .catch(function(err) {
        setReportError(err.response?.data?.message || 'Failed to submit report.')
      })
      .finally(function() { setReportLoading(false) })
  }

  function handleShareWA() {
    const url = window.location.href
    const text = 'Check out this listing on SwiftKart: *' + listing.title + '* - $' + listing.price + '\n' + url
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(function() { setCopied(false) }, 2000)
  }

  if (loading) {
    return (
      <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Loading...
      </p>
    )
  }

  if (!listing) return null

  const phone = listing.phone?.replace(/\D/g, '') || ''
  const waText = 'Hi, I am interested in your listing: ' + listing.title
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(waText)
  const price = '$' + Number(listing.price).toLocaleString()
  const REPORTS = ['Scam or fraud', 'Fake listing', 'Inappropriate content', 'Wrong price', 'Duplicate listing', 'Other']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .skd-root { font-family:'Plus Jakarta Sans',sans-serif; background:#f4f7fb; min-height:100vh; }
        .skd-topbar {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #f1f5f9;
          position: sticky; top: 60px; z-index: 50;
        }
        .skd-back {
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 700; color: #374151;
          display: flex; align-items: center; gap: 6px;
          font-family: inherit; padding: 6px 0;
        }
        .skd-share-row { display: flex; gap: 8px; }
        .skd-btn-wa {
          background: #25d366; color: white; border: none;
          padding: 8px 14px; border-radius: 20px;
          font-size: 12px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          font-family: inherit;
        }
        .skd-btn-copy {
          background: #f1f5f9; color: #374151; border: none;
          padding: 8px 14px; border-radius: 20px;
          font-size: 12px; font-weight: 700; cursor: pointer;
          font-family: inherit;
        }
        .skd-img-section { background: white; }
        .skd-main-img {
          width: 100%; aspect-ratio: 4/5;
          overflow: hidden; background: #f3f4f6;
        }
        .skd-main-img img { width:100%; height:100%; object-fit:cover; display:block; }
        .skd-thumbs {
          display: flex; gap: 8px; padding: 12px 16px;
          overflow-x: auto; scrollbar-width: none;
          background: white; border-bottom: 1px solid #f1f5f9;
        }
        .skd-thumbs::-webkit-scrollbar { display: none; }
        .skd-thumb {
          width: 60px; height: 60px; flex-shrink: 0;
          object-fit: cover; border-radius: 10px; cursor: pointer;
          transition: all .2s;
        }
        .skd-info-section {
          background: white; margin-top: 8px;
          padding: 20px 16px; border-radius: 0;
        }
        .skd-cat-pill {
          display: inline-block; font-size: 11px; font-weight: 700;
          padding: 4px 12px; border-radius: 20px;
          background: #ecfdf5; color: #059669; margin-bottom: 10px;
        }
        .skd-title { font-size: 20px; font-weight: 800; color: #08162F; margin: 0 0 6px; line-height: 1.3; }
        .skd-price { font-size: 28px; font-weight: 800; color: #08162F; margin: 0 0 10px; letter-spacing: -1px; }
        .skd-location { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
        .skd-divider { border: none; border-top: 1px solid #f1f5f9; margin: 16px 0; }
        .skd-desc-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; }
        .skd-desc { font-size: 14px; color: #374151; line-height: 1.7; margin-bottom: 0; }
        .skd-seller-card {
          background: #f8fafc; border-radius: 14px;
          padding: 14px 16px; margin-top: 16px;
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; border: 1px solid #f1f5f9;
        }
        .skd-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg,#08162F,#1e3a8a);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; color: white; font-weight: 800; flex-shrink: 0;
        }
        .skd-posted { font-size: 11px; color: #9ca3af; margin: 12px 0 0; }
        .skd-safety-box {
          background: #fffbeb; border: 1px solid #fde68a;
          border-radius: 12px; padding: 12px 14px; margin-top: 16px;
          font-size: 12px; color: #92400e; line-height: 1.6;
        }
        .skd-cta-section {
          background: white; margin-top: 8px;
          padding: 16px; position: sticky; bottom: 62px;
          box-shadow: 0 -4px 20px rgba(0,0,0,.06);
          z-index: 40;
        }
        .skd-wa-cta {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; background: linear-gradient(135deg,#25d366,#16a34a);
          color: white; border: none; padding: 15px;
          border-radius: 14px; font-size: 15px; font-weight: 800;
          cursor: pointer; font-family: inherit; text-decoration: none;
          box-shadow: 0 4px 16px rgba(37,211,102,.35); margin-bottom: 10px;
        }
        .skd-report-trigger {
          width: 100%; background: transparent; color: #9ca3af;
          border: 1px solid #e5e7eb; padding: 10px; border-radius: 12px;
          font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .skd-report-box {
          background: white; margin-top: 8px; padding: 20px 16px;
        }

        /* Similar Listings */
        .skd-similar-section {
          background: white;
          margin-top: 8px;
          padding: 20px 16px 28px;
        }
        .skd-similar-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .skd-similar-dot {
          width: 5px; height: 22px;
          background: linear-gradient(180deg, #00C896, #059669);
          border-radius: 3px;
          flex-shrink: 0;
        }
        .skd-similar-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
        }
        .skd-similar-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .skd-similar-empty {
          text-align: center;
          padding: 30px 0;
          color: #9ca3af;
          font-size: 13px;
        }
        .skd-similar-skeleton {
          background: #f8fafc;
          border-radius: 14px;
          aspect-ratio: 4/5;
        }

        @media (min-width: 769px) {
          .skd-root { background: #f4f7fb; }
          .skd-topbar { padding: 14px 24px; top: 60px; }
          .skd-desktop-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            max-width: 960px;
            margin: 24px auto;
            padding: 0 24px;
          }
          .skd-img-section { border-radius: 20px; overflow: hidden; }
          .skd-info-section { background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,.08); margin-top: 0; padding: 28px; }
          .skd-cta-section { position: static; box-shadow: none; background: transparent; padding: 0; margin-top: 12px; }
          .skd-main-img { aspect-ratio: 4/5; border-radius: 0; }
          .skd-thumbs { border-radius: 0 0 0 0; }
          .skd-mobile-only { display: none !important; }
          .skd-similar-wrap-desktop {
            max-width: 960px;
            margin: 0 auto 40px;
            padding: 0 24px;
          }
          .skd-similar-section {
            border-radius: 20px;
            box-shadow: 0 4px 24px rgba(0,0,0,.06);
            margin-top: 0;
          }
          .skd-similar-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 768px) {
          .skd-desktop-grid { display: block !important; }
          .skd-desktop-only { display: none !important; }
        }
      `}</style>

      <div className="skd-root">

        <div className="skd-topbar">
          <button className="skd-back" onClick={function() { navigate(-1) }}>
            ← Back
          </button>
          <div className="skd-share-row">
            <button className="skd-btn-wa" onClick={handleShareWA}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share
            </button>
            <button className="skd-btn-copy" onClick={handleCopyLink}>
              {copied ? '✅' : '🔗'}
            </button>
          </div>
        </div>

        <div className="skd-desktop-grid" style={{ display: 'block' }}>

          <div className="skd-img-section">
            <div className="skd-main-img">
              {listing.images && listing.images.length > 0 ? (
                <img src={getImg(listing.images[activeImage])} alt={listing.title} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', background: '#f8fafc' }}>
                  🛍️
                </div>
              )}
            </div>

            {listing.images && listing.images.length > 1 && (
              <div className="skd-thumbs">
                {listing.images.map(function(img, i) {
                  return (
                    <img
                      key={i}
                      className="skd-thumb"
                      src={getImg(img)}
                      alt={'img-' + i}
                      onClick={function() { setActiveImage(i) }}
                      style={{
                        border: activeImage === i ? '2px solid #00C896' : '2px solid #f1f5f9',
                        opacity: activeImage === i ? 1 : 0.6,
                      }}
                    />
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <div className="skd-info-section">

              {listing.category && (
                <div className="skd-cat-pill">{listing.category}</div>
              )}

              <h1 className="skd-title">{listing.title}</h1>
              <p className="skd-price">{price}</p>

              <p className="skd-location">
                📍 {listing.location?.area ? listing.location.area + ', ' : ''}
                {listing.location?.city}, {listing.location?.country}
              </p>

              {listing.description && (
                <>
                  <hr className="skd-divider" />
                  <p className="skd-desc-label">Description</p>
                  <p className="skd-desc">{listing.description}</p>
                </>
              )}

              {listing.user && (
                <div className="skd-seller-card" onClick={function() { navigate('/profile/' + listing.user._id) }}>
                  <div className="skd-avatar">
                    {listing.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>
                      {listing.user.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#059669', fontWeight: 600, margin: '2px 0 0' }}>
                      ✔ Verified Seller
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>→</span>
                </div>
              )}

              <p className="skd-posted">
                Posted {new Date(listing.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div className="skd-safety-box">
                ⚠️ <strong>Safety Tip:</strong> Always meet in a public place before exchanging money. SwiftKart is not responsible for transactions between users.
              </div>

            </div>

            <div className="skd-cta-section">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="skd-wa-cta">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact Seller on WhatsApp
              </a>
              <button className="skd-report-trigger" onClick={function() { setShowReport(!showReport) }}>
                🚩 Report this Listing
              </button>
            </div>

            {showReport && (
              <div className="skd-report-box">
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
                  🚩 Report this Listing
                </p>

                {reportSuccess && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                    {reportSuccess}
                  </div>
                )}

                {reportError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                    {reportError}
                  </div>
                )}

                <form onSubmit={handleReport}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                      Reason *
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {REPORTS.map(function(r) {
                        return (
                          <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                            <input
                              type="radio"
                              name="reason"
                              value={r}
                              checked={reportReason === r}
                              onChange={function(e) { setReportReason(e.target.value) }}
                            />
                            {r}
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Additional Details (optional)
                    </label>
                    <textarea
                      value={reportDetails}
                      onChange={function(e) { setReportDetails(e.target.value) }}
                      placeholder="Provide more details..."
                      rows={3}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={function() { setShowReport(false) }}
                      style={{ flex: 1, background: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '11px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reportLoading}
                      style={{ flex: 1, background: reportLoading ? '#fca5a5' : '#ef4444', color: 'white', border: 'none', padding: '11px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: reportLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                    >
                      {reportLoading ? 'Submitting...' : '🚩 Submit Report'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>

        {/* Similar Listings */}
        <div className="skd-similar-wrap-desktop">
          <div className="skd-similar-section">
            <div className="skd-similar-header">
              <div className="skd-similar-dot" />
              <span className="skd-similar-title">You might also like</span>
            </div>

            {similarLoading ? (
              <div className="skd-similar-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skd-similar-skeleton" />
                ))}
              </div>
            ) : similar.length === 0 ? (
              <p className="skd-similar-empty">No similar listings found right now.</p>
            ) : (
              <div className="skd-similar-grid">
                {similar.map(l => <ListingCard key={l._id} listing={l} />)}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  )
}