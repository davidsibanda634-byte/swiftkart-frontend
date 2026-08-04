import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

const STATUS_COLOR = {
  confirmed: { bg: "#d1fae5", text: "#065f46" },
  pending:   { bg: "#fef3c7", text: "#92400e" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
  used:      { bg: "#f3f4f6", text: "#6b7280" },
}

export default function MyTickets() {
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("all")

  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate("/login"); return }
    api.get("/tickets/my")
      .then(r => setTickets(r.data))
      .finally(() => setLoading(false))
  }, [authReady, user])

  const filtered = filter === "all"
    ? tickets
    : tickets.filter(t => t.status === filter)

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <h1 style={s.title}>🎟 My Tickets</h1>
        <p style={s.sub}>{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</p>

        {/* Filter tabs */}
        <div style={s.tabs}>
          {["all", "confirmed", "pending", "used", "cancelled"].map(f => (
            <button
              key={f}
              style={{ ...s.tab, ...(filter === f ? s.tabActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={s.empty}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 40 }}>🎟</p>
            <p style={s.empty}>No tickets yet.</p>
            <Link to="/events" style={s.browseBtn}>Browse events</Link>
          </div>
        ) : (
          <div style={s.list}>
            {filtered.map(ticket => {
              const sc = STATUS_COLOR[ticket.status] || STATUS_COLOR.confirmed
              const date = ticket.event?.date
                ? new Date(ticket.event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                : "Date TBC"
              return (
                <Link to={`/tickets/${ticket._id}`} key={ticket._id} style={s.ticketCard}>
                  <div style={s.cardLeft}>
                    <div style={s.cardEvent}>{ticket.event?.title || "Event"}</div>
                    <div style={s.cardMeta}>📅 {date}</div>
                    <div style={s.cardMeta}>🎫 {ticket.ticketType?.name} · {ticket.ticketNumber}</div>
                  </div>
                  <div>
                    <span style={{ ...s.pill, background: sc.bg, color: sc.text }}>
                      {ticket.status}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page:       { minHeight: "100vh", background: "#f8f9fa", padding: "24px 16px" },
  wrap:       { maxWidth: 640, margin: "0 auto" },
  title:      { fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 },
  sub:        { fontSize: 13, color: "#888", marginBottom: 20 },
  tabs:       { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 },
  tab:        { padding: "6px 14px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12, cursor: "pointer", color: "#555" },
  tabActive:  { background: "#00b09b", borderColor: "#00b09b", color: "#fff" },
  list:       { display: "flex", flexDirection: "column", gap: 12 },
  ticketCard: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 12, padding: "16px", textDecoration: "none", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" },
  cardLeft:   { flex: 1, minWidth: 0 },
  cardEvent:  { fontSize: 15, fontWeight: 600, color: "#1a1a2e", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardMeta:   { fontSize: 12, color: "#888", marginBottom: 2 },
  pill:       { fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20 },
  emptyBox:   { textAlign: "center", padding: "60px 20px" },
  empty:      { color: "#888", fontSize: 14, margin: "8px 0" },
  browseBtn:  { display: "inline-block", marginTop: 12, padding: "10px 24px", background: "#00b09b", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 },
}