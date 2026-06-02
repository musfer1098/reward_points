// Strip trailing slash in case VITE_API_URL was set with one
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export default API_BASE
