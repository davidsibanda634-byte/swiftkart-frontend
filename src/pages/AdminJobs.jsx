import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

export default function AdminJobs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')

  const TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship']

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchData()
  }, [])

  function fetchData() {
    setLoading(true)
    Promise.all([api.get('/admin/jobs'), api.get('/admin/stats')])
      .then(function(res) { setJobs(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function deleteJob(id) {
    if (!window.confirm('Permanently delete this job posting?')) return
    api.delete('/admin/jobs/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  const filtered = jobs.filter(function(j) {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.company && j.company.toLowerCase().includes(search.toLowerCase())) ||
      (j.user?.name && j.user.name.toLowerCase().includes(search.toLowerCase()))
    const matchType = type === 'All' || j.type === type
    return matchSearch && matchType
  })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .aj-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .aj-search {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 12px; padding: 0 16px; height: 44px;
          margin-bottom: 16px; transition: all 0.2s;
        }
        .aj-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .aj-search input { border: none; outline: none; font-size: 13.5px; color: #374151; font-family: inherit; flex: 1; background: transparent; }

        .aj-cats { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .aj-cat-btn {
          padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e8ecf4;
          background: white; font-size: 12px; font-weight: 700; color: #6b7280;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .aj-cat-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .aj-cat-btn:hover:not(.active) { border-color: #00C896; color: #00C896; }

        .aj-count { font-size: 13px; color: #9ca3af; font-weight: 600; margin-bottom: 16px; }

        .aj-list { display: flex; flex-direction: column; gap: 12px; }

        .aj-card {
          background: white; border-radius: 16px; padding: 18px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
          display: flex; align-items: center; gap: 16px; transition: all 0.2s;
        }
        .aj-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); }

        .aj-card-icon {
          width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
          background: #fffbeb; display: flex; align-items: center; justify-content: center; font-size: 20px;
        }

        .aj-card-body { flex: 1; min-width: 0; }
        .aj-card-title { font-size: 14px; font-weight: 700; color: #111827; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .aj-card-meta { font-size: 12px; color: #9ca3af; margin: 0; }
        .aj-card-type {
          display: inline-block; font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 8px;
          background: #fffbeb; color: #d97706; margin-top: 6px;
        }

        .aj-card-delete {
          background: #fef2f2; color: #dc2626; flex-shrink: 0;
          border: 1px solid #fecaca; padding: 8px 14px; border-radius: 8px;
          font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: all 0.2s; white-space: nowrap;
        }
        .aj-card-delete:hover { background: #fee2e2; }

        .aj-empty { text-align: center; padding: 80px 20px; color: #9ca3af; font-size: 14px; }

        @media (max-width: 600px) {
          .aj-card { flex-wrap: wrap; }
          .aj-card-delete { width: 100%; }
        }
      `}</style>

      <div className="aj-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">💼 All Jobs</h1>
          <p className="adm-page-sub">{jobs.length} total job postings on Scalablenexus</p>
        </div>

        <div className="aj-search">
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input placeholder="Search by title, company or poster..." value={search}
            onChange={function(e) { setSearch(e.target.value) }} />
        </div>

        <div className="aj-cats">
          {TYPES.map(function(t) {
            return (
              <button key={t} className={'aj-cat-btn' + (type === t ? ' active' : '')}
                onClick={function() { setType(t) }}>
                {t}
              </button>
            )
          })}
        </div>

        <p className="aj-count">{filtered.length} job{filtered.length !== 1 ? 's' : ''} found</p>

        {loading ? (
          <div className="aj-empty">Loading jobs...</div>
        ) : filtered.length === 0 ? (
          <div className="aj-empty">No jobs found</div>
        ) : (
          <div className="aj-list">
            {filtered.map(function(j) {
              return (
                <div key={j._id} className="aj-card">
                  <div className="aj-card-icon">💼</div>
                  <div className="aj-card-body">
                    <p className="aj-card-title">{j.title}</p>
                    <p className="aj-card-meta">
                      {j.company ? j.company + ' · ' : ''}{j.location || 'Remote'} · posted by {j.user?.name || 'Unknown'}
                    </p>
                    {j.type && <div className="aj-card-type">{j.type}</div>}
                  </div>
                  <button className="aj-card-delete" onClick={function() { deleteJob(j._id) }}>
                    🗑️ Delete
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}