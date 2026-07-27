import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

const EMPTY_FORM = {
  badge: '',
  title: '',
  subtitle: '',
  image: '',
  buttonText: '',
  linkUrl: '',
  accentColor: '#00C896',
  startDate: '',
  endDate: '',
  isActive: true,
}

export default function AdminAdvertisements() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ads, setAds] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchData()
  }, [])

  function fetchData() {
    setLoading(true)
    Promise.all([api.get('/admin/advertisements'), api.get('/admin/stats')])
      .then(function(res) { setAds(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function openCreateForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(ad) {
    setForm({
      badge: ad.badge || '',
      title: ad.title || '',
      subtitle: ad.subtitle || '',
      image: ad.image || '',
      buttonText: ad.buttonText || '',
      linkUrl: ad.linkUrl || '',
      accentColor: ad.accentColor || '#00C896',
      startDate: ad.startDate ? ad.startDate.slice(0, 10) : '',
      endDate: ad.endDate ? ad.endDate.slice(0, 10) : '',
      isActive: ad.isActive !== false,
    })
    setEditingId(ad._id)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function updateField(key, value) {
    setForm(function(prev) { return { ...prev, [key]: value } })
  }

  function handleSave() {
    if (!form.title.trim() || !form.image.trim()) {
      alert('Title and image are required.')
      return
    }
    setSaving(true)
    const request = editingId
      ? api.put('/admin/advertisements/' + editingId, form)
      : api.post('/admin/advertisements', form)
    request
      .then(function() { closeForm(); fetchData() })
      .catch(function() { alert('Could not save advertisement.') })
      .finally(function() { setSaving(false) })
  }

  function toggleActive(ad) {
    api.put('/admin/advertisements/' + ad._id, { isActive: !ad.isActive })
      .then(fetchData)
      .catch(function() { alert('Could not update advertisement.') })
  }

  function deleteAd(id) {
    if (!window.confirm('Permanently delete this advertisement?')) return
    api.delete('/admin/advertisements/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .aa-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .aa-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
        .aa-count { font-size: 13px; color: #9ca3af; font-weight: 600; }
        .aa-add-btn {
          background: #00C896; color: white; border: none; padding: 10px 18px;
          border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
        }
        .aa-add-btn:hover { background: #059669; }

        .aa-form-panel {
          background: white; border-radius: 16px; padding: 20px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
          margin-bottom: 20px;
        }
        .aa-form-title { font-size: 14px; font-weight: 800; color: #08162F; margin: 0 0 16px; }
        .aa-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .aa-field { display: flex; flex-direction: column; gap: 5px; }
        .aa-field-full { grid-column: 1 / -1; }
        .aa-field label { font-size: 11.5px; font-weight: 700; color: #6b7280; }
        .aa-field input, .aa-field textarea {
          border: 1.5px solid #e8ecf4; border-radius: 9px; padding: 9px 12px;
          font-size: 13px; font-family: inherit; color: #111827; outline: none; transition: border-color 0.2s;
        }
        .aa-field input:focus, .aa-field textarea:focus { border-color: #00C896; }
        .aa-field input[type="color"] { padding: 3px; height: 38px; cursor: pointer; }
        .aa-field-check { flex-direction: row; align-items: center; gap: 8px; }

        .aa-form-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .aa-btn-cancel {
          background: white; color: #6b7280; border: 1.5px solid #e8ecf4;
          padding: 9px 18px; border-radius: 9px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .aa-btn-save {
          background: #08162F; color: white; border: none;
          padding: 9px 18px; border-radius: 9px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .aa-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

        .aa-list { display: flex; flex-direction: column; gap: 12px; }
        .aa-card {
          background: white; border-radius: 16px; overflow: hidden;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
          display: flex; gap: 14px; padding: 14px; transition: all 0.2s;
        }
        .aa-card:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
        .aa-card.inactive { opacity: 0.55; }
        .aa-card-img {
          width: 120px; height: 76px; border-radius: 10px; flex-shrink: 0;
          background: #f8fafc; overflow: hidden; display: flex; align-items: center; justify-content: center;
        }
        .aa-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .aa-card-body { flex: 1; min-width: 0; }
        .aa-card-badge {
          display: inline-block; font-size: 9.5px; font-weight: 800;
          padding: 2px 8px; border-radius: 20px; margin-bottom: 5px;
        }
        .aa-card-title { font-size: 14px; font-weight: 700; color: #111827; margin: 0 0 3px; }
        .aa-card-sub { font-size: 12px; color: #9ca3af; margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .aa-card-meta { font-size: 11px; color: #c4c9d4; }
        .aa-card-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; justify-content: center; }
        .aa-card-actions button {
          border: 1px solid #e8ecf4; background: white; border-radius: 8px;
          padding: 6px 12px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit;
          white-space: nowrap;
        }
        .aa-btn-toggle.on { color: #059669; border-color: #bbf7d0; background: #ecfdf5; }
        .aa-btn-toggle.off { color: #6b7280; }
        .aa-btn-edit:hover { border-color: #dbeafe; color: #2563EB; background: #eff6ff; }
        .aa-btn-delete { color: #dc2626; }
        .aa-btn-delete:hover { background: #fef2f2; border-color: #fecaca; }

        .aa-empty { text-align: center; padding: 80px 20px; color: #9ca3af; font-size: 14px; }

        @media (max-width: 640px) {
          .aa-form-grid { grid-template-columns: 1fr; }
          .aa-card { flex-direction: column; }
          .aa-card-img { width: 100%; height: 140px; }
          .aa-card-actions { flex-direction: row; }
        }
      `}</style>

      <div className="aa-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">📢 Advertisements</h1>
          <p className="adm-page-sub">Manage the promotional banners shown on your homepage</p>
        </div>

        <div className="aa-toolbar">
          <p className="aa-count">{ads.length} advertisement{ads.length !== 1 ? 's' : ''}</p>
          {!showForm && <button className="aa-add-btn" onClick={openCreateForm}>+ New Advertisement</button>}
        </div>

        {showForm && (
          <div className="aa-form-panel">
            <p className="aa-form-title">{editingId ? 'Edit Advertisement' : 'New Advertisement'}</p>
            <div className="aa-form-grid">
              <div className="aa-field">
                <label>Badge label (optional)</label>
                <input placeholder="e.g. STUDENT SERVICES" value={form.badge}
                  onChange={function(e) { updateField('badge', e.target.value) }} />
              </div>
              <div className="aa-field">
                <label>Accent color</label>
                <input type="color" value={form.accentColor}
                  onChange={function(e) { updateField('accentColor', e.target.value) }} />
              </div>
              <div className="aa-field aa-field-full">
                <label>Title</label>
                <input placeholder="e.g. Need a Service? Find Trusted Talent" value={form.title}
                  onChange={function(e) { updateField('title', e.target.value) }} />
              </div>
              <div className="aa-field aa-field-full">
                <label>Subtitle</label>
                <textarea rows={2} placeholder="e.g. Discover tutors, designers, photographers..." value={form.subtitle}
                  onChange={function(e) { updateField('subtitle', e.target.value) }} />
              </div>
              <div className="aa-field aa-field-full">
                <label>Image URL</label>
                <input placeholder="https://..." value={form.image}
                  onChange={function(e) { updateField('image', e.target.value) }} />
              </div>
              <div className="aa-field">
                <label>Button text</label>
                <input placeholder="e.g. Browse Services" value={form.buttonText}
                  onChange={function(e) { updateField('buttonText', e.target.value) }} />
              </div>
              <div className="aa-field">
                <label>Link URL</label>
                <input placeholder="/services" value={form.linkUrl}
                  onChange={function(e) { updateField('linkUrl', e.target.value) }} />
              </div>
              <div className="aa-field">
                <label>Start date (optional)</label>
                <input type="date" value={form.startDate}
                  onChange={function(e) { updateField('startDate', e.target.value) }} />
              </div>
              <div className="aa-field">
                <label>End date (optional)</label>
                <input type="date" value={form.endDate}
                  onChange={function(e) { updateField('endDate', e.target.value) }} />
              </div>
              <div className="aa-field aa-field-check">
                <input type="checkbox" checked={form.isActive}
                  onChange={function(e) { updateField('isActive', e.target.checked) }} />
                <label style={{ margin: 0 }}>Active (visible on homepage)</label>
              </div>
            </div>
            <div className="aa-form-actions">
              <button className="aa-btn-cancel" onClick={closeForm}>Cancel</button>
              <button className="aa-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Advertisement'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="aa-empty">Loading advertisements...</div>
        ) : ads.length === 0 ? (
          <div className="aa-empty">No advertisements yet — click "New Advertisement" to add your first banner</div>
        ) : (
          <div className="aa-list">
            {ads.map(function(ad) {
              return (
                <div key={ad._id} className={'aa-card' + (ad.isActive === false ? ' inactive' : '')}>
                  <div className="aa-card-img">
                    {ad.image ? <img src={ad.image} alt={ad.title} /> : '🖼️'}
                  </div>
                  <div className="aa-card-body">
                    {ad.badge && (
                      <span className="aa-card-badge" style={{ background: (ad.accentColor || '#00C896') + '22', color: ad.accentColor || '#00C896' }}>
                        {ad.badge}
                      </span>
                    )}
                    <p className="aa-card-title">{ad.title}</p>
                    <p className="aa-card-sub">{ad.subtitle}</p>
                    <p className="aa-card-meta">
                      {ad.linkUrl ? 'Links to ' + ad.linkUrl : 'No link set'}
                      {ad.startDate && ' · from ' + new Date(ad.startDate).toLocaleDateString()}
                      {ad.endDate && ' to ' + new Date(ad.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="aa-card-actions">
                    <button
                      className={'aa-btn-toggle ' + (ad.isActive !== false ? 'on' : 'off')}
                      onClick={function() { toggleActive(ad) }}
                    >
                      {ad.isActive !== false ? '● Active' : '○ Inactive'}
                    </button>
                    <button className="aa-btn-edit" onClick={function() { openEditForm(ad) }}>Edit</button>
                    <button className="aa-btn-delete" onClick={function() { deleteAd(ad._id) }}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}