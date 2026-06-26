import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import JobCard from '../components/cards/JobCard'
import api from '../services/api'

const JOB_CATEGORIES = ['All', 'Internship', 'Part-Time', 'Full-Time', 'Freelance', 'Volunteer', 'Other']

export default function Jobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchJobs = useCallback(function(cat) {
    setLoading(true)
    const params = {}
    if (cat && cat !== 'All') params.category = cat
    api.get('/jobs', { params })
      .then(function(res) { setJobs(res.data) })
      .catch(function() { setJobs([]) })
      .finally(function() { setLoading(false) })
  }, [])

  useEffect(function() {
    fetchJobs(category)
  }, [category])

  const filtered = jobs.filter(function(j) {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.company && j.company.toLowerCase().includes(search.toLowerCase()))
    return matchSearch
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .jb-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .jb-header {
          background: linear-gradient(135deg, #7c2d12 0%, #d97706 100%);
          padding: 28px 24px 32px;
        }
        .jb-header-inner { max-width: 1240px; margin: 0 auto; }
        .jb-back {
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.22);
          color: white; padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit;
          display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px;
          transition: all 0.2s;
        }
        .jb-back:hover { background: rgba(255,255,255,0.25); }
        .jb-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .jb-sub { color: rgba(255,255,255,0.75); font-size: 13.5px; margin: 0 0 22px; }

        .jb-search-bar {
          display: flex; align-items: center; background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25); border-radius: 12px;
          height: 46px; padding: 0 16px; gap: 9px; max-width: 600px; transition: all 0.2s;
        }
        .jb-search-bar:focus-within { background: rgba(255,255,255,0.22); box-shadow: 0 0 0 3px rgba(255,255,255,0.15); }
        .jb-search-input {
          flex: 1; border: none; outline: none; font-size: 13.5px; color: white;
          font-family: inherit; background: transparent;
        }
        .jb-search-input::placeholder { color: rgba(255,255,255,0.55); }

        .jb-content { max-width: 1240px; margin: 0 auto; padding: 24px 20px 60px; }

        .jb-cat-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .jb-cat-tab {
          padding: 7px 16px; border-radius: 20px; border: 1px solid #fde68a;
          background: white; color: #92400e; font-size: 12.5px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .jb-cat-tab.active { background: #d97706; color: white; border-color: #d97706; }
        .jb-cat-tab:hover { border-color: #d97706; }

        .jb-count-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .jb-count-badge {
          display: inline-flex; align-items: center; gap: 7px; background: white;
          border: 1px solid #fde68a; border-radius: 20px; padding: 5px 14px;
          font-size: 12.5px; font-weight: 700; color: #92400e;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .jb-count-dot { width: 7px; height: 7px; border-radius: 50%; background: #d97706; flex-shrink: 0; }

        .jb-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        .jb-skeleton { background: white; border-radius: 14px; height: 150px; border: 1px solid #f1f5f9; overflow: hidden; }
        .jb-skeleton-inner {
          width: 100%; height: 100%;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: jb-shimmer 1.4s infinite;
        }
        @keyframes jb-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .jb-empty {
          grid-column: 1 / -1; text-align: center; padding: 60px 20px;
          background: white; border-radius: 16px; border: 2px dashed #e2e8f0;
        }
        .jb-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .jb-empty-title { font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px; }
        .jb-empty-sub { font-size: 13px; color: #9ca3af; }

        @media (max-width: 768px) {
          .jb-grid { grid-template-columns: 1fr; gap: 12px; }
          .jb-header { padding: 20px 16px 24px; }
          .jb-content { padding: 18px 14px 60px; }
        }
      `}</style>

      <div className="jb-wrap">
        <div className="jb-header">
          <div className="jb-header-inner">
            <button className="jb-back" onClick={function() { navigate(-1) }}>← Back</button>
            <h1 className="jb-title">💼 Campus Jobs</h1>
            <p className="jb-sub">Find part-time jobs, internships and freelance work near you</p>

            <div className="jb-search-bar">
              <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)' }}>🔍</span>
              <input
                className="jb-search-input"
                type="text"
                placeholder="Search jobs or companies…"
                value={search}
                onChange={function(e) { setSearch(e.target.value) }}
              />
            </div>
          </div>
        </div>

        <div className="jb-content">
          <div className="jb-cat-tabs">
            {JOB_CATEGORIES.map(function(cat) {
              return (
                <button
                  key={cat}
                  className={'jb-cat-tab' + (category === cat ? ' active' : '')}
                  onClick={function() { setCategory(cat) }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {!loading && (
            <div className="jb-count-row">
              <div className="jb-count-badge">
                <div className="jb-count-dot" />
                {filtered.length} job{filtered.length !== 1 ? 's' : ''} available
              </div>
            </div>
          )}

          <div className="jb-grid">
            {loading ? (
              Array.from({ length: 4 }).map(function(_, i) {
                return (
                  <div key={i} className="jb-skeleton"><div className="jb-skeleton-inner" /></div>
                )
              })
            ) : filtered.length === 0 ? (
              <div className="jb-empty">
                <div className="jb-empty-icon">💼</div>
                <div className="jb-empty-title">No jobs found</div>
                <div className="jb-empty-sub">Try a different category or search term</div>
              </div>
            ) : (
              filtered.map(function(j) { return <JobCard key={j._id} job={j} /> })
            )}
          </div>
        </div>
      </div>
    </>
  )
}