import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

export default function AdminSettings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    api.get('/admin/stats').then(function(res) { setStats(res.data) }).catch(function() {})
  }, [user])

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .set-section { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; margin-bottom: 20px; }
        .set-section-title { font-size: 14px; font-weight: 800; color: #08162F; margin: 0 0 18px; display: flex; align-items: center; gap: 8px; }
        .set-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f8fafc; gap: 16px; }
        .set-row:last-child { border-bottom: none; padding-bottom: 0; }
        .set-label { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0 0 3px; }
        .set-sub { font-size: 12px; color: #9ca3af; margin: 0; }
        .set-toggle {
          width: 44px; height: 24px; border-radius: 12px; border: none; cursor: pointer;
          position: relative; transition: all 0.3s; flex-shrink: 0;
        }
        .set-toggle::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 20px; height: 20px; border-radius: 50%; background: white;
          transition: all 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .set-toggle.on { background: #00C896; }
        .set-toggle.on::after { left: calc(100% - 22px); }
        .set-toggle.off { background: #e2e8f0; }
        .set-input {
          padding: 8px 14px; border: 1.5px solid #e8ecf4; border-radius: 10px;
          font-size: 13px; font-family: inherit; outline: none; width: 200px;
          transition: border-color 0.2s;
        }
        .set-input:focus { border-color: #00C896; }
        .set-save {
          background: linear-gradient(135deg,#00C896,#059669); color: white;
          border: none; padding: 10px 24px; border-radius: 10px;
          font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .set-save:hover { transform: translateY(-1px); filter: brightness(1.05); }
      `}</style>

      <div className="adm-page-header">
        <h1 className="adm-page-title">⚙️ Platform Settings</h1>
        <p className="adm-page-sub">Manage platform configuration and controls</p>
      </div>

      <div className="set-section">
        <p className="set-section-title">🌐 General</p>
        <div className="set-row">
          <div><p className="set-label">Platform Name</p><p className="set-sub">The name displayed across the platform</p></div>
          <input className="set-input" defaultValue="Scalablenexus" />
        </div>
        <div className="set-row">
          <div><p className="set-label">Contact Email</p><p className="set-sub">Email shown on the contact page</p></div>
          <input className="set-input" defaultValue="support@scalablenexus.com" type="email" />
        </div>
        <div className="set-row">
          <div></div>
          <button className="set-save">Save Changes</button>
        </div>
      </div>

      <div className="set-section">
        <p className="set-section-title">🔧 Platform Controls</p>
        {[
          { label: 'Maintenance Mode', sub: 'Show maintenance page to all visitors', default: false },
          { label: 'Allow New Registrations', sub: 'Let new users create accounts', default: true },
          { label: 'Allow New Listings', sub: 'Let users post new listings', default: true },
          { label: 'Email Notifications', sub: 'Send admin email alerts for new reports', default: true },
        ].map(function(item) {
          const [on, setOn] = useState(item.default)
          return (
            <div key={item.label} className="set-row">
              <div><p className="set-label">{item.label}</p><p className="set-sub">{item.sub}</p></div>
              <button
                className={'set-toggle ' + (on ? 'on' : 'off')}
                onClick={function() { setOn(!on) }}
              />
            </div>
          )
        })}
      </div>

      <div className="set-section">
        <p className="set-section-title">⚠️ Danger Zone</p>
        <div className="set-row">
          <div>
            <p className="set-label" style={{ color: '#dc2626' }}>Clear All Reports</p>
            <p className="set-sub">Permanently dismiss all pending reports</p>
          </div>
          <button style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '8px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Clear Reports
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}