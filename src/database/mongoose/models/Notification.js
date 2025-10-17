import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const NotificationSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    message: { type: String, required: true },
    receiverId: { type: String, ref: 'User' },
    type: { type: String, enum: ['account','car','booking','payment','inquiry','invite','subscribe','misc'], default: 'misc' },
  },
  { timestamps: true, versionKey: false }
)

NotificationSchema.virtual('id').get(function () { return this._id })

NotificationSchema.virtual('receiver', {
  ref: 'User',
  localField: 'receiverId',
  foreignField: '_id',
  justOne: true,
})

NotificationSchema.set('toObject', { virtuals: true })
NotificationSchema.set('toJSON', { virtuals: true })

export default registerModel('Notification', NotificationSchema)
