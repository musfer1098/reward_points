import { useEffect, useState } from 'react'

const DEADLINE = new Date('2026-06-15T00:00:00').getTime()

function getTimeLeft() {
  const diff = DEADLINE - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return (
    <div className="countdown-ended">🎉 Campaign has ended!</div>
  )

  const units = [
    { label: 'Days',  value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Mins',  value: time.minutes },
    { label: 'Secs',  value: time.seconds },
  ]

  return (
    <div className="countdown">
      <p className="countdown-title">⏳ Campaign Ends In</p>
      <div className="countdown-grid">
        {units.map(({ label, value }) => (
          <div key={label} className="countdown-unit">
            <span className="countdown-value">{String(value).padStart(2, '0')}</span>
            <span className="countdown-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
