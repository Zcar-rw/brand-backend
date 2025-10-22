import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const OwnerSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
  // Linking to a user is optional; owners can exist independently
  userId: { type: String, ref: 'User' },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    type: { type: String, enum: ['individual', 'company'], required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
)

OwnerSchema.virtual('id').get(function () { return this._id })

OwnerSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
})

OwnerSchema.virtual('cars', {
  ref: 'Car',
  localField: '_id',
  foreignField: 'ownerId',
  justOne: false,
})

OwnerSchema.set('toObject', { virtuals: true })
OwnerSchema.set('toJSON', { virtuals: true })

export default registerModel('Owner', OwnerSchema)
