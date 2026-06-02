import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import IsaarHeader from '../components/IsaarHeader'
import PageLayout from '../components/PageLayout'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', age: '', bloodGroup: '', referralCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone number are required.')
      return
    }
    if (!form.age || form.age < 1 || form.age > 120) {
      setError('Please enter a valid age.')
      return
    }
    if (!form.bloodGroup) {
      setError('Please select your blood group.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="form-card">
        <IsaarHeader />
        <div className="divider" />

        <div className="form-section-title">
          <span className="section-badge">Step 1 of 1</span>
          <h2>Create Your Account</h2>
          <p>Join the campaign and start earning stars ★</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Full Name <span className="required">*</span></label>
            <input id="name" name="name" type="text" placeholder="Enter your full name"
              value={form.name} onChange={handleChange} autoComplete="name" />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone Number <span className="required">*</span></label>
            <input id="phone" name="phone" type="tel" placeholder="e.g. 03001234567"
              value={form.phone} onChange={handleChange} autoComplete="tel" />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="age">Age <span className="required">*</span></label>
              <input id="age" name="age" type="number" placeholder="e.g. 25"
                min="1" max="120" value={form.age} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="bloodGroup">Blood Group <span className="required">*</span></label>
              <select id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                className={!form.bloodGroup ? 'select-placeholder' : ''}>
                <option value="" disabled>Select</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="referralCode">Referral Code <span className="optional">(optional)</span></label>
            <input id="referralCode" name="referralCode" type="text"
              placeholder="Enter a friend's referral code"
              value={form.referralCode} onChange={handleChange}
              style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} />
            <p className="field-hint">★ Use a friend's code — they earn 20 bonus points!</p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registering...' : '🩸 Register & Earn 10 Stars'}
          </button>
        </form>

        <p className="form-footer">
          Already registered? <Link to="/login">View your stars →</Link>
        </p>
      </div>
    </PageLayout>
  )
}
