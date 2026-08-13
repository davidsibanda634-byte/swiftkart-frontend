import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

const STATUS_COLOR = {
  confirmed: { bg: "#d1fae5", text: "#065f46" },
  pending:   { bg: "#fef3c7", text: "#92400e" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
  used:      { bg: "#f3f4f6", text: "#6b7280" },
}

export default function FindTicket() {
  const [phone, setPhone]       = useState("")
  const [tickets, setTickets]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError]       = useState("")

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!phone.trim()) { setError("Please enter your phone number."); return }
    setLoading(true)
    setError("")
    setSearched(false)
    try {
      const res = await api.get(`/tickets/find/${encodeURIComponent(phone.trim())}`)
      setTickets(res.data)
      setSearched(true)
    } catch {
      setError("Failed to search. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.header}>
          <div style={s.icon}>🎟</div>
          <h1 style={s.title}>Find My Ticket</h1>
          <p style={s.sub}>
            Enter the phone number you used when booking
            to find your tickets.
          </p>
        </div>

        <form onSubmit={handleSearch}>
          <label style={s.label}>Phone number</label>
          <input
            style={s.input}
            type="tel"
            placeholder="e.g. +263771234567"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Searching..." : "🔍 Find My Tickets"}
          </button>
        </form>

        {searched && tickets.length === 0 && (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>🤷</p>
            <p style={{ fontSize: 14, color: "#888" }}>
              No tickets found for this number.
            </p>
            <p style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
              Make sure you enter the same number used during booking.
            </p>
          </div>
        )}

        {tickets.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <p style={s.resultsLabel}>{tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found</p>
            <div style={s.list}>
              {tickets.map(ticket => {
                const sc   = STATUS_COLOR[ticket.status] || STATUS_COLOR.confirmed
                const date = ticket.event?.date
                  ? new Date(ticket.event.date).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric"
                    })
                  : "Date TBC"
                return (
                  <Link
                    key={ticket._id}
                    to={`/tickets/${ticket._id}`}
                    style={s.ticketRow}
                  >
                    <div style={s.rowLeft}>
                      <div style={s.eventName}>{ticket.event?.title || "Event"}</div>
                      <div style={s.rowMeta}>📅 {date}</div>
                      <div style={s.rowMeta}>
                        🎫 {ticket.ticketType?.name} · {ticket.ticketNumber}
                      </div>
                    </div>
                    <span style={{ ...s.pill, background: sc.bg, color: sc.text }}>
                      {ticket.status}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const s = {
  page:         { minHeight: "100vh", background: "#f8f9fa", padding: "32px 16px" },
  card:         { maxWidth: 520, margin: "0 auto", background: "#fff", borderRadius: 20, padding: "32px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  header:       { textAlign: "center", marginBottom: 28 },
  icon:         { fontSize: 48, marginBottom: 12 },
  title:        { fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 },
  sub:          { fontSize: 13, color: "#888", lineHeight: 1.6 },
  label:        { display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 },
  input:        { width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 },
  error:        { color: "#ef4444", fontSize: 13, marginBottom: 12 },
  btn:          { width: "100%", padding: 14, background: "linear-gradient(135deg,#00b09b,#96c93d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  emptyBox:     { textAlign: "center", padding: "32px 0 8px" },
  resultsLabel: { fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  list:         { display: "flex", flexDirection: "column", gap: 10 },
  ticketRow:    { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", borderRadius: 12, padding: "14px 16px", textDecoration: "none", border: "1px solid #f0f0f0" },
  rowLeft:      { flex: 1, minWidth: 0 },
  eventName:    { fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  rowMeta:      { fontSize: 12, color: "#888", marginBottom: 2 },
  pill:         { fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, flexShrink: 0, marginLeft: 10 },
}