import { useNavigate } from 'react-router-dom'
import IsaarHeader from '../components/IsaarHeader'
import PageLayout from '../components/PageLayout'

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

export default function Landing() {
  const navigate = useNavigate()

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
