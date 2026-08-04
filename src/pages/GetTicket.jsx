import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function GetTicket() {
  const { id } = useParams()
  const { user, authReady } = useAuth()
  const navigate = useNavigate()

  const [event, setEvent]           = useState(null)
  const [ticketTypes, setTypes]     = useState([])
  const [selected, setSelected]     = useState(null)
  const [attendeeName, setName]     = useState("")
  const [attendeePhone, setPhone]   = useState("")
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState("")

  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate("/login"); return }
    const fetch = async () => {
      try {
        const [evRes, ttRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/ticket-types/event/${id}`),
        ])
        setEvent(evRes.data)
        setTypes(ttRes.data)
        if (ttRes.data.length > 0) setSelected(ttRes.data[0]._id)
      } catch {
        setError("Failed to load event details.")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, authReady, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected)      { setError("Please select a ticket type."); return }
    if (!attendeeName)  { setError("Please enter your name."); return }
    if (!attendeePhone) { setError("Please enter your phone number."); return }
    setSubmitting(true)
    setError("")
    try {
      const res = await api.post("/tickets", {
        ticketTypeId: selected,
        attendeeName,
        attendeePhone,
      })
      navigate(`/tickets/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!authReady || loading) return <div style={s.center}>Loading...</div>

  if (!event?.ticketsEnabled) return (
    <div style={s.center}>
      <p style={s.empty}>Tickets are not available for this event.</p>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.card}>
        <button style={s.back} onClick={() => navigate(`/events/${id}`)}>← Back to event</button>

        <h1 style={s.title}>Get a Ticket</h1>
        <p style={s.sub}>{event?.title}</p>

        {/* Ticket type selector */}
        <div style={s.section}>
          <label style={s.label}>Select ticket type</label>
          <div style={s.typeGrid}>
            {ticketTypes.map(tt => (
              <div
                key={tt._id}
                style={{
                  ...s.typeCard,
                  ...(selected === tt._id ? s.typeCardActive : {}),
                  ...(tt.isSoldOut ? s.typeCardDisabled : {}),
                }}
                onClick={() => !tt.isSoldOut && setSelected(tt._id)}
              >
                <div style={s.typeName}>{tt.name}</div>
                <div style={s.typePrice}>
                  {tt.price === 0 ? "Free" : `$${tt.price} ${tt.currency}`}
                </div>
                {tt.description && <div style={s.typeDesc}>{tt.description}</div>}
                {tt.quantity > 0 && <div style={s.typeRemaining}>
                  {tt.isSoldOut ? "Sold out" : `${tt.remaining} remaining`}
                </div>}
              </div>
            ))}
          </div>
        </div>

        {/* Attendee form */}
        <form onSubmit={handleSubmit}>
          <div style={s.section}>
            <label style={s.label}>Your full name</label>
            <input
              style={s.input}
              placeholder="e.g. Tafadzwa Moyo"
              value={attendeeName}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div style={s.section}>
            <label style={s.label}>WhatsApp number</label>
            <input
              style={s.input}
              placeholder="e.g. +263778123456"
              value={attendeePhone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.btn} disabled={submitting}>
            {submitting ? "Booking..." : "Confirm & Get Ticket"}
          </button>
        </form>
      </div>
    </div>
  )
}

const s = {
  page:            { minHeight: "100vh", background: "#f8f9fa", padding: "24px 16px" },
  center:          { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" },
  card:            { maxWidth: 540, margin: "0 auto", background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" },
  back:            { background: "none", border: "none", color: "#00b09b", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0 },
  title:           { fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 },
  sub:             { fontSize: 14, color: "#666", marginBottom: 24 },
  section:         { marginBottom: 20 },
  label:           { display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 },
  typeGrid:        { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 },
  typeCard:        { border: "2px solid #e5e7eb", borderRadius: 10, padding: "12px", cursor: "pointer", transition: "all 0.15s" },
  typeCardActive:  { border: "2px solid #00b09b", background: "#f0fdfb" },
  typeCardDisabled:{ opacity: 0.5, cursor: "not-allowed" },
  typeName:        { fontSize: 14, fontWeight: 600, color: "#1a1a2e" },
  typePrice:       { fontSize: 18, fontWeight: 700, color: "#00b09b", margin: "4px 0" },
  typeDesc:        { fontSize: 11, color: "#888" },
  typeRemaining:   { fontSize: 11, color: "#f59e0b", marginTop: 4 },
  input:           { width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" },
  error:           { color: "#ef4444", fontSize: 13, marginBottom: 12 },
  btn:             { width: "100%", padding: "14px", background: "linear-gradient(135deg,#00b09b,#96c93d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  empty:           { color: "#888", fontSize: 14 },
}