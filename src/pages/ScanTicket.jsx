import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Html5Qrcode } from "html5-qrcode"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function ScanTicket() {
  const { user, authReady } = useAuth()
  const navigate = useNavigate()

  const [scanning, setScanning]   = useState(false)
  const [result, setResult]       = useState(null)  // { valid, message, ticket }
  const [processing, setProc]     = useState(false)
  const [error, setError]         = useState("")
  const [manualToken, setManual]  = useState("")
  const scannerRef                = useRef(null)
  const scannerInst               = useRef(null)

  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate("/login"); return }
  }, [authReady, user])

  const startScanner = async () => {
    setResult(null)
    setError("")
    setScanning(true)

    await new Promise(res => setTimeout(res, 100)) // let DOM mount

    try {
      scannerInst.current = new Html5Qrcode("qr-reader")
      await scannerInst.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await scannerInst.current.stop()
          setScanning(false)
          await validateToken(decodedText)
        },
        () => {} // ignore frame errors
      )
    } catch {
      setScanning(false)
      setError("Camera access denied. Use manual entry below.")
    }
  }

  const stopScanner = async () => {
    if (scannerInst.current) {
      try { await scannerInst.current.stop() } catch {}
    }
    setScanning(false)
  }

  const validateToken = async (token) => {
    setProc(true)
    setError("")
    try {
      const res = await api.post("/tickets/scan", { qrToken: token })
      setResult(res.data)
    } catch (err) {
      setResult({
        valid: false,
        message: err.response?.data?.message || "Validation failed.",
      })
    } finally {
      setProc(false)
    }
  }

  const handleManual = (e) => {
    e.preventDefault()
    if (!manualToken.trim()) return
    validateToken(manualToken.trim())
  }

  const reset = () => {
    setResult(null)
    setManual("")
    setError("")
  }

  if (!authReady) return null

  return (
    <div style={s.page}>
      <div style={s.card}>
        <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
        <h1 style={s.title}>📷 Door Scanner</h1>
        <p style={s.sub}>Scan a ticket QR code to grant entry</p>

        {/* Result panel */}
        {result && (
          <div style={{ ...s.resultBox, background: result.valid ? "#d1fae5" : "#fee2e2", borderColor: result.valid ? "#6ee7b7" : "#fca5a5" }}>
            <div style={s.resultIcon}>{result.valid ? "✅" : "❌"}</div>
            <div style={{ ...s.resultMsg, color: result.valid ? "#065f46" : "#991b1b" }}>
              {result.message}
            </div>
            {result.ticket && (
              <div style={s.resultDetails}>
                <div><b>Name:</b> {result.ticket.attendeeName}</div>
                <div><b>Phone:</b> {result.ticket.attendeePhone}</div>
                <div><b>Ticket:</b> {result.ticket.ticketNumber}</div>
                <div><b>Type:</b> {result.ticket.ticketType?.name}</div>
                <div><b>Event:</b> {result.ticket.event?.title}</div>
                {result.scannedAt && <div><b>Previously scanned:</b> {new Date(result.scannedAt).toLocaleTimeString()}</div>}
              </div>
            )}
            <button style={s.scanAgainBtn} onClick={reset}>Scan another ticket</button>
          </div>
        )}

        {/* Camera scanner */}
        {!result && (
          <>
            {scanning ? (
              <div>
                <div id="qr-reader" style={s.qrReader} ref={scannerRef} />
                <button style={s.stopBtn} onClick={stopScanner}>Stop camera</button>
              </div>
            ) : (
              <button style={s.startBtn} onClick={startScanner} disabled={processing}>
                {processing ? "Validating..." : "📷 Start Camera Scanner"}
              </button>
            )}

            {error && <p style={s.error}>{error}</p>}

            {/* Divider */}
            <div style={s.divider}>
              <span style={s.dividerText}>or enter token manually</span>
            </div>

            {/* Manual entry */}
            <form onSubmit={handleManual} style={s.manualForm}>
              <input
                style={s.input}
                placeholder="Paste QR token or ticket number..."
                value={manualToken}
                onChange={e => setManual(e.target.value)}
              />
              <button type="submit" style={s.manualBtn} disabled={processing || !manualToken.trim()}>
                {processing ? "..." : "Validate"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  page:          { minHeight: "100vh", background: "#f8f9fa", padding: "24px 16px" },
  card:          { maxWidth: 480, margin: "0 auto", background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" },
  back:          { background: "none", border: "none", color: "#00b09b", fontSize: 13, cursor: "pointer", marginBottom: 12, padding: 0 },
  title:         { fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 },
  sub:           { fontSize: 13, color: "#888", marginBottom: 24 },
  startBtn:      { width: "100%", padding: "14px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 16 },
  stopBtn:       { width: "100%", padding: "10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10 },
  qrReader:      { width: "100%", borderRadius: 10, overflow: "hidden" },
  error:         { color: "#ef4444", fontSize: 13, margin: "8px 0" },
  divider:       { display: "flex", alignItems: "center", gap: 10, margin: "20px 0" },
  dividerText:   { fontSize: 12, color: "#aaa", whiteSpace: "nowrap" },
  manualForm:    { display: "flex", gap: 8 },
  input:         { flex: 1, padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, outline: "none" },
  manualBtn:     { padding: "11px 18px", background: "#00b09b", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  resultBox:     { border: "1.5px solid", borderRadius: 12, padding: "20px", marginBottom: 20, textAlign: "center" },
  resultIcon:    { fontSize: 40, marginBottom: 8 },
  resultMsg:     { fontSize: 16, fontWeight: 700, marginBottom: 12 },
  resultDetails: { fontSize: 13, color: "#374151", textAlign: "left", background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "12px", marginBottom: 14, lineHeight: 1.8 },
  scanAgainBtn:  { padding: "9px 20px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
}