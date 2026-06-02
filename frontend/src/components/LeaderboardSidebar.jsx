import { useEffect, useState } from 'react'
import Countdown from './Countdown'

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardSidebar() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setLeaders(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <aside className="lb-sidebar">
      <Countdown />

      <div className="lb-sidebar-announce">
        <p className="lb-announce-date"><span className="lb-announce-label">🏆 Winner Announced</span></p>
        <p className="lb-announce-highlight">June 10, 2026</p>
        <div className="lb-prizes">
          <span className="prize-tag prize-gold">🎁 1st — Gift</span>
          <span className="prize-tag prize-silver">🏆 Top 10 — Certificate</span>
        </div>
      </div>

      <div className="lb-sidebar-top">
        <h3 className="lb-sidebar-title">★ Top Campaigners</h3>

        {loading && (
          <div className="lb-sidebar-loading">
            <span style={{ fontSize: '1.4rem' }}>🩸</span>
            <span>Loading...</span>
          </div>
        )}

        {!loading && leaders.length === 0 && (
          <p className="lb-sidebar-empty">No registrations yet.<br />Be the first! 🩸</p>
        )}

        {!loading && leaders.length > 0 && (
          <ol className="lb-sidebar-list">
            {leaders.map((user, i) => (
              <li key={i} className={`lb-sidebar-row lb-s-rank-${i + 1}`}>
                <span className="lb-s-rank">
                  {i < 3 ? MEDALS[i] : <span className="lb-s-num">{i + 1}</span>}
                </span>
                <div className="lb-s-info">
                  <span className="lb-s-name">{user.name}</span>
                  <span className="lb-s-pts">{user.points}<span className="lb-s-pts-label"> pts</span></span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  )
}
