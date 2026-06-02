import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import leaderboardRoutes from './routes/leaderboard.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// Connect to MongoDB once (reused across serverless invocations)
let isConnected = false
async function connectDB() {
  if (isConnected) return
  await mongoose.connect(process.env.MONGO_URI)
  isConnected = true
}

connectDB().catch(console.error)

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

export default app
