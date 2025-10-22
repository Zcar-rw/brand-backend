import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const CustomerSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    userId: { type: String, ref: 'User' },
    companyId: { type: String, ref: 'Company' },
    type: { type: String, enum: ['company', 'individual', 'agent', 'other'], required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true, versionKey: false }
)

CustomerSchema.virtual('id').get(function () { return this._id })

CustomerSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
})

CustomerSchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true,
})

CustomerSchema.set('toObject', { virtuals: true })
CustomerSchema.set('toJSON', { virtuals: true })

export default registerModel('Customer', CustomerSchema)
