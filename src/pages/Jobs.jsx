import { useState, useEffect } from 'react'
import JobCard from '../components/cards/JobCard'
import api from '../services/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/jobs')
        setJobs(data)
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827' }}>Campus Jobs</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Find part-time jobs, internships and freelance work near you
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search jobs or companies..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '11px 16px',
          border: '1px solid #d1d5db', borderRadius: '8px',
          fontSize: '14px', outline: 'none',
          marginBottom: '24px', boxSizing: 'border-box'
        }}
      />

      {/* Results */}
      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Loading jobs...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>No jobs found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filtered.map(j => <JobCard key={j._id} job={j} />)}
        </div>
      )}
    </div>
  )
}