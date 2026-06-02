import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// GET /api/user/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({
      name: user.name,
      phone: user.phone,
      age: user.age,
      bloodGroup: user.bloodGroup,
      points: user.points,
      referralCode: user.referralCode,
      usedReferralCode: user.usedReferralCode,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
