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
  const [paymentMethod, setPaymentMethod]       = useState("ecocash")
  const [paymentReference, setPaymentReference] = useState("")
  const [paymentProofNote, setPaymentProofNote] = useState("")
  const [bookedTicket, setBookedTicket]         = useState(null)

  useEffect(() => {
    if (!authReady) return
   
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

  // For paid tickets require a reference number
  const selectedType = ticketTypes.find(tt => tt._id === selected)
  if (selectedType?.price > 0 && !paymentReference) {
    setError("Please enter your payment reference number.")
    return
  }

  setSubmitting(true)
  setError("")
  try {
    const res = await api.post("/tickets", {
      ticketTypeId:     selected,
      attendeeName,
      attendeePhone,
      paymentMethod,
      paymentReference,
      paymentProofNote,
    })
    setBookedTicket(res.data)
  } catch (err) {
    setError(err.response?.data?.message || "Booking failed. Please try again.")
  } finally {
    setSubmitting(false)
  }
}

  if (!authReady || loading) return <div style={s.center}>Loading...</div>
  // Success screen after booking
if (bookedTicket) {
  const isFree = !bookedTicket.organizerWhatsApp
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ textAlign: "center", padding: "32px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{isFree ? "🎟" : "⏳"}</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
            {isFree ? "Ticket Confirmed!" : "Booking Received!"}
          </h2>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>
            {isFree
              ? "Your ticket is ready. Tap below to view your QR code."
              : "Your ticket is pending. Tap below to notify the organizer on WhatsApp and they will confirm after verifying your payment."}
          </p>

          {bookedTicket.organizerWhatsApp && (
            <a
              href={bookedTicket.organizerWhatsApp}
              target="_blank"
              rel="noreferrer"
              style={{ ...s.btn, display: "block", textDecoration: "none", marginBottom: 12, background: "linear-gradient(135deg,#25d366,#128c7e)" }}
            >
              📲 Notify Organizer on WhatsApp
            </a>
          )}

          <button
            style={s.btn}
            onClick={() => navigate(`/tickets/${bookedTicket._id}`)}
          >
            View My Ticket
          </button>
        </div>
      </div>
    </div>
  )
 }

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

          {/* Payment section — only shown for paid tickets */}
 {ticketTypes.find(tt => tt._id === selected)?.price > 0 && (() => {
  const hasCash  = event.ecocashNumber
  const hasUpi   = event.upiId
  return (
    <div style={{ background: "#f0fdfb", border: "1.5px solid #00b09b", borderRadius: 12, padding: "16px 14px", marginBottom: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#00b09b", marginBottom: 12 }}>
        💳 Payment Required
      </p>

      {/* Method tabs */}
      {hasCash && hasUpi && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["ecocash", "upi"].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setPaymentMethod(m)}
              style={{
                flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid",
                borderColor: paymentMethod === m ? "#00b09b" : "#e5e7eb",
                background:  paymentMethod === m ? "#00b09b" : "#fff",
                color:       paymentMethod === m ? "#fff" : "#555",
                fontWeight: 600, fontSize: 12, cursor: "pointer",
              }}
            >
              {m === "ecocash" ? "📱 EcoCash" : "🏦 UPI"}
            </button>
          ))}
        </div>
      )}

      {/* EcoCash details */}
      {(paymentMethod === "ecocash" || !hasUpi) && hasCash && (
        <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Send payment to:</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{event.ecocashNumber}</p>
          <p style={{ fontSize: 12, color: "#555" }}>{event.ecocashName}</p>
        </div>
      )}

      {/* UPI details */}
      {(paymentMethod === "upi" || !hasCash) && hasUpi && (
        <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Send payment to:</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{event.upiId}</p>
          <p style={{ fontSize: 12, color: "#555" }}>{event.upiName}</p>
        </div>
      )}

      {/* Payment instructions */}
      {event.paymentInstructions && (
        <p style={{ fontSize: 12, color: "#555", marginBottom: 12, fontStyle: "italic" }}>
          ℹ️ {event.paymentInstructions}
        </p>
      )}

      {/* Reference number */}
      <div style={{ marginBottom: 10 }}>
        <label style={s.label}>
          {paymentMethod === "upi" ? "UPI UTR / Transaction ID *" : "EcoCash Reference Number *"}
        </label>
        <input
          style={s.input}
          placeholder={paymentMethod === "upi" ? "e.g. 427612345678" : "e.g. FT26123ABC456"}
          value={paymentReference}
          onChange={e => setPaymentReference(e.target.value)}
        />
      </div>

      {/* Optional note */}
      <div>
        <label style={s.label}>Note to organizer (optional)</label>
        <input
          style={s.input}
          placeholder="e.g. Paid at 2pm"
          value={paymentProofNote}
          onChange={e => setPaymentProofNote(e.target.value)}
        />
      </div>
    </div>
  )
})()}

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