import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const BookingDetailSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    bookingId: { type: String, ref: 'Booking', required: true },
    carType: { type: String, ref: 'CarType', required: true },
    date: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupTime: { type: String, required: true },
    dropoffTime: { type: String, required: true },
    price: { type: Number },
  },
  { timestamps: true, versionKey: false }
)

BookingDetailSchema.virtual('id').get(function () { return this._id })

BookingDetailSchema.virtual('booking', {
  ref: 'Booking',
  localField: 'bookingId',
  foreignField: '_id',
  justOne: true,
})
BookingDetailSchema.virtual('car', {
  ref: 'CarType',
  localField: 'carType',
  foreignField: '_id',
  justOne: true,
})
BookingDetailSchema.virtual('schedule', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'bookingDetailId',
  justOne: true,
})

BookingDetailSchema.set('toObject', { virtuals: true })
BookingDetailSchema.set('toJSON', { virtuals: true })

export default registerModel('BookingDetail', BookingDetailSchema)
