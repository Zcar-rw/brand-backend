import mongoose from '../../mongo'
import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const UserSchema = new Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String },
    photo: { type: String },
    password: { type: String, required: true },
    // Classify car owners as individual or company
    ownerType: { type: String, enum: ['individual', 'company'], default: 'individual' },
    status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
    roleId: { type: String, ref: 'Role', required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
)

UserSchema.virtual('id').get(function () { return this._id })

// Virtuals to mirror Sequelize associations
UserSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
})

UserSchema.virtual('companies', {
  ref: 'Company',
  localField: '_id',
  foreignField: 'ownerId',
  justOne: false,
})

UserSchema.set('toObject', { virtuals: true })
UserSchema.set('toJSON', { virtuals: true })

export default registerModel('User', UserSchema)
