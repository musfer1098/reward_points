import API_BASE from '../config.js'
import { useState, useMemo } from 'react'

export default function AdminPanel() {
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [locationFilter, setLocationFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  async function handleUnlock(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Access denied')
      } else {
        setUsers(data)
      }
    } catch {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const locations = useMemo(() => {
    if (!users) return []
    return [...new Set(users.map((u) => u.location).filter(Boolean))].sort()
  }, [users])

  const filtered = useMemo(() => {
    if (!users) return []
    return users.filter((u) => {
      if (locationFilter && u.location !== locationFilter) return false
      if (dateFrom || dateTo) {
        const created = u.createdAt ? new Date(u.createdAt) : null
        if (!created) return false
        if (dateFrom && created < new Date(dateFrom)) return false
        if (dateTo) {
          const end = new Date(dateTo)
          end.setHours(23, 59, 59, 999)
          if (created > end) return false
        }
      }
      return true
    })
  }, [users, locationFilter, dateFrom, dateTo])

  function clearFilters() {
    setLocationFilter('')
    setDateFrom('')
    setDateTo('')
  }

  const isFiltered = locationFilter || dateFrom || dateTo

  if (!users) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>Admin Access</h2>
          <form onSubmit={handleUnlock} style={styles.form}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoFocus
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Checking...' : 'Unlock'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.tableWrapper}>
        <div style={styles.tableHeader}>
          <h2 style={styles.title}>Registered Users</h2>
          <span style={styles.count}>
            {filtered.length}{isFiltered ? ` of ${users.length}` : ''} users
          </span>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <div style={styles.dateGroup}>
            <label style={styles.dateLabel}>From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          <div style={styles.dateGroup}>
            <label style={styles.dateLabel}>To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          {isFiltered && (
            <button onClick={clearFilters} style={styles.clearBtn}>
              Clear
            </button>
          )}
        </div>

        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Blood Group</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Points</th>
                <th style={styles.th}>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: '#666', padding: '32px' }}>
                    No users match the selected filters
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.phone}</td>
                    <td style={{ ...styles.td, ...styles.badge }}>{u.bloodGroup}</td>
                    <td style={styles.td}>{u.location || '—'}</td>
                    <td style={{ ...styles.td, ...styles.points }}>{u.points}</td>
                    <td style={styles.td}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-PK') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '40px 16px',
  },
  card: {
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '12px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '360px',
    marginTop: '80px',
  },
  title: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '0',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    background: '#1e1e2e',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '15px',
    padding: '12px 14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    background: '#c0392b',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    padding: '12px',
    marginTop: '4px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '13px',
    margin: 0,
    textAlign: 'center',
  },
  tableWrapper: {
    width: '100%',
    maxWidth: '1100px',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  count: {
    color: '#888',
    fontSize: '13px',
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '16px',
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  select: {
    background: '#1e1e2e',
    border: '1px solid #3a3a4a',
    borderRadius: '7px',
    color: '#ddd',
    fontSize: '13px',
    padding: '8px 12px',
    cursor: 'pointer',
    outline: 'none',
  },
  dateGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dateLabel: {
    color: '#888',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  dateInput: {
    background: '#1e1e2e',
    border: '1px solid #3a3a4a',
    borderRadius: '7px',
    color: '#ddd',
    fontSize: '13px',
    padding: '8px 10px',
    outline: 'none',
    colorScheme: 'dark',
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid #4a4a5a',
    borderRadius: '7px',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '8px 14px',
    marginLeft: 'auto',
  },
  tableScroll: {
    overflowX: 'auto',
    borderRadius: '10px',
    border: '1px solid #2a2a3a',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    background: '#1a1a2a',
    color: '#aaa',
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '12px 16px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    color: '#ddd',
    borderTop: '1px solid #1e1e2e',
    verticalAlign: 'middle',
  },
  rowEven: {
    background: '#0e0e18',
  },
  rowOdd: {
    background: '#12121c',
  },
  badge: {
    color: '#e74c3c',
    fontWeight: '700',
  },
  points: {
    color: '#f0c040',
    fontWeight: '600',
  },
}
