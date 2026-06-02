import API_BASE from '../config.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IsaarHeader from '../components/IsaarHeader'
import PageLayout from '../components/PageLayout'
import { isCampaignEnded } from '../utils/campaign'

const MEDALS = ['🥇', '🥈', '🥉']

const features = [
  {
    icon: '🩸',
    en: { title: 'Register & Earn Stars', desc: <>Sign up to get <span className="gold">★★</span> 10 points instantly</> },
    ur: { title: 'رجسٹر کریں اور ستارے کمائیں', desc: 'فوری طور پر ۱۰ پوائنٹس حاصل کریں' },
  },
  {
    icon: '👥',
    en: { title: 'Refer Friends', desc: <>Earn <span className="gold">★★★★</span> 20 points per referral</> },
    ur: { title: 'دوستوں کو ریفر کریں', desc: 'ہر ریفرل پر ۲۰ پوائنٹس کمائیں' },
  },
  {
    icon: '🌟',
    en: { title: 'Friends Benefit Too', desc: <>They get <span className="gold">★★</span> 10 points for joining</> },
    ur: { title: 'دوستوں کو بھی فائدہ', desc: 'شامل ہونے پر انہیں ۱۰ پوائنٹس ملتے ہیں' },
  },
]

function WinnersView() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/api/leaderboard`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setLeaders(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="landing-card">
      <IsaarHeader />
      <div className="divider" />

      <div className="campaign-ended-banner">
        <p className="ended-title">🎉 Campaign Has Ended!</p>
        <p className="ended-sub">Thank you to everyone who participated in the Isaar Registration Campaign.</p>
      </div>

      <div className="winners-section">
        <h2 className="winners-heading">🏆 Final Results</h2>

        {loading && (
          <div className="loading-pulse">
            <div className="loading-drop">🩸</div>
            <p>Loading results...</p>
          </div>
        )}

        {!loading && leaders.length === 0 && (
          <p className="lb-sidebar-empty">No results available.</p>
        )}

        {!loading && leaders.length > 0 && (
          <ol className="winners-list">
            {leaders.map((user, i) => (
              <li key={i} className={`winner-row ${i === 0 ? 'winner-first' : ''} ${i < 3 ? `winner-top3` : ''}`}>
                <span className="winner-rank">
                  {i < 3 ? MEDALS[i] : <span className="lb-s-num">{i + 1}</span>}
                </span>
                <div className="winner-info">
                  <span className="winner-name">{user.name}</span>
                  {i === 0 && <span className="winner-prize-badge">🎁 Gift Winner</span>}
                  {i > 0 && <span className="winner-cert-badge">🏆 Certificate</span>}
                </div>
                <span className="winner-pts">{user.points}<span className="lb-s-pts-label"> pts</span></span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const ended = isCampaignEnded()

  if (ended) {
    return (
      <PageLayout hideSidebar>
        <WinnersView />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="landing-card">
        <IsaarHeader />
        <div className="divider" />

        <div className="landing-features">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-text">
                <div className="feature-bilingual">
                  <strong className="feature-en">{f.en.title}</strong>
                  <strong className="feature-ur">{f.ur.title}</strong>
                </div>
                <div className="feature-bilingual feature-desc">
                  <span className="feature-en">{f.en.desc}</span>
                  <span className="feature-ur">{f.ur.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="landing-actions">
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            <span>🩸</span>
            <span className="btn-bilingual">
              <span>Register for the Campaign</span>
              <span className="btn-ur">مہم میں رجسٹر کریں</span>
            </span>
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>
            <span>★</span>
            <span className="btn-bilingual">
              <span>Already Registered? View My Stars</span>
              <span className="btn-ur">پہلے سے رجسٹرڈ؟ اپنے پوائنٹس دیکھیں</span>
            </span>
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
