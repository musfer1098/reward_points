import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  phone:          { type: String, required: true, unique: true, trim: true },
  age:            { type: Number, required: true },
  bloodGroup:     { type: String, required: true, trim: true },
  points:         { type: Number, default: 10 },
  referralCode:   { type: String, unique: true },
  location:         { type: String, default: '' },
  usedReferralCode: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
