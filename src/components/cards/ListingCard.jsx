import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import api from '../services/api'

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .skd { font-family:'Plus Jakarta Sans',sans-serif; }
  .skd-back {
    background: white; border: 1px solid #e2e8f0;
    padding: 8px 16px; border-radius: 10px;
    font-size: 13px; color: #374151; cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    font-family: inherit; font-weight: 600;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
  }
  .skd-share-wa {
    background: #25d366; color: white;
    border: none; padding: 8px 16px;
    border-radius: 10px; font-size: 12px;
    font-weight: 700; cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    font-family: inherit;
    box-shadow: 0 3px 10px rgba(37,211,102,.3);
  }
  .skd-share-copy {
    background: white; color: #374151;
    border: 1px solid #e2e8f0; padding: 8px 14px;
    border-radius: 10px; font-size: 12px;
    font-weight: 700; cursor: pointer;
    font-family: inherit;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
  }
  .skd-card {
    background: white; border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0,0,0,.08);
    padding: 28px; margin-top: 0;
  }
  .skd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .skd-main-img {
    width: 100%; aspect-ratio: 4/5;
    border-radius: 16px; overflow: hidden;
    background: #f3f4f6; margin-bottom: 12px;
  }
  .skd-main-img img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .skd-thumbs { display: flex; gap: 8px; flex-wrap: wrap; }
  .skd-thumb {
    width: 58px; height: 58px;
    object-fit: cover; border-radius: 10px;
    cursor: pointer; transition: all .2s;
  }
  .skd-cat-tag {
    display: inline-block; font-size: 11px;
    font-weight: 700; padding: 3px 12px;
    border-radius: 20px; background: #ecfdf5;
    color: #059669; margin-bottom: 12px;
    align-self: flex-start;
  }
  .skd-title {
    font-size: 22px; font-weight: 800;
    color: #08162F; margin-bottom: 8px; line-height: 1.3;
  }
  .skd-price {
    font-size: 30px; font-weight: 800;
    color: #08162F; margin-bottom: 12px;
    letter-spacing: -1px;
  }
  .skd-location {
    color: #6b7280; font-size: 13px;
    margin-bottom: 16px;
  }
  .skd-desc-label {
    font-size: 12px; font-weight: 700;
    color: #9ca3af; margin-bottom: 8px;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .skd-desc {
    font-size: 14px; color: #374151;
    line-height: 1.7; margin-bottom: 20px;
  }
  .skd-seller {
    background: #f8fafc; border-radius: 12px;
    padding: 14px 16px; margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; border: 1px solid #f1f5f9;
    transition: background .2s;
  }
  .skd-seller:hover { background: #f1f5f9; }
  .skd-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg,#08162F,#1e3a8a);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: white; font-weight: 800; flex-shrink: 0;
  }
  .skd-seller-name { font-size: 13px; font-weight: 700; color: #111827; }
  .skd-seller-badge { font-size: 11px; color: #059669; font-weight: 600; }
  .skd-seller-arrow { font-size: 12px; color: #9ca3af; margin-left: auto; }
  .skd-date { font-size: 11px; color: #9ca3af; margin-bottom: 16px; }
  .skd-safety {
    background: #fffbeb; border: 1px solid #fde68a;
    border-radius: 10px; padding: 10px 14px;
    margin-bottom: 16px; font-size: 12px;
    color: #92400e; line-height: 1.5;
  }
  .skd-wa-btn {
    width: 100%;
    background: linear-gradient(135deg,#25d366,#16a34a);
    color: white; border: none; padding: 14px;
    border-radius: 12px; font-size: 15px;
    font-weight: 800; cursor: pointer;
    display: flex; align-items: center;
    justify-content: center; gap: 8px;
    font-family: inherit;
    box-shadow: 0 4px 16px rgba(37,211,102,.35);
    transition: all .2s; margin-bottom: 10px;
    text-decoration: none;
  }
  .skd-wa-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
  .skd-report-btn {
    width: 100%; background: transparent;
    color: #ef4444; border: 1px solid #fecaca;
    padding: 10px; border-radius: 10px;
    font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: inherit;
  }
  .skd-report-box {
    background: white; border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,.08);
    padding: 24px; margin-top: 16px;
  }
  .skd-report-title {
    font-size: 15px; font-weight: 700;
    color: #111827; margin-bottom: 16px;
  }
  .skd-alert-green {
    background: #f0fdf4; border: 1px solid #bbf7d0;
    color: #16a34a; padding: 10px 14px;
    border-radius: 8px; font-size: 13px; margin-bottom: 16px;
  }
  .skd-alert-red {
    background: #fef2f2; border: 1px solid #fecaca;
    color: #dc2626; padding: 10px 14px;
    border-radius: 8px; font-size: 13px; margin-bottom: 16px;
  }
  .skd-radio-label {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; font-size: 13px; color: #374151;
  }
  .skd-textarea {
    width: 100%; padding: 10px 14px;
    border: 1px solid #d1d5db; border-radius: 8px;
    font-size: 14px; outline: none;
    box-sizing: border-box; resize: vertical;
    font-family: inherit;
  }
  .skd-btn-cancel {
    flex: 1; background: white; color: #374151;
    border: 1px solid #d1d5db; padding: 10px;
    border-radius: 8px; font-size: 13px;
    font-weight: 600; cursor: pointer; font-family: inherit;
  }
  .skd-btn-report {
    flex: 1; color: white; border: none;
    padding: 10px; border-radius: 8px;
    font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit;
  }
  @media (max-width: 768px) {
    .skd-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
    .skd-card { padding: 16px !important; }
  }
`

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

  useEffect(() => {
    api.get('/listings/' + id)
      .then(res => setListing(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const getImg = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  const handleReport = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!reportReason) { setReportError('Please select a reason'); return }
    setReportLoading(true)
    setReportError('')
    try {
      await api.post('/reports', { listingId: id, reason: reportReason, details: reportDetails })
      setReportSuccess('Report submitted. Thank you!')
      setTimeout(() => {
        setShowReport(false)
        setReportSuccess('')
        setReportReason('')
        setReportDetails('')
      }, 2000)
    } catch (err) {
      setReportError(err.response?.data?.message || 'Failed to submit report.')
    } finally {
      setReportLoading(false)
    }
  }

  const handleShareWA = () => {
    const url = window.location.href
    const text = 'Check out this listing on SwiftKart: *' + listing.title + '* - R' + listing.price + '\n' + url
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      Loading...
    </p>
  )

  if (!listing) return null

  const phone = listing.phone?.replace(/\D/g, '')
  const waMsg = encodeURIComponent('Hi, I am interested in your listing: ' + listing.title)
  const waLink = 'https://wa.me/' + phone + '?text=' + waMsg
  const price = 'R ' + Number(listing.price).toLocaleString()

  return (
    <>
      <style>{CSS}</style>

      <div className="skd" style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button className="skd-back" onClick={() => navigate(-1)}>← Back</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="skd-share-wa" onClick={handleShareWA}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share
            </button>
            <button className="skd-share-copy" onClick={handleCopyLink}>
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>
          </div>
        </div>

        {/* Main card */}
        <div className="skd-card">
          <div className="skd-grid">

            {/* LEFT — Images */}
            <div>
              <div className="skd-main-img">
                {listing.images && listing.images.length > 0 ? (
                  <img src={getImg(listing.images[activeImage])} alt={listing.title} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>
                    🛍️
                  </div>
                )}
              </div>

              {listing.images && listing.images.length > 1 && (
                <div className="skd-thumbs">
                  {listing.images.map((img, i) => (
                    <img
                      key={i}
                      className="skd-thumb"
                      src={getImg(img)}
                      alt={'thumb-' + i}
                      onClick={() => setActiveImage(i)}
                      style={{
                        border: activeImage === i ? '2px solid #00C896' : '2px solid transparent',
                        opacity: activeImage === i ? 1 : 0.65
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Info */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>

              {listing.category && (
                <span className="skd-cat-tag">{listing.category}</span>
              )}

              <h1 className="skd-title">{listing.title}</h1>
              <p className="skd-price">{price}</p>

              <p className="skd-location">
                📍 {listing.location?.area ? listing.location.area + ', ' : ''}
                {listing.location?.city}, {listing.location?.country}
              </p>

              {listing.description && (
                <div style={{ marginBottom: '20px' }}>
                  <p className="skd-desc-label">Description</p>
                  <p className="skd-desc">{listing.description}</p>
                </div>
              )}

              {listing.user && (
                <div className="skd-seller" onClick={() => navigate('/profile/' + listing.user._id)}>
                  <div className="skd-avatar">
                    {listing.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="skd-seller-name">{listing.user.name}</p>
                    <p className="skd-seller-badge">✔ Verified Seller</p>
                  </div>
                  <span className="skd-seller-arrow">View Profile →</span>
                </div>
              )}

              <p className="skd-date">
                Posted {new Date(listing.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div className="skd-safety">
                ⚠️ <strong>Safety Tip:</strong> Always meet in a public place before exchanging money. SwiftKart is not responsible for transactions between users.
              </div>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="skd-wa-btn">
                {WA_SVG}
                Contact Seller on WhatsApp
              </a>

              <button className="skd-report-btn" onClick={() => setShowReport(!showReport)}>
                🚩 Report this Listing
              </button>

            </div>
          </div>
        </div>

        {/* Report form */}
        {showReport && (
          <div className="skd-report-box">
            <p className="skd-report-title">🚩 Report this Listing</p>

            {reportSuccess && <div className="skd-alert-green">{reportSuccess}</div>}
            {reportError && <div className="skd-alert-red">{reportError}</div>}

            <form onSubmit={handleReport}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Reason *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Scam or fraud', 'Fake listing', 'Inappropriate content', 'Wrong price', 'Duplicate listing', 'Other'].map(r => (
                    <label key={r} className="skd-radio-label">
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reportReason === r}
                        onChange={e => setReportReason(e.target.value)}
                      />
                      {r}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Additional Details (optional)
                </label>
                <textarea
                  className="skd-textarea"
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  placeholder="Provide more details..."
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="skd-btn-cancel" onClick={() => setShowReport(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="skd-btn-report"
                  disabled={reportLoading}
                  style={{ background: reportLoading ? '#fca5a5' : '#ef4444' }}
                >
                  {reportLoading ? 'Submitting...' : '🚩 Submit Report'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </>
  )
}