import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const DiscountTierSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    carId: { type: String, ref: 'Car', required: true },
    minDays: { type: Number, required: true },
    maxDays: { type: Number }, // null means unlimited
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true, versionKey: false }
)

DiscountTierSchema.virtual('id').get(function () { return this._id })

DiscountTierSchema.virtual('car', {
  ref: 'Car',
  localField: 'carId',
  foreignField: '_id',
  justOne: true,
})

DiscountTierSchema.set('toObject', { virtuals: true })
DiscountTierSchema.set('toJSON', { virtuals: true })

// Index for efficient queries
DiscountTierSchema.index({ carId: 1, minDays: 1 })

export default registerModel('DiscountTier', DiscountTierSchema)
