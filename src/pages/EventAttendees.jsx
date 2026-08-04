import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

const STATUS_COLOR = {
  confirmed: { bg: "#d1fae5", text: "#065f46" },
  pending:   { bg: "#fef3c7", text: "#92400e" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
  used:      { bg: "#f3f4f6", text: "#6b7280" },
}

export default function EventAttendees() {
  const { id } = useParams()
  const { user, authReady } = useAuth()
  const navigate = useNavigate()

  const [event, setEvent]       = useState(null)
  const [tickets, setTickets]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("all")
  const [search, setSearch]     = useState("")
  const [actioning, setActioning] = useState(null)
  const [error, setError]       = useState("")

  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate("/login"); return }
    const load = async () => {
      try {
        const [evRes, tkRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/tickets/event/${id}`),
        ])
        setEvent(evRes.data)
        setTickets(tkRes.data)
      } catch {
        setError("Failed to load attendees.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, authReady, user])

  const handleAction = async (ticketId, action) => {
    setActioning(ticketId)
    try {
      const res = await api.put(`/tickets/${ticketId}/${action}`)
      setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, status: res.data.status } : t))
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.")
    } finally {
      setActioning(null)
    }
  }

  const filtered = tickets
    .filter(t => filter === "all" || t.status === filter)
    .filter(t =>
      !search ||
      t.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
      t.attendeePhone.includes(search) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase())
    )

  // Stats
  const confirmed  = tickets.filter(t => t.status === "confirmed").length
  const pending    = tickets.filter(t => t.status === "pending").length
  const used       = tickets.filter(t => t.status === "used").length
  const cancelled  = tickets.filter(t => t.status === "cancelled").length

  if (!authReady || loading) return <div style={s.center}>Loading attendees...</div>

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        <button style={s.back} onClick={() => navigate(`/events/${id}`)}>← Back to event</button>
        <h1 style={s.title}>Attendees</h1>
        <p style={s.sub}>{event?.title}</p>

        {/* Stats strip */}
        <div style={s.stats}>
          {[
            { label: "Total",     val: tickets.length, color: "#1a1a2e" },
            { label: "Confirmed", val: confirmed,       color: "#00b09b" },
            { label: "Pending",   val: pending,         color: "#f59e0b" },
            { label: "Used",      val: used,            color: "#6b7280" },
            { label: "Cancelled", val: cancelled,       color: "#ef4444" },
          ].map(st => (
            <div key={st.label} style={s.statCard}>
              <div style={{ ...s.statVal, color: st.color }}>{st.val}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Scan button */}
        <Link to="/scan-ticket" style={s.scanBtn}>
          📷 Open Door Scanner
        </Link>

        {/* Search */}
        <input
          style={s.search}
          placeholder="Search by name, phone or ticket number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

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

        {error && <p style={s.error}>{error}</p>}

        {/* Attendee list */}
        {filtered.length === 0 ? (
          <p style={s.empty}>No attendees found.</p>
        ) : (
          <div style={s.list}>
            {filtered.map(ticket => {
              const sc = STATUS_COLOR[ticket.status] || STATUS_COLOR.confirmed
              const isActioning = actioning === ticket._id
              return (
                <div key={ticket._id} style={s.row}>
                  <div style={s.rowLeft}>
                    <div style={s.avatar}>
                      {ticket.attendeeName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={s.name}>{ticket.attendeeName}</div>
                      <div style={s.meta}>{ticket.attendeePhone}</div>
                      <div style={s.meta}>
                        {ticket.ticketType?.name} ·{" "}
                        <span style={{ fontFamily: "monospace", fontSize: 11 }}>
                          {ticket.ticketNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={s.rowRight}>
                    <span style={{ ...s.pill, background: sc.bg, color: sc.text }}>
                      {ticket.status}
                    </span>
                    <div style={s.btnRow}>
                      {ticket.status === "pending" && (
                        <button
                          style={s.confirmBtn}
                          disabled={isActioning}
                          onClick={() => handleAction(ticket._id, "confirm")}
                        >
                          {isActioning ? "..." : "Confirm"}
                        </button>
                      )}
                      {(ticket.status === "pending" || ticket.status === "confirmed") && (
                        <button
                          style={s.cancelBtn}
                          disabled={isActioning}
                          onClick={() => handleAction(ticket._id, "cancel")}
                        >
                          {isActioning ? "..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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
  wrap:       { maxWidth: 720, margin: "0 auto" },
  center:     { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontSize: 14, color: "#666" },
  back:       { background: "none", border: "none", color: "#00b09b", fontSize: 13, cursor: "pointer", marginBottom: 12, padding: 0 },
  title:      { fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 },
  sub:        { fontSize: 13, color: "#888", marginBottom: 20 },
  stats:      { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 16 },
  statCard:   { background: "#fff", borderRadius: 10, padding: "12px 8px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  statVal:    { fontSize: 22, fontWeight: 700 },
  statLabel:  { fontSize: 11, color: "#aaa", marginTop: 2 },
  scanBtn:    { display: "inline-block", padding: "10px 20px", background: "#1a1a2e", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600, marginBottom: 16 },
  search:     { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none" },
  tabs:       { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  tab:        { padding: "5px 12px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12, cursor: "pointer", color: "#555" },
  tabActive:  { background: "#00b09b", borderColor: "#00b09b", color: "#fff" },
  error:      { color: "#ef4444", fontSize: 13, marginBottom: 12 },
  empty:      { color: "#888", fontSize: 14, textAlign: "center", padding: "40px 0" },
  list:       { display: "flex", flexDirection: "column", gap: 10 },
  row:        { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", gap: 12, flexWrap: "wrap" },
  rowLeft:    { display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 },
  rowRight:   { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 },
  avatar:     { width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#00b09b,#96c93d)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 },
  name:       { fontSize: 14, fontWeight: 600, color: "#1a1a2e" },
  meta:       { fontSize: 12, color: "#888" },
  pill:       { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 },
  btnRow:     { display: "flex", gap: 6 },
  confirmBtn: { padding: "5px 12px", background: "#00b09b", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" },
  cancelBtn:  { padding: "5px 12px", background: "#fff", color: "#ef4444", border: "1.5px solid #ef4444", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" },
}