import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

const STATUS_COLOR = {
  confirmed: "#00b09b",
  pending:   "#f59e0b",
  cancelled: "#ef4444",
  used:      "#6b7280",
}

export default function TicketView() {
  const { id } = useParams()
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState("")

  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate("/login"); return }
    api.get(`/tickets/${id}`)
      .then(r => setTicket(r.data))
      .catch(() => setError("Ticket not found."))
      .finally(() => setLoading(false))
  }, [id, authReady, user])

  if (!authReady || loading) return <div style={s.center}>Loading your ticket...</div>
  if (error)  return <div style={s.center}><p style={{ color: "#ef4444" }}>{error}</p></div>
  if (!ticket) return null

  const statusColor = STATUS_COLOR[ticket.status] || "#333"
  const eventDate   = ticket.event?.date
    ? new Date(ticket.event.date).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "Date TBC"

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Header strip */}
        <div style={s.strip}>
          <div style={s.stripTitle}>🎟 Scalablenexus Ticket</div>
          <div style={{ ...s.statusPill, background: statusColor }}>
            {ticket.status.toUpperCase()}
          </div>
        </div>

        {/* Event info */}
        <div style={s.body}>
          <h2 style={s.eventTitle}>{ticket.event?.title}</h2>
          <p style={s.eventMeta}>📅 {eventDate}</p>
          <p style={s.eventMeta}>
            📍 {[ticket.event?.location?.city, ticket.event?.location?.country].filter(Boolean).join(", ") || "Location TBC"}
          </p>

          <div style={s.divider} />

          {/* Attendee + ticket details */}
          <div style={s.row}>
            <div>
              <div style={s.rowLabel}>Name</div>
              <div style={s.rowVal}>{ticket.attendeeName}</div>
            </div>
            <div>
              <div style={s.rowLabel}>Phone</div>
              <div style={s.rowVal}>{ticket.attendeePhone}</div>
            </div>
          </div>
          <div style={s.row}>
            <div>
              <div style={s.rowLabel}>Ticket type</div>
              <div style={s.rowVal}>{ticket.ticketType?.name}</div>
            </div>
            <div>
              <div style={s.rowLabel}>Price</div>
              <div style={s.rowVal}>
                {ticket.ticketType?.price === 0 ? "Free" : `$${ticket.ticketType?.price}`}
              </div>
            </div>
          </div>
          <div style={s.row}>
            <div>
              <div style={s.rowLabel}>Ticket number</div>
              <div style={{ ...s.rowVal, fontFamily: "monospace", letterSpacing: 1 }}>
                {ticket.ticketNumber}
              </div>
            </div>
          </div>

          <div style={s.divider} />

          {/* QR Code */}
          {ticket.status === "confirmed" && ticket.qrData ? (
            <div style={s.qrWrap}>
              <p style={s.qrLabel}>Show this QR at the door</p>
              <img src={ticket.qrData} alt="Ticket QR Code" style={s.qr} />
              <p style={s.qrHint}>Screenshot or save this page</p>
            </div>
          ) : ticket.status === "pending" ? (
            <div style={s.pendingBox}>
              <p>⏳ Your ticket is pending confirmation by the organizer.</p>
              <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                The QR code will appear here once confirmed.
              </p>
            </div>
          ) : null}

          <div style={s.actions}>
            <Link to="/my-tickets" style={s.linkBtn}>View all my tickets</Link>
            <Link to={`/events/${ticket.event?._id}`} style={s.linkBtn}>Back to event</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page:       { minHeight: "100vh", background: "#f8f9fa", padding: "24px 16px" },
  center:     { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontSize: 14, color: "#666" },
  card:       { maxWidth: 480, margin: "0 auto", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" },
  strip:      { background: "linear-gradient(135deg,#00b09b,#96c93d)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  stripTitle: { color: "#fff", fontWeight: 700, fontSize: 16 },
  statusPill: { color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "rgba(255,255,255,0.25)" },
  body:       { padding: "24px" },
  eventTitle: { fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 },
  eventMeta:  { fontSize: 13, color: "#666", marginBottom: 4 },
  divider:    { height: 1, background: "#f0f0f0", margin: "16px 0", borderTop: "1px dashed #ddd" },
  row:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  rowLabel:   { fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  rowVal:     { fontSize: 14, fontWeight: 600, color: "#1a1a2e" },
  qrWrap:     { textAlign: "center", padding: "8px 0 4px" },
  qrLabel:    { fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 12 },
  qr:         { width: 200, height: 200, borderRadius: 8, border: "1px solid #eee" },
  qrHint:     { fontSize: 11, color: "#aaa", marginTop: 8 },
  pendingBox: { background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "14px", fontSize: 14, color: "#92400e", textAlign: "center" },
  actions:    { display: "flex", gap: 10, marginTop: 20 },
  linkBtn:    { flex: 1, textAlign: "center", padding: "10px", border: "1.5px solid #00b09b", borderRadius: 8, color: "#00b09b", textDecoration: "none", fontSize: 13, fontWeight: 600 },
}