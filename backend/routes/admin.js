import express from 'express'
import User from '../models/User.js'

const router = express.Router()

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// POST /api/admin/users — returns all users if password matches
router.post('/users', async (req, res) => {
  const { password } = req.body
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid password' })
  }

  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('name phone bloodGroup location points createdAt -_id')

    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
