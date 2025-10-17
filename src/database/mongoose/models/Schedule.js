import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const ScheduleSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    carId: { type: String, ref: 'Car', required: true },
    bookingDetailId: { type: String, ref: 'BookingDetail', required: true },
    customerId: { type: String, ref: 'Customer' },
    driverId: { type: String, ref: 'User' },
    status: { type: String, enum: ['created', 'started', 'stopped', 'completed'], default: 'created' },
    createdBy: { type: String, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
)

ScheduleSchema.virtual('id').get(function () { return this._id })

ScheduleSchema.virtual('user', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
})
ScheduleSchema.virtual('customer', {
  ref: 'Customer',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
})
ScheduleSchema.virtual('bookingDetail', {
  ref: 'BookingDetail',
  localField: 'bookingDetailId',
  foreignField: '_id',
  justOne: true,
})
ScheduleSchema.virtual('car', {
  ref: 'Car',
  localField: 'carId',
  foreignField: '_id',
  justOne: true,
})
ScheduleSchema.virtual('driver', {
  ref: 'User',
  localField: 'driverId',
  foreignField: '_id',
  justOne: true,
})

ScheduleSchema.set('toObject', { virtuals: true })
ScheduleSchema.set('toJSON', { virtuals: true })

export default registerModel('Schedule', ScheduleSchema)
