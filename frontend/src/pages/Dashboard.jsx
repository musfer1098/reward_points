import API_BASE from '../config.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IsaarHeader from '../components/IsaarHeader'
import Stars from '../components/Stars'
import PageLayout from '../components/PageLayout'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    fetch(`${API_BASE}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message)
          localStorage.clear()
          setTimeout(() => navigate('/login'), 2000)
        } else {
          setUser(data)
          localStorage.setItem('user', JSON.stringify(data))
        }
      })
      .catch(() => setError('Failed to load your data.'))
  }, [navigate])

  function copyCode() {
    if (!user?.referralCode) return
    navigator.clipboard.writeText(user.referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function handleLogout() {
    localStorage.clear()
    navigate('/')
  }

  if (error) return (
    <PageLayout>
      <div className="form-card"><div className="error-msg">{error}</div></div>
    </PageLayout>
  )

  if (!user) return (
    <PageLayout>
      <div className="form-card">
        <div className="loading-pulse">
          <div className="loading-drop">🩸</div>
          <p>Loading your stars...</p>
        </div>
      </div>
    </PageLayout>
  )

  return (
    <PageLayout>
      <div className="dashboard-card">
        <IsaarHeader />
        <div className="divider" />

        <div className="dash-welcome">
          <div>
            <h2>Welcome, {user.name}!</h2>
            <p className="dash-sub">Your campaign progress</p>
          </div>
          <button className="btn-ghost" onClick={handleLogout}>Logout</button>
        </div>

        <div className="points-hero">
          <div className="points-hero-bg" />
          <div className="points-hero-content">
            <p className="points-label">Your Reward Stars</p>
            <div className="points-stars-row">
              <Stars count={user.points} size="lg" />
            </div>
            <div className="points-number">
              <span className="points-big">{user.points}</span>
              <span className="points-unit">pts</span>
            </div>
            <p className="points-sub">
              {Math.floor(user.points / 10) >= 5
                ? "Amazing! You're a top campaigner 🏆"
                : Math.floor(user.points / 10) >= 2
                ? 'Great start! Keep referring friends ★'
                : 'Keep going — refer friends to earn more!'}
            </p>
          </div>
        </div>

        <div className="referral-block">
          <div className="referral-header">
            <span className="referral-icon">🔗</span>
            <div>
              <p className="referral-label">
                Your Referral Code
                <span className="referral-label-ur">آپ کا ریفرل کوڈ</span>
              </p>
              <p className="referral-earn">
                Share it — earn <strong>20 pts</strong> per friend!
                <span className="referral-earn-ur">شیئر کریں — ہر دوست پر <strong>۲۰ پوائنٹس</strong> کمائیں!</span>
              </p>
            </div>
          </div>
          <div className="referral-row">
            <span className="referral-code">{user.referralCode}</span>
            <button className={`btn btn-sm ${copied ? 'btn-copied' : 'btn-outline'}`} onClick={copyCode}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="user-info-block">
          <div className="info-row">
            <span className="info-label">📱 Phone</span>
            <span className="info-value">{user.phone}</span>
          </div>
          {user.email && (
            <div className="info-row">
              <span className="info-label">✉️ Email</span>
              <span className="info-value">{user.email}</span>
            </div>
          )}
          {user.usedReferralCode && (
            <div className="info-row">
              <span className="info-label">🎟 Used Code</span>
              <span className="info-value referral-used">{user.usedReferralCode}</span>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
