import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function EditEvent() {
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm]       = useState({
    title: '', description: '', date: '', phone: '',
    location: { country: '', city: '', area: '' }
  })


  // ── Ticket state ──────────────────────────────────────


  const [ticketsEnabled, setTicketsEnabled] = useState(false)


  const [capacity, setCapacity]             = useState('')


  const [ticketTypes, setTicketTypes]       = useState([])


  const [ttSaving, setTtSaving]             = useState(false)


  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate('/login'); return }
    const load = async () => {
      try {

        const [evRes, ttRes] = await Promise.all([


          api.get('/events/' + id),


          api.get(`/ticket-types/event/${id}`),


        ])

        const data = evRes.data
        const ownerId = data.user?._id || data.user
        if (ownerId !== user._id) { navigate('/'); return }
        setForm({
          title:       data.title       || '',
          description: data.description || '',
          date:        data.date ? data.date.slice(0, 10) : '',
          phone:       data.phone       || '',
          location: {
            country: data.location?.country || '',
            city:    data.location?.city    || '',
            area:    data.location?.area    || '',
          }
        })

        setTicketsEnabled(data.ticketsEnabled || false)


        setCapacity(data.capacity || '')


        setTicketTypes(ttRes.data.map(tt => ({


          _id:         tt._id,


          name:        tt.name,


          price:       String(tt.price),


          quantity:    String(tt.quantity),


          description: tt.description || '',


        })))

      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, authReady])

  function handleChange(e)   { setForm({ ...form, [e.target.name]: e.target.value }) }
  function handleLocation(e) { setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } }) }


  const addTt    = () => setTicketTypes(prev => [...prev, { name: '', price: '0', quantity: '', description: '' }])


  const removeTt = (i) => setTicketTypes(prev => prev.filter((_, idx) => idx !== i))


  const updateTt = (i, field, val) => setTicketTypes(prev => prev.map((tt, idx) => idx === i ? { ...tt, [field]: val } : tt))


  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {

      await api.put('/events/' + id, { ...form, ticketsEnabled, capacity: capacity || 0 })



      // Sync ticket types — update existing, create new ones


      if (ticketsEnabled) {


        setTtSaving(true)


        await Promise.all(


          ticketTypes


            .filter(tt => tt.name.trim())


            .map(tt => tt._id


              ? api.put(`/ticket-types/${tt._id}`, { name: tt.name, price: parseFloat(tt.price) || 0, quantity: parseInt(tt.quantity) || 0, description: tt.description })


              : api.post('/ticket-types', { eventId: id, name: tt.name, price: parseFloat(tt.price) || 0, quantity: parseInt(tt.quantity) || 0, description: tt.description })


            )


        )


        setTtSaving(false)


      }


      setSuccess('Event updated successfully!')
      setTimeout(() => navigate('/my-listings'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update.')
    } finally {
      setSaving(false)
    }
  }

  if (!authReady || loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#08162F' }}>
      <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Plus Jakarta Sans, sans-serif' }}>Loading...</p>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ee-bg { min-height:100vh; font-family:'Plus Jakarta Sans',sans-serif; padding:24px 16px 80px; background-image:linear-gradient(to bottom,rgba(8,14,40,0.88) 0%,rgba(10,20,55,0.82) 50%,rgba(8,14,40,0.92) 100%),url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80'); background-size:cover; background-position:center; background-attachment:fixed; }
        .ee-inner { max-width:560px; margin:0 auto; }
        .ee-back { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white; padding:8px 16px; border-radius:10px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:5px; margin-bottom:20px; transition:all 0.2s; }
        .ee-back:hover { background:rgba(255,255,255,0.18); }
        .ee-card { background:rgba(255,255,255,0.07); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-radius:24px; border:1px solid rgba(255,255,255,0.14); padding:32px 28px; box-shadow:0 24px 64px rgba(0,0,0,0.4); }
        .ee-header { text-align:center; margin-bottom:28px; }
        .ee-header-icon { width:52px; height:52px; background:linear-gradient(135deg,#be185d,#9d174d); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 14px; box-shadow:0 8px 24px rgba(190,24,93,0.4); }
        .ee-title { font-size:21px; font-weight:800; color:white; margin:0 0 5px; letter-spacing:-0.4px; }
        .ee-sub { font-size:13px; color:rgba(255,255,255,0.55); margin:0; }
        .ee-label { display:block; font-size:12px; font-weight:600; color:rgba(255,255,255,0.72); margin-bottom:7px; }
        .ee-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.16); border-radius:11px; font-size:13.5px; color:white; outline:none; box-sizing:border-box; font-family:inherit; transition:all 0.2s; }
        .ee-input::placeholder { color:rgba(255,255,255,0.32); }
        .ee-input:focus { border-color:#be185d; background:rgba(255,255,255,0.14); box-shadow:0 0 0 3px rgba(190,24,93,0.15); }
        .ee-field { margin-bottom:15px; }
        .ee-hint { font-size:10.5px; color:rgba(255,255,255,0.38); margin-top:4px; }
        .ee-section-label { font-size:11px; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.8px; margin:18px 0 10px; }
        .ee-location-group { display:flex; flex-direction:column; gap:8px; }
        .ee-error { background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.35); color:#fca5a5; padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:16px; }
        .ee-success { background:rgba(190,24,93,0.15); border:1px solid rgba(190,24,93,0.35); color:#f9a8d4; padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:16px; }
        .ee-btn-row { display:flex; gap:10px; margin-top:22px; }
        .ee-cancel-btn { flex:1; background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.15); padding:13px; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; }
        .ee-cancel-btn:hover { background:rgba(255,255,255,0.14); }
        .ee-save-btn { flex:2; background:linear-gradient(135deg,#be185d,#9d174d); color:white; border:none; padding:13px; border-radius:12px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit; box-shadow:0 6px 20px rgba(190,24,93,0.4); transition:all 0.2s; }
        .ee-save-btn:hover { transform:translateY(-1px); }
        .ee-save-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .ee-toggle-row { display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:11px; padding:12px 14px; margin-bottom:14px; cursor:pointer; }
        .ee-toggle-label { font-size:13px; font-weight:600; color:rgba(255,255,255,0.85); }
        .ee-toggle-sub { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }
        .ee-tt-card { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:14px; margin-bottom:10px; }
        .ee-tt-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; }
        .ee-tt-remove { background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; padding:5px 10px; border-radius:7px; font-size:11px; cursor:pointer; font-family:inherit; float:right; margin-bottom:8px; }
        .ee-add-tt { width:100%; padding:10px; background:rgba(190,24,93,0.1); border:1.5px dashed rgba(190,24,93,0.4); color:#f9a8d4; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; margin-top:4px; }
        .ee-add-tt:hover { background:rgba(190,24,93,0.18); }
        @media(max-width:480px){ .ee-card { padding:24px 16px; } .ee-tt-row { grid-template-columns:1fr; } }
      `}</style>

      <div className="ee-bg">
        <div className="ee-inner">
          <button className="ee-back" onClick={() => navigate('/my-listings')}>← My Listings</button>
          <div className="ee-card">
            <div className="ee-header">
              <div className="ee-header-icon">✏️</div>
              <h1 className="ee-title">Edit Event</h1>
              <p className="ee-sub">Update your event details below</p>
            </div>

            {error   && <div className="ee-error">{error}</div>}
            {success && <div className="ee-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="ee-field">
                <label className="ee-label">Title *</label>
                <input className="ee-input" type="text" name="title" value={form.title} onChange={handleChange} placeholder="Event title" required />
              </div>
              <div className="ee-field">
                <label className="ee-label">Description</label>
                <textarea className="ee-input" name="description" value={form.description} onChange={handleChange} placeholder="Describe your event..." rows={4} style={{ resize:'vertical' }} />
              </div>
              <div className="ee-field">
                <label className="ee-label">Event Date *</label>
                <input className="ee-input" type="date" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="ee-field">
                <label className="ee-label">WhatsApp Number *</label>
                <input className="ee-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+263771234567" required />
                <p className="ee-hint">Include country code e.g. +263 Zimbabwe</p>
              </div>
              <p className="ee-section-label">Location</p>
              <div className="ee-location-group">
                <input className="ee-input" type="text" name="country" value={form.location.country} onChange={handleLocation} placeholder="Country" required />
                <input className="ee-input" type="text" name="city" value={form.location.city} onChange={handleLocation} placeholder="City" required />
                <input className="ee-input" type="text" name="area" value={form.location.area} onChange={handleLocation} placeholder="Area / Campus (optional)" />
              </div>


              {/* ── Ticketing section ───────────────────────── */}


              <p className="ee-section-label">Ticketing</p>


              <div className="ee-toggle-row" onClick={() => setTicketsEnabled(!ticketsEnabled)}>


                <div>


                  <div className="ee-toggle-label">🎟 Enable Ticketing</div>


                  <div className="ee-toggle-sub">Let people book tickets for this event</div>


                </div>


                <div style={{ width:42, height:24, borderRadius:12, background: ticketsEnabled ? '#be185d' : 'rgba(255,255,255,0.2)', position:'relative', flexShrink:0, transition:'background 0.2s' }}>


                  <div style={{ position:'absolute', top:3, left: ticketsEnabled ? 21 : 3, width:18, height:18, borderRadius:'50%', background:'white', transition:'left 0.2s' }} />


                </div>


              </div>



              {ticketsEnabled && (<>


                <div className="ee-field">


                  <label className="ee-label">Total Capacity (0 = unlimited)</label>


                  <input className="ee-input" type="number" min="0"


                    value={capacity} onChange={e => setCapacity(e.target.value)}


                    placeholder="0 = unlimited" />


                </div>


                <p className="ee-section-label">Ticket Types</p>


                {ticketTypes.map((tt, i) => (


                  <div key={i} className="ee-tt-card">


                    {ticketTypes.length > 1 && <button type="button" className="ee-tt-remove" onClick={() => removeTt(i)}>Remove</button>}


                    <div className="ee-tt-row">


                      <div><label className="ee-label">Name *</label><input className="ee-input" placeholder="e.g. General, VIP" value={tt.name} onChange={e => updateTt(i, 'name', e.target.value)} /></div>


                      <div><label className="ee-label">Price ($) — 0 = Free</label><input className="ee-input" type="number" min="0" value={tt.price} onChange={e => updateTt(i, 'price', e.target.value)} /></div>


                    </div>


                    <div className="ee-tt-row">


                      <div><label className="ee-label">Quantity (0 = unlimited)</label><input className="ee-input" type="number" min="0" value={tt.quantity} onChange={e => updateTt(i, 'quantity', e.target.value)} /></div>


                      <div><label className="ee-label">Description (optional)</label><input className="ee-input" placeholder="e.g. Includes food" value={tt.description} onChange={e => updateTt(i, 'description', e.target.value)} /></div>


                    </div>


                  </div>


                ))}


                <button type="button" className="ee-add-tt" onClick={addTt}>+ Add ticket type</button>


              </>)}


              <div className="ee-btn-row">
                <button type="button" className="ee-cancel-btn" onClick={() => navigate('/my-listings')}>Cancel</button>
                <button type="submit" className="ee-save-btn" disabled={saving || ttSaving}>
                  {saving || ttSaving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}