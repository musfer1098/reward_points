import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IsaarHeader from '../components/IsaarHeader'
import Stars from '../components/Stars'

const MEDALS = ['🥇', '🥈', '🥉']
const PRIZE_DATE = 'June 10, 2026'

export default function Leaderboard() {
  const navigate = useNavigate()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLeaders(data)
        else setError('Could not load leaderboard.')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-bg">
      <div className="leaderboard-card">
        <IsaarHeader />
        <div className="divider" />

        {/* Announcement banner */}
        <div className="announce-banner">
          <div className="announce-icon">📢</div>
          <div>
            <p className="announce-title">Winner Announced on {PRIZE_DATE}</p>
            <p className="announce-sub">
              <span className="prize-tag prize-gold">🎁 1st Place — Special Gift</span>
              <span className="prize-tag prize-silver">🏆 Top 10 — Certificate of Honor</span>
            </p>
          </div>
        </div>

        <h2 className="lb-heading">★ Top 10 Campaigners</h2>

        {loading && (
          <div className="loading-pulse">
            <div className="loading-drop">🩸</div>
            <p>Loading leaderboard...</p>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && leaders.length === 0 && (
          <p className="lb-empty">No registrations yet — be the first! 🩸</p>
        )}

        {!loading && leaders.length > 0 && (
          <ol className="lb-list">
            {leaders.map((user, i) => (
              <li key={i} className={`lb-row lb-rank-${i + 1}`}>
                <span className="lb-rank">
                  {i < 3 ? MEDALS[i] : <span className="lb-num">{i + 1}</span>}
                </span>
                <div className="lb-info">
                  <span className="lb-name">{user.name}</span>
                  <Stars count={user.points} size="sm" />
                </div>
                <div className="lb-right">
                  <span className="lb-points">{user.points}</span>
                  <span className="lb-pts-label">pts</span>
                </div>
                {i === 0 && <span className="lb-prize-tag">🎁 Gift</span>}
                {i > 0 && i < 10 && <span className="lb-prize-tag lb-cert">🏆 Cert</span>}
              </li>
            ))}
          </ol>
        )}

        <div className="lb-actions">
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            🩸 Join & Earn Stars
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
