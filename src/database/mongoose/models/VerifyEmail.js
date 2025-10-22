import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const VerifyEmailSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    email: { type: String, required: true, index: true },
    code: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
)

VerifyEmailSchema.virtual('id').get(function () { return this._id })

VerifyEmailSchema.set('toObject', { virtuals: true })
VerifyEmailSchema.set('toJSON', { virtuals: true })

export default registerModel('VerifyEmail', VerifyEmailSchema)
