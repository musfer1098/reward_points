import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// GET /api/leaderboard — public, top 10 by points
router.get('/', async (req, res) => {
  try {
    const top10 = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select('name points -_id')

    res.json(top10)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
