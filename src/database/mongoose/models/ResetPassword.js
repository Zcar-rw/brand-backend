import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const ResetPasswordSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    email: { type: String, required: true, index: true },
    code: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
)

ResetPasswordSchema.virtual('id').get(function () { return this._id })

ResetPasswordSchema.set('toObject', { virtuals: true })
ResetPasswordSchema.set('toJSON', { virtuals: true })

export default registerModel('ResetPassword', ResetPasswordSchema)
