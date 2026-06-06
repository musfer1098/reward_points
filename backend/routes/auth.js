import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

function generateReferralCode(length = 7) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

async function uniqueReferralCode() {
  let code, exists
  do {
    code = generateReferralCode()
    exists = await User.findOne({ referralCode: code })
  } while (exists)
  return code
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, age, bloodGroup, location, referralCode } = req.body

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: 'Name and phone are required' })
    }
    if (!age || isNaN(age) || age < 1 || age > 120) {
      return res.status(400).json({ message: 'A valid age is required' })
    }
    if (!bloodGroup?.trim()) {
      return res.status(400).json({ message: 'Blood group is required' })
    }

    const existing = await User.findOne({ phone: phone.trim() })
    if (existing) {
      return res.status(409).json({ message: 'Phone number already registered' })
    }

    let referrer = null
    if (referralCode?.trim()) {
      referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() })
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' })
      }
    }

    const newCode = await uniqueReferralCode()

    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      age: Number(age),
      bloodGroup: bloodGroup.trim(),
      points: 10,
      referralCode: newCode,
      location: location?.trim() || '',
      usedReferralCode: referrer ? referralCode.trim().toUpperCase() : '',
    })

    if (referrer) {
      referrer.points += 20
      await referrer.save()
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.status(201).json({
      token,
      user: {
        name: user.name,
        phone: user.phone,
        age: user.age,
        bloodGroup: user.bloodGroup,
        points: user.points,
        referralCode: user.referralCode,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body
    if (!phone?.trim()) {
      return res.status(400).json({ message: 'Phone number is required' })
    }

    const user = await User.findOne({ phone: phone.trim() })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this phone number' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.json({
      token,
      user: {
        name: user.name,
        phone: user.phone,
        age: user.age,
        bloodGroup: user.bloodGroup,
        points: user.points,
        referralCode: user.referralCode,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
