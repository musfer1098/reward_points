import API_BASE from '../config.js'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import IsaarHeader from '../components/IsaarHeader'
import PageLayout from '../components/PageLayout'

export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!phone.trim()) {
      setError('Please enter your phone number.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
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
          <h2>View Your Stars ★</h2>
          <p>Enter your phone number to see your campaign progress</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="phone">Registered Phone Number</label>
            <input id="phone" name="phone" type="tel"
              placeholder="e.g. 03001234567"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError('') }}
              autoComplete="tel" autoFocus />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Looking up...' : '★ View My Stars'}
          </button>
        </form>

        <p className="form-footer">
          Not registered yet? <Link to="/register">Join the campaign →</Link>
        </p>
      </div>
    </PageLayout>
  )
}
