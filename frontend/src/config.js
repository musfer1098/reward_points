// In dev, Vite proxy handles /api → localhost:5000
// In production, set VITE_API_URL to your Vercel backend URL
const API_BASE = import.meta.env.VITE_API_URL || ''

export default API_BASE
